import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
    ChevronLeft, ChevronRight, Search, Target, Bot, Zap, Film, BarChart2, Clapperboard, 
    Megaphone, Calendar, LayoutDashboard, Settings, Plus, Trash2, Edit, Copy, MoreVertical, 
    Clock, ArrowRight, Video, UploadCloud, FileText, Lightbulb, TrendingUp, Filter, Users, 
    Palette, Info, CheckCircle, XCircle, AlertTriangle, Briefcase, Download, Trophy, 
    AtSign, Link, Star, Newspaper, MessageSquare, Handshake, ThumbsUp, ThumbsDown, DollarSign,
    PieChart as PieChartIcon, Sliders, MapPin, Send, MessageCircle, Smile, Meh, Frown, Scissors, UserCog, KeyRound, CopyCheck,
    Printer, Upload, FileDown, X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, ComposedChart, PieChart, Pie, Cell } from 'recharts';

// --- SUPABASE & API CLIENT SETUP ---
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;

// Initialize Supabase client
export const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

// --- GEMINI API HELPER ---
const callGeminiApi = async (prompt, isJson = false) => {
  if (!geminiApiKey) {
    console.error("Gemini API key is missing.");
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
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

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

// --- MOCK DATA & HELPERS ---
const mockApiCall = (data, duration = 1500) => new Promise(resolve => setTimeout(() => resolve(data), duration));

const aiOptimizationSuggestions = [
    { id: 1, suggestion: 'The "Trailer Launch Teaser" campaign has a high ROAS. Consider increasing its budget by 20%.', priority: 'High', action: 'Boost Campaign' },
    { id: 2, suggestion: 'Create a lookalike audience based on users who engaged with your Q&A post to find new potential fans.', priority: 'Medium', action: 'Create Audience' },
    { id: 3, suggestion: 'Your engagement on TikTok is lower than on Instagram. Try using a trending sound for your next post.', priority: 'Low', action: 'See Content Ideas' }
];

const generateAdCopyExample = async (analysis, filmData) => {
    await mockApiCall(null, 1000);
    const baseCopy = `The silence will be broken. From the producers of "The Grinning Man" comes a new auditory nightmare. In a world of noise, one man discovers a sound that should have stayed buried. 🔊 What secrets does it hold? Watch the trailer for #${filmData.title} and find out. Coming this Fall. #IndieHorror #${filmData.genre} #WhatDidYouHear`;
    
    let platformSpecificCopy = '';
    switch(filmData.genre) {
        case 'Horror':
            platformSpecificCopy = `**Instagram Post Idea:**\nDon't just watch the movie, listen to it. ${filmData.title} is an experience in sound and fear. Are you brave enough to press play?\n\n**Facebook Ad Headline:**\nThey say silence is golden. They were wrong. Terribly wrong.\n\n**TikTok Hook:**\nThink you've heard it all? This sound will change everything. Duet this with your reaction.`;
            break;
        default:
             platformSpecificCopy = `**Instagram Post Idea:**\nExplore the story behind the silence. ${filmData.title} is more than a film; it's a puzzle waiting to be solved. Join the conversation.\n\n**Facebook Ad Headline:**\nEvery sound tells a story. This one screams a conspiracy.`;
            break;
    }
    return `${baseCopy}\n\n---\n\n**Platform-Specific Ideas:**\n${platformSpecificCopy}`;
};

const generateDraftCopy = async (idea, filmTitle) => {
    await mockApiCall(null, 1000);
    switch(idea.type){
        case 'Visual':
            return `Visually stunning. Emotionally resonant. Get your first look at the world of #${filmTitle} with these brand new stills. Which one is your favorite? Let us know below! 👇 #IndieFilm #Cinematography`;
        case 'Behind-the-Scenes':
            return `Ever wonder what it takes to bring a film to life? 🎬 Go behind the scenes with our lead actor for a day on the set of #${filmTitle}. #BTS #Filmmaking #ActorLife`;
        case 'Community':
            return `It's your turn to ask! Join the director of #${filmTitle} for a LIVE Q&A session this Thursday at 8pm EST. Get your questions ready! We'll be answering everything about the story, the production, and more. #AskTheDirector #LiveQA`;
        default:
            return `Get ready. The official trailer for #${filmTitle} drops this Friday. #MovieTrailer #ComingSoon`;
    }
};

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

const generateVisualAnalysis = (posterA, posterB, filmData) => { 
    const winner = Math.random() > 0.5 ? 'B' : 'A'; 
    const loser = winner === 'A' ? 'B' : 'A'; 
    return { 
        recommendation: `Version ${winner}`, 
        confidence: Math.floor(Math.random() * 20) + 75, 
        insight: `Version ${winner}'s design is more effective for ${filmData.genre}.`, 
        metrics: { 
            [winner]: { 
                clarity: Math.floor(Math.random() * 10) + 90, 
                emotionalResonance: Math.floor(Math.random() * 10) + 88, 
                typographyReadability: Math.floor(Math.random() * 10) + 91, 
                demographicAppeal: Math.floor(Math.random() * 10) + 89 
            }, 
            [loser]: { 
                clarity: Math.floor(Math.random() * 20) + 70, 
                emotionalResonance: Math.floor(Math.random() * 20) + 68, 
                typographyReadability: Math.floor(Math.random() * 20) + 75, 
                demographicAppeal: Math.floor(Math.random() * 20) + 72 
            } 
        } 
    }; 
};

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
        return { name: categoryName, value: amount, percentage: (percentage * 100).toFixed(0), breakdown: breakdown.map(b => ({...b, percentage: (b.amount / amount * 100).toFixed(0)})) };
    });

    return { plan: allocations.filter(a => a.value > 0), insights: [`For a '${goal}' goal, we've prioritized spending accordingly.`, 'This is a suggested starting point. Monitor performance and adjust allocations based on real-world data.'] };
};

