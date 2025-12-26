"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminService } from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-context";
import { Input } from "@/components/ui/input";
import { Plus, X, Upload, Trash2, ChevronDown } from "lucide-react";

interface ProductFormProps {
    initialData?: any;
    isEditMode?: boolean;
}

export function ProductForm({ initialData, isEditMode = false }: ProductFormProps) {
    const router = useRouter();
    const { showError } = useDialog();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        full_description: "",
        price: "",
        original_price: "",
        category: "Anarkali",
        stock: "10",
    });
    const [sizes, setSizes] = useState<string[]>(["S", "M", "L", "XL"]);
    const [isActive, setIsActive] = useState(true);
    const [colors, setColors] = useState<{ name: string; hex: string }[]>([
        { name: "Red", hex: "#FF0000" },
    ]);
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<any[]>([]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                slug: initialData.slug || "",
                description: initialData.description || "",
                full_description: initialData.full_description || "",
                price: initialData.price?.toString() || "",
                original_price: initialData.original_price?.toString() || "",
                category: initialData.category || "Anarkali",
                stock: initialData.stock?.toString() || "0",
            });
            setIsActive(initialData.is_active ?? true);

            if (initialData.sizes && initialData.sizes.length > 0) {
                setSizes(initialData.sizes.map((s: any) => s.size || s));
            }

            if (initialData.colors && initialData.colors.length > 0) {
                setColors(initialData.colors.map((c: any) => ({
                    name: c.color_name || c.name,
                    hex: c.color_hex || c.hex
                })));
            }

            if (initialData.images && initialData.images.length > 0) {
                setExistingImages(initialData.images);
            }
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "name" && !isEditMode) {
            setFormData((prev) => ({ ...prev, slug: value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") }));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages((prev) => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (id: number) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== id));
    };

    const addColor = () => {
        setColors([...colors, { name: "", hex: "#000000" }]);
    };

    const updateColor = (index: number, field: "name" | "hex", value: string) => {
        const newColors = [...colors];
        newColors[index] = { ...newColors[index], [field]: value };
        setColors(newColors);
    };

    const removeColor = (index: number) => {
        setColors(colors.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Upload new images first
            let newImageUrls: string[] = [];
            if (images.length > 0) {
                newImageUrls = await Promise.all(
                    images.map((file) => AdminService.uploadProductImage(file))
                );
            }

            const productData = {
                ...formData,
                price: Number(formData.price),
                original_price: formData.original_price ? Number(formData.original_price) : null,
                stock: Number(formData.stock),
                is_active: isActive,
                sizes,
                colors,
                newImages: newImageUrls.map((url, index) => ({
                    image_url: url,
                    is_primary: index === 0 && existingImages.length === 0
                })),
                keepImages: existingImages
            };

            if (isEditMode && initialData?.id) {
                await AdminService.updateProduct(initialData.id, productData);
            } else {
                const createPayload = {
                    ...productData,
                    images: newImageUrls.map((url, index) => ({
                        image_url: url,
                        is_primary: index === 0
                    }))
                };
                await AdminService.createProduct(createPayload);
            }

            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error("Failed to save product", error);
            showError("Operation Failed", "Failed to save product. Please check your network connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-medium text-black tracking-tight">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
                    <p className="mt-2 text-sm text-gray-500">{isEditMode ? 'Update product details and inventory.' : 'Create a new product in your catalog.'}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                    >
                        Cancel
                    </button>
                    <Button
                        onClick={handleSubmit}
                        isLoading={loading}
                        className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-none uppercase tracking-widest text-xs font-bold shadow-lg shadow-gray-200"
                    >
                        {isEditMode ? 'Update Product' : 'Publish Product'}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Information */}
                    <div className="bg-white p-8 border border-gray-100 shadow-sm relative group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 left-0 w-full h-1 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        <h2 className="text-xl font-serif font-medium text-black mb-6">General Information</h2>

                        <div className="space-y-6">
                            <Input
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="border-gray-200 focus:border-black rounded-none px-4 py-3 bg-gray-50/30 focus:bg-white transition-colors font-serif text-lg"
                            />
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                                    <div className="relative">
                                        <Input
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            required
                                            placeholder="auto-generated-slug"
                                            className="border-gray-200 focus:border-black rounded-none px-4 py-3 bg-gray-50 text-gray-500 font-mono text-xs"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Auto</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <div className="relative group">
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="appearance-none block w-full border border-gray-200 shadow-sm focus:border-black focus:ring-black sm:text-sm px-4 py-3 rounded-none bg-white transition-colors cursor-pointer text-gray-700"
                                        >
                                            {["Anarkali", "Straight Cut", "A-Line", "Kurti Sets", "Block Print", "Casual"].map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-hover:text-black transition-colors" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Short Description</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    className="block w-full border-gray-200 shadow-sm focus:border-black focus:ring-black sm:text-sm p-4 rounded-none resize-none bg-gray-50/30 focus:bg-white transition-colors"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Brief summary for product cards..."
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Full Description</label>
                                <textarea
                                    name="full_description"
                                    rows={8}
                                    className="block w-full border-gray-200 shadow-sm focus:border-black focus:ring-black sm:text-sm p-4 rounded-none resize-none bg-gray-50/30 focus:bg-white transition-colors"
                                    value={(formData as any).full_description || ""}
                                    onChange={handleChange}
                                    placeholder="Detailed product information..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-white p-8 border border-gray-100 shadow-sm group hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-serif font-medium text-black">Product Media</h2>
                            <span className="text-xs text-gray-400 uppercase tracking-widest">{existingImages.length + images.length} Images</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
                            {/* Existing Images */}
                            {existingImages.map((img) => (
                                <div key={img.id} className="relative aspect-[3/4] bg-gray-50 border border-gray-100 group/img">
                                    <img
                                        src={img.image_url}
                                        alt="Existing"
                                        className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(img.id)}
                                        className="absolute top-2 right-2 bg-white text-black p-1.5 opacity-0 group-hover/img:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                    {img.is_primary && <span className="absolute bottom-2 left-2 bg-black text-white text-[10px] uppercase font-bold px-1.5 py-0.5">Primary</span>}
                                </div>
                            ))}

                            {/* New Uploads */}
                            {images.map((file, index) => (
                                <div key={`new-${index}`} className="relative aspect-[3/4] bg-gray-50 border border-gray-100 group/img">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 bg-white text-black p-1.5 opacity-0 group-hover/img:opacity-100 transition-all hover:bg-black hover:text-white shadow-sm"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <span className="absolute bottom-2 right-2 bg-blue-500 text-white text-[10px] uppercase font-bold px-1.5 py-0.5">New</span>
                                </div>
                            ))}

                            <label className="flex flex-col items-center justify-center aspect-[3/4] border-2 border-dashed border-gray-200 bg-gray-50/50 cursor-pointer hover:border-black hover:bg-gray-50 transition-all group/upload col-span-1 sm:col-span-1">
                                <div className="p-3 rounded-full bg-white shadow-sm group-hover/upload:shadow-md transition-all text-gray-400 group-hover/upload:text-black group-hover/upload:scale-110 transform">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <span className="mt-3 text-xs font-bold text-gray-400 uppercase tracking-widest group-hover/upload:text-black transition-colors">Add Image</span>
                                <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <p className="text-xs text-gray-400">Recommended size: 1200x1600px. Formats: JPG, PNG, WEBP.</p>
                    </div>

                    {/* Variants */}
                    <div className="bg-white p-8 border border-gray-100 shadow-sm group hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-serif font-medium text-black mb-6">Variants</h2>

                        <div className="space-y-8">
                            {/* Sizes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Available Sizes</label>
                                <div className="flex flex-wrap gap-3">
                                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => {
                                                if (sizes.includes(size)) {
                                                    setSizes(sizes.filter((s) => s !== size));
                                                } else {
                                                    setSizes([...sizes, size]);
                                                }
                                            }}
                                            className={`w-12 h-12 flex items-center justify-center text-sm font-medium border transition-all ${sizes.includes(size)
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-gray-400 border-gray-200 hover:border-gray-400 hover:text-gray-600"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Available Colors</label>
                                <div className="space-y-3">
                                    {colors.map((color, index) => (
                                        <div key={index} className="flex items-center gap-4 bg-gray-50 p-2 border border-gray-100 hover:border-gray-300 transition-colors">
                                            <div className="relative">
                                                <input
                                                    type="color"
                                                    value={color.hex}
                                                    onChange={(e) => updateColor(index, "hex", e.target.value)}
                                                    className="h-10 w-10 p-0.5 border-none cursor-pointer bg-transparent"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Color Name (e.g. Navy Blue)"
                                                value={color.name}
                                                onChange={(e) => updateColor(index, "name", e.target.value)}
                                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium placeholder-gray-400"
                                            />
                                            <div className="flex items-center border-l border-gray-200 pl-4">
                                                <span className="text-gray-400 mr-1 text-xs font-mono">#</span>
                                                <input
                                                    type="text"
                                                    value={color.hex.replace('#', '')}
                                                    onChange={(e) => updateColor(index, "hex", '#' + e.target.value)}
                                                    className="w-20 bg-transparent border-none focus:ring-0 text-xs text-gray-600 font-mono uppercase"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeColor(index)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addColor}
                                        className="mt-2 text-xs font-bold uppercase tracking-widest text-black hover:opacity-70 border-b border-black pb-0.5 inline-flex items-center"
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> Add Another Color
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-8">
                    {/* Pricing */}
                    <div className="bg-white p-6 border border-gray-100 shadow-sm group hover:shadow-md transition-shadow">
                        <h2 className="text-lg font-serif font-medium text-black mb-6">Pricing</h2>
                        <div className="space-y-4">
                            <Input
                                label="Base Price (₹)"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="border-gray-200 focus:border-black rounded-none font-mono"
                            />
                            <Input
                                label="Original Price (₹)"
                                name="original_price"
                                type="number"
                                value={formData.original_price}
                                onChange={handleChange}
                                className="border-gray-200 focus:border-black rounded-none font-mono text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-white p-6 border border-gray-100 shadow-sm group hover:shadow-md transition-shadow">
                        <h2 className="text-lg font-serif font-medium text-black mb-6">Inventory</h2>
                        <Input
                            label="Stock Quantity"
                            name="stock"
                            type="number"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            className="border-gray-200 focus:border-black rounded-none font-mono"
                        />
                        <p className="mt-4 text-xs text-gray-400">
                            Managed automatically via orders. Manually adjusting this value will override current stock levels.
                        </p>
                    </div>

                    {/* Status */}
                    <div className="bg-white p-6 border border-gray-100 shadow-sm group hover:shadow-md transition-shadow">
                        <h2 className="text-lg font-serif font-medium text-black mb-4">Product Status</h2>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Active</span>
                            <button
                                type="button"
                                onClick={() => setIsActive(!isActive)}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? 'bg-black' : 'bg-gray-200'}`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'}`}
                                />
                            </button>
                        </div>
                        <p className="mt-4 text-xs text-gray-400">
                            Inactive products are hidden from the store but remain in the database.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
