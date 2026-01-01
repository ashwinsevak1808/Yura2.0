import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Additional Charges',
};

export default function ChargesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
