


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."check_size_availability"("product_uuid" "uuid", "size_name" "text", "requested_quantity" integer DEFAULT 1) RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    available_stock INTEGER;
BEGIN
    SELECT stock INTO available_stock
    FROM product_sizes
    WHERE product_id = product_uuid AND size = size_name;
    
    RETURN COALESCE(available_stock, 0) >= requested_quantity;
END;
$$;


ALTER FUNCTION "public"."check_size_availability"("product_uuid" "uuid", "size_name" "text", "requested_quantity" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."decrement_product_inventory"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    item JSONB;
    product_id UUID;
    quantity INTEGER;
BEGIN
    -- Loop through all items in the order
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
    LOOP
        product_id := (item->>'product_id')::UUID;
        quantity := (item->>'quantity')::INTEGER;
        
        -- Decrement inventory
        UPDATE products
        SET inventory = inventory - quantity
        WHERE id = product_id;
        
        -- Check if inventory went negative (shouldn't happen with proper validation)
        IF (SELECT inventory FROM products WHERE id = product_id) < 0 THEN
            RAISE EXCEPTION 'Insufficient inventory for product %', product_id;
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."decrement_product_inventory"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."decrement_size_inventory"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    item JSONB;
    p_id UUID;
    qty INTEGER;
    size_name TEXT;
    new_stock INTEGER;
BEGIN
    INSERT INTO inventory_logs (order_id, message) VALUES (NEW.id, 'Trigger Started');

    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
    LOOP
        p_id := (item->>'product_id')::UUID;
        qty := (item->>'quantity')::INTEGER;
        size_name := (item->>'size');

        -- UPDATE SIZE STOCK
        UPDATE product_sizes ps
        SET stock = ps.stock - qty
        WHERE ps.product_id = p_id AND ps.size = size_name
        RETURNING stock INTO new_stock;
        
        -- LOG RESULT
        IF new_stock IS NOT NULL THEN
             INSERT INTO inventory_logs (order_id, product_id, size, message)
             VALUES (NEW.id, p_id, size_name, 'Stock Updated to ' || new_stock);
        ELSE
             INSERT INTO inventory_logs (order_id, product_id, size, message)
             VALUES (NEW.id, p_id, size_name, 'ERROR: Size Not Found');
        END IF;

        -- UPDATE TOTAL PRODUCT STOCK
        UPDATE products p
        SET inventory = (
            SELECT COALESCE(SUM(ps.stock), 0) FROM product_sizes ps WHERE ps.product_id = p_id
        ) WHERE p.id = p_id;
    END LOOP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."decrement_size_inventory"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."decrement_stock_on_order"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Decrease the specific size stock
    UPDATE product_sizes
    SET stock = stock - NEW.quantity
    WHERE product_id = NEW.product_id
    AND size = NEW.size;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."decrement_stock_on_order"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_product_total_stock"("product_uuid" "uuid") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    total_stock INTEGER;
BEGIN
    SELECT COALESCE(SUM(stock), 0) INTO total_stock
    FROM product_sizes
    WHERE product_id = product_uuid;
    
    RETURN total_stock;
END;
$$;


ALTER FUNCTION "public"."get_product_total_stock"("product_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."restore_product_inventory"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    item JSONB;
    product_id UUID;
    quantity INTEGER;
BEGIN
    -- Only restore if status changed to cancelled or refunded
    IF (NEW.status IN ('cancelled', 'refunded') AND OLD.status NOT IN ('cancelled', 'refunded')) THEN
        -- Loop through all items in the order
        FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
        LOOP
            product_id := (item->>'product_id')::UUID;
            quantity := (item->>'quantity')::INTEGER;
            
            -- Restore inventory
            UPDATE products
            SET inventory = inventory + quantity
            WHERE id = product_id;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."restore_product_inventory"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."restore_size_inventory"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    item JSONB;
    product_id UUID;
    quantity INTEGER;
    size_name TEXT;
BEGIN
    -- Only restore if status changed to cancelled or refunded
    IF (NEW.status IN ('cancelled', 'refunded') AND OLD.status NOT IN ('cancelled', 'refunded')) THEN
        -- Loop through all items in the order
        FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
        LOOP
            product_id := (item->>'product_id')::UUID;
            quantity := (item->>'quantity')::INTEGER;
            size_name := item->>'size';
            
            -- Restore size-specific inventory
            UPDATE product_sizes
            SET stock = stock + quantity
            WHERE product_sizes.product_id = restore_size_inventory.product_id 
            AND product_sizes.size = size_name;
            
            -- Also update the main product inventory (total across all sizes)
            UPDATE products
            SET inventory = (
                SELECT COALESCE(SUM(stock), 0) 
                FROM product_sizes 
                WHERE product_sizes.product_id = restore_size_inventory.product_id
            )
            WHERE id = restore_size_inventory.product_id;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."restore_size_inventory"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_all_products"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    UPDATE products p
    SET inventory = (
        SELECT COALESCE(SUM(stock), 0)
        FROM product_sizes ps
        WHERE ps.product_id = p.id
    )
    WHERE EXISTS (SELECT 1 FROM product_sizes WHERE product_id = p.id);
END;
$$;


ALTER FUNCTION "public"."sync_all_products"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_product_inventory_from_sizes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Update the parent product's inventory to be the sum of all its sizes' stock
    UPDATE products
    SET inventory = (
        SELECT COALESCE(SUM(stock), 0)
        FROM product_sizes
        WHERE product_id = (CASE WHEN TG_OP = 'DELETE' THEN OLD.product_id ELSE NEW.product_id END)
    )
    WHERE id = (CASE WHEN TG_OP = 'DELETE' THEN OLD.product_id ELSE NEW.product_id END);
    
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_product_inventory_from_sizes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."charges" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "name" "text" NOT NULL,
    "label" "text" NOT NULL,
    "type" "text" NOT NULL,
    "amount" numeric NOT NULL,
    "is_active" boolean DEFAULT true,
    "min_cart_value" numeric DEFAULT 0,
    "max_cart_value" numeric,
    "description" "text",
    CONSTRAINT "charges_type_check" CHECK (("type" = ANY (ARRAY['fixed'::"text", 'percentage'::"text"])))
);


ALTER TABLE "public"."charges" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."inventory_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid",
    "product_id" "uuid",
    "size" "text",
    "qty" integer,
    "message" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."inventory_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "customer_name" "text" NOT NULL,
    "customer_email" "text" NOT NULL,
    "customer_phone" "text" NOT NULL,
    "shipping_address" "jsonb" NOT NULL,
    "special_instructions" "text",
    "items" "jsonb" NOT NULL,
    "subtotal" numeric(10,2) NOT NULL,
    "shipping_cost" numeric(10,2) DEFAULT 0 NOT NULL,
    "tax" numeric(10,2) DEFAULT 0 NOT NULL,
    "discount" numeric(10,2) DEFAULT 0 NOT NULL,
    "total_amount" numeric(10,2) NOT NULL,
    "payment_method" "text" NOT NULL,
    "payment_status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "razorpay_order_id" "text",
    "razorpay_payment_id" "text",
    "razorpay_signature" "text",
    "refund_id" "text",
    "refund_amount" numeric(10,2),
    "refund_status" "text",
    "refund_reason" "text",
    "refunded_at" timestamp with time zone,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "tracking_number" "text",
    "carrier" "text",
    "shipped_at" timestamp with time zone,
    "delivered_at" timestamp with time zone,
    "cancelled_at" timestamp with time zone,
    "cancellation_reason" "text",
    "notion_page_id" "text",
    "admin_notes" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "return_requested_at" timestamp with time zone,
    "return_reason" "text",
    "return_status" "text",
    CONSTRAINT "orders_payment_method_check" CHECK (("payment_method" = ANY (ARRAY['razorpay'::"text", 'cod'::"text", 'upi'::"text"]))),
    CONSTRAINT "orders_payment_status_check" CHECK (("payment_status" = ANY (ARRAY['pending'::"text", 'paid'::"text", 'failed'::"text", 'refunded'::"text", 'partially_refunded'::"text"]))),
    CONSTRAINT "orders_refund_status_check" CHECK (("refund_status" = ANY (ARRAY['pending'::"text", 'processed'::"text", 'failed'::"text"]))),
    CONSTRAINT "orders_return_status_check" CHECK (("return_status" = ANY (ARRAY['requested'::"text", 'approved'::"text", 'rejected'::"text", 'completed'::"text"]))),
    CONSTRAINT "orders_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'confirmed'::"text", 'processing'::"text", 'shipped'::"text", 'delivered'::"text", 'cancelled'::"text", 'refunded'::"text"])))
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


COMMENT ON COLUMN "public"."orders"."return_status" IS 'Status of the return request: requested, approved, rejected, completed';



CREATE OR REPLACE VIEW "public"."order_analytics" AS
 SELECT "date"("created_at") AS "order_date",
    "count"(*) AS "total_orders",
    "sum"("total_amount") AS "total_revenue",
    "avg"("total_amount") AS "average_order_value",
    "count"(
        CASE
            WHEN ("status" = 'delivered'::"text") THEN 1
            ELSE NULL::integer
        END) AS "delivered_orders",
    "count"(
        CASE
            WHEN ("status" = 'cancelled'::"text") THEN 1
            ELSE NULL::integer
        END) AS "cancelled_orders",
    "count"(
        CASE
            WHEN ("payment_status" = 'paid'::"text") THEN 1
            ELSE NULL::integer
        END) AS "paid_orders"
   FROM "public"."orders"
  GROUP BY ("date"("created_at"))
  ORDER BY ("date"("created_at")) DESC;


ALTER VIEW "public"."order_analytics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "order_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "quantity" integer NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "size" "text",
    "color" "text",
    "product_name" "text" NOT NULL
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."otp_verifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text",
    "otp_code" "text" NOT NULL,
    "is_verified" boolean DEFAULT false,
    "expires_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."otp_verifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" NOT NULL,
    "image_url" "text" NOT NULL,
    "is_primary" boolean DEFAULT false
);


ALTER TABLE "public"."product_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_sizes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" NOT NULL,
    "size" "text" NOT NULL,
    "stock" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."product_sizes" OWNER TO "postgres";


COMMENT ON COLUMN "public"."product_sizes"."stock" IS 'Stock quantity available for this specific size';



CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "full_description" "text",
    "price" numeric(10,2) NOT NULL,
    "original_price" numeric(10,2),
    "discount" integer,
    "category" "text",
    "sku" "text",
    "stock" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "inventory" integer DEFAULT 0 NOT NULL,
    "meta_title" "text",
    "meta_description" "text",
    "meta_keywords" "text",
    "og_image" "text",
    "og_title" "text",
    "og_description" "text",
    "twitter_card" "text" DEFAULT 'summary_large_image'::"text",
    "twitter_title" "text",
    "twitter_description" "text",
    "twitter_image" "text"
);


