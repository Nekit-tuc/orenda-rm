export const PROPERTY_LEAD_ACCESS_KEY = "orendarm_lead_access";

export function hasPropertyLeadAccess() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(PROPERTY_LEAD_ACCESS_KEY) === "true";
}

export function setPropertyLeadAccess() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PROPERTY_LEAD_ACCESS_KEY, "true");
}
