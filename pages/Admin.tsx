
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import { PlusCircle, Link as LinkIcon, Trash2, ShieldCheck, LayoutDashboard, FileText, Database, AlertCircle, Bot, ArrowRight, Check, Zap, Edit, DownloadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { reviewContent, fetchLatestFromSource } from '../services/geminiService';

const Admin: React.FC = () => {
    const { language, user, isAdmin, addItem, updateItem, deleteItem, latestNews, startupNews, resources, events, podcasts, newsletters, marketIndices, partners } = useApp();
    const t = TRANSLATIONS[language];
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'import' | 'manage'>('dashboard');
    const [editingId, setEditingId] = useState<string | null>(null);
    
    // Smart Fetch / Import State
    const [smartUrl, setSmartUrl] = useState('');
    const [isSmartFetching, setIsSmartFetching] = useState(false);
    
    // Unified Form State
    const [formData, setFormData] = useState({
        category: 'latest',
        title: '',
        url: '',
        description: '',
        source: '',
        region: 'Global',
        // Type Specifics
        startDate: '',
        endDate: '',
        location: '',
        duration: '',
        frequency: '',
        sector: '',
        marketValue: '',
        marketTrend: 'up',
        logoUrl: '',
        contactEmail: '',
        summaryPoints: '', // Comma separated string for editing
        // New Podcast specific fields
        youtubeUrl: '',
        spotifyUrl: ''
    });

    const [isReviewing, setIsReviewing] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState<any | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSmartFetch = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!smartUrl) return;
        setIsSmartFetching(true);
        const data = await fetchLatestFromSource(smartUrl);
        if(data) {
            setFormData(prev => ({
                ...prev,
                title: data.title || '',
                description: data.description || '',
                source: data.source || 'Smart Source',
                // CRITICAL: Use specificUrl from AI if available, otherwise fallback to input
                url: data.specificUrl || smartUrl, 
                category: data.category || 'podcasts',
                duration: data.duration || '',
                // Join array with pipe for the text input
                summaryPoints: Array.isArray(data.summaryPoints) ? data.summaryPoints.join(' | ') : (data.summaryPoints || ''),
                youtubeUrl: data.youtubeUrl || '',
                spotifyUrl: data.spotifyUrl || ''
            }));
            
            alert(`Content Found!\nTitle: ${data.title}\nSpecific Link: ${data.specificUrl || 'Not found'}`);
        } else {
            alert('Could not fetch content. Try entering details manually.');
        }
        setIsSmartFetching(false);
    };

    const handleReviewWithAI = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsReviewing(true);
        setAiSuggestion(null);

        const suggestion = await reviewContent(formData);
        setAiSuggestion(suggestion);
        setIsReviewing(false);
    };

    const handleEditClick = (item: any, category: string) => {
        setEditingId(item.id);
        setActiveTab('add');
        
        // Map item back to formData
        setFormData({
            category: category,
            title: item.title || item.name || '',
            url: item.url || item.website || item.registrationLink || item.subscribeLink || '',
            description: item.description || '',
            source: item.source || '',
            region: item.region || 'Global',
            startDate: item.startDate || '',
            endDate: item.endDate || '',
            location: item.location || '',
            duration: item.duration || '',
            frequency: item.frequency || '',
            sector: item.sector || '',
            marketValue: item.value ? item.value.toString() : '',
            marketTrend: item.trend || 'up',
            logoUrl: item.logo || '',
            contactEmail: item.contactEmail || '',
            summaryPoints: item.summaryPoints ? item.summaryPoints.join(' | ') : '',
            youtubeUrl: item.youtubeUrl || '',
            spotifyUrl: item.spotifyUrl || ''
        });
    };

    const handlePublish = (useAiVersion: boolean) => {
        const finalData: any = {
            id: editingId || Date.now().toString(),
            title: useAiVersion && aiSuggestion?.improvedTitle ? aiSuggestion.improvedTitle : formData.title,
            description: useAiVersion && aiSuggestion?.improvedDescription ? aiSuggestion.improvedDescription : formData.description,
            url: formData.url,
            source: formData.source || 'Admin',
            region: formData.region,
            date: new Date().toISOString().split('T')[0],
            imageUrl: `https://picsum.photos/800/400?random=${Date.now()}`
        };

        // Add category specific fields
        switch (formData.category) {
            case 'latest':
                finalData.category = 'Tech';
                finalData.tags = ['Admin'];
                break;
            case 'startup':
                finalData.category = 'Startup';
                finalData.sector = formData.sector || 'General';
                break;
            case 'events':
                finalData.startDate = formData.startDate || new Date().toISOString();
                finalData.endDate = formData.endDate || new Date().toISOString();
                finalData.location = formData.location || 'Online';
                finalData.registrationLink = formData.url;
                finalData.type = 'Conference';
                finalData.isVirtual = formData.location === 'Online';
                break;
            case 'podcasts':
                finalData.duration = formData.duration || '30 min';
                finalData.topic = 'Tech';
                finalData.language = 'en';
                // Convert string back to array
                finalData.summaryPoints = formData.summaryPoints ? formData.summaryPoints.split('|').map(s => s.trim()) : [];
                finalData.youtubeUrl = formData.youtubeUrl;
                finalData.spotifyUrl = formData.spotifyUrl;
                break;
            case 'newsletters':
                finalData.frequency = formData.frequency || 'Weekly';
                finalData.subscribeLink = formData.url;
                break;
            case 'market':
                finalData.name = formData.title; // Market uses name
                finalData.value = parseFloat(formData.marketValue) || 0;
                finalData.change = 0;
                finalData.trend = formData.marketTrend;
                finalData.currency = 'USD';
                finalData.type = 'Index';
                break;
            case 'partners':
                finalData.name = formData.title;
                finalData.logo = formData.logoUrl || `https://picsum.photos/200/200?random=${Date.now()}`;
                finalData.website = formData.url;
                finalData.contactEmail = formData.contactEmail;
                finalData.type = formData.region;
                finalData.services = ['Service 1'];
                break;
        }

        if (editingId) {
            updateItem(formData.category, finalData);
            alert(`Content updated in ${formData.category}!`);
        } else {
            addItem(formData.category, finalData);
            alert(`Content added to ${formData.category}!`);
        }
        
        // Reset
        setEditingId(null);
        setFormData({
            category: 'latest',
            title: '',
            url: '',
            description: '',
            source: '',
            region: 'Global',
            startDate: '',
            endDate: '',
            location: '',
            duration: '',
            frequency: '',
            sector: '',
            marketValue: '',
            marketTrend: 'up',
            logoUrl: '',
            contactEmail: '',
            summaryPoints: '',
            youtubeUrl: '',
            spotifyUrl: ''
        });
        setSmartUrl('');
        setAiSuggestion(null);
        setActiveTab('dashboard');
    };

    // Helper class for inputs
    const inputClass = "w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-nexus-500 outline-none";

    const renderDynamicFields = () => {
        switch (formData.category) {
            case 'events':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <input name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} className={inputClass} required />
                        <input name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} className={inputClass} />
                        <input name="location" placeholder="Location (e.g., Cairo / Online)" value={formData.location} onChange={handleInputChange} className={`${inputClass} col-span-2`} required />
                    </div>
                );
            case 'podcasts':
                return (
                    <div className="grid grid-cols-1 gap-4">
                        <input name="duration" placeholder="Duration (e.g. 45 min)" value={formData.duration} onChange={handleInputChange} className={inputClass} />
                        <div className="grid grid-cols-2 gap-4">
                            <input name="youtubeUrl" placeholder="YouTube URL" value={formData.youtubeUrl} onChange={handleInputChange} className={inputClass} />
                            <input name="spotifyUrl" placeholder="Spotify URL" value={formData.spotifyUrl} onChange={handleInputChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Summary Points / Timestamps (Separate with |)</label>
                            <input name="summaryPoints" placeholder="Intro | Topic A | Topic B" value={formData.summaryPoints} onChange={handleInputChange} className={inputClass} />
                        </div>
                    </div>
                );
            case 'newsletters':
                return (
                    <select name="frequency" value={formData.frequency} onChange={handleInputChange} className={inputClass}>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                    </select>
                );
            case 'market':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <input name="marketValue" type="number" placeholder="Value (e.g. 15000)" value={formData.marketValue} onChange={handleInputChange} className={inputClass} required />
                        <select name="marketTrend" value={formData.marketTrend} onChange={handleInputChange} className={inputClass}>
                            <option value="up">Up (Bullish)</option>
                            <option value="down">Down (Bearish)</option>
                            <option value="neutral">Neutral</option>
                        </select>
                    </div>
                );
            case 'partners':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <input name="contactEmail" type="email" placeholder="Contact Email" value={formData.contactEmail} onChange={handleInputChange} className={inputClass} />
                        <input name="logoUrl" type="url" placeholder="Logo URL" value={formData.logoUrl} onChange={handleInputChange} className={inputClass} />
                    </div>
                );
            default:
                return null;
        }
    };

    if (!user || !isAdmin) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-nexus-900 to-nexus-700 rounded-2xl p-8 text-white shadow-xl flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-nexus-300" />
                        Admin Dashboard
                    </h1>
                    <p className="text-nexus-100 mt-2 opacity-90">Welcome, {user.name} ({user.email})</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700 pb-1 overflow-x-auto">
                {['dashboard', 'add', 'import', 'manage'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => { setActiveTab(tab as any); if(tab === 'add' || tab === 'import') setEditingId(null); }}
                        className={`pb-3 px-4 font-medium capitalize transition-all whitespace-nowrap ${activeTab === tab ? 'text-nexus-600 border-b-2 border-nexus-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab === 'add' ? (editingId ? 'Edit Content' : 'Manual Add') : tab === 'import' ? 'Smart Import (Fetch)' : tab}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 min-h-[500px]">
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Latest News', count: latestNews.length, color: 'blue' },
                            { label: 'Startups', count: startupNews.length, color: 'purple' },
                            { label: 'Events', count: events.length, color: 'green' },
                            { label: 'Podcasts', count: podcasts.length, color: 'pink' }
                        ].map((stat, i) => (
                            <div key={i} className={`p-6 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 rounded-xl border border-${stat.color}-100`}>
                                <div className="font-bold text-slate-700 dark:text-slate-300">{stat.label}</div>
                                <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stat.count}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Smart Import Tab */}
                {activeTab === 'import' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8 p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700">
                             <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2">
                                <DownloadCloud className="w-6 h-6" /> Auto-Import & Fetch Latest Content
                            </h3>
                            <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-6">
                                Paste a link to a <strong>Website, News Source, or Podcast Channel</strong>. 
                                The system will <strong>automatically fetch the latest article/episode</strong> from that source, 
                                format it, and prepare it for publishing to your website feed.
                            </p>
                            
                            <form onSubmit={handleSmartFetch} className="flex gap-4 mb-6">
                                <input 
                                    type="url" 
                                    placeholder="e.g. https://www.wamda.com or https://techcrunch.com" 
                                    value={smartUrl} 
                                    onChange={(e) => setSmartUrl(e.target.value)}
                                    className={`${inputClass} flex-1`}
                                    required
                                />
                                <button 
                                    type="submit" 
                                    disabled={isSmartFetching} 
                                    className="px-8 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium flex items-center gap-2 whitespace-nowrap"
                                >
                                    {isSmartFetching ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> : <Zap className="w-4 h-4" />}
                                    {isSmartFetching ? 'Fetching Latest...' : 'Fetch Latest Content'}
                                </button>
                            </form>
                        </div>

                        {formData.title && (
                            <div className="animate-fadeIn space-y-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Review Fetched Data</h2>
                                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">Ready to Import</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-1">Detected Category</label>
                                        <select name="category" value={formData.category} onChange={handleInputChange} className={inputClass}>
                                            <option value="latest">Latest News</option>
                                            <option value="startup">Startups</option>
                                            <option value="events">Events</option>
                                            <option value="podcasts">Podcasts</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-1">Source Name</label>
                                        <input name="source" value={formData.source} onChange={handleInputChange} className={inputClass} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-500 mb-1">Title</label>
                                        <input name="title" value={formData.title} onChange={handleInputChange} className={inputClass} />
                                    </div>
                                     <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-500 mb-1">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className={inputClass} />
                                    </div>
                                     <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-500 mb-1">
                                            Specific Item URL <span className="text-xs text-nexus-600">(Automatically extracted from channel)</span>
                                        </label>
                                        <input name="url" value={formData.url} onChange={handleInputChange} className={inputClass} />
                                    </div>
                                </div>

                                {/* Dynamic fields based on category */}
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                                    <h4 className="text-sm font-bold text-slate-500 uppercase mb-3">Additional Fields for {formData.category}</h4>
                                    {renderDynamicFields()}
                                </div>

                                <button 
                                    onClick={() => handlePublish(false)}
                                    className="w-full py-4 bg-nexus-600 text-white rounded-xl hover:bg-nexus-700 font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-nexus-500/30 transition-all"
                                >
                                    <Check className="w-5 h-5" /> Import to App Feed
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Manual Add Tab */}
                {activeTab === 'add' && (
                    <div className="max-w-4xl mx-auto">
                        {!aiSuggestion ? (
                            <form onSubmit={handleReviewWithAI} className="space-y-6">
                                <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
                                    {editingId ? 'Edit Content Details' : 'Manual Entry'}
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Target Page</label>
                                        <select name="category" value={formData.category} onChange={handleInputChange} className={inputClass}>
                                            <option value="latest">Latest News</option>
                                            <option value="startup">Startups</option>
                                            <option value="events">Events</option>
                                            <option value="podcasts">Podcasts</option>
                                            <option value="newsletters">Newsletters</option>
                                            <option value="market">Market Analysis</option>
                                            <option value="partners">Partners</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Region</label>
                                        <select name="region" value={formData.region} onChange={handleInputChange} className={inputClass}>
                                            <option value="Global">Global</option>
                                            <option value="Egypt">Egypt</option>
                                            <option value="MENA">MENA</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title / Name</label>
                                    <input name="title" value={formData.title} onChange={handleInputChange} required className={inputClass} placeholder="Content Title" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Link / URL</label>
                                    <input name="url" type="url" value={formData.url} onChange={handleInputChange} required className={inputClass} placeholder="https://..." />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description (Optional)</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className={inputClass} placeholder="Summary..." />
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Category Specifics</h3>
                                    {renderDynamicFields()}
                                </div>

                                <button type="submit" disabled={isReviewing} className="w-full py-4 bg-nexus-600 text-white rounded-xl hover:bg-nexus-700 font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-nexus-500/30 transition-all">
                                    {isReviewing ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div> : <Bot className="w-5 h-5" />}
                                    {isReviewing ? 'AI Analyzing...' : 'Review with AI'}
                                </button>
                            </form>
                        ) : (
                            <div className="animate-fadeIn">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Bot className="w-8 h-8 text-nexus-600" /> AI Review & Suggestion
                                </h2>
                                
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-xl mb-6 flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200 italic">"{aiSuggestion.feedback}"</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    {/* Original Column */}
                                    <div className="bg-white dark:bg-slate-700 p-6 rounded-xl border border-slate-200 dark:border-slate-600 opacity-70 hover:opacity-100 transition-opacity">
                                        <h3 className="font-bold text-slate-500 uppercase text-xs mb-4 tracking-wider">Your Original Draft</h3>
                                        <div className="mb-4">
                                            <div className="text-xs text-slate-400">Title</div>
                                            <div className="font-semibold text-lg">{formData.title}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400">Description</div>
                                            <div className="text-sm">{formData.description || 'No description provided.'}</div>
                                        </div>
                                        <button 
                                            onClick={() => handlePublish(false)}
                                            className="mt-6 w-full py-2 border border-slate-300 dark:border-slate-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 text-sm font-medium transition-colors"
                                        >
                                            Publish Original
                                        </button>
                                    </div>

                                    {/* AI Suggestion Column */}
                                    <div className="bg-nexus-50 dark:bg-nexus-900/20 p-6 rounded-xl border-2 border-nexus-200 dark:border-nexus-700 relative shadow-lg">
                                        <div className="absolute top-0 right-0 bg-nexus-600 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg font-bold">RECOMMENDED</div>
                                        <h3 className="font-bold text-nexus-600 dark:text-nexus-400 uppercase text-xs mb-4 tracking-wider flex items-center gap-2">
                                            <Bot className="w-4 h-4" /> AI Improved Version
                                        </h3>
                                        <div className="mb-4">
                                            <div className="text-xs text-slate-400">Improved Title</div>
                                            <div className="font-semibold text-lg text-nexus-900 dark:text-white">{aiSuggestion.improvedTitle}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400">Concise Description</div>
                                            <div className="text-sm text-nexus-800 dark:text-slate-200">{aiSuggestion.improvedDescription}</div>
                                        </div>
                                        <button 
                                            onClick={() => handlePublish(true)}
                                            className="mt-6 w-full py-3 bg-nexus-600 text-white rounded-lg hover:bg-nexus-700 font-bold shadow-md flex items-center justify-center gap-2 transform hover:-translate-y-1 transition-all"
                                        >
                                            <Check className="w-4 h-4" /> Publish This Version
                                        </button>
                                    </div>
                                </div>
                                
                                <button onClick={() => setAiSuggestion(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white mx-auto">
                                    <ArrowRight className="w-4 h-4 rotate-180" /> Back to Edit
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'manage' && (
                    <div className="space-y-6">
                        <p className="text-slate-500 text-sm">Select a category to view items. You can edit or delete them.</p>
                        {['latest', 'startup', 'events', 'podcasts'].map(cat => (
                            <div key={cat} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                <div className="bg-slate-50 dark:bg-slate-700 px-4 py-2 font-bold capitalize border-b border-slate-200 dark:border-slate-600">{cat}</div>
                                <div className="max-h-60 overflow-y-auto p-2">
                                    {(cat === 'latest' ? latestNews : cat === 'startup' ? startupNews : cat === 'events' ? events : podcasts).map((item: any) => (
                                        <div key={item.id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded border-b border-slate-100 dark:border-slate-800 last:border-0">
                                            <div className="flex-1 mr-4">
                                                <div className="font-medium text-sm truncate">{item.title || item.name}</div>
                                                <div className="text-xs text-slate-400">{item.date || item.startDate}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleEditClick(item, cat)} 
                                                    className="text-nexus-600 p-2 hover:bg-nexus-50 dark:hover:bg-nexus-900/20 rounded-lg transition-colors" 
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4"/>
                                                </button>
                                                <button 
                                                    onClick={() => deleteItem(item.id, cat)} 
                                                    className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
