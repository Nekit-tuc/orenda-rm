export type Partner = {
  id: string;
  name: string;
  logo_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PublicPartner = Pick<Partner, "id" | "name" | "logo_url">;