// Initial data and other mock data
const initialCampaigns = [ 
    { id: 'camp_1', title: 'Trailer Launch Teaser', content: 'First look at our new film! Trailer drops Friday.', platform: 'instagram', type: 'Video', status: 'Completed', metrics: { reach: 12500, engagement: 8.2, clicks: 450, cost: 50, roas: 3.1 }, metaAdStatus: 'Promoted', createdAt: new Date(2025, 5, 4), creative: { type: 'video_placeholder', url: 'https://placehold.co/400x400/ec4899/ffffff?text=Video+Creative' } }, 
    { id: 'camp_2', title: 'Meet the Director Q&A', content: 'Our director will be live on Instagram this Wednesday at 8 PM EST.', platform: 'instagram', type: 'Community', status: 'Active', metrics: { reach: 8200, engagement: 12.5, clicks: 150, cost: 20, roas: 4.5 }, metaAdStatus: 'Promoted', createdAt: new Date(2025, 5, 5), creative: { type: 'image_placeholder', url: 'https://placehold.co/400x400/ec4899/ffffff?text=Q&A+Graphic' } }, 
];

const initialMediaContacts = [ { id: 1, name: 'Jane Doe', outlet: 'IndieWire', type: 'Critic', engagement: 'High' }, { id: 2, name: 'John Smith', outlet: 'The Hollywood Reporter', type: 'Press', engagement: 'Medium' }, ];
const initialInfluencers = [ { id: 'inf_1', name: '@filmnerd', platform: 'tiktok', followers: '2.1M', engagement: '15.2%', relevance: '95%', status: 'contacted' }, { id: 'inf_2', name: 'CinemaStix', platform: 'youtube', followers: '750K', engagement: '8.1%', relevance: '92%', status: 'signed' }, ];
const communityConversations = [ { id: 'convo_1', platform: 'instagram', user: { name: 'indieFan22', avatar: 'https://placehold.co/40x40/ec4899/ffffff?text=I' }, lastMessage: 'This looks incredible! When is the release date?', sentiment: 'Positive', unread: true, messages: [ { from: 'user', text: 'This looks incredible! When is the release date?' } ], aiAnalysis: { sentimentScore: 95, suggestedReplies: [ { title: 'Acknowledge & Thank', text: 'Thank you so much! We\'re thrilled you\'re excited.' }, { title: 'Provide Info', text: 'Fall 2025! Follow us for updates.' } ] } }, ];
const performanceAnalyticsData = { totalReach: '239.9K', engagementRate: '11.4%', totalSpend: '$170', roas: '6.8x', reachByDay: [ { day: 'Mon', reach: 2000 }, { day: 'Tue', reach: 5000 }, ], engagementByPlatform: [ { platform: 'TikTok', engagement: 18.3, reach: 150.2 }, { platform: 'Instagram', engagement: 10.3, reach: 20.7 }, ], insights: [ { text: 'Behind-the-scenes content on TikTok has a 340% higher engagement rate.', icon: Film, color: 'text-purple-400' }, { text: 'Your Instagram Q&A is performing well.', icon: Clapperboard, color: 'text-pink-400' }, ] };

