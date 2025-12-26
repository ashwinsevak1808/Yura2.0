import { OrderData } from "@/types";
import nodemailer from "nodemailer";

export const EmailService = {
    sendOrderConfirmation: async (orderId: string, orderData: OrderData) => {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            const mailOptions = {
                from: '"Yura" <info.yura.co@gmail.com>',
                to: orderData.customerEmail,
                subject: `Order Confirmation — #${orderId.slice(0, 8)}`,
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body { margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; }
                            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                            .header { padding: 40px 40px 30px; border-bottom: 1px solid #f0f0f0; }
                            .brand { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #999; margin-bottom: 20px; }
                            .title { font-size: 32px; font-weight: 500; color: #000; margin: 0; line-height: 1.3; }
                            .content { padding: 40px; }
                            .greeting { font-size: 14px; color: #666; font-weight: 300; line-height: 1.6; margin-bottom: 30px; }
                            .order-details { margin: 30px 0; padding: 30px 0; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; }
                            .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
                            .detail-label { color: #999; text-transform: uppercase; font-size: 11px; letter-spacing: 2px; }
                            .detail-value { color: #000; font-weight: 300; }
                            .items-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #000; margin: 30px 0 20px; }
                            .item { padding: 20px 0; border-bottom: 1px solid #f5f5f5; }
                            .item-name { font-size: 16px; color: #000; margin-bottom: 8px; }
                            .item-details { font-size: 12px; color: #999; margin-bottom: 8px; }
                            .item-price { font-size: 14px; color: #000; font-weight: 300; }
                            .total { margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0; }
                            .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                            .total-label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #999; }
                            .total-value { font-size: 24px; color: #000; font-weight: 300; }
                            .footer { padding: 40px; background: #fafafa; text-align: center; }
                            .footer-text { font-size: 12px; color: #999; line-height: 1.6; font-weight: 300; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <div class="brand">YURA</div>
                                <h1 class="title">Order Confirmed</h1>
                            </div>
                            
                            <div class="content">
                                <p class="greeting">
                                    Thank you, ${orderData.customerName}.<br><br>
                                    We've received your order and are preparing it for delivery. You'll receive a shipping confirmation email as soon as your items are on their way.
                                </p>
                                
                                <div class="order-details">
                                    <div class="detail-row">
                                        <span class="detail-label">Order Number</span>
                                        <span class="detail-value">#${orderId.slice(0, 8).toUpperCase()}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Payment Method</span>
                                        <span class="detail-value">${orderData.paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI Payment'}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Delivery</span>
                                        <span class="detail-value">${orderData.shippingAddress.zipCode.startsWith('400') ? 'Mumbai Local (2-3 days)' : 'Standard Shipping (5-7 days)'}</span>
                                    </div>
                                </div>
                                
                                <h2 class="items-title">Order Items</h2>
                                ${orderData.items.map(item => `
                                    <div class="item">
                                        <div class="item-name">${item.name}</div>
                                        <div class="item-details">${item.selectedColor} • Size ${item.selectedSize} • Qty ${item.quantity}</div>
                                        <div class="item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
                                    </div>
                                `).join('')}
                                
                                <div class="total">
                                    <div class="total-row">
                                        <span class="total-label">Total</span>
                                        <span class="total-value">₹${orderData.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="footer">
                                <p class="footer-text">
                                    Questions? Contact us at info.yura.co@gmail.com<br>
                                    Thank you for shopping with Yura.
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
            };

            let attempts = 0;
            const maxAttempts = 3;

            while (attempts < maxAttempts) {
                try {
                    const info = await transporter.sendMail(mailOptions);
                    console.log("Message sent: %s", info.messageId);
                    return true;
                } catch (error) {
                    attempts++;
                    console.error(`Email send attempt ${attempts} failed:`, error);
                    if (attempts >= maxAttempts) throw error;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            return false;
        } catch (error) {
            console.error("Error sending email after retries:", error);
            return false;
        }
    }
};
