
import { NewsItem, EventItem, PodcastItem, MarketMetric, PartnerItem, NewsletterItem, ResourceItem, IndustryData } from './types';

// ==========================================
// CENTRAL DATA SOURCE
// ==========================================

const getDate = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

export const TRANSLATIONS = {
  en: {
    nav: {
      latest: 'Latest',
      startups: 'Startups',
      events: 'Events',
      podcasts: 'Podcasts',
      podcastAnalysis: 'Podcast Analysis',
      newsletters: 'Newsletters',
      market: 'Market Analysis',
      industry: 'Industry Analysis',
      partners: 'Partners',
      resources: 'Resources',
      aiAssistant: 'AI Assistant',
      saved: 'Saved Items',
      login: 'Login',
      logout: 'Logout',
      admin: 'Admin Panel'
    },
    common: {
      searchPlaceholder: 'Search...',
      readMore: 'Read Source',
      aiSummary: 'AI Summary',
      aiTranslate: 'Translate to Arabic',
      save: 'Save',
      saved: 'Saved',
      register: 'Register Now',
      listen: 'Listen Episode',
      subscribe: 'Subscribe',
      contact: 'Contact',
      marketInsights: 'AI Market Insights',
      chatTitle: 'Nexus AI Assistant',
      filter: 'Filter',
      apply: 'Apply',
      all: 'All',
      generateAudio: 'Generate Audio',
      playAudio: 'Play Summary'
    },
    sections: {
        latestTitle: 'Global & Egyptian Tech News',
        startupsTitle: 'Startup Ecosystem',
        eventsTitle: 'Tech Events Calendar',
        marketTitle: 'Financial & Market Data',
        podcastsTitle: 'Tech & Business Podcasts',
        newslettersTitle: 'Curated Newsletters',
        partnersTitle: 'Our Partners',
        resourcesTitle: 'Platform Resources & Sources',
        authTitle: 'Welcome to NexusMena',
        aiPageTitle: 'AI Knowledge Assistant'
    }
  },
  ar: {
    nav: {
      latest: 'أحدث الأخبار',
      startups: 'الشركات الناشئة',
      events: 'الفعاليات',
      podcasts: 'بودكاست',
      podcastAnalysis: 'تحليل البودكاست',
      newsletters: 'النشرات البريدية',
      market: 'تحليل السوق',
      industry: 'تحليل القطاعات',
      partners: 'الشركاء',
      resources: 'المصادر',
      aiAssistant: 'المساعد الذكي',
      saved: 'المحفوظات',
      login: 'دخول',
      logout: 'خروج',
      admin: 'لوحة التحكم'
    },
    common: {
      searchPlaceholder: 'بحث...',
      readMore: 'اقرأ المصدر',
      aiSummary: 'ملخص ذكي',
      aiTranslate: 'ترجم للإنجليزية',
      save: 'حفظ',
      saved: 'محفوظ',
      register: 'سجل الآن',
      listen: 'استمع للحلقة',
      subscribe: 'اشترك',
      contact: 'تواصل',
      marketInsights: 'رؤى السوق الذكية',
      chatTitle: 'مساعد نيكسوس الذكي',
      filter: 'تصفية',
      apply: 'تطبيق',
      all: 'الكل',
      generateAudio: 'توليد صوت',
      playAudio: 'تشغيل الملخص'
    },
    sections: {
        latestTitle: 'أخبار التكنولوجيا العالمية والمصرية',
        startupsTitle: 'منظومة الشركات الناشئة',
        eventsTitle: 'تقويم الفعاليات التقنية',
        marketTitle: 'البيانات المالية والسوقية',
        podcastsTitle: 'بودكاست التكنولوجيا والأعمال',
        newslettersTitle: 'نشرات بريدية مختارة',
        partnersTitle: 'شركاؤنا',
        resourcesTitle: 'موارد ومنصات المنصة',
        authTitle: 'مرحباً بك في نيكسوس',
        aiPageTitle: 'المساعد المعرفي الذكي'
    }
  }
};

