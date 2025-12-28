"use client";

import { useState, useEffect } from "react";
import { TestimonialService } from "@/services/testimonial.service";
import { Testimonial } from "@/types/testimonial";
import { Trash2, Star, Plus } from "lucide-react";
import { useDialog } from "@/context/dialog-context";

export default function AdminTestimonialsPage() {
    const { showConfirm, showSuccess, showError } = useDialog();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        reviewer_name: "",
        rating: 5,
        review: "",
        is_active: true
    });

    useEffect(() => {
        loadTestimonials();
    }, []);

    async function loadTestimonials() {
        setLoading(true);
        const data = await TestimonialService.getAllTestimonials();
        setTestimonials(data);
        setLoading(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (rating: number) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await TestimonialService.createTestimonial(formData);

        if (result.success) {
            showSuccess("Success", "Testimonial added successfully!");
            // Reset form
            setFormData({
                reviewer_name: "",
                rating: 5,
                review: "",
                is_active: true
            });
            // Reload list
            loadTestimonials();
        } else {
            showError("Error", "Failed to add testimonial.");
        }
        setIsSubmitting(false);
    };

    const handleDelete = (id: string) => {
        showConfirm(
            "Delete Testimonial",
            "Are you sure you want to delete this review? This action cannot be undone.",
            async () => {
                const result = await TestimonialService.deleteTestimonial(id);
                if (result.success) {
                    showSuccess("Deleted", "Testimonial removed.");
                    loadTestimonials();
                } else {
                    showError("Error", "Failed to delete testimonial.");
                }
            }
        );
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        await TestimonialService.updateTestimonial(id, { is_active: !currentStatus });
        loadTestimonials();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-serif font-medium text-black tracking-tight">Testimonials</h1>
                <p className="mt-2 text-sm text-gray-500">Manage customer reviews and ratings.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add New Testimonial Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 border border-gray-200 shadow-lg sticky top-8 rounded-none">
                        <div className="mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-serif font-medium text-black">Add New Review</h2>
                            <p className="text-xs text-gray-500 mt-1">Fill in the details below to publish a new customer story.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-900">Reviewer Name</label>
                                <input
                                    type="text"
                                    name="reviewer_name"
                                    value={formData.reviewer_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Sarah Johnson"
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm p-3 focus:bg-white focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 transition-all outline-none rounded-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-900">Rating</label>
                                <div className="flex items-center gap-2 pt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleRatingChange(star)}
                                            className="focus:outline-none focus:scale-110 transition-transform group"
                                            title={`${star} Stars`}
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-colors ${star <= formData.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300 group-hover:text-yellow-200"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-2 text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{formData.rating}/5</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-900">Review Content</label>
                                <textarea
                                    name="review"
                                    value={formData.review}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    placeholder="Paste the testimonial text here..."
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm p-3 focus:bg-white focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 transition-all outline-none rounded-none resize-none leading-relaxed"
                                />
                            </div>

                            <div className="flex items-center justify-between bg-gray-50 p-4 border border-gray-200">
                                <div>
                                    <label className="text-sm font-bold text-gray-900 block">Visible on Website</label>
                                    <p className="text-xs text-gray-500 mt-0.5">Enable to show this review publicly.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.is_active ? 'bg-black' : 'bg-gray-200'
                                        }`}
                                    role="switch"
                                    aria-checked={formData.is_active}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.is_active ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                    />
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99] shadow-md hover:shadow-lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Publish Review
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List of Testimonials */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-100 shadow-sm">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Review List ({testimonials.length})</h3>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading reviews...</div>
                        ) : testimonials.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No reviews yet. Add one to get started.</div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {testimonials.map((item) => (
                                    <li key={item.id} className="p-6 hover:bg-gray-50 transition-colors group">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-serif font-medium text-lg text-black">{item.reviewer_name}</span>
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${item.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                                        {item.is_active ? "Active" : "Hidden"}
                                                    </span>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3 h-3 ${i < item.rating ? "fill-black text-black" : "text-gray-300"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed max-w-xl">"{item.review}"</p>
                                                <p className="text-xs text-gray-400">
                                                    Added on {new Date(item.created_at!).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => toggleStatus(item.id, item.is_active)}
                                                    className="text-xs font-medium text-gray-500 hover:text-black underline"
                                                >
                                                    {item.is_active ? "Hide" : "Show"}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Delete Review"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
