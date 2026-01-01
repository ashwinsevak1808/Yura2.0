import { Metadata } from 'next';
import AdminSidebarWrapper from "@/components/admin/AdminSidebarWrapper";

export const metadata: Metadata = {
    title: {
        template: '%s | YURAA Admin',
        default: 'Admin Dashboard ',
    },
    description: 'Yuraa E-Commerce Administration',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminSidebarWrapper>
            {children}
        </AdminSidebarWrapper>
    );
}
