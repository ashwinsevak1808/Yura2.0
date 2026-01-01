import { OrderData } from "@/types";
import nodemailer from "nodemailer";
import { EmailTemplate, generateOrderItemRow } from "./email-template";

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

            const itemsHtml = orderData.items.map((item) =>
                generateOrderItemRow(
                    item.name,
                    `${item.selectedColor} / ${item.selectedSize}`,
                    `₹${(item.price * item.quantity).toLocaleString('en-IN')}`
                )
            ).join('');

            const subtotal = orderData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const shippingCost = orderData.totalAmount < 2000 ? 100 : 0;
            const total = orderData.totalAmount;

            const trackingLink = `${process.env.NEXT_PUBLIC_SITE_URL}/order/status/${orderId}`;

            const replacements = {
                '{{orderId}}': orderId.slice(0, 8).toUpperCase(),
                '{{date}}': new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                '{{items}}': itemsHtml,
                '{{subtotal}}': `₹${subtotal.toLocaleString('en-IN')}`,
                '{{shippingCost}}': shippingCost === 0 ? 'Free' : `₹${shippingCost}`,
                '{{total}}': `₹${total.toLocaleString('en-IN')}`,
                '{{customerName}}': orderData.customerName,
                '{{trackingLink}}': trackingLink
            };

            const htmlContent = EmailTemplate.getTemplate('order-confirmed.html', replacements);

            const mailOptions = {
                from: '"YURAA" <info.yura.co@gmail.com>',
                to: orderData.customerEmail,
                subject: `Order Confirmation — #${orderId.slice(0, 8).toUpperCase()}`,
                html: htmlContent,
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
    },

    sendOrderStatusUpdate: async (orderId: string, orderData: any, status: string) => {
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

            // Determine template based on status
            let templateName = 'delivery-update.html'; // Default / Delivered
            if (status === 'shipped') templateName = 'order-shipped.html';
            if (status === 'cancelled') templateName = 'order-cancelled.html';

            // Build items HTML
            // Build items HTML
            // Note: orderData.items structure might vary depending on caller, assuming standard OrderData structure
            const items = orderData.items || [];
            const itemsHtml = items.map((item: any) =>
                generateOrderItemRow(
                    item.name || item.product_name || "Product",
                    `${item.selectedColor || item.color || ""} / ${item.selectedSize || item.size || ""}`,
                    `₹${(item.price * item.quantity).toLocaleString('en-IN')}`
                )
            ).join('');

            const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
            const total = orderData.total_amount || orderData.totalAmount || 0;
            const shippingCost = total - subtotal;
            const customerName = orderData.customer_name || orderData.customerName || "Customer";

            const replacements = {
                '{{orderId}}': orderId.slice(0, 8).toUpperCase(),
                '{{date}}': new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                '{{items}}': itemsHtml,
                '{{subtotal}}': `₹${subtotal.toLocaleString('en-IN')}`,
                '{{shippingCost}}': shippingCost <= 0 ? 'Free' : `₹${shippingCost}`,
                '{{total}}': `₹${total.toLocaleString('en-IN')}`,
                '{{customerName}}': customerName
            };

            const htmlContent = EmailTemplate.getTemplate(templateName, replacements);

            const subject = `Order Update #${orderId.slice(0, 8).toUpperCase()}: ${status.charAt(0).toUpperCase() + status.slice(1)}`;

            const mailOptions = {
                from: '"YURAA" <info.yura.co@gmail.com>',
                to: orderData.customerEmail || orderData.customer_email,
                subject,
                html: htmlContent,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Status Email Sent Successfully to ${orderData.customerEmail || orderData.customer_email} for Order ${orderId}`);
            return true;
        } catch (error) {
            console.error("Error sending status email:", error);
            return false;
        }
    },

    sendWelcomeEmail: async (email: string, name: string) => {
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

            // welcome.html doesn't have many placeholders, maybe just name?
            // Actually my welcome.html doesn't have {{name}}. It says "Welcome to the world of Yura."
            // I'll leave replacements empty or just action_url if needed.
            // The template has static link https://shop-yura.com.
            const replacements = {};

            const htmlContent = EmailTemplate.getTemplate('welcome.html', replacements);

            const mailOptions = {
                from: '"YURAA" <info.yura.co@gmail.com>',
                to: email,
                subject: 'Welcome to Yura',
                html: htmlContent,
            };

            await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error("Error sending welcome email:", error);
            return false;
        }
    },

    sendPasswordResetLink: async (email: string, resetLink: string) => {
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

            const replacements = {
                '{{reset_link}}': resetLink
            };

            const htmlContent = EmailTemplate.getTemplate('forgot-password.html', replacements);

            const mailOptions = {
                from: '"YURAA" <info.yura.co@gmail.com>',
                to: email,
                subject: 'Reset Your Password',
                html: htmlContent,
            };

            await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error("Error sending password reset email:", error);
            return false;
        }
    },

    sendOtp: async (email: string, otp: string) => {
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

            const replacements = {
                '{{otp}}': otp,
                '{{year}}': new Date().getFullYear().toString()
            };

            const htmlContent = EmailTemplate.getTemplate('otp-verify.html', replacements);

            const mailOptions = {
                from: '"YURAA Verification" <info.yura.co@gmail.com>',
                to: email,
                subject: 'Your Verification Code',
                html: htmlContent,
            };

            await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error("Error sending OTP email:", error);
            return false;
        }
    }
};
