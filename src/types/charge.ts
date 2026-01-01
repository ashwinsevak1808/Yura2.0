
export interface Charge {
    id: string;
    created_at: string;
    name: string;
    label: string;
    type: 'fixed' | 'percentage';
    amount: number;
    is_active: boolean;
    min_cart_value: number;
    max_cart_value?: number; // Optional
    description?: string;
}
