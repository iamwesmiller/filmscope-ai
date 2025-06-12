import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// Corrected: Using a direct ESM import from a CDN to resolve the module in this environment.
// This is necessary for the preview to work. Your local build will still use the npm package.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'; 
import { 
    ChevronLeft, ChevronRight, Search, Target, Bot, Zap, Film, BarChart2, Clapperboard, 
    Megaphone, Calendar, LayoutDashboard, Settings, Plus, Trash2, Edit, Copy, MoreVertical, 
    Clock, ArrowRight, Video, UploadCloud, FileText, Lightbulb, TrendingUp, Filter, Users, 
    Palette, Info, CheckCircle, XCircle, AlertTriangle, Briefcase, Download, Trophy, 
    AtSign, Link, Star, Newspaper, MessageSquare, Handshake, ThumbsUp, ThumbsDown, DollarSign,
    PieChart, Sliders, MapPin, Send, MessageCircle, Smile, Meh, Frown, Scissors, UserCog, KeyRound, CopyCheck,
    Printer, Upload, FileDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, ComposedChart } from 'recharts';

// --- SUPABASE & API CLIENT SETUP ---

// IMPORTANT: Create a .env.local file in your project's root
// and add your Supabase credentials and Gemini API key.
// REACT_APP_SUPABASE_URL=YOUR_SUPABASE_URL
// REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
// REACT_APP_GEMINI_API_KEY=YOUR_GEMINI_API_KEY

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;

// Initialize Supabase client
// Note: This initialization may not work fully in preview without valid keys.
// It is set up for a real deployment environment.
export const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : {};


// --- GEMINI API HELPER ---
const callGeminiApi = async (prompt, isJson = false) => {
    if (!geminiApiKey) {
        console.error("Gemini API key is missing.");
        // Return a mock error response for the UI
        return { error: "Gemini API key is not configured." };
    }
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        ...(isJson && { 
            generationConfig: {
                responseMimeType: "application/json",
            }
        })
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Gemini API Error:", errorBody.error.message);
            throw new Error(`API request failed with status ${response.status}: ${errorBody.error.message}`);
        }

        const data = await response.json();
        const text = data.candidates[0]?.content?.parts[0]?.text;
        
        if (!text) {
             throw new Error("No content received from Gemini API.");
        }

        return isJson ? JSON.parse(text) : text;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return { error: error.message };
    }
};


// --- CONSTANTS ---
const GENRES = ["Action", "Horror", "Drama", "Comedy", "Documentary", "Sci-Fi", "Thriller"];
const DEMOGRAPHICS = ["Teenagers (13-17)", "Young Adults (18-24)", "Adults (25-34)", "Middle-Aged (35-54)", "Seniors (55+)", "I need help identifying"];
const PLATFORMS = {
  instagram: { name: "Instagram", icon: "📸", color: "bg-pink-500", chartColor: "#ec4899" },
  tiktok: { name: "TikTok", icon: "🎵", color: "bg-cyan-400", chartColor: "#22d3ee" },
  youtube: { name: "YouTube", icon: "📺", color: "bg-red-600", chartColor: "#ef4444" },
  facebook: { name: "Facebook", icon: "👍", color: "bg-blue-600", chartColor: "#3b82f6" },
  twitter: { name: "X (Twitter)", icon: "🐦", color: "bg-gray-400", chartColor: "#9ca3af" },
  snapchat: { name: "Snapchat", icon: "👻", color: "bg-yellow-400", chartColor: "#facc15" },
};


