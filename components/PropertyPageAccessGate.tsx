"use client";

import { useEffect, useState } from "react";
import PropertyLeadModal from "@/components/PropertyLeadModal";
import { hasPropertyLeadAccess } from "@/lib/propertyLeadAccess";

type PropertyPageAccessGateProps = {
  propertyId: number;
  propertyTitle: string;
  propertySlug: string;
};

export default function PropertyPageAccessGate({
  propertyId,
  propertyTitle,
  propertySlug,
}: PropertyPageAccessGateProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setHasAccess(hasPropertyLeadAccess());
      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!isReady || hasAccess) {
    return null;
  }

  return (
    <PropertyLeadModal
      isOpen
      propertyId={propertyId}
      propertyTitle={propertyTitle}
      propertySlug={propertySlug}
      source="property_page"
      onSuccess={() => setHasAccess(true)}
    />
  );
}
