-- ==============================================
-- BULK UPDATE SCRIPT FOR PRODUCTS & INVENTORY
-- ==============================================

BEGIN;

-- 1. Royal Indigo Banarasi Fusion Kurti
-- ID: 199c918e-9383-4d77-bc93-dca7271100b8
UPDATE products 
SET 
  meta_title = 'Royal Indigo Banarasi Fusion Kurti | Premium Art Silk',
  meta_description = 'Shop the Royal Indigo Banarasi Fusion Kurti. Exquisite Art Silk with intricate Zari booti work. A perfect blend of heritage and contemporary style.',
  meta_keywords = 'banarasi kurti, indigo silk kurti, festive wear, fusion ethnic wear',
  og_title = 'Royal Indigo Banarasi Fusion Kurti - YURA',
  og_description = 'Elegant Art Silk kurti with Zari glimmers. Perfect for festive evenings.',
  twitter_title = 'Royal Indigo Banarasi Fusion Kurti',
  twitter_description = 'Elegant Art Silk kurti with Zari glimmers. Perfect for festive evenings.',
  inventory = 40 -- 4 sizes * 10 stock
WHERE id = '199c918e-9383-4d77-bc93-dca7271100b8';

-- Update Sizes (Set 10 stock for each size)
INSERT INTO product_sizes (product_id, size, stock) 
VALUES 
  ('199c918e-9383-4d77-bc93-dca7271100b8', 'S', 10),
  ('199c918e-9383-4d77-bc93-dca7271100b8', 'M', 10),
  ('199c918e-9383-4d77-bc93-dca7271100b8', 'L', 10),
  ('199c918e-9383-4d77-bc93-dca7271100b8', 'XL', 10)
ON CONFLICT (product_id, size) DO UPDATE SET stock = 10;


-- 2. The Heritage "Mayura" Kurti
-- ID: 0a09e823-9720-4f67-96c4-82178d2d3a7f
UPDATE products 
SET 
  meta_title = 'The Heritage Mayura Kurti | Indigo High-Low Tunic',
  meta_description = 'Discover the Heritage Mayura Kurti. features a dramatic high-low hemline, premium silk-blend fabric, and antique gold zari work with peacock motifs.',
  meta_keywords = 'mayura kurti, peacock motif kurti, high low kurti, indigo festive wear',
  og_title = 'The Heritage Mayura Kurti - YURA',
  og_description = 'Dramatic high-low silhouette with intricate antique gold zari peacock motifs.',
  twitter_title = 'The Heritage Mayura Kurti',
  twitter_description = 'Dramatic high-low silhouette with intricate antique gold zari peacock motifs.',
  inventory = 40
WHERE id = '0a09e823-9720-4f67-96c4-82178d2d3a7f';

-- Update Sizes
INSERT INTO product_sizes (product_id, size, stock) 
VALUES 
  ('0a09e823-9720-4f67-96c4-82178d2d3a7f', 'S', 10),
  ('0a09e823-9720-4f67-96c4-82178d2d3a7f', 'M', 10),
  ('0a09e823-9720-4f67-96c4-82178d2d3a7f', 'L', 10),
  ('0a09e823-9720-4f67-96c4-82178d2d3a7f', 'XL', 10)
ON CONFLICT (product_id, size) DO UPDATE SET stock = 10;


-- 3. The Lakeside "Sarovar" Kurti
-- ID: d82f394a-6a34-45ba-b708-1bb35a568a2d
UPDATE products 
SET 
  meta_title = 'Lakeside Sarovar Kurti | Pastel Sage Anarkali',
  meta_description = 'The Lakeside Sarovar Kurti offers effortless grace with delicate pastel tones and hand-embroidered thread work. Ideal for daytime events.',
  meta_keywords = 'pastel kurti, sage green kurti, summer ethnic wear, casual anarkali',
  og_title = 'The Lakeside Sarovar Kurti - YURA',
  og_description = 'Delicate pastel tones with soft, hand-embroidered thread work for effortless grace.',
  twitter_title = 'The Lakeside Sarovar Kurti',
  twitter_description = 'Delicate pastel tones with soft, hand-embroidered thread work for effortless grace.',
  inventory = 40
WHERE id = 'd82f394a-6a34-45ba-b708-1bb35a568a2d';

-- Update Sizes
INSERT INTO product_sizes (product_id, size, stock) 
VALUES 
  ('d82f394a-6a34-45ba-b708-1bb35a568a2d', 'S', 10),
  ('d82f394a-6a34-45ba-b708-1bb35a568a2d', 'M', 10),
  ('d82f394a-6a34-45ba-b708-1bb35a568a2d', 'L', 10),
  ('d82f394a-6a34-45ba-b708-1bb35a568a2d', 'XL', 10)
ON CONFLICT (product_id, size) DO UPDATE SET stock = 10;


