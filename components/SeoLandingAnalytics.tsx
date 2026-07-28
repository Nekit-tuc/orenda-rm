"use client";

import { useEffect, useRef } from "react";
import { analyticsEvents } from "@/lib/analytics";

type SeoLandingAnalyticsProps = {
  landingSlug: string;
  landingType: string;
  resultsCount: number;
};

export default function SeoLandingAnalytics({
  landingSlug,
  landingType,
  resultsCount,
}: SeoLandingAnalyticsProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) {
      return;
    }

    trackedRef.current = true;
    analyticsEvents.seoLandingView({
      landing_slug: landingSlug,
      landing_type: landingType,
      results_count: resultsCount,
      page_path: window.location.pathname,
    });
  }, [landingSlug, landingType, resultsCount]);

  return null;
}