// --- UI COMPONENTS ---
const AppCard = ({ children, className = '', ...props }) => ( 
    <div className={`bg-gradient-to-br from-zinc-900/70 to-zinc-950/70 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl transition-colors duration-300 hover:border-purple-500/50 ${className}`} {...props}> 
        {children} 
    </div> 
);

const SectionTitle = ({ icon, children, ...props }) => { 
    const Icon = icon; 
    return ( 
        <h2 className="text-2xl font-semibold text-zinc-100 mb-6 flex items-center gap-3 font-poppins" {...props}> 
            <Icon className="w-7 h-7 text-purple-400" /> 
            <span>{children}</span> 
        </h2> 
    ); 
};

const AppButton = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, icon: Icon, type = "button", as: Component = 'button', ...props }) => { 
    const baseStyle = "inline-flex items-center justify-center font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all duration-200 ease-in-out"; 
    const sizeStyles = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-base" }; 
    const variantStyles = { primary: "bg-purple-600 hover:bg-purple-500 text-white focus:ring-purple-500 border border-transparent", secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 focus:ring-zinc-500 border border-zinc-700", danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-transparent", outline: "bg-transparent border border-zinc-700 hover:bg-zinc-800 text-zinc-300 focus:ring-zinc-600", ghost: "bg-transparent hover:bg-zinc-800 text-zinc-300 focus:ring-600" }; 
    const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : ""; 
    
    return ( 
        <Component type={Component === 'button' ? type : undefined} onClick={onClick} disabled={disabled} className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyle} ${className}`} {...props}> 
            {Icon && <Icon size={size === 'sm' ? 16 : 18} className={children ? "mr-2" : ""} />} 
            {children} 
        </Component> 
    ); 
};

const StatCard = ({ title, value, icon, color }) => { 
    const Icon = icon; 
    return (
        <AppCard className="p-4">
            <div className="flex items-center">
                <div className={`p-3 rounded-lg mr-4 ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">{title}</p>
                    <p className="text-2xl font-bold text-white font-poppins">{value}</p>
                </div>
            </div>
        </AppCard>
    ); 
};

const ConfidenceBar = ({ value }) => ( 
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold text-zinc-300">Confidence Score</span>
            <span className="text-sm font-bold text-purple-400">{value}%</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2.5">
            <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
    </div> 
);

const Notification = ({ message, type, onDismiss }) => { 
    const icons = { success: CheckCircle, error: XCircle, info: Info }; 
    const Icon = icons[type]; 
    
    useEffect(() => { 
        if (!message) return;
        const timer = setTimeout(onDismiss, 4000); 
        return () => clearTimeout(timer); 
    }, [onDismiss, message]); 

    if (!message) return null; 
    
    return ( 
        <div className="fixed top-20 right-8 z-50 animate-fade-in-down"> 
            <AppCard className={`flex items-center p-4 rounded-xl border-l-4 ${type === 'success' ? 'border-green-400' : type === 'error' ? 'border-red-400' : 'border-blue-400'}`}> 
                <Icon className={`w-6 h-6 mr-3 ${type === 'success' ? 'text-green-400' : type === 'error' ? 'text-red-400' : 'text-blue-400'}`} /> 
                <p className="text-white">{message}</p> 
                <button onClick={onDismiss} className="ml-4 text-zinc-400 hover:text-white">
                    <X size={18} />
                </button> 
            </AppCard> 
        </div> 
    ); 
};

const AppInput = (props) => <input {...props} className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors" />;
const AppTextarea = (props) => <textarea {...props} className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors resize-y"/>;
const AppSelect = (props) => <select {...props} className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"/>;

// --- FEATURE COMPONENTS ---

