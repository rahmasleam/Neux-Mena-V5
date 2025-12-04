
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import NewsCard from '../components/NewsCard';
import AIChat from '../components/AIChat';
import { Filter, ExternalLink, Globe, Tag, RefreshCw, Sparkles, TrendingUp, DollarSign, BrainCircuit, Rocket } from 'lucide-react';
import FilterBar from '../components/FilterBar';

const Latest: React.FC = () => {
  const { language, regionFilter, setRegionFilter, latestNews, resources, refreshCategoryFeed, dailyTrends } = useApp();
  const t = TRANSLATIONS[language];
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Automatic Sync on Page Load (Simulating Daily Schedule)
  useEffect(() => {
      const autoSync = async () => {
          setIsSyncing(true);
          await refreshCategoryFeed('latest');
          setIsSyncing(false);
      };
      const timer = setTimeout(autoSync, 1000);
      return () => clearTimeout(timer);
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const filteredNews = latestNews.filter(item => {
    const regionMatch = regionFilter === 'All' || item.region === regionFilter;
    const categoryMatch = categoryFilter === 'All' || item.category === categoryFilter;
    // Prioritize today's news for the default view, but show recent if filter is All
    // const dateMatch = item.date === today; 
    return regionMatch && categoryMatch;
  });

  // Sort by date (newest first)
  filteredNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter specific news sources to display in the sidebar
  const newsSources = resources.filter(r => r.type === 'News');

  // Construct context for AI
  const pageContext = `Page: Latest News. Top headline: ${filteredNews[0]?.title}. Trend Summary: ${dailyTrends?.executiveSummary}`;

  const regionOptions = [
      { label: 'All Regions', value: 'All' },
      { label: 'Global', value: 'Global' },
      { label: 'Egypt', value: 'Egypt' }
  ];

  const categoryOptions = [
      { label: t.common.all, value: 'All' },
      { label: 'Tech', value: 'Tech' },
      { label: 'Startup', value: 'Startup' },
      { label: 'Economy', value: 'Economy' }
  ];

  const handleManualSync = async () => {
      setIsSyncing(true);
      await refreshCategoryFeed('latest');
      setIsSyncing(false);
  };

  const getTopicIcon = (category: string) => {
      switch(category) {
          case 'AI': return <BrainCircuit className="w-5 h-5 text-purple-500" />;
          case 'Finance': return <DollarSign className="w-5 h-5 text-green-500" />;
          case 'Business': return <TrendingUp className="w-5 h-5 text-blue-500" />;
          case 'Entrepreneurship': return <Rocket className="w-5 h-5 text-orange-500" />;
          default: return <Tag className="w-5 h-5 text-slate-500" />;
      }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn">
        <div className="flex-1 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.sections.latestTitle}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Today's Headlines & Daily AI Analysis.</p>
                </div>
                <button 
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-4 py-2 bg-nexus-50 dark:bg-nexus-900/30 text-nexus-600 dark:text-nexus-400 rounded-lg hover:bg-nexus-100 dark:hover:bg-nexus-900/50 transition-colors font-medium text-sm"
                >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Analyzing Today\'s Web...' : 'Refresh Daily Feed'}
                </button>
            </div>

            {/* DAILY TREND ANALYSIS DASHBOARD */}
            {dailyTrends && (
                <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-indigo-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Sparkles className="w-40 h-40" /></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Daily Pulse
                            </span>
                            <span className="text-sm text-slate-500">{dailyTrends.date}</span>
                        </div>
                        
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Executive Summary</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-medium">
                            {dailyTrends.executiveSummary}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dailyTrends.topics.map((topic, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                            {getTopicIcon(topic.category)}
                                            {topic.category}
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${topic.sentiment === 'Positive' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                            {topic.sentiment}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-sm text-nexus-600 dark:text-nexus-400 mb-1">{topic.topic}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{topic.summary}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
                
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                 <FilterBar 
                    activeValue={regionFilter} 
                    onSelect={(v) => setRegionFilter(v as any)} 
                    options={regionOptions}
                    icon={<Globe className="w-4 h-4" />}
                />
                 <FilterBar 
                    activeValue={categoryFilter} 
                    onSelect={setCategoryFilter} 
                    options={categoryOptions}
                    icon={<Tag className="w-4 h-4" />}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredNews.length === 0 ? (
                    <div className="col-span-2 text-center py-10 bg-slate-50 dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-slate-500">No news found matching these filters today.</p>
                    </div>
                ) : (
                    filteredNews.map(item => (
                        <NewsCard key={item.id} item={item} />
                    ))
                )}
            </div>
        </div>

        {/* Sidebar for Sources */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-nexus-600" /> Monitored Sources
                </h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {newsSources.map(source => (
                        <a 
                            key={source.id} 
                            href={source.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center justify-between group p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-nexus-600 dark:group-hover:text-nexus-400">{source.name}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-nexus-500" />
                        </a>
                    ))}
                </div>
            </div>
        </div>

        <AIChat contextData={pageContext} />
    </div>
  );
};

export default Latest;
