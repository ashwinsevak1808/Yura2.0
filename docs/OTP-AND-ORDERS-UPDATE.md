# 🔐 OTP Verification & Updated Orders System

## ✅ What's Been Updated

### 1. **Database Schema** ✅
- New orders table with ALL payment tracking fields
- Automatic inventory management via triggers
- Complete refund tracking
- Order status lifecycle management

### 2. **Type Definitions** ✅
Updated `/src/types/order.ts` with:
- `OrderData` - includes OTP verification, payment signature, metadata
- `Order` - complete order interface matching new database schema
- `OrderItem` - simplified item structure for JSONB storage
- `OrderWithDetails` - extended type for admin panel display

### 3. **Checkout Action** ✅
Updated `/src/app/actions/checkout.ts`:
- Stores items as JSONB array (no separate order_items table)
- Calculates pricing breakdown (subtotal, shipping, tax, discount)
- Includes payment tracking fields (Razorpay signature, etc.)
- Adds metadata (user agent, IP address, source)
- Inventory handled automatically by database trigger

### 4. **OTP Service** ✅
Created `/src/services/otp.service.ts`:
- Generates 6-digit OTP
- Stores OTP with 5-minute expiry
- Verifies OTP before order placement
- Auto-cleanup of expired OTPs
- Ready for SMS gateway integration (MSG91, Twilio, etc.)

### 5. **OTP Actions** ✅
Created `/src/app/actions/otp.ts`:
- `sendOrderOTP(phone)` - Send OTP to customer
- `verifyOrderOTP(phone, otp)` - Verify OTP before checkout

---

## 🚀 How to Implement OTP Verification

### Step 1: Update Checkout Page

Add OTP verification step before payment. Here's the flow:

```
1. Customer fills checkout form
2. Customer clicks "Place Order"
3. System sends OTP to phone number
4. Customer enters OTP
5. System verifies OTP
6. If verified → Proceed to payment
7. If not verified → Show error
```

### Step 2: Add OTP UI Component

Create `/src/components/checkout/otp-verification.tsx`:

```tsx
"use client";

import { useState } from "react";
import { sendOrderOTP, verifyOrderOTP } from "@/app/actions/otp";
import { toast } from "@/components/ui/toast";

interface OTPVerificationProps {
    phone: string;
    onVerified: () => void;
}

export function OTPVerification({ phone, onVerified }: OTPVerificationProps) {
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const handleSendOTP = async () => {
        setSending(true);
        const result = await sendOrderOTP(phone);
        setSending(false);

        if (result.success) {
            setOtpSent(true);
            toast.success(result.message);
            // In development, show OTP in console
            if (result.otp) {
                console.log("🔐 OTP:", result.otp);
                toast.info(`Dev Mode - OTP: ${result.otp}`);
            }
        } else {
            toast.error(result.message);
        }
    };

    const handleVerifyOTP = async () => {
        setVerifying(true);
        const result = await verifyOrderOTP(phone, otp);
        setVerifying(false);

        if (result.success) {
            toast.success(result.message);
            onVerified();
        } else {
            toast.error(result.message);
        }
    };

    if (!otpSent) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-yellow-900 mb-2">
                    📱 Verify Your Phone Number
                </h3>
                <p className="text-xs text-yellow-700 mb-3">
                    We'll send a verification code to {phone}
                </p>
                <button
                    onClick={handleSendOTP}
                    disabled={sending}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {sending ? "Sending..." : "Send OTP"}
                </button>
            </div>
        );
    }

    return (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-green-900 mb-2">
                🔐 Enter Verification Code
                </h3>
            <p className="text-xs text-green-700 mb-3">
                Enter the 6-digit code sent to {phone}
            </p>
            <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full px-4 py-2 border border-green-300 rounded text-center text-lg font-mono mb-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="flex gap-2">
                <button
                    onClick={handleVerifyOTP}
                    disabled={verifying || otp.length !== 6}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {verifying ? "Verifying..." : "Verify & Continue"}
                </button>
                <button
                    onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                    }}
                    className="px-4 py-2 text-sm text-green-700 hover:text-green-900 transition-colors"
                >
                    Resend
                </button>
            </div>
        </div>
    );
}
```

### Step 3: Integrate in Checkout Flow

Update your checkout page to include OTP verification:

```tsx
const [otpVerified, setOtpVerified] = useState(false);

// Before payment/order submission:
if (!otpVerified) {
    return (
        <OTPVerification
            phone={formData.phone}
            onVerified={() => setOtpVerified(true)}
        />
    );
}

// After OTP verified, show payment options
```

