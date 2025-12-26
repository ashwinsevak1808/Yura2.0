import { createClient } from "@/utils/supabse/client";

const supabase = createClient();

import { Product, Order } from "@/types";

export const AdminService = {
    async getDashboardStats() {
        const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select("total_amount, created_at");

        const { count: productsCount, error: productsError } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true });

        const { count: ordersCount } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true });

        if (ordersError || productsError) {
            console.error("Error fetching admin stats:", ordersError || productsError);
            throw new Error("Failed to fetch admin stats");
        }

        const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
        const averageOrderValue = ordersCount ? totalRevenue / ordersCount : 0;

        return {
            totalRevenue,
            totalOrders: ordersCount || 0,
            totalProducts: productsCount || 0,
            averageOrderValue,
        };
    },

    async getRecentOrders(limit = 5) {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    async getAllOrders() {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    },

    async updateOrderStatus(orderId: string, status: string) {
        // 1. Get the order details to get user email
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select("customer_email, id")
            .eq("id", orderId)
            .single();

        if (orderError) throw orderError;

        // 2. Update status
        const { error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", orderId);

        if (error) throw error;

        // 3. Send Email Notification
        if (order?.customer_email) {
            try {
                const subject = `Order Update #${order.id.slice(0, 8)}: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
                const statusColor = status === 'delivered' ? '#15803d' : status === 'shipped' ? '#1d4ed8' : '#a16207';
                const statusText = status.charAt(0).toUpperCase() + status.slice(1);

                const html = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Order Status Update</title>
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; padding: 40px 0;">
                            <tr>
                                <td align="center">
                                    <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 0px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                                        <!-- Header -->
                                        <tr>
                                            <td align="center" style="padding: 40px 0 30px 0; border-bottom: 1px solid #f3f4f6;">
                                                <h1 style="margin: 0; font-family: 'Times New Roman', serif; font-size: 32px; letter-spacing: 2px; color: #000000; font-weight: bold;">YURA.</h1>
                                                <p style="margin: 5px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #6b7280;">Premium Ethnic Wear</p>
                                            </td>
                                        </tr>

                                        <!-- Status Badge -->
                                        <tr>
                                            <td align="center" style="padding: 40px 40px 20px 40px;">
                                                <div style="display: inline-block; padding: 8px 16px; background-color: ${status === 'delivered' ? '#dcfce7' : status === 'shipped' ? '#dbeafe' : '#fef9c3'}; border-radius: 4px;">
                                                    <span style="color: ${statusColor}; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                                                        ${statusText}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>

                                        <!-- Main Content -->
                                        <tr>
                                            <td align="center" style="padding: 0 40px 40px 40px;">
                                                <h2 style="margin: 0 0 16px 0; font-size: 24px; color: #111827; font-weight: normal;">Order Update</h2>
                                                <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                                                    Your order <strong style="color: #000000;">#${order.id.slice(0, 8).toUpperCase()}</strong> has been updated.
                                                </p>
                                                
                                                ${status === 'shipped' ? `
                                                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 24px; color: #4b5563;">
                                                        Your package is on its way! We've handed it over to our shipping partner. You can track your shipment using the link below once it becomes active.
                                                    </p>
                                                ` : status === 'delivered' ? `
                                                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 24px; color: #4b5563;">
                                                        Your package has been delivered. We hope you love your new purchase! If you have any feedback, we'd love to hear from you.
                                                    </p>
                                                ` : `
                                                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 24px; color: #4b5563;">
                                                        We are processing your order with care. We will notify you as soon as it is shipped.
                                                    </p>
                                                `}

                                                <!-- Button -->
                                                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yura.co.in'}/order/track?id=${order.id}" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 0px;">
                                                    View Order Details
                                                </a>
                                            </td>
                                        </tr>

                                        <!-- Divider -->
                                        <tr>
                                            <td style="padding: 0 40px;">
                                                <div style="height: 1px; background-color: #f3f4f6; width: 100%;"></div>
                                            </td>
                                        </tr>

                                        <!-- Footer -->
                                        <tr>
                                            <td align="center" style="padding: 30px 40px; background-color: #ffffff;">
                                                <p style="margin: 0 0 10px 0; font-family: 'Times New Roman', serif; font-size: 14px; color: #000000;">YURA.</p>
                                                <p style="margin: 0 0 0 0; font-size: 12px; line-height: 20px; color: #9ca3af;">
                                                    123 Fashion Street, Mumbai, India<br>
                                                    Questions? Reply to this email.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Unsub -->
                                    <p style="margin-top: 20px; font-size: 11px; color: #9ca3af; text-align: center;">
                                        &copy; ${new Date().getFullYear()} YURA. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                `;

                await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: order.customer_email,
                        subject,
                        html
                    })
                });
            } catch (err) {
                console.error("Failed to send status email", err);
                // Don't block the UI for email failure
            }
        }
    },

    async deleteProduct(id: string) {
        try {
            // 1. Delete relations manually (to handle databases without Cascade Delete)
            await supabase.from('product_sizes').delete().eq('product_id', id);
            await supabase.from('product_colors').delete().eq('product_id', id);
            await supabase.from('product_images').delete().eq('product_id', id);
            await supabase.from('product_specifications').delete().eq('product_id', id);

            // 2. Delete the product
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) {
                // Check for foreign key violation (e.g., product exists in orders)
                if (error.code === '23503') {
                    throw new Error("Cannot delete this product because it is part of existing customer orders. Please set it to 'Draft' status instead to hide it.");
                }
                throw error;
            }
            return { success: true };
        } catch (error: any) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    async uploadProductImage(file: File) {
        const fileName = `${Date.now()}-${file.name}`;
        let { data, error } = await supabase.storage
            .from("products")
            .upload(fileName, file);

        if (error) {
            // Check if bucket doesn't exist
            if (error.message.includes("Bucket not found") || (error as any).error === "Bucket not found") {
                console.log("Bucket 'products' not found. Attempting to create...");

                // Try to create the bucket
                const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('products', {
                    public: true
                });

                if (bucketError) {
                    console.error("Failed to auto-create bucket:", bucketError);
                    throw new Error("Storage bucket 'products' not found. Please create a public bucket named 'products' in your Supabase dashboard.");
                }

                // Retry upload
                const retry = await supabase.storage.from("products").upload(fileName, file);
                if (retry.error) throw retry.error;
                data = retry.data;
            } else {
                throw error;
            }
        }

        const { data: { publicUrl } } = supabase.storage
            .from("products")
            .getPublicUrl(fileName);

        return publicUrl;
    },

    async createProduct(productData: any) {
        try {
            // 1. Insert product
            const { data: product, error: productError } = await supabase
                .from("products")
                .insert({
                    name: productData.name,
                    slug: productData.slug,
                    description: productData.description,
                    full_description: productData.full_description,
                    price: productData.price,
                    original_price: productData.original_price,
                    stock: productData.stock,
                    category: productData.category,
                    is_active: productData.is_active
                })
                .select()
                .single();

            if (productError) throw productError;
            const productId = product.id;

            // 2. Insert Images
            if (productData.images && productData.images.length > 0) {
                const imagesToInsert = productData.images.map((img: any) => ({
                    product_id: productId,
                    image_url: img.image_url,
                    is_primary: img.is_primary
                }));
                const { error: imagesError } = await supabase
                    .from("product_images")
                    .insert(imagesToInsert);
                if (imagesError) throw imagesError;
            }

            // 3. Insert Sizes
            if (productData.sizes && productData.sizes.length > 0) {
                const sizesToInsert = productData.sizes.map((size: string) => ({
                    product_id: productId,
                    size: size
                }));
                const { error: sizesError } = await supabase
                    .from("product_sizes")
                    .insert(sizesToInsert);
                if (sizesError) throw sizesError;
            }

            // 4. Insert Colors
            if (productData.colors && productData.colors.length > 0) {
                const colorsToInsert = productData.colors.map((color: any) => ({
                    product_id: productId,
                    color_name: color.name,
                    color_hex: color.hex,
                    in_stock: true
                }));
                const { error: colorsError } = await supabase
                    .from("product_colors")
                    .insert(colorsToInsert);
                if (colorsError) throw colorsError;
            }

            return { success: true, productId };
        } catch (error) {
            console.error("Create product failed:", error);
            throw error;
        }
    },
    async getAllProducts() {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                product_sizes(size),
                product_colors(color_name, color_hex, in_stock),
                product_images(image_url, is_primary),
                product_specifications(spec_name, spec_value)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching admin products:', error);
            throw new Error('Failed to fetch admin products');
        }

        return data.map((product: any) => ({
            ...product,
            sizes: product.product_sizes,
            colors: product.product_colors,
            images: product.product_images,
            specifications: product.product_specifications
        }));
    },
    async getProductById(id: string) {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                product_sizes(size),
                product_colors(color_name, color_hex, in_stock),
                product_images(id, image_url, is_primary),
                product_specifications(spec_name, spec_value)
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching product by id:', error);
            throw error;
        }

        return {
            ...data,
            sizes: data.product_sizes,
            colors: data.product_colors,
            images: data.product_images,
            specifications: data.product_specifications
        };
    },

    async updateProduct(id: string, productData: any) {
        // 1. Update basic fields
        const { error: productError } = await supabase
            .from("products")
            .update({
                name: productData.name,
                slug: productData.slug,
                description: productData.description,
                full_description: productData.full_description,
                price: productData.price,
                original_price: productData.original_price,
                stock: productData.stock,
                category: productData.category,
                is_active: productData.is_active
            })
            .eq('id', id);

        if (productError) throw productError;

        // 2. Insert New Images if any
        if (productData.newImages && productData.newImages.length > 0) {
            const imagesToInsert = productData.newImages.map((img: any) => ({
                product_id: id,
                image_url: img.image_url,
                is_primary: img.is_primary
            }));
            const { error: imagesError } = await supabase
                .from("product_images")
                .insert(imagesToInsert);
            if (imagesError) throw imagesError;
        }

        // Ideally we would sync sizes/colors too, but that requires diffing or delete-reinsert
        // leaving strictly as product update for now per requirements

        return { success: true };
    },
    async getOrderById(id: string) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    product:products (
                        name,
                        price,
                        slug,
                        product_images (image_url, is_primary)
                    )
                )
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching order by id:', error);
            throw error;
        }

        return data;
    },
};

