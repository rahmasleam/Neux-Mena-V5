
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import NewsCard from '../components/NewsCard';
import AIChat from '../components/AIChat';
import FilterBar from '../components/FilterBar';
import { Rocket, Globe, Zap, HeartPulse, Code, ExternalLink, Link as LinkIcon, RefreshCw, LayoutGrid, List, Search } from 'lucide-react';

const Startups: React.FC = () => {
  const { language, regionFilter, setRegionFilter, startupNews, resources, refreshCategoryFeed } = useApp();
  const t = TRANSLATIONS[language];
  const [sectorFilter, setSectorFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Automatic Sync on Load
  useEffect(() => {
      const autoSync = async () => {
          setIsSyncing(true);
          await refreshCategoryFeed('startup');
          setIsSyncing(false);
      };
      autoSync();
  }, []);

  // Filter specific startup sources for the sidebar/dropdown
  const startupSources = resources.filter(r => r.type === 'Startup');

  // Logic
  const filteredData = startupNews.filter(item => {
    const regionMatch = regionFilter === 'All' || item.region === regionFilter || (regionFilter === 'Egypt' && item.region === 'MENA');
    const sectorMatch = sectorFilter === 'All' || item.sector === sectorFilter;
    const sourceMatch = sourceFilter === 'All' || item.source === sourceFilter;
    const searchMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return regionMatch && sectorMatch && sourceMatch && searchMatch;
  });

  const pageContext = `Page: Startups Browser. Displaying ${filteredData.length} items. Filters: ${regionFilter}, ${sectorFilter}, ${sourceFilter}.`;

  const sectorOptions = [
      { label: t.common.all, value: 'All' },
      { label: 'Fintech', value: 'Fintech' },
      { label: 'Healthtech', value: 'Healthtech' },
      { label: 'AI', value: 'AI' },
      { label: 'E-commerce', value: 'E-commerce' },
      { label: 'SaaS', value: 'SaaS' },
      { label: 'Proptech', value: 'Proptech' },
      { label: 'Deep Tech', value: 'Deep Tech' }
  ];

  const regionOptions = [
      { label: 'All Regions', value: 'All' },
      { label: 'Global', value: 'Global' },
      { label: 'Egypt/MENA', value: 'Egypt' }
  ];

  const handleSync = async () => {
      setIsSyncing(true);
      await refreshCategoryFeed('startup');
      setIsSyncing(false);
  };

  return (
    <div className="flex flex-col h-full animate-fadeIn pb-20">
        {/* Browser Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
            <div className="flex items-center gap-3">
                <div className="bg-nexus-100 dark:bg-nexus-900/50 p-2 rounded-lg">
                    <Rocket className="w-6 h-6 text-nexus-600 dark:text-nexus-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Startup Ecosystem</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Daily VC funding, exits, and new ventures.</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <input 
                        type="text" 
                        placeholder="Search startups..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-nexus-500 outline-none"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <button 
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="p-2 text-slate-500 hover:text-nexus-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            {/* Sidebar Filters */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Region Filter */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Region</h3>
                    <div className="space-y-1">
                        {regionOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setRegionFilter(opt.value as any)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${regionFilter === opt.value ? 'bg-nexus-50 text-nexus-700 dark:bg-nexus-900/30 dark:text-nexus-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sector Filter */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Industry</h3>
                    <div className="space-y-1">
                        {sectorOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setSectorFilter(opt.value)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${sectorFilter === opt.value ? 'bg-nexus-50 text-nexus-700 dark:bg-nexus-900/30 dark:text-nexus-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Source Filter */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Source</h3>
                    <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                        <button
                            onClick={() => setSourceFilter('All')}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${sourceFilter === 'All' ? 'bg-nexus-50 text-nexus-700 dark:bg-nexus-900/30 dark:text-nexus-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                        >
                            All Sources
                        </button>
                        {startupSources.map(src => (
                            <button
                                key={src.id}
                                onClick={() => setSourceFilter(src.name)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors truncate ${sourceFilter === src.name ? 'bg-nexus-50 text-nexus-700 dark:bg-nexus-900/30 dark:text-nexus-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                {src.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-slate-500">{filteredData.length} Results Found</span>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {filteredData.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <Rocket className="w-12 h-12 text-slate-300 mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">No startups found matching your filters.</p>
                    </div>
                ) : (
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' : 'grid-cols-1'}`}>
                        {filteredData.map(item => (
                            <NewsCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>

        <AIChat contextData={pageContext} />
    </div>
  );
};

export default Startups;