---

## 📊 Admin Panel Updates Needed

### Update `/src/app/admin/orders/page.tsx`

Add more columns to show:
- Payment Status (pending/paid/failed/refunded)
- Payment Method (COD/Razorpay/UPI)
- Tracking Number (if shipped)

```tsx
// Add to table headers:
<th>Payment Status</th>
<th>Payment Method</th>

// Add to table body:
<td>
    <span className={`badge ${order.payment_status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'}`}>
        {order.payment_status}
    </span>
</td>
<td>{order.payment_method.toUpperCase()}</td>
```

### Update Order Details Page

Create `/src/app/admin/orders/[id]/page.tsx` to show:

**Customer Information:**
- Name, Email, Phone
- Shipping Address
- Special Instructions

**Order Items:**
- Product name, quantity, size, color, price
- Subtotal

**Pricing Breakdown:**
- Subtotal
- Shipping Cost
- Tax
- Discount
- Total Amount

**Payment Information:**
- Payment Method
- Payment Status
- Razorpay Order ID
- Razorpay Payment ID
- Razorpay Signature

**Order Status:**
- Current Status
- Tracking Number (if shipped)
- Carrier
- Shipped At
- Delivered At

**Refund Information** (if applicable):
- Refund ID
- Refund Amount
- Refund Status
- Refund Reason

**Actions:**
- Update Status (dropdown)
- Add Tracking Number
- Cancel Order
- Process Refund
- Add Admin Notes

---

## 🔧 SMS Gateway Integration (Production)

### Option 1: MSG91 (Popular in India)

1. Sign up at https://msg91.com
2. Get API key and Flow ID
3. Add to `.env.local`:
```
MSG91_AUTH_KEY=your_auth_key
MSG91_FLOW_ID=your_flow_id
```

4. Update `/src/services/otp.service.ts`:
```typescript
private static async sendSMS(phone: string, otp: string): Promise<void> {
    const response = await fetch('https://api.msg91.com/api/v5/flow/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authkey': process.env.MSG91_AUTH_KEY!
        },
        body: JSON.stringify({
            flow_id: process.env.MSG91_FLOW_ID,
            sender: 'YURAA',
            mobiles: phone,
            VAR1: otp
        })
    });

    if (!response.ok) {
        throw new Error('Failed to send SMS');
    }
}
```

### Option 2: Twilio

1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token
3. Add to `.env.local`:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

4. Install Twilio SDK:
```bash
npm install twilio
```

5. Update OTP service to use Twilio

---

## 📋 Testing Checklist

### OTP Flow:
- [ ] Send OTP to valid phone number
- [ ] Receive OTP (check console in dev mode)
- [ ] Enter correct OTP → Verification succeeds
- [ ] Enter wrong OTP → Shows error
- [ ] OTP expires after 5 minutes
- [ ] Resend OTP works

### Order Creation:
- [ ] Order created with all fields
- [ ] Items stored as JSONB array
- [ ] Pricing breakdown calculated correctly
- [ ] Payment status set correctly
- [ ] Inventory decremented automatically
- [ ] Email confirmation sent

### Admin Panel:
- [ ] All orders displayed
- [ ] Filter by status works
- [ ] Search by customer/order ID works
- [ ] Order details show all information
- [ ] Update status works
- [ ] Add tracking number works

---

## 🎯 Next Steps

1. **Run the database migration** (`supabase-migration.sql`)
2. **Set inventory** for all products
3. **Add OTP verification** to checkout page
4. **Update admin panel** to show new fields
5. **Test the complete flow**
6. **Integrate SMS gateway** for production
7. **Go live!** 🚀

---

## 📁 Files Created/Updated

### Created:
- `/src/services/otp.service.ts` - OTP generation and verification
- `/src/app/actions/otp.ts` - Server actions for OTP
- `/supabase-migration.sql` - Database migration script
- `/inventory-commands.sql` - Quick reference SQL commands
- `/PRODUCTION-SETUP-GUIDE.md` - Complete setup guide
- `/QUICK-START.md` - Quick reference

### Updated:
- `/src/app/actions/checkout.ts` - New order structure
- `/src/types/order.ts` - Complete type definitions

### Need to Update:
- Checkout page - Add OTP verification UI
- Admin orders page - Add payment status column
- Admin order details page - Show all new fields

---

**Everything is ready! Just add the OTP UI to your checkout page and update the admin panel to display the new fields.** 🎉
