"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

type ViewCounterProps = {
  propertyId: number;
  currentViews: number;
};

export default function ViewCounter({
  propertyId,
  currentViews,
}: ViewCounterProps) {
  useEffect(() => {
    async function incrementViews() {
      await supabase
        .from("properties")
        .update({ views: currentViews + 1 })
        .eq("id", propertyId);
    }

    incrementViews();
  }, [propertyId, currentViews]);

  return null;
}