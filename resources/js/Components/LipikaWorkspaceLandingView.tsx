import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  Play, 
  Pause, 
  Volume2, 
  Maximize2, 
  Plus, 
  ArrowUp, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Copy, 
  CheckCircle2, 
  Code2, 
  Image as ImageIcon, 
  BrainCircuit, 
  Workflow, 
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Clock,
  Layers,
  Bot,
  Eye,
  Download,
  Youtube,
  X,
  Edit3
} from 'lucide-react';
import { User, AISubscriptionPlan, SystemSettings } from '../types';
import { storage } from '../services/storage';

const AI_CONVEYOR_ITEMS = [
  {
    name: 'OpenAI ChatGPT',
    icon: (
      <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.259 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7466-7.0729z" />
      </svg>
    ),
  },
  {
    name: 'Grok xAI',
    icon: (
      <span className="font-mono font-black text-sm text-slate-800 dark:text-slate-100">/</span>
    ),
  },
  {
    name: 'Anthropic Claude',
    icon: (
      <span className="text-amber-600 dark:text-amber-400 font-extrabold text-base">✳</span>
    ),
  },
  {
    name: 'Midjourney',
    icon: (
      <ImageIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
    ),
  },
  {
    name: 'Google Gemini',
    icon: (
      <Sparkles className="w-5 h-5 text-blue-500 dark:text-blue-400" />
    ),
  },
  {
    name: 'DeepSeek',
    icon: (
      <Workflow className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
    ),
  },
  {
    name: 'GitHub Copilot',
    icon: (
      <Code2 className="w-5 h-5 text-sky-500 dark:text-sky-400" />
    ),
  },
  {
    name: 'Perplexity AI',
    icon: (
      <BrainCircuit className="w-5 h-5 text-teal-500 dark:text-teal-400" />
    ),
  },
];

interface LipikaWorkspaceLandingViewProps {
  currentUser: User;
  settings: SystemSettings;
  onSelectPlan: (plan: AISubscriptionPlan) => void;
  onOpenInAppChat: () => void;
  onOpenDigitalStore: () => void;
  onOpenLoginModal?: (tab?: 'login' | 'register') => void;
  isLoggedIn?: boolean;
  onSubmitPromptWithAuth?: (prompt: string, model: string) => void;
}

