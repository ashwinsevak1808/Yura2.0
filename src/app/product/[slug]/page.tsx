import { Metadata } from "next";
import { getProductBySlug, getProducts } from "@/services/products.service";
import ProductDetailClient from "@/components/product/product-detail-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params; // Await params in newer Next.js versions
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.description,
    openGraph: {
      title: product.og_title || product.meta_title || product.name,
      description: product.og_description || product.meta_description || product.description || undefined,
      images: product.og_image ? [{ url: product.og_image }] : product.images?.[0]?.image_url ? [{ url: product.images[0].image_url }] : [],
    },
    twitter: {
      card: (product.twitter_card as "summary" | "summary_large_image") || "summary_large_image",
      title: product.twitter_title || product.name,
      description: product.twitter_description || product.description || undefined,
      images: product.twitter_image ? [product.twitter_image] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    // We can render the client component with null product to show "Not Found" UI
    // or return a standard Next.js notFound()
    return <ProductDetailClient product={null as any} relatedProducts={[]} />;
  }

  // Fetch related products (logic preserved from original)
  const related = await getProducts({ category: product.category || undefined });
  const relatedProducts = related.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}