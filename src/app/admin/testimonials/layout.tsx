import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Testimonials',
};

export default function TestimonialLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
