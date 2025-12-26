"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminService } from "@/services/admin.service";
import { ProductForm } from "@/components/admin/product-form";

export default function EditProductPage() {
    const params = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProduct() {
            if (params.id) {
                try {
                    const data = await AdminService.getProductById(params.id as string);
                    setProduct(data);
                } catch (error) {
                    console.error("Failed to load product", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        loadProduct();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return <ProductForm initialData={product} isEditMode={true} />;
}
