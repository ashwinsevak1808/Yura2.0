export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  full_description: string | null;

  price: number;
  original_price: number | null;
  discount: number | null;

  category: string | null;
  sku: string | null;
  inventory: number;

  is_active: boolean;
  created_at: string;
  updated_at: string;

  sizes: {
    size: string;
    stock: number; // Stock for this specific size
  }[];
  colors: {
    color_name: string;
    color_hex: string;
    in_stock: boolean;
  }[];
  images: {
    image_url: string;
    is_primary: boolean;
  }[];
  specifications: {
    spec_name: string;
    spec_value: string;
  }[];

  reviews: {
    rating: number | null;
    review_count: number | null;
  } | null;

  // SEO Metadata
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;

  // Open Graph (Facebook, LinkedIn, etc.)
  og_image?: string | null;
  og_title?: string | null;
  og_description?: string | null;

  // Twitter Card
  twitter_card?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: string | null;
}
