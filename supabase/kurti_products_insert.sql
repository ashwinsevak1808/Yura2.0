-- ============================================
-- YURA KURTIS - Complete Database Insert Script
-- ============================================
-- This script inserts 10 premium kurtis with proper images, descriptions, and related data
-- Execute this after dropping your existing product data

-- Clear existing data (optional - uncomment if needed)
-- DELETE FROM product_images;
-- DELETE FROM product_sizes;
-- DELETE FROM product_colors;
-- DELETE FROM product_specifications;
-- DELETE FROM products;

-- ============================================
-- 1. FLORAL EMBROIDERED KURTI
-- ============================================
INSERT INTO products (id, name, slug, description, full_description, price, original_price, discount, category, sku, stock, created_at, updated_at)
VALUES (
  '1',
  'Floral Embroidered Cotton Kurti',
  'floral-embroidered-cotton-kurti',
  'Elegant floral embroidered kurti crafted from premium cotton fabric, perfect for both casual and semi-formal occasions.',
  'Discover the perfect blend of traditional craftsmanship and contemporary design with our Floral Embroidered Cotton Kurti. This exquisite piece features intricate floral embroidery along the neckline and sleeves, showcasing the skill of our artisans. Made from 100% pure cotton, this kurti ensures maximum breathability and comfort throughout the day. The straight-cut silhouette flatters all body types while maintaining a modest and elegant appearance. The three-quarter sleeves make it versatile for year-round wear, while the knee-length design offers the perfect balance between traditional and modern styling. The embroidery work uses high-quality threads that retain their vibrancy even after multiple washes. This kurti pairs beautifully with both traditional bottoms like churidars and palazzos, as well as contemporary jeans or leggings. Whether you are heading to the office, attending a casual gathering, or simply running errands, this kurti will keep you looking effortlessly stylish and feeling comfortable.',
  1899.00,
  2499.00,
  24,
  'Women''s Kurtis',
  'YUR-FK-001',
  45,
  now(),
  now()
);

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
  ('1', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800', 'Floral Embroidered Cotton Kurti - Front View', true, 1),
  ('1', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', 'Floral Embroidered Cotton Kurti - Detail View', false, 2),
  ('1', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800', 'Floral Embroidered Cotton Kurti - Side View', false, 3),
  ('1', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 'Floral Embroidered Cotton Kurti - Back View', false, 4);

INSERT INTO product_sizes (product_id, size_name, size_value, is_available)
VALUES
  ('1', 'XS', 'XS', true),
  ('1', 'S', 'S', true),
  ('1', 'M', 'M', true),
  ('1', 'L', 'L', true),
  ('1', 'XL', 'XL', true),
  ('1', 'XXL', 'XXL', true);

INSERT INTO product_colors (product_id, color_name, color_hex, is_available)
VALUES
  ('1', 'Sky Blue', '#87CEEB', true),
  ('1', 'Coral Pink', '#FF7F50', true),
  ('1', 'Mint Green', '#98FF98', true);

INSERT INTO product_specifications (product_id, spec_name, spec_value)
VALUES
  ('1', 'Fabric', '100% Pure Cotton'),
  ('1', 'Fit', 'Straight Cut'),
  ('1', 'Sleeve', 'Three-Quarter Sleeve'),
  ('1', 'Length', 'Knee Length'),
  ('1', 'Occasion', 'Casual & Semi-Formal'),
  ('1', 'Care', 'Machine Wash Cold');

-- ============================================
-- 2. BLOCK PRINT KURTI
-- ============================================
INSERT INTO products (id, name, slug, description, full_description, price, original_price, discount, category, sku, stock, created_at, updated_at)
VALUES (
  '2',
  'Hand Block Print Kurti',
  'hand-block-print-kurti',
  'Authentic hand block printed kurti featuring traditional Indian motifs, handcrafted by skilled artisans.',
  'Experience the rich heritage of Indian textile art with our Hand Block Print Kurti. Each piece is meticulously crafted using traditional hand block printing techniques that have been passed down through generations. The intricate geometric and floral patterns are stamped onto premium cotton fabric using natural dyes, ensuring an eco-friendly and sustainable product. The unique characteristic of hand block printing means that each kurti has slight variations, making your piece truly one-of-a-kind. The A-line silhouette provides a flattering fit that suits various body types, while the mandarin collar adds a touch of sophistication. The full sleeves can be rolled up for a more casual look, offering versatility in styling. This kurti is perfect for those who appreciate authentic craftsmanship and want to support traditional artisan communities. The breathable cotton fabric makes it ideal for warm weather, while the timeless design ensures it remains a wardrobe staple for years to come. Pair it with white pants for a crisp, clean look, or with colorful bottoms to create a vibrant ensemble.',
  2199.00,
  2899.00,
  24,
  'Women''s Kurtis',
  'YUR-BP-002',
  32,
  now(),
  now()
);

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
  ('2', 'https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=800', 'Hand Block Print Kurti - Front View', true, 1),
  ('2', 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800', 'Hand Block Print Kurti - Pattern Detail', false, 2),
  ('2', 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800', 'Hand Block Print Kurti - Side View', false, 3),
  ('2', 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800', 'Hand Block Print Kurti - Full Length', false, 4),
  ('2', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800', 'Hand Block Print Kurti - Styled Look', false, 5);

INSERT INTO product_sizes (product_id, size_name, size_value, is_available)
VALUES
  ('2', 'XS', 'XS', true),
  ('2', 'S', 'S', true),
  ('2', 'M', 'M', true),
  ('2', 'L', 'L', true),
  ('2', 'XL', 'XL', true),
  ('2', 'XXL', 'XXL', true);

INSERT INTO product_colors (product_id, color_name, color_hex, is_available)
VALUES
  ('2', 'Indigo Blue', '#4B0082', true),
  ('2', 'Rust Orange', '#B7410E', true),
  ('2', 'Olive Green', '#556B2F', true);

INSERT INTO product_specifications (product_id, spec_name, spec_value)
VALUES
  ('2', 'Fabric', '100% Cotton'),
  ('2', 'Fit', 'A-Line'),
  ('2', 'Sleeve', 'Full Sleeve'),
  ('2', 'Length', 'Calf Length'),
  ('2', 'Occasion', 'Casual & Festive'),
  ('2', 'Print Type', 'Hand Block Print'),
  ('2', 'Care', 'Hand Wash Recommended');

-- ============================================
-- 3. SILK BLEND FESTIVE KURTI
-- ============================================
INSERT INTO products (id, name, slug, description, full_description, price, original_price, discount, category, sku, stock, created_at, updated_at)
VALUES (
  '3',
  'Silk Blend Festive Kurti',
  'silk-blend-festive-kurti',
  'Luxurious silk blend kurti with golden embellishments, perfect for festive celebrations and special occasions.',
  'Make a statement at your next celebration with our Silk Blend Festive Kurti. This stunning piece combines the lustrous sheen of silk with the comfort of cotton, creating a fabric that drapes beautifully and feels wonderful against the skin. The kurti features exquisite golden zari work along the neckline, sleeves, and hemline, adding a touch of opulence to the overall design. The rich color palette and intricate embellishments make this kurti perfect for weddings, festivals, and other special occasions. The anarkali-style cut creates a graceful silhouette that flows elegantly with movement, while the fitted bodice ensures a flattering fit. The full sleeves are adorned with delicate embroidery that catches the light beautifully. This kurti comes with a matching dupatta that complements the overall ensemble. The attention to detail in the craftsmanship is evident in every stitch, from the carefully placed sequins to the perfectly aligned patterns. Despite its luxurious appearance, this kurti is surprisingly comfortable to wear for extended periods, making it ideal for all-day events.',
  3499.00,
  4999.00,
  30,
  'Women''s Kurtis',
  'YUR-SF-003',
  18,
  now(),
  now()
);

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
  ('3', 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=800', 'Silk Blend Festive Kurti - Front View', true, 1),
  ('3', 'https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?w=800', 'Silk Blend Festive Kurti - Embroidery Detail', false, 2),
  ('3', 'https://images.unsplash.com/photo-1610652492500-ded49ceae0e6?w=800', 'Silk Blend Festive Kurti - Full Length', false, 3),
  ('3', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', 'Silk Blend Festive Kurti - Back View', false, 4),
  ('3', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800', 'Silk Blend Festive Kurti - Side Angle', false, 5),
  ('3', 'https://images.unsplash.com/photo-1583391265902-e7d2c1e6ca05?w=800', 'Silk Blend Festive Kurti - Complete Look', false, 6);

INSERT INTO product_sizes (product_id, size_name, size_value, is_available)
VALUES
  ('3', 'XS', 'XS', true),
  ('3', 'S', 'S', true),
  ('3', 'M', 'M', true),
  ('3', 'L', 'L', true),
  ('3', 'XL', 'XL', true),
  ('3', 'XXL', 'XXL', false);

INSERT INTO product_colors (product_id, color_name, color_hex, is_available)
VALUES
  ('3', 'Royal Blue', '#4169E1', true),
  ('3', 'Deep Maroon', '#800000', true),
  ('3', 'Emerald Green', '#50C878', true);

INSERT INTO product_specifications (product_id, spec_name, spec_value)
VALUES
  ('3', 'Fabric', '60% Silk, 40% Cotton'),
  ('3', 'Fit', 'Anarkali'),
  ('3', 'Sleeve', 'Full Sleeve'),
  ('3', 'Length', 'Floor Length'),
  ('3', 'Occasion', 'Festive & Wedding'),
  ('3', 'Embellishment', 'Zari & Sequin Work'),
  ('3', 'Care', 'Dry Clean Only');

-- ============================================
-- 4. MINIMALIST LINEN KURTI
-- ============================================
INSERT INTO products (id, name, slug, description, full_description, price, original_price, discount, category, sku, stock, created_at, updated_at)
VALUES (
  '4',
  'Minimalist Linen Kurti',
  'minimalist-linen-kurti',
  'Clean-lined linen kurti with contemporary design, ideal for modern professionals seeking comfort and style.',
  'Embrace understated elegance with our Minimalist Linen Kurti, designed for the contemporary woman who values both style and comfort. This kurti features a clean, streamlined silhouette without any unnecessary embellishments, allowing the quality of the fabric and the precision of the cut to take center stage. Made from premium linen, this piece offers exceptional breathability and natural temperature regulation, making it perfect for warm climates and long workdays. The fabric has a beautiful natural texture that adds visual interest without being overwhelming. The straight cut with subtle side slits provides ease of movement while maintaining a polished appearance. The round neckline is finished with a neat facing, and the sleeveless design makes it versatile for layering or wearing on its own. The kurti falls just below the knee, creating a sophisticated and professional look. The neutral color palette ensures easy coordination with various bottoms and accessories. This piece is perfect for office wear, casual meetings, or weekend brunches. The low-maintenance nature of linen means it actually looks better with a slightly lived-in appearance, developing character over time.',
  1699.00,
  null,
  null,
  'Women''s Kurtis',
  'YUR-ML-004',
  52,
  now(),
  now()
);

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
  ('4', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800', 'Minimalist Linen Kurti - Front View', true, 1),
  ('4', 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800', 'Minimalist Linen Kurti - Side View', false, 2),
  ('4', 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800', 'Minimalist Linen Kurti - Back View', false, 3),
  ('4', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 'Minimalist Linen Kurti - Styled Look', false, 4);

INSERT INTO product_sizes (product_id, size_name, size_value, is_available)
VALUES
  ('4', 'XS', 'XS', true),
  ('4', 'S', 'S', true),
  ('4', 'M', 'M', true),
  ('4', 'L', 'L', true),
  ('4', 'XL', 'XL', true),
  ('4', 'XXL', 'XXL', true);

INSERT INTO product_colors (product_id, color_name, color_hex, is_available)
VALUES
  ('4', 'Natural Beige', '#F5F5DC', true),
  ('4', 'Charcoal Gray', '#36454F', true),
  ('4', 'Off White', '#FAF9F6', true);

INSERT INTO product_specifications (product_id, spec_name, spec_value)
VALUES
  ('4', 'Fabric', '100% Linen'),
  ('4', 'Fit', 'Straight Cut'),
  ('4', 'Sleeve', 'Sleeveless'),
  ('4', 'Length', 'Knee Length'),
  ('4', 'Occasion', 'Office & Casual'),
  ('4', 'Care', 'Machine Wash Gentle');

-- ============================================
-- 5. PRINTED RAYON KURTI
-- ============================================
INSERT INTO products (id, name, slug, description, full_description, price, original_price, discount, category, sku, stock, created_at, updated_at)
VALUES (
  '5',
  'Printed Rayon Kurti',
  'printed-rayon-kurti',
  'Vibrant printed rayon kurti with contemporary patterns, offering comfort and style for everyday wear.',
  'Add a pop of color to your wardrobe with our Printed Rayon Kurti, featuring bold contemporary prints that make a statement. This kurti is crafted from high-quality rayon fabric that drapes beautifully and feels incredibly soft against the skin. The digital printing technique ensures vibrant, long-lasting colors that do not fade easily with washing. The abstract floral pattern is modern yet timeless, making this piece versatile enough to wear season after season. The A-line cut is universally flattering, skimming over the body without clinging, while the princess seams add structure and shape. The three-quarter sleeves are practical for transitional weather and can be paired with bangles or bracelets for added style. The kurti features a keyhole neckline with a button closure at the back, adding a subtle detail that elevates the overall design. The length hits just above the knee, making it perfect for pairing with leggings, jeans, or palazzos. This kurti is ideal for casual outings, shopping trips, or relaxed office environments. The easy-care fabric makes it a practical choice for busy lifestyles, requiring minimal ironing and maintaining its shape wash after wash.',
  1399.00,
  1799.00,
  22,
  'Women''s Kurtis',
  'YUR-PR-005',
  67,
  now(),
  now()
);

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
  ('5', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800', 'Printed Rayon Kurti - Front View', true, 1),
  ('5', 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800', 'Printed Rayon Kurti - Print Detail', false, 2),
  ('5', 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800', 'Printed Rayon Kurti - Side View', false, 3),
  ('5', 'https://images.unsplash.com/photo-1632398170669-44f6f6d4f7f4?w=800', 'Printed Rayon Kurti - Back View', false, 4),
  ('5', 'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=800', 'Printed Rayon Kurti - Full Look', false, 5);

INSERT INTO product_sizes (product_id, size_name, size_value, is_available)
VALUES
  ('5', 'XS', 'XS', true),
  ('5', 'S', 'S', true),
  ('5', 'M', 'M', true),
  ('5', 'L', 'L', true),
  ('5', 'XL', 'XL', true),
  ('5', 'XXL', 'XXL', true);

INSERT INTO product_colors (product_id, color_name, color_hex, is_available)
VALUES
  ('5', 'Fuchsia Pink', '#FF00FF', true),
  ('5', 'Turquoise', '#40E0D0', true),
  ('5', 'Mustard Yellow', '#FFDB58', true);

INSERT INTO product_specifications (product_id, spec_name, spec_value)
VALUES
  ('5', 'Fabric', '100% Rayon'),
  ('5', 'Fit', 'A-Line'),
  ('5', 'Sleeve', 'Three-Quarter Sleeve'),
  ('5', 'Length', 'Above Knee'),
  ('5', 'Occasion', 'Casual & Daily Wear'),
  ('5', 'Print Type', 'Digital Print'),
  ('5', 'Care', 'Machine Wash Cold');

-- ============================================
-- 6. CHANDERI SILK KURTI
-- ============================================
INSERT INTO products (id, name, slug, description, full_description, price, original_price, discount, category, sku, stock, created_at, updated_at)
VALUES (
  '6',
  'Chanderi Silk Kurti',
  'chanderi-silk-kurti',
  'Elegant Chanderi silk kurti with traditional weaving, combining heritage craftsmanship with modern design.',
  'Experience the luxury of Chanderi silk with our meticulously crafted kurti that pays homage to one of India most celebrated textile traditions. Chanderi fabric is renowned for its lightweight texture, sheer appearance, and rich gold or silver zari work. This kurti showcases the best of Chanderi weaving, featuring delicate butis scattered across the fabric and a beautiful border design. The fabric has a unique glossy transparency that gives it an ethereal quality, making it perfect for special occasions. The straight-cut silhouette is timeless and elegant, while the boat neckline adds a contemporary touch. The elbow-length sleeves are finished with a delicate zari border that matches the hemline. This kurti is perfect for those who appreciate fine textiles and want to invest in a piece that will remain stylish for years to come. The natural sheen of the silk catches the light beautifully, creating a subtle shimmer that is sophisticated rather than flashy. Pair this kurti with silk or cotton bottoms and traditional jewelry for a complete ethnic look, or style it with contemporary accessories for a fusion ensemble. Each piece is carefully inspected to ensure the highest quality standards.',
  2799.00,
  3499.00,
  20,
  'Women''s Kurtis',
  'YUR-CS-006',
  25,
  now(),
  now()
);

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
  ('6', 'https://images.unsplash.com/photo-1610652492500-ded49ceae0e6?w=800', 'Chanderi Silk Kurti - Front View', true, 1),
  ('6', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', 'Chanderi Silk Kurti - Weave Detail', false, 2),
  ('6', 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=800', 'Chanderi Silk Kurti - Border Detail', false, 3),
  ('6', 'https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?w=800', 'Chanderi Silk Kurti - Side View', false, 4),
  ('6', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800', 'Chanderi Silk Kurti - Full Length', false, 5),
  ('6', 'https://images.unsplash.com/photo-1583391265902-e7d2c1e6ca05?w=800', 'Chanderi Silk Kurti - Styled Look', false, 6),
  ('6', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800', 'Chanderi Silk Kurti - Back View', false, 7);

INSERT INTO product_sizes (product_id, size_name, size_value, is_available)
VALUES
  ('6', 'XS', 'XS', true),
  ('6', 'S', 'S', true),
  ('6', 'M', 'M', true),
  ('6', 'L', 'L', true),
  ('6', 'XL', 'XL', true),
  ('6', 'XXL', 'XXL', true);

INSERT INTO product_colors (product_id, color_name, color_hex, is_available)
VALUES
  ('6', 'Ivory', '#FFFFF0', true),
  ('6', 'Peach', '#FFE5B4', true),
  ('6', 'Lavender', '#E6E6FA', true);

INSERT INTO product_specifications (product_id, spec_name, spec_value)
VALUES
  ('6', 'Fabric', 'Chanderi Silk'),
  ('6', 'Fit', 'Straight Cut'),
  ('6', 'Sleeve', 'Elbow Length'),
  ('6', 'Length', 'Knee Length'),
  ('6', 'Occasion', 'Festive & Special Events'),
  ('6', 'Weave Type', 'Traditional Chanderi'),
  ('6', 'Care', 'Dry Clean Only');

-- ============================================
-- 7. ASYMMETRIC HEM KURTI
-- ============================================
INSERT INTO products (id, name, slug, description, full_description, price, original_price, discount, category, sku, stock, created_at, updated_at)
VALUES (
  '7',
  'Asymmetric Hem Kurti',
  'asymmetric-hem-kurti',
  'Contemporary asymmetric hem kurti with modern silhouette, perfect for fashion-forward individuals.',
  'Step into the future of ethnic wear with our Asymmetric Hem Kurti, a bold reinterpretation of traditional design. This innovative piece features a dramatically asymmetric hemline that is shorter in the front and longer in the back, creating a dynamic and eye-catching silhouette. The high-low hem adds movement and interest to the overall design, making it perfect for those who want to make a fashion statement. Crafted from a premium cotton-modal blend, this kurti offers the breathability of cotton with the luxurious drape of modal. The fabric has a subtle sheen that elevates the overall look without being overly dressy. The kurti features a contemporary V-neckline that elongates the neck and adds a modern touch. The sleeves are designed with a unique bell shape that flares out at the wrist, adding a romantic and feminine element to the structured silhouette. Side pockets are cleverly integrated into the seam lines, providing functionality without compromising the clean lines of the design. This kurti is perfect for creative professionals, artists, or anyone who appreciates innovative design. Pair it with fitted pants or leggings to balance the volume of the hem, and complete the look with statement jewelry.',
  1999.00,
  2599.00,
  23,
  'Women''s Kurtis',
  'YUR-AH-007',
  38,
  now(),
  now()
);

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
  ('7', 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800', 'Asymmetric Hem Kurti - Front View', true, 1),
  ('7', 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800', 'Asymmetric Hem Kurti - Side View', false, 2),
  ('7', 'https://images.unsplash.com/photo-1632398170669-44f6f6d4f7f4?w=800', 'Asymmetric Hem Kurti - Back View', false, 3),
  ('7', 'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=800', 'Asymmetric Hem Kurti - Hem Detail', false, 4),
  ('7', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800', 'Asymmetric Hem Kurti - Full Look', false, 5);

INSERT INTO product_sizes (product_id, size_name, size_value, is_available)
VALUES
  ('7', 'XS', 'XS', true),
  ('7', 'S', 'S', true),
  ('7', 'M', 'M', true),
  ('7', 'L', 'L', true),
  ('7', 'XL', 'XL', true),
  ('7', 'XXL', 'XXL', true);

INSERT INTO product_colors (product_id, color_name, color_hex, is_available)
VALUES
  ('7', 'Black', '#000000', true),
  ('7', 'Wine Red', '#722F37', true),
  ('7', 'Navy Blue', '#000080', true);

INSERT INTO product_specifications (product_id, spec_name, spec_value)
VALUES
  ('7', 'Fabric', '70% Cotton, 30% Modal'),
  ('7', 'Fit', 'Asymmetric'),
  ('7', 'Sleeve', 'Bell Sleeve'),
  ('7', 'Length', 'High-Low Hem'),
  ('7', 'Occasion', 'Party & Casual'),
  ('7', 'Care', 'Machine Wash Cold');

-- ============================================
-- 8. MIRROR WORK KURTI
-- ============================================
INSERT INTO products (id, name, slug, description, full_description, price, original_price, discount, category, sku, stock, created_at, updated_at)
VALUES (
  '8',
  'Mirror Work Kurti',
  'mirror-work-kurti',
  'Stunning mirror work kurti with traditional embellishments, perfect for festive celebrations.',
  'Celebrate in style with our exquisite Mirror Work Kurti, a dazzling piece that combines traditional craftsmanship with contemporary design. This kurti features intricate mirror work, also known as shisha embroidery, a technique that originated in the deserts of Rajasthan and Gujarat. Small pieces of reflective glass are carefully stitched onto the fabric using colorful threads, creating a stunning interplay of light and color. The mirrors are arranged in beautiful geometric and floral patterns across the yoke, sleeves, and hemline, making this kurti a true work of art. The base fabric is a rich cotton silk blend that provides a luxurious feel while remaining comfortable for extended wear. The kurti has a classic straight cut with subtle side slits for ease of movement. The round neckline is finished with a delicate piping detail that frames the elaborate mirror work on the yoke. The full sleeves are adorned with mirror work cuffs that add a finishing touch to the overall design. This kurti is perfect for festivals, weddings, and other celebratory occasions where you want to stand out. The handcrafted nature of the mirror work means that each piece is unique, with slight variations that add to its charm and authenticity.',
  2599.00,
  3299.00,
  21,
  'Women''s Kurtis',
  'YUR-MW-008',
  22,
  now(),
  now()
);

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
  ('8', 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800', 'Mirror Work Kurti - Front View', true, 1),
  ('8', 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800', 'Mirror Work Kurti - Mirror Detail', false, 2),
  ('8', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 'Mirror Work Kurti - Yoke Detail', false, 3),
  ('8', 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800', 'Mirror Work Kurti - Side View', false, 4),
  ('8', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800', 'Mirror Work Kurti - Full Length', false, 5),
  ('8', 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800', 'Mirror Work Kurti - Back View', false, 6);

INSERT INTO product_sizes (product_id, size_name, size_value, is_available)
VALUES
  ('8', 'XS', 'XS', true),
  ('8', 'S', 'S', true),
  ('8', 'M', 'M', true),
  ('8', 'L', 'L', true),
  ('8', 'XL', 'XL', true),
  ('8', 'XXL', 'XXL', true);

INSERT INTO product_colors (product_id, color_name, color_hex, is_available)
VALUES
  ('8', 'Magenta', '#FF00FF', true),
  ('8', 'Teal', '#008080', true),
  ('8', 'Orange', '#FFA500', true);

INSERT INTO product_specifications (product_id, spec_name, spec_value)
VALUES
  ('8', 'Fabric', '60% Cotton, 40% Silk'),
  ('8', 'Fit', 'Straight Cut'),
  ('8', 'Sleeve', 'Full Sleeve'),
  ('8', 'Length', 'Knee Length'),
  ('8', 'Occasion', 'Festive & Wedding'),
  ('8', 'Embellishment', 'Mirror Work'),
  ('8', 'Care', 'Dry Clean Only');

-- ============================================
-- 9. STRIPED COTTON KURTI
-- ============================================
INSERT INTO products (id, name, slug, description, full_description, price, original_price, discount, category, sku, stock, created_at, updated_at)
VALUES (
  '9',
  'Striped Cotton Kurti',
  'striped-cotton-kurti',
  'Classic striped cotton kurti with timeless appeal, perfect for everyday elegance.',
  'Discover the perfect balance of classic and contemporary with our Striped Cotton Kurti. Stripes are a timeless pattern that never goes out of style, and this kurti showcases them in the most elegant way. The vertical stripes create a lengthening effect that is universally flattering, while the carefully chosen color combinations ensure versatility in styling. Made from premium quality cotton, this kurti is breathable, comfortable, and perfect for all-day wear. The fabric is pre-shrunk and colorfast, ensuring that it maintains its shape and vibrancy wash after wash. The kurti features a mandarin collar with a button placket that extends halfway down the front, adding a structured element to the otherwise relaxed silhouette. The three-quarter sleeves are practical and stylish, making this piece suitable for various seasons. The straight cut with side slits provides ease of movement while maintaining a neat and polished appearance. This kurti is incredibly versatile and can be dressed up or down depending on the occasion. Pair it with white pants for a crisp office look, or with jeans for a casual weekend outfit. The classic stripe pattern makes it easy to accessorize with both bold and subtle jewelry.',
  1299.00,
  null,
  null,
  'Women''s Kurtis',
  'YUR-SC-009',
  58,
  now(),
  now()
);

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
  ('9', 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800', 'Striped Cotton Kurti - Front View', true, 1),
  ('9', 'https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=800', 'Striped Cotton Kurti - Side View', false, 2),
  ('9', 'https://images.unsplash.com/photo-1583391265902-e7d2c1e6ca05?w=800', 'Striped Cotton Kurti - Detail View', false, 3),
  ('9', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800', 'Striped Cotton Kurti - Back View', false, 4);

INSERT INTO product_sizes (product_id, size_name, size_value, is_available)
VALUES
  ('9', 'XS', 'XS', true),
  ('9', 'S', 'S', true),
  ('9', 'M', 'M', true),
  ('9', 'L', 'L', true),
  ('9', 'XL', 'XL', true),
  ('9', 'XXL', 'XXL', true);

INSERT INTO product_colors (product_id, color_name, color_hex, is_available)
VALUES
  ('9', 'Blue & White', '#4682B4', true),
  ('9', 'Black & White', '#000000', true),
  ('9', 'Red & White', '#DC143C', true);

INSERT INTO product_specifications (product_id, spec_name, spec_value)
VALUES
  ('9', 'Fabric', '100% Cotton'),
  ('9', 'Fit', 'Straight Cut'),
  ('9', 'Sleeve', 'Three-Quarter Sleeve'),
  ('9', 'Length', 'Knee Length'),
  ('9', 'Occasion', 'Office & Casual'),
  ('9', 'Pattern', 'Vertical Stripes'),
  ('9', 'Care', 'Machine Wash Cold');

-- ============================================
-- 10. PALAZZO SET KURTI
-- ============================================
INSERT INTO products (id, name, slug, description, full_description, price, original_price, discount, category, sku, stock, created_at, updated_at)
VALUES (
  '10',
  'Palazzo Set Kurti',
  'palazzo-set-kurti',
  'Complete kurti and palazzo set with coordinated design, offering effortless style and comfort.',
  'Experience the convenience and style of our Palazzo Set Kurti, a complete ensemble that takes the guesswork out of outfit coordination. This set includes a beautifully designed kurti paired with matching palazzo pants, creating a harmonious and put-together look. The kurti features a contemporary short length that falls just below the hip, making it perfect for pairing with the wide-leg palazzo pants. The fabric is a premium rayon blend that drapes beautifully and feels incredibly soft against the skin. The kurti has a round neckline with delicate gota patti work that adds a traditional touch to the modern silhouette. The sleeves are designed with a unique cold-shoulder style, featuring cutouts at the shoulders that add a trendy element while maintaining modesty. The palazzo pants are designed with a comfortable elastic waistband and feature the same print as the kurti, creating a cohesive look. The wide-leg design is both comfortable and flattering, allowing for easy movement while maintaining an elegant appearance. This set is perfect for those busy days when you want to look stylish without spending too much time planning your outfit. It is suitable for various occasions, from casual gatherings to semi-formal events.',
  2499.00,
  3199.00,
  22,
  'Women''s Kurtis',
  'YUR-PS-010',
  41,
  now(),
  now()
);

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
  ('10', 'https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?w=800', 'Palazzo Set Kurti - Front View', true, 1),
  ('10', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', 'Palazzo Set Kurti - Side View', false, 2),
  ('10', 'https://images.unsplash.com/photo-1610652492500-ded49ceae0e6?w=800', 'Palazzo Set Kurti - Detail View', false, 3),
  ('10', 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=800', 'Palazzo Set Kurti - Back View', false, 4),
  ('10', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800', 'Palazzo Set Kurti - Full Set', false, 5);

INSERT INTO product_sizes (product_id, size_name, size_value, is_available)
VALUES
  ('10', 'XS', 'XS', true),
  ('10', 'S', 'S', true),
  ('10', 'M', 'M', true),
  ('10', 'L', 'L', true),
  ('10', 'XL', 'XL', true),
  ('10', 'XXL', 'XXL', true);

INSERT INTO product_colors (product_id, color_name, color_hex, is_available)
VALUES
  ('10', 'Aqua Blue', '#00FFFF', true),
  ('10', 'Lilac', '#C8A2C8', true),
  ('10', 'Coral', '#FF7F50', true);

INSERT INTO product_specifications (product_id, spec_name, spec_value)
VALUES
  ('10', 'Fabric', '100% Rayon'),
  ('10', 'Fit', 'Short Kurti with Palazzo'),
  ('10', 'Sleeve', 'Cold Shoulder'),
  ('10', 'Length', 'Hip Length Kurti'),
  ('10', 'Occasion', 'Casual & Party'),
  ('10', 'Set Includes', 'Kurti + Palazzo'),
  ('10', 'Care', 'Machine Wash Cold');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify your data was inserted correctly

-- Check products count
-- SELECT COUNT(*) as total_products FROM products;

-- Check images count
-- SELECT COUNT(*) as total_images FROM product_images;

-- Check sizes count
-- SELECT COUNT(*) as total_sizes FROM product_sizes;

-- Check colors count
-- SELECT COUNT(*) as total_colors FROM product_colors;

-- Check specifications count
-- SELECT COUNT(*) as total_specs FROM product_specifications;

-- View complete product with all related data
-- SELECT 
--   p.name,
--   p.price,
--   COUNT(DISTINCT pi.id) as image_count,
--   COUNT(DISTINCT ps.id) as size_count,
--   COUNT(DISTINCT pc.id) as color_count,
--   COUNT(DISTINCT psp.id) as spec_count
-- FROM products p
-- LEFT JOIN product_images pi ON p.id = pi.product_id
-- LEFT JOIN product_sizes ps ON p.id = ps.product_id
-- LEFT JOIN product_colors pc ON p.id = pc.product_id
-- LEFT JOIN product_specifications psp ON p.id = psp.product_id
-- GROUP BY p.id, p.name, p.price
-- ORDER BY p.id;
