"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, AlertCircle, Info } from "lucide-react";
import { ChargesService } from "@/services/charges.service";
import { Charge } from "@/types";
import { useDialog } from "@/context/dialog-context";

export default function ChargesPage() {
    const { showConfirm, showSuccess, showError } = useDialog();
    const [charges, setCharges] = useState<Charge[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Charge>>({
        name: "",
        label: "",
        type: "fixed",
        amount: 0,
        is_active: true,
        min_cart_value: 0,
        max_cart_value: undefined,
    });

    useEffect(() => {
        loadCharges();
    }, []);

    async function loadCharges() {
        setLoading(true);
        try {
            const data = await ChargesService.getAllCharges();
            setCharges(data);
        } catch (error: any) {
            console.error("Failed to load charges detailed:", error);
            // Check for specific Supabase error codes
            if (error?.code === '42P01') { // relation does not exist
                showError("Configuration Required", "The 'charges' table does not exist. Please run the migration script in Supabase.");
            } else {
                // Don't show generic error on first load to avoid noise if just empty
                // But valid connection errors should be logged
            }
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingId) {
                await ChargesService.updateCharge(editingId, formData);
                showSuccess("Success", "Charge updated successfully!");
            } else {
                await ChargesService.createCharge(formData);
                showSuccess("Success", "Charge added successfully!");
            }
            resetForm();
            loadCharges();
        } catch (error) {
            console.error("Failed to save charge", error);
            showError("Error", "Failed to save charge. Ensure the database table exists.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        showConfirm(
            "Delete Charge",
            "Are you sure you want to delete this additional charge? This will affect future order calculations.",
            async () => {
                try {
                    await ChargesService.deleteCharge(id);
                    showSuccess("Deleted", "Charge removed.");
                    loadCharges();
                } catch (error) {
                    showError("Error", "Failed to delete charge.");
                }
            }
        );
    };

    const openEdit = (charge: Charge) => {
        setEditingId(charge.id);
        setFormData({
            ...charge,
            max_cart_value: charge.max_cart_value || undefined // Handle null from DB
        });
        // Scroll to top to see form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await ChargesService.updateCharge(id, { is_active: !currentStatus });
            loadCharges();
        } catch (error) {
            showError("Error", "Failed to update status.");
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: "",
            label: "",
            type: "fixed",
            amount: 0,
            is_active: true,
            min_cart_value: 0,
            max_cart_value: undefined,
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-serif font-medium text-black tracking-tight">Additional Charges</h1>
                <p className="mt-2 text-sm text-gray-500">Manage extra fees like Shipping, Taxes, or Handling charges.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 border border-gray-200 shadow-lg sticky top-8 rounded-none">
                        <div className="mb-6 border-b border-gray-100 pb-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-serif font-medium text-black">
                                    {editingId ? "Edit Charge" : "Add New Charge"}
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">Configure charge details and conditions.</p>
                            </div>
                            {editingId && (
                                <button onClick={resetForm} className="text-xs text-red-500 hover:underline">
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-900">Internal Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. priority_shipping"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm p-3 focus:bg-white focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 transition-all outline-none rounded-none"
                                />
                                <p className="text-[10px] text-gray-400">Used for reference in code/logic.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-900">Display Label</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Priority Shipping"
                                    value={formData.label}
                                    onChange={e => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm p-3 focus:bg-white focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 transition-all outline-none rounded-none"
                                />
                                <p className="text-[10px] text-gray-400">This name will be shown to customers.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-900">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm p-3 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none rounded-none appearance-none"
                                    >
                                        <option value="fixed">Fixed (₹)</option>
                                        <option value="percentage">Percent (%)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-900">Value</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm p-3 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none rounded-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Info className="w-3 h-3 text-gray-400" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-900">Conditions</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-medium text-gray-500 mb-1">Min Cart Value</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.min_cart_value}
                                            onChange={e => setFormData({ ...formData, min_cart_value: parseFloat(e.target.value) })}
                                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm p-2 focus:bg-white focus:border-black outline-none rounded-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-medium text-gray-500 mb-1">Max Cart Value</label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="No Limit"
                                            value={formData.max_cart_value === undefined || formData.max_cart_value === null ? '' : formData.max_cart_value}
                                            onChange={e => setFormData({ ...formData, max_cart_value: e.target.value ? parseFloat(e.target.value) : undefined })}
                                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm p-2 focus:bg-white focus:border-black outline-none rounded-none"
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 italic">Example: Set Max Value 2000 to apply charge only for orders below ₹2000.</p>
                            </div>

                            <div className="flex items-center justify-between bg-gray-50 p-4 border border-gray-200">
                                <div>
                                    <label className="text-sm font-bold text-gray-900 block">Status</label>
                                    <p className="text-xs text-gray-500 mt-0.5">{formData.is_active ? 'Active on checkout' : 'Disabled'}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.is_active ? 'bg-black' : 'bg-gray-200'}`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.is_active ? 'translate-x-5' : 'translate-x-0'}`}
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
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        {editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        {editingId ? "Update Charge" : "Create Charge"}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-100 shadow-sm">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Active Configuration ({charges.length})</h3>
                        </div>

                        {loading ? (
                            <div className="p-12 flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                            </div>
                        ) : charges.length === 0 ? (
                            <div className="p-12 text-center border-b border-gray-50">
                                <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-gray-900 font-medium">No charges configured</h3>
                                <p className="text-sm text-gray-500 mt-1">Add your first charge using the form.</p>
                                <p className="text-xs text-gray-400 mt-2">Note: Ensure you have run the database migration.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {charges.map((charge) => (
                                    <li key={charge.id} className="p-6 hover:bg-gray-50 transition-colors group relative">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-serif font-medium text-lg text-black">{charge.label}</span>
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm ${charge.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                                        {charge.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 font-mono">{charge.name}</p>

                                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded">
                                                        <span className="text-[10px] font-bold uppercase text-gray-400">Value</span>
                                                        <span className="font-mono font-medium text-black">
                                                            {charge.type === 'fixed' ? `₹${charge.amount}` : `${charge.amount}%`}
                                                        </span>
                                                    </div>

                                                    {(charge.min_cart_value > 0 || charge.max_cart_value) && (
                                                        <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded">
                                                            <span className="text-[10px] font-bold uppercase text-gray-400">Condition</span>
                                                            <span className="text-xs">
                                                                {charge.min_cart_value > 0 && `> ₹${charge.min_cart_value}`}
                                                                {charge.min_cart_value > 0 && charge.max_cart_value && ' & '}
                                                                {charge.max_cart_value && `< ₹${charge.max_cart_value}`}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => toggleStatus(charge.id, charge.is_active)}
                                                    className="text-xs font-medium text-gray-500 hover:text-black underline px-2"
                                                >
                                                    {charge.is_active ? "Disable" : "Enable"}
                                                </button>
                                                <button
                                                    onClick={() => openEdit(charge)}
                                                    className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(charge.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors border border-transparent hover:border-red-100"
                                                    title="Delete"
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
