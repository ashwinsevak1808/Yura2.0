"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminService } from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Upload } from "lucide-react";

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        original_price: "",
        category: "Anarkali",
        stock: "10",
    });
    const [sizes, setSizes] = useState<string[]>(["S", "M", "L", "XL"]);
    const [colors, setColors] = useState<{ name: string; hex: string }[]>([
        { name: "Red", hex: "#FF0000" },
    ]);
    const [images, setImages] = useState<File[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Auto-generate slug from name
        if (name === "name") {
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
            // Upload images first
            const imageUrls = await Promise.all(
                images.map((file) => AdminService.uploadProductImage(file))
            );

            const productData = {
                ...formData,
                price: Number(formData.price),
                original_price: formData.original_price ? Number(formData.original_price) : null,
                stock: Number(formData.stock),
                sizes,
                colors,
                images: imageUrls.map((url, index) => ({
                    image_url: url,
                    is_primary: index === 0
                }))
            };

            await AdminService.createProduct(productData);
            router.push("/admin/products");
        } catch (error) {
            console.error("Failed to create product", error);
            alert("Failed to create product. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Add New Product</h1>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Input
                        label="Product Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                    />
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-2 border"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <Input
                        label="Price (₹)"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Original Price (₹)"
                        name="original_price"
                        type="number"
                        value={formData.original_price}
                        onChange={handleChange}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-2 border"
                        >
                            {["Anarkali", "Straight Cut", "A-Line", "Kurti Sets", "Block Print", "Casual"].map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="Stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Images */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
                        {images.map((file, index) => (
                            <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400" />
                            <span className="mt-2 text-sm text-gray-500">Upload</span>
                            <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>
                </div>

                {/* Sizes */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Sizes</h3>
                    <div className="flex flex-wrap gap-2">
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
                                className={`px-4 py-2 rounded-md text-sm font-medium border ${sizes.includes(size)
                                        ? "bg-gray-900 text-white border-transparent"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Colors */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Colors</h3>
                    <div className="space-y-3">
                        {colors.map((color, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <Input
                                    placeholder="Color Name"
                                    value={color.name}
                                    onChange={(e) => updateColor(index, "name", e.target.value)}
                                    className="flex-1"
                                />
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={color.hex}
                                        onChange={(e) => updateColor(index, "hex", e.target.value)}
                                        className="h-10 w-10 p-1 rounded border border-gray-300 cursor-pointer"
                                    />
                                    <Input
                                        value={color.hex}
                                        onChange={(e) => updateColor(index, "hex", e.target.value)}
                                        className="w-24"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeColor(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addColor} size="sm">
                            <Plus className="w-4 h-4 mr-2" /> Add Color
                        </Button>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                    <Button type="button" variant="ghost" onClick={() => router.back()} className="mr-4">
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={loading}>
                        Create Product
                    </Button>
                </div>
            </form>
        </div>
    );
}

import { Trash2 } from "lucide-react";
