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
  stock: number;

  is_active: boolean;
  created_at: string;
  updated_at: string;

  sizes: { size: string }[];
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
}
  