ALTER TABLE "public"."products" OWNER TO "postgres";


COMMENT ON COLUMN "public"."products"."meta_title" IS 'SEO meta title (max 60 chars recommended)';



COMMENT ON COLUMN "public"."products"."meta_description" IS 'SEO meta description (max 160 chars recommended)';



COMMENT ON COLUMN "public"."products"."meta_keywords" IS 'SEO keywords, comma-separated';



COMMENT ON COLUMN "public"."products"."og_image" IS 'Open Graph image URL for social sharing';



COMMENT ON COLUMN "public"."products"."og_title" IS 'Open Graph title for social sharing';



COMMENT ON COLUMN "public"."products"."og_description" IS 'Open Graph description for social sharing';



COMMENT ON COLUMN "public"."products"."twitter_card" IS 'Twitter card type (summary, summary_large_image, etc.)';



CREATE OR REPLACE VIEW "public"."product_inventory_summary" AS
 SELECT "p"."id" AS "product_id",
    "p"."name" AS "product_name",
    "p"."slug",
    "p"."inventory" AS "total_inventory",
    "ps"."id" AS "size_id",
    "ps"."size",
    "ps"."stock" AS "size_stock",
        CASE
            WHEN ("ps"."stock" > 0) THEN true
            ELSE false
        END AS "size_in_stock"
   FROM ("public"."products" "p"
     LEFT JOIN "public"."product_sizes" "ps" ON (("p"."id" = "ps"."product_id")))
  ORDER BY "p"."name", "ps"."size";


