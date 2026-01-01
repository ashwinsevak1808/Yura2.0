import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Order Confirmed',
};

export default function OrderConfirmedLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
