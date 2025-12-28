"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X, Search } from "lucide-react";
import { MainLayout } from "@/components/layout/main_layout";
import { getProducts, ProductFilters } from "@/services/products.service";
import { Product } from "@/types";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

// Premium Search Component - Minimal Border Bottom
const PremiumSearch = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
    return (
        <div className="relative w-full group">
            <input
                type="text"
                placeholder="Search collection..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-0 pr-8 py-3 bg-transparent border-b border-gray-200 text-base font-light
                         placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
            <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
        </div>
    );
};

// Price Range Filter - Clean Inputs
const PriceRangeFilter = ({ min, max, onChange }: { min: number; max: number; onChange: (min: number, max: number) => void }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Price Range</h3>
            <div className="flex items-center gap-4">
                <input
                    type="number"
                    value={min || ''}
                    onChange={(e) => onChange(Number(e.target.value), max)}
                    className="w-full px-3 py-2 border-b border-gray-200 text-sm font-light
                             focus:outline-none focus:border-black transition-colors placeholder-gray-400 bg-transparent"
                    placeholder="Min"
                />
                <span className="text-gray-300 font-light">—</span>
                <input
                    type="number"
                    value={max === 10000 ? '' : max}
                    onChange={(e) => onChange(min, Number(e.target.value))}
                    className="w-full px-3 py-2 border-b border-gray-200 text-sm font-light
                             focus:outline-none focus:border-black transition-colors placeholder-gray-400 bg-transparent"
                    placeholder="Max"
                />
            </div>
        </div>
    );
};

// Size Filter - Minimal Rectangles
const SizeFilter = ({ selected, onChange }: { selected: string[]; onChange: (size: string) => void }) => {
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

    return (
        <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Size</h3>
            <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                    <button
                        key={size}
                        onClick={() => onChange(size)}
                        className={`py-2 text-xs font-medium uppercase transition-all border ${selected.includes(size)
                            ? "border-black bg-black text-white"
                            : "border-gray-200 text-gray-900 hover:border-black"
                            }`}
                    >
                        {size}
                    </button>
                ))}
            </div>
        </div>
    );
};

function CollectionsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Filter State
    const [category, setCategory] = useState(searchParams.get("category") || "All");
    const [minPrice, setMinPrice] = useState(Number(searchParams.get("minPrice")) || 0);
    const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice")) || 10000);
    const [selectedSizes, setSelectedSizes] = useState<string[]>(searchParams.get("sizes")?.split(",").filter(Boolean) || []);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">((searchParams.get("sort") as any) || "newest");

    // Check if accessed via offer link
    const isOfferPage = searchParams.get("offer") === "launch";

    // Fetch Products
    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            const filters: ProductFilters = {
                category: category === "All" ? undefined : category,
                minPrice: minPrice > 0 ? minPrice : undefined,
                maxPrice: maxPrice < 10000 ? maxPrice : undefined,
                sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
                search: searchQuery || undefined,
                sort: sortBy,
            };

            const data = await getProducts(filters);
            setProducts(data);
            setLoading(false);
        }

        fetchProducts();
    }, [category, minPrice, maxPrice, selectedSizes, searchQuery, sortBy]);

    // Update URL
    useEffect(() => {
        const params = new URLSearchParams();
        if (category && category !== "All") params.set("category", category);
        if (minPrice > 0) params.set("minPrice", minPrice.toString());
        if (maxPrice < 10000) params.set("maxPrice", maxPrice.toString());
        if (selectedSizes.length > 0) params.set("sizes", selectedSizes.join(","));
        if (searchQuery) params.set("search", searchQuery);
        if (sortBy !== "newest") params.set("sort", sortBy);

        router.replace(`/collections?${params.toString()}`, { scroll: false });
    }, [category, minPrice, maxPrice, selectedSizes, searchQuery, sortBy, router]);

    const toggleSize = (size: string) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter((s) => s !== size));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
    };

    const clearAllFilters = () => {
        setCategory("All");
        setMinPrice(0);
        setMaxPrice(10000);
        setSelectedSizes([]);
        setSearchQuery("");
    };

    const activeFiltersCount =
        (category !== "All" ? 1 : 0) +
        (minPrice > 0 || maxPrice < 10000 ? 1 : 0) +
        selectedSizes.length;

    // Get unique categories from actual products
    const categories = ["All", ...Array.from(new Set(products.map(p => p.category))).filter((c): c is string => typeof c === "string" && c !== "" && c !== null && c !== undefined)];

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Mobile Filter Overlay */}
            {isMobileFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileFiltersOpen(false)}
                    />
                    <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                                <h2 className="text-base font-bold uppercase tracking-widest text-black">Filters</h2>
                                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-black hover:text-gray-600 transition-colors p-1">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                                {/* Active Filters Count */}
                                {activeFiltersCount > 0 && (
                                    <div className="bg-gray-50 px-4 py-3 rounded-lg flex items-center justify-between">
                                        <p className="text-sm text-gray-600">{activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied</p>
                                        <button
                                            onClick={clearAllFilters}
                                            className="text-xs text-black font-medium uppercase tracking-wider hover:underline"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Category</h3>
                                    <div className="space-y-2">
                                        {categories.map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => setCategory(c)}
                                                className={`w-full text-left py-3 px-4 text-sm font-light transition-all rounded-lg ${category === c
                                                    ? "bg-black text-white font-medium"
                                                    : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <PriceRangeFilter
                                    min={minPrice}
                                    max={maxPrice}
                                    onChange={(min, max) => { setMinPrice(min); setMaxPrice(max); }}
                                />
                                <SizeFilter selected={selectedSizes} onChange={toggleSize} />
                            </div>
                            <div className="border-t border-gray-100 px-6 py-6 bg-gray-50">
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                                >
                                    View {products.length} Products
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">
                {/* Hero / Header Section */}
                <div className="py-12 md:py-16 border-b border-gray-100 mb-12">
                    {/* Offer Banner */}
                    {isOfferPage && (
                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-400 p-6 mb-8 rounded-r-lg">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">🎉</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-black mb-1">LAUNCH OFFER - 25% OFF!</h3>
                                    <p className="text-sm text-gray-700 font-light">
                                        All products in this collection are eligible for our special launch discount of 25% OFF.
                                        Offer valid until Feb 26, 2026.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="max-w-4xl">
                        <p className="text-xs font-bold text-black mb-4 uppercase tracking-widest">
                            Collection 2025
                        </p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-black mb-6 leading-tight">
                            Latest Arrivals
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base font-light max-w-2xl leading-relaxed">
                            Explore our curated selection of premium fabrics and timeless designs, each piece crafted with meticulous attention to detail.
                        </p>
                    </div>
                </div>

                {/* Filters & Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-32 space-y-10">
                            {/* Quick Search in Sidebar */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Search</h3>
                                <PremiumSearch value={searchQuery} onChange={setSearchQuery} />
                            </div>

                            {/* Categories */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Categories</h3>
                                <ul className="space-y-3">
                                    {categories.map((c) => (
                                        <li key={c}>
                                            <button
                                                onClick={() => setCategory(c)}
                                                className={`text-sm transition-all hover:translate-x-1 inline-block ${category === c ? "text-black font-medium border-b border-black pb-0.5" : "text-gray-500 hover:text-black font-light"
                                                    }`}
                                            >
                                                {c}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <PriceRangeFilter
                                min={minPrice}
                                max={maxPrice}
                                onChange={(min, max) => { setMinPrice(min); setMaxPrice(max); }}
                            />
                            <SizeFilter selected={selectedSizes} onChange={toggleSize} />

                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-xs text-gray-400 hover:text-black uppercase tracking-widest border-b border-gray-200 hover:border-black transition-all pb-1"
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-9">

                        {/* Top Bar: Mobile Search + Sort + Count */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                            <div className="lg:hidden w-full sm:max-w-xs">
                                <PremiumSearch value={searchQuery} onChange={setSearchQuery} />
                            </div>

                            <p className="text-xs text-gray-500 font-light tracking-wide uppercase">
                                {products.length} {products.length === 1 ? 'Product' : 'Products'}
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="appearance-none bg-transparent pl-0 pr-6 py-2 text-xs font-medium uppercase tracking-widest cursor-pointer focus:outline-none border-b border-transparent hover:border-gray-200 transition-colors"
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-black">
                                        <span className="text-[8px]">▼</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsMobileFiltersOpen(true)}
                                    className="lg:hidden flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
                                >
                                    Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                                </button>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="flex items-center justify-center py-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-32 border border-dashed border-gray-200">
                                <h3 className="text-2xl font-serif text-black mb-3">No Products Found</h3>
                                <p className="text-sm text-gray-500 font-light mb-6">Try adjusting your filters or search terms</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm border-b border-black pb-1 hover:opacity-70 transition-opacity uppercase tracking-widest"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                                {products.map((product) => {
                                    const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
                                    return (
                                        <a
                                            key={product.id}
                                            href={`/product/${product.slug}`}
                                            className="group block"
                                        >
                                            {/* Image Container */}
                                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
                                                <ImageWithFallback
                                                    src={primaryImage?.image_url}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                                />
                                                {/* Badge */}
                                                {product.discount && (
                                                    <span className="absolute top-3 right-3 bg-white px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
                                                        Sale
                                                    </span>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="text-center space-y-2">
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                                                    {product.category}
                                                </p>
                                                <h3 className="font-serif text-lg text-black group-hover:underline decoration-gray-300 underline-offset-4 decoration-1 transition-all">
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-center justify-center gap-3 text-sm">
                                                    <span className="font-light text-gray-900">₹{product.price.toLocaleString()}</span>
                                                    {product.original_price && product.original_price > product.price && (
                                                        <span className="line-through text-gray-400 font-light text-xs">₹{product.original_price.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function CollectionsPage() {
    return (
        <MainLayout>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            }>
                <CollectionsContent />
            </Suspense>
        </MainLayout>
    );
}