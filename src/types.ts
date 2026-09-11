export interface SearchEngine {
  id: string;
  name: string;
  category: string;
  url: string; // URL template with %s placeholder
  icon?: string;
  description?: string;
  isCustom?: boolean;
  isPopular?: boolean;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name or emoji
  description: string;
  badgeColor?: string;
}

export interface HotTrendItem {
  id: string | number;
  title: string;
  url?: string;
  hotScore?: string;
  rank: number;
  category?: string;
  summary?: string;
}

export interface HotTrendCategory {
  id: string;
  name: string;
  icon: string;
  items: HotTrendItem[];
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  engineId: string;
  engineName: string;
  timestamp: number;
}

export type SearchMode = 'new_tab' | 'iframe';
