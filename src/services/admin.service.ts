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
        // This logic has moved to the server action: updateOrderStatusAction
        // DO NOT implement client-side email sending here.
        const { error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", orderId);

        if (error) throw error;
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
            // Prepare base product data
            const baseProductData = {
                name: productData.name,
                slug: productData.slug,
                description: productData.description,
                full_description: productData.full_description,
                price: productData.price,
                original_price: productData.original_price,
                inventory: productData.stock,
                category: productData.category,
                is_active: productData.is_active,
            };

            // Try to add SEO metadata if fields exist
            const productDataWithSEO = {
                ...baseProductData,
                meta_title: productData.meta_title || null,
                meta_description: productData.meta_description || null,
                meta_keywords: productData.meta_keywords || null,
                og_image: productData.og_image || null,
                og_title: productData.og_title || null,
                og_description: productData.og_description || null,
                twitter_card: productData.twitter_card || 'summary_large_image',
                twitter_title: productData.twitter_title || null,
                twitter_description: productData.twitter_description || null,
                twitter_image: productData.twitter_image || null,
            };

            // 1. Insert product (try with SEO first, fallback to without)
            let product, productError;

            const result1 = await supabase
                .from("products")
                .insert(productDataWithSEO)
                .select()
                .single();

            product = result1.data;
            productError = result1.error;

            // If error is about missing columns, try without SEO fields
            if (productError && productError.message?.includes('column')) {
                console.log('SEO columns not found, creating product without SEO metadata...');
                const result2 = await supabase
                    .from("products")
                    .insert(baseProductData)
                    .select()
                    .single();

                product = result2.data;
                productError = result2.error;
            }

            if (productError) {
                console.error('Product insert error:', productError);
                throw productError;
            }

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
                if (imagesError) {
                    console.error('Images insert error:', imagesError);
                    throw imagesError;
                }
            }

            // 3. Insert Sizes with Stock
            if (productData.sizes && productData.sizes.length > 0) {
                const sizesToInsert = productData.sizes.map((sizeItem: any) => ({
                    product_id: productId,
                    size: sizeItem.size || sizeItem,
                    stock: sizeItem.stock || 0
                }));
                const { error: sizesError } = await supabase
                    .from("product_sizes")
                    .insert(sizesToInsert);
                if (sizesError) {
                    console.error('Sizes insert error:', sizesError);
                    throw sizesError;
                }
            }

            // 4. Insert Colors - REMOVED (Deprecated)

            return { success: true, productId };
        } catch (error: any) {
            console.error("Create product failed:", error);
            console.error("Error details:", {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            throw error;
        }
    },
    async getAllProducts() {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                product_sizes(size, stock),
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
            colors: [],
            images: product.product_images,
            specifications: product.product_specifications
        }));
    },
    async getProductById(id: string) {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                product_sizes(size, stock),
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
            colors: [],
            images: data.product_images,
            specifications: data.product_specifications
        };
    },

    async updateProduct(id: string, productData: any) {
        // 1. Update basic fields and SEO metadata
        const { error: productError } = await supabase
            .from("products")
            .update({
                name: productData.name,
                slug: productData.slug,
                description: productData.description,
                full_description: productData.full_description,
                price: productData.price,
                original_price: productData.original_price,
                inventory: productData.stock,
                category: productData.category,
                is_active: productData.is_active,
                // SEO Metadata
                meta_title: productData.meta_title || null,
                meta_description: productData.meta_description || null,
                meta_keywords: productData.meta_keywords || null,
                og_image: productData.og_image || null,
                og_title: productData.og_title || null,
                og_description: productData.og_description || null,
                twitter_card: productData.twitter_card || 'summary_large_image',
                twitter_title: productData.twitter_title || null,
                twitter_description: productData.twitter_description || null,
                twitter_image: productData.twitter_image || null,
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

        // 3. Sync Sizes (Delete and Re-insert strategy)
        if (productData.sizes) {
            // A. Delete existing sizes
            const { error: deleteError } = await supabase
                .from("product_sizes")
                .delete()
                .eq("product_id", id);

            if (deleteError) {
                console.error("Error clearing old sizes:", deleteError);
                throw deleteError;
            }

            // B. Insert new sizes
            if (productData.sizes.length > 0) {
                const sizesToInsert = productData.sizes.map((sizeItem: any) => ({
                    product_id: id,
                    size: sizeItem.size,
                    stock: sizeItem.stock
                }));

                const { error: insertError } = await supabase
                    .from("product_sizes")
                    .insert(sizesToInsert);

                if (insertError) {
                    console.error("Error inserting new sizes:", insertError);
                    throw insertError;
                }
            }
        }

        return { success: true };
    },
    async getOrderById(id: string) {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching order by id:', error);
            throw error;
        }

        return data;
    },

    async getAccountingStats() {
        const { data: orders, error } = await supabase
            .from("orders")
            .select("id, status, payment_status, total_amount, created_at, payment_method");

        if (error) {
            console.error("Error fetching accounting stats:", error);
            throw new Error("Failed to fetch accounting stats");
        }

        const metrics = {
            totalRevenue: 0,
            potentialRevenue: 0,
            lostRevenue: 0,
            ordersDelivered: 0,
            ordersPending: 0,
            ordersCancelled: 0,
            totalOrders: orders.length,
            codPendingAmount: 0,
        };

        orders.forEach(order => {
            const amount = Number(order.total_amount) || 0;

            // Revenue Calculations
            if (order.payment_status === 'paid') {
                metrics.totalRevenue += amount;
            } else if (order.payment_status === 'pending' && order.status !== 'cancelled') {
                metrics.potentialRevenue += amount;
                if (order.payment_method === 'cod') {
                    metrics.codPendingAmount += amount;
                }
            }

            // Loss Calculation
            if (order.status === 'cancelled' || order.status === 'refunded') {
                metrics.lostRevenue += amount;
                metrics.ordersCancelled++;
            }

            // Delivery Stats
            if (order.status === 'delivered') {
                metrics.ordersDelivered++;
            } else if (order.status !== 'cancelled' && order.status !== 'refunded') {
                metrics.ordersPending++;
            }
        });

        return metrics;
    },
};

