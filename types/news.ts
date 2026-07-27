export type RealEstateNews = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  image_url: string | null;
  published: boolean;
  featured: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type NewsFormPayload = {
  title: string;
  excerpt?: string | null;
  content?: string | null;
  category?: string | null;
  image_url?: string | null;
  published?: boolean;
  featured?: boolean;
  sort_order?: number;
  published_at?: string | null;
};
