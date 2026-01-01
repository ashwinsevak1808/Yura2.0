import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Payment Failed',
};

export default function PaymentFailureLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
