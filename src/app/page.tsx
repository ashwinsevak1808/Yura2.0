import PremiumHeroBanner from "@/components/landing/hero";
import ProductGridSection from "../components/landing/product_listing";
import Testimonials from "../components/landing/reviews";
import { MainLayout } from "../components/layout/main_layout";
import { getAllProducts } from "@/services/products.service";

export default async function Home() {
  const products = await getAllProducts();

  return (
    <MainLayout>
      <PremiumHeroBanner products={products} />
      <ProductGridSection products={products} />
      <Testimonials />
    </MainLayout>
  );
}