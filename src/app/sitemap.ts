import { MetadataRoute } from 'next';
import { supabase } from '@/utils/supabse/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yura.co.in';

    // 1. Static Routes
    const routes = [
        '',
        '/cart',
        '/collections',
        '/information/our-story',
        '/information/shopping-guide',
        '/information/size-guide',
        '/information/returns',
        '/legal/privacy-policy',
        '/legal/terms-conditions',
        '/legal/cancellation-refund',
        '/legal/shipping-delivery',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Dynamic Product Routes
    const { data: products } = await supabase
        .from('products')
        .select('slug, updated_at');

    const productRoutes = (products || []).map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: product.updated_at,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...routes, ...productRoutes];
}
