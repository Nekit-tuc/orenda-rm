export type ClientLeadStatus =
  | "new"
  | "in_progress"
  | "contacted"
  | "closed"
  | "spam";

export type ClientLead = {
  id: string;
  property_id: number | null;
  property_slug: string | null;
  property_title: string | null;
  client_name: string;
  phone: string;
  status: ClientLeadStatus;
  admin_note: string | null;
  source: string;
  created_at: string;
  updated_at: string;
};
