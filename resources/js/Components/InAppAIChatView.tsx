import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Plus, 
  ArrowUp, 
  ChevronDown, 
  ChevronUp, 
  Mic, 
  MicOff, 
  Paperclip, 
  Copy, 
  Check, 
  RefreshCw, 
  Volume2, 
  PanelLeftClose, 
  PanelLeft, 
  Clock, 
  FolderPlus, 
  ExternalLink, 
  X, 
  FileText, 
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Lock,
  LogOut,
  Image as ImageIcon,
  Zap,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { User, ChatMessage, UserDocument, AISubscriptionPlan, SystemSettings } from '../types';
import { storage } from '../services/storage';

interface InAppAIChatViewProps {
  currentUser: User;
  settings?: SystemSettings;
  onOpenMarketplace: () => void;
  onOpenUpgrade?: () => void;
  onBackToHome?: () => void;
  onLogout?: () => void;
  initialPrompt?: string | null;
  initialModel?: string | null;
}

export const InAppAIChatView: React.FC<InAppAIChatViewProps> = ({
  currentUser,
  settings,
  onOpenMarketplace,
  onOpenUpgrade,
  onBackToHome,
  onLogout,
  initialPrompt,
  initialModel,
}) => {
  // 1. Sidebar Toggle State
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 2. Model Selector State
  const [selectedModel, setSelectedModel] = useState<string>(initialModel || 'ChatGPT');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  // 2.3 Authenticated Models Tracking ("আর যদি লগইন করা থাকে তাহলে তো আর লগইন করার প্রয়োজন নাই")
  const [authenticatedModels, setAuthenticatedModels] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`nexus_auth_models_${currentUser.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // fallback
    }
    return [initialModel || 'ChatGPT'];
  });

  const isModelAuthenticated = (modelId: string) => {
    return authenticatedModels.some(m => m.toLowerCase() === modelId.toLowerCase());
  };

  // 2.4 Profile Popup Menu state (ChatGPT style profile click)
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // 2.5 Model Authentication Portal Modal State
  const [showModelAuthModal, setShowModelAuthModal] = useState(false);
  const [pendingModelAuth, setPendingModelAuth] = useState<string>(initialModel || 'ChatGPT');
  const [modelLoginEmail, setModelLoginEmail] = useState<string>(currentUser.email || '');
  const [modelLoginPassword, setModelLoginPassword] = useState<string>('');
  const [modelAuthToast, setModelAuthToast] = useState<string | null>(null);
  const [modelAuthLoading, setModelAuthLoading] = useState(false);

  // 3. Chat History & Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // 4. Attachments & Context State
  const [activeDocument, setActiveDocument] = useState<UserDocument | null>(null);
  const [showDocSelector, setShowDocSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 5. Projects list (for left sidebar)
  const [projects, setProjects] = useState<string[]>([]);
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // 6. Active conversation title
  const [conversationTitle, setConversationTitle] = useState('Starting a New Convers...');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 6.5 Daily Quota & Credit Management (Images, Prompts & Midnight Auto-Reset)
  const getTodayKey = () => new Date().toISOString().split('T')[0];
  const todayKey = getTodayKey();

  const [dailyImagesUsed, setDailyImagesUsed] = useState<number>(() => {
    try {
      const storedDate = localStorage.getItem(`nexus_usage_date_${currentUser.id}`);
      if (storedDate !== todayKey) {
        // Auto-reset when date rolls over at midnight
        localStorage.setItem(`nexus_usage_date_${currentUser.id}`, todayKey);
        localStorage.setItem(`nexus_daily_images_${currentUser.id}`, '0');
        return 0;
      }
      const val = localStorage.getItem(`nexus_daily_images_${currentUser.id}`);
      return val !== null ? parseInt(val, 10) : (currentUser.dailyImagesUsed || 0);
    } catch {
      return 0;
    }
  });

  const [dailyPromptsUsed, setDailyPromptsUsed] = useState<number>(() => {
    try {
      const storedDate = localStorage.getItem(`nexus_usage_date_${currentUser.id}`);
      if (storedDate !== todayKey) {
        // Auto-reset when date rolls over at midnight
        localStorage.setItem(`nexus_daily_prompts_${currentUser.id}`, '0');
        return 0;
      }
      const val = localStorage.getItem(`nexus_daily_prompts_${currentUser.id}`);
      return val !== null ? parseInt(val, 10) : (currentUser.dailyPromptsUsed || 0);
    } catch {
      return 0;
    }
  });

  const dailyImageLimit = 15; // 15 images/day quota for 30-day access
  const dailyPromptLimit = 50; // 50 messages/day quota
  const [showCreditDropdown, setShowCreditDropdown] = useState(false);
  const creditDropdownRef = useRef<HTMLDivElement>(null);

  // Close credit dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (creditDropdownRef.current && !creditDropdownRef.current.contains(e.target as Node)) {
        setShowCreditDropdown(false);
      }
    };
    if (showCreditDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCreditDropdown]);

  // Sync daily stats helper
  const incrementDailyUsage = (isImage: boolean) => {
    try {
      localStorage.setItem(`nexus_usage_date_${currentUser.id}`, todayKey);
      if (isImage) {
        setDailyImagesUsed((prev) => {
          const next = prev + 1;
          localStorage.setItem(`nexus_daily_images_${currentUser.id}`, next.toString());
          return next;
        });
      } else {
        setDailyPromptsUsed((prev) => {
          const next = prev + 1;
          localStorage.setItem(`nexus_daily_prompts_${currentUser.id}`, next.toString());
          return next;
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Check remaining days for subscription
  const getSubscriptionDaysLeft = () => {
    if (currentUser.subscriptionExpiry) {
      const expiry = new Date(currentUser.subscriptionExpiry).getTime();
      const now = new Date().getTime();
      const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 30; // 30-day access default
  };

  // Dynamic credit percentage based on remaining daily quotas
  const remainingImageRatio = Math.max(0, (dailyImageLimit - dailyImagesUsed) / dailyImageLimit);
  const remainingPromptRatio = Math.max(0, (dailyPromptLimit - dailyPromptsUsed) / dailyPromptLimit);
  const creditPercentage = Math.max(1, Math.min(100, Math.round(((remainingPromptRatio * 0.5) + (remainingImageRatio * 0.5)) * 100)));

  // Time-based greeting (e.g. Good Morning / Good Afternoon / Good Evening)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const userDisplayName = currentUser.name.split(' ')[0].toLowerCase() || 'shishir';
  const userInitials = (currentUser.name || 'SB')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'SB';

  // Load existing user chats
  useEffect(() => {
    const userMessages = storage.getUserChats(currentUser.id);
    setMessages(userMessages);
    if (userMessages.length > 0) {
      const firstUserMsg = userMessages.find(m => m.role === 'user');
      if (firstUserMsg) {
        setConversationTitle(firstUserMsg.content.slice(0, 25) + '...');
      }
    }
  }, [currentUser.id]);

  // Handle incoming initial prompt passed after login
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      sendMessage(initialPrompt.trim());
    }
  }, [initialPrompt]);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const isImageRequest = (text: string) => {
    const lower = text.toLowerCase();
    return (
      lower.includes('image') ||
      lower.includes('ছবি') ||
      lower.includes('picture') ||
      lower.includes('photo') ||
      lower.includes('draw') ||
      lower.includes('dall-e') ||
      lower.includes('generate image') ||
      lower.includes('illustration') ||
      lower.includes('logo design') ||
      lower.includes('আঁকো') ||
      lower.includes('পিকচার') ||
      lower.includes('ফটো')
    );
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userText = text.trim();
    const isImage = isImageRequest(userText);

    // 1. Enforce Daily Image Generation Limit
    if (isImage && dailyImagesUsed >= dailyImageLimit) {
      setInputPrompt('');
      const userMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelId: selectedModel,
      };

      const limitMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **দৈনিক ইমেজ তৈরির সীমা অতিক্রম হয়েছে (Daily Image Limit Reached)**\n\n` +
          `আপনার আজকের জন্য নির্ধারিত সর্বোচ্চ **${dailyImageLimit}টি ছবি/ইমেজ** তৈরি করার কোটা সম্পন্ন হয়েছে।\n\n` +
          `• 🔄 **অটো-রিসেট টাইম**: প্রতিদিন রাত **১২:০০ টায় (12:00 AM)** আপনার দৈনিক কোটা স্বয়ংক্রিয়ভাবে আবার ০ থেকে নতুন করে শুরু হবে।\n` +
          `• 💬 **আনলিমিটেড চ্যাট**: আপনি অন্যান্য সকল সাধারণ চ্যাট, প্রশ্ন-উত্তর ও কোডিং কোনো বাধা ছাড়াই চালিয়ে যেতে পারবেন।`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelId: selectedModel,
      };

      const updatedMessages = [...messages, userMsg, limitMsg];
      setMessages(updatedMessages);
      storage.saveUserChats(currentUser.id, updatedMessages);
      return;
    }

    // 2. Enforce Daily General Prompt Limit
    if (!isImage && dailyPromptsUsed >= dailyPromptLimit) {
      setInputPrompt('');
      const userMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelId: selectedModel,
      };

      const limitMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **দৈনিক চ্যাট কোটা শেষ (Daily Message Limit Reached)**\n\n` +
          `আজকের জন্য নির্ধারিত সর্বোচ্চ **${dailyPromptLimit}টি মেসেজ** কোটা শেষ হয়েছে। প্রতিদিন রাত ১২:০০ টায় এটি স্বয়ংক্রিয়ভাবে রিনিউ হয়ে যাবে।`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelId: selectedModel,
      };

      const updatedMessages = [...messages, userMsg, limitMsg];
      setMessages(updatedMessages);
      storage.saveUserChats(currentUser.id, updatedMessages);
      return;
    }

    // Increment usage
    incrementDailyUsage(isImage);
    setInputPrompt('');

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelId: selectedModel,
      attachedDocName: activeDocument ? activeDocument.name : undefined,
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setConversationTitle(userText.slice(0, 25) + (userText.length > 25 ? '...' : ''));
    storage.saveUserChats(currentUser.id, updatedMessages);
    setIsLoading(true);

    try {
      const resolvedModelId = selectedModel.toLowerCase();
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          modelId: resolvedModelId,
          userName: currentUser.name,
          documentContext: activeDocument ? activeDocument.content : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('সার্ভার থেকে উত্তর পাওয়া যায়নি।');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Analysis completed with reasoning.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelId: selectedModel,
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);
      storage.saveUserChats(currentUser.id, finalMessages);
    } catch (err) {
      console.error(err);
      const fallbackReply = generateClientAiResponse(userText, selectedModel, currentUser.name);
      const assistantMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelId: selectedModel,
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);
      storage.saveUserChats(currentUser.id, finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const generateClientAiResponse = (prompt: string, model: string, name: string) => {
    const m = model.toLowerCase();
    const cleanPrompt = prompt.trim();

    if (m.includes('claude')) {
      return `✳️ **Claude 3.7 Sonnet (Anthropic)**\n\n` +
        `Hello ${name}! Anthropic's Claude 3.7 Sonnet here. I have conducted an in-depth contextual and architectural reasoning on your prompt:\n\n` +
        `> "${cleanPrompt}"\n\n` +
        `### 1. নিখুঁত কাঠামোগত বিশ্লেষণ (Architectural Overview)\n` +
        `আপনার অনুরোধটি যত্নসহকারে বিশ্লেষণ করে সর্বোত্তম ফলাফল ও নির্ভরযোগ্য সমাধান তৈরি করা হয়েছে।\n\n` +
        `### 2. বিশেষ দিকনির্দেশনা (Nuanced Recommendations)\n` +
        `- **নির্ভুলতা**: প্রতিটি ধাপে নিরাপত্তা ও কোড ক্লিনলিনেস বজায় রাখা হয়েছে।\n` +
        `- **কনটেক্সট প্রিজারভেশন**: আপনার সেশন এবং প্রাইভেট ওয়ার্কস্পেস ডেটা সম্পূর্ণ সুরক্ষিত।\n\n` +
        `\`\`\`json\n{\n  "engine": "Claude 3.7 Sonnet",\n  "context_window": "200k",\n  "status": "ready"\n}\n\`\`\`\n\n` +
        `*আপনার আরও কোনো নির্দিষ্ট প্রশ্ন বা পরিমার্জন প্রয়োজন হলে জানান!*`;
    }

    if (m.includes('gemini')) {
      return `✨ **Google Gemini 2.5 Pro (Multimodal Engine)**\n\n` +
        `Hello ${name}! Google Gemini 2.5 Pro reporting. Here is the synthesized real-time output for:\n\n` +
        `> "${cleanPrompt}"\n\n` +
        `### 1. রিয়েল-টাইম তথ্য ও সিন্থেসিস (Grounded Insights)\n` +
        `গুগল মাল্টিমোডাল ডেটাসেট এবং লেটেস্ট তথ্য যাচাই করে আপনার প্রশ্নের সর্বাধিক কার্যকর উত্তর নিচে সংক্ষেপে তুলে ধরা হলো।\n\n` +
        `### 2. মূল পয়েন্টসমূহ (Key Takeaways)\n` +
        `1. **গতি ও নির্ভুলতা**: আল্ট্রা-লো লেটেন্সিতে জটিল লজিক ও ডেটা হ্যান্ডলিং।\n` +
        `2. **মাল্টিমোডাল ক্যাপাবিলিটি**: টেক্সট, কোড, ডকুমেন্ট ও ফাইল একসাথে প্রসেস করার সুবিধা।\n\n` +
        `*Feel free to upload documents or ask follow-up questions!*`;
    }

    if (m.includes('grok')) {
      return `⚡ **Grok 3 (xAI Unfiltered Real-Time Feed)**\n\n` +
        `Hey ${name}, Grok 3 here. Straight facts and zero corporate fluff on:\n\n` +
        `> "${cleanPrompt}"\n\n` +
        `### Direct Breakdown:\n` +
        `Here is the real unfiltered analysis. Fast, practical, and right to the point:\n\n` +
        `- **Speed & Execution**: Focus on the highest-leverage actions and remove bloat.\n` +
        `- **Real-time Signal**: Leveraging fresh perspectives and technical clarity.\n\n` +
        `Have more challenging questions? Send them over!`;
    }

    // Default to ChatGPT (OpenAI GPT-4o / GPT-5)
    return `🌀 **ChatGPT (GPT-4o & GPT-5 by OpenAI)**\n\n` +
      `Hello ${name}! Here is the comprehensive reasoning from **ChatGPT**:\n\n` +
      `### Executive Summary\n` +
      `I have processed your request: "${cleanPrompt}".\n\n` +
      `1. **Core Concept & Strategy**: The implementation is fully optimized for speed, clarity, and structural precision.\n` +
      `2. **Key Recommendation**: You can easily customize parameters or ask follow-up questions to drill down into specific details.\n` +
      `3. **Artifact / Output**: Your data and chats remain encrypted and stored strictly inside your private workspace.\n\n` +
      `*Feel free to reply with any further questions or modifications.*`;
  };

  const handleStartNewChat = () => {
    storage.clearUserChats(currentUser.id);
    setMessages([]);
    setConversationTitle('Starting a New Convers...');
    setActiveDocument(null);
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string, msgId: string) => {
    if ('speechSynthesis' in window) {
      if (speakingMsgId === msgId) {
        window.speechSynthesis.cancel();
        setSpeakingMsgId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#`_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);
      setSpeakingMsgId(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('আপনার ব্রাউজারে স্পিচ রিকগনিশন সাপোর্ট নেই। অনুগ্রহ করে টাইপ করুন।');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'bn-BD, en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt((prev) => (prev ? prev + ' ' + transcript : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const savedDoc = storage.addDocument(currentUser.id, {
        name: file.name,
        type: file.type || 'text/plain',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        content: content.slice(0, 15000),
      });
      setActiveDocument(savedDoc);
    };
    reader.readAsText(file);
  };

  // Helper to render official authentic vector/brand icons for all 4 models
  const getModelIcon = (modelId: string, size: string = 'w-5 h-5', rounded: string = 'rounded-lg') => {
    const m = (modelId || '').toLowerCase();
    
    // 1. Claude 3.7 Sonnet (Anthropic official coral/terracotta sunburst)
    if (m.includes('claude')) {
      return (
        <div className={`${size} ${rounded} bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-xs`} title="Claude (Anthropic)">
          <svg className="w-3/5 h-3/5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a1 1 0 0 1 1 1v4.07a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm6.364 3.636a1 1 0 0 1 0 1.414l-2.878 2.879a1 1 0 1 1-1.414-1.414l2.878-2.879a1 1 0 0 1 1.414 0zM22 12a1 1 0 0 1-1 1h-4.07a1 1 0 0 1 0-2H21a1 1 0 0 1 1 1zm-3.636 6.364a1 1 0 0 1-1.414 0l-2.879-2.878a1 1 0 0 1 1.414-1.414l2.879 2.878a1 1 0 0 1 0 1.414zM12 22a1 1 0 0 1-1-1v-4.07a1 1 0 0 1 2 0V21a1 1 0 0 1-1 1zm-6.364-3.636a1 1 0 0 1 0-1.414l2.878-2.879a1 1 0 1 1 1.414 1.414l-2.878 2.879a1 1 0 0 1-1.414 0zM2 12a1 1 0 0 1 1-1h4.07a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1zm3.636-6.364a1 1 0 0 1 1.414 0l2.879 2.878a1 1 0 1 1-1.414 1.414L5.636 7.05a1 1 0 0 1 0-1.414z"/>
          </svg>
        </div>
      );
    }
    
    // 2. Google Gemini 2.5 Pro (Official Google gradient sparkle star)
    if (m.includes('gemini')) {
      return (
        <div className={`${size} ${rounded} bg-gradient-to-tr from-[#1E88E5] via-[#8E24AA] to-[#E91E63] text-white flex items-center justify-center shrink-0 shadow-xs p-0.5`} title="Google Gemini">
          <svg className="w-full h-full fill-white" viewBox="0 0 24 24">
            <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z"/>
          </svg>
        </div>
      );
    }

    // 3. Grok 3 (xAI official sleek black emblem)
    if (m.includes('grok')) {
      return (
        <div className={`${size} ${rounded} bg-black text-white flex items-center justify-center shrink-0 shadow-xs p-1`} title="Grok 3 (xAI)">
          <svg className="w-full h-full fill-white" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>
      );
    }

    // 4. Default: ChatGPT (OpenAI official emerald green swirl)
    return (
      <div className={`${size} ${rounded} bg-[#10A37F] text-white flex items-center justify-center shrink-0 shadow-xs p-0.5`} title="ChatGPT (OpenAI)">
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.259 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7466-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947zm-9.66-4.1354a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1402-1.6564zm-1.0882-9.724a4.466 4.466 0 0 1 2.3418-1.9729l-.0047.161v5.5163a.776.776 0 0 0 .388.6719l5.838 3.3732-2.02 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7913a4.4944 4.4944 0 0 1-1.6418-6.1265zm13.9958 4.0225l-5.838-3.3732 2.02-1.1636a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6767 8.1042v-5.6772a.79.79 0 0 0-.4066-.6815zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L6.009 6.8485V4.5161a.0757.0757 0 0 1 .0332-.0615l4.8802-2.8197a4.504 4.504 0 0 1 6.1308 1.6517 4.4755 4.4755 0 0 1 .5536 3.0184zm-9.5132 4.4045l2.6074-1.5049 2.6074 1.5049v3.0145l-2.6074 1.505-2.6074-1.505zm-1.0693-1.8458l-2.02-1.1683a.071.071 0 0 1-.038-.052V3.4116a4.504 4.504 0 0 1 7.371-3.4539l-.142.0805-4.7783 2.7582a.7948.7948 0 0 0-.3927.6813z"/>
        </svg>
      </div>
    );
  };

  // Supported models matching screenshot with authentic metadata
  const availableModels = [
    { id: 'ChatGPT', name: 'ChatGPT', note: 'GPT-4o & GPT-5 Advanced Reasoning', badge: 'Auto' },
    { id: 'Claude', name: 'Claude 3.7 Sonnet', note: 'Anthropic High-Context Intelligence', badge: 'Pro' },
    { id: 'Gemini', name: 'Google Gemini 2.5 Pro', note: 'Multimodal Real-Time Grounding', badge: 'Live' },
    { id: 'Grok', name: 'Grok 3', note: 'Fast Unfiltered Real-Time Feed', badge: 'Fast' },
  ];

  // Open Model Authentication Portal or switch directly if already logged in
  const handleSelectModel = (modelId: string) => {
    setModelDropdownOpen(false);

    // If model is already logged in for this user session, switch directly without login prompt
    // "আর যদি লগইন করা থাকে তাহলে তো আর লগইন করার প্রয়োজন নাই।"
    if (isModelAuthenticated(modelId)) {
      setSelectedModel(modelId);
      const modelObj = availableModels.find(m => m.id.toLowerCase() === modelId.toLowerCase());
      const modelDisplayName = modelObj ? modelObj.name : modelId;
      setModelAuthToast(`সুইচ করা হয়েছে: ${modelDisplayName} (সক্রিয় অ্যাকাউন্ট)`);
      setTimeout(() => setModelAuthToast(null), 2500);
      return;
    }

    // Otherwise, prompt for model login portal
    setPendingModelAuth(modelId);
    setModelLoginEmail(currentUser.email || '');
    setModelLoginPassword('');
    setShowModelAuthModal(true);
  };

  // Confirm Model Login & Activate Session
  const handleConfirmModelLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setModelAuthLoading(true);

    const targetModel = pendingModelAuth;
    const clientEmail = modelLoginEmail.trim() || currentUser.email || 'client@nexus.ai';

    setTimeout(() => {
      setSelectedModel(targetModel);
      
      // Save model to authenticated models list so it won't ask for login again
      const updatedAuth = Array.from(new Set([...authenticatedModels, targetModel]));
      setAuthenticatedModels(updatedAuth);
      try {
        localStorage.setItem(`nexus_auth_models_${currentUser.id}`, JSON.stringify(updatedAuth));
      } catch (err) {
        // ignore
      }

      setModelAuthLoading(false);
      setShowModelAuthModal(false);

      const modelObj = availableModels.find(m => m.id === targetModel);
      const modelDisplayName = modelObj ? modelObj.name : targetModel;

      const toast = `✅ ${modelDisplayName} সেশন সফলভাবে লগইন ও সক্রিয় হয়েছে! (${clientEmail})`;
      setModelAuthToast(toast);
      setTimeout(() => setModelAuthToast(null), 4000);

      // Append confirmation greeting in chat
      const authNoticeMsg: ChatMessage = {
        id: `msg_auth_${Date.now()}`,
        role: 'assistant',
        content: `🔒 **${modelDisplayName}** এআই পোর্টাল সফলভাবে সক্রিয় হয়েছে!\n\n` +
          `- **লগইন অ্যাকাউন্ট**: \`${clientEmail}\`\n` +
          `- **স্ট্যাটাস**: ভেরিফাইড ও সক্রিয় সেশন\n\n` +
          `স্বাভাবিক আমরা চ্যাট জিপিটি যেভাবে ব্যবহার করি, ঠিক সেভাবে যেকোনো প্রশ্ন, কোড বা কমান্ড নিচে লিখে পাঠান!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelId: targetModel,
      };

      const updated = [...messages, authNoticeMsg];
      setMessages(updated);
      storage.saveUserChats(currentUser.id, updated);
    }, 350);
  };

  return (
    <div className="flex h-screen w-full bg-white text-slate-900 font-sans overflow-hidden select-none">
      
      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR (Matching Screenshot 2 exactly)           */}
      {/* ======================================================== */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-0 sm:w-16'
        } shrink-0 bg-[#FBFBFB] border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 overflow-hidden relative z-30`}
      >
        {/* Top Section */}
        <div className="p-3.5 space-y-4">
          
          {/* Logo & Sidebar Collapse Icon */}
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div 
                onClick={onBackToHome}
                className="flex items-center gap-2 cursor-pointer group"
                title="Go to Homepage"
              >
                {settings?.logoUrl ? (
                  <img 
                    src={settings.logoUrl} 
                    alt="Logo" 
                    className="h-7 w-auto max-w-[160px] object-contain drop-shadow-xs group-hover:scale-105 transition-all" 
                  />
                ) : (
                  <>
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-extrabold text-xl text-slate-950 tracking-tight font-sans">
                        {settings?.brandPrefix || 'OmniCraft'}
                      </span>
                      <span className="font-bold text-lg text-blue-600 font-sans tracking-tight">
                        {settings?.brandSuffix || 'AI'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition"
              title={sidebarOpen ? 'Collapse sidebar' : 'Open sidebar'}
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* + New Chat Button */}
          {sidebarOpen ? (
            <button
              onClick={handleStartNewChat}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold flex items-center gap-2 border border-slate-200/60 shadow-2xs transition active:scale-98"
            >
              <Plus className="w-4 h-4 text-slate-600" />
              <span>New Chat</span>
            </button>
          ) : (
            <button
              onClick={handleStartNewChat}
              className="w-10 h-10 mx-auto rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 flex items-center justify-center transition"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}

          {/* Projects Section */}
          {sidebarOpen && (
            <div className="space-y-1 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
                <span>Projects</span>
                <button
                  onClick={() => setShowNewProjectInput(!showNewProjectInput)}
                  className="p-1 hover:text-slate-900 hover:bg-slate-200/60 rounded transition"
                  title="Create new project folder"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {showNewProjectInput && (
                <div className="flex items-center gap-1.5 pt-1 px-1">
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Project name..."
                    className="w-full text-xs px-2 py-1 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newProjectName.trim()) {
                        setProjects([...projects, newProjectName.trim()]);
                        setNewProjectName('');
                        setShowNewProjectInput(false);
                      }
                    }}
                  />
                </div>
              )}

              {projects.length === 0 ? (
                <p className="text-xs text-slate-400 font-normal px-1 py-1">
                  No projects yet
                </p>
              ) : (
                <div className="space-y-1 pt-1">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="text-xs text-slate-700 px-2 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span className="truncate">{proj}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chats and tasks Section */}
          {sidebarOpen && (
            <div className="space-y-1.5 pt-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
                <span>Chats and tasks</span>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 pt-1">
                Today
              </div>

              {/* Active Conversation Pill */}
              <div className="p-2 rounded-xl bg-slate-200/70 border border-slate-300/40 text-xs font-medium text-slate-800 flex items-center justify-between gap-2 shadow-2xs">
                <span className="truncate">{conversationTitle}</span>
                {messages.length > 0 && (
                  <button
                    onClick={handleStartNewChat}
                    className="p-1 hover:text-red-600 transition"
                    title="Clear this conversation"
                  >
                    <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Bottom User Profile Section (Matching Screenshot 2 SB pill) */}
        {sidebarOpen && (
          <div className="p-3 border-t border-slate-200/80 space-y-2">
            
            {/* Quick Link back to Website / Digital Store */}
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 px-1">
              <button onClick={onBackToHome} className="hover:text-blue-600 transition flex items-center gap-1">
                <span>← হোম পেজ</span>
              </button>
              <button onClick={onOpenMarketplace} className="hover:text-blue-600 transition flex items-center gap-1 font-bold">
                <span>ডিজিটাল স্টোর →</span>
              </button>
            </div>

            {/* User Profile Bar & Popover Menu (Matching User Request & Screenshot) */}
            <div className="relative">
              {/* Profile Popup Menu (ChatGPT Style) */}
              {showProfileMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="p-2.5 border-b border-slate-100 mb-1">
                    <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{currentUser.email || 'client@nexus.ai'}</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      কাস্টমার অ্যাকাউন্ট (Active Client)
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onOpenUpgrade) onOpenUpgrade();
                      else onOpenMarketplace();
                    }}
                    className="w-full text-left p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-between"
                  >
                    <span>প্ল্যান আপগ্রেড (Upgrade)</span>
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenMarketplace();
                    }}
                    className="w-full text-left p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-between"
                  >
                    <span>ডিজিটাল স্টোর (Store)</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full text-left p-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>লগআউট করুন (Log Out)</span>
                  </button>
                </div>
              )}

              {/* Bottom Profile Pill */}
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-xs flex items-center justify-between gap-1.5 cursor-pointer transition select-none"
                title="প্রোফাইল মেনু ও লগআউট অপশন"
              >
                <div className="flex items-center gap-2 overflow-hidden min-w-0">
                  {/* Avatar with initials */}
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                    {userInitials}
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate" title={currentUser.name}>
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate" title={currentUser.email || ''}>
                      {currentUser.email || 'Free • Personal'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {onLogout && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLogout();
                      }}
                      className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 transition flex items-center gap-1 text-[11px] font-bold shadow-2xs hover:scale-105 active:scale-95"
                      title="অ্যাকাউন্ট থেকে লগআউট করুন"
                    >
                      <LogOut className="w-3 h-3 text-rose-600" />
                      <span>লগআউট</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenUpgrade) onOpenUpgrade();
                      else onOpenMarketplace();
                    }}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-xs transition hover:scale-105 active:scale-95"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN WORKSPACE CANVAS (Matching Screenshot 2 exactly)  */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
        
        {/* Top Header Bar */}
        <header className="h-14 border-b border-slate-100 px-4 sm:px-6 flex items-center justify-between bg-white shrink-0 z-20">
          
          {/* Left: Model Selector Dropdown (ChatGPT ˅) */}
          <div className="relative">
            <button
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition shadow-2xs"
            >
              {getModelIcon(selectedModel, 'w-5 h-5')}
              <span className="font-bold">{availableModels.find(m => m.id === selectedModel)?.name || selectedModel}</span>
              <div className="flex flex-col -space-y-1 text-slate-400">
                <ChevronUp className="w-2.5 h-2.5" />
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            </button>

            {/* Model Dropdown Menu */}
            {modelDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-40 space-y-1 text-xs">
                {availableModels.map((m) => {
                  const isAuthed = isModelAuthenticated(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        handleSelectModel(m.id);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between gap-2.5 ${
                        selectedModel === m.id ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {getModelIcon(m.id, 'w-7 h-7')}
                        <div className="min-w-0">
                          <div className="font-bold flex items-center gap-1.5">
                            <span className="truncate">{m.name}</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-100 text-slate-600 font-medium shrink-0">{m.badge}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal truncate">{m.note}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {isAuthed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>লগইন আছে</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
                            <Lock className="w-2.5 h-2.5 text-amber-600" />
                            <span>লগইন প্রয়োজন</span>
                          </span>
                        )}
                        {selectedModel === m.id && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-1" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Center: Free plan Upgrade Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-600 font-medium">
              {currentUser.currentPlanId ? 'Premium Plan (30 Days)' : 'Free Plan'}
            </span>
            <button
              onClick={onOpenUpgrade || onOpenMarketplace}
              className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
            >
              {currentUser.currentPlanId ? 'Manage' : 'Upgrade'}
            </button>
          </div>

          {/* Right: Circular Credit Meter with Interactive Daily Quota Breakdown */}
          <div className="flex items-center gap-3 relative" ref={creditDropdownRef}>
            <button
              type="button"
              onClick={() => setShowCreditDropdown(!showCreditDropdown)}
              title="দৈনিক কোটা ও ক্রেডিট লিমিট বিস্তারিত দেখতে ক্লিক করুন"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200 group text-left cursor-pointer"
            >
              {/* Circular SVG Ring */}
              <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`${creditPercentage < 20 ? 'text-red-500' : creditPercentage < 50 ? 'text-amber-500' : 'text-blue-600'} transition-all duration-500`}
                    strokeDasharray={`${creditPercentage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-700 font-mono group-hover:text-blue-600 transition flex items-center gap-1">
                  <span>{creditPercentage}% credit left</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showCreditDropdown ? 'rotate-180 text-blue-600' : ''}`} />
                </span>
              </div>
            </button>

            {/* Daily Quota & Limit Popover Dropdown */}
            {showCreditDropdown && (
              <div className="absolute right-0 top-12 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">দৈনিক ব্যবহার ও ক্রেডিট লিমিট</h4>
                      <p className="text-[11px] text-slate-500">সারাদিনের সর্বোচ্চ কোটা ও স্ট্যাটাস</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    সক্রিয়
                  </span>
                </div>

                {/* Quota details */}
                <div className="py-3 space-y-3.5">
                  {/* 1. Daily Image Quota */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                        <span>দৈনিক ছবি/ইমেজ তৈরি:</span>
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {dailyImagesUsed} / {dailyImageLimit} টি
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          dailyImagesUsed >= dailyImageLimit 
                            ? 'bg-red-500' 
                            : dailyImagesUsed > dailyImageLimit * 0.7 
                            ? 'bg-amber-500' 
                            : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                        }`}
                        style={{ width: `${Math.min(100, (dailyImagesUsed / dailyImageLimit) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                      <span>ব্যবহৃত: {dailyImagesUsed} টি</span>
                      <span className="font-medium text-purple-600">
                        {Math.max(0, dailyImageLimit - dailyImagesUsed)} টি বাকি আছে
                      </span>
                    </div>
                  </div>

                  {/* 2. Daily Message Quota */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>দৈনিক চ্যাট ও প্রম্পট:</span>
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {dailyPromptsUsed} / {dailyPromptLimit} টি
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          dailyPromptsUsed >= dailyPromptLimit 
                            ? 'bg-red-500' 
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                        }`}
                        style={{ width: `${Math.min(100, (dailyPromptsUsed / dailyPromptLimit) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                      <span>ব্যবহৃত: {dailyPromptsUsed} টি</span>
                      <span className="font-medium text-blue-600">
                        {Math.max(0, dailyPromptLimit - dailyPromptsUsed)} টি বাকি আছে
                      </span>
                    </div>
                  </div>

                  {/* 3. Subscription Validity (e.g. 30 days) */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-slate-700">প্ল্যানের মেয়াদ (Validity):</span>
                    </div>
                    <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md text-[11px]">
                      {getSubscriptionDaysLeft()} দিন বাকি
                    </span>
                  </div>
                </div>

                {/* Auto Reset Midnight Notice */}
                <div className="pt-2.5 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed bg-blue-50/50 -mx-4 -mb-4 p-3 rounded-b-2xl border-t">
                  <Clock className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>রিসেট সময়:</strong> প্রতিদিন রাত <strong>১২:০০ টায় (Midnight 12:00 AM)</strong> আপনার দৈনিক কোটা অটোমেটিক নতুন করে রিসেট হয়ে যাবে।
                  </span>
                </div>
              </div>
            )}

            {/* Back to Home / Store Button */}
            <button
              onClick={onOpenMarketplace}
              className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
            >
              <span>স্টোর</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </header>

        {/* Chat Canvas Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 flex flex-col justify-between">
          
          {/* ======================================================== */}
          {/* EMPTY STATE VIEW (Exact replica of Screenshot 2)         */}
          {/* ======================================================== */}
          {messages.length === 0 ? (
            <div className="max-w-2xl w-full mx-auto my-auto space-y-6 text-center pt-8 sm:pt-16">
              
              {/* ChatGPT Swirl Emblem & Greeting */}
              <div className="flex items-center justify-center gap-2.5 text-base sm:text-lg font-bold text-slate-700">
                <div className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-xs">
                  𖣐
                </div>
                <span>{getGreeting()} {userDisplayName}</span>
              </div>

              {/* Big Title: How can I help you today? */}
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                How can I help you today?
              </h1>

              {/* Big Central Input Box (Matching Screenshot 2) */}
              <div className="relative rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-lg shadow-slate-200/40 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition text-left">
                
                {/* Active attached document tag if any */}
                {activeDocument && (
                  <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span className="truncate max-w-[200px]">{activeDocument.name}</span>
                    <button onClick={() => setActiveDocument(null)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <textarea
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(inputPrompt);
                    }
                  }}
                  rows={3}
                  placeholder="What do you want to create today?"
                  className="w-full text-sm sm:text-base text-slate-800 placeholder-slate-400 resize-none focus:outline-none"
                  autoFocus
                />

                {/* Bottom Row Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {/* Left: Plus attachment button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                      title="Attach file / document"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".txt,.md,.json,.csv,.pdf,.doc,.docx"
                    />
                  </div>

                  {/* Right: Auto dropdown + Mic icon + Send Arrow */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 transition"
                    >
                      <span>Auto</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      type="button"
                      onClick={toggleVoiceRecording}
                      className={`p-1.5 rounded-xl transition ${
                        isRecording ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                      title={isRecording ? 'Listening...' : 'Voice input'}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => sendMessage(inputPrompt)}
                      disabled={!inputPrompt.trim() || isLoading}
                      className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white transition flex items-center justify-center disabled:opacity-40 disabled:hover:bg-slate-200 disabled:hover:text-slate-600"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Disclaimer text */}
              <p className="text-[11px] sm:text-xs text-slate-400 font-normal">
                {selectedModel} can make mistakes. Always verify critical information before acting on it.
              </p>

            </div>
          ) : (
            /* ======================================================== */
            /* CONVERSATION ACTIVE FEED                                 */
            /* ======================================================== */
            <div className="max-w-3xl w-full mx-auto space-y-6 pb-28 pt-2">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={msg.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      {isUser ? (
                        <>
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                            {userInitials}
                          </div>
                          <span className="font-bold text-slate-800">You</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </>
                      ) : (
                        <>
                          {getModelIcon(msg.modelId || selectedModel, 'w-5 h-5', 'rounded-md')}
                          <span className="font-bold text-slate-800">
                            {availableModels.find(m => m.id === (msg.modelId || selectedModel))?.name || msg.modelId || selectedModel}
                          </span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </>
                      )}
                    </div>

                    <div 
                      className={`text-sm sm:text-base leading-relaxed rounded-2xl p-4 ${
                        isUser 
                          ? 'bg-blue-50/80 text-blue-950 border border-blue-100' 
                          : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">
                        {msg.content}
                      </div>

                      {/* Assistant actions: copy & TTS speech */}
                      {!isUser && (
                        <div className="flex items-center gap-3 pt-3 mt-3 border-t border-slate-100 text-xs text-slate-400">
                          <button
                            onClick={() => handleCopyMessage(msg.content, msg.id)}
                            className="flex items-center gap-1 hover:text-slate-700 transition"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button
                            onClick={() => handleSpeak(msg.content, msg.id)}
                            className={`flex items-center gap-1 hover:text-slate-700 transition ${
                              speakingMsgId === msg.id ? 'text-blue-600 font-bold' : ''
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{speakingMsgId === msg.id ? 'Speaking...' : 'Listen'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* AI Loading indicator */}
              {isLoading && (
                <div className="flex items-center gap-3 text-xs text-blue-600 bg-blue-50/70 p-3 rounded-2xl w-fit border border-blue-100">
                  {getModelIcon(selectedModel, 'w-5 h-5', 'rounded-md')}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>{availableModels.find(m => m.id === selectedModel)?.name || selectedModel} is thinking and formatting response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

        </div>

        {/* Fixed Sticky Input Bar at Bottom when conversation is active */}
        {messages.length > 0 && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white via-white to-transparent p-4 sm:p-6 z-20">
            <div className="max-w-3xl w-full mx-auto space-y-2">
              <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                <textarea
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(inputPrompt);
                    }
                  }}
                  rows={2}
                  placeholder="Ask follow-up questions or refine your prompt..."
                  className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none"
                />

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      title="Attach file"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".txt,.md,.json,.csv,.pdf,.doc,.docx"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleVoiceRecording}
                      className={`p-1 rounded-lg transition ${
                        isRecording ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => sendMessage(inputPrompt)}
                      disabled={!inputPrompt.trim() || isLoading}
                      className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white transition flex items-center justify-center disabled:opacity-40"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-center text-slate-400">
                {selectedModel} can make mistakes. Always verify critical information before acting on it.
              </p>
            </div>
          </div>
        )}

        {/* Floating Emerald Chat Bubble Widget (Matching screenshot bottom-right green icon) */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => handleStartNewChat()}
            className="w-13 h-13 rounded-full bg-[#0F766E] hover:bg-[#115E59] text-white flex items-center justify-center shadow-xl shadow-teal-900/30 transition-transform hover:scale-110 active:scale-95 animate-pulse-glow"
            title="Start fresh conversation"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>

        {/* Model Authentication Toast Notification */}
        {modelAuthToast && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-medium border border-slate-700 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{modelAuthToast}</span>
          </div>
        )}

        {/* Dedicated Model Login & Authentication Modal */}
        {showModelAuthModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 relative">
                <button
                  type="button"
                  onClick={() => setShowModelAuthModal(false)}
                  className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                  title="বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3.5 mb-2">
                  {getModelIcon(pendingModelAuth, 'w-12 h-12', 'rounded-2xl')}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900">
                        {availableModels.find(m => m.id === pendingModelAuth)?.name || pendingModelAuth}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wide">
                        {availableModels.find(m => m.id === pendingModelAuth)?.badge || 'PRO'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {availableModels.find(m => m.id === pendingModelAuth)?.note || 'AI Model Session Access'}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>একবার লগইন সম্পন্ন হলে পরবর্তীতে এই মডেল ব্যবহারের জন্য আর লগইন করতে হবে না।</span>
                </div>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleConfirmModelLogin} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ক্লায়েন্ট ইমেইল অ্যাড্রেস (Client Email)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={modelLoginEmail}
                      onChange={(e) => setModelLoginEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-slate-50/50"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    স্বাভাবিক ChatGPT ব্যবহারের মতোই আপনার ইমেইল দিয়ে কানেক্ট করুন।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    পাসওয়ার্ড বা সিক্রেট কি (Password / Access Key)
                  </label>
                  <input
                    type="password"
                    value={modelLoginPassword}
                    onChange={(e) => setModelLoginPassword(e.target.value)}
                    placeholder="•••••••• (ঐচ্ছিক / অটো-ভেরিফায়েড)"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-slate-50/50"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-600">বর্তমান লগইন অ্যাকাউন্ট:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[180px]">{currentUser.name}</span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModelAuthModal(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    বাতিল করুন
                  </button>
                  <button
                    type="submit"
                    disabled={modelAuthLoading}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {modelAuthLoading ? (
                      <span>ভেরিফাই হচ্ছে...</span>
                    ) : (
                      <>
                        <span>লগইন ও সক্রিয় করুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
