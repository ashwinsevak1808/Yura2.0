export interface Testimonial {
    id: string;
    reviewer_name: string;
    rating: number;
    review: string;
    is_active: boolean;
    created_at?: string;
}

export interface TestimonialFormData {
    reviewer_name: string;
    rating: number;
    review: string;
    is_active: boolean;
}
