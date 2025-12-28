import { supabase } from '@/utils/supabse/server';

export interface StockInfo {
    productId: string;
    totalStock: number;
    reservedStock: number;
    availableStock: number;
    isInStock: boolean;
}

export class InventoryService {
    /**
     * Get available stock for a product
     * Available Stock = Total Stock - Reserved Stock (items in pending/processing orders)
     */
    static async getAvailableStock(productId: string): Promise<StockInfo> {
        try {
            // Get product's total stock (using 'inventory' column as per schema)
            const { data: product, error: productError } = await supabase
                .from('products')
                .select('inventory')
                .eq('id', productId)
                .single();

            if (productError || !product) {
                console.error('Error fetching product inventory:', productError);
                return {
                    productId,
                    totalStock: 0,
                    reservedStock: 0,
                    availableStock: 0,
                    isInStock: false,
                };
            }

            // Calculate reserved stock from orders with JSONB items
            // Orders with status: pending, processing, confirmed (not cancelled, delivered, or failed)
            const { data: orders, error: orderError } = await supabase
                .from('orders')
                .select('items')
                .in('status', ['pending', 'confirmed', 'processing']);

            if (orderError) {
                console.error('Error fetching orders:', orderError);
            }

            // Sum up reserved quantities for this specific product from JSONB items
            let reservedStock = 0;
            if (orders && orders.length > 0) {
                orders.forEach(order => {
                    if (order.items && Array.isArray(order.items)) {
                        order.items.forEach((item: any) => {
                            if (item.product_id === productId) {
                                reservedStock += item.quantity || 0;
                            }
                        });
                    }
                });
            }

            const availableStock = Math.max(0, product.inventory - reservedStock);

            return {
                productId,
                totalStock: product.inventory,
                reservedStock,
                availableStock,
                isInStock: availableStock > 0,
            };
        } catch (error) {
            console.error('Error in getAvailableStock:', error);
            return {
                productId,
                totalStock: 0,
                reservedStock: 0,
                availableStock: 0,
                isInStock: false,
            };
        }
    }

    /**
     * Check if a product has enough stock for a given quantity
     */
    static async checkStockAvailability(
        productId: string,
        requestedQuantity: number
    ): Promise<{ available: boolean; maxQuantity: number }> {
        const stockInfo = await this.getAvailableStock(productId);

        return {
            available: stockInfo.availableStock >= requestedQuantity,
            maxQuantity: stockInfo.availableStock,
        };
    }

    /**
     * Reserve stock when order is placed (called from checkout)
     * This doesn't actually change the stock number, but creates an order
     * which will be counted in reserved stock calculations
     */
    static async reserveStock(productId: string, quantity: number): Promise<boolean> {
        const stockCheck = await this.checkStockAvailability(productId, quantity);

        if (!stockCheck.available) {
            console.error(`Insufficient stock for product ${productId}. Requested: ${quantity}, Available: ${stockCheck.maxQuantity}`);
            return false;
        }

        return true;
    }

    /**
     * Update actual stock quantity (for admin use)
     */
    static async updateStock(productId: string, newStock: number): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('products')
                .update({ inventory: newStock })
                .eq('id', productId);

            if (error) {
                console.error('Error updating inventory:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error in updateStock:', error);
            return false;
        }
    }

    /**
     * Decrease stock when order is delivered (called from admin)
     */
    static async decreaseStock(productId: string, quantity: number): Promise<boolean> {
        try {
            // Get current inventory
            const { data: product } = await supabase
                .from('products')
                .select('inventory')
                .eq('id', productId)
                .single();

            if (!product) return false;

            const newStock = Math.max(0, product.inventory - quantity);

            return await this.updateStock(productId, newStock);
        } catch (error) {
            console.error('Error in decreaseStock:', error);
            return false;
        }
    }

    /**
     * Release reserved stock when order is cancelled
     * (Stock number doesn't change, but order status changes so it's no longer counted as reserved)
     */
    static async releaseStock(orderId: string): Promise<boolean> {
        try {
            // Just update order status to cancelled
            // The reserved stock calculation will automatically exclude cancelled orders
            const { error } = await supabase
                .from('orders')
                .update({ status: 'cancelled' })
                .eq('id', orderId);

            if (error) {
                console.error('Error releasing stock:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error in releaseStock:', error);
            return false;
        }
    }
}
