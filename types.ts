
export type Language = 'en' | 'ar';
export type Region = 'Global' | 'Egypt' | 'MENA' | 'All';
export type Category = 'Latest' | 'Startups' | 'Events' | 'Podcasts' | 'Newsletters' | 'Market' | 'Partners';

export interface PodcastAnalysis {
  id: string;
  url: string;
  podcastName: string;
  episodeTitle: string;
  score: number;
  reportContent?: string; // Optional generic content
  summary?: string;
  metrics?: { name: string; finding: string }[];
  recommendation?: string;
  date: string;
}

export interface TrendAnalysis {
    date: string;
    topics: {
        category: 'Business' | 'Finance' | 'Technology' | 'AI' | 'Entrepreneurship' | 'Investment';
        topic: string;
        summary: string;
        sentiment: 'Positive' | 'Neutral' | 'Mixed';
    }[];
    executiveSummary: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  favorites: string[]; // IDs of saved items
  preferences: {
    notifications: boolean;
    regions: Region[];
  };
  savedChats: { id: string; title: string; messages: ChatMessage[]; date: string }[];
  savedAnalyses: PodcastAnalysis[];
}

export interface BaseItem {
  id: string;
  title: string;
  titleAr?: string; 
  description: string;
  descriptionAr?: string;
  source: string;
  url: string; // Main/Default URL
  date: string;
  region: Region;
  imageUrl: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  url: string;
  type: 'News' | 'Startup' | 'Event' | 'Podcast' | 'Newsletter' | 'Other';
  description?: string;
}

export interface NewsItem extends BaseItem {
  category: 'Tech' | 'Startup' | 'Economy';
  sector?: 'Fintech' | 'Healthtech' | 'AI' | 'E-commerce' | 'SaaS' | 'General' | 'Deep Tech' | 'Economy' | 'Proptech' | 'Biotech';
  tags: string[];
}

export interface EventItem extends BaseItem {
  location: string;
  startDate: string;
  endDate: string;
  registrationLink: string;
  isVirtual: boolean;
  type: 'Conference' | 'Hackathon' | 'Workshop' | 'Meetup';
}

export interface Episode {
    title: string;
    date: string;
    duration: string;
    url: string;
}

export interface PodcastItem extends BaseItem {
  duration: string;
  audioUrl?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  appleUrl?: string;
  anghamiUrl?: string;
  channelUrl?: string;
  summaryPoints: string[];
  language: 'ar' | 'en';
  topic: 'Business' | 'Tech' | 'Startup' | 'AI' | 'Entrepreneurship';
  latestEpisodeTitle?: string;
  recentEpisodes?: Episode[];
}

export interface NewsletterItem extends BaseItem {
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  subscribeLink: string;
}

export interface MarketMetric {
  name: string;
  value: number;
  change: number; 
  trend: 'up' | 'down' | 'neutral';
  currency?: string;
  type: 'Index' | 'Crypto' | 'Currency' | 'Commodity';
}

export interface PartnerItem {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  contactEmail: string;
  type: 'Global' | 'Egypt';
  services: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

// Industry Analysis Types
export interface SectorMetric {
    name: string;
    growth: number;
    companies: number;
    investment: number;
    color: string;
    source: string;
    url: string;
    lastUpdated: string;
}

export interface MarketSizeItem {
    name: string;
    value: number;
    color: string;
    label: string;
    source: string;
    url: string;
}

export interface GrowthItem {
    year: string;
    value: number;
}

export interface CompetitorItem {
    name: string;
    share: number;
    type: string;
    strength: string;
    source: string;
    url: string;
}

export interface IndustryData {
    sectors: SectorMetric[];
    marketSizing: MarketSizeItem[];
    growthForecast: GrowthItem[];
    competitors: CompetitorItem[];
}
