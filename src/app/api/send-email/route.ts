import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { to, subject, html } = await request.json();

        // 1. Check for SMTP Configuration
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
            console.log("------------------------------------------");
            console.log("⚠️  Mock Email Sent (Missing SMTP Config) ⚠️");
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log("------------------------------------------");

            // Return success to simulate working feature for UI
            return NextResponse.json({ success: true, message: "Mock email sent" });
        }

        // 2. Configure Transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // 3. Send Email
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"YURA Information" <info.yura.co@gmail.com>',
            to,
            subject,
            html,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to send email:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}