// RESOURCES - STRICTLY THE 14 REQUESTED SOURCES
export const RESOURCES: ResourceItem[] = [
  // --- 1. Global Data & Startups ---
  { id: 'r_pb', name: 'PitchBook', url: 'https://pitchbook.com/news', type: 'Startup', description: 'M&A, PE and VC data' },
  { id: 'r_cb', name: 'Crunchbase News', url: 'https://news.crunchbase.com', type: 'Startup', description: 'Business & Startup Journalism' },
  { id: 'r_cbi', name: 'CB Insights', url: 'https://www.cbinsights.com/research', type: 'Startup', description: 'Tech Market Intelligence' },
  
  // --- 2. Egypt & MENA ---
  { id: 'r_dne', name: 'Daily News Egypt', url: 'https://dailynewsegypt.com/business', type: 'News', description: 'Egypt Daily Business News' },
  { id: 'r_almal', name: 'Al Mal News', url: 'https://almalnews.com', type: 'News', description: 'Egypt Financial News (Arabic)' },
  { id: 'r_wamda', name: 'Wamda', url: 'https://www.wamda.com', type: 'Startup', description: 'MENA Entrepreneurship Ecosystem' },
  { id: 'r_mena', name: 'MENAbytes', url: 'https://www.menabytes.com', type: 'Startup', description: 'Middle East Tech & Startups' },
  { id: 'r_flat6', name: 'Flat6Labs', url: 'https://flat6labs.com/news', type: 'Startup', description: 'MENA Accelerator News' },

  // --- 3. Global Tech & Business ---
  { id: 'r_tc', name: 'TechCrunch', url: 'https://techcrunch.com', type: 'News', description: 'Global Technology News' },
  { id: 'r_bi', name: 'Business Insider', url: 'https://www.businessinsider.com/tech', type: 'News', description: 'Business & Tech Insider' },
  { id: 'r_forbes', name: 'Forbes Entrepreneurs', url: 'https://www.forbes.com/entrepreneurs', type: 'News', description: 'Entrepreneurship & Business' },
  { id: 'r_verge', name: 'The Verge', url: 'https://www.theverge.com/tech', type: 'News', description: 'Mainstream Tech & Science' },
  { id: 'r_wired', name: 'Wired', url: 'https://www.wired.com/business', type: 'News', description: 'Impact of Technology' },
  { id: 'r_fast', name: 'Fast Company', url: 'https://www.fastcompany.com/technology', type: 'News', description: 'Innovation & Business Design' }
];

export const LATEST_NEWS: NewsItem[] = [
  // Initial placeholders to prevent empty state before sync
  {
    id: 'n_tc_init',
    title: 'TechCrunch: Latest AI Developments (Live Feed)',
    description: 'Syncing with TechCrunch to bring you the latest on Artificial Intelligence and startups.',
    source: 'TechCrunch',
    url: 'https://techcrunch.com/category/artificial-intelligence/',
    date: getDate(0),
    region: 'Global',
    category: 'Tech',
    sector: 'AI',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    tags: ['AI', 'Live']
  },
  {
    id: 'n_almal_init',
    title: 'Al Mal News: EGX Market Watch',
    titleAr: 'جريدة المال: متابعة سوق المال المصري',
    description: 'Real-time updates from the Egyptian Exchange and financial sectors.',
    source: 'Al Mal News',
    url: 'https://almalnews.com/category/stock-market/',
    date: getDate(0),
    region: 'Egypt',
    category: 'Economy',
    sector: 'Economy',
    imageUrl: 'https://picsum.photos/800/400?random=2',
    tags: ['EGX', 'Finance']
  }
];

export const STARTUP_NEWS: NewsItem[] = [
  {
    id: 's_cb_init',
    title: 'Crunchbase: Daily Funding Report',
    description: 'Tracking the latest venture capital deals and startup funding rounds globally.',
    source: 'Crunchbase News',
    url: 'https://news.crunchbase.com/startups/funding/',
    date: getDate(0),
    region: 'Global',
    category: 'Startup',
    sector: 'General',
    imageUrl: 'https://picsum.photos/800/400?random=3',
    tags: ['VC', 'Funding']
  },
  {
    id: 's_wamda_init',
    title: 'Wamda: MENA Ecosystem Updates',
    description: 'Latest stories from founders and investors across the Middle East.',
    source: 'Wamda',
    url: 'https://www.wamda.com/news',
    date: getDate(0),
    region: 'MENA',
    category: 'Startup',
    sector: 'General',
    imageUrl: 'https://picsum.photos/800/400?random=4',
    tags: ['MENA', 'Startups']
  }
];

