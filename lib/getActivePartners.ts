import { supabase } from "@/lib/supabase";
import type { PublicPartner } from "@/types/partner";

export async function getActivePartners(): Promise<PublicPartner[]> {
  const { data, error } = await supabase
    .from("partners")
    .select("id, name, logo_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("ACTIVE PARTNERS LOAD ERROR:", error);
    return [];
  }

  return data || [];
}
