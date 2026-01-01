import { createClient } from "@/utils/supabse/client";
import { Charge } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export class ChargesService {
    /**
     * Get all charges (for admin)
     */
    static async getAllCharges() {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('charges')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Charge[];
    }

    /**
     * Get applicable charges for a cart value
     * Supports passing a specific client (e.g. admin client) for server-side usage
     */
    static async getApplicableCharges(cartTotal: number, client?: SupabaseClient | any) {
        // Use provided client (admin) OR create a fresh browser client
        const supabase = client || createClient();

        console.log("Fetching charges for cart total:", cartTotal);

        const { data, error } = await supabase
            .from('charges')
            .select('*')
            .eq('is_active', true);

        if (error) {
            console.error("Error fetching charges:", error);
            return [];
        }

        console.log("Raw charges fetched:", data);

        // Filter in memory for complex conditions (min/max)
        const filtered = (data as Charge[]).filter((charge: Charge) => {
            const aboveMin = cartTotal >= (charge.min_cart_value || 0);

            // Fix: Handle max_cart_value = null correctly. 
            // Postgres Returns null, JS might see it as null.
            // Condition: If max exists, cart must be LESS than max.
            const belowMax = (charge.max_cart_value === null || charge.max_cart_value === undefined)
                ? true
                : cartTotal < charge.max_cart_value;

            console.log(`Checking charge ${charge.name}: aboveMin=${aboveMin}, belowMax=${belowMax}, Cart=${cartTotal}, Min=${charge.min_cart_value}, Max=${charge.max_cart_value}`);
            return aboveMin && belowMax;
        });

        console.log("Filtered applicable charges:", filtered);
        return filtered;
    }

    /**
     * Calculate total extra charges
     */
    static calculateCharges(cartTotal: number, charges: Charge[]) {
        return charges.reduce((total, charge) => {
            if (charge.type === 'fixed') {
                return total + charge.amount;
            } else {
                return total + (cartTotal * (charge.amount / 100));
            }
        }, 0);
    }

    // Admin Methods
    static async createCharge(charge: Partial<Charge>) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('charges')
            .insert(charge)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async updateCharge(id: string, updates: Partial<Charge>) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('charges')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async deleteCharge(id: string) {
        const supabase = createClient();
        const { error } = await supabase
            .from('charges')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
}