ALTER VIEW "public"."product_inventory_summary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_reviews_meta" (
    "product_id" "uuid" NOT NULL,
    "rating" numeric(3,2),
    "review_count" integer
);


ALTER TABLE "public"."product_reviews_meta" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_specifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" NOT NULL,
    "spec_name" "text" NOT NULL,
    "spec_value" "text" NOT NULL
);


ALTER TABLE "public"."product_specifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."testimonials" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "reviewer_name" "text" NOT NULL,
    "rating" integer NOT NULL,
    "review" "text" NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "testimonials_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."testimonials" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "user_roles_role_check" CHECK (("role" = ANY (ARRAY['admin'::"text", 'user'::"text"])))
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."charges"
    ADD CONSTRAINT "charges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."inventory_logs"
    ADD CONSTRAINT "inventory_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."otp_verifications"
    ADD CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_images"
    ADD CONSTRAINT "product_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_reviews_meta"
    ADD CONSTRAINT "product_reviews_meta_pkey" PRIMARY KEY ("product_id");



ALTER TABLE ONLY "public"."product_sizes"
    ADD CONSTRAINT "product_sizes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_sizes"
    ADD CONSTRAINT "product_sizes_product_id_size_key" UNIQUE ("product_id", "size");



ALTER TABLE ONLY "public"."product_specifications"
    ADD CONSTRAINT "product_specifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_sku_key" UNIQUE ("sku");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."testimonials"
    ADD CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_key" UNIQUE ("user_id");



