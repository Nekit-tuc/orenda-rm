"use client";

import { useEffect } from "react";
import { analyticsEvents } from "@/lib/analytics";

type ObjectAnalyticsProps = {
  id: number;
  slug: string;
  type: string;
  city?: string;
  district?: string;
  dealType: string;
};

export default function ObjectAnalytics({
  id,
  slug,
  type,
  city,
  district,
  dealType,
}: ObjectAnalyticsProps) {
  useEffect(() => {
    analyticsEvents.objectView({
      id,
      slug,
      type,
      city,
      district,
      deal_type: dealType,
    });
  }, [city, dealType, district, id, slug, type]);

  return null;
}