export const EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'RiseUp Summit 2024',
    description: 'The largest entrepreneurship event in the Middle East taking place at the Grand Egyptian Museum.',
    location: 'Giza, Egypt',
    startDate: getDate(30),
    endDate: getDate(32),
    registrationLink: 'https://riseupsummit.com',
    isVirtual: false,
    region: 'Egypt',
    source: 'RiseUp',
    url: 'https://riseupsummit.com',
    imageUrl: 'https://picsum.photos/800/400?random=8',
    date: getDate(30),
    type: 'Conference'
  },
  {
    id: 'e2',
    title: 'Web Summit Lisbon',
    description: 'Where the future goes to be born. The premier global tech conference.',
    location: 'Lisbon, Portugal',
    startDate: getDate(60),
    endDate: getDate(63),
    registrationLink: 'https://websummit.com',
    isVirtual: false,
    region: 'Global',
    source: 'Web Summit',
    url: 'https://websummit.com',
    imageUrl: 'https://picsum.photos/800/400?random=9',
    date: getDate(60),
    type: 'Conference'
  }
];

export const PODCASTS: PodcastItem[] = [
  // 1. Business Made Easy
  {
    id: 'p_req_1',
    title: 'Business Made Easy',
    description: 'Strategies for easy business growth and simplified concepts for entrepreneurs. Hosted by Amy Porterfield.',
    duration: '40 min',
    region: 'Global',
    source: 'Spotify',
    url: 'https://open.spotify.com/show/3ULANVC0n6XfXDYqn9QY3Q',
    channelUrl: 'https://open.spotify.com/show/3ULANVC0n6XfXDYqn9QY3Q',
    spotifyUrl: 'https://open.spotify.com/show/3ULANVC0n6XfXDYqn9QY3Q',
    appleUrl: 'https://podcasts.apple.com/us/podcast/bme-podcast-business-made-easy/id1445501936',
    date: getDate(-1),
    imageUrl: 'https://picsum.photos/800/400?random=100',
    summaryPoints: ['Strategy', 'Marketing', 'Growth'],
    language: 'en',
    topic: 'Business',
    latestEpisodeTitle: 'How to Scale Your Business Without Burning Out',
    recentEpisodes: [
        { title: 'Email Marketing 101', date: getDate(-5), duration: '35 min', url: 'https://open.spotify.com/show/3ULANVC0n6XfXDYqn9QY3Q' },
        { title: 'Course Creation Secrets', date: getDate(-12), duration: '42 min', url: 'https://open.spotify.com/show/3ULANVC0n6XfXDYqn9QY3Q' }
    ]
  },
  // 2. 7aki Business
  {
    id: 'p_req_2',
    title: '7aki Business - حكي بيزنس',
    titleAr: 'حكي بيزنس',
    description: 'In-depth conversations with business leaders in the MENA region about challenges and opportunities.',
    duration: '50 min',
    region: 'MENA',
    source: 'YouTube',
    url: 'https://www.youtube.com/@7akiBusiness',
    channelUrl: 'https://www.youtube.com/@7akiBusiness',
    youtubeUrl: 'https://www.youtube.com/@7akiBusiness',
    spotifyUrl: 'https://open.spotify.com/show/3fdkR33kideFoyunaAtylt',
    anghamiUrl: 'https://play.anghami.com/podcast/1038691248',
    date: getDate(-2),
    imageUrl: 'https://picsum.photos/800/400?random=101',
    summaryPoints: ['MENA Market', 'Startup Stories', 'Scale-ups'],
    language: 'ar',
    topic: 'Entrepreneurship',
    latestEpisodeTitle: 'The Future of E-commerce in Saudi Arabia',
    recentEpisodes: [
        { title: 'Interview with Careem Co-founder', date: getDate(-7), duration: '55 min', url: 'https://www.youtube.com/watch?v=example1' },
        { title: 'Fintech Regulations in Egypt', date: getDate(-14), duration: '48 min', url: 'https://www.youtube.com/watch?v=example2' }
    ]
  },
  // 3. This Week in Startups
  {
    id: 'p_req_3',
    title: 'This Week in Startups',
    description: 'Jason Calacanis and Molly Wood cover the latest in tech, entrepreneurship, and VC news.',
    duration: '60 min',
    region: 'Global',
    source: 'YouTube',
    url: 'https://www.youtube.com/c/thisweekin',
    channelUrl: 'https://www.youtube.com/c/thisweekin',
    youtubeUrl: 'https://www.youtube.com/c/thisweekin',
    spotifyUrl: 'https://open.spotify.com/show/6ULQ0ewYf5zmsDgBchlkr9',
    date: getDate(0),
    imageUrl: 'https://picsum.photos/800/400?random=102',
    summaryPoints: ['Silicon Valley', 'Investment', 'Tech News', 'AI'],
    language: 'en',
    topic: 'Startup',
    latestEpisodeTitle: 'E1002: AI Regulation & The Next Big Thing',
    recentEpisodes: [
        { title: 'E1001: Interview with Sam Altman', date: getDate(-2), duration: '70 min', url: 'https://www.youtube.com/c/thisweekin' },
        { title: 'E1000: 10 Years of TWiS', date: getDate(-5), duration: '90 min', url: 'https://www.youtube.com/c/thisweekin' }
    ]
  },
  // 4. The Diary Of A CEO
  {
    id: 'p_req_4',
    title: 'The Diary Of A CEO',
    description: 'Unfiltered conversations with the most influential people in the world, hosted by Steven Bartlett.',
    duration: '75 min',
    region: 'Global',
    source: 'YouTube',
    url: 'https://www.youtube.com/@TheDiaryOfACEO',
    channelUrl: 'https://www.youtube.com/@TheDiaryOfACEO',
    youtubeUrl: 'https://www.youtube.com/@TheDiaryOfACEO',
    spotifyUrl: 'https://open.spotify.com/show/7iQXmUT7XGuZSzAMjoNWlX',
    date: getDate(-3),
    imageUrl: 'https://picsum.photos/800/400?random=103',
    summaryPoints: ['Leadership', 'Mental Health', 'Success', 'Business'],
    language: 'en',
    topic: 'Business',
    latestEpisodeTitle: 'How to Master Your Mind and Emotions',
    recentEpisodes: [
        { title: 'The Science of Sleep', date: getDate(-6), duration: '80 min', url: 'https://www.youtube.com/@TheDiaryOfACEO' },
        { title: 'Billionaire Mindset', date: getDate(-10), duration: '65 min', url: 'https://www.youtube.com/@TheDiaryOfACEO' }
    ]
  },
  // 5. Startup Sync Podcast
  {
    id: 'p_req_5',
    title: 'Startup Sync Podcast',
    description: 'Synchronizing you with the latest startup ecosystem pulses and founder stories.',
    duration: '35 min',
    region: 'Global',
    source: 'YouTube',
    url: 'https://www.youtube.com/@StartupSyncPodcast',
    channelUrl: 'https://www.youtube.com/@StartupSyncPodcast',
    youtubeUrl: 'https://www.youtube.com/@StartupSyncPodcast',
    date: getDate(-4),
    imageUrl: 'https://picsum.photos/800/400?random=104',
    summaryPoints: ['Ecosystem', 'Founders', 'Sync'],
    language: 'en',
    topic: 'Startup',
    latestEpisodeTitle: 'Navigating the Funding Winter',
    recentEpisodes: [
        { title: 'Bootstrapping 101', date: getDate(-8), duration: '30 min', url: 'https://www.youtube.com/@StartupSyncPodcast' }
    ]
  }
];

