# 🚀 YURAA E-Commerce Production Setup Guide

## 📋 Table of Contents
1. [Database Migration](#database-migration)
2. [What's Included](#whats-included)
3. [How to Run the Migration](#how-to-run-the-migration)
4. [Inventory Management](#inventory-management)
5. [Testing the Setup](#testing-the-setup)

---

## 🗄️ Database Migration

### What This Migration Does:

1. **Cleans All Existing Orders** ✅
   - Removes all test/dummy orders from your database
   - Gives you a fresh start for production

2. **Creates Production-Ready Orders Table** ✅
   - Complete payment tracking (Razorpay integration)
   - Refund management fields
   - Order status tracking (pending → confirmed → shipped → delivered)
   - Shipping & tracking information
   - Customer details
   - Notion integration support

3. **Implements Automatic Inventory Management** ✅
   - Auto-decrements inventory when orders are placed
   - Auto-restores inventory when orders are cancelled/refunded
   - Prevents overselling with stock validation

4. **Creates Analytics Views** ✅
   - Daily order analytics
   - Revenue tracking
   - Order status summaries

---

## 📦 What's Included

### New Orders Table Fields:

#### **Core Fields:**
- `id` - Unique order identifier
- `created_at` - Order creation timestamp
- `updated_at` - Last update timestamp (auto-updated)

#### **Customer Information:**
- `customer_name` - Customer's full name
- `customer_email` - Email address
- `customer_phone` - Phone number
- `shipping_address` - Complete address (JSONB)
- `special_instructions` - Delivery notes

#### **Order Items:**
- `items` - Array of products with variants (JSONB)

#### **Pricing:**
- `subtotal` - Items total
- `shipping_cost` - Delivery charges
- `tax` - Tax amount
- `discount` - Discount applied
- `total_amount` - Final amount

#### **Payment Information:**
- `payment_method` - razorpay/cod/upi
- `payment_status` - pending/paid/failed/refunded
- `razorpay_order_id` - Razorpay order ID
- `razorpay_payment_id` - Razorpay payment ID
- `razorpay_signature` - Payment verification signature

#### **Refund Management:**
- `refund_id` - Refund transaction ID
- `refund_amount` - Amount refunded
- `refund_status` - pending/processed/failed
- `refund_reason` - Why refund was issued
- `refunded_at` - Refund timestamp

#### **Order Fulfillment:**
- `status` - Order status (pending/confirmed/processing/shipped/delivered/cancelled/refunded)
- `tracking_number` - Shipment tracking number
- `carrier` - Shipping carrier name
- `shipped_at` - Shipment timestamp
- `delivered_at` - Delivery timestamp

#### **Cancellation:**
- `cancelled_at` - Cancellation timestamp
- `cancellation_reason` - Why order was cancelled

#### **Integration & Notes:**
- `notion_page_id` - Notion page ID (for your workflow)
- `admin_notes` - Internal notes
- `metadata` - Additional data (JSONB)

---

## 🎯 How to Run the Migration

### Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Select your YURAA project
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Migration
1. Open the file `supabase-migration.sql` from your project
2. Copy the entire SQL script
3. Paste it into the Supabase SQL Editor
4. Click **Run** button

### Step 3: Verify Migration
Run these verification queries in the SQL Editor:

```sql
-- Check orders table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Check if triggers are created
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table = 'orders';

-- Check products inventory column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'inventory';
```

---

## 📊 Inventory Management

### How It Works:

#### **1. When Order is Placed (Paid or COD):**
```
Customer places order → Inventory automatically decrements
Example: Product has 10 items → Order placed for 2 → Inventory becomes 8
```

#### **2. When Order is Cancelled/Refunded:**
```
Order cancelled → Inventory automatically restored
Example: Inventory is 8 → Order of 2 cancelled → Inventory becomes 10
```

#### **3. Stock Validation:**
- System checks stock before allowing add to cart
- "Out of Stock" button shown when inventory = 0
- Prevents overselling

### Product Page Behavior:

✅ **When In Stock:**
- Shows green dot with stock count
- Button says "Add to Bag — ₹{price}"
- Button is clickable

❌ **When Out of Stock:**
- Shows red dot with "Out of Stock" message
- Button says "Out of Stock"
- Button is disabled (greyed out)

---

## 🧪 Testing the Setup

### Test 1: Verify Clean Database
```sql
-- Should return 0 rows
SELECT COUNT(*) FROM orders;
```

### Test 2: Check Inventory Column
```sql
-- Check if products have inventory column
SELECT id, name, inventory FROM products LIMIT 5;
```

### Test 3: Update Product Inventory
```sql
-- Set inventory for a test product
UPDATE products 
SET inventory = 10 
WHERE id = 'your-product-id';
```

### Test 4: Place Test Order
1. Go to your website
2. Add product to cart
3. Complete checkout
4. Check if inventory decreased:

```sql
SELECT id, name, inventory FROM products WHERE id = 'your-product-id';
-- Inventory should be 9 now (if you ordered 1)
```

### Test 5: Cancel Order
```sql
-- Cancel the test order
UPDATE orders 
SET status = 'cancelled', 
    cancelled_at = NOW(),
    cancellation_reason = 'Test cancellation'
WHERE id = 'your-order-id';

-- Check if inventory restored
SELECT id, name, inventory FROM products WHERE id = 'your-product-id';
-- Inventory should be back to 10
```

---

## 🔧 Admin Panel - Setting Inventory

### Option 1: Via SQL (Quick Setup)
```sql
-- Set inventory for all products to 50
UPDATE products SET inventory = 50;

-- Set inventory for specific product
UPDATE products 
SET inventory = 100 
WHERE slug = 'product-slug-here';

-- Set inventory to 0 for out of stock items
UPDATE products 
SET inventory = 0 
WHERE id IN ('id1', 'id2', 'id3');
```

### Option 2: Via Admin Panel (Recommended)
You mentioned you have an admin panel. Make sure it has:
- Inventory field for each product
- Ability to update inventory count
- Display current stock levels

---

## 📈 Monitoring Orders

### View All Orders:
```sql
SELECT 
    id,
    customer_name,
    customer_email,
    total_amount,
    payment_status,
    status,
    created_at
FROM orders
ORDER BY created_at DESC;
```

### View Order Analytics:
```sql
SELECT * FROM order_analytics
ORDER BY order_date DESC
LIMIT 30;
```

### Check Low Stock Products:
```sql
SELECT id, name, inventory
FROM products
WHERE inventory < 5
ORDER BY inventory ASC;
```

---

## 🚨 Important Notes

### Before Going Live:

1. ✅ **Run the migration** in Supabase
2. ✅ **Set inventory** for all products
3. ✅ **Test the order flow** (place order → check inventory)
4. ✅ **Test cancellation** (cancel order → check inventory restored)
5. ✅ **Verify payment integration** (Razorpay test mode)
6. ✅ **Check email notifications** (if implemented)

### Production Checklist:

- [ ] All products have inventory set
- [ ] Out of stock products show disabled button
- [ ] Orders decrement inventory correctly
- [ ] Cancellations restore inventory
- [ ] Payment gateway is in live mode
- [ ] Email notifications are working
- [ ] Admin panel shows inventory counts
- [ ] Notion integration is working (if used)

---

## 🆘 Troubleshooting

### Issue: Inventory not decreasing
**Solution:** Check if the trigger is created:
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'decrement_inventory_on_order';
```

### Issue: Button still shows "Add to Cart" when out of stock
**Solution:** The product page already has this logic. Make sure:
1. Product has `inventory` field set
2. Inventory is 0 or less
3. Page is refreshed

### Issue: Orders table doesn't exist
**Solution:** Re-run the migration script

---

## 📞 Support

If you encounter any issues:
1. Check the SQL error messages in Supabase
2. Verify all fields are correctly named
3. Ensure RLS policies allow your operations
4. Check browser console for frontend errors

---

## 🎉 You're Ready for Production!

Once you've completed all steps above, your e-commerce site will have:
- ✅ Clean order database
- ✅ Complete payment tracking
- ✅ Automatic inventory management
- ✅ Out of stock protection
- ✅ Refund management
- ✅ Order analytics

**Happy Selling! 🛍️**
