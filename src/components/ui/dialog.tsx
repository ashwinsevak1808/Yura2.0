"use client";

import React, { useEffect, useState } from 'react';
import { X, Check, AlertCircle, Info } from 'lucide-react';
import { Button } from './button'; // Assuming Button exists based on list_dir

export type DialogType = 'success' | 'error' | 'info' | 'confirm';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    type?: DialogType;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

export function Dialog({
    isOpen,
    onClose,
    title,
    description,
    type = 'info',
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel"
}: DialogProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Animation duration
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    const isConfirm = type === 'confirm';

    // Status Colors & Icons
    const statusConfig = {
        success: {
            icon: Check,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-100",
            buttonBg: "bg-black hover:bg-gray-800"
        },
        error: {
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-100",
            buttonBg: "bg-red-600 hover:bg-red-700"
        },
        info: {
            icon: Info,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100",
            buttonBg: "bg-black hover:bg-gray-800"
        },
        confirm: {
            icon: Info,
            color: "text-black",
            bgColor: "bg-gray-50",
            borderColor: "border-gray-200",
            buttonBg: "bg-black hover:bg-gray-800"
        }
    };

    const config = statusConfig[type];
    const Icon = config.icon;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-white/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Dialog Panel */}
            <div className={`relative w-full max-w-sm bg-white border border-gray-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] overflow-hidden transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0"
                }`}>
                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className={`mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center ${config.bgColor}`}>
                        <Icon className={`w-8 h-8 ${config.color}`} strokeWidth={1.5} />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-serif text-black mb-3 text-balance">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-light mb-8 text-balance">
                        {description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                if (onConfirm) onConfirm();
                                onClose();
                            }}
                            className={`w-full py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition-all active:scale-95 ${config.buttonBg}`}
                        >
                            {confirmText}
                        </button>

                        {isConfirm && (
                            <button
                                onClick={onClose}
                                className="w-full py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-colors"
                            >
                                {cancelText}
                            </button>
                        )}

                        {/* Close button for non-confirm dialogs (X is nice but explicit Close/Dismiss is often clearer in centered layouts) */}
                        {!isConfirm && type !== 'success' && type !== 'error' && (
                            <button
                                onClick={onClose}
                                className="w-full py-2 text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-black transition-colors"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

