import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Orders',
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
