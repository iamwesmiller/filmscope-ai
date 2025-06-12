import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'; // Import useCallback
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


// --- MOCK DATA & HELPERS ---

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

// Mock API Call
const mockApiCall = (data, duration = 1500) => new Promise(resolve => setTimeout(() => resolve(data), duration));

// --- MOCK DATA FOR FEATURES ---
const generateAudienceAnalysis = (filmData) => {
    const baseInsights = {
        confidence: Math.floor(Math.random() * 10) + 90,
        psychographics: { values: ["Authenticity", "Community", "Entertainment"], motivations: ["Discovering new stories", "Escapism", "Social connection"], interests: ["Indie Films", "Filmmaking", "Storytelling"] },
        platformRecommendations: ["instagram", "tiktok", "youtube"],
        contentPillars: ["Behind-the-Scenes", "Filmmaker's Journey", "Thematic Deep Dives", "Community Engagement"],
        keyInsights: ["Authentic, story-driven content performs best.", "Short-form video is crucial for discovery.", "Collaborations with micro-influencers can boost reach."],
        metaTargeting: {
            interests: ["Independent films", "Film festivals", "A24", "Screenwriting", "Cinematography"],
            behaviors: ["Engaged Shoppers", "Arts & Culture Aficionados", "Movie Lovers"],
        }
    };
    switch (filmData.genre) {
        case 'Horror': return { ...baseInsights, 
            targetDemographic: "Young Adults (18-24) & Adults (25-34)", 
            genreInsights: "Horror audiences crave suspense and jump scares. Focus on atmospheric trailers, cryptic posters, and ARG-style social media campaigns.", 
            psychographics: { ...baseInsights.psychographics, values: ["Adrenaline", "Mystery", "Shared Fear"] },
            metaTargeting: {
                interests: ["Horror movies", "Stephen King", "Shudder", "Blumhouse Productions", "Crypt TV", "Found footage films"],
                behaviors: ["Streamers", "Horror genre fans", "Console Gamers"],
            } 
        };
        case 'Comedy': return { ...baseInsights, 
            targetDemographic: "All Ages (skewing Young Adults)", 
            genreInsights: "Comedy thrives on relatable and shareable clips. Use memes, funny outtakes, and collaborations with comedians.", 
            platformRecommendations: ["tiktok", "instagram", "youtube"],
            metaTargeting: {
                interests: ["Comedy movies", "Stand-up comedy", "The Onion", "Funny or Die", "Judd Apatow", "Saturday Night Live"],
                behaviors: ["Frequent online video watchers", "Engaged with humor pages"],
            }
        };
        default: return { ...baseInsights, 
            targetDemographic: "Adults (25-34) & Middle-Aged (35-54)", 
            genreInsights: "Drama audiences appreciate character depth and emotional storytelling. Use character-focused featurettes and thought-provoking questions in your copy.",
            metaTargeting: {
                interests: ["Drama films", "HBO", "Sundance Film Festival", "Character study", "Criterion Collection"],
                behaviors: ["Read books frequently", "Follow news and culture pages"],
            }
        };
    }
};

const generateVideoAnalysis = (videoData, genre) => {
    const duration = Math.floor(Math.random() * 180) + 60;
    const sceneCount = Math.floor(Math.random() * 10) + 5;
    const baseAnalysis = {
        technical: { duration: `${Math.floor(duration / 60)}m ${duration % 60}s`, scenes: sceneCount, pacing: "Medium", productionValue: "High" },
        marketingPotential: "Very High",
        platformSuggestions: { tiktok: "Create a 15s trend video.", instagram: "Post a 60s trailer edit for Reels.", youtube: "Upload a 2-minute extended trailer." },
        socialStrategy: "Focus on creating 3-5 short clips from key marketing moments to build hype.",
    };
    switch (genre) {
        case 'Horror': return { ...baseAnalysis, keyMoments: [ { time: "0:12", description: "Atmospheric opening shot." }, { time: "0:45", description: "First jump scare." }, { time: "1:32", description: "Reveal of antagonist." } ] };
        default: return { ...baseAnalysis, keyMoments: [ { time: "0:25", description: "Witty dialogue exchange." }, { time: "1:10", description: "Main emotional turning point." }, { time: "2:05", description: "Visually stunning wide shot." } ] };
    }
};

const generateNewVideoCuts = (genre) => {
    const tiktokStyles = [ "Focus on evocative sound design and quick, non-linear cuts. Ends on a single line of dialogue for maximum intrigue.", "Use a trending sound and quick cuts that highlight the most visually striking moments.", "Create a 'stitch this' prompt asking viewers what they think happens next.", "A silent, text-overlay-driven story that builds suspense slowly before a final reveal." ];
    const instagramStyles = [ "Builds atmospheric tension before a powerful musical swell. Uses misdirection and character-focused close-ups.", "A fast-paced montage set to a high-energy track, ending with the film's title card.", "A character-focused edit showing a range of emotions with minimal dialogue.", "A visually stunning 30-second loop designed for the Reels feed, focusing on aesthetics." ];
    const youtubeStyles = [ "A single, visually stunning shot with a powerful sound effect and title card. Designed for immediate brand recall.", "A 15-second unskippable ad that poses a question directly to the viewer.", "A vertical Short that teases a key plot point without giving away the context.", "A slow-burn 30-second ad that feels more like a short film than a commercial." ];
    const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const versionNumber = Math.floor(Math.random() * 90) + 10;
    return [ { platform: 'tiktok', title: `Viral Cut (v${versionNumber})`, description: randomChoice(tiktokStyles), previewUrl: `https://placehold.co/270x480/0f172a/ffffff?text=TikTok+v${versionNumber}` }, { platform: 'instagram', title: `Reels Trailer (v${versionNumber})`, description: randomChoice(instagramStyles), previewUrl: `https://placehold.co/400x500/0f172a/ffffff?text=Reels+v${versionNumber}` }, { platform: 'youtube', title: `Bumper Ad (v${versionNumber})`, description: randomChoice(youtubeStyles), previewUrl: `https://placehold.co/480x270/0f172a/ffffff?text=Bumper+v${versionNumber}` }, ];
};

const generateContentIdeas = (filmData) => {
    const ideasBank = [
        { platform: 'instagram', idea: 'Carousel post with 5 stunning stills from the film.', type: 'Visual' },
        { platform: 'tiktok', idea: 'A "Day in the Life" of the lead actor during the shoot.', type: 'Behind-the-Scenes' },
        { platform: 'youtube', idea: '10-minute video breaking down the making of the most complex scene.', type: 'Educational' },
        { platform: 'facebook', idea: 'Run a poll asking which character poster fans like best.', type: 'Community' },
        { platform: 'instagram', idea: 'Animate the movie poster with subtle motion graphics for a Reel.', type: 'Visual' },
        { platform: 'tiktok', idea: 'Use a trending audio to showcase the main character\'s emotional journey in 15 seconds.', type: 'Video Clip' },
        { platform: 'twitter', idea: 'Host a live Q&A with the screenwriter about the script\'s origins.', type: 'Community' },
        { platform: 'youtube', idea: 'A compilation of all the positive reviews from critics.', type: 'Social Proof' }
    ];
    const shuffled = ideasBank.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4).map(idea => ({
        ...idea,
        id: `ci_${Math.random()}`,
        engagement: ['Low', 'Medium', 'High', 'Very High'][Math.floor(Math.random() * 4)],
        audience: ['General', 'Niche Fans', 'Filmmakers', 'Critics'][Math.floor(Math.random() * 4)]
    }));
};

const generateVisualAnalysis = (posterA, posterB, filmData) => { const winner = Math.random() > 0.5 ? 'B' : 'A'; const loser = winner === 'A' ? 'B' : 'A'; return { recommendation: `Version ${winner}`, confidence: Math.floor(Math.random() * 20) + 75, insight: `Version ${winner}'s design is more effective for ${filmData.genre}.`, metrics: { [winner]: { clarity: Math.floor(Math.random() * 10) + 90, emotionalResonance: Math.floor(Math.random() * 10) + 88, typographyReadability: Math.floor(Math.random() * 10) + 91, demographicAppeal: Math.floor(Math.random() * 10) + 89 }, [loser]: { clarity: Math.floor(Math.random() * 20) + 70, emotionalResonance: Math.floor(Math.random() * 20) + 68, typographyReadability: Math.floor(Math.random() * 20) + 75, demographicAppeal: Math.floor(Math.random() * 20) + 72 } } }; };

const generateBudgetPlan = (budget, goal, filmData, grassrootsData) => {
    const totalBudget = Number(budget);
    let basePercentages = { meta: 0.30, influencer: 0.25, pr: 0.20, content: 0.15, grassroots: 0.10, };

    switch (goal) {
        case 'awareness': basePercentages = { meta: 0.50, influencer: 0.20, pr: 0.15, content: 0.10, grassroots: 0.05, }; break;
        case 'engagement': basePercentages = { meta: 0.25, influencer: 0.35, pr: 0.10, content: 0.25, grassroots: 0.05, }; break;
        case 'conversion': basePercentages = { meta: 0.60, influencer: 0.20, pr: 0.10, content: 0.05, grassroots: 0.05, }; break;
        case 'grassroots': basePercentages = { meta: 0.10, influencer: 0.10, pr: 0.10, content: 0.10, grassroots: 0.60, }; break;
    }
    
    const granularBreakdown = (category, amount) => {
        switch(category) {
            case 'Meta Ads': return [ { name: 'Top-of-Funnel (Awareness)', amount: amount * 0.6 }, { name: 'Mid-Funnel (Retargeting)', amount: amount * 0.3 }, { name: 'Bottom-Funnel (Conversion)', amount: amount * 0.1 } ];
            case 'Influencer Marketing': return [ { name: 'Tier 1 Influencers (Large)', amount: amount * 0.5 }, { name: 'Micro-Influencers (Niche)', amount: amount * 0.5 } ];
            case 'Public Relations': return [ { name: 'Press Release Distribution', amount: amount * 0.4 }, { name: 'Media Outreach Tools', amount: amount * 0.3 }, { name: 'Digital Press Kits', amount: amount * 0.3 } ];
            case 'Content Creation': return [ { name: 'Video Editing (Social Cuts)', amount: amount * 0.7 }, { name: 'Graphic Design', amount: amount * 0.3 } ];
            case 'Grassroots Tour':
                const { cities, screenings } = grassrootsData;
                const numCities = cities.length;
                const numScreenings = Number(screenings) || 1;
                const venueCost = amount * 0.5;
                const marketingCost = amount * 0.2;
                const travelCost = amount * 0.3;
                return [ { name: `Venue Rental (${numCities} cities x ${numScreenings} screenings)`, amount: venueCost }, { name: 'Local Marketing Materials', amount: marketingCost }, { name: 'Staffing & Travel', amount: travelCost } ];
            default: return [];
        }
    };
    
    const allocations = Object.entries(basePercentages).map(([key, percentage]) => {
        const categoryName = { meta: 'Meta Ads', influencer: 'Influencer Marketing', pr: 'Public Relations', content: 'Content Creation', grassroots: 'Grassroots Tour' }[key];
        const amount = totalBudget * percentage;
        const breakdown = granularBreakdown(categoryName, amount);
        return { category: categoryName, amount, percentage: (percentage * 100).toFixed(0), breakdown: breakdown.map(b => ({...b, percentage: (b.amount / amount * 100).toFixed(0)})) };
    });

    return { plan: allocations.filter(a => a.amount > 0), insights: [`For a '${goal}' goal, we've prioritized spending accordingly.`, 'This is a suggested starting point. Monitor performance and adjust allocations based on real-world data.'] };
};