export const NEWSLETTERS: NewsletterItem[] = [
  {
    id: 'nl_pt_1',
    title: 'Future PropTech',
    description: 'Weekly digest on the future of built world technology.',
    source: 'Future PropTech',
    url: 'https://futureproptech.com',
    date: getDate(0),
    region: 'Global',
    imageUrl: 'https://picsum.photos/800/400?random=501',
    frequency: 'Weekly',
    subscribeLink: 'https://futureproptech.com/subscribe'
  },
  {
    id: 'nl1',
    title: 'TLDR Tech',
    description: 'Keep up with tech in 5 minutes. The most important stories in tech, science, and coding.',
    source: 'TLDR',
    url: 'https://tldr.tech',
    date: getDate(0),
    region: 'Global',
    imageUrl: 'https://picsum.photos/800/400?random=28',
    frequency: 'Daily',
    subscribeLink: 'https://tldr.tech'
  },
  {
    id: 'nl2',
    title: 'Enterprise Egypt',
    description: 'The essential morning read for business and finance in Egypt.',
    source: 'Enterprise',
    url: 'https://enterprise.press',
    date: getDate(0),
    region: 'Egypt',
    imageUrl: 'https://picsum.photos/800/400?random=29',
    frequency: 'Daily',
    subscribeLink: 'https://enterprise.press/subscribe'
  }
];

export const MARKET_DATA_INDICES: MarketMetric[] = [
  { name: 'EGX 30', value: 28500.45, change: 1.2, trend: 'up', currency: 'pts', type: 'Index' },
  { name: 'NASDAQ', value: 16340.20, change: 0.8, trend: 'up', currency: 'USD', type: 'Index' },
  { name: 'S&P 500', value: 5200.10, change: 0.3, trend: 'up', currency: 'USD', type: 'Index' },
  { name: 'Tadawul', value: 12500.00, change: -0.2, trend: 'down', currency: 'SAR', type: 'Index' }
];

