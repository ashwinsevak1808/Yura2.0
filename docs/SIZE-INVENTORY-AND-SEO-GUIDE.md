# Size-Based Inventory & SEO Metadata Implementation Guide

## Overview
This guide explains the new size-based inventory system and SEO metadata features added to your e-commerce platform.

---

## 🎯 What Changed

### 1. **Size-Based Inventory**
- Each product size (S, M, L, XL, etc.) now has its own stock count
- Stock is tracked per size, not just per product
- When orders are placed, stock is decremented for the specific size ordered
- When orders are cancelled/refunded, stock is restored for that size

### 2. **SEO Metadata Fields**
- Added comprehensive SEO fields for better search engine optimization
- Open Graph tags for Facebook, LinkedIn sharing
- Twitter Card tags for Twitter sharing
- Meta tags for general SEO

---

## 📊 Database Changes

### New Columns in `product_sizes` Table:
```sql
stock INTEGER NOT NULL DEFAULT 0
```
- Each size now tracks its own inventory
- Example: Product "Blue Kurti" → Size S: 10 items, Size M: 5 items, Size L: 8 items

### New Columns in `products` Table:
```sql
-- SEO Fields
meta_title TEXT
meta_description TEXT
meta_keywords TEXT

-- Open Graph (Social Sharing)
og_image TEXT
og_title TEXT
og_description TEXT

-- Twitter Card
twitter_card TEXT DEFAULT 'summary_large_image'
twitter_title TEXT
twitter_description TEXT
twitter_image TEXT
```

---

## 🚀 How to Use

### Step 1: Run the Migration

```bash
# In your Supabase SQL Editor, run:
supabase/size-inventory-and-seo-migration.sql
```

This will:
- ✅ Add `stock` column to `product_sizes`
- ✅ Add SEO metadata columns to `products`
- ✅ Create helper functions for inventory management
- ✅ Update triggers to handle size-based inventory

### Step 2: Set Stock for Existing Products

After running the migration, you need to set stock for each size:

```sql
-- Example: Set stock for a specific product's sizes
UPDATE product_sizes 
SET stock = 10 
WHERE product_id = 'your-product-uuid' AND size = 'S';

UPDATE product_sizes 
SET stock = 15 
WHERE product_id = 'your-product-uuid' AND size = 'M';

UPDATE product_sizes 
SET stock = 8 
WHERE product_id = 'your-product-uuid' AND size = 'L';

-- Or set all sizes to a default value
UPDATE product_sizes SET stock = 10;
```

### Step 3: Update Product Total Inventory

The `products.inventory` field should reflect the total across all sizes:

```sql
-- Update all products' total inventory
UPDATE products 
SET inventory = (
    SELECT COALESCE(SUM(stock), 0) 
    FROM product_sizes 
    WHERE product_sizes.product_id = products.id
);
```

---

## 💻 Admin Panel Usage

### Adding/Editing Products

When creating or editing products in the admin panel:

1. **Set Sizes**: Select which sizes are available (S, M, L, XL, etc.)
2. **Set Stock per Size**: For each size, specify the stock quantity
3. **Set SEO Metadata** (optional but recommended):
   - **Meta Title**: Short, descriptive title (max 60 chars)
   - **Meta Description**: Brief description (max 160 chars)
   - **OG Image**: URL to image for social sharing
   - **OG Title/Description**: How it appears on Facebook/LinkedIn
   - **Twitter Title/Description**: How it appears on Twitter

---

## 📦 How Inventory Works

### When a Customer Places an Order:

1. **Stock Check**: System checks if the selected size has enough stock
2. **Decrement**: Stock is reduced for that specific size
   - Example: Customer orders Size M → Size M stock decreases by 1
3. **Total Update**: Product's total inventory is recalculated

### When an Order is Cancelled/Refunded:

1. **Restore**: Stock is added back to the specific size
2. **Total Update**: Product's total inventory is recalculated

### Example Flow:

```
Initial State:
- Product: "Floral Kurti"
  - Size S: 10 items
  - Size M: 15 items
  - Size L: 8 items
  - Total: 33 items

Customer Orders 2x Size M:
- Size S: 10 items (unchanged)
- Size M: 13 items (15 - 2)
- Size L: 8 items (unchanged)
- Total: 31 items

Customer Cancels Order:
- Size S: 10 items (unchanged)
- Size M: 15 items (13 + 2 restored)
- Size L: 8 items (unchanged)
- Total: 33 items
```

---

## 🔍 SEO Metadata Best Practices

### Meta Title
- Keep it under 60 characters
- Include primary keyword
- Make it compelling
- Example: "Elegant Floral Kurti - Premium Cotton | YURA"

### Meta Description
- Keep it under 160 characters
- Include call-to-action
- Mention key features
- Example: "Shop our elegant floral kurti in premium cotton. Available in S-XXL. Free shipping over ₹2000. Order now!"

### Open Graph (Facebook/LinkedIn)
- **OG Title**: Can be same as meta title or more social-friendly
- **OG Description**: Can be same as meta description
- **OG Image**: Use high-quality product image (1200x630px recommended)

### Twitter Card
- **Twitter Title**: Short, catchy title
- **Twitter Description**: Brief, engaging description
- **Twitter Image**: Product image (1200x675px recommended)

---

## 🛠️ Helper Functions

The migration creates useful SQL functions:

### Get Total Stock for a Product
```sql
SELECT get_product_total_stock('product-uuid-here');
-- Returns: Total stock across all sizes
```

### Check if Size is Available
```sql
SELECT check_size_availability('product-uuid-here', 'M', 2);
-- Returns: true if Size M has at least 2 items in stock
```

### View Inventory Summary
```sql
SELECT * FROM product_inventory_summary 
WHERE product_id = 'your-product-uuid';
-- Shows: All sizes with their stock levels
```

---

## 📱 Frontend Display

### Product Page
- Sizes are now displayed with their stock availability
- Customers can only select sizes that are in stock
- Out-of-stock sizes are visually disabled

### Size Selector
```typescript
// Each size now has stock information
product.sizes.forEach(size => {
  console.log(`${size.size}: ${size.stock} items`);
});
```

---

## ⚠️ Important Notes

1. **Always Update Total Inventory**: When manually changing size stock, update the product's total inventory
2. **Stock Validation**: The system prevents orders if size stock is insufficient
3. **Automatic Updates**: Triggers handle stock updates automatically on orders
4. **SEO Fields are Optional**: You can fill them gradually as you optimize products

---

## 🔄 Migration Checklist

- [ ] Run `size-inventory-and-seo-migration.sql` in Supabase
- [ ] Set stock for all existing product sizes
- [ ] Update total inventory for all products
- [ ] Test creating a new product with size-based stock
- [ ] Test placing an order (stock should decrement)
- [ ] Test cancelling an order (stock should restore)
- [ ] Add SEO metadata to key products
- [ ] Verify social sharing works with OG tags

---

## 🆘 Troubleshooting

### Stock not updating?
- Check that triggers are created: `SELECT * FROM pg_trigger WHERE tgname LIKE '%inventory%';`
- Verify order status is 'paid' or payment method is 'cod'

### Size stock showing 0?
- Run: `UPDATE product_sizes SET stock = 10;` to set default stock
- Then update specific sizes as needed

### SEO tags not showing?
- Ensure you've added the meta tags to your product page `<head>`
- Use tools like Facebook Debugger or Twitter Card Validator to test

---

## 📞 Support

If you encounter issues:
1. Check the database migration ran successfully
2. Verify triggers are active
3. Check browser console for errors
4. Review the SQL functions are created

---

**Last Updated**: December 28, 2024
**Version**: 1.0
