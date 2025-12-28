import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

export class NotionService {
    /**
     * Create a new order entry in Notion database
     */
    static async createOrder(orderData: any) {
        try {
            console.log('Syncing order to Notion:', orderData.id);

            await notion.pages.create({
                parent: {
                    database_id: DATABASE_ID,
                },
                properties: {
                    // Order ID as title
                    'Order ID': {
                        title: [
                            {
                                text: {
                                    content: orderData.id || 'N/A',
                                },
                            },
                        ],
                    },

                    // Customer Name
                    'Customer Name': {
                        rich_text: [
                            {
                                text: {
                                    content: orderData.customer_name || 'N/A',
                                },
                            },
                        ],
                    },

                    // Customer Email
                    'Customer Email': {
                        email: orderData.customer_email || null,
                    },

                    // Customer Phone
                    'Customer Phone': {
                        phone_number: orderData.customer_phone || null,
                    },

                    // Total Amount
                    'Total Amount': {
                        number: orderData.total_amount || 0,
                    },

                    // Payment Method
                    'Payment Method': {
                        select: {
                            name: orderData.payment_method || 'COD',
                        },
                    },

                    // Status
                    'Status': {
                        select: {
                            name: orderData.status || 'pending',
                        },
                    },

                    // Razorpay Payment ID (if online payment)
                    'Razorpay Payment ID': {
                        rich_text: [
                            {
                                text: {
                                    content: orderData.razorpay_payment_id || 'N/A',
                                },
                            },
                        ],
                    },

                    // Razorpay Order ID (if online payment) - Removed as it does not exist in Notion DB
                    /*
                    'Razorpay Order ID': {
                        rich_text: [
                            {
                                text: {
                                    content: orderData.razorpay_order_id || 'N/A',
                                },
                            },
                        ],
                    }, 
                    */

                    // Created At
                    'Created At': {
                        date: {
                            start: orderData.created_at || new Date().toISOString(),
                        },
                    },
                },
            });

            console.log('✅ Order synced to Notion successfully!');
            return { success: true };
        } catch (error: any) {
            console.error('❌ Failed to sync order to Notion:', error.message);
            console.error('Error details:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Retrieve an order by ID
     */
    static async getOrder(orderId: string) {
        try {
            // Cast to any because the type definition seems to be missing 'query' in this version
            const response = await (notion.databases as any).query({
                database_id: DATABASE_ID,
                filter: {
                    property: 'Order ID',
                    title: {
                        equals: orderId,
                    },
                },
            });

            return response.results[0] || null;
        } catch (error: any) {
            console.error('❌ Failed to fetch order from Notion:', error.message);
            return null;
        }
    }
}