// ... other mock data functions remain unchanged ...
const generateMediaPlan = (data) => {
    const targetCitiesString = data.targetCities.join(', ');
    return { "phase_12_weeks": { title: "12 Weeks Out: Campaign Kickoff", pr: [{ id: 1, text: "Draft and distribute official press release announcing release date via top-tier media contacts.", icon: Newspaper, status: 'To-Do' }], digital: [{ id: 2, text: "Launch 'teaser' poster across all social channels. Pin the post on Twitter and Facebook.", icon: Palette, status: 'To-Do' }], influencers: [], events: [{ id: 3, text: `Finalize screening locations in target markets: ${targetCitiesString}.`, icon: MapPin, status: 'To-Do' }] }, "phase_8_weeks": { title: "8 Weeks Out: Trailer Launch & Digital Blitz", pr: [{ id: 4, text: "Secure 2-3 long-lead interviews with the director/key cast in major outlets like IndieWire.", icon: AtSign, status: 'To-Do' }], digital: [ { id: 5, text: "Drop official trailer exclusively with a major outlet (e.g., IGN, Collider) for 24 hours before wide release.", icon: Video, status: 'To-Do' }, { id: 6, text: "Begin initial digital ad burst ($15,000) focusing on trailer views and awareness in target DMAs.", icon: DollarSign, status: 'To-Do' }, ], influencers: [{ id: 7, text: "Initiate outreach to Tier 1 influencers (e.g., @filmnerd, CinemaStix) for trailer reaction videos.", icon: Handshake, status: 'To-Do' }], events: [] }, "phase_4_weeks": { title: "4 Weeks Out: Build Momentum", pr: [{ id: 8, text: "Press junket weekend. Schedule back-to-back interviews for cast and crew.", icon: Users, status: 'To-Do' }], digital: [ { id: 9, text: "Release character-focused social media cards and clips. Increase post frequency to 3x/week.", icon: Clapperboard, status: 'To-Do' }, { id: 10, text: "Launch retargeting ad campaign ($25,000) for users who engaged with the trailer.", icon: Target, status: 'To-Do' } ], influencers: [{ id: 11, text: "Confirm sponsored posts with Tier 1 & Tier 2 influencers to go live during release week.", icon: Star, status: 'To-Do' }], events: [{ id: 12, text: "Host press and influencer screenings in NY, LA, and Chicago.", icon: Film, status: 'To-Do' }] }, "phase_1_week": { title: "Release Week: Maximum Impact", pr: [{ id: 13, text: "Embark on a satellite media tour, targeting morning news shows in top 5 markets.", icon: Megaphone, status: 'To-Do' }], digital: [ { id: 14, text: "Full digital ad blitz ($35,000) focused on ticket sales, with geo-targeted ads for theaters.", icon: TrendingUp, status: 'To-Do' }, { id: 15, text: "Daily social media content: countdowns, positive review quotes, and user-generated content.", icon: MessageSquare, status: 'To-Do' } ], influencers: [{ id: 16, text: "All sponsored influencer content goes live. Monitor for performance.", icon: CheckCircle, status: 'To-Do' }], events: [{ id: 17, text: "Official premiere events in New York and Los Angeles.", icon: Trophy, status: 'To-Do' }] } }; };