CREATE INDEX "idx_orders_created_at" ON "public"."orders" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_orders_customer_email" ON "public"."orders" USING "btree" ("customer_email");



CREATE INDEX "idx_orders_customer_phone" ON "public"."orders" USING "btree" ("customer_phone");



CREATE INDEX "idx_orders_payment_status" ON "public"."orders" USING "btree" ("payment_status");



CREATE INDEX "idx_orders_razorpay_order_id" ON "public"."orders" USING "btree" ("razorpay_order_id");



CREATE INDEX "idx_orders_razorpay_payment_id" ON "public"."orders" USING "btree" ("razorpay_payment_id");



CREATE INDEX "idx_orders_status" ON "public"."orders" USING "btree" ("status");



CREATE INDEX "idx_otp_email" ON "public"."otp_verifications" USING "btree" ("email");



CREATE INDEX "idx_product_sizes_stock" ON "public"."product_sizes" USING "btree" ("stock");



CREATE INDEX "idx_products_inventory" ON "public"."products" USING "btree" ("inventory");



CREATE OR REPLACE TRIGGER "decrement_inventory_on_order" AFTER INSERT ON "public"."orders" FOR EACH ROW WHEN ((("new"."payment_status" = 'paid'::"text") OR ("new"."payment_method" = 'cod'::"text"))) EXECUTE FUNCTION "public"."decrement_product_inventory"();



CREATE OR REPLACE TRIGGER "decrement_stock_on_order_trigger" AFTER INSERT ON "public"."order_items" FOR EACH ROW EXECUTE FUNCTION "public"."decrement_stock_on_order"();



CREATE OR REPLACE TRIGGER "restore_inventory_on_cancellation" AFTER UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."restore_product_inventory"();



CREATE OR REPLACE TRIGGER "trg_products_updated" BEFORE UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_update_inventory_from_sizes" AFTER INSERT OR DELETE OR UPDATE ON "public"."product_sizes" FOR EACH ROW EXECUTE FUNCTION "public"."update_product_inventory_from_sizes"();



CREATE OR REPLACE TRIGGER "update_orders_updated_at" BEFORE UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."product_images"
    ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_reviews_meta"
    ADD CONSTRAINT "product_reviews_meta_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_sizes"
    ADD CONSTRAINT "product_sizes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_specifications"
    ADD CONSTRAINT "product_specifications_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admin Delete Products" ON "public"."products" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Admin Insert Products" ON "public"."products" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Admin Update Products" ON "public"."products" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Admin Write Images" ON "public"."product_images" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Admin Write Sizes" ON "public"."product_sizes" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Admin Write Specs" ON "public"."product_specifications" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Admins can manage all roles" ON "public"."user_roles" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles" "user_roles_1"
  WHERE (("user_roles_1"."user_id" = "auth"."uid"()) AND ("user_roles_1"."role" = 'admin'::"text")))));



CREATE POLICY "Allow Guest Create Items" ON "public"."order_items" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow Guest View Items" ON "public"."order_items" FOR SELECT USING (true);



CREATE POLICY "Allow admin write access" ON "public"."charges" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow public read access" ON "public"."charges" FOR SELECT USING (true);



CREATE POLICY "Enable Full Access for Admins Items" ON "public"."order_items" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable delete for authenticated users only" ON "public"."testimonials" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable insert for all users" ON "public"."order_items" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."testimonials" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable insert for everyone" ON "public"."order_items" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable insert for everyone" ON "public"."otp_verifications" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."testimonials" FOR SELECT USING (true);



CREATE POLICY "Enable select for everyone" ON "public"."order_items" FOR SELECT USING (true);