export const MARKET_DATA_CRYPTO: MarketMetric[] = [
  { name: 'Bitcoin', value: 64200.00, change: -1.5, trend: 'down', currency: 'USD', type: 'Crypto' },
  { name: 'Ethereum', value: 3200.50, change: 0.5, trend: 'up', currency: 'USD', type: 'Crypto' },
  { name: 'Solana', value: 145.20, change: 2.1, trend: 'up', currency: 'USD', type: 'Crypto' }
];

export const MARKET_DATA_CURRENCY: MarketMetric[] = [
  { name: 'USD/EGP', value: 47.85, change: -0.1, trend: 'neutral', currency: 'EGP', type: 'Currency' },
  { name: 'EUR/EGP', value: 51.20, change: 0.2, trend: 'up', currency: 'EGP', type: 'Currency' },
  { name: 'SAR/EGP', value: 12.75, change: 0.0, trend: 'neutral', currency: 'EGP', type: 'Currency' }
];

export const PARTNERS: PartnerItem[] = [
  { 
    id: 'pt1', 
    name: 'ITIDA', 
    logo: 'https://picsum.photos/200/200?random=20', 
    website: 'https://itida.gov.eg', 
    type: 'Egypt',
    description: 'Information Technology Industry Development Agency',
    contactEmail: 'info@itida.gov.eg',
    services: ['Grants', 'Training', 'Export Support']
  },
  { 
    id: 'pt3', 
    name: 'Flat6Labs', 
    logo: 'https://picsum.photos/200/200?random=22', 
    website: 'https://flat6labs.com', 
    type: 'Egypt',
    description: 'MENA’s leading seed and early stage venture capital firm.',
    contactEmail: 'cairo@flat6labs.com',
    services: ['Investment', 'Mentorship', 'Office Space']
  }
];

export const INDUSTRY_DATA: IndustryData = {
    sectors: [
        { name: 'AI & Machine Learning', growth: 24.5, companies: 120, investment: 850, color: '#6366f1', source: 'Gartner', url: 'https://www.gartner.com/en/industries/high-tech', lastUpdated: '2025-10-15' },
        { name: 'Fintech', growth: 18.2, companies: 350, investment: 1200, color: '#10b981', source: 'CB Insights', url: 'https://www.cbinsights.com/research/report/fintech-trends-2025/', lastUpdated: '2025-11-01' },
        { name: 'Deep Tech', growth: 31.0, companies: 45, investment: 400, color: '#ec4899', source: 'Wamda', url: 'https://wamda.com', lastUpdated: '2025-11-10' },
        { name: 'Proptech', growth: 12.4, companies: 85, investment: 250, color: '#f59e0b', source: 'Magnitt', url: 'https://magnitt.com', lastUpdated: '2025-09-20' },
        { name: 'E-commerce', growth: 8.5, companies: 500, investment: 900, color: '#3b82f6', source: 'eMarketer', url: 'https://www.emarketer.com', lastUpdated: '2025-11-05' }
    ],
    marketSizing: [
        { name: 'TAM', value: 50, color: '#e2e8f0', label: '$50B Global Potential', source: 'Statista', url: 'https://www.statista.com' },
        { name: 'SAM', value: 20, color: '#94a3b8', label: '$20B MENA Market', source: 'Statista', url: 'https://www.statista.com' },
        { name: 'SOM', value: 5, color: '#0ea5e9', label: '$5B Target Share', source: 'Statista', url: 'https://www.statista.com' },
    ],
    growthForecast: [
        { year: '2023', value: 1.2 },
        { year: '2024', value: 1.5 },
        { year: '2025', value: 2.1 },
        { year: '2026', value: 2.8 },
        { year: '2027', value: 3.9 },
    ],
    competitors: [
        { name: 'Fawry', share: 35, type: 'Leader', strength: 'Distribution Network', source: 'EGX Reports', url: 'https://www.egx.com.eg' },
        { name: 'Paymob', share: 20, type: 'Challenger', strength: 'Tech Stack', source: 'Crunchbase', url: 'https://www.crunchbase.com' },
        { name: 'InstaPay', share: 15, type: 'Disruptor', strength: 'UX/Speed', source: 'CBE', url: 'https://www.cbe.org.eg' },
        { name: 'Others', share: 30, type: 'Fragmented', strength: 'Niche Markets', source: 'Market Research', url: 'https://example.com' }
    ]
};
