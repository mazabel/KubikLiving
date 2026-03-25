export interface Suite {
  id: string;
  name: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  area_sqm: number;
  terrace_sqm: number | null;
  day_price: number;
  month_price: number;
  description: string | null;
  images: string[];
  tour_3d_url: string | null;
  video_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Space {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  category: 'included' | 'corporate' | 'optional' | 'additional';
  icon_name: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  key: string;
  title: string | null;
  content: string | null;
  content_json: Record<string, any> | null;
  updated_at: string;
}