CREATE POLICY "Enable update for authenticated users only" ON "public"."testimonials" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Public Read Images" ON "public"."product_images" FOR SELECT USING (true);



CREATE POLICY "Public Read Products" ON "public"."products" FOR SELECT USING (true);



CREATE POLICY "Public Read Sizes" ON "public"."product_sizes" FOR SELECT USING (true);



CREATE POLICY "Public Read Specs" ON "public"."product_specifications" FOR SELECT USING (true);



CREATE POLICY "Service role can manage all orders" ON "public"."orders" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Users can read their own role" ON "public"."user_roles" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own orders" ON "public"."orders" FOR SELECT USING (("customer_email" = ("auth"."jwt"() ->> 'email'::"text")));



ALTER TABLE "public"."charges" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."otp_verifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_images" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_sizes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_specifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."testimonials" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."check_size_availability"("product_uuid" "uuid", "size_name" "text", "requested_quantity" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."check_size_availability"("product_uuid" "uuid", "size_name" "text", "requested_quantity" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_size_availability"("product_uuid" "uuid", "size_name" "text", "requested_quantity" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."decrement_product_inventory"() TO "anon";
GRANT ALL ON FUNCTION "public"."decrement_product_inventory"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrement_product_inventory"() TO "service_role";



GRANT ALL ON FUNCTION "public"."decrement_size_inventory"() TO "anon";
GRANT ALL ON FUNCTION "public"."decrement_size_inventory"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrement_size_inventory"() TO "service_role";



GRANT ALL ON FUNCTION "public"."decrement_stock_on_order"() TO "anon";
GRANT ALL ON FUNCTION "public"."decrement_stock_on_order"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrement_stock_on_order"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_product_total_stock"("product_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_product_total_stock"("product_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_product_total_stock"("product_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."restore_product_inventory"() TO "anon";
GRANT ALL ON FUNCTION "public"."restore_product_inventory"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."restore_product_inventory"() TO "service_role";



GRANT ALL ON FUNCTION "public"."restore_size_inventory"() TO "anon";
GRANT ALL ON FUNCTION "public"."restore_size_inventory"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."restore_size_inventory"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_all_products"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_all_products"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_all_products"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_product_inventory_from_sizes"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_product_inventory_from_sizes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_product_inventory_from_sizes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."charges" TO "anon";
GRANT ALL ON TABLE "public"."charges" TO "authenticated";
GRANT ALL ON TABLE "public"."charges" TO "service_role";



GRANT ALL ON TABLE "public"."inventory_logs" TO "anon";
GRANT ALL ON TABLE "public"."inventory_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."inventory_logs" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."order_analytics" TO "anon";
GRANT ALL ON TABLE "public"."order_analytics" TO "authenticated";
GRANT ALL ON TABLE "public"."order_analytics" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";
GRANT SELECT,INSERT ON TABLE "public"."order_items" TO "anon";



GRANT ALL ON TABLE "public"."otp_verifications" TO "anon";
GRANT ALL ON TABLE "public"."otp_verifications" TO "authenticated";
GRANT ALL ON TABLE "public"."otp_verifications" TO "service_role";



GRANT ALL ON TABLE "public"."product_images" TO "anon";
GRANT ALL ON TABLE "public"."product_images" TO "authenticated";
GRANT ALL ON TABLE "public"."product_images" TO "service_role";



GRANT ALL ON TABLE "public"."product_sizes" TO "anon";
GRANT ALL ON TABLE "public"."product_sizes" TO "authenticated";
GRANT ALL ON TABLE "public"."product_sizes" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."product_inventory_summary" TO "anon";
GRANT ALL ON TABLE "public"."product_inventory_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."product_inventory_summary" TO "service_role";



GRANT ALL ON TABLE "public"."product_reviews_meta" TO "anon";
GRANT ALL ON TABLE "public"."product_reviews_meta" TO "authenticated";
GRANT ALL ON TABLE "public"."product_reviews_meta" TO "service_role";



GRANT ALL ON TABLE "public"."product_specifications" TO "anon";
GRANT ALL ON TABLE "public"."product_specifications" TO "authenticated";
GRANT ALL ON TABLE "public"."product_specifications" TO "service_role";



GRANT ALL ON TABLE "public"."testimonials" TO "anon";
GRANT ALL ON TABLE "public"."testimonials" TO "authenticated";
GRANT ALL ON TABLE "public"."testimonials" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