const discoverInfluencers = (filmData) => { return [ { id: `inf_${Date.now()}`, name: 'HorrorHype', platform: 'tiktok', followers: '850K', engagement: '19.8%', relevance: '98%', status: 'untracked' }, { id: `inf_${Date.now()+1}`, name: '@ScareSleuth', platform: 'twitter', followers: '75K', engagement: '6.2%', relevance: '91%', status: 'untracked' }, { id: `inf_${Date.now()+2}`, name: 'JumpScare Central', platform: 'youtube', followers: '450K', engagement: '11.5%', relevance: '94%', status: 'untracked' }, ]; }
const initialCampaigns = [ { id: 'camp_1', title: 'Trailer Launch Teaser', content: 'First look at our new film! Trailer drops Friday.', platform: 'instagram', type: 'Video', status: 'Completed', metrics: { reach: 12500, engagement: 8.2, clicks: 450, cost: 50, roas: 3.1 }, metaAdStatus: 'Promoted', createdAt: new Date(2025, 5, 4), creative: { type: 'video_placeholder', url: 'https://placehold.co/400x400/ec4899/ffffff?text=Video+Creative' } }, { id: 'camp_2', title: 'Meet the Director Q&A', content: 'Our director will be live on Instagram this Wednesday at 8 PM EST.', platform: 'instagram', type: 'Community', status: 'Active', metrics: { reach: 8200, engagement: 12.5, clicks: 150, cost: 20, roas: 4.5 }, metaAdStatus: 'Promoted', createdAt: new Date(2025, 5, 5), creative: { type: 'image_placeholder', url: 'https://placehold.co/400x400/ec4899/ffffff?text=Q&A+Graphic' } }, ];
const pressKitData = { mediaAssets: [ { id: 1, type: 'Stills', count: 25, preview: 'https://placehold.co/100x100/1e293b/ffffff?text=Stills' }, { id: 2, type: 'BTS Photos', count: 42, preview: 'https://placehold.co/100x100/1e293b/ffffff?text=BTS' }, ], pressMaterials: [ { id: 1, title: 'Official Press Release', type: 'pdf' }, { id: 2, title: "Director's Statement", type: 'doc' } ], techSpecs: [ { id: 1, title: 'Full Credits', type: 'pdf' }, { id: 2, title: 'Official Trailer (4K)', type: 'link' } ], awards: [ { id: 1, title: 'Sundance 2025 - Official Selection', type: 'laurel' }, { id: 2, title: '"A masterpiece" - IndieWire', type: 'quote' } ], downloadAnalytics: { count: 142, lastDownload: 'IndieWire' } };
const festivalSubmissions = [ { id: 1, name: 'Sundance Film Festival', tier: 'A-List', status: 'Accepted', fee: 85, date: '2024-10-15' }, { id: 2, name: 'SXSW', tier: 'A-List', status: 'Pending', fee: 75, date: '2024-11-01' }, ];
const initialMediaContacts = [ { id: 1, name: 'Jane Doe', outlet: 'IndieWire', type: 'Critic', engagement: 'High' }, { id: 2, name: 'John Smith', outlet: 'The Hollywood Reporter', type: 'Press', engagement: 'Medium' }, ];
const initialInfluencers = [ { id: 'inf_1', name: '@filmnerd', platform: 'tiktok', followers: '2.1M', engagement: '15.2%', relevance: '95%', status: 'contacted' }, { id: 'inf_2', name: 'CinemaStix', platform: 'youtube', followers: '750K', engagement: '8.1%', relevance: '92%', status: 'signed' }, ];
const reviews = [ { id: 1, source: 'Variety', sentiment: 'Positive', text: 'An instant indie classic...' }, { id: 2, source: 'Letterboxd User', sentiment: 'Mixed', text: 'Loved the visuals, but the pacing felt a bit off.' }, ];
const communityConversations = [ { id: 'convo_1', platform: 'instagram', user: { name: 'indieFan22', avatar: 'https://placehold.co/40x40/ec4899/ffffff?text=I' }, lastMessage: 'This looks incredible! When is the release date?', sentiment: 'Positive', unread: true, messages: [ { from: 'user', text: 'This looks incredible! When is the release date?' } ], aiAnalysis: { sentimentScore: 95, suggestedReplies: [ { title: 'Acknowledge & Thank', text: 'Thank you so much! We\'re thrilled you\'re excited.' }, { title: 'Provide Info', text: 'Fall 2025! Follow us for updates.' } ] } }, ];
const performanceAnalyticsData = { totalReach: '239.9K', engagementRate: '11.4%', totalSpend: '$170', roas: '6.8x', reachByDay: [ { day: 'Mon', reach: 2000 }, { day: 'Tue', reach: 5000 }, ], engagementByPlatform: [ { platform: 'TikTok', engagement: 18.3, reach: 150.2 }, { platform: 'Instagram', engagement: 10.3, reach: 20.7 }, ], insights: [ { text: 'Behind-the-scenes content on TikTok has a 340% higher engagement rate.', icon: Film, color: 'text-purple-400' }, { text: 'Your Instagram Q&A is performing well.', icon: Clapperboard, color: 'text-pink-400' }, ] };

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
const CampaignDetailModal = ({ campaign, isOpen, onClose }) => { if (!isOpen || !campaign) return null; const dailyPerformanceData = Array.from({ length: 7 }, (_, i) => ({ day: `Day ${i + 1}`, reach: Math.floor((campaign.metrics.reach / 7) * (Math.random() * 0.4 + 0.8) * (i + 1)), clicks: Math.floor((campaign.metrics.clicks / 7) * (Math.random() * 0.5 + 0.7) * (i + 1)) })); return ( <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"> <AppCard className="p-8 max-w-3xl w-full animate-fade-in-up"> <div className="flex justify-between items-start mb-6"> <div> <div className="flex items-center gap-3"> <span className={`text-3xl p-2 rounded-lg ${PLATFORMS[campaign.platform].color}`}>{PLATFORMS[campaign.platform].icon}</span> <h3 className="text-2xl font-bold text-white font-poppins">{campaign.title}</h3> </div> <p className="text-sm text-zinc-300 ml-14 -mt-2">{campaign.type} Campaign</p> </div> <AppButton onClick={onClose} variant="secondary" icon={XCircle} className="!p-2" /> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> <div> <h4 className="font-bold text-lg mb-4 font-poppins">Key Metrics</h4> <div className="space-y-3"> <p className="flex justify-between">Reach: <span className="font-bold text-white">{campaign.metrics.reach?.toLocaleString()}</span></p> <p className="flex justify-between">Engagement Rate: <span className="font-bold text-white">{campaign.metrics.engagement}%</span></p> <p className="flex justify-between">Clicks: <span className="font-bold text-white">{campaign.metrics.clicks?.toLocaleString()}</span></p> <p className="flex justify-between">Ad Cost: <span className="font-bold text-white">${campaign.metrics.cost?.toLocaleString()}</span></p> <p className="flex justify-between">ROAS: <span className="font-bold text-green-400">{campaign.metrics.roas}x</span></p> </div> <h4 className="font-bold text-lg my-4 font-poppins">Creative</h4> <div className="bg-zinc-800 p-2 rounded-lg"> <img src={campaign.creative.url} alt="Campaign Creative" className="rounded-md w-full object-contain max-h-40"/> </div> </div> <div className="h-[300px]"> <h4 className="font-bold text-lg mb-4 font-poppins">Daily Performance</h4> <ResponsiveContainer width="100%" height="100%"> <LineChart data={dailyPerformanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" /> <XAxis dataKey="day" stroke="rgba(255, 255, 255, 0.7)" fontSize={12} /> <YAxis stroke="rgba(255, 255, 255, 0.7)" fontSize={12} allowDecimals={false} /> <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 30, 40, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px' }} /> <Legend /> <Line type="monotone" dataKey="reach" stroke="#8884d8" /> <Line type="monotone" dataKey="clicks" stroke="#82ca9d" /> </LineChart> </ResponsiveContainer> </div> </div> <div className="mt-8 flex justify-end"> <AppButton>Go to Campaign Manager</AppButton> </div> </AppCard> </div> ); };
const CampaignEditModal = ({ isOpen, onClose, onSave, campaignData, setNotification }) => { if (!isOpen || !campaignData) return null; const [campaign, setCampaign] = useState(campaignData); useEffect(() => { setCampaign(campaignData); }, [campaignData]); const handleInputChange = e => { const {name, value} = e.target; setCampaign(p => ({...p, [name]: value})); }; const handleSave = () => { if (!campaign.title || !campaign.content) { setNotification({type: 'error', message: 'Title and Content are required.'}); return; } onSave(campaign); }; const handleSchedule = () => { if (!campaign.scheduledDate || !campaign.scheduledTime) { setNotification({type: 'error', message: 'Please select date and time to schedule.'}); return; } onSave({...campaign, status: 'Scheduled'}); }; return (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"><AppCard className="p-8 max-w-2xl w-full animate-fade-in-up"><div className="flex justify-between items-start mb-6"><h3 className="text-2xl font-bold text-white font-poppins">{campaign.id ? 'Edit Campaign' : 'Create New Campaign'}</h3><AppButton onClick={onClose} variant="secondary" icon={XCircle} className="!p-2"/></div><div className="space-y-4"><AppInput type="text" name="title" value={campaign.title} onChange={handleInputChange} placeholder="Campaign Title"/><AppTextarea name="content" value={campaign.content} onChange={handleInputChange} placeholder="Campaign Content..." rows="5"></AppTextarea><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><AppSelect name="platform" value={campaign.platform} onChange={handleInputChange}>{Object.keys(PLATFORMS).map(p=><option key={p} value={p}>{PLATFORMS[p].name}</option>)}</AppSelect><AppSelect name="type" value={campaign.type} onChange={handleInputChange}><option>Visual</option><option>Video</option><option>Text</option><option>Community</option></AppSelect></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><AppInput type="date" name="scheduledDate" value={campaign.scheduledDate ? new Date(campaign.scheduledDate).toISOString().split('T')[0] : ''} onChange={handleInputChange}/><AppInput type="time" name="scheduledTime" value={campaign.scheduledTime || ''} onChange={handleInputChange}/></div></div><div className="flex justify-end gap-3 mt-6"><AppButton onClick={handleSave} variant="secondary">Save as Draft</AppButton><AppButton onClick={handleSchedule} variant="primary" icon={Clock}>Schedule</AppButton></div></AppCard></div>);};


// --- All Feature Components ---
const AudienceAnalysis = ({ filmData, setFilmData, onAnalysisComplete, setNotification }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [adCopyModalOpen, setAdCopyModalOpen] = useState(false);
  const [generatedAdCopy, setGeneratedAdCopy] = useState('');
  const [adCopyLoading, setLoadingAdCopy] = useState(false); // Renamed to avoid conflict

  const handleInputChange = (e) => { const { name, value } = e.target; setFilmData(prev => ({ ...prev, [name]: value })); };
  const handleAnalyze = async () => { setLoading(true); const result = await mockApiCall(generateAudienceAnalysis(filmData)); setAnalysis(result); onAnalysisComplete(result); setLoading(false); };

  const handleCopyToClipboard = (textToCopy, type) => {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        setNotification({ type: 'success', message: `${type} copied to clipboard!` });
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    } catch (err) {
        setNotification({ type: 'error', message: 'Failed to copy!' });
    }
    document.body.removeChild(textArea);
  };

  const handleGenerateAdCopy = async () => {
    setLoadingAdCopy(true); // Use renamed state
    setGeneratedAdCopy('Generating example ad copy...');
    setAdCopyModalOpen(true);
    const copy = await generateAdCopyExample(analysis, filmData);
    setGeneratedAdCopy(copy);
    setLoadingAdCopy(false); // Use renamed state
  };

  useEffect(() => { if(filmData.demographic === 'I need help identifying') { handleAnalyze(); } else { setAnalysis(null); } }, [filmData.demographic]);

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
          <AppButton onClick={handleAnalyze} disabled={loading} className="w-full" size="lg"> {loading ? 'Analyzing...' : 'Analyze Audience'} </AppButton>
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
            <AppButton onClick={handleGenerateAdCopy} disabled={adCopyLoading} icon={Zap} className="w-full mt-4">
                {adCopyLoading ? 'Generating Ad Copy...' : 'Generate Example Ad Copy'}
            </AppButton>
          </div>
        )}
        {!analysis && !loading && <div className="text-center text-zinc-400 pt-16">Enter film data and click Analyze to see results.</div>}
      </AppCard>

      {/* Ad Copy Modal */}
      {adCopyModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <AppCard className="p-8 max-w-2xl w-full animate-fade-in-up">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-white font-poppins">AI Generated Ad Copy Example</h3>
                    <AppButton onClick={() => setAdCopyModalOpen(false)} variant="secondary" icon={XCircle} className="!p-2"/>
                </div>
                {adCopyLoading ? (
                    <div className="flex justify-center items-center h-48"> <Bot className="w-12 h-12 text-purple-400 animate-spin" /> </div>
                ) : (
                    <div>
                        <AppTextarea readOnly value={generatedAdCopy} rows="10" className="mb-4" />
                        <AppButton onClick={() => handleCopyToClipboard(generatedAdCopy, 'Ad Copy')} icon={CopyCheck}>Copy to Clipboard</AppButton>
                    </div>
                )}
            </AppCard>
        </div>
      )}
    </div>
  );
};
const VideoAnalysis = ({ filmData, onCreateCampaign }) => {
    const [uploadMethod, setUploadMethod] = useState('file');
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generatingVersions, setGeneratingVersions] = useState(false);
    const [versions, setVersions] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const dropRef = useRef(null);

    const handleFileChange = (files) => { if (files && files[0] && ['video/mp4', 'video/quicktime', 'video/x-msvideo'].includes(files[0].type) && files[0].size < 100 * 1024 * 1024) { setVideoFile(files[0]); setVideoUrl(''); setAnalysis(null); setVersions([]); } else { alert('Invalid file. Please upload a MP4, MOV, or AVI under 100MB.'); } };
    const handleUrlChange = (e) => { setVideoUrl(e.target.value); setVideoFile(null); };
    const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragIn = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragOut = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); if (e.dataTransfer.files && e.dataTransfer.files.length > 0) { handleFileChange(e.dataTransfer.files); e.dataTransfer.clearData(); } };
    
    useEffect(() => { let div = dropRef.current; if(div) { div.addEventListener('dragenter', handleDragIn); div.addEventListener('dragleave', handleDragOut); div.addEventListener('dragover', handleDrag); div.addEventListener('drop', handleDrop); } return () => { if(div) { div.removeEventListener('dragenter', handleDragIn); div.removeEventListener('dragleave', handleDragOut); div.removeEventListener('dragover', handleDrag); div.removeEventListener('drop', handleDrop); } }; }, []);
    
    const handleAnalyze = async () => { if (!videoFile && !videoUrl) return; setLoading(true); const result = await mockApiCall(generateVideoAnalysis(videoFile || videoUrl, filmData.genre)); setAnalysis(result); setLoading(false); };
    
    // UPDATED: Calls the new function to generate different cuts
    const handleGenerateVersions = async () => { if (!analysis) return; setGeneratingVersions(true); const result = await mockApiCall(generateNewVideoCuts(filmData.genre), 2000); setVersions(result); setGeneratingVersions(false); };

    const tabButtonClass = (method) => `px-4 py-2 font-semibold text-sm rounded-t-lg transition-colors ${uploadMethod === method ? 'bg-zinc-800 text-white' : 'bg-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}`;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AppCard className="p-8">
                    <SectionTitle icon={Video}>Video Input</SectionTitle>
                    <div className="flex border-b border-zinc-700">
                        <button onClick={() => setUploadMethod('file')} className={tabButtonClass('file')}>Upload File</button>
                        <button onClick={() => setUploadMethod('url')} className={tabButtonClass('url')}>Link URL</button>
                    </div>

                    {uploadMethod === 'file' && (
                        <div ref={dropRef} className={`relative mt-4 w-full h-64 border-2 border-dashed ${isDragging ? 'border-purple-500 bg-purple-900/20' : 'border-zinc-700'} rounded-2xl flex flex-col justify-center items-center text-center p-8 transition-all`}>
                            <UploadCloud className="w-12 h-12 text-zinc-500 mb-4"/>
                            <p className="text-white">Drag & drop your video file here</p>
                            <p className="text-zinc-400 text-sm">or</p>
                            <input type="file" id="video-upload" className="hidden" onChange={(e) => handleFileChange(e.target.files)} accept=".mp4,.mov,.avi"/>
                            <AppButton as="label" htmlFor="video-upload" variant="secondary" className="mt-2 cursor-pointer">Select File</AppButton>
                        </div>
                    )}
                     {uploadMethod === 'url' && (
                        <div className="mt-4 pt-8 pb-14">
                           <label className="text-sm font-semibold text-zinc-300 mb-2 block">YouTube or Vimeo URL</label>
                           <AppInput type="text" value={videoUrl} onChange={handleUrlChange} placeholder="https://www.youtube.com/watch?v=..."/>
                        </div>
                    )}

                    {(videoFile || videoUrl) && ( <div className="mt-6 bg-zinc-800/50 p-4 rounded-lg"> <p className="font-semibold text-white">Selected Source:</p> <div className="flex items-center text-zinc-300"> {videoFile ? <FileText className="w-5 h-5 mr-2 text-purple-400"/> : <Link className="w-5 h-5 mr-2 text-purple-400"/>} <span className="truncate">{videoFile ? `${videoFile.name} (${(videoFile.size / 1024 / 1024).toFixed(2)} MB)` : videoUrl}</span> </div> </div> )}
                    <AppButton onClick={handleAnalyze} disabled={(!videoFile && !videoUrl) || loading} className="w-full mt-6" size="lg"> {loading ? 'Analyzing...' : 'Analyze Video'} </AppButton>
                </AppCard>

                <AppCard className="p-8">
                    <SectionTitle icon={Bot}>Video Analysis Results</SectionTitle>
                    {loading && <div className="flex justify-center items-center h-full"><Bot className="w-12 h-12 text-purple-400 animate-spin" /></div>}
                    {analysis && !loading && (
                        <div className="space-y-6 animate-fade-in h-full overflow-y-auto pr-2">
                            <div> <h3 className="font-semibold text-lg text-white mb-2 font-poppins">Technical Overview</h3> <div className="grid grid-cols-2 gap-2 text-sm"> <p>Duration: <span className="font-medium text-white">{analysis.technical.duration}</span></p> <p>Scenes: <span className="font-medium text-white">{analysis.technical.scenes}</span></p> <p>Pacing: <span className="font-medium text-white">{analysis.technical.pacing}</span></p> <p>Production Value: <span className="font-medium text-white">{analysis.technical.productionValue}</span></p> </div> </div>
                            <div> <h3 className="font-semibold text-lg text-white mb-2 font-poppins">Key Marketing Moments</h3> <ul className="space-y-2"> {analysis.keyMoments.map((moment, i) => ( <li key={i} className="bg-zinc-800/50 p-3 rounded-lg"> <p className="font-semibold text-purple-300">{moment.time}</p> <p className="text-zinc-200">{moment.description}</p> </li> ))} </ul> </div>
                            <div> <h3 className="font-semibold text-lg text-white mb-2 font-poppins">Platform-Specific Suggestions</h3> <div className="space-y-1 text-sm text-zinc-300"> <p><strong>TikTok:</strong> {analysis.platformSuggestions.tiktok}</p> <p><strong>Instagram:</strong> {analysis.platformSuggestions.instagram}</p> <p><strong>YouTube:</strong> {analysis.platformSuggestions.youtube}</p> </div> </div>
                            <AppButton icon={Plus} onClick={() => onCreateCampaign({ title: `Campaign from video: ${videoFile?.name || 'linked video'}`, content: analysis.socialStrategy, platform: 'instagram', type: 'Video', audience: 'General'})}> Create Campaign from Strategy </AppButton>
                        </div>
                    )}
                    {!analysis && !loading && <div className="text-center text-zinc-400 pt-16">Provide a video file or URL and click Analyze.</div>}
                </AppCard>
            </div>
            
            {analysis && !loading && (
                 <AppCard className="p-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <SectionTitle icon={Scissors}>Automated Trailer Versioning</SectionTitle>
                        <AppButton onClick={handleGenerateVersions} disabled={generatingVersions}>
                            {generatingVersions ? "Generating..." : "Generate Platform Cuts"}
                        </AppButton>
                    </div>
                    {generatingVersions && <div className="flex justify-center items-center py-10"><Bot className="w-12 h-12 text-purple-400 animate-spin" /></div>}
                    {versions.length > 0 && !generatingVersions && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                            {versions.map(version => (
                                <AppCard key={version.title} className="p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`text-3xl p-2 rounded-lg ${PLATFORMS[version.platform].color}`}>{PLATFORMS[version.platform].icon}</span>
                                        <h4 className="text-lg font-bold text-white font-poppins">{version.title}</h4>
                                    </div>
                                    <img src={version.previewUrl} alt={`${version.title} preview`} className="rounded-lg mb-3 shadow-lg w-full"/>
                                    <p className="text-sm text-zinc-300">{version.description}</p>
                                    <AppButton variant="secondary" icon={Download} className="w-full mt-4">Download</AppButton>
                                </AppCard>
                            ))}
                        </div>
                    )}
                 </AppCard>
            )}
        </div>
    );
};
const ContentCreation = ({ filmData, onCreateCampaign }) => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [draftModalOpen, setDraftModalOpen] = useState(false);
    const [currentDraft, setCurrentDraft] = useState('');
    const [draftLoading, setDraftLoading] = useState(false);

    const handleGenerateIdeas = async () => { setLoading(true); const result = await mockApiCall(generateContentIdeas(filmData)); setIdeas(result); setLoading(false); };
    
    const handleGenerateDraft = async (idea) => {
        setDraftLoading(true);
        setCurrentDraft('Generating draft copy...');
        setDraftModalOpen(true);
        const draft = await generateDraftCopy(idea, filmData.title); // Pass filmData.title
        setCurrentDraft(draft);
        setDraftLoading(false);
    };

    const handleCopyToClipboard = (textToCopy, type) => {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            // setNotification({ type: 'success', message: `${type} copied to clipboard!` }); // Assuming notification is handled by parent if needed
        } catch (err) {
            // setNotification({ type: 'error', message: 'Failed to copy!' });
        }
        document.body.removeChild(textArea);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <SectionTitle icon={Lightbulb}>Content Creation Suite</SectionTitle>
                <AppButton onClick={handleGenerateIdeas} disabled={loading} size="lg"> {loading ? "Generating..." : "Generate Content Ideas"} </AppButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {ideas.map(idea => (
                    <AppCard key={idea.id} className="p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center mb-3">
                                <span className={`text-2xl`}>{PLATFORMS[idea.platform].icon}</span>
                                <h3 className="font-bold text-lg text-white font-poppins">{PLATFORMS[idea.platform].name}</h3>
                            </div>
                            <p className="text-zinc-200 mb-4 h-20 overflow-hidden">{idea.idea}</p>
                            <div className="flex flex-wrap gap-2 text-xs mb-4">
                               <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">{idea.type}</span>
                               <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full">Engagement: {idea.engagement}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <AppButton icon={Plus} onClick={() => onCreateCampaign({ title: `Campaign for ${PLATFORMS[idea.platform].name}`, content: idea.idea, platform: idea.platform, type: idea.type, audience: idea.audience })}> Create Campaign </AppButton>
                            <AppButton icon={Zap} onClick={() => handleGenerateDraft(idea)} variant="secondary" className="!p-2">Draft</AppButton>
                        </div>
                    </AppCard>
                ))}
                 {ideas.length === 0 && !loading && <div className="col-span-full text-center py-20"><p className="text-zinc-400">Click "Generate Content Ideas" to get started.</p></div>}
                 {loading && <div className="col-span-full flex justify-center items-center py-20"><Bot className="w-12 h-12 text-purple-400 animate-spin" /></div>}
            </div>

            {/* Draft Modal */}
            {draftModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <AppCard className="p-8 max-w-2xl w-full animate-fade-in-up">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-bold text-white font-poppins">AI Generated Draft Copy</h3>
                            <AppButton onClick={() => setDraftModalOpen(false)} variant="secondary" icon={XCircle} className="!p-2"/>
                        </div>
                        {draftLoading ? (
                             <div className="flex justify-center items-center h-48"> <Bot className="w-12 h-12 text-purple-400 animate-spin" /> </div>
                        ) : (
                            <div>
                                <AppTextarea readOnly value={currentDraft} rows="10" className="mb-4" />
                                <AppButton onClick={() => { handleCopyToClipboard(currentDraft, 'Draft'); }} icon={CopyCheck}>Copy to Clipboard</AppButton>
                            </div>
                        )}
                    </AppCard>
                </div>
            )}
        </div>
    );
};
const BudgetPlanner = ({ filmData }) => {
    const [budget, setBudget] = useState('25000');
    const [goal, setGoal] = useState('awareness');
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [grassrootsCities, setGrassrootsCities] = useState("New York, Los Angeles, Chicago");
    const [grassrootsScreenings, setGrassrootsScreenings] = useState("2");
    const handleGeneratePlan = async () => { setLoading(true); const grassrootsData = { cities: grassrootsCities.split(',').map(c => c.trim()).filter(c => c), screenings: grassrootsScreenings, }; const result = await mockApiCall(generateBudgetPlan(budget, goal, filmData, grassrootsData)); setPlan(result); setLoading(false); };
    const pieChartColors = ['#a855f7', '#ec4899', '#22d3ee', '#facc15', '#4ade80', '#fb923c'];

    return (
        <div>
            <SectionTitle icon={DollarSign}>AI Marketing Budget Planner</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <AppCard className="lg:col-span-1 p-8">
                    <h3 className="text-xl font-bold mb-4 font-poppins">Budget & Goals</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="text-sm font-semibold text-zinc-300 mb-2 block">Total Marketing Budget ($)</label>
                            <AppInput type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-zinc-300 mb-2 block">Primary Campaign Goal</label>
                            <AppSelect value={goal} onChange={(e) => setGoal(e.target.value)}>
                                <option value="awareness">Brand Awareness</option> <option value="engagement">Audience Engagement</option> <option value="conversion">Conversions (Ticket Sales)</option> <option value="grassroots">Grassroots Tour</option>
                            </AppSelect>
                        </div>
                        {goal === 'grassroots' && (
                             <div className="space-y-4 p-4 bg-purple-900/20 rounded-lg animate-fade-in">
                                <div> <label className="text-sm font-semibold text-purple-300 mb-2 block">Tour Cities</label> <AppInput type="text" value={grassrootsCities} onChange={(e) => setGrassrootsCities(e.target.value)} placeholder="e.g., New York, Austin, SF" /> <p className="text-xs text-zinc-400 mt-1">Comma-separated list of cities.</p> </div>
                                 <div> <label className="text-sm font-semibold text-purple-300 mb-2 block">Screenings Per City</label> <AppInput type="number" value={grassrootsScreenings} onChange={(e) => setGrassrootsScreenings(e.target.value)} min="1" /> </div>
                             </div>
                        )}
                        <AppButton onClick={handleGeneratePlan} disabled={!budget || loading} className="w-full" size="lg"> {loading ? 'Generating Plan...' : 'Generate Budget Plan'} </AppButton>
                    </div>
                </AppCard>
                <AppCard className="lg:col-span-2 p-8">
                     <h3 className="text-xl font-bold mb-4 flex items-center gap-2 font-poppins"><Bot /> Recommended Budget Allocation</h3>
                     {loading && <div className="flex justify-center items-center h-full"><Bot className="w-12 h-12 text-purple-400 animate-spin" /></div>}
                     {plan && !loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                            <div>
                                <h4 className="font-bold text-lg mb-4 font-poppins">Breakdown</h4>
                                {plan.plan.map((item, index) => (
                                    <div key={item.category} className="mb-3">
                                        <div className="flex justify-between text-sm mb-1"> 
                                            <span className="font-semibold text-white">{item.category}</span> 
                                            <span className="text-zinc-300">${Number(item.amount).toLocaleString()} ({item.percentage}%)</span> 
                                        </div>
                                        <div className="w-full bg-zinc-800 rounded-full h-2.5"> 
                                            <div style={{ width: `${item.percentage}%`, backgroundColor: pieChartColors[index % pieChartColors.length] }} className="h-2.5 rounded-full"></div> 
                                        </div>
                                        {/* Granular Breakdown for Grassroots Tour */}
                                        {item.breakdown && item.breakdown.length > 0 && (
                                            <div className="ml-4 mt-2 space-y-1 text-sm">
                                                {item.breakdown.map((subItem, subIndex) => (
                                                    <div key={subIndex} className="flex justify-between text-zinc-400">
                                                        <span className="flex items-center"><ChevronRight size={14} className="mr-1 text-purple-400"/> {subItem.name}</span>
                                                        <span>${Number(subItem.amount).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                             <div>
                                <h4 className="font-bold text-lg mb-4 font-poppins">Visual</h4>
                                <div className="relative w-48 h-48 mx-auto"> <PieChart className="w-full h-full text-purple-400" /> </div>
                                <div className={`mt-6 p-4 rounded-lg space-y-2 ${plan.error ? 'bg-red-900/30' : 'bg-purple-900/30'}`}>
                                    <p className="text-sm font-semibold text-white">AI Insights:</p>
                                    {plan.insights.map((insight, i) => ( <p key={i} className="text-xs text-zinc-300 flex items-start"><Zap className={`w-3 h-3 mr-2 mt-0.5 flex-shrink-0 ${plan.error ? 'text-red-400' : 'text-yellow-400'}`}/> {insight}</p> ))}
                                </div>
                            </div>
                        </div>
                     )}
                     {!plan && !loading && <div className="text-center text-zinc-400 pt-24">Enter your budget and goal to generate a plan.</div>}
                </AppCard>
            </div>
        </div>
    );
};
const CampaignManager = ({ campaigns, setCampaigns, setNotification, setActiveTab }) => {
    const [view, setView] = useState('dashboard');
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const handleCreateNew = () => { setEditingCampaign({ title: '', content: '', platform: 'instagram', type: 'Visual', status: 'Draft', metrics: {}, metaAdStatus: 'Not Promoted', createdAt: new Date() }); setShowEditModal(true); };
    const handleEdit = (campaign) => { setEditingCampaign(campaign); setShowEditModal(true); };
    const handleDelete = (id) => { if (window.confirm('Are you sure you want to delete this campaign?')) { setCampaigns(prev => prev.filter(c => c.id !== id)); setNotification({ type: 'info', message: 'Campaign deleted.' }); } };
    const handleDuplicate = (id) => { const original = campaigns.find(c => c.id === id); if (original) { handleSave({ ...original, id: null, title: `${original.title} (Copy)`, status: 'Draft' }); } };
    const handlePromote = (id) => { setCampaigns(prev => prev.map(c => c.id === id ? { ...c, metaAdStatus: 'Promoted', status: 'Active', metrics: { reach: Math.floor(Math.random() * 20000) + 5000, engagement: (Math.random() * 10 + 5).toFixed(1), clicks: Math.floor(Math.random() * 1000) + 200, cost: Math.floor(Math.random() * 100) + 50, roas: (Math.random() * 5 + 1).toFixed(1) } } : c)); setNotification({ type: 'success', message: 'Campaign promoted!' }); };

    const handleSave = (campaignToSave) => {
        if (campaignToSave.id) { 
            setCampaigns(prev => prev.map(c => c.id === campaignToSave.id ? campaignToSave : c)); 
            setNotification({ type: 'success', message: 'Campaign updated!' }); 
        } else { 
            const newCampaign = { ...campaignToSave, id: `camp_${Date.now()}` }; 
            setCampaigns(prev => [newCampaign, ...prev]); 
            setNotification({ type: 'success', message: 'Campaign created as a draft!' }); 
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
             {/* Quick Actions / Actionable Dashboard */}
            <AppCard className="p-6">
                <h3 className="font-bold text-lg text-white mb-4 flex items-center font-poppins"><Zap className="mr-2 text-yellow-400"/> Quick Actions & Insights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AppButton variant="secondary" className="h-24 flex-col text-center justify-center items-center" onClick={() => setActiveTab('video')}>
                        <Video size={24} className="mb-2"/>
                        <span className="font-medium">Analyze New Video</span>
                        <p className="text-xs text-zinc-400">Get AI insights on your trailer.</p>
                    </AppButton>
                    <AppButton variant="secondary" className="h-24 flex-col text-center justify-center items-center" onClick={() => handleCreateNew()}>
                        <Plus size={24} className="mb-2"/>
                        <span className="font-medium">Create New Campaign</span>
                        <p className="text-xs text-zinc-400">Draft a social media post.</p>
                    </AppButton>
                    <AppButton variant="secondary" className="h-24 flex-col text-center justify-center items-center" onClick={() => setActiveTab('community')}>
                        <MessageCircle size={24} className="mb-2"/>
                        <span className="font-medium">Check Latest Mentions</span>
                        <p className="text-xs text-zinc-400">Respond to community feedback.</p>
                    </AppButton>
                    <AppButton variant="secondary" className="h-24 flex-col text-center justify-center items-center" onClick={() => setActiveTab('budget')}>
                        <DollarSign size={24} className="mb-2"/>
                        <span className="font-medium">Plan Your Budget</span>
                        <p className="text-xs text-zinc-400">Optimize spending with AI.</p>
                    </AppButton>
                </div>
            </AppCard>

             <AppCard className="p-6">
                <div className="flex justify-between items-center mb-4"> <h3 className="font-bold text-lg text-white font-poppins">All Campaigns</h3> <AppButton onClick={handleCreateNew} icon={Plus}>Create Campaign</AppButton> </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {campaigns.map(campaign => (
                      <div key={campaign.id} className="bg-zinc-800/50 p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <span className={`text-2xl`}>{PLATFORMS[campaign.platform].icon}</span>
                           <div>
                                <p className="font-semibold text-white">{campaign.title}</p>
                                <p className="text-sm text-zinc-300">{campaign.type} - <span className={`px-2 py-0.5 text-xs rounded-full ${ campaign.status === 'Active' ? 'bg-green-500/20 text-green-300' : campaign.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-300' : campaign.status === 'Draft' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-500/20 text-gray-300' }`}>{campaign.status}</span></p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2"> <AppButton onClick={() => handleEdit(campaign)} variant="secondary" icon={Edit} className="!p-2"/> <AppButton onClick={() => handleDuplicate(campaign.id)} variant="secondary" icon={Copy} className="!p-2"/> <AppButton onClick={() => handleDelete(campaign.id)} variant="danger" icon={Trash2} className="!p-2"/> </div>
                      </div>
                  ))}
                </div>
             </AppCard>
        </div>
        <AppCard className="p-6">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center font-poppins"><Bot className="mr-2"/> AI Optimization Engine</h3>
            <div className="flex items-center mb-4">
                <p className="text-sm text-zinc-300 mr-2">Meta Ads Integration</p>
                <div className="w-12 h-6 flex items-center bg-zinc-600 rounded-full p-1 cursor-pointer"> <div className="bg-green-400 w-4 h-4 rounded-full shadow-md"></div> </div>
                 <span className="text-sm text-green-400 ml-2">Connected</span>
            </div>
            <div className="space-y-3">
                {aiOptimizationSuggestions.map(s => (
                    <div key={s.id} className="bg-zinc-800/50 p-3 rounded-lg border-l-4 border-purple-500">
                        <div className="flex justify-between items-start">
                           <p className="text-zinc-200 text-sm">{s.suggestion}</p>
                           <span className={`text-xs font-bold ${s.priority === 'High' ? 'text-red-400' : s.priority === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>{s.priority}</span>
                        </div>
                        <AppButton onClick={() => handlePromote(campaigns[0].id)} variant="secondary" size="sm" className="!text-xs mt-2">{s.action}</AppButton>
                    </div>
                ))}
            </div>
        </AppCard>
      </div>
    );
    const CalendarView = () => { const startOfWeek = new Date(currentWeek); startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(endOfWeek.getDate() + 6); const days = Array.from({ length: 7 }).map((_, i) => { const date = new Date(startOfWeek); date.setDate(date.getDate() + i); return date; }); const changeWeek = (amount) => { const newWeek = new Date(currentWeek); newWeek.setDate(newWeek.getDate() + amount * 7); setCurrentWeek(newWeek); }; const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate(); return ( <AppCard className="p-6"> <div className="flex justify-between items-center mb-4"> <AppButton icon={ChevronLeft} onClick={() => changeWeek(-1)}>Previous</AppButton> <h3 className="font-bold text-xl text-white font-poppins"> {startOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {endOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} </h3> <AppButton icon={ChevronRight} onClick={() => changeWeek(1)} className="flex-row-reverse"><span className="ml-2">Next</span></AppButton> </div> <div className="grid grid-cols-7 gap-2"> {days.map(day => ( <div key={day.toISOString()} className="bg-zinc-800/50 rounded-lg p-2 min-h-[200px]"> <p className="font-bold text-center text-white">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p> <p className="text-sm text-center text-zinc-400 mb-2">{day.getDate()}</p> <div className="space-y-2"> {campaigns.filter(c => c.scheduledDate && isSameDay(new Date(c.scheduledDate), day)).map(c => ( <div key={c.id} className={`p-2 rounded-lg text-white text-xs ${PLATFORMS[c.platform].color}`}> <p className="font-semibold">{c.title}</p> <p className="opacity-80">{c.scheduledTime}</p> </div> ))} </div> </div> ))} </div> </AppCard> ); };
    const AnalyticsView = () => ( <AppCard className="p-6"> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> <StatCard title="Total Reach" value="212.7K" icon={Users} color="bg-blue-500" /> <StatCard title="Avg. Engagement" value="9.2%" icon={Megaphone} color="bg-green-500" /> <StatCard title="Avg. ROAS" value="3.1x" icon={TrendingUp} color="bg-purple-500" /> <StatCard title="Total Campaigns" value={campaigns.length} icon={Briefcase} color="bg-yellow-500" /> </div> <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"> <div> <h3 className="font-bold text-lg text-white mb-4 font-poppins">Meta Ads Performance</h3> <div className="space-y-3"> <p>Total Spend: $1,250.00</p> <p>Total Clicks: 15,234</p> <p>Average CPC: $0.08</p> <p>Conversion Rate: 2.5%</p> </div> </div> <div> <h3 className="font-bold text-lg text-white mb-4 font-poppins">AI Performance Insights</h3> <div className="space-y-3"> {performanceAnalyticsData.insights.map(insight => ( <div key={insight.text} className="flex items-start"> <insight.icon className={`w-5 h-5 mr-3 mt-1 flex-shrink-0 ${insight.color}`}/> <p className="text-zinc-300">{insight.text}</p> </div> ))} </div> </div> </div> </AppCard> );

    return (
        <div>
            {showEditModal && <CampaignEditModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} onSave={handleSave} campaignData={editingCampaign} setNotification={setNotification} />}
            <div className="flex items-center justify-between mb-8">
                <SectionTitle icon={Briefcase}>Campaign Manager</SectionTitle>
                <div className="flex items-center gap-2">
                    <AppButton onClick={() => setView('dashboard')} variant={view === 'dashboard' ? 'primary' : 'secondary'} icon={LayoutDashboard}>Dashboard</AppButton>
                    <AppButton onClick={() => setView('calendar')} variant={view === 'calendar' ? 'primary' : 'secondary'} icon={Calendar}>Calendar</AppButton>
                    <AppButton onClick={() => setView('analytics')} variant={view === 'analytics' ? 'primary' : 'secondary'} icon={BarChart2}>Analytics</AppButton>
                </div>
            </div>
            {view === 'dashboard' && <DashboardView />}
            {view === 'calendar' && <CalendarView />}
            {view === 'analytics' && <AnalyticsView />}
        </div>
    );
};
const SmartCommunityManager = () => { const [conversations, setConversations] = useState(communityConversations); const [selectedConvoId, setSelectedConvoId] = useState('convo_1'); const [replyText, setReplyText] = useState(''); const [filter, setFilter] = useState('all'); const selectedConvo = useMemo(() => conversations.find(c => c.id === selectedConvoId), [selectedConvoId, conversations]); const handleSelectConvo = (id) => { setSelectedConvoId(id); setConversations(convos => convos.map(c => c.id === id ? {...c, unread: false} : c)); }; const handleSendReply = () => { if (!replyText.trim()) return; const newConversations = conversations.map(c => { if (c.id === selectedConvoId) { return { ...c, messages: [...c.messages, { from: 'you', text: replyText }] }; } return c; }); setConversations(newConversations); setReplyText(''); }; const filteredConversations = useMemo(() => { if (filter === 'all') return conversations; return conversations.filter(c => c.platform === filter); }, [filter, conversations]); const SentimentIcon = ({ sentiment }) => { if (sentiment === 'Positive') return <Smile className="w-5 h-5 text-green-400" />; if (sentiment === 'Negative') return <Frown className="w-5 h-5 text-red-400" />; return <Meh className="w-5 h-5 text-yellow-400" />; }; return ( <div> <SectionTitle icon={MessageCircle}>Smart Community Manager</SectionTitle> <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{height: 'calc(100vh - 200px)'}}> <AppCard className="lg:col-span-3 p-4 flex flex-col"> <div className="flex gap-2 mb-4"> <AppButton onClick={() => setFilter('all')} variant={filter==='all' ? 'primary' : 'secondary'} className="flex-1 !text-xs">All</AppButton> <AppButton onClick={() => setFilter('instagram')} variant={filter==='instagram' ? 'primary' : 'secondary'} className="flex-1 !text-xs">IG</AppButton> <AppButton onClick={() => setFilter('tiktok')} variant={filter==='tiktok' ? 'primary' : 'secondary'} className="flex-1 !text-xs">TikTok</AppButton> <AppButton onClick={() => setFilter('youtube')} variant={filter==='youtube' ? 'primary' : 'secondary'} className="flex-1 !text-xs">YT</AppButton> </div> <div className="overflow-y-auto pr-2 space-y-2 flex-grow"> {filteredConversations.map(convo => ( <div key={convo.id} onClick={() => handleSelectConvo(convo.id)} className={`p-3 rounded-lg cursor-pointer transition-colors flex gap-3 items-start ${selectedConvoId === convo.id ? 'bg-purple-600/30' : 'bg-zinc-800/50 hover:bg-zinc-700'}`}> <img src={convo.user.avatar} alt={convo.user.name} className="w-10 h-10 rounded-full mt-1" /> <div className="flex-grow overflow-hidden"> <div className="flex justify-between items-center"> <h4 className="font-bold text-white text-sm truncate">{convo.user.name}</h4> <span className="text-2xl">{PLATFORMS[convo.platform].icon}</span> </div> <p className="text-zinc-300 text-xs truncate">{convo.lastMessage}</p> </div> {convo.unread && <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full mt-1 flex-shrink-0"></div>} </div> ))} </div> </AppCard> <div className="lg:col-span-5 flex flex-col"> {selectedConvo ? ( <AppCard className="p-4 flex-1 flex flex-col"> <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4"> {selectedConvo.messages.map((msg, index) => ( <div key={index} className={`flex items-end gap-2 ${msg.from === 'you' ? 'justify-end' : 'justify-start'}`}> {msg.from === 'user' && <img src={selectedConvo.user.avatar} alt={selectedConvo.user.name} className="w-8 h-8 rounded-full"/>} <div className={`p-3 rounded-xl max-w-xs md:max-w-md ${msg.from === 'you' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-zinc-800 text-zinc-200 rounded-bl-none'}`}> <p className="text-sm">{msg.text}</p> </div> </div> ))} </div> <div className="flex gap-2 items-center border-t border-zinc-700 pt-4"> <AppInput type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply..."/> <AppButton onClick={handleSendReply} icon={Send}>Send</AppButton> </div> </AppCard> ) : <AppCard className="p-4 flex items-center justify-center h-full"><p className="text-zinc-400">Select a conversation</p></AppCard>} </div> <AppCard className="lg:col-span-4 p-6"> <SectionTitle icon={Bot}>AI Assistant</SectionTitle> {selectedConvo ? ( <div className="space-y-6"> <div> <h4 className="font-semibold text-lg text-white mb-2 flex items-center gap-2 font-poppins"><SentimentIcon sentiment={selectedConvo.sentiment} /> Sentiment Analysis</h4> <p className="text-zinc-300 text-sm">Sentiment detected as <span className={`font-bold ${ selectedConvo.sentiment === 'Positive' ? 'text-green-400' : selectedConvo.sentiment === 'Negative' ? 'text-red-400' : 'text-yellow-400' }`}>{selectedConvo.sentiment}</span> with {selectedConvo.aiAnalysis.sentimentScore}% confidence.</p> </div> <div> <h4 className="font-semibold text-lg text-white mb-2 font-poppins">Suggested Replies</h4> <div className="space-y-2"> {selectedConvo.aiAnalysis.suggestedReplies.map(reply => ( <div key={reply.title} onClick={() => setReplyText(reply.text)} className="bg-zinc-800/50 p-3 rounded-lg hover:bg-purple-900/40 cursor-pointer"> <p className="font-semibold text-purple-300 text-sm">{reply.title}</p> <p className="text-zinc-300 text-xs">{reply.text}</p> </div> ))} </div> </div> <AppButton variant="secondary" className="w-full">Mark as Resolved</AppButton> </div> ) : <p className="text-center text-zinc-400 pt-16">Select a conversation to see AI analysis.</p>} </AppCard> </div> </div> ); };
const PerformanceAnalytics = () => { const data = performanceAnalyticsData; const allCampaigns = initialCampaigns; const [selectedCampaign, setSelectedCampaign] = useState(null); const handleRowClick = (campaign) => { setSelectedCampaign(campaign); }; return ( <div className="space-y-8"> <CampaignDetailModal campaign={selectedCampaign} isOpen={!!selectedCampaign} onClose={() => setSelectedCampaign(null)} /> <SectionTitle icon={BarChart2}>Performance Analytics</SectionTitle> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> <StatCard title="Total Reach" value={data.totalReach} icon={Users} color="bg-blue-500" /> <StatCard title="Avg. Engagement Rate" value={`${data.engagementRate}`} icon={Megaphone} color="bg-green-500" /> <StatCard title="Total Ad Spend" value={`$${data.totalSpend}`} icon={DollarSign} color="bg-yellow-500" /> <StatCard title="Return on Ad Spend" value={`${data.roas}`} icon={TrendingUp} color="bg-purple-500" /> </div> <div className="grid grid-cols-1 lg:grid-cols-5 gap-8"> <AppCard className="lg:col-span-3 p-6 h-[400px]"> <h3 className="text-lg font-bold text-white mb-4 font-poppins">Campaign Reach (Last 7 Days)</h3> <ResponsiveContainer width="100%" height="90%"> <LineChart data={data.reachByDay} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" /> <XAxis dataKey="day" stroke="rgba(255, 255, 255, 0.7)" fontSize={12} /> <YAxis stroke="rgba(255, 255, 255, 0.7)" fontSize={12} tickFormatter={(value) => `${value/1000}k`} /> <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 30, 40, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px' }} /> <Legend /> <Line type="monotone" dataKey="reach" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }}/> </LineChart> </ResponsiveContainer> </AppCard> <AppCard className="lg:col-span-2 p-6 h-[400px]"> <h3 className="text-lg font-bold text-white mb-4 font-poppins">Engagement by Platform</h3> <ResponsiveContainer width="100%" height="90%"> <ComposedChart layout="vertical" data={data.engagementByPlatform} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" /> <XAxis type="number" stroke="rgba(255, 255, 255, 0.7)" fontSize={12} /> <YAxis dataKey="platform" type="category" stroke="rgba(255, 255, 255, 0.7)" fontSize={12}/> <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 30, 40, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px' }} /> <Legend /> <Bar dataKey="engagement" barSize={20} fill="#a855f7" name="Engagement Rate (%)"/> </ComposedChart> </ResponsiveContainer> </AppCard> </div> <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> <AppCard className="p-6"> <h3 className="text-lg font-bold text-white mb-4 font-poppins">Campaign Performance</h3> <div className="overflow-x-auto max-h-[400px]"> <table className="w-full text-left"> <thead className="sticky top-0 bg-zinc-900/50 backdrop-blur-sm"> <tr className="border-b border-zinc-700 text-sm text-zinc-300"> <th className="p-3">Campaign</th><th className="p-3">Platform</th><th className="p-3">Reach</th><th className="p-3">Engagement</th><th className="p-3">ROAS</th> </tr> </thead> <tbody> {allCampaigns.map(campaign => ( <tr key={campaign.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 cursor-pointer transition-colors" onClick={() => handleRowClick(campaign)}> <td className="p-3 font-semibold text-white">{campaign.title}</td> <td className="p-3"><span className={`text-2xl`}>{PLATFORMS[campaign.platform]?.icon}</span></td> <td className="p-3 text-zinc-300">{campaign.metrics.reach?.toLocaleString() || 'N/A'}</td> <td className="p-3 text-zinc-300">{campaign.metrics.engagement ? `${campaign.metrics.engagement}%` : 'N/A'}</td> <td className="p-3 text-green-400 font-bold">{campaign.metrics.roas || 'N/A'}</td> </tr> ))} </tbody> </table> </div> </AppCard> <AppCard className="p-6"> <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-poppins"><Bot /> AI Performance Insights</h3> <div className="space-y-4"> {data.insights.map((insight, i) => ( <div key={i} className="flex items-start gap-3 bg-purple-900/20 p-3 rounded-lg"> <insight.icon className={`w-6 h-6 mt-1 flex-shrink-0 ${insight.color}`}/> <p className="text-zinc-200 text-sm">{insight.text}</p> </div> ))} </div> </AppCard> </div> </div> ); };
const SettingsPage = ({ setNotification }) => {
    const [connections, setConnections] = useState({ meta: { name: 'Meta (Instagram & Facebook)', connected: true, accounts: [{id: 1, name: '@YourFilm_Official'}, {id: 2, name: '@TheDirector'}] }, tiktok: { name: 'TikTok', connected: true, accounts: [{id: 1, name: '@YourFilmOfficial'}] }, twitter: { name: 'X (Twitter)', connected: true, accounts: [{id: 1, name: '@YourFilm'}] }, youtube: { name: 'YouTube', connected: false, accounts: [] } });
    const handleDisconnect = (platform) => { if(window.confirm(`Are you sure you want to disconnect ${connections[platform].name}?`)){ setConnections(prev => ({ ...prev, [platform]: { ...prev[platform], connected: false, accounts: [] } })); setNotification({ type: 'info', message: `${connections[platform].name} has been disconnected.` }); } };
    const handleConnect = (platform) => { setConnections(prev => ({ ...prev, [platform]: { ...prev[platform], connected: true, accounts: [{id: 1, name: '@YourNewAccount'}] } })); setNotification({ type: 'success', message: `${connections[platform].name} connected successfully.` }); };
    return ( <div className="space-y-8"> <SectionTitle icon={Settings}>Settings</SectionTitle> <AppCard className="p-8"> <h3 className="text-xl font-bold mb-6 flex items-center gap-3 font-poppins"><Link className="text-purple-400"/> Social Connections</h3> <div className="space-y-6"> {Object.entries(connections).map(([key, { name, connected, accounts }]) => ( <div key={key} className="bg-zinc-800/50 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between"> <div className="mb-4 md:mb-0"> <div className="flex items-center gap-3 mb-2"> <span className={`text-2xl`}>{PLATFORMS[key]?.icon || '🔗'}</span> <h4 className="text-lg font-bold text-white font-poppins">{name}</h4> <span className={`px-2 py-1 text-xs rounded-full ${connected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}> {connected ? 'Connected' : 'Disconnected'} </span> </div> {connected && accounts.length > 0 && ( <div className="pl-10 space-y-1"> {accounts.map(acc => ( <p key={acc.id} className="text-sm text-zinc-300 flex items-center gap-2"><UserCog size={14} /> {acc.name}</p> ))} </div> )} </div> <div className="flex gap-3"> {connected ? ( <> <AppButton variant="secondary" icon={Plus}>Add Account</AppButton> <AppButton variant="danger" icon={XCircle} onClick={() => handleDisconnect(key)}>Disconnect</AppButton> </> ) : ( <AppButton variant="primary" icon={Link} onClick={() => handleConnect(key)}>Connect</AppButton> )} </div> </div> ))} </div> </AppCard> <AppCard className="p-8"> <h3 className="text-xl font-bold mb-6 flex items-center gap-3 font-poppins"><KeyRound className="text-purple-400"/> API Keys</h3> <div className="space-y-4"> <div> <label className="text-sm font-semibold text-zinc-300 mb-2 block">Google Gemini API Key</label> <AppInput type="password" placeholder="AIzaSy..."/> </div> <div> <label className="text-sm font-semibold text-zinc-300 mb-2 block">Vercel API Key</label> <AppInput type="password" placeholder="sk-..." /> </div> <AppButton>Save Keys</AppButton> </div> </AppCard> </div> );
};
const VisualContentStudio = ({ filmData }) => {
    const [posterA, setPosterA] = useState(null); const [posterB, setPosterB] = useState(null); const [analysis, setAnalysis] = useState(null); const [loading, setLoading] = useState(false);
    const handleAnalyze = async () => { if (!posterA || !posterB) return; setLoading(true); const result = await mockApiCall(generateVisualAnalysis(posterA, posterB, filmData)); setAnalysis(result); setLoading(false); };
    const socialGraphics = [ { title: 'Instagram Story', url: 'https://placehold.co/270x480/4a044e/ffffff?text=IG+Story' }, { title: 'Character Quote', url: 'https://placehold.co/400x400/701a75/ffffff?text=Quote+Card' }, { title: 'Facebook Banner', url: 'https://placehold.co/600x222/a21caf/ffffff?text=FB+Banner' }, { title: 'YouTube Thumbnail', url: 'https://placehold.co/480x270/c026d3/ffffff?text=YT+Thumbnail' } ];
    const ImageUploader = ({ onFileSelect, uploadedFile, label }) => { const [isDragging, setIsDragging] = useState(false); const dropRef = useRef(null); const handleFileChange = (files) => { if (files && files[0] && files[0].type.startsWith('image/')) { onFileSelect(URL.createObjectURL(files[0])); } else { alert('Please upload a valid image file.'); } }; const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); }; const handleDragIn = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }; const handleDragOut = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }; const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); if (e.dataTransfer.files && e.dataTransfer.files.length > 0) { handleFileChange(e.dataTransfer.files); e.dataTransfer.clearData(); } }; useEffect(() => { let div = dropRef.current; if(div) { div.addEventListener('dragenter', handleDragIn); div.addEventListener('dragleave', handleDragOut); div.addEventListener('dragover', handleDrag); div.addEventListener('drop', handleDrop); } return () => { if(div) { div.removeEventListener('dragenter', handleDragIn); div.removeEventListener('dragleave', handleDragOut); div.removeEventListener('dragover', handleDrag); div.removeEventListener('drop', handleDrop); } }; }, []); return ( <div className="w-full"> <h3 className="text-lg font-bold text-white mb-2 font-poppins">{label}</h3> <div ref={dropRef} className={`relative w-full h-80 border-2 border-dashed ${isDragging ? 'border-purple-500 bg-purple-900/20' : 'border-zinc-700'} rounded-2xl flex justify-center items-center text-center p-4 transition-all`}> {uploadedFile ? ( <img src={uploadedFile} alt="Uploaded poster" className="w-full h-full object-contain rounded-lg"/> ) : ( <div className="text-zinc-400"> <UploadCloud className="w-12 h-12 mx-auto mb-2" /> <p>Drag & drop or click to upload</p> </div> )} <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e.target.files)} accept="image/*" /> </div> </div> ); };
    const AITestResultBar = ({ label, scoreA, scoreB }) => ( <div className="mb-3"> <p className="text-sm text-zinc-300 mb-1">{label}</p> <div className="flex items-center gap-2 mb-1"> <span className="text-xs text-pink-400 w-12">A: {scoreA}%</span> <div className="w-full bg-zinc-800 rounded-full h-2"> <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${scoreA}%` }}></div> </div> </div> <div className="flex items-center gap-2"> <span className="text-xs text-cyan-400 w-12">B: {scoreB}%</span> <div className="w-full bg-zinc-800 rounded-full h-2"> <div className="bg-cyan-400 h-2 rounded-full" style={{ width: `${scoreB}%` }}></div> </div> </div> </div> );
    return (
        <div>
            <SectionTitle icon={Palette}>Visual Content Studio</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <AppCard className="lg:col-span-2 p-8">
                    <h3 className="text-xl font-bold mb-4 font-poppins">A/B Test Movie Posters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> <ImageUploader onFileSelect={setPosterA} uploadedFile={posterA} label="Version A" /> <ImageUploader onFileSelect={setPosterB} uploadedFile={posterB} label="Version B" /> </div>
                     <AppButton onClick={handleAnalyze} disabled={!posterA || !posterB || loading} className="w-full mt-8" size="lg"> {loading ? 'Analyzing...' : 'Analyze Posters'} </AppButton>
                </AppCard>
                <AppCard className="p-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 font-poppins"><Bot /> A/B Test Results</h3>
                    {loading && <div className="flex justify-center items-center h-full"><Bot className="w-12 h-12 text-purple-400 animate-spin" /></div>}
                    {analysis && !loading && (
                        <div className="space-y-4 animate-fade-in">
                            <div> <p className="text-sm text-zinc-300">AI Recommendation</p> <p className="text-2xl font-bold text-purple-300">{analysis.recommendation}</p> <p className="text-sm text-zinc-400">{analysis.recommendation} is <span className="font-bold text-green-400">{analysis.confidence}%</span> more likely to appeal to your target audience.</p> </div>
                            <div className="border-t border-zinc-700 pt-4"> <AITestResultBar label="Clarity & Impact" scoreA={analysis.metrics.A.clarity} scoreB={analysis.metrics.B.clarity} /> <AITestResultBar label="Emotional Resonance" scoreA={analysis.metrics.A.emotionalResonance} scoreB={analysis.metrics.B.emotionalResonance} /> <AITestResultBar label="Typography Readability" scoreA={analysis.metrics.A.typographyReadability} scoreB={analysis.metrics.B.typographyReadability} /> <AITestResultBar label="Demographic Appeal" scoreA={analysis.metrics.A.demographicAppeal} scoreB={analysis.metrics.B.demographicAppeal} /> </div>
                            <div className="bg-purple-900/30 p-3 rounded-lg"> <p className="text-sm font-semibold text-white mb-1">AI Insight</p> <p className="text-xs text-zinc-300">{analysis.insight}</p> </div>
                        </div>
                    )}
                     {!analysis && !loading && <div className="text-center text-zinc-400 pt-16">Upload two posters and click Analyze to see results.</div>}
                </AppCard>
            </div>
             <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 font-poppins">Generated Social Media Graphics</h3>
                <AppCard className="p-6"> <div className="grid grid-cols-2 md:grid-cols-4 gap-6"> {socialGraphics.map(graphic => ( <div key={graphic.title} className="text-center"> <img src={graphic.url} alt={graphic.title} className="rounded-lg mb-2 shadow-lg"/> <p className="font-semibold text-white text-sm">{graphic.title}</p> </div> ))} </div> </AppCard>
            </div>
        </div>
    );
};
const PressAndOutreach = ({filmData, setNotification, setMediaContacts, mediaContacts}) => { // Add mediaContacts here
    const [activeSubTab, setActiveSubTab] = useState('contacts'); // Default to contacts tab
    
    const PressKitManager = ({ data }) => (<div><div className="flex justify-between items-center mb-6"><SectionTitle icon={Newspaper}>Press Kit Organization</SectionTitle><AppButton icon={Download}>Download Full Kit (ZIP)</AppButton></div><div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><AppCard className="lg:col-span-2 p-6"><h3 className="text-lg font-bold mb-4 font-poppins">Media Assets</h3><div className="grid grid-cols-2 md:grid-cols-3 gap-4">{data.mediaAssets.map(asset => ( <div key={asset.id} className="text-center"><img src={asset.preview} alt={asset.type} className="rounded-lg mb-2"/><p className="text-white font-semibold">{asset.type}</p><p className="text-zinc-400 text-sm">{asset.count} files</p></div> ))}</div></AppCard><AppCard className="p-6"><h3 className="text-lg font-bold mb-4 font-poppins">Download Analytics</h3><StatCard title="Total Downloads" value={data.downloadAnalytics.count} icon={Download} color="bg-purple-500"/><p className="text-sm text-zinc-300 mt-4">Last Download by:</p><p className="text-lg font-semibold text-white">{data.downloadAnalytics.lastDownload}</p></AppCard><AppCard className="p-6"><h3 className="text-lg font-bold mb-4 font-poppins">Press Materials</h3><ul className="space-y-2">{data.pressMaterials.map(mat => ( <li key={mat.id} className="flex items-center text-white"><FileText className="w-5 h-5 mr-2 text-purple-400"/>{mat.title}</li> ))}</ul></AppCard><AppCard className="p-6"><h3 className="text-lg font-bold mb-4 font-poppins">Technical Specs</h3><ul className="space-y-2">{data.techSpecs.map(spec => ( <li key={spec.id} className="flex items-center text-white"><Settings className="w-5 h-5 mr-2 text-purple-400"/>{spec.title}</li> ))}</ul></AppCard><AppCard className="p-6"><h3 className="text-lg font-bold mb-4 font-poppins">Awards & Reviews</h3><ul className="space-y-2">{data.awards.map(award => ( <li key={award.id} className="flex items-center text-white"><Trophy className="w-5 h-5 mr-2 text-yellow-400"/>{award.title}</li> ))}</ul></AppCard></div></div>);
    const FestivalTracker = ({ data }) => { const summary = { submitted: data.length, accepted: data.filter(s => s.status === 'Accepted').length, pending: data.filter(s => s.status === 'Pending').length, totalFees: data.reduce((acc, s) => acc + s.fee, 0), }; return (<div><SectionTitle icon={Trophy}>Film Festival Submission Tracking</SectionTitle><div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"><StatCard title="Submitted" value={summary.submitted} icon={UploadCloud} color="bg-blue-500" /><StatCard title="Accepted" value={summary.accepted} icon={CheckCircle} color="bg-green-500" /><StatCard title="Pending" value={summary.pending} icon={Clock} color="bg-yellow-500" /><StatCard title="Total Fees" value={`$${summary.totalFees}`} icon={BarChart2} color="bg-purple-500" /></div><AppCard className="p-6"><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-zinc-700 text-sm text-zinc-300"><th className="p-3">Festival</th><th className="p-3">Tier</th><th className="p-3">Fee</th><th className="p-3">Status</th></tr></thead><tbody>{data.map(sub => (<tr key={sub.id} className="border-b border-zinc-800 hover:bg-zinc-800/50"><td className="p-3 font-semibold text-white">{sub.name}</td><td className="p-3 text-zinc-300">{sub.tier}</td><td className="p-3 text-zinc-300">${sub.fee}</td><td className="p-3"><span className={`px-2 py-1 text-xs rounded-full ${ sub.status === 'Accepted' ? 'bg-green-500/20 text-green-300' : sub.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300' }`}>{sub.status}</span></td></tr>))}</tbody></table></div></AppCard></div>); };
    const MediaContacts = ({ data, setMediaContacts, setNotification }) => {
        const fileInputRef = useRef(null);
        
        const handleExportCsv = () => {
            const headers = ['name', 'outlet', 'type', 'engagement'];
            const csvContent = [
                headers.join(','),
                ...data.map(contact => headers.map(header => `"${contact[header]}"`).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) { // feature detection
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', 'media_contacts.csv');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setNotification({ type: 'success', message: 'Media contacts exported to CSV!' });
            } else {
                setNotification({ type: 'error', message: 'Your browser does not support CSV export.' });
            }
        };

        const handleImportCsv = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            if (file.type !== 'text/csv') {
                setNotification({ type: 'error', message: 'Please upload a CSV file.' });
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                try {
                    const lines = text.split('\n').filter(line => line.trim() !== '');
                    if (lines.length === 0) {
                        setNotification({ type: 'error', message: 'CSV file is empty.' });
                        return;
                    }

                    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                    const expectedHeaders = ['name', 'outlet', 'type', 'engagement'];
                    
                    if (headers.length !== expectedHeaders.length || !expectedHeaders.every(h => headers.includes(h))) {
                        setNotification({ type: 'error', message: `Invalid CSV headers. Expected: ${expectedHeaders.join(', ')}` });
                        return;
                    }

                    const newContacts = [];
                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/"/g, '')); // Handle commas within quotes
                        if (values.length === headers.length) {
                            let contact = { id: Date.now() + i }; // Assign a new unique ID
                            headers.forEach((header, index) => {
                                contact[header] = values[index];
                            });
                            newContacts.push(contact);
                        } else {
                            console.warn(`Skipping malformed row: ${lines[i]}`);
                        }
                    }
                    
                    setMediaContacts(prev => [...prev, ...newContacts]);
                    setNotification({ type: 'success', message: `Successfully imported ${newContacts.length} contacts!` });

                } catch (error) {
                    setNotification({ type: 'error', message: `Error parsing CSV: ${error.message}` });
                    console.error("CSV parsing error:", error);
                }
            };
            reader.onerror = () => {
                setNotification({ type: 'error', message: 'Failed to read CSV file.' });
            };
            reader.readAsText(file);
        };

        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <SectionTitle icon={AtSign}>Media Contact Management</SectionTitle>
                    <div className="flex gap-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImportCsv}
                            accept=".csv"
                            className="hidden"
                        />
                        <AppButton onClick={() => fileInputRef.current.click()} icon={Upload}>
                            Import CSV
                        </AppButton>
                        <AppButton onClick={handleExportCsv} icon={FileDown}>
                            Export CSV
                        </AppButton>
                    </div>
                </div>
                <AppCard className="lg:col-span-2 p-6">
                    <h3 className="text-lg font-bold mb-4 font-poppins">Contact Database</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-700 text-sm text-zinc-300">
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Outlet</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Engagement</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(contact => (
                                    <tr key={contact.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                                        <td className="p-3 font-semibold text-white">{contact.name}</td>
                                        <td className="p-3 text-zinc-300">{contact.outlet}</td>
                                        <td className="p-3 text-zinc-300">{contact.type}</td>
                                        <td className="p-3">
                                            <span className={`text-sm font-bold ${
                                                contact.engagement === 'High' ? 'text-green-400' :
                                                contact.engagement === 'Medium' ? 'text-yellow-400' :
                                                'text-red-400'
                                            }`}>
                                                {contact.engagement}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </AppCard>
                <div className="space-y-6 mt-6 lg:mt-0"> {/* Added margin top for smaller screens */}
                    <AppCard className="p-6">
                        <h3 className="text-lg font-bold mb-4 font-poppins">Outreach Analytics</h3>
                        <StatCard title="Response Rate" value="43%" icon={Megaphone} color="bg-blue-500" />
                        <StatCard title="Est. PR Value" value="$15.8K" icon={BarChart2} color="bg-green-500" className="mt-4" />
                    </AppCard>
                    <AppCard className="p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-poppins"><Bot /> AI Assistant</h3>
                        <AppButton onClick={() => setNotification({ type: 'info', message: 'AI is generating a personalized pitch email...' })} icon={Zap} className="w-full">Generate Pitch Email</AppButton>
                        <AppButton variant="secondary" icon={Search} className="w-full mt-3">Find New Contacts</AppButton>
                    </AppCard>
                </div>
            </div>
        );
    };
    const InfluencerDiscovery = ({ filmData, setNotification }) => {
        const [influencers, setInfluencers] = useState(initialInfluencers);
        const [showModal, setShowModal] = useState(false);
        const [editingInfluencer, setEditingInfluencer] = useState(null);
        const [loading, setLoading] = useState(false);

        const handleDiscover = async () => {
            setLoading(true);
            const newInfluencers = await mockApiCall(discoverInfluencers(filmData));
            setInfluencers(prev => [...prev, ...newInfluencers]);
            setNotification({ type: 'success', message: `Discovered ${newInfluencers.length} new influencers!` });
            setLoading(false);
        };
        const handleAdd = () => { setEditingInfluencer({ name: '', platform: 'tiktok', followers: '', engagement: '', status: 'untracked' }); setShowModal(true); };
        const handleEdit = (influencer) => { setEditingInfluencer(influencer); setShowModal(true); };
        const handleDelete = (id) => { setInfluencers(prev => prev.filter(inf => inf.id !== id)); setNotification({ type: 'info', message: 'Influencer removed.' }); };
        const handleSave = (influencerToSave) => {
            if (influencerToSave.id) {
                setInfluencers(prev => prev.map(inf => inf.id === influencerToSave.id ? influencerToSave : inf));
                setNotification({ type: 'success', message: 'Influencer updated.' });
            } else {
                const newInfluencer = { ...influencerToSave, id: `inf_${Date.now()}`, relevance: `${Math.floor(Math.random() * 15) + 80}%` };
                setInfluencers(prev => [newInfluencer, ...prev]);
                setNotification({ type: 'success', message: 'Influencer added.' });
            }
            setShowModal(false);
            setEditingInfluencer(null);
        };
        const handleStatusChange = (id, status) => {
            setInfluencers(prev => prev.map(inf => inf.id === id ? { ...inf, status } : inf));
        };
        const InfluencerModal = ({ isOpen, onClose, onSave, influencer }) => {
            if (!isOpen) return null;
            const [data, setData] = useState(influencer);
            const handleChange = e => { setData(prev => ({ ...prev, [e.target.name]: e.target.value })) };
            
            return (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <AppCard className="p-8 max-w-lg w-full animate-fade-in-up">
                    <h3 className="text-xl font-bold text-white mb-6 font-poppins">{influencer.id ? 'Edit Influencer' : 'Add Influencer'}</h3>
                    <div className="space-y-4">
                        <AppInput name="name" value={data.name} onChange={handleChange} placeholder="Name or Handle (e.g., @filmnerd)"/>
                        <AppSelect name="platform" value={data.platform} onChange={handleChange}>
                            {Object.keys(PLATFORMS).map(p => <option key={p} value={p}>{PLATFORMS[p].name}</option>)}
                        </AppSelect>
                        <AppInput name="followers" value={data.followers} onChange={handleChange} placeholder="Followers (e.g., 2.1M or 2100000)"/>
                        <AppInput name="engagement" value={data.engagement} onChange={handleChange} placeholder="Engagement Rate (e.g., 15.2%)"/>
                    </div>
                    <div className="flex justify-end gap-4 mt-8">
                        <AppButton onClick={onClose} variant="secondary">Cancel</AppButton>
                        <AppButton onClick={() => onSave(data)}>{influencer.id ? 'Save Changes' : 'Add Influencer'}</AppButton>
                    </div>
                </AppCard>
            </div>);
        };
        const statusOptions = { untracked: "Untracked", tracked: "Tracked", contacted: "Contacted", replied: "Replied", signed: "Signed", declined: "Declined" };
        const statusColors = { untracked: 'bg-zinc-700', tracked: 'bg-blue-600', contacted: 'bg-yellow-500', replied: 'bg-purple-500', signed: 'bg-green-500', declined: 'bg-red-600' };

        return (
            <div>
                <InfluencerModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSave} influencer={editingInfluencer}/>
                <div className="flex justify-between items-center mb-6">
                    <SectionTitle icon={Handshake}>Influencer Identification</SectionTitle>
                    <div className="flex gap-4">
                        <AppButton onClick={handleDiscover} icon={Bot} disabled={loading}>{loading ? 'Discovering...' : 'AI Discover'}</AppButton>
                        <AppButton onClick={handleAdd} icon={Plus}>Add Influencer</AppButton>
                    </div>
                </div>
                <AppCard className="p-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-700 text-sm text-zinc-300">
                                    <th className="p-3">Influencer</th><th className="p-3">Platform</th><th className="p-3">Followers</th><th className="p-3">Engagement</th><th className="p-3">AI Relevance</th><th className="p-3">Status</th><th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {influencers.map(inf => (
                                    <tr key={inf.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                        <td className="p-3 font-semibold text-white">{inf.name}</td>
                                        <td className="p-3"><span className={`text-2xl p-1 rounded-md ${PLATFORMS[inf.platform].color}`}>{PLATFORMS[inf.platform].icon}</span></td>
                                        <td className="p-3 text-zinc-300">{inf.followers}</td>
                                        <td className="p-3 text-zinc-300">{inf.engagement}</td>
                                        <td className="p-3 font-bold text-purple-400">{inf.relevance}</td>
                                        <td className="p-3">
                                            <AppSelect value={inf.status} onChange={e => handleStatusChange(inf.id, e.target.value)} className={`!p-1.5 !text-xs !border-0 ${statusColors[inf.status]}`}>
                                                {Object.entries(statusOptions).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                            </AppSelect>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <AppButton onClick={() => handleEdit(inf)} variant="secondary" icon={Edit} className="!p-2"/>
                                                <AppButton onClick={() => handleDelete(inf.id)} variant="danger" icon={Trash2} className="!p-2"/>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </AppCard>
            </div>
        );
    };
    const ReviewAggregator = ({ data, setNotification }) => { const handleGenerateResponse = () => { setNotification({ type: 'info', message: 'AI is drafting a professional response...' }); }; const sentimentCount = data.reduce((acc, review) => { acc[review.sentiment] = (acc[review.sentiment] || 0) + 1; return acc; }, {}); return (<div><SectionTitle icon={MessageSquare}>Review Aggregation & Response</SectionTitle><div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2 space-y-4">{data.map(review => ( <AppCard key={review.id} className="p-4"><div className="flex justify-between items-start"><div><p className="font-bold text-white">{review.source}</p><p className="text-zinc-300">{review.text}</p></div><span className={`text-sm font-bold ${ review.sentiment === 'Positive' ? 'text-green-400' : review.sentiment === 'Mixed' ? 'text-yellow-400' : 'text-red-400' }`}>{review.sentiment}</span></div></AppCard> ))}</div><div className="space-y-6"><AppCard className="p-6"><h3 className="text-lg font-bold mb-4 font-poppins">Sentiment Analysis</h3><div className="space-y-2"><p className="flex justify-between">Positive: <span className="font-bold text-green-400">{sentimentCount.Positive || 0}</span></p><p className="flex justify-between">Mixed: <span className="font-bold text-yellow-400">{sentimentCount.Mixed || 0}</span></p><p className="flex justify-between">Negative: <span className="font-bold text-red-400">{sentimentCount.Negative || 0}</span></p></div></AppCard><AppCard className="p-6"><h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-poppins"><Bot /> AI Response Assistant</h3><AppButton onClick={handleGenerateResponse} icon={Zap} className="w-full">Generate Response</AppButton></AppCard></div></div></div>); };
    const MediaPlanGenerator = ({ setNotification }) => {
        const [releaseDate, setReleaseDate] = useState('');
        const [targetCities, setTargetCities] = useState([]); // Will be array for tags
        const [mediaPlan, setMediaPlan] = useState(null);
        const [loading, setLoading] = useState(false);
        const [currentStep, setCurrentStep] = useState(1); // New state for steps

        const handleGenerate = async () => {
            setLoading(true);
            const planData = { releaseDate, targetCities };
            const result = await mockApiCall(generateMediaPlan(planData));
            setMediaPlan(result);
            setLoading(false);
        }

        const handlePrint = () => {
             const printWindow = window.open('', '_blank');
             const planElement = document.getElementById('media-plan-printable');
             if(printWindow && planElement) {
                const html = `<html><head><title>Media Plan</title><script src="https://cdn.tailwindcss.com"></script><style>body { background-color: #18181b; color: #d4d4d8; font-family: 'Inter', sans-serif; padding: 2rem; } .phase-title { font-size: 1.5rem; font-weight: bold; color: #c084fc; border-bottom: 2px solid #3f3f46; padding-bottom: 0.5rem; margin-bottom: 1rem; font-family: 'Poppins', sans-serif; } .category-title { font-size: 1.1rem; font-weight: bold; color: #a5b4fc; margin-top: 1.5rem; margin-bottom: 0.5rem; font-family: 'Poppins', sans-serif;} .task-item { background-color: #27272a; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.5rem; }</style></head><body>${planElement.innerHTML}</body></html>`;
                printWindow.document.write(html);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => { printWindow.print(); }, 500);
             }
        };

        const PlanTask = ({ task }) => {
            const Icon = task.icon;
            return (
                <div className="bg-zinc-800/50 p-4 rounded-lg flex items-start gap-4 mb-3">
                    <Icon className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                    <p className="text-zinc-200 flex-grow">{task.text}</p>
                    <span className="text-xs font-bold text-yellow-400 bg-yellow-900/50 px-2 py-1 rounded-full">{task.status}</span>
                </div>
            );
        };
        
        // TagInput component for smart inputs
        const TagInput = ({ tags, onAddTag, onRemoveTag, placeholder }) => {
            const [inputValue, setInputValue] = useState('');
            const handleKeyDown = (e) => {
                if (e.key === 'Enter' && inputValue.trim() !== '') {
                    e.preventDefault();
                    onAddTag(inputValue.trim());
                    setInputValue('');
                }
            };
            return (
                <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag, index) => (
                            <span key={index} className="flex items-center bg-purple-600/30 text-purple-200 px-3 py-1 rounded-full text-sm">
                                {tag}
                                <button onClick={() => onRemoveTag(tag)} className="ml-2 text-purple-300 hover:text-white">
                                    <XCircle size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                    <AppInput
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                    />
                     <p className="text-xs text-zinc-400 mt-1">Type and press Enter to add a city.</p>
                </div>
            );
        };

        const handleAddCityTag = (city) => {
            if (!targetCities.includes(city)) {
                setTargetCities(prev => [...prev, city]);
            }
        };

        const handleRemoveCityTag = (cityToRemove) => {
            setTargetCities(prev => prev.filter(city => city !== cityToRemove));
        };

        const handleNextStep = () => {
            if (currentStep === 1) {
                if (!releaseDate || targetCities.length === 0) {
                    setNotification({ type: 'error', message: 'Please provide a release date and at least one target city.'});
                    return;
                }
                setCurrentStep(2);
                handleGenerate(); // Generate plan on moving to step 2
            }
        };

        const handlePreviousStep = () => {
            setCurrentStep(1);
            setMediaPlan(null); // Clear plan when going back
        };

        return (
            <div>
                 <SectionTitle icon={Calendar}>AI Media Plan Generator</SectionTitle>

                 {currentStep === 1 && (
                     <AppCard className="p-8 mb-8 animate-fade-in">
                         <h3 className="text-xl font-semibold text-white mb-6 font-poppins">Step 1: Define Your Project</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="text-sm font-semibold text-zinc-300 mb-2 block">Projected Release Date</label>
                                <AppInput type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} className="dark:[color-scheme:dark]"/>
                             </div>
                             <div>
                                 <label className="text-sm font-semibold text-zinc-300 mb-2 block">Target Theatrical Markets</label>
                                 <TagInput tags={targetCities} onAddTag={handleAddCityTag} onRemoveTag={handleRemoveCityTag} placeholder="e.g., New York, Los Angeles..." />
                             </div>
                         </div>
                         <div className="flex justify-end mt-8">
                             <AppButton onClick={handleNextStep} size="lg">Next: Generate Plan <ArrowRight size={18} className="ml-2"/></AppButton>
                         </div>
                     </AppCard>
                 )}

                 {currentStep === 2 && (
                     <AppCard className="p-8 mb-8 animate-fade-in">
                         <h3 className="text-xl font-semibold text-white mb-6 font-poppins">Step 2: Review & Export Media Plan</h3>
                         {loading && <div className="flex justify-center items-center h-64"><Bot className="w-12 h-12 text-purple-400 animate-spin" /></div>}
                         
                         {mediaPlan && !loading && (
                             <div id="media-plan-printable" className="space-y-12">
                                 {Object.values(mediaPlan).map(phase => (
                                     <div key={phase.title}>
                                         <h3 className="phase-title text-2xl font-bold text-purple-300 border-b-2 border-zinc-700 pb-2 mb-6 font-poppins">{phase.title}</h3>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                             <div>
                                                <h4 className="category-title text-lg font-semibold text-indigo-300 mb-3 font-poppins">Public Relations</h4>
                                                {phase.pr.length > 0 ? phase.pr.map(task => <PlanTask key={task.id} task={task} />) : <p className="text-zinc-400 text-sm">No PR tasks for this phase.</p>}
                                             </div>
                                              <div>
                                                <h4 className="category-title text-lg font-semibold text-cyan-300 mb-3 font-poppins">Digital Marketing</h4>
                                                {phase.digital.length > 0 ? phase.digital.map(task => <PlanTask key={task.id} task={task} />) : <p className="text-zinc-400 text-sm">No digital tasks for this phase.</p>}
                                             </div>
                                              <div>
                                                <h4 className="category-title text-lg font-semibold text-pink-300 mb-3 font-poppins">Influencers</h4>
                                                {phase.influencers.length > 0 ? phase.influencers.map(task => <PlanTask key={task.id} task={task} />) : <p className="text-zinc-400 text-sm">No influencer tasks for this phase.</p>}
                                             </div>
                                              <div>
                                                <h4 className="category-title text-lg font-semibold text-amber-300 mb-3 font-poppins">Events & Screenings</h4>
                                                {phase.events.length > 0 ? phase.events.map(task => <PlanTask key={task.id} task={task} />) : <p className="text-zinc-400 text-sm">No event tasks for this phase.</p>}
                                             </div>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         )}
                         {!mediaPlan && !loading && <div className="text-center text-zinc-400 py-16">No plan generated yet. Go back to step 1.</div>}

                         <div className="flex justify-between gap-4 mt-8">
                             <AppButton onClick={handlePreviousStep} variant="secondary"> <ChevronLeft size={18} className="mr-2"/> Back</AppButton>
                             {mediaPlan && !loading && <AppButton onClick={handlePrint} size="lg" icon={Printer}>Export Plan</AppButton>}
                         </div>
                     </AppCard>
                 )}
            </div>
        );
    };
    
    // Updated: Store functions returning JSX instead of direct JSX
    const subTabs = { 
        kit: { label: "Press Kit", icon: Newspaper, component: () => <PressKitManager data={pressKitData} /> }, 
        festivals: { label: "Festivals", icon: Trophy, component: () => <FestivalTracker data={festivalSubmissions} /> }, 
        contacts: { label: "Media Contacts", icon: AtSign, component: () => <MediaContacts data={mediaContacts} setMediaContacts={setMediaContacts} setNotification={setNotification}/> },
        influencers: { label: "Influencers", icon: Star, component: () => <InfluencerDiscovery filmData={filmData} setNotification={setNotification} /> }, 
        reviews: { label: "Reviews", icon: MessageSquare, component: () => <ReviewAggregator data={reviews} setNotification={setNotification}/> },
        plan: { label: "Media Plan", icon: Calendar, component: () => <MediaPlanGenerator setNotification={setNotification} /> },
    };
    
    return (<div> <div className="flex items-center border-b border-zinc-700 mb-8 overflow-x-auto"> {Object.entries(subTabs).map(([key, {label, icon}]) => { const Icon = icon; return ( <button key={key} onClick={() => setActiveSubTab(key)} className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${ activeSubTab === key ? 'border-purple-500 text-white' : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800' }`}> <Icon className="w-5 h-5"/> <span>{label}</span> </button> ) })} </div> <div className="animate-fade-in"> {subTabs[activeSubTab].component()} </div> </div>); };


// --- MAIN APP COMPONENT ---

const FilmScopeAI = () => {
  const [activeTab, setActiveTab] = useState('audience');
  const [filmData, setFilmData] = useState({ title: 'Echoes of Silence', genre: 'Horror', budget: '$1.2M', logline: 'A sound engineer who discovers a hidden frequency in an old recording must unravel a conspiracy before the silence consumes him.', demographic: 'Young Adults (18-24)', uniqueElements: 'Unique sound design, psychological horror elements' });
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [mediaContacts, setMediaContacts] = useState(initialMediaContacts); // State for media contacts
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: () => {} });

  const handleCreateCampaign = (campaignData) => { const newCampaign = { ...campaignData, id: `camp_${Date.now()}`, status: 'Draft', metrics: {}, metaAdStatus: 'Not Promoted', createdAt: new Date(), }; setCampaigns(prev => [newCampaign, ...prev]); setNotification({ type: 'success', message: `Campaign "${newCampaign.title}" created as a draft!` }); };
  const handleAnalysisComplete = (analysisData) => { console.log("Audience analysis complete:", analysisData); };

  // Use useCallback to memoize the onDismiss function for the Notification component
  const handleDismissNotification = useCallback(() => {
    setNotification({ message: '' });
  }, []);

  const tabs = {
    audience: { label: 'Audience Analysis', icon: Target, component: <AudienceAnalysis filmData={filmData} setFilmData={setFilmData} onAnalysisComplete={handleAnalysisComplete} setNotification={setNotification} /> },
    video: { label: 'Video Analysis', icon: Video, component: <VideoAnalysis filmData={filmData} onCreateCampaign={handleCreateCampaign} /> },
    content: { label: 'Content Creation', icon: Lightbulb, component: <ContentCreation filmData={filmData} onCreateCampaign={handleCreateCampaign} /> },
    budget: { label: 'Budget Planner', icon: DollarSign, component: <BudgetPlanner filmData={filmData} /> },
    campaigns: { label: 'Campaign Manager', icon: Briefcase, component: <CampaignManager campaigns={campaigns} setCampaigns={setCampaigns} setNotification={setNotification} setActiveTab={setActiveTab} /> },
    visuals: { label: 'Visual Content', icon: Palette, component: <VisualContentStudio filmData={filmData} /> },
    community: { label: 'Community', icon: MessageCircle, component: <SmartCommunityManager />},
    press: { label: 'Press & Outreach', icon: Megaphone, component: <PressAndOutreach filmData={filmData} setNotification={setNotification} setMediaContacts={setMediaContacts} mediaContacts={mediaContacts} /> }, 
    analytics: { label: 'Performance Analytics', icon: BarChart2, component: <PerformanceAnalytics /> },
    settings: { label: 'Settings', icon: Settings, component: <SettingsPage setNotification={setNotification} /> },
  };
  
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
        {/* Pass the memoized onDismiss to Notification */}
        <Notification message={notification.message} type={notification.type} onDismiss={handleDismissNotification} />
        <ConfirmationModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal({ isOpen: false })} />
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
            {/* Render the component by calling it as a function */}
            {tabs[activeTab].component}
            </main>
        </div>
    </div>
  );
};

export default FilmScopeAI;
