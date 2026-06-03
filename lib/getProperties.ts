import { supabase } from "@/lib/supabase";
import { formatProperty } from "@/lib/formatProperty";
import type { Property } from "@/types/property";

export async function getProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "Активний")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  return (data as Property[]).map(formatProperty);
}