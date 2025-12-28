import { createClient } from "@/utils/supabse/client";
import { Testimonial, TestimonialFormData } from "@/types/testimonial";

export const TestimonialService = {
    // Fetch all active testimonials for the frontend
    async getActiveTestimonials(): Promise<Testimonial[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching testimonials:', error);
            return [];
        }

        return data || [];
    },

    // Fetch all testimonials for the admin panel
    async getAllTestimonials(): Promise<Testimonial[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching admin testimonials:', error);
            return [];
        }

        return data || [];
    },

    // Create a new testimonial
    async createTestimonial(data: TestimonialFormData): Promise<{ success: boolean; error?: any }> {
        const supabase = createClient();
        // Get the current user session to ensure RLS policies pass for authenticated inserts
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            console.error("No active session found during createTestimonial");
            // Depending on your RLS, you might return false here or let the database reject it.
            // Given the previous error was empty, checking session is good debugging.
        }

        const { error } = await supabase
            .from('testimonials')
            .insert([data]);

        if (error) {
            console.error('Error creating testimonial:', error);
            return { success: false, error };
        }

        return { success: true };
    },

    // Update an existing testimonial
    async updateTestimonial(id: string, data: Partial<TestimonialFormData>): Promise<{ success: boolean; error?: any }> {
        const supabase = createClient();
        const { error } = await supabase
            .from('testimonials')
            .update(data)
            .eq('id', id);

        if (error) {
            console.error('Error updating testimonial:', error);
            return { success: false, error };
        }

        return { success: true };
    },

    // Delete a testimonial
    async deleteTestimonial(id: string): Promise<{ success: boolean; error?: any }> {
        const supabase = createClient();
        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting testimonial:', error);
            return { success: false, error };
        }

        return { success: true };
    }
};
