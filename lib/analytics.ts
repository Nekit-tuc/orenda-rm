export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";

type AnalyticsParams = Record<
  string,
  string | number | boolean | null | undefined
>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "config" | "event" | "js",
      targetId: string | Date,
      config?: AnalyticsParams,
    ) => void;
  }
}

function canTrack() {
  return typeof window !== "undefined" && Boolean(GA_MEASUREMENT_ID);
}

function sanitizeParams(params: AnalyticsParams = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null,
    ),
  );
}

function send(
  command: "config" | "event",
  targetId: string,
  params: AnalyticsParams = {},
) {
  if (!canTrack()) {
    return;
  }

  const cleanParams = sanitizeParams(params);

  if (window.gtag) {
    window.gtag(command, targetId, cleanParams);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push([command, targetId, cleanParams]);
}

export function pageview(path: string) {
  if (!canTrack()) {
    return;
  }

  send("config", GA_MEASUREMENT_ID, {
    page_path: path,
  });
}

export function event(name: string, params: AnalyticsParams = {}) {
  if (!canTrack()) {
    return;
  }

  send("event", name, params);
}

export const analyticsEvents = {
  phoneClick(params: AnalyticsParams = {}) {
    event("phone_click", params);
  },
  telegramClick(params: AnalyticsParams = {}) {
    event("telegram_click", params);
  },
  favoriteAdd(params: AnalyticsParams = {}) {
    event("favorite_add", params);
  },
  favoriteRemove(params: AnalyticsParams = {}) {
    event("favorite_remove", params);
  },
  contactClick(params: AnalyticsParams = {}) {
    event("contact_click", params);
  },
  generateLead(params: AnalyticsParams = {}) {
    event("generate_lead", params);
  },
  formSubmitError(params: AnalyticsParams = {}) {
    event("form_submit_error", params);
  },
  objectView(params: AnalyticsParams = {}) {
    event("object_view", params);
  },
  search(params: AnalyticsParams = {}) {
    event("search", params);
  },
  filterChange(params: AnalyticsParams = {}) {
    event("filter_change", params);
  },
};