const AudienceAnalysis = ({ filmData, setFilmData, setNotification }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [adCopyModalOpen, setAdCopyModalOpen] = useState(false);
  const [generatedAdCopy, setGeneratedAdCopy] = useState('');
  const [adCopyLoading, setLoadingAdCopy] = useState(false);

  const handleInputChange = (e) => { 
    const { name, value } = e.target; 
    setFilmData(prev => ({ ...prev, [name]: value })); 
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);
    
    if (geminiApiKey) {
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
2. "targetDemographic": A string identifying the most likely target demographic.
3. "genreInsights": A string with 2-3 sentences of insights specific to marketing this genre.
4. "contentPillars": An array of 4 strings representing key content themes.
5. "metaTargeting": An object with "interests" (array of 10-15 strings) and "behaviors" (array of 5-7 strings).
`;
      const result = await callGeminiApi(prompt, true);
      if (result && !result.error) {
        setAnalysis(result);
      } else {
        const fallbackResult = generateAudienceAnalysis(filmData);
        setAnalysis(fallbackResult);
        setNotification({ type: 'info', message: 'Using demo analysis. Add Gemini API key for real AI insights.' });
      }
    } else {
      const result = await mockApiCall(generateAudienceAnalysis(filmData));
      setAnalysis(result);
      setNotification({ type: 'info', message: 'Using demo analysis. Add Gemini API key for real AI insights.' });
    }
    setLoading(false);
  };

  const handleCopyToClipboard = (textToCopy, type) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    setNotification({ type: 'success', message: `${type} copied to clipboard!` });
  };

  const handleGenerateAdCopy = async () => {
    setLoadingAdCopy(true);
    setGeneratedAdCopy('Generating example ad copy...');
    setAdCopyModalOpen(true);
    const copy = await generateAdCopyExample(analysis, filmData);
    setGeneratedAdCopy(copy);
    setLoadingAdCopy(false);
  };

  useEffect(() => {
    if (filmData.demographic === 'I need help identifying' && filmData.title) {
      handleAnalyze();
    } else {
      setAnalysis(null);
    }
  }, [filmData.demographic]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <AppCard className="p-8">
        <SectionTitle icon={Target}>Film Data Input</SectionTitle>
        <div className="space-y-6">
          <AppInput type="text" name="title" placeholder="Film Title" value={filmData.title} onChange={handleInputChange} />
          <AppSelect name="genre" value={filmData.genre} onChange={handleInputChange}>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </AppSelect>
          <AppInput type="text" name="budget" placeholder="Budget Range (e.g., $50k - $100k)" value={filmData.budget} onChange={handleInputChange} />
          <AppTextarea name="logline" placeholder="Logline" value={filmData.logline} onChange={handleInputChange} rows="3"></AppTextarea>
          <AppTextarea name="uniqueElements" placeholder="Unique Elements (e.g., specific cast, unique setting)" value={filmData.uniqueElements} onChange={handleInputChange} rows="3"></AppTextarea>
          <AppSelect name="demographic" value={filmData.demographic} onChange={handleInputChange}>
            {DEMOGRAPHICS.map(d => <option key={d} value={d}>{d}</option>)}
          </AppSelect>
          <AppButton onClick={handleAnalyze} disabled={loading || !filmData.title} className="w-full" size="lg">
            {loading ? 'Analyzing...' : 'Analyze Audience'}
          </AppButton>
        </div>
      </AppCard>
      
      <AppCard className="p-8">
        <SectionTitle icon={Bot}>AI Analysis Results</SectionTitle>
        {loading && <div className="flex justify-center items-center h-full"><Bot className="w-12 h-12 text-purple-400 animate-spin" /></div>}
        {analysis && !loading && (
          <div className="space-y-6 animate-fade-in">
            <ConfidenceBar value={analysis.confidence} />
            <div>
              <h3 className="font-semibold text-lg text-white mb-2 font-poppins">Target Demographic</h3>
              <p className="text-purple-300 bg-purple-900/30 px-4 py-2 rounded-lg">{analysis.targetDemographic}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white mb-2 font-poppins">Genre-Specific Insights</h3>
              <p className="text-zinc-300">{analysis.genreInsights}</p>
            </div>

            {analysis.metaTargeting && (
              <AppCard className="p-4 bg-zinc-800/50">
                <h3 className="font-bold text-lg text-white mb-3 flex items-center gap-2 font-poppins">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0.46875C5.37109 0.46875 0 5.83984 0 12.4688C0 18.332 3.93359 23.2305 9.25 24.2852V15.543H6.53516V12.1641H9.25V9.63672C9.25 6.94141 10.8516 5.48047 13.293 5.48047C14.4414 5.48047 15.3984 5.57422 15.6523 5.60938V8.63672H13.8438C12.5547 8.63672 12.2852 9.28125 12.2852 10.0156V12.1641H15.5117L15.0117 15.543H12.2852V24.4688C18.2539 23.7188 24 18.7305 24 12.4688C24 5.83984 18.6289 0.46875 12 0.46875Z"/>
                  </svg>
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

            <div>
              <h3 className="font-semibold text-lg text-white mb-2 font-poppins">Strategic Content Pillars</h3>
              <div className="grid grid-cols-2 gap-2">
                {analysis.contentPillars.map(pillar => (
                  <div key={pillar} className="bg-zinc-800 p-2 rounded-lg text-center text-sm text-zinc-200">{pillar}</div>
                ))}
              </div>
            </div>
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
              <AppButton onClick={() => setAdCopyModalOpen(false)} variant="secondary" icon={X} className="!p-2"/>
            </div>
            {adCopyLoading ? (
              <div className="flex justify-center items-center h-48"> 
                <Bot className="w-12 h-12 text-purple-400 animate-spin" /> 
              </div>
            ) : (
              <div>
                <AppTextarea readOnly value={generatedAdCopy} rows="10" className="mb-4" />
                <AppButton onClick={() => handleCopyToClipboard(generatedAdCopy, 'Ad Copy')} icon={Copy}>Copy to Clipboard</AppButton>
              </div>
            )}
          </AppCard>
        </div>
      )}
    </div>
  );
};

const CampaignManager = ({ campaigns, setCampaigns, setNotification, setActiveTab }) => {
  const [view, setView] = useState('dashboard');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const handleCreateNew = () => {
    setEditingCampaign({ title: '', content: '', platform: 'instagram', type: 'Visual', status: 'Draft' });
    setShowEditModal(true);
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setShowEditModal(true);
  };

  const handleDelete = async (campaign) => {
    if (window.confirm(`Are you sure you want to delete "${campaign.title}"?`)) {
      if (supabase?.from) {
        const { error } = await supabase.from('campaigns').delete().match({ id: campaign.id });
        if (error) {
          setNotification({ type: 'error', message: `Error deleting campaign: ${error.message}` });
        } else {
          setCampaigns(prev => prev.filter(c => c.id !== campaign.id));
          setNotification({ type: 'info', message: 'Campaign deleted.' });
        }
      } else {
        setCampaigns(prev => prev.filter(c => c.id !== campaign.id));
        setNotification({ type: 'info', message: 'Campaign deleted.' });
      }
    }
  };

  const handleSave = async (campaignToSave) => {
    if (supabase?.from) {
      if (campaignToSave.id) {
        const { error } = await supabase.from('campaigns').update(campaignToSave).match({ id: campaignToSave.id });
        if (error) {
          setNotification({ type: 'error', message: `Error updating: ${error.message}` });
        } else {
          setCampaigns(prev => prev.map(c => c.id === campaignToSave.id ? campaignToSave : c));
          setNotification({ type: 'success', message: 'Campaign updated!' });
        }
      } else {
        const { data, error } = await supabase.from('campaigns').insert([campaignToSave]).select();
        if (error) {
          setNotification({ type: 'error', message: `Error creating: ${error.message}` });
        } else {
          setCampaigns(prev => [data[0], ...prev]);
          setNotification({ type: 'success', message: 'Campaign created!' });
        }
      }
    } else {
      const newCampaign = { ...campaignToSave, id: Date.now() };
      if (campaignToSave.id) {
        setCampaigns(prev => prev.map(c => c.id === campaignToSave.id ? campaignToSave : c));
      } else {
        setCampaigns(prev => [newCampaign, ...prev]);
      }
      setNotification({ type: 'success', message: 'Campaign saved!' });
    }
    setShowEditModal(false);
    setEditingCampaign(null);
  };

  const CampaignEditModal = ({ isOpen, onClose, onSave, campaignData }) => {
    const [campaign, setCampaign] = useState(campaignData || { title: '', content: '', platform: 'instagram', type: 'Visual', status: 'Draft' });

    useEffect(() => {
      if (campaignData) {
        setCampaign(campaignData);
      }
    }, [campaignData]);

    const handleInputChange = e => {
      const { name, value } = e.target;
      setCampaign(p => ({ ...p, [name]: value }));
    };

    const handleSave = () => {
      if (!campaign.title || !campaign.content) {
        setNotification({ type: 'error', message: 'Title and Content are required.' });
        return;
      }
      onSave(campaign);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <AppCard className="p-8 max-w-2xl w-full">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-white">{campaign.id ? 'Edit Campaign' : 'Create New Campaign'}</h3>
            <AppButton onClick={onClose} variant="secondary" icon={X} className="!p-2" />
          </div>
          <div className="space-y-4">
            <AppInput type="text" name="title" value={campaign.title} onChange={handleInputChange} placeholder="Campaign Title" />
            <AppTextarea name="content" value={campaign.content} onChange={handleInputChange} placeholder="Campaign Content..." rows="5"></AppTextarea>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppSelect name="platform" value={campaign.platform} onChange={handleInputChange}>
                {Object.keys(PLATFORMS).map(p => <option key={p} value={p}>{PLATFORMS[p].name}</option>)}
              </AppSelect>
              <AppSelect name="type" value={campaign.type} onChange={handleInputChange}>
                <option>Visual</option>
                <option>Video</option>
                <option>Text</option>
                <option>Community</option>
              </AppSelect>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <AppButton onClick={handleSave} variant="primary">Save</AppButton>
          </div>
        </AppCard>
      </div>
    );
  };

  return (
    <div>
      <CampaignEditModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} onSave={handleSave} campaignData={editingCampaign} />
      <div className="flex items-center justify-between mb-8">
        <SectionTitle icon={Briefcase}>Campaign Manager</SectionTitle>
        <AppButton onClick={handleCreateNew} icon={Plus}>Create Campaign</AppButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Campaigns" value={campaigns.length} icon={Briefcase} color="bg-purple-500" />
        <StatCard title="Active" value={campaigns.filter(c => c.status === 'Active').length} icon={LayoutDashboard} color="bg-green-500" />
        <StatCard title="Scheduled" value={campaigns.filter(c => c.status === 'Scheduled').length} icon={Calendar} color="bg-blue-500" />
        <StatCard title="Drafts" value={campaigns.filter(c => c.status === 'Draft').length} icon={Edit} color="bg-yellow-500" />
      </div>
      <AppCard className="p-6">
        <div className="space-y-4">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="bg-zinc-800/50 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{PLATFORMS[campaign.platform]?.icon || '❓'}</span>
                <div>
                  <p className="font-semibold text-white">{campaign.title}</p>
                  <p className="text-sm text-zinc-300">
                    {campaign.type} - 
                    <span className={`px-2 py-0.5 text-xs rounded-full ml-1 ${campaign.status === 'Active' ? 'bg-green-500/20 text-green-300' : campaign.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                      {campaign.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AppButton onClick={() => handleEdit(campaign)} variant="secondary" icon={Edit} className="!p-2" />
                <AppButton onClick={() => handleDelete(campaign)} variant="danger" icon={Trash2} className="!p-2" />
              </div>
            </div>
          ))}
          {campaigns.length === 0 && (
            <div className="text-center py-8 text-zinc-400">
              No campaigns yet. Create your first campaign!
            </div>
          )}
        </div>
      </AppCard>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const FilmScopeAI = () => {
  const [activeTab, setActiveTab] = useState('audience');
  const [filmData, setFilmData] = useState({ 
    title: 'Echoes of Silence', 
    genre: 'Horror', 
    budget: '$1.2M', 
    logline: 'A sound engineer who discovers a hidden frequency in an old recording must unravel a conspiracy before the silence consumes him.', 
    demographic: 'Young Adults (18-24)', 
    uniqueElements: 'Unique sound design, psychological horror elements' 
  });
  const [campaigns, setCampaigns] = useState([]);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (supabase?.from) {
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaigns')
          .select('*')
          .order('created_at', { ascending: false });

        if (campaignError) {
          setNotification({ type: 'info', message: 'Supabase not configured. Using sample data.' });
          setCampaigns(initialCampaigns);
        } else {
          setCampaigns(campaignData);
        }
      } else {
        setNotification({ type: 'info', message: 'Supabase not configured. Using sample data.' });
        setCampaigns(initialCampaigns);
      }
      setIsLoading(false);
    };
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
    <div className="bg-zinc-950 text-zinc-200 min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Notification message={notification.message} type={notification.type} onDismiss={handleDismissNotification} />

      <div className="flex min-h-screen">
        <aside className="w-64 bg-gradient-to-b from-black/50 to-zinc-950/50 p-6 space-y-6 border-r border-zinc-800">
          <div className="flex items-center space-x-3">
            <Film className="w-10 h-10 text-purple-500" />
            <h1 className="text-2xl font-semibold text-white">FilmScope<span className="text-purple-400">AI</span></h1>
          </div>
          <nav className="space-y-2">
            {Object.entries(tabs).map(([key, { label, icon: Icon }]) => (
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
            ))}
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