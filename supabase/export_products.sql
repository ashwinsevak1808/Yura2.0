-- Run this in Supabase SQL Editor to get a FULL JSON dump of all your products
SELECT json_agg(t) 
FROM (
  SELECT 
    p.id,
    p.name,
    p.slug,
    p.description,
    p.full_description, -- Using the correct column name now
    p.price,
    p.original_price,
    p.discount,
    p.category,
    p.sku,
    p.stock,
    p.inventory,
    p.meta_title,
    p.meta_description,
    p.meta_keywords,
    -- Get all images
    (
      SELECT json_agg(json_build_object(
        'id', pi.id,
        'image_url', pi.image_url,
        'is_primary', pi.is_primary
      )) 
      FROM product_images pi 
      WHERE pi.product_id = p.id
    ) as images,
    -- Get all sizes and stock
    (
      SELECT json_agg(json_build_object('size', ps.size, 'stock', ps.stock)) 
      FROM product_sizes ps 
      WHERE ps.product_id = p.id
    ) as sizes
  FROM products p
) t;