-- 4. The "Gulabi Sarovar" Journey
-- ID: 8d887705-cd61-4495-9857-9f37dbb0a339
UPDATE products 
SET 
  name = 'The Gulabi Sarovar Journey', -- Fixed typo 'Jounrey'
  meta_title = 'Gulabi Sarovar Journey | Pink A-Line Kurti',
  meta_description = 'Experience soft femininity with the Gulabi Sarovar Journey. A perfect blend of comfort and high-fashion for numbers matching nature''s beauty.',
  meta_keywords = 'pink kurti, a-line kurti, floral tunic, ethnic comfort wear',
  og_title = 'The Gulabi Sarovar Journey - YURA',
  og_description = 'Experience the perfect blend of comfort and high-fashion with this floral piece.',
  twitter_title = 'The Gulabi Sarovar Journey',
  twitter_description = 'Experience the perfect blend of comfort and high-fashion with this floral piece.',
  inventory = 60 -- 6 sizes * 10 stock
WHERE id = '8d887705-cd61-4495-9857-9f37dbb0a339';

-- Update Sizes (Has XS and XXL too)
INSERT INTO product_sizes (product_id, size, stock) 
VALUES 
  ('8d887705-cd61-4495-9857-9f37dbb0a339', 'XS', 10),
  ('8d887705-cd61-4495-9857-9f37dbb0a339', 'S', 10),
  ('8d887705-cd61-4495-9857-9f37dbb0a339', 'M', 10),
  ('8d887705-cd61-4495-9857-9f37dbb0a339', 'L', 10),
  ('8d887705-cd61-4495-9857-9f37dbb0a339', 'XL', 10),
  ('8d887705-cd61-4495-9857-9f37dbb0a339', 'XXL', 10)
ON CONFLICT (product_id, size) DO UPDATE SET stock = 10;


-- 5. The "Gulabi Sarovar" Tunic
-- ID: af9e9de6-a1c5-40f6-ab72-29c7caebf0e4
UPDATE products 
SET 
  meta_title = 'Gulabi Sarovar Tunic | Elegant Pink Anarkali',
  meta_description = 'The Gulabi Sarovar Tunic offers soft femininity and natural grace. Designed for the woman who finds peace in nature.',
  meta_keywords = 'pink tunic, indian tunic, anarkali kurti, festive pink wear',
  og_title = 'The Gulabi Sarovar Tunic - YURA',
  og_description = 'Soft femininity and natural grace in a premium Anarkali silhouette.',
  twitter_title = 'The Gulabi Sarovar Tunic',
  twitter_description = 'Soft femininity and natural grace in a premium Anarkali silhouette.',
  inventory = 40
WHERE id = 'af9e9de6-a1c5-40f6-ab72-29c7caebf0e4';

-- Update Sizes
INSERT INTO product_sizes (product_id, size, stock) 
VALUES 
  ('af9e9de6-a1c5-40f6-ab72-29c7caebf0e4', 'S', 10),
  ('af9e9de6-a1c5-40f6-ab72-29c7caebf0e4', 'M', 10),
  ('af9e9de6-a1c5-40f6-ab72-29c7caebf0e4', 'L', 10),
  ('af9e9de6-a1c5-40f6-ab72-29c7caebf0e4', 'XL', 10)
ON CONFLICT (product_id, size) DO UPDATE SET stock = 10;


-- 6. Hand Block Print Kurti
-- ID: be06b9d0-f287-4290-a783-43a744a377b2
UPDATE products 
SET 
  meta_title = 'Hand Block Print Kurti | Authentic Artisan Made',
  meta_description = 'Authentic hand block printed kurti using natural dyes. Handcrafted by skilled artisans featuring traditional Indian motifs.',
  meta_keywords = 'hand block print, cotton kurti, artisan made, sustainable fashion',
  og_title = 'Hand Block Print Kurti - YURA',
  og_description = 'Authentic hand block printed kurti crafted by skilled artisans using natural dyes.',
  twitter_title = 'Hand Block Print Kurti',
  twitter_description = 'Authentic hand block printed kurti crafted by skilled artisans using natural dyes.',
  inventory = 40
WHERE id = 'be06b9d0-f287-4290-a783-43a744a377b2';

-- This one had NO SIZES in the JSON, so let's add them
INSERT INTO product_sizes (product_id, size, stock) 
VALUES 
  ('be06b9d0-f287-4290-a783-43a744a377b2', 'S', 10),
  ('be06b9d0-f287-4290-a783-43a744a377b2', 'M', 10),
  ('be06b9d0-f287-4290-a783-43a744a377b2', 'L', 10),
  ('be06b9d0-f287-4290-a783-43a744a377b2', 'XL', 10)
ON CONFLICT (product_id, size) DO UPDATE SET stock = 10;


COMMIT;
