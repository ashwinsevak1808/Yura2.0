"use client";

import { useEffect, useState } from "react";
import { AdminService } from "@/services/admin.service";
import { Product } from "@/types";
import { Plus, Edit, Trash2, LayoutGrid, List, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Pagination } from "@/components/ui/pagination";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [view, setView] = useState<'list' | 'grid'>('list');
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Good for grid (2, 3, 4 cols)

    useEffect(() => {
        async function loadProducts() {
            const data = await AdminService.getAllProducts();
            setProducts(data);
            setLoading(false);
        }

        loadProducts();
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, view]);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await AdminService.deleteProduct(id);
                setProducts(products.filter(p => p.id !== id));
            } catch (error: any) {
                if (error.message.includes("is part of existing customer orders")) {
                    if (confirm("This product cannot be deleted because it has been ordered by customers.\n\nWould you like to move it to 'Drafts' (hide from store) instead?")) {
                        try {
                            const productToUpdate = products.find(p => p.id === id);
                            if (productToUpdate) {
                                await AdminService.updateProduct(id, {
                                    ...productToUpdate,
                                    is_active: false
                                });
                                // Optimistic update
                                setProducts(products.map(p => p.id === id ? { ...p, is_active: false } : p));
                            }
                        } catch (archiveError) {
                            alert("Failed to archive product.");
                        }
                    }
                } else {
                    alert(error.message || "Failed to delete product");
                }
            }
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Calculate Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-medium text-black tracking-tight">Products</h1>
                    <p className="text-gray-500 mt-1">Manage your store's inventory and catalog.</p>
                </div>
                <button
                    onClick={() => router.push("/admin/products/new")}
                    className="flex items-center justify-center px-6 h-11 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 shadow-lg shadow-black/20 transition-all w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Product
                </button>
            </div>

            {/* Filters & Controls */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 border border-gray-200 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 h-11 bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 transition-all text-sm font-medium placeholder:text-gray-400"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-2 rounded-md transition-all ${view === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 rounded-md transition-all ${view === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {paginatedProducts.map((product) => {
                        const image = (product as any).product_images?.[0]?.image_url;
                        return (
                            <div key={product.id} className="group bg-white border border-gray-100 hover:border-black/20 transition-all duration-300">
                                <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300">
                                            <div className="text-center">
                                                <div className="mx-auto w-12 h-12 border-2 border-gray-200 rounded-full flex items-center justify-center mb-2">
                                                    <span className="text-2xl font-serif">Y</span>
                                                </div>
                                                <span className="text-xs uppercase tracking-widest">No Image</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                        <button
                                            onClick={() => router.push(`/admin/products/${product.id}`)}
                                            className="p-2 bg-white text-black hover:bg-black hover:text-white transition-colors shadow-lg"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 bg-white text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {!product.is_active && (
                                        <div className="absolute top-3 left-3 px-3 py-1 bg-black/80 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                                            Draft
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                                    <div className="mt-1 flex items-center justify-between">
                                        <p className="font-mono text-sm text-gray-500">₹{product.price}</p>
                                        <p className="text-xs text-gray-400 font-mono">Stock: {product.inventory}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Product</th>
                                <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Category</th>
                                <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Status</th>
                                <th scope="col" className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Stock</th>
                                <th scope="col" className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Price</th>
                                <th scope="col" className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {paginatedProducts.map((product) => {
                                const image = (product as any).product_images?.[0]?.image_url;
                                return (
                                    <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-12 w-10 flex-shrink-0">
                                                    {image ? (
                                                        <img className="h-12 w-10 object-cover border border-gray-100" src={image} alt="" />
                                                    ) : (
                                                        <div className="h-12 w-10 bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-serif text-gray-300">Y</div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors">{product.name}</div>
                                                    <div className="text-xs text-gray-400 font-mono">ID: {product.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                {product.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {product.is_active ? 'Active' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 font-mono">
                                            {product.inventory}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 font-mono">
                                            ₹{product.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => router.push(`/admin/products/${product.id}`)}
                                                    className="p-1.5 text-gray-400 hover:text-black transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
