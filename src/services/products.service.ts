import { Product } from "@/types";
import { supabase } from '@/utils/supabse/server';

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
  *,
  product_sizes(size),
  product_colors(color_name, color_hex, in_stock),
  product_images(image_url, is_primary),
  product_specifications(spec_name, spec_value),
  product_reviews_meta(rating, review_count)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }

  // Map Supabase response to frontend shape
  return data.map((product: any) => ({
    ...product,
    sizes: product.product_sizes,
    colors: product.product_colors,
    images: product.product_images,
    specifications: product.product_specifications,
    reviews: product.product_reviews_meta?.[0] ?? null
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
  *,
  product_sizes(size),
  product_colors(color_name, color_hex, in_stock),
  product_images(image_url, is_primary),
  product_specifications(spec_name, spec_value),
  product_reviews_meta(rating, review_count)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }

  return {
    ...data,
    sizes: data.product_sizes,
    colors: data.product_colors,
    images: data.product_images,
    specifications: data.product_specifications,
    reviews: data.product_reviews_meta?.[0] ?? null
  };
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  search?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc';
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`
  *,
  product_sizes(size),
  product_colors(color_name, color_hex, in_stock),
  product_images(image_url, is_primary),
  product_specifications(spec_name, spec_value),
  product_reviews_meta(rating, review_count)
    `)
    .eq('is_active', true);

  if (filters.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }

  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }

  if (filters.search) {
    query = query.ilike('name', `% ${filters.search}% `);
  }

  // Note: Filtering by related tables (sizes/colors) is complex in Supabase JS client directly 
  // without using !inner joins which can filter out the parent row. 
  // For simplicity in this demo, we'll fetch more and filter in memory if needed, 
  // or rely on the fact that we are filtering main product attributes.
  // A robust solution would use an RPC function or more complex query.

  if (filters.sort) {
    switch (filters.sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching filtered products:', error);
    return [];
  }

  let products = data.map((product: any) => ({
    ...product,
    sizes: product.product_sizes,
    colors: product.product_colors,
    images: product.product_images,
    specifications: product.product_specifications,
    reviews: product.product_reviews_meta?.[0] ?? null
  }));

  // In-memory filtering for array relationships (sizes/colors) if strict filtering is needed
  if (filters.sizes && filters.sizes.length > 0) {
    products = products.filter((p: Product) =>
      p.sizes.some(s => filters.sizes?.includes(s.size))
    );
  }

  if (filters.colors && filters.colors.length > 0) {
    products = products.filter((p: Product) =>
      p.colors.some(c => filters.colors?.includes(c.color_name))
    );
  }

  return products;
}
