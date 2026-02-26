import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbProduct = Tables<"products">;

export const useProducts = (category?: string | null) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let query = supabase.from("products").select("*").eq("in_stock", true);
      if (category) query = query.eq("category", category);
      const { data, error } = await query.order("name");
      if (error) throw error;
      return data as DbProduct[];
    },
  });
};

export const useProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) throw new Error("No product id");
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
      if (error) throw error;
      return data as DbProduct;
    },
    enabled: !!id,
  });
};
