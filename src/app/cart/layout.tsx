import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shopping Bag',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