// --- UI COMPONENTS ---
const AppCard = ({ children, className = '', ...props }) => ( <div className={`bg-gradient-to-br from-zinc-900/70 to-zinc-950/70 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl transition-colors duration-300 hover:border-purple-500/50 ${className}`} {...props}> {children} </div> );
const SectionTitle = ({ icon, children, ...props }) => { const Icon = icon; return ( <h2 className="text-2xl font-semibold text-zinc-100 mb-6 flex items-center gap-3 font-poppins" {...props}> <Icon className="w-7 h-7 text-purple-400" /> <span>{children}</span> </h2> ); };
const AppButton = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, icon: Icon, type = "button", as: Component = 'button', ...props }) => { const baseStyle = "inline-flex items-center justify-center font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all duration-200 ease-in-out"; const sizeStyles = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-base" }; const variantStyles = { primary: "bg-purple-600 hover:bg-purple-500 text-white focus:ring-purple-500 border border-transparent", secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 focus:ring-zinc-500 border border-zinc-700", danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-transparent", outline: "bg-transparent border border-zinc-700 hover:bg-zinc-800 text-zinc-300 focus:ring-zinc-600", ghost: "bg-transparent hover:bg-zinc-800 text-zinc-300 focus:ring-600" }; const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : ""; return ( <Component type={Component === 'button' ? type : undefined} onClick={onClick} disabled={disabled} className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyle} ${className}`} {...props}> {Icon && <Icon size={size === 'sm' ? 16 : 18} className={children ? "mr-2" : ""} />} {children} </Component> ); };
const StatCard = ({ title, value, icon, color }) => { const Icon = icon; return (<AppCard className="p-4"><div className="flex items-center"><div className={`p-3 rounded-lg mr-4 ${color}`}><Icon className="w-6 h-6 text-white" /></div><div><p className="text-sm text-zinc-400">{title}</p><p className="text-2xl font-bold text-white font-poppins">{value}</p></div></div></AppCard>); };
const ConfidenceBar = ({ value }) => ( <div><div className="flex justify-between items-center mb-1"><span className="text-sm font-semibold text-zinc-300">Confidence Score</span><span className="text-sm font-bold text-purple-400">{value}%</span></div><div className="w-full bg-zinc-800 rounded-full h-2.5"><div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${value}%` }}></div></div></div> );
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm" }) => { if (!isOpen) return null; return ( <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"> <AppCard className="p-8 max-w-md w-full animate-fade-in-up"> <h3 className="text-xl font-bold text-white mb-4 font-poppins">{title}</h3> <p className="text-zinc-300 mb-6">{message}</p> <div className="flex justify-end gap-4"> <AppButton onClick={onCancel} variant="secondary">Cancel</AppButton> <AppButton onClick={onConfirm} variant="danger">{confirmText}</AppButton> </div> </AppCard> </div> ); };
const Notification = ({ message, type, onDismiss }) => { if (!message) return null; const icons = { success: CheckCircle, error: XCircle, info: Info }; const Icon = icons[type]; useEffect(() => { const timer = setTimeout(onDismiss, 4000); return () => clearTimeout(timer); }, [onDismiss]); return ( <div className="fixed top-20 right-8 z-50 animate-fade-in-down"> <AppCard className={`flex items-center p-4 rounded-xl border-l-4 ${type === 'success' ? 'border-green-400' : type === 'error' ? 'border-red-400' : 'border-blue-400'}`}> <Icon className={`w-6 h-6 mr-3 ${type === 'success' ? 'text-green-400' : type === 'error' ? 'text-red-400' : 'text-blue-400'}`} /> <p className="text-white">{message}</p> <button onClick={onDismiss} className="ml-4 text-zinc-400 hover:text-white"><XCircle size={18} /></button> </AppCard> </div> ); };
const AppInput = ({...props}) => <input {...props} className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors" />;
const AppTextarea = ({...props}) => <textarea {...props} className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors resize-y"/>;
const AppSelect = ({...props}) => <select {...props} className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"/>;

// --- FEATURE COMPONENTS ---

const AudienceAnalysis = ({ filmData, setFilmData, setNotification }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  const handleInputChange = (e) => { const { name, value } = e.target; setFilmData(prev => ({ ...prev, [name]: value })); };

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);
    const prompt = `
      Analyze the target audience for the following independent film and return the analysis as a JSON object.
      
      Film Data:
      - Title: ${filmData.title}
      - Genre: ${filmData.genre}
      - Budget: ${filmData.budget}
      - Logline: ${filmData.logline}
      - Unique Elements: ${filmData.uniqueElements}
      - Stated Demographic: ${filmData.demographic}

      Provide the following in your JSON response:
      1. "confidence": A number (0-100) representing your confidence in this analysis.
      2. "targetDemographic": A string identifying the most likely target demographic. If the user provided "I need help identifying", determine the best fit.
      3. "genreInsights": A string with 2-3 sentences of insights specific to marketing this genre.
      4. "contentPillars": An array of 4 strings representing key content themes (e.g., "Behind-the-Scenes").
      5. "metaTargeting": An object with two keys: "interests" (an array of 10-15 strings for Meta Ads interest targeting) and "behaviors" (an array of 5-7 strings for Meta Ads behavior/demographic targeting).
    `;
    const result = await callGeminiApi(prompt, true);
    if (result && !result.error) {
        setAnalysis(result);
    } else {
        setNotification({ type: 'error', message: result?.error || 'Failed to get analysis from AI.' });
    }
    setLoading(false);
  };
  
  const handleCopyToClipboard = (textToCopy, type) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  useEffect(() => { if(filmData.demographic === 'I need help identifying' && filmData.title) { handleAnalyze(); } else { setAnalysis(null); } }, [filmData.demographic]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <AppCard className="p-8">
        <SectionTitle icon={Target}>Film Data Input</SectionTitle>
        <div className="space-y-6">
          <AppInput type="text" name="title" placeholder="Film Title" value={filmData.title} onChange={handleInputChange} />
          <AppSelect name="genre" value={filmData.genre} onChange={handleInputChange}>{GENRES.map(g => <option key={g} value={g}>{g}</option>)}</AppSelect>
          <AppInput type="text" name="budget" placeholder="Budget Range (e.g., $50k - $100k)" value={filmData.budget} onChange={handleInputChange} />
          <AppTextarea name="logline" placeholder="Logline" value={filmData.logline} onChange={handleInputChange} rows="3"></AppTextarea>
           <AppTextarea name="uniqueElements" placeholder="Unique Elements (e.g., specific cast, unique setting)" value={filmData.uniqueElements} onChange={handleInputChange} rows="3"></AppTextarea>
          <AppSelect name="demographic" value={filmData.demographic} onChange={handleInputChange}>{DEMOGRAPHICS.map(d => <option key={d} value={d}>{d}</option>)}</AppSelect>
          <AppButton onClick={handleAnalyze} disabled={loading || !filmData.title} className="w-full" size="lg"> {loading ? 'Analyzing...' : 'Analyze Audience'} </AppButton>
        </div>
      </AppCard>
      <AppCard className="p-8">
        <SectionTitle icon={Bot}>AI Analysis Results</SectionTitle>
        {loading && <div className="flex justify-center items-center h-full"><Bot className="w-12 h-12 text-purple-400 animate-spin" /></div>}
        {analysis && !loading && (
          <div className="space-y-6 animate-fade-in">
            <ConfidenceBar value={analysis.confidence} />
            <div> <h3 className="font-semibold text-lg text-white mb-2 font-poppins">Target Demographic</h3> <p className="text-purple-300 bg-purple-900/30 px-4 py-2 rounded-lg">{analysis.targetDemographic}</p> </div>
            <div> <h3 className="font-semibold text-lg text-white mb-2 font-poppins">Genre-Specific Insights</h3> <p className="text-zinc-300">{analysis.genreInsights}</p> </div>
            
            {analysis.metaTargeting && (
                <AppCard className="p-4 bg-zinc-800/50">
                    <h3 className="font-bold text-lg text-white mb-3 flex items-center gap-2 font-poppins">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0.46875C5.37109 0.46875 0 5.83984 0 12.4688C0 18.332 3.93359 23.2305 9.25 24.2852V15.543H6.53516V12.1641H9.25V9.63672C9.25 6.94141 10.8516 5.48047 13.293 5.48047C14.4414 5.48047 15.3984 5.57422 15.6523 5.60938V8.63672H13.8438C12.5547 8.63672 12.2852 9.28125 12.2852 10.0156V12.1641H15.5117L15.0117 15.543H12.2852V24.4688C18.2539 23.7188 24 18.7305 24 12.4688C24 5.83984 18.6289 0.46875 12 0.46875Z"/></svg>
                        Meta Ads Targeting
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-zinc-200 font-poppins">Interests</h4>
                                <AppButton onClick={() => handleCopyToClipboard(analysis.metaTargeting.interests.join(', '), 'Interests')} variant="ghost" size="sm" icon={copied === 'Interests' ? CopyCheck : Copy}>
                                    {copied === 'Interests' ? 'Copied' : 'Copy'}
                                </AppButton>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {analysis.metaTargeting.interests.map(i => <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">{i}</span>)}
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-zinc-200 font-poppins">Behaviors / Demographics</h4>
                                <AppButton onClick={() => handleCopyToClipboard(analysis.metaTargeting.behaviors.join(', '), 'Behaviors')} variant="ghost" size="sm" icon={copied === 'Behaviors' ? CopyCheck : Copy}>
                                    {copied === 'Behaviors' ? 'Copied' : 'Copy'}
                                </AppButton>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {analysis.metaTargeting.behaviors.map(b => <span key={b} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded-full">{b}</span>)}
                            </div>
                        </div>
                    </div>
                </AppCard>
            )}

            <div> <h3 className="font-semibold text-lg text-white mb-2 font-poppins">Strategic Content Pillars</h3> <div className="grid grid-cols-2 gap-2"> {analysis.contentPillars.map(pillar => ( <div key={pillar} className="bg-zinc-800 p-2 rounded-lg text-center text-sm text-zinc-200">{pillar}</div> ))} </div> </div>
          </div>
        )}
        {!analysis && !loading && <div className="text-center text-zinc-400 pt-16">Enter film data and click Analyze to see results.</div>}
      </AppCard>
    </div>
  );
};

const CampaignManager = ({ campaigns, setCampaigns, setNotification, setActiveTab }) => {
    const [view, setView] = useState('dashboard');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    const handleCreateNew = () => { 
        setEditingCampaign({ title: '', content: '', platform: 'instagram', type: 'Visual', status: 'Draft', meta_ad_status: 'Not Promoted' }); 
        setShowEditModal(true); 
    };
    const handleEdit = (campaign) => { setEditingCampaign(campaign); setShowEditModal(true); };
    
    const handleDelete = (campaign) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Campaign",
            message: `Are you sure you want to delete the campaign "${campaign.title}"? This action cannot be undone.`,
            onConfirm: async () => {
                if(!supabase.from) { setNotification({type: 'error', message: 'Supabase not configured.'}); return; }
                const { error } = await supabase.from('campaigns').delete().match({ id: campaign.id });
                if (error) {
                    setNotification({ type: 'error', message: `Error deleting campaign: ${error.message}` });
                } else {
                    setCampaigns(prev => prev.filter(c => c.id !== campaign.id));
                    setNotification({ type: 'info', message: 'Campaign deleted.' });
                }
                setConfirmModal({ isOpen: false });
            }
        });
    };

    const handleDuplicate = async (campaign) => {
        if(!supabase.from) { setNotification({type: 'error', message: 'Supabase not configured.'}); return; }
        const { id, created_at, ...original } = campaign;
        const newCampaign = { ...original, title: `${original.title} (Copy)`, status: 'Draft' };

        const { data, error } = await supabase.from('campaigns').insert([newCampaign]).select();
        if (error) {
            setNotification({ type: 'error', message: `Error duplicating campaign: ${error.message}` });
        } else {
            setCampaigns(prev => [...prev, data[0]]);
            setNotification({ type: 'success', message: 'Campaign duplicated.' });
        }
    };
    
    const handleSave = async (campaignToSave) => {
        if(!supabase.from) { setNotification({type: 'error', message: 'Supabase not configured.'}); return; }
        if (campaignToSave.id) { 
            const { error } = await supabase.from('campaigns').update(campaignToSave).match({ id: campaignToSave.id });
            if(error) { setNotification({ type: 'error', message: `Error updating: ${error.message}` }); } 
            else { setCampaigns(prev => prev.map(c => c.id === campaignToSave.id ? campaignToSave : c)); setNotification({ type: 'success', message: 'Campaign updated!' }); }
        } else { 
            const { data, error } = await supabase.from('campaigns').insert([campaignToSave]).select();
            if(error) { setNotification({ type: 'error', message: `Error creating: ${error.message}` }); } 
            else { setCampaigns(prev => [data[0], ...prev]); setNotification({ type: 'success', message: 'Campaign created as a draft!' }); }
        } 
        setShowEditModal(false); 
        setEditingCampaign(null); 
    };

    const DashboardView = () => (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard title="Total Campaigns" value={campaigns.length} icon={Briefcase} color="bg-purple-500"/>
                  <StatCard title="Active" value={campaigns.filter(c=>c.status==='Active').length} icon={TrendingUp} color="bg-green-500"/>
                  <StatCard title="Scheduled" value={campaigns.filter(c=>c.status==='Scheduled').length} icon={Clock} color="bg-blue-500"/>
                  <StatCard title="Drafts" value={campaigns.filter(c=>c.status==='Draft').length} icon={Edit} color="bg-yellow-500"/>
              </div>
               <AppCard className="p-6">
                   <div className="flex justify-between items-center mb-4"> <h3 className="font-bold text-lg text-white font-poppins">All Campaigns</h3> <AppButton onClick={handleCreateNew} icon={Plus}>Create Campaign</AppButton> </div>
                   <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                     {campaigns.map(campaign => (
                         <div key={campaign.id} className="bg-zinc-800/50 p-3 rounded-lg flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <span className={`text-2xl`}>{PLATFORMS[campaign.platform]?.icon || '❓'}</span>
                              <div>
                                   <p className="font-semibold text-white">{campaign.title}</p>
                                   <p className="text-sm text-zinc-300">{campaign.type} - <span className={`px-2 py-0.5 text-xs rounded-full ${ campaign.status === 'Active' ? 'bg-green-500/20 text-green-300' : campaign.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-300' : campaign.status === 'Draft' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-500/20 text-gray-300' }`}>{campaign.status}</span></p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2"> 
                               <AppButton onClick={() => handleEdit(campaign)} variant="secondary" icon={Edit} className="!p-2"/> 
                               <AppButton onClick={() => handleDuplicate(campaign)} variant="secondary" icon={Copy} className="!p-2"/> 
                               <AppButton onClick={() => handleDelete(campaign)} variant="danger" icon={Trash2} className="!p-2"/> 
                           </div>
                         </div>
                     ))}
                   </div>
                </AppCard>
          </div>
          <AppCard className="p-6"><h3 className="font-bold text-lg text-white mb-4 flex items-center font-poppins"><Bot className="mr-2"/> AI Optimization Engine</h3></AppCard>
        </div>
    );
      
    const CampaignEditModal = ({ isOpen, onClose, onSave, campaignData, setNotification }) => { if (!isOpen || !campaignData) return null; const [campaign, setCampaign] = useState(campaignData); useEffect(() => { setCampaign(campaignData); }, [campaignData]); const handleInputChange = e => { const {name, value} = e.target; setCampaign(p => ({...p, [name]: value})); }; const handleSave = () => { if (!campaign.title || !campaign.content) { setNotification({type: 'error', message: 'Title and Content are required.'}); return; } onSave(campaign); }; return (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"><AppCard className="p-8 max-w-2xl w-full animate-fade-in-up"><div className="flex justify-between items-start mb-6"><h3 className="text-2xl font-bold text-white font-poppins">{campaign.id ? 'Edit Campaign' : 'Create New Campaign'}</h3><AppButton onClick={onClose} variant="secondary" icon={XCircle} className="!p-2"/></div><div className="space-y-4"><AppInput type="text" name="title" value={campaign.title} onChange={handleInputChange} placeholder="Campaign Title"/><AppTextarea name="content" value={campaign.content} onChange={handleInputChange} placeholder="Campaign Content..." rows="5"></AppTextarea><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><AppSelect name="platform" value={campaign.platform} onChange={handleInputChange}>{Object.keys(PLATFORMS).map(p=><option key={p} value={p}>{PLATFORMS[p].name}</option>)}</AppSelect><AppSelect name="type" value={campaign.type} onChange={handleInputChange}><option>Visual</option><option>Video</option><option>Text</option><option>Community</option></AppSelect></div></div><div className="flex justify-end gap-3 mt-6"><AppButton onClick={handleSave} variant="primary">Save</AppButton></div></AppCard></div>);};


    return (
        <div>
            <ConfirmationModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal({ isOpen: false })} />
            <CampaignEditModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} onSave={handleSave} campaignData={editingCampaign} setNotification={setNotification} />
            <div className="flex items-center justify-between mb-8">
                <SectionTitle icon={Briefcase}>Campaign Manager</SectionTitle>
                <div className="flex items-center gap-2">
                    <AppButton onClick={() => setView('dashboard')} variant={view === 'dashboard' ? 'primary' : 'secondary'} icon={LayoutDashboard}>Dashboard</AppButton>
                    <AppButton onClick={() => setView('calendar')} variant={view === 'calendar' ? 'primary' : 'secondary'} icon={Calendar} disabled>Calendar</AppButton>
                    <AppButton onClick={() => setView('analytics')} variant={view === 'analytics' ? 'primary' : 'secondary'} icon={BarChart2} disabled>Analytics</AppButton>
                </div>
            </div>
            <DashboardView />
        </div>
    );
};

// --- MAIN APP COMPONENT ---

const FilmScopeAI = () => {
  const [activeTab, setActiveTab] = useState('audience');
  const [filmData, setFilmData] = useState({ title: '', genre: 'Horror', budget: '', logline: '', demographic: 'Young Adults (18-24)', uniqueElements: '' });
  const [campaigns, setCampaigns] = useState([]);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        if (supabase.from) {
             const { data: campaignData, error: campaignError } = await supabase
                .from('campaigns')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (campaignError) {
                setNotification({ type: 'error', message: `Could not fetch campaigns: ${campaignError.message}`});
                console.error(campaignError);
            } else {
                setCampaigns(campaignData);
            }
        } else {
            setNotification({ type: 'info', message: 'Supabase is not configured. Displaying sample data.' });
            // Load mock data if Supabase isn't configured for the preview
            setCampaigns([
                { id: 1, title: 'Sample Teaser Trailer', platform: 'youtube', type: 'Video', status: 'Active' },
                { id: 2, title: 'Sample Poster Reveal', platform: 'instagram', type: 'Visual', status: 'Scheduled' },
            ]);
        }
        setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleDismissNotification = useCallback(() => {
    setNotification({ message: '' });
  }, []);

  const tabs = {
    audience: { label: 'Audience Analysis', icon: Target, component: <AudienceAnalysis filmData={filmData} setFilmData={setFilmData} setNotification={setNotification} /> },
    campaigns: { label: 'Campaign Manager', icon: Briefcase, component: <CampaignManager campaigns={campaigns} setCampaigns={setCampaigns} setNotification={setNotification} setActiveTab={setActiveTab} /> },
  };
  
  // Font loading effect
  useEffect(() => {
    const poppinsLink = document.createElement('link');
    poppinsLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    poppinsLink.rel = 'stylesheet';

    const interLink = document.createElement('link');
    interLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
    interLink.rel = 'stylesheet';

    document.head.appendChild(poppinsLink);
    document.head.appendChild(interLink);

    return () => {
        document.head.removeChild(poppinsLink);
        document.head.removeChild(interLink);
    }
  }, []);

  return (
    <div className="bg-zinc-950 text-zinc-200 font-normal" style={{ fontFamily: "'Inter', sans-serif", backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 0h3v1H0V0zm0 2h1v3H0V2zm2 0h3v1H2V2zm0 2h1v3H2V4zm4 0h1v3h-1V4zm-2 2h3v1H2V6z'/%3E%3C/g%3E%3C/svg%3E")` }}>
        <Notification message={notification.message} type={notification.type} onDismiss={handleDismissNotification} />
        
        <div className="flex min-h-screen">
            <aside className="w-64 bg-gradient-to-b from-black/50 to-zinc-950/50 p-6 space-y-6 border-r border-zinc-800 flex flex-col sticky top-0 h-screen">
            <div className="flex items-center space-x-3">
                <Film className="w-10 h-10 text-purple-500" />
                <h1 className="text-2xl font-semibold text-white font-poppins">FilmScope<span className="text-purple-400">AI</span></h1>
            </div>
            <nav className="space-y-2 flex-grow">
                {Object.entries(tabs).map(([key, { label, icon }]) => {
                const Icon = icon;
                return (
                    <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors text-sm font-semibold ${
                        activeTab === key ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                    >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{label}</span>
                    </button>
                );
                })}
            </nav>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Bot className="w-16 h-16 text-purple-400 animate-spin" />
                    </div>
                ) : (
                    tabs[activeTab].component
                )}
            </main>
        </div>
    </div>
  );
};

export default FilmScopeAI;