export const LipikaWorkspaceLandingView: React.FC<LipikaWorkspaceLandingViewProps> = ({
  currentUser,
  settings,
  onSelectPlan,
  onOpenInAppChat,
  onOpenDigitalStore,
  onOpenLoginModal,
  isLoggedIn = false,
  onSubmitPromptWithAuth,
}) => {
  const brandName = settings?.appName || 'OmniCraft AI';
  const brandPrefix = settings?.brandPrefix || (settings?.appName?.includes(' ') ? settings.appName.split(' ')[0] : 'OmniCraft');
  const brandSuffix = settings?.brandSuffix || (settings?.appName?.includes(' ') ? settings.appName.split(' ').slice(1).join(' ') : 'AI');
  const brandTagline = settings?.brandTagline || 'All-in-One Smartest AI Workspace & Subscription Hub';
  const customDomain = settings?.customDomain || 'omnicraft.ai';

  // 1. Dynamic Rotating Tag in Hero with smooth flip animation
  const dynamicRoles = ['Developer', 'Student', 'Creator', 'Writer', 'Designer', 'Engineer', 'Researcher', 'Business'];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [roleFade, setRoleFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleFade(false);
      setTimeout(() => {
        setCurrentRoleIndex((prev) => (prev + 1) % dynamicRoles.length);
        setRoleFade(true);
      }, 220);
    }, 2800);
    return () => clearInterval(timer);
  }, [dynamicRoles.length]);

  // 2. Interactive AI Chat Mockup State
  const [selectedModel, setSelectedModel] = useState<'ChatGPT' | 'Claude' | 'Gemini' | 'Grok'>('ChatGPT');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string; model?: string }>>([
    {
      sender: 'ai',
      text: "How can I help you today? Ask me anything from coding and homework to image prompts and creative marketing copy.",
      model: 'ChatGPT'
    }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleSendPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatPrompt.trim()) return;

    const userText = chatPrompt.trim();
    setChatPrompt('');

    // Requirement: If user enters text and submits, trigger login popup if unauthenticated,
    // and after logging in, start functioning inside our domain in full workspace!
    if (onSubmitPromptWithAuth) {
      onSubmitPromptWithAuth(userText, selectedModel);
      return;
    }

    if (!isLoggedIn) {
      if (onOpenLoginModal) {
        onOpenLoginModal('login');
      }
      return;
    }

    setChatHistory((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = '';
      if (selectedModel === 'ChatGPT') {
        reply = `[ChatGPT-5.5]: Analysis completed for "${userText.slice(0, 45)}...". I've optimized your request with advanced reasoning and high-context comprehension.`;
      } else if (selectedModel === 'Claude') {
        reply = `[Claude 3.7 Sonnet]: Nuanced breakdown prepared. Your task has been structured with clear, artifact-ready steps and clean markdown documentation.`;
      } else if (selectedModel === 'Gemini') {
        reply = `[Gemini 2.5 Pro]: Real-time multimodal synthesis complete. Fast search grounding and structured response generated across millions of parameters.`;
      } else {
        reply = `[Grok 3]: Real-time analysis direct from live knowledge feeds. Clean, fast, unfiltered and direct answer generated for you.`;
      }
      setChatHistory((prev) => [...prev, { sender: 'ai', text: reply, model: selectedModel }]);
      setIsAiThinking(false);
    }, 600);
  };

  // 3. YouTube Showcase Player State & URL management
  const [youtubeUrl, setYoutubeUrl] = useState<string>(
    settings?.showcaseYoutubeUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  );
  const [isEditingYoutubeModal, setIsEditingYoutubeModal] = useState(false);
  const [youtubeInputUrl, setYoutubeInputUrl] = useState(youtubeUrl);
  const [isYouTubeLivePlaying, setIsYouTubeLivePlaying] = useState(false);

  const getYouTubeEmbedUrl = (url: string, autoplay: boolean = true): string | null => {
    if (!url) return null;
    const trimmed = url.trim();
    let videoId = '';
    
    if (trimmed.includes('youtu.be/')) {
      videoId = trimmed.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0] || '';
    } else if (trimmed.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(trimmed.split('?')[1] || '');
      videoId = urlParams.get('v') || '';
    } else if (trimmed.includes('youtube.com/embed/')) {
      videoId = trimmed.split('youtube.com/embed/')[1]?.split('?')[0]?.split('&')[0] || '';
    } else if (trimmed.includes('youtube.com/live/')) {
      videoId = trimmed.split('youtube.com/live/')[1]?.split('?')[0]?.split('&')[0] || '';
    } else if (trimmed.length === 11 && !trimmed.includes('/')) {
      videoId = trimmed;
    } else {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
      const match = trimmed.match(regExp);
      if (match && match[2].length === 11) {
        videoId = match[2];
      }
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&enablejsapi=1`;
    }
    return null;
  };

  const handleSaveYoutubeUrl = (newUrl: string) => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    setYoutubeUrl(trimmed);
    setIsEditingYoutubeModal(false);
    setIsYouTubeLivePlaying(true);

    // Save to local storage
    const currentSettings = storage.getSettings();
    storage.saveSettings({ ...currentSettings, showcaseYoutubeUrl: trimmed });

    // Sync to backend API
    fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ showcase_youtube_url: trimmed }),
    }).catch(() => {});
  };

  // Interactive Video Showcase Player State with real animated playback
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(38); // percentage

  useEffect(() => {
    let interval: any;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  const totalVideoDurationSec = 135; // 2:15
  const currentVideoSeconds = Math.round((videoProgress / 100) * totalVideoDurationSec);
  const formatVideoTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 4. Pricing Controls (Monthly vs Annual, Individual vs Business)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [planAudience, setPlanAudience] = useState<'individual' | 'business'>('individual');

  // 5. FAQ Accordion State (item 0 open by default as in screenshot)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // 6. Code snippet copied state
  const [codeCopied, setCodeCopied] = useState(false);
  const handleCopyCode = () => {
    navigator.clipboard.writeText(`<!-- ${brandName} Embed SDK -->\n<script src="https://${customDomain}/v2/sdk.js"></script>\n<button id="ai-launcher">Ask ${brandName} Workspace</button>`);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Pricing Tiers matching screenshot exactly
  const pricingTiers = [
    {
      id: 'plan-free',
      name: 'Free',
      subtitle: 'Perfect for trying out the platform...',
      priceMonthlyBDT: 0,
      priceAnnualBDT: 0,
      priceUSD: 0,
      isPopular: false,
      buttonLabel: 'Choose Plan',
      buttonVariant: 'outline',
      tokensIncluded: 1500,
      features: [
        '1,500 credits included',
        'Support basic ChatGPT, Gemini, Claude, and Grok models',
        'Limited web search and image generation',
        'Audio dictation support',
        'Limited memory and context',
        'Projects, tasks, and file downloads'
      ],
      dailyLimitNote: 'Daily request limit applies'
    },
    {
      id: 'lipika-go',
      name: 'Go',
      subtitle: 'Affordable entry into paid plans...',
      priceMonthlyBDT: 399,
      priceAnnualBDT: 319,
      priceUSD: 3.50,
      isPopular: false,
      buttonLabel: 'Choose Plan >',
      buttonVariant: 'primary',
      tokensIncluded: 30000,
      features: [
        '30,000 credits included',
        'Support selected AI models ChatGPT, Gemini, Claude, and Grok',
        'Reasoning support for smarter answers',
        'Web search for updated information',
        'Complex and accurate image creation',
        'Longer memory and context'
      ],
      dailyLimitNote: 'Daily request limit applies'
    },
    {
      id: 'lipika-starter',
      name: 'Starter',
      subtitle: 'For individuals getting started with AI...',
      priceMonthlyBDT: 599,
      priceAnnualBDT: 479,
      priceUSD: 5.20,
      isPopular: false,
      buttonLabel: 'Choose Plan >',
      buttonVariant: 'primary',
      tokensIncluded: 50000,
      features: [
        '50,000 credits included',
        'Access to selected AI models, including ChatGPT, Gemini, Claude, and Grok',
        'Reasoning support for smarter answers',
        'Web search for updated and real-time information',
        'Advanced, more complex, and accurate image creation',
        'Longer memory and context'
      ],
      dailyLimitNote: 'Daily request limit applies'
    },
    {
      id: 'lipika-pro',
      name: 'Pro',
      subtitle: 'Premium features and higher limits...',
      priceMonthlyBDT: 899,
      priceAnnualBDT: 719,
      priceUSD: 7.90,
      isPopular: true,
      buttonLabel: 'Choose Plan >',
      buttonVariant: 'primary',
      tokensIncluded: 75000,
      features: [
        '75,000 credits included',
        'Support top AI models from ChatGPT, Gemini, Claude, and Grok',
        'Expanded messages and uploads',
        'Extended reasoning models',
        'Coding-focused model access',
        'Expanded deep research'
      ],
      dailyLimitNote: 'Daily request limit applies'
    },
    {
      id: 'lipika-advance',
      name: 'Advance',
      subtitle: 'Maximum credits with unlimited daily power...',
      priceMonthlyBDT: 1499,
      priceAnnualBDT: 1199,
      priceUSD: 13.00,
      isPopular: false,
      buttonLabel: 'Choose Plan >',
      buttonVariant: 'primary',
      tokensIncluded: 150000,
      features: [
        '150,000 credits included',
        'Access to selected AI models, including ChatGPT, Gemini, Claude, and Grok',
        'Support all top AI models',
        'Includes ChatGPT, Gemini, Claude, and Grok models',
        'Extended reasoning models',
        'Maximum Code task access',
        'Expanded deep research'
      ],
      dailyLimitNote: 'Daily request limit applies'
    }
  ];

  const handleSelectPricingTier = (tier: typeof pricingTiers[0]) => {
    const formattedPlan: AISubscriptionPlan = {
      id: tier.id,
      name: `${brandName} ${tier.name}`,
      provider: 'OmniAI' as any,
      category: 'AI & Education Tools',
      description: tier.subtitle,
      iconName: 'Sparkles',
      priceBDT: billingCycle === 'annual' ? tier.priceAnnualBDT : tier.priceMonthlyBDT,
      priceUSD: tier.priceUSD,
      originalPriceBDT: (billingCycle === 'annual' ? tier.priceAnnualBDT : tier.priceMonthlyBDT) * 1.35,
      billingCycle: billingCycle === 'annual' ? 'yearly' : 'monthly',
      badge: tier.name.toUpperCase(),
      features: tier.features,
      accessType: 'in_app_chat',
      directDomainUrl: `https://${customDomain}/workspace`,
      defaultModelId: 'gpt-4o',
      availableSeats: 99,
      totalSold: 1240,
      isActive: true,
      brandColor: '#2563EB'
    };
    onSelectPlan(formattedPlan);
  };

  const faqItems = [
    {
      question: `What is ${brandName}?`,
      answer: `${brandName} is a smart AI workspace that lets users access major AI models via their official APIs, such as ChatGPT, Gemini, Claude, and Grok, under a single login and a single bill. It is designed to reduce platform switching, simplify AI subscriptions, and make premium AI tools easier to use.`
    },
    {
      question: `Which AI models are available in ${brandName}?`,
      answer: 'You can instantly access ChatGPT-4o & GPT-5, Claude 3.7 Sonnet & Opus, Google Gemini 2.5 Pro & Flash, Grok 3, and DALL-E 3 image generation directly inside one unified console without separate subscriptions.'
    },
    {
      question: 'Do you provide customer support?',
      answer: `Yes! We provide 24/7 dedicated customer support via live WhatsApp, Messenger chat, and email support (${settings?.supportEmail || 'support@omnicraft.ai'}). All orders and subscriptions come with automated instant activation.`
    },
    {
      question: `Can I cancel my ${brandName} subscription?`,
      answer: 'Yes, you have full control. You can cancel or switch your subscription at any time directly from your Customer Portal without hidden fees or lock-ins.'
    },
    {
      question: `Is a free trial available for ${brandName}?`,
      answer: 'Yes! Our Free tier includes 1,500 credits immediately with zero credit card required. You can test the models, prompt them, and upgrade whenever you are ready.'
    }
  ];

  return (
    <div className="w-full bg-white dark:bg-[#070B16] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white pb-20 transition-colors duration-200">
      
      {/* Top Sub-Bar: Positioned below full-width header with clean breathing room */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-xs sm:text-sm py-3 px-4 text-center font-medium flex flex-wrap items-center justify-center gap-2 shadow-sm border-b border-blue-500/30 relative z-40">
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
        <span>ইউএসএ ফিচার লাইভ প্রিভিউ পেইজ ({brandName} Workspace Live) — আপনার ডিজিটাল স্টোরেও সকল সাবস্ক্রিপশন চালু আছে!</span>
        <button 
          onClick={onOpenDigitalStore}
          className="ml-2 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white underline font-bold transition text-xs shadow-2xs hover:scale-105 active:scale-95"
        >
          ডিজিটাল স্টোরে যান →
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 space-y-20 lg:space-y-28">
        
        {/* ======================================================== */}
        {/* 1. HERO SECTION (Matching Image 1 & Image 2 top exactly) */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-2">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Pill Tag + "Your" with animated glowing border beams (Matching screenshot exactly) */}
            <div className="flex items-center gap-3.5 flex-wrap sm:flex-nowrap">
              <div className="relative inline-flex items-center justify-center p-[1.5px] rounded-full overflow-hidden shadow-[0_4px_22px_-4px_rgba(37,99,235,0.18)] bg-slate-200/90 dark:bg-slate-800 transition-all">
                {/* 1. Continuous Rotating Perimeter Conic Gradient Beam */}
                <div 
                  className="absolute -inset-[150%] animate-border-beam-spin pointer-events-none"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0deg, transparent 65deg, #2563EB 105deg, #60A5FA 125deg, transparent 165deg, transparent 245deg, #2563EB 285deg, #60A5FA 305deg, transparent 345deg)'
                  }}
                />

                {/* 2. Soft outer beam glow layer */}
                <div 
                  className="absolute -inset-[150%] animate-border-beam-spin pointer-events-none blur-[4px] opacity-75"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0deg, transparent 65deg, #3B82F6 105deg, #93C5FD 125deg, transparent 165deg, transparent 245deg, #3B82F6 285deg, #93C5FD 305deg, transparent 345deg)'
                  }}
                />

                {/* 3. Top Border Glowing Laser Runner (Matching user arrow 1 exactly) */}
                <div className="absolute top-0 inset-x-2 h-[2px] overflow-hidden rounded-full pointer-events-none z-10">
                  <div 
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#2563EB] to-transparent animate-beam-slide-right shadow-[0_0_10px_#2563EB]"
                  />
                </div>

                {/* 4. Bottom Border Glowing Laser Runner (Matching user arrow 2 exactly) */}
                <div className="absolute bottom-0 inset-x-2 h-[2px] overflow-hidden rounded-full pointer-events-none z-10">
                  <div 
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#2563EB] to-transparent animate-beam-slide-left shadow-[0_0_10px_#2563EB]"
                  />
                </div>

                {/* 5. Inner Pill Body (Clean white background, matching screenshot) */}
                <div className="relative z-10 bg-white dark:bg-[#0B0F19] rounded-full px-6 sm:px-7 py-2 sm:py-2.5 flex items-center justify-center min-w-[155px] sm:min-w-[175px]">
                  <span className={`text-[#2563EB] dark:text-blue-400 font-bold text-2xl sm:text-3xl tracking-tight transition-all duration-300 transform ${
                    roleFade ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
                  }`}>
                    {dynamicRoles[currentRoleIndex]}
                  </span>
                </div>
              </div>

              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Your
              </span>
            </div>

            {/* Smartest AI Workspace Title */}
            <h1 className="text-4xl sm:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.08]">
              Smartest AI Workspace
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl">
              Access ChatGPT, Gemini, Claude, Grok, and more — all in one AI platform for study, work, coding, and creation. One Login. One Bill.
            </p>

            {/* Try Lipika AI Free CTA Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  const freeTier = pricingTiers[0];
                  handleSelectPricingTier(freeTier);
                }}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-7 py-3.5 rounded-xl text-base shadow-lg shadow-blue-500/25 transition-all hover:scale-102 hover:shadow-xl hover:shadow-blue-500/35 active:scale-98 flex items-center gap-2 group"
              >
                <span>Try {brandName} Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400 pt-2 font-medium">
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Private Workspace</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Interactive AI Chatbox Preview (Matching screenshot) */}
          <div className="lg:col-span-6">
            <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-200/60 dark:shadow-none p-5 sm:p-6 space-y-4">
              
              {/* Top Controls: Model Selector & User Avatar Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="relative">
                  <button
                    onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                      𖣐
                    </span>
                    <span>{selectedModel}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {modelDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1.5 z-30 space-y-1 text-xs">
                      {(['ChatGPT', 'Claude', 'Gemini', 'Grok'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            setSelectedModel(m);
                            setModelDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg font-medium flex items-center justify-between ${
                            selectedModel === m ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <span>{m}</span>
                          {selectedModel === m && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Avatar circle like screenshot (HA) */}
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {currentUser.name.includes('শিশির') ? 'SB' : 'HA'}
                </div>
              </div>

              {/* Greeting & Chat Area */}
              <div className="space-y-4 min-h-[160px] max-h-[220px] overflow-y-auto pr-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="w-4 h-4 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center text-[9px]">
                    𖣐
                  </span>
                  <span>Hello {currentUser.name.includes('শিশির') ? 'Shishir' : 'Hadi'}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  How can I help you today?
                </h3>

                {/* Messages Feed */}
                <div className="space-y-3 pt-1">
                  {chatHistory.slice(-2).map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`text-xs p-3 rounded-2xl ${
                        msg.sender === 'user' 
                          ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 border border-blue-100 dark:border-blue-800 ml-6' 
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 mr-6'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}

                  {isAiThinking && (
                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50/80 dark:bg-blue-950/40 px-3 py-2 rounded-xl w-fit border border-blue-100 dark:border-blue-800 shadow-2xs">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span>{selectedModel} চিন্তা করছে ও উত্তর প্রস্তুত করছে...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Box (Matching screenshot) */}
              <form 
                onSubmit={handleSendPrompt}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30 transition shadow-2xs"
              >
                <textarea
                  value={chatPrompt}
                  onChange={(e) => setChatPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendPrompt();
                    }
                  }}
                  rows={2}
                  placeholder="Let's debug this complex Python script or design a sleek landing page..."
                  className="w-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:outline-none bg-transparent"
                />

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => onOpenInAppChat()}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    title="Attach file / Open Full Workspace"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      Auto <ChevronDown className="w-3 h-3" />
                    </span>
                    <button
                      type="submit"
                      disabled={!chatPrompt.trim()}
                      className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition flex items-center justify-center disabled:opacity-40"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>

        </section>

        {/* ======================================================== */}
        {/* 2. ONE PLATFORM. TOP AI (Inward-Gliding Model Conveyor) */}
        {/* ======================================================== */}
        <section className="text-center space-y-6 pt-4">
          
          {/* Conveyor Belt Container with Glowing Halo and Central Swirl */}
          <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            
            {/* Ambient Backdrop Glow behind central logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-400/20 dark:bg-blue-600/15 blur-3xl pointer-events-none" />

            {/* Pill-shaped Conveyor Enclosure */}
            <div className="relative rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 shadow-lg shadow-slate-100/50 dark:shadow-none p-3 sm:p-4 flex items-center justify-between overflow-hidden backdrop-blur-md">
              
              {/* Left Edge Fade Mask */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10" />

              {/* LEFT TRACK: Moving inward from left to right (----> towards center) */}
              <div className="flex-1 overflow-hidden relative">
                <div className="animate-slide-center-left flex items-center gap-3 pr-2">
                  {[...AI_CONVEYOR_ITEMS, ...AI_CONVEYOR_ITEMS, ...AI_CONVEYOR_ITEMS, ...AI_CONVEYOR_ITEMS].map((item, idx) => (
                    <div
                      key={`left-${idx}`}
                      title={item.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center justify-center shrink-0 hover:scale-110 hover:shadow-md transition-all cursor-pointer"
                    >
                      {item.icon}
                    </div>
                  ))}
                </div>
              </div>

              {/* CENTER CIRCULAR SWIRL EMBLEM (Anchored with concentric pulse rings) */}
              <div className="relative z-20 shrink-0 mx-2 sm:mx-4 flex items-center justify-center">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-lg animate-pulse" />
                
                {/* Outer white ring */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-2xl flex items-center justify-center relative">
                  {/* Inner blue swirl emblem */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#1E40AF] via-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-blue-500/40 animate-pulse-glow">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93c-3.96-.48-7.07-3.6-7.55-7.55.33-.09.68-.15 1.05-.18 2.87-.22 5.25-2.29 5.86-5.08.18-.83.21-1.66.1-2.47 3.39.81 5.99 3.65 6.47 7.15-.33.09-.68.15-1.05.18-2.87.22-5.25 2.29-5.86 5.08-.18.83-.21 1.66-.1 2.47-.34.13-.67.27-1.02.4z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* RIGHT TRACK: Moving inward from right to left (<---- towards center) */}
              <div className="flex-1 overflow-hidden relative">
                <div className="animate-slide-center-right flex items-center gap-3 pl-2">
                  {[...AI_CONVEYOR_ITEMS, ...AI_CONVEYOR_ITEMS, ...AI_CONVEYOR_ITEMS, ...AI_CONVEYOR_ITEMS].map((item, idx) => (
                    <div
                      key={`right-${idx}`}
                      title={item.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center justify-center shrink-0 hover:scale-110 hover:shadow-md transition-all cursor-pointer"
                    >
                      {item.icon}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Edge Fade Mask */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10" />

            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            One Platform. Top AI
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {brandName} brings top AI models into one workspace, helping you choose the right model, compare responses, and work faster without switching between tools.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-1">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-4 h-4" /> Reduces costs
            </span>
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-4 h-4" /> Save Time
            </span>
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-4 h-4" /> Work Flexibly
            </span>
          </div>

        </section>

        {/* ======================================================== */}
        {/* 3. SHOWCASE VIDEO PLAYER CONTAINER (Interactive & Live) */}
        {/* ======================================================== */}
        <section className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-[#0A0D18] border border-slate-800 shadow-2xl aspect-[16/9] flex flex-col justify-between p-4 sm:p-8 text-white group">
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/40 via-transparent to-indigo-950/30 pointer-events-none" />

            {/* IF YOUTUBE IS PLAYING: Render embedded iframe */}
            {isYouTubeLivePlaying && getYouTubeEmbedUrl(youtubeUrl) ? (
              <div className="absolute inset-0 z-20 bg-black flex flex-col">
                {/* Floating Top Control Bar */}
                <div className="absolute top-0 inset-x-0 z-30 p-3 sm:p-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-red-600 px-2.5 py-1 rounded-full shadow-md">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      YOUTUBE LIVE
                    </span>
                    <span className="text-xs font-semibold text-white/90 drop-shadow hidden sm:inline">
                      {brandName} Showcase
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setYoutubeInputUrl(youtubeUrl);
                        setIsEditingYoutubeModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 text-white backdrop-blur-md px-3 py-1.5 rounded-xl transition"
                      title="ইউটিউব ভিডিও লিঙ্ক পরিবর্তন করুন"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">লিঙ্ক পরিবর্তন</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsYouTubeLivePlaying(false)}
                      className="p-1.5 rounded-xl bg-white/20 hover:bg-red-600 text-white transition backdrop-blur-md"
                      title="ভিডিও প্লেয়ার বন্ধ করুন"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* The Embedded YouTube Player */}
                <iframe
                  src={getYouTubeEmbedUrl(youtubeUrl, true) || ''}
                  title="YouTube Showcase Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              /* IF NOT PLAYING: Showcase Card Overlay */
              <>
                {/* Top Brand Logo & YouTube Controls inside Video Screen */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center animate-pulse">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-sm tracking-tight text-white/90">{brandName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setYoutubeInputUrl(youtubeUrl);
                        setIsEditingYoutubeModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-red-600/90 hover:bg-red-600 text-white px-2.5 py-1 rounded-xl shadow-md transition"
                      title="হোমপেজ ভিডিওর ইউটিউব লিঙ্ক অ্যাড বা পরিবর্তন করুন"
                    >
                      <Youtube className="w-3.5 h-3.5" />
                      <span>ইউটিউব লিঙ্ক অ্যাড / এডিট</span>
                    </button>
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-slate-300 hidden sm:inline">
                      Official Showcase
                    </span>
                  </div>
                </div>

                {/* Center Play Button & Title */}
                <div className="relative z-10 text-center space-y-4 my-auto px-2">
                  <button
                    onClick={() => {
                      if (getYouTubeEmbedUrl(youtubeUrl)) {
                        setIsYouTubeLivePlaying(true);
                      } else {
                        setYoutubeInputUrl(youtubeUrl);
                        setIsEditingYoutubeModal(true);
                      }
                    }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 mx-auto transition-all hover:scale-110 active:scale-95 animate-pulse"
                    title="ইউটিউব ভিডিও সরাসরি লাইভ চালান"
                  >
                    <Play className="w-8 h-8 ml-1 fill-white" />
                  </button>

                  <h3 className="text-xl sm:text-3xl font-extrabold max-w-xl mx-auto text-white leading-tight">
                    Access ChatGPT, Gemini, Claude, Grok, And 21+ Top AI Models In One Platform — With One Login And One Bill.
                  </h3>

                  <div>
                    <button
                      onClick={() => {
                        if (getYouTubeEmbedUrl(youtubeUrl)) {
                          setIsYouTubeLivePlaying(true);
                        } else {
                          setYoutubeInputUrl(youtubeUrl);
                          setIsEditingYoutubeModal(true);
                        }
                      }}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-red-300 hover:text-white bg-red-950/60 hover:bg-red-900/80 border border-red-700/60 px-4 py-1.5 rounded-full transition"
                    >
                      <Youtube className="w-4 h-4 text-red-500" />
                      লাইভ ইউটিউব প্লেয়ারে চালু করুন
                    </button>
                  </div>
                </div>

                {/* Bottom Video Controls Bar */}
                <div className="relative z-10 space-y-2 pt-4">
                  {/* Progress Bar */}
                  <div 
                    className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer group/bar relative"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                      setVideoProgress(pct);
                    }}
                  >
                    <div 
                      className="h-full bg-red-500 rounded-full transition-all duration-300 ease-linear" 
                      style={{ width: `${videoProgress}%` }} 
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          if (getYouTubeEmbedUrl(youtubeUrl)) {
                            setIsYouTubeLivePlaying(true);
                          } else {
                            setIsEditingYoutubeModal(true);
                          }
                        }} 
                        className="hover:text-white transition"
                        title="প্লে করুন"
                      >
                        <Play className="w-4 h-4 text-red-400 fill-red-400" />
                      </button>
                      <span className="font-mono text-[11px] text-slate-300">
                        {formatVideoTime(currentVideoSeconds)} / 2:15
                      </span>
                      <Volume2 className="w-4 h-4 hover:text-white cursor-pointer" />
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setYoutubeInputUrl(youtubeUrl);
                        setIsEditingYoutubeModal(true);
                      }}
                      className="hover:text-white transition flex items-center gap-1 text-[11px]"
                    >
                      <Youtube className="w-3.5 h-3.5 text-red-500" />
                      <span className="hidden sm:inline">ইউটিউব লিঙ্ক পরিবর্তন</span>
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Modal to Add / Change YouTube URL */}
          {isEditingYoutubeModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600 dark:text-red-400">
                      <Youtube className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">ইউটিউব ভিডিও লিঙ্ক সেট করুন</h3>
                      <p className="text-xs text-slate-500">হোমপেজ প্লেয়ারে লাইভ প্রদর্শনের জন্য ইউটিউব লিঙ্ক দিন</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingYoutubeModal(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    YouTube URL (ভিডিও বা লাইভ লিঙ্ক)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={youtubeInputUrl}
                      onChange={(e) => setYoutubeInputUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... বা https://youtu.be/..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    টিপস: যেকোনো ইউটিউব সাধারণ ভিডিও, লাইভ স্ট্রিম বা শর্ট ইউআরএল সাপোর্ট করে।
                  </p>

                  {/* Live preview if valid */}
                  {getYouTubeEmbedUrl(youtubeInputUrl) && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-black">
                      <iframe
                        src={getYouTubeEmbedUrl(youtubeInputUrl, false) || ''}
                        title="Preview"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingYoutubeModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition"
                  >
                    বাতিল
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveYoutubeUrl(youtubeInputUrl)}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-600/30 transition flex items-center gap-2"
                  >
                    <Youtube className="w-4 h-4" />
                    সংরক্ষণ ও প্লে করুন
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ======================================================== */}
        {/* 4. SMARTER WORKFLOWS, ONE AI PLATFORM (4 Grid Cards)     */}
        {/* ======================================================== */}
        <section className="space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Smarter Workflows<br />One AI Platform
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Use {brandName} for writing, research, coding, image generation, and everyday productivity — all from one simple workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Card 1: All AI-Models in One Platform */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900/70 p-6 sm:p-8 space-y-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1.5 transition-all duration-300 group">
              {/* Visual Mock: Concentric rings + connector line + floating model list */}
              <div className="h-64 rounded-2xl bg-gradient-to-br from-blue-50/70 via-slate-50 to-indigo-50/40 dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-900/50 border border-slate-200/80 dark:border-white/10 p-4 sm:p-6 flex items-center justify-between relative overflow-hidden group-hover:border-blue-300/80 transition-colors">
                
                {/* Left Side: Concentric Rings & Swirl Emblem */}
                <div className="flex flex-col items-center justify-center relative flex-1">
                  {/* Outer Concentric Ring */}
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-blue-200/70 dark:border-blue-500/20 flex items-center justify-center relative animate-pulse-glow">
                    {/* Inner Concentric Ring */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-blue-300/80 dark:border-blue-400/30 flex items-center justify-center">
                      {/* Central Blue Swirl Emblem */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#1E40AF] via-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-blue-500/35">
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93c-3.96-.48-7.07-3.6-7.55-7.55.33-.09.68-.15 1.05-.18 2.87-.22 5.25-2.29 5.86-5.08.18-.83.21-1.66.1-2.47 3.39.81 5.99 3.65 6.47 7.15-.33.09-.68.15-1.05.18-2.87.22-5.25 2.29-5.86 5.08-.18.83-.21 1.66-.1 2.47-.34.13-.67.27-1.02.4z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 text-center mt-2 leading-tight">
                    Choose the best<br />ai model....
                  </div>

                  {/* Connector Line to Floating Card */}
                  <div className="hidden sm:flex items-center absolute right-0 top-1/2 -translate-y-6 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span className="w-6 lg:w-10 h-[1.5px] bg-gradient-to-r from-blue-400 to-blue-500"></span>
                  </div>
                </div>

                {/* Right Side: Floating Model List with ChatGPT-5.5 highlighted */}
                <div className="w-48 sm:w-52 bg-white dark:bg-slate-800/95 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-200/90 dark:border-white/10 p-2.5 sm:p-3 space-y-1.5 shrink-0 z-10 text-left">
                  {/* Claude Opus 4.7 */}
                  <div className="px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                    <span className="text-amber-600 font-bold text-sm">✳</span>
                    <span>Claude Opus 4.7</span>
                  </div>
                  {/* Gemini 3 Pro */}
                  <div className="px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>Gemini 3 Pro</span>
                  </div>
                  {/* ChatGPT-5.5 (Selected with Blue Border) */}
                  <div className="px-3 py-2 rounded-xl border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 flex items-center gap-2.5 text-xs font-bold text-slate-900 dark:text-white shadow-xs">
                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.259 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7466-7.0729z" />
                    </svg>
                    <span>ChatGPT-5.5</span>
                  </div>
                  {/* Claude Sonnet 4.5 */}
                  <div className="px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                    <span className="text-amber-600 font-bold text-sm">✳</span>
                    <span>Claude Sonnet 4.5</span>
                  </div>
                  {/* Grok 4.3 */}
                  <div className="px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">/</span>
                    <span>Grok 4.3</span>
                  </div>
                </div>

              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  All AI-Models in One Platform
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Access supported models like Chatgpt, Gemini, Claude, Grok, and more from one simple workspace.
                </p>
              </div>
            </div>

            {/* Card 2: Generate images in seconds */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900/70 p-6 sm:p-8 space-y-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1.5 transition-all duration-300 group">
              {/* Visual Mock: Lipika AI Floating Window with Cyberpunk VR Image */}
              <div className="h-64 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-slate-50 to-blue-50/40 dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-900/50 border border-slate-200/80 dark:border-white/10 p-4 flex flex-col justify-between overflow-hidden group-hover:border-blue-300/80 transition-colors">
                
                {/* Floating Window Container */}
                <div className="w-full bg-white dark:bg-slate-800/95 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-200/90 dark:border-white/10 p-3 sm:p-3.5 space-y-2">
                  {/* Top Bar: Lipika ai | 1 min */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#1E40AF] to-[#38BDF8] flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93c-3.96-.48-7.07-3.6-7.55-7.55.33-.09.68-.15 1.05-.18 2.87-.22 5.25-2.29 5.86-5.08.18-.83.21-1.66.1-2.47 3.39.81 5.99 3.65 6.47 7.15-.33.09-.68.15-1.05.18-2.87.22-5.25 2.29-5.86 5.08-.18.83-.21 1.66-.1 2.47-.34.13-.67.27-1.02.4z"/>
                      </svg>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{brandName}</span>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                    <span className="text-[11px] text-slate-400">1 min</span>
                  </div>

                  {/* Subtext */}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Your generated images are now ready for download
                  </div>

                  {/* 6-Slot Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {/* Slot 1: Faint placeholder */}
                    <div className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-700/40 border border-slate-200/60 dark:border-white/5 flex items-center justify-center relative">
                      <ImageIcon className="w-5 h-5 text-slate-300 dark:text-slate-500" />
                      <div className="absolute bottom-1 right-1 flex items-center gap-0.5">
                        <span className="w-3.5 h-3.5 rounded bg-white/90 dark:bg-slate-800 text-[8px] flex items-center justify-center shadow-xs">👁</span>
                        <span className="w-3.5 h-3.5 rounded bg-white/90 dark:bg-slate-800 text-[8px] flex items-center justify-center shadow-xs">⬇</span>
                      </div>
                    </div>

                    {/* Slot 2: Featured Cyberpunk VR Woman (matches screenshot) */}
                    <div className="aspect-square rounded-xl overflow-hidden relative shadow-md border border-purple-400/40 group/img">
                      <img 
                        src="https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=300&auto=format&fit=crop&q=80" 
                        alt="Cyberpunk VR AI Artwork"
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-1 right-1 flex items-center gap-1 z-10">
                        <span className="px-1 py-0.5 rounded bg-white/95 dark:bg-slate-900 text-slate-800 dark:text-white text-[9px] font-bold shadow flex items-center justify-center cursor-pointer hover:bg-blue-600 hover:text-white transition">
                          👁
                        </span>
                        <span className="px-1 py-0.5 rounded bg-white/95 dark:bg-slate-900 text-slate-800 dark:text-white text-[9px] font-bold shadow flex items-center justify-center cursor-pointer hover:bg-blue-600 hover:text-white transition">
                          ⬇
                        </span>
                      </div>
                    </div>

                    {/* Slot 3: Faint placeholder */}
                    <div className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-700/40 border border-slate-200/60 dark:border-white/5 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-slate-300 dark:text-slate-500" />
                    </div>

                    {/* Slot 4, 5, 6: Empty rounded slots */}
                    <div className="h-4 rounded-lg bg-slate-100/70 dark:bg-slate-700/30" />
                    <div className="h-4 rounded-lg bg-slate-100/70 dark:bg-slate-700/30" />
                    <div className="h-4 rounded-lg bg-slate-100/70 dark:bg-slate-700/30" />
                  </div>

                </div>

              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  Generate images in seconds
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Create visuals for ads, social posts, websites, product ideas, and creative campaigns using AI image tools.
                </p>
              </div>
            </div>

            {/* Card 3: Research Faster with AI */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900/70 p-6 sm:p-8 space-y-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1.5 transition-all duration-300 group">
              {/* Visual Mock: Workflow diagram */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 p-5 space-y-3 group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md animate-pulse">
                  <Workflow className="w-5 h-5" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">Outline Docs</div>
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 font-bold text-blue-700 dark:text-blue-300">Synthesize</div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">Final Report</div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Research Faster with AI</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Summarize information, compare ideas, prepare outlines, and create reports with help from multiple AI models.
                </p>
              </div>
            </div>

            {/* Card 4: Write Code More Easily Than Ever */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900/70 p-6 sm:p-8 space-y-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1.5 transition-all duration-300 group">
              {/* Visual Mock: Syntax highlighted code box */}
              <div className="rounded-2xl bg-[#0B0F19] text-slate-300 p-4 font-mono text-xs space-y-2 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <span>Javascript</span>
                  <button 
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 hover:text-white transition"
                  >
                    {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{codeCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-[11px] overflow-x-auto text-emerald-400">
                  {`<!-- ${brandName} Checkout Embed -->\n<script src="https://${customDomain}/v2/"></script>\n<button id="checkout-button">Pay</button>`}
                </pre>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Write Code More Easily Than Ever</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Use AI to write, debug, explain, and improve code across your development workflow.
                </p>
              </div>
            </div>

          </div>

        </section>

        {/* ======================================================== */}
        {/* 5. PRICING SECTION: CHOOSE YOUR AI PLAN (5 Tiers)         */}
        {/* ======================================================== */}
        <section className="space-y-10 pt-4" id="pricing">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Choose Your {brandName} Plan
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Flexible plans for individuals, teams, and businesses who want access to AI models and productivity tools from one workspace.
            </p>

            {/* Dual Toggles: Monthly/Annual & Individual/Business */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              
              {/* Monthly / Annual Toggle */}
              <div className="p-1 rounded-full bg-slate-100 border border-slate-200 inline-flex text-xs font-semibold">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-full transition ${
                    billingCycle === 'monthly' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4 py-1.5 rounded-full transition ${
                    billingCycle === 'annual' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Annual (Save 20%)
                </button>
              </div>

              {/* Individual / Business Plan Toggle */}
              <div className="p-1 rounded-full bg-slate-100 border border-slate-200 inline-flex text-xs font-semibold">
                <button
                  onClick={() => setPlanAudience('individual')}
                  className={`px-4 py-1.5 rounded-full transition ${
                    planAudience === 'individual' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Individual
                </button>
                <button
                  onClick={() => setPlanAudience('business')}
                  className={`px-4 py-1.5 rounded-full transition ${
                    planAudience === 'business' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Business Plan
                </button>
              </div>

            </div>
          </div>

          {/* 5 Pricing Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {pricingTiers.map((tier) => {
              const currentPrice = billingCycle === 'annual' ? tier.priceAnnualBDT : tier.priceMonthlyBDT;

              return (
                <div
                  key={tier.id}
                  className={`rounded-3xl border p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 bg-white hover:-translate-y-2 hover:shadow-2xl ${
                    tier.isPopular 
                      ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-lg shadow-blue-500/10' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-slate-900">{tier.name}</h4>
                        {tier.isPopular && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 animate-pulse">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{tier.subtitle}</p>
                    </div>

                    {/* Price Display */}
                    <div className="py-2 border-y border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-slate-950">
                          {currentPrice === 0 ? '0' : `৳${currentPrice.toLocaleString()}`}
                        </span>
                        {currentPrice > 0 && (
                          <span className="text-xs text-slate-500 font-medium">/mo</span>
                        )}
                      </div>
                      {settings.currency === 'USD' && tier.priceUSD > 0 && (
                        <div className="text-[11px] text-slate-400 font-mono font-medium">
                          ≈ ${tier.priceUSD.toFixed(2)} USD
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleSelectPricingTier(tier)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition shadow-xs hover:scale-102 active:scale-98 ${
                        tier.buttonVariant === 'primary' || tier.isPopular
                          ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/20 hover:shadow-md'
                          : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {tier.buttonLabel}
                    </button>

                    {/* Included AI Models Icon Badges */}
                    <div className="flex items-center justify-around py-2 border-b border-slate-100">
                      <span className="text-xs" title="ChatGPT">𖣐</span>
                      <span className="text-xs text-blue-500" title="Gemini">✦</span>
                      <span className="text-xs text-amber-600" title="Claude">✺</span>
                      <span className="text-xs text-slate-800" title="Grok">Ø</span>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2.5 pt-1 text-left">
                      <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                        What's included?
                      </div>
                      <ul className="space-y-2 text-[11px] text-slate-600">
                        {tier.features.map((feat, fidx) => (
                          <li key={fidx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                    {tier.dailyLimitNote}
                  </div>
                </div>
              );
            })}
          </div>

        </section>

        {/* ======================================================== */}
        {/* 6. FAQ ACCORDION (Matching screenshot)                   */}
        {/* ======================================================== */}
        <section className="max-w-3xl mx-auto space-y-8" id="faq">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently asked questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Find clear answers about {brandName}, supported models, pricing, credits, payments, and workspace features.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 shadow-2xs hover:border-slate-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-blue-600 shrink-0 transition-transform" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </section>

        {/* ======================================================== */}
        {/* 7. READY TO GET STARTED? CTA BANNER (Matching screenshot)*/}
        {/* ======================================================== */}
        <section className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl shadow-blue-500/25 relative overflow-hidden group">
            
            {/* Grid line patterns */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 space-y-3 max-w-xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to Get Started?
              </h2>
              <p className="text-sm sm:text-base text-blue-100">
                Your smart assistant, ready whenever you are.
              </p>
            </div>

            <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  const freeTier = pricingTiers[0];
                  handleSelectPricingTier(freeTier);
                }}
                className="bg-white hover:bg-slate-100 text-blue-600 font-bold px-7 py-3.5 rounded-xl text-sm shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group/btn"
              >
                <span>Try {brandName} Free</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-200" />
              </button>
            </div>

            <div className="relative z-10 text-[11px] text-blue-100 flex items-center justify-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>No credit card required</span>
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 8. FOOTER (Matching exact screenshot 2 footer)          */}
        {/* ======================================================== */}
        <footer className="pt-12 border-t border-slate-200 text-xs text-slate-600 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={brandName} className="h-8 max-w-[180px] object-contain drop-shadow-sm" />
                ) : (
                  <>
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold animate-pulse-glow">
                      𖣐
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-extrabold text-xl text-slate-900 tracking-tight font-sans">
                        {brandPrefix}
                      </span>
                      <span className="font-bold text-lg text-blue-600 font-sans tracking-tight">
                        {brandSuffix}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <p className="text-slate-500 leading-relaxed max-w-sm">
                Gain a competitive edge with {brandName} — driving growth through efficient AI adaptation.
              </p>
              
              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2 text-slate-400">
                <a href="#linkedin" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:text-blue-600 hover:border-blue-600 transition">in</a>
                <a href="#facebook" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:text-blue-600 hover:border-blue-600 transition">f</a>
                <a href="#instagram" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:text-blue-600 hover:border-blue-600 transition">ig</a>
                <a href="#twitter" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:text-blue-600 hover:border-blue-600 transition">tw</a>
                <a href="#whatsapp" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:text-blue-600 hover:border-blue-600 transition">wa</a>
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Solutions</h5>
              <ul className="space-y-2">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-blue-600">Home</button></li>
                <li><a href="#features" className="hover:text-blue-600">Features</a></li>
                <li><button onClick={onOpenInAppChat} className="hover:text-blue-600">AI Models</button></li>
                <li><a href="#pricing" className="hover:text-blue-600">Pricing</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Legal</h5>
              <ul className="space-y-2">
                <li><a href="#terms" className="hover:text-blue-600">Terms of Use</a></li>
                <li><a href="#privacy" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#cookie" className="hover:text-blue-600">Cookie Policy</a></li>
                <li><a href="#refund" className="hover:text-blue-600">Refund Policy</a></li>
                <li><a href="#faq" className="hover:text-blue-600">FAQ</a></li>
                <li><a href="#cookie-settings" className="hover:text-blue-600">Cookie Settings</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Resources</h5>
              <ul className="space-y-2">
                <li><a href="#blog" className="hover:text-blue-600">Blog</a></li>
                <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
                <li><a href="#about" className="hover:text-blue-600">About</a></li>
              </ul>
            </div>

          </div>

          {/* Payment Gateway Badges Row matching bottom screenshot */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50">bKash</span>
              <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50">Nagad</span>
              <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50">Rocket</span>
              <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50">VISA</span>
              <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50">Mastercard</span>
              <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50">AMEX</span>
              <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50">Stripe</span>
            </div>

            <div className="text-[11px] text-slate-500">
              © 2026 {brandName}. All rights reserved.
            </div>
          </div>

        </footer>

      </div>

    </div>
  );
};
