
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, ComposedChart } from 'recharts';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import AIChat from '../components/AIChat';
import { TrendingUp, DollarSign, Building, Cpu, Globe, BrainCircuit, Layers, Target, Shield, Users, AlertTriangle, Zap, Search, ExternalLink, RefreshCw, BarChart2 } from 'lucide-react';
import { analyzeMarketData } from '../services/geminiService';

const IndustryAnalysis: React.FC = () => {
    const { language, theme, industryData } = useApp();
    const t = TRANSLATIONS[language];
    const [activeSector, setActiveSector] = useState('Fintech');
    const [aiInsight, setAiInsight] = useState('Analyzing sector data...');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { sectors, marketSizing, growthForecast, competitors } = industryData;

    useEffect(() => {
        const fetchAnalysis = async () => {
            const dataStr = sectors.map(s => `${s.name}: ${s.growth}% growth`).join('. ');
            const result = await analyzeMarketData(`Analyze this industry sector data for MENA context: ${dataStr}. Focus on Fintech and AI opportunities.`);
            setAiInsight(result);
        };
        fetchAnalysis();
    }, [sectors]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Simulate data update/check
        const dataStr = sectors.map(s => `${s.name}: ${s.growth}% growth`).join('. ');
        const result = await analyzeMarketData(`Re-evaluate this sector data for any breaking changes or new trends: ${dataStr}.`);
        setAiInsight(result);
        setTimeout(() => setIsRefreshing(false), 2000);
    }

    const renderSourceLink = (source: string, url: string, date?: string) => (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500">
            <div className="flex items-center gap-1">
                <span>Source: <a href={url} target="_blank" rel="noreferrer" className="text-nexus-600 hover:underline font-medium">{source}</a></span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
            </div>
            {date && <span className="text-slate-400">Updated: {date}</span>}
        </div>
    );

    return (
        <div className="space-y-8 pb-20 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="w-8 h-8 text-nexus-600 dark:text-nexus-400" />
                        {t.nav.industry}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Comprehensive Market Assessment, Potential & Strategic Dynamics.</p>
                </div>
                <div className="flex items-center gap-3">
                     <button 
                        onClick={handleRefresh}
                        className="p-2 text-slate-500 hover:text-nexus-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                        title="Check for updates"
                    >
                        <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                        {['Fintech', 'AI', 'Proptech'].map(s => (
                            <button
                                key={s}
                                onClick={() => setActiveSector(s)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                                    activeSector === s 
                                    ? 'bg-nexus-600 text-white shadow-sm' 
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Insight Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-lg border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><BrainCircuit className="w-32 h-32" /></div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-nexus-400 mb-2 z-10 relative">
                    <BrainCircuit className="w-5 h-5" /> Executive Summary: {activeSector}
                </h3>
                <p className="text-lg font-light leading-relaxed opacity-90 z-10 relative italic">"{aiInsight}"</p>
            </div>

            {/* SECTION 1: SECTOR PULSE (CARDS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sectors.map((sector) => (
                    <div key={sector.name} className={`bg-white dark:bg-slate-800 p-6 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-shadow ${activeSector === sector.name.split(' ')[0] ? 'border-nexus-500 bg-nexus-50 dark:bg-slate-700' : 'border-slate-200 dark:border-slate-700'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">{sector.name}</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Growth</span>
                                <span className="font-bold text-green-600">+{sector.growth}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Vol.</span>
                                <span className="font-bold text-slate-800 dark:text-white">${sector.investment}M</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Companies</span>
                                <span className="font-bold text-slate-800 dark:text-white">{sector.companies}</span>
                            </div>
                        </div>
                        {renderSourceLink(sector.source, sector.url, sector.lastUpdated)}
                    </div>
                ))}
            </div>

            {/* SECTION 1.5: SECTOR PERFORMANCE MATRIX CHART */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart2 className="w-6 h-6 text-nexus-600" />
                    <h3 className="font-bold text-xl text-slate-800 dark:text-white">Sector Performance Analysis</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Comparative analysis of <strong>Investment Volume</strong> (Primary Axis) vs <strong>Growth Rate</strong> & <strong>Company Count</strong> (Secondary Axis) across key industries (AI, Fintech, Deep Tech, Proptech).
                </p>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={sectors} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                            <XAxis 
                                dataKey="name" 
                                stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                            />
                            <YAxis 
                                yAxisId="left" 
                                stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                                label={{ value: 'Investment ($M)', angle: -90, position: 'insideLeft', style: { fill: theme === 'dark' ? '#94a3b8' : '#64748b' } }} 
                            />
                            <YAxis 
                                yAxisId="right" 
                                orientation="right" 
                                stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                                label={{ value: 'Growth % / Count', angle: 90, position: 'insideRight', style: { fill: theme === 'dark' ? '#94a3b8' : '#64748b' } }}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', 
                                    borderRadius: '8px', 
                                    border: theme === 'dark' ? '1px solid #334155' : 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="investment" name="Total Investment ($M)" barSize={40} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            <Line yAxisId="right" type="monotone" dataKey="growth" name="Growth Rate (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                            <Line yAxisId="right" type="monotone" dataKey="companies" name="Active Companies" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* SECTION 2: MARKET POTENTIAL & SIZING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* TAM/SAM/SOM */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Target className="w-6 h-6 text-nexus-600" />
                        <h3 className="font-bold text-xl text-slate-800 dark:text-white">Market Potential (Sizing)</h3>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-4">
                        {marketSizing.map((item, idx) => (
                            <div 
                                key={item.name} 
                                className="w-full flex flex-col items-center justify-center text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-sm relative overflow-hidden"
                                style={{ 
                                    width: `${100 - (idx * 25)}%`, 
                                    backgroundColor: idx === 0 ? '#64748b' : idx === 1 ? '#475569' : '#0ea5e9',
                                    height: '80px'
                                }}
                            >
                                <span className="z-10 text-lg">{item.name}</span>
                                <span className="z-10 text-sm font-light opacity-90">{item.label}</span>
                            </div>
                        ))}
                        <p className="text-xs text-slate-400 mt-2 text-center max-w-md">
                            *TAM: Total Addressable Market | SAM: Serviceable Available Market | SOM: Serviceable Obtainable Market
                        </p>
                    </div>
                     {renderSourceLink(marketSizing[0].source, marketSizing[0].url)}
                </div>

                {/* Growth Projections */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-6 h-6 text-nexus-600" />
                        <h3 className="font-bold text-xl text-slate-800 dark:text-white">5-Year Growth Forecast</h3>
                    </div>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthForecast}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                                <XAxis dataKey="year" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                                <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', borderRadius: '8px', border: 'none' }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} activeDot={{ r: 8 }} name="Market Size (Billions)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    {renderSourceLink("Statista & IMF Projections", "https://statista.com")}
                </div>
            </div>

            {/* SECTION 3: COMPETITIVE LANDSCAPE (Market Assessment) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Market Share */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                     <div className="flex items-center gap-2 mb-4">
                        <Users className="w-6 h-6 text-nexus-600" />
                        <h3 className="font-bold text-xl text-slate-800 dark:text-white">Market Share</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={competitors as any}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="share"
                                >
                                    {competitors.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#0ea5e9', '#6366f1', '#10b981', '#94a3b8'][index % 4]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', borderRadius: '8px', border: 'none' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {renderSourceLink("Sector Analysis Report Q3", "https://wamda.com")}
                </div>

                {/* Competitor Matrix */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Shield className="w-6 h-6 text-nexus-600" />
                        <h3 className="font-bold text-xl text-slate-800 dark:text-white">Competitive Position Assessment</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 text-sm uppercase">
                                    <th className="py-3 font-semibold">Company</th>
                                    <th className="py-3 font-semibold">Share</th>
                                    <th className="py-3 font-semibold">Position</th>
                                    <th className="py-3 font-semibold">Core Advantage</th>
                                    <th className="py-3 font-semibold">Threat Level</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700 dark:text-slate-300">
                                {competitors.map((comp, i) => (
                                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="py-3 font-bold">{comp.name}</td>
                                        <td className="py-3">{comp.share}%</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${comp.type === 'Leader' ? 'bg-green-100 text-green-700' : comp.type === 'Disruptor' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                                                {comp.type}
                                            </span>
                                        </td>
                                        <td className="py-3 text-sm">{comp.strength}</td>
                                        <td className="py-3">
                                            <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className={`h-full ${comp.share > 25 ? 'bg-red-500' : comp.share > 15 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${comp.share * 2}%` }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     {renderSourceLink(competitors[0].source, competitors[0].url)}
                </div>
            </div>

            {/* SECTION 4: STRATEGIC DYNAMICS (SWOT & PESTLE) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SWOT Analysis */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Zap className="w-6 h-6 text-nexus-600" />
                        <h3 className="font-bold text-xl text-slate-800 dark:text-white">Internal Dynamics (SWOT)</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 h-64">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900/50">
                            <h4 className="font-bold text-green-700 dark:text-green-400 mb-2">Strengths</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
                                <li>High mobile adoption</li>
                                <li>Government support</li>
                            </ul>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/50">
                            <h4 className="font-bold text-red-700 dark:text-red-400 mb-2">Weaknesses</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
                                <li>Talent shortage</li>
                                <li>Infrastructure costs</li>
                            </ul>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
                            <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2">Opportunities</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
                                <li>Unbanked population</li>
                                <li>Cross-border expansion</li>
                            </ul>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900/50">
                            <h4 className="font-bold text-orange-700 dark:text-orange-400 mb-2">Threats</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
                                <li>Cybersecurity risks</li>
                                <li>Global competition</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* PESTLE Analysis */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Globe className="w-6 h-6 text-nexus-600" />
                        <h3 className="font-bold text-xl text-slate-800 dark:text-white">External Factors (PESTLE)</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { letter: 'P', name: 'Political', desc: 'Regulatory Sandboxes & Digital Transformation policies.' },
                            { letter: 'E', name: 'Economic', desc: 'Currency fluctuation impact on foreign investment.' },
                            { letter: 'S', name: 'Social', desc: 'Youth demographic driving digital adoption.' },
                            { letter: 'T', name: 'Technological', desc: '5G rollout and AI integration in banking.' },
                            { letter: 'L', name: 'Legal', desc: 'Data privacy laws (GDPR/DPA) compliance.' },
                            { letter: 'E', name: 'Environmental', desc: 'Green Fintech & sustainability reporting.' },
                        ].map(factor => (
                            <div key={factor.name} className="flex gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 flex-shrink-0">
                                    {factor.letter}
                                </div>
                                <div>
                                    <h5 className="font-bold text-sm text-slate-800 dark:text-white">{factor.name}</h5>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight mt-1">{factor.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AIChat contextData={`Page: Industry Analysis (${activeSector}). Reviewing Market Assessment, Sizing, and Dynamics.`} />
        </div>
    );
};

export default IndustryAnalysis;
