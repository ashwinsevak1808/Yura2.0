"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Dialog, DialogType } from '@/components/ui/dialog';

interface DialogOptions {
    title: string;
    description: string;
    type?: DialogType;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

interface DialogContextType {
    showDialog: (options: DialogOptions) => void;
    showSuccess: (title: string, description: string) => void;
    showError: (title: string, description: string) => void;
    showConfirm: (title: string, description: string, onConfirm: () => void) => void;
    closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogConfig, setDialogConfig] = useState<DialogOptions>({
        title: "",
        description: "",
        type: "info"
    });

    const closeDialog = useCallback(() => {
        setIsOpen(false);
    }, []);

    const showDialog = useCallback((options: DialogOptions) => {
        setDialogConfig(options);
        setIsOpen(true);
    }, []);

    const showSuccess = useCallback((title: string, description: string) => {
        showDialog({ title, description, type: 'success', confirmText: "Okay" });
    }, [showDialog]);

    const showError = useCallback((title: string, description: string) => {
        showDialog({ title, description, type: 'error', confirmText: "Close" });
    }, [showDialog]);

    const showConfirm = useCallback((title: string, description: string, onConfirm: () => void) => {
        showDialog({
            title,
            description,
            type: 'confirm',
            onConfirm,
            confirmText: "Proceed",
            cancelText: "Cancel"
        });
    }, [showDialog]);

    return (
        <DialogContext.Provider value={{ showDialog, showSuccess, showError, showConfirm, closeDialog }}>
            {children}
            <Dialog
                isOpen={isOpen}
                onClose={closeDialog}
                {...dialogConfig}
            />
        </DialogContext.Provider>
    );
}

export function useDialog() {
    const context = useContext(DialogContext);
    if (context === undefined) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
}
