import React, { useState } from 'react';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  DollarSign, 
  Users, 
  CreditCard, 
  TrendingUp, 
  ShieldCheck, 
  Bot, 
  Globe, 
  Lock, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Smartphone,
  Save,
  Search,
  ArrowRight,
  RefreshCw,
  Calendar,
  KeyRound,
  FileText,
  Percent,
  BookOpen,
  Layers,
  Zap,
  Copy,
  Eye,
  Sliders,
  Download,
  Activity,
  Server,
  Languages,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  UserPlus,
  ArrowUpRight,
  Image as ImageIcon,
  Upload,
  Link2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  AISubscriptionPlan, 
  PaymentOrder, 
  User, 
  SystemSettings,
  ProductCategory,
  ResellerClientSale,
  UserRole
} from '../types';
import { storage } from '../services/storage';
import { pixel } from '../services/pixel';
import { UserAvatar } from './UserAvatar';
import { SubscriptionOperationsGuide } from './SubscriptionOperationsGuide';

interface SuperAdminViewProps {
  plans: AISubscriptionPlan[];
  orders: PaymentOrder[];
  users: User[];
  settings: SystemSettings;
  activationLinks?: any[];
  onRefreshData: () => void;
  onOpenGuides: () => void;
}

const SERVICE_PRESETS = [
  {
    label: 'ChatGPT',
    name: 'ChatGPT Plus Dedicated Seat',
    provider: 'OpenAI',
    category: 'AI & Education Tools',
    iconName: 'chatgpt',
    badge: 'POPULAR',
    directDomainUrl: 'https://chatgpt.com',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    color: '#10A37F'
  },
  {
    label: 'Claude',
    name: 'Claude 3.7 Sonnet Dedicated',
    provider: 'Anthropic',
    category: 'AI & Education Tools',
    iconName: 'claude',
    badge: 'HOT',
    directDomainUrl: 'https://claude.ai',
    imageUrl: 'https://anthropic.com/images/icons/apple-touch-icon.png',
    color: '#D97706'
  },
  {
    label: 'Google Gemini',
    name: 'Gemini Advance (AI Pro)',
    provider: 'Google',
    category: 'AI & Education Tools',
    iconName: 'gemini',
    badge: 'PRO',
    directDomainUrl: 'https://gemini.google.com',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
    color: '#4285F4'
  },
  {
    label: 'Canva Pro',
    name: 'Canva Pro Premium Lifetime/Monthly',
    provider: 'Other',
    category: 'Editing Tools',
    iconName: 'canva',
    badge: 'BESTSELLER',
    directDomainUrl: 'https://canva.com',
    imageUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-canva-3521344-2944747.png',
    color: '#00C4CC'
  },
  {
    label: 'CapCut Pro',
    name: 'CapCut Pro Premium Video Suite',
    provider: 'Other',
    category: 'Editing Tools',
    iconName: 'capcut',
    badge: 'TRENDING',
    directDomainUrl: 'https://capcut.com',
    imageUrl: 'https://cdn.worldvectorlogo.com/logos/capcut-icon.svg',
    color: '#111827'
  },
  {
    label: 'Midjourney',
    name: 'Midjourney v6 Dedicated',
    provider: 'Midjourney',
    category: 'AI & Education Tools',
    iconName: 'midjourney',
    badge: 'AI ART',
    directDomainUrl: 'https://midjourney.com',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
    color: '#7C3AED'
  },
  {
    label: 'Adobe CC',
    name: 'Adobe Creative Cloud All Apps',
    provider: 'Adobe',
    category: 'Editing Tools',
    iconName: 'adobe',
    badge: 'ALL APPS',
    directDomainUrl: 'https://adobe.com',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg',
    color: '#FA0F00'
  },
  {
    label: 'Netflix 4K',
    name: 'Netflix Premium 4K UHD Profile',
    provider: 'Netflix',
    category: 'OTT & Streaming',
    iconName: 'netflix',
    badge: '4K ULTRA',
    directDomainUrl: 'https://netflix.com',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    color: '#E50914'
  },
  {
    label: 'Prime Video',
    name: 'Amazon Prime Video Profile',
    provider: 'Other',
    category: 'OTT & Streaming',
    iconName: 'prime',
    badge: 'HD OTT',
    directDomainUrl: 'https://primevideo.com',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png',
    color: '#00A8E1'
  },
  {
    label: 'Windows 11',
    name: 'Windows 11 Pro Genuine Key',
    provider: 'Microsoft',
    category: 'Windows',
    iconName: 'windows',
    badge: 'GENUINE',
    directDomainUrl: 'https://microsoft.com',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg',
    color: '#0078D7'
  },
  {
    label: 'Office 365',
    name: 'Microsoft Office 365 Subscription',
    provider: 'Microsoft',
    category: 'Microsoft Office',
    iconName: 'office',
    badge: 'OFFICE PRO',
    directDomainUrl: 'https://office.com',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg',
    color: '#EA3E23'
  },
];

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  plans,
  orders,
  users,
  settings,
  activationLinks = [],
  onRefreshData,
  onOpenGuides,
}) => {
  // 1. Language Toggle State: English / Bengali
  const [lang, setLang] = useState<'bn' | 'en'>('bn');

  // 2. Active Tab State
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'branding' | 'plans' | 'ai_assets' | 'orders' | 'users' | 'resellers' | 'gateways' | 'facebook_pixel' | 'ai_activation' | 'features' | 'security' | 'instructions'
  >('analytics');

  // AI & Services Media Assets Manager State
  const [mediaPlanSearch, setMediaPlanSearch] = useState('');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<string>('all');
  const [planImageDrafts, setPlanImageDrafts] = useState<Record<string, string>>({});

  // Curated Official Transparent SVG / High-Res Logos for 1-Click Assignment
  const OFFICIAL_SERVICE_LOGOS: Record<string, string> = {
    'chatgpt': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    'claude': 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Claude_AI_logo.svg',
    'gemini': 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
    'grok': 'https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png',
    'canva': 'https://cdn.worldvectorlogo.com/logos/canva-icon.svg',
    'capcut': 'https://cdn.worldvectorlogo.com/logos/capcut-icon.svg',
    'midjourney': 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
    'netflix': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    'windows': 'https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg',
    'office': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg',
    'prime': 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg',
    'adobe': 'https://upload.wikimedia.org/wikipedia/commons/5/55/Adobe_Experience_Cloud_logo.svg',
    'quillbot': 'https://quillbot.com/favicon.ico',
    'elevenlabs': 'https://elevenlabs.io/favicon.ico',
    'idm': 'https://www.internetdownloadmanager.com/favicon.ico',
    'googledrive': 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg'
  };

  const getOfficialLogoForPlan = (p: AISubscriptionPlan): string => {
    const text = `${p.id} ${p.name} ${p.provider} ${p.iconName}`.toLowerCase();
    for (const [key, url] of Object.entries(OFFICIAL_SERVICE_LOGOS)) {
      if (text.includes(key)) return url;
    }
    return 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg';
  };

  // Search and Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'super_admin' | 'reseller' | 'user'>('all');
  const [planCategoryFilter, setPlanCategoryFilter] = useState<string>('all');
  const [planSearch, setPlanSearch] = useState('');
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reseller sales data
  const [resellerSales, setResellerSales] = useState<ResellerClientSale[]>(storage.getResellerSales());

  // Plan Modal Form State
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState<{
    name: string;
    provider: any;
    category: ProductCategory;
    description: string;
    badge: string;
    priceBDT: number;
    priceUSD: number;
    originalPriceBDT: number;
    billingCycle: any;
    featuresText: string;
    accessType: any;
    directDomainUrl: string;
    defaultModelId: string;
    availableSeats: number;
    imageUrl: string;
    iconName: string;
  }>({
    name: '',
    provider: 'OpenAI',
    category: 'AI & Education Tools',
    description: '',
    badge: '',
    priceBDT: 499,
    priceUSD: 4.99,
    originalPriceBDT: 2000,
    billingCycle: 'monthly',
    featuresText: 'GPT-4o Full Access\nIn-App Workspace Chat\n100% Private Data Isolation',
    accessType: 'in_app_chat',
    directDomainUrl: 'https://chatgpt.com',
    defaultModelId: 'chatgpt-4o',
    availableSeats: 50,
    imageUrl: '',
    iconName: 'Sparkles',
  });

  // Comprehensive Whitelabel & System Settings Form State
  const [brandingForm, setBrandingForm] = useState<SystemSettings>({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // One-Time AI Activation Links & Master Keys State
  const [linksList, setLinksList] = useState<any[]>(activationLinks || []);
  const [newLinkService, setNewLinkService] = useState<'gemini' | 'chatgpt' | 'claude' | 'grok' | 'all_in_one'>('gemini');
  const [newLinkDays, setNewLinkDays] = useState<number>(30);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [justGeneratedLink, setJustGeneratedLink] = useState<string | null>(null);
  const [savingMasterKeys, setSavingMasterKeys] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<number | null>(null);

  // User Grant Plan State
  const [selectedUserForGrant, setSelectedUserForGrant] = useState<string | null>(null);
  const [planToGrant, setPlanToGrant] = useState<string>(plans[0]?.id || '');
  const [grantDays, setGrantDays] = useState<number>(30);

  // Create User Modal State
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState<{
    name: string;
    email: string;
    phone: string;
    role: UserRole;
  }>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
  });

  // Top Up Reseller Balance State
  const [selectedResellerForTopup, setSelectedResellerForTopup] = useState<string | null>(null);
  const [topupAmountBDT, setTopupAmountBDT] = useState<number>(5000);

  // Receipt Preview State
  const [previewOrder, setPreviewOrder] = useState<PaymentOrder | null>(null);

  // Analytics Calculations
  const approvedOrders = orders.filter(o => o.status === 'approved');
  const totalRevenueBDT = approvedOrders.reduce((sum, o) => sum + o.amountBDT, 0);
  const totalRevenueUSD = approvedOrders.reduce((sum, o) => sum + (o.amountUSD || o.amountBDT / (settings.bdtToUsdRate || 122)), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const totalSubscribers = users.filter(u => u.currentPlanId).length;
  const totalSeatsSold = plans.reduce((sum, p) => sum + (p.totalSold || 0), 0);
  const resellersList = users.filter(u => u.role === 'reseller');

  // Handle Save Plan
  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const features = planForm.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    if (editingPlanId) {
      const existing = plans.find(p => p.id === editingPlanId);
      if (existing) {
        const updated: AISubscriptionPlan = {
          ...existing,
          name: planForm.name,
          provider: planForm.provider,
          category: planForm.category,
          description: planForm.description,
          badge: planForm.badge || undefined,
          priceBDT: Number(planForm.priceBDT),
          priceUSD: Number(planForm.priceUSD),
          originalPriceBDT: Number(planForm.originalPriceBDT),
          billingCycle: planForm.billingCycle,
          features,
          accessType: planForm.accessType,
          directDomainUrl: planForm.directDomainUrl,
          defaultModelId: planForm.defaultModelId,
          availableSeats: Number(planForm.availableSeats),
          imageUrl: planForm.imageUrl || undefined,
          iconName: planForm.iconName || 'Sparkles',
        };
        storage.updatePlan(updated);
        showToast(lang === 'bn' ? 'সাবস্ক্রিপশন প্ল্যান আপডেট করা হয়েছে!' : 'Subscription plan updated successfully!');
      }
    } else {
      const newPlan: AISubscriptionPlan = {
        id: `plan_${Date.now()}`,
        name: planForm.name,
        provider: planForm.provider,
        category: planForm.category,
        description: planForm.description,
        iconName: planForm.iconName || 'Sparkles',
        imageUrl: planForm.imageUrl || undefined,
        badge: planForm.badge || undefined,
        priceBDT: Number(planForm.priceBDT),
        priceUSD: Number(planForm.priceUSD),
        originalPriceBDT: Number(planForm.originalPriceBDT),
        billingCycle: planForm.billingCycle,
        features,
        accessType: planForm.accessType,
        directDomainUrl: planForm.directDomainUrl,
        defaultModelId: planForm.defaultModelId,
        availableSeats: Number(planForm.availableSeats),
        totalSold: 0,
        isActive: true,
      };
      storage.createPlan(newPlan);
      showToast(lang === 'bn' ? 'নতুন সাবস্ক্রিপশন প্ল্যান যোগ করা হয়েছে!' : 'New subscription plan created!');
    }

    setShowPlanModal(false);
    onRefreshData();
  };

  const handleEditPlan = (plan: AISubscriptionPlan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      name: plan.name,
      provider: plan.provider as any,
      category: plan.category as any,
      description: plan.description,
      badge: plan.badge || '',
      priceBDT: plan.priceBDT,
      priceUSD: plan.priceUSD,
      originalPriceBDT: plan.originalPriceBDT,
      billingCycle: plan.billingCycle as any,
      featuresText: plan.features.join('\n'),
      accessType: plan.accessType as any,
      directDomainUrl: plan.directDomainUrl,
      defaultModelId: plan.defaultModelId,
      availableSeats: plan.availableSeats,
      imageUrl: plan.imageUrl || '',
      iconName: plan.iconName || 'Sparkles',
    });
    setShowPlanModal(true);
  };

  const handleDuplicatePlan = (plan: AISubscriptionPlan) => {
    const duplicated: AISubscriptionPlan = {
      ...plan,
      id: `plan_${Date.now()}`,
      name: `${plan.name} (Copy)`,
      totalSold: 0,
    };
    storage.createPlan(duplicated);
    onRefreshData();
    showToast(lang === 'bn' ? 'প্ল্যান কপি তৈরি করা হয়েছে!' : 'Plan duplicated successfully!');
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm(lang === 'bn' ? 'আপনি কি এই এআই সাবস্ক্রিপশনটি স্থায়ীভাবে মুছে ফেলতে চান?' : 'Are you sure you want to delete this subscription?')) {
      storage.deletePlan(planId);
      onRefreshData();
      showToast(lang === 'bn' ? 'প্ল্যান মুছে ফেলা হয়েছে!' : 'Plan deleted successfully!');
    }
  };

  const handleTogglePlanStatus = (plan: AISubscriptionPlan) => {
    storage.updatePlan({ ...plan, isActive: !plan.isActive });
    onRefreshData();
    showToast(plan.isActive ? (lang === 'bn' ? 'প্ল্যান নিষ্ক্রিয় করা হয়েছে' : 'Plan disabled') : (lang === 'bn' ? 'প্ল্যান সক্রিয় করা হয়েছে' : 'Plan activated'));
  };

  const handleApproveOrder = (orderId: string) => {
    storage.updateOrderStatus(orderId, 'approved');
    onRefreshData();
    showToast(lang === 'bn' ? 'অর্ডার অনুমোদিত ও অ্যাক্টিভেশন কি ইস্যু করা হয়েছে!' : 'Order approved & license key generated!');
  };

  const handleRejectOrder = (orderId: string) => {
    storage.updateOrderStatus(orderId, 'rejected');
    onRefreshData();
    showToast(lang === 'bn' ? 'অর্ডার বাতিল করা হয়েছে' : 'Order rejected');
  };

  const handleGrantPlanToUser = (userId: string) => {
    if (!planToGrant) return;
    const targetPlan = plans.find(p => p.id === planToGrant);
    if (!targetPlan) return;

    const seatKey = 'ADM-VIP-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const allUsers = storage.getUsers();
    const uIndex = allUsers.findIndex(u => u.id === userId);
    if (uIndex !== -1) {
      const exp = new Date();
      exp.setDate(exp.getDate() + grantDays);
      allUsers[uIndex].currentPlanId = targetPlan.id;
      allUsers[uIndex].subscriptionStartDate = new Date().toISOString().split('T')[0];
      allUsers[uIndex].subscriptionExpiry = exp.toISOString().split('T')[0];
      allUsers[uIndex].activeSeatKey = seatKey;
      allUsers[uIndex].maxTokens = Math.max(allUsers[uIndex].maxTokens || 0, 100000) + (targetPlan.priceBDT * 1000);
      storage.saveUsers(allUsers);
    }

    setSelectedUserForGrant(null);
    onRefreshData();
    showToast(lang === 'bn' ? 'ইউজারকে সফলভাবে সাবস্ক্রিপশন প্রদান করা হয়েছে!' : 'Plan granted to user successfully!');
  };

  const handleExtendUserValidity = (userId: string, days: number) => {
    storage.extendSubscription(userId, days);
    onRefreshData();
    showToast(lang === 'bn' ? `মেয়াদকাল ${days} দিন বৃদ্ধি করা হয়েছে!` : `Validity extended by ${days} days!`);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(lang === 'bn' ? `আপনি কি নিশ্চিত যে ইউজার "${userName}" অ্যাকাউন্টটি স্থায়ীভাবে মুছে ফেলতে চান?` : `Are you sure you want to permanently delete user "${userName}"?`)) {
      storage.deleteUser(userId);
      onRefreshData();
      showToast(lang === 'bn' ? `ইউজার "${userName}" সফলভাবে মুছে ফেলা হয়েছে!` : `User "${userName}" deleted successfully!`);
    }
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    storage.updateUser(editingUser);
    setEditingUser(null);
    onRefreshData();
    showToast(lang === 'bn' ? `ইউজার "${editingUser.name}" সফলভাবে আপডেট করা হয়েছে!` : `User "${editingUser.name}" updated successfully!`);
  };

  const handleSaveBrandingAndSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveSettings(brandingForm);
    setSettingsSaved(true);
    onRefreshData();
    showToast(lang === 'bn' ? 'প্ল্যাটফর্মের নাম, ব্র্যান্ডিং ও সকল ফিচার সেটিংস সফলভাবে সেভ করা হয়েছে!' : 'Branding and system settings saved successfully!');
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleGenerateActivationLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGeneratingLink(true);
    try {
      const res = await fetch('/api/admin/generate-activation-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          service_type: newLinkService,
          validity_days: newLinkDays,
        }),
      });
      const data = await res.json();
      if (data.success && data.link) {
        setLinksList([data.link, ...linksList]);
        setJustGeneratedLink(data.link.url);
        showToast(lang === 'bn' ? 'নতুন ওয়ান-টাইম অ্যাক্টিভেশন লিংক তৈরি হয়েছে!' : 'New activation link generated!');
      } else {
        showToast(data.message || 'Error generating link');
      }
    } catch (err) {
      showToast('Error generating activation link');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleSaveMasterAiKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMasterKeys(true);
    try {
      const res = await fetch('/api/admin/save-master-ai-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          gemini_api_key: brandingForm.geminiApiKey,
          gemini_account_email: brandingForm.geminiAccountEmail,
          gemini_family_invite_url: brandingForm.geminiFamilyInviteUrl,
          openai_api_key: brandingForm.openaiApiKey,
          claude_api_key: brandingForm.claudeApiKey,
          grok_api_key: brandingForm.grokApiKey,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(lang === 'bn' ? 'মাস্টার এআই কি এবং ক্রেডেনশিয়াল সফলভাবে সংরক্ষণ করা হয়েছে!' : 'Master AI keys saved successfully!');
      }
    } catch (err) {
      showToast('Error saving master keys');
    } finally {
      setSavingMasterKeys(false);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    storage.registerUser({
      name: newUserForm.name,
      email: newUserForm.email,
      phone: newUserForm.phone,
      role: newUserForm.role
    });

    setShowCreateUserModal(false);
    setNewUserForm({ name: '', email: '', phone: '', role: 'user' });
    onRefreshData();
    showToast(lang === 'bn' ? 'নতুন ইউজার অ্যাকাউন্ট তৈরি করা হয়েছে!' : 'User account created successfully!');
  };

  const handleTopupReseller = () => {
    if (!selectedResellerForTopup) return;
    const allUsers = storage.getUsers();
    const idx = allUsers.findIndex(u => u.id === selectedResellerForTopup);
    if (idx !== -1) {
      allUsers[idx].walletBalanceBDT = (allUsers[idx].walletBalanceBDT || 0) + Number(topupAmountBDT);
      storage.saveUsers(allUsers);
      onRefreshData();
      showToast(lang === 'bn' ? `রিসেলার ওয়ালেটে ৳${topupAmountBDT.toLocaleString()} যোগ করা হয়েছে!` : `Wallet credited with ৳${topupAmountBDT.toLocaleString()}!`);
    }
    setSelectedResellerForTopup(null);
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      settings,
      plans,
      orders,
      users,
      resellerSales
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniCraft_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast(lang === 'bn' ? 'সিস্টেম ব্যাকআপ JSON ডাউনলোড সম্পন্ন হয়েছে!' : 'Backup JSON downloaded successfully!');
  };

  // Filtered queries
  const filteredOrders = orders.filter(o => {
    const matchesSearch = orderSearch.trim() === '' ||
      o.trxId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.userName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.senderNumber.includes(orderSearch);
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = userSearch.trim() === '' ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(userSearch));
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredPlans = plans.filter(p => {
    const matchesSearch = planSearch.trim() === '' ||
      p.name.toLowerCase().includes(planSearch.toLowerCase()) ||
      p.provider.toLowerCase().includes(planSearch.toLowerCase());
    const matchesCat = planCategoryFilter === 'all' || p.category === planCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-24 text-slate-100 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/30 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Futuristic Header & HUD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#0B0F19] to-[#050814] border border-white/[0.09] p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Brand Info & Health Status */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-500/25 overflow-hidden p-1.5">
                {brandingForm.logoUrl ? (
                  <img src={brandingForm.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <ShieldCheck className="w-7 h-7" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {brandingForm.appName || 'OmniCraft AI'} {lang === 'bn' ? 'সুপার অ্যাডমিন' : 'Super Admin'}
                  </h1>
                  <span className="px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black border border-purple-500/40 uppercase font-mono tracking-wider">
                    ENTERPRISE v4.8
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {lang === 'bn' 
                    ? 'প্ল্যাটফর্মের নাম, এআই ক্যাটালগ, পেমেন্ট TrxID ভেরিফিকেশন, ইউজার ও ফুল সিস্টেম কন্ট্রোল প্যানেল।'
                    : 'Whitelabel platform branding, AI subscriptions catalog, payment approvals, and complete user controls.'}
                </p>
              </div>
            </div>

            {/* Live Status Indicators */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                {lang === 'bn' ? '● সিস্টেম সচল: 99.98% আপটাইম' : '● System Active: 99.98% Uptime'}
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span>14ms Latency</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Server className="w-3.5 h-3.5 text-indigo-400" />
                <span>Domain: {brandingForm.customDomain || 'omnicraft.ai'}</span>
              </span>
            </div>
          </div>

          {/* Right Action Tools: Language Switcher, Add Plan, Backup */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-[#070B16] border border-white/10 rounded-2xl p-1 text-xs">
              <button
                onClick={() => setLang('bn')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  lang === 'bn' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇧🇩 বাংলা</span>
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  lang === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇬🇧 English</span>
              </button>
            </div>

            {/* Quick Export Backup */}
            <button
              onClick={handleExportBackup}
              title={lang === 'bn' ? 'ডাটাবেস ব্যাকআপ ডাউনলোড করুন' : 'Export Database Backup JSON'}
              className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'ব্যাকআপ' : 'Backup'}</span>
            </button>

            {/* Quick Refresh */}
            <button
              onClick={() => {
                onRefreshData();
                showToast(lang === 'bn' ? 'সকল ডাটা রিফ্রেশ করা হয়েছে!' : 'Data refreshed from storage!');
              }}
              title={lang === 'bn' ? 'ডাটা রিফ্রেশ করুন' : 'Refresh System Data'}
              className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition"
            >
              <RefreshCw className="w-4 h-4 text-blue-400" />
            </button>

            {/* Add New Plan Button */}
            <button
              onClick={() => {
                setEditingPlanId(null);
                setPlanForm({
                  name: '',
                  provider: 'OpenAI',
                  category: 'AI & Education Tools',
                  description: '',
                  badge: 'NEW',
                  priceBDT: 499,
                  priceUSD: 4.99,
                  originalPriceBDT: 2000,
                  billingCycle: 'monthly',
                  featuresText: 'Full GPT-4o Access\nIn-App Dedicated Console\nPrivate Chat Storage',
                  accessType: 'in_app_chat',
                  directDomainUrl: 'https://chatgpt.com',
                  defaultModelId: 'chatgpt-4o',
                  availableSeats: 50,
                  imageUrl: '',
                  iconName: 'Sparkles',
                });
                setShowPlanModal(true);
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'bn' ? 'নতুন সাবস্ক্রিপশন যোগ' : 'Add New Plan'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Workspace Layout: Sidebar Tabs + Dynamic Sub-System Body */}
      <div className="flex flex-col lg:flex-row gap-5 items-start w-full">
        
        {/* Left Vertical Menu: Clicking switches sub-systems */}
        <aside className="w-full lg:w-56 xl:w-60 shrink-0 space-y-4">
          <div className="p-3 bg-[#0B0F19] border border-white/[0.08] rounded-3xl space-y-1.5 shadow-xl">
            <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{lang === 'bn' ? 'অ্যাডমিন মডিউল' : 'Admin Modules'}</span>
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            </div>

            {/* 1. Analytics */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? 'লাইভ অ্যানালিটিক্স' : 'Analytics & Revenue'}</span>
              </div>
            </button>

            {/* 2. Whitelabel Branding Customizer (Key requirement) */}
            <button
              onClick={() => setActiveTab('branding')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'branding'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{lang === 'bn' ? 'ব্র্যান্ডিং ও হোয়াইট-লেবেল' : 'Branding & Whitelabel'}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 font-mono font-bold">
                PRO
              </span>
            </button>

            {/* 3. Subscription Plans */}
            <button
              onClick={() => setActiveTab('plans')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'plans'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-blue-400" />
                <span>{lang === 'bn' ? 'সাবস্ক্রিপশন ক্যাটালগ' : 'Plans & AI Models'}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-slate-300">
                {plans.length}
              </span>
            </button>

            {/* 3.5 AI & Services Media Assets Manager (Dedicated Image Customizer) */}
            <button
              onClick={() => setActiveTab('ai_assets')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'ai_assets'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-pink-400" />
                <span>{lang === 'bn' ? 'এআই ও সার্ভিস ইমেজ/আইকন' : 'AI & Services Media'}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-pink-500/20 text-pink-300 font-mono font-bold">
                NEW
              </span>
            </button>

            {/* 4. Orders & Approvals */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-indigo-400" />
                <span>{lang === 'bn' ? 'অর্ডার ও TrxID অ্যাপ্রুভাল' : 'Orders & TrxID'}</span>
              </div>
              {pendingOrders.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white animate-pulse">
                  {pendingOrders.length} {lang === 'bn' ? 'পেন্ডিং' : 'Pending'}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-slate-300">
                  {orders.length}
                </span>
              )}
            </button>

            {/* 5. Users Management */}
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'bn' ? 'ইউজার ডিরেক্টরি' : 'Users & Permissions'}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-slate-300">
                {users.length}
              </span>
            </button>

            {/* 6. Resellers Network */}
            <button
              onClick={() => setActiveTab('resellers')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'resellers'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Percent className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? 'রিসেলার নেটওয়ার্ক' : 'Reseller Network'}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-mono">
                {resellersList.length}
              </span>
            </button>

            <div className="pt-2 mt-2 border-t border-white/[0.06]">
              <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                {lang === 'bn' ? 'কনফিগারেশন ও টুলস' : 'Configuration & Tools'}
              </div>

              {/* 7. Payment Gateways */}
              <button
                onClick={() => setActiveTab('gateways')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'gateways'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-pink-400" />
                  <span>{lang === 'bn' ? 'বিকাশ/নগদ গেটওয়ে' : 'Payment Gateways'}</span>
                </div>
              </button>

              {/* 7.5. Facebook Pixel Tracking */}
              <button
                onClick={() => setActiveTab('facebook_pixel')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'facebook_pixel'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span>{lang === 'bn' ? 'ফেসবুক পিক্সেল' : 'Facebook Pixel'}</span>
                </div>
                {brandingForm.enableFacebookPixel && brandingForm.facebookPixelId ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Active" />
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-mono">OFF</span>
                )}
              </button>

              {/* 7.6. AI One-Time Activation Links & Master Keys */}
              <button
                onClick={() => setActiveTab('ai_activation')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'ai_activation'
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-lg shadow-teal-600/30'
                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'bn' ? 'AI এক্টিভেশন লিংক ও মাস্টার কি' : 'AI Activation Links'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">1-Click</span>
              </button>

              {/* 8. Feature Flags */}
              <button
                onClick={() => setActiveTab('features')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'features'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>{lang === 'bn' ? 'ফিচার ফ্ল্যাগ ও টগল' : 'Feature Flags'}</span>
                </div>
              </button>

              {/* 9. Security & Logs */}
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'security'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'bn' ? 'অডিট লগ ও সিকিউরিটি' : 'Audit Logs & Vault'}</span>
                </div>
              </button>

              {/* 10. Operations Guide */}
              <button
                onClick={() => setActiveTab('instructions')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'instructions'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>{lang === 'bn' ? 'অপারেশন গাইড' : 'Operations Guide'}</span>
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content Area: The Sub-System Selected */}
        <main className="flex-1 min-w-0 w-full space-y-6">
          
          {/* ========================================================= */}
          {/* SUB-SYSTEM 1: ANALYTICS & LIVE REVENUE KPI                */}
          {/* ========================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                
                {/* Stat 1: Total Revenue BDT */}
                <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] p-5 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      {lang === 'bn' ? 'মোট সংগৃহীত আয় (BDT)' : 'Total Revenue (BDT)'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      ৳
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white mt-2 font-mono tabular-nums">
                    ৳{totalRevenueBDT.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold mt-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+18.4% {lang === 'bn' ? 'এই মাসে বৃদ্ধি' : 'Growth this month'}</span>
                  </div>
                </div>

                {/* Stat 2: Total Revenue USD */}
                <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] p-5 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      {lang === 'bn' ? 'ইউএসডি সমমূল্য (USD $)' : 'Revenue in USD ($)'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white mt-2 font-mono tabular-nums">
                    ${totalRevenueUSD.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Rate: 1 USD = ৳{settings.bdtToUsdRate || 122}
                  </div>
                </div>

                {/* Stat 3: Active Subscribers */}
                <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] p-5 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      {lang === 'bn' ? 'সক্রিয় গ্রাহক ও সিট' : 'Active Seats & Users'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white mt-2 font-mono tabular-nums">
                    {totalSeatsSold} <span className="text-xs text-slate-400 font-normal">{lang === 'bn' ? 'সিট বিক্রিত' : 'seats sold'}</span>
                  </div>
                  <div className="text-[11px] text-purple-400 font-semibold mt-1">
                    {totalSubscribers} {lang === 'bn' ? 'জন সক্রিয় ব্যবহারকারী' : 'active accounts'}
                  </div>
                </div>

                {/* Stat 4: Pending TrxID Approvals */}
                <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] p-5 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      {lang === 'bn' ? 'পেন্ডিং TrxID ভেরিফিকেশন' : 'Pending TrxID Orders'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white mt-2 font-mono tabular-nums">
                    {pendingOrders.length}
                  </div>
                  <div className="text-[11px] text-pink-400 font-semibold mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{pendingOrders.length > 0 ? (lang === 'bn' ? 'রিভিউ প্রয়োজন' : 'Review needed') : (lang === 'bn' ? 'সব ক্লিয়ার' : 'All clear')}</span>
                  </div>
                </div>

              </div>

              {/* Provider Revenue Distribution & Quick Action Bar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* AI Provider Market Share */}
                <div className="lg:col-span-7 rounded-3xl bg-[#0B0F19] border border-white/[0.08] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <Bot className="w-4 h-4 text-indigo-400" />
                      <span>{lang === 'bn' ? 'এআই প্রোভাইডার অনুসারে সেলস বিতরণ' : 'Sales by AI Provider'}</span>
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {[
                      { name: 'OpenAI (ChatGPT-4o & Plus)', pct: 45, color: 'bg-emerald-500', seats: '312 seats' },
                      { name: 'Anthropic (Claude 3.7 Sonnet)', pct: 25, color: 'bg-amber-500', seats: '142 seats' },
                      { name: 'Google (Gemini 2.5 Pro)', pct: 15, color: 'bg-blue-500', seats: '88 seats' },
                      { name: 'Editing & Design (Canva & Adobe)', pct: 10, color: 'bg-purple-500', seats: '940 seats' },
                      { name: 'Software & Productivity (Windows/Office)', pct: 5, color: 'bg-cyan-500', seats: '65 seats' },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium">{item.name}</span>
                          <span className="font-mono text-slate-400">{item.pct}% ({item.seats})</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Shortcuts Box */}
                <div className="lg:col-span-5 rounded-3xl bg-[#0B0F19] border border-white/[0.08] p-6 space-y-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'bn' ? 'দ্রুত অ্যাকশন' : 'Quick Actions'}</span>
                  </h3>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => setActiveTab('branding')}
                      className="w-full p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] flex items-center justify-between text-xs font-semibold text-slate-200 transition"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'bn' ? 'প্ল্যাটফর্মের নাম ও লোগো পরিবর্তন' : 'Change Brand Name & Logo'}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab('orders')}
                      className="w-full p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] flex items-center justify-between text-xs font-semibold text-slate-200 transition"
                    >
                      <span className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-pink-400" />
                        <span>{lang === 'bn' ? 'পেন্ডিং TrxID অর্ডার চেক করুন' : 'Review Pending Orders'}</span>
                      </span>
                      <span className="font-mono text-pink-400 font-bold">{pendingOrders.length}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('users')}
                      className="w-full p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] flex items-center justify-between text-xs font-semibold text-slate-200 transition"
                    >
                      <span className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-cyan-400" />
                        <span>{lang === 'bn' ? 'ইউজারকে সাবস্ক্রিপশন সিট দিন' : 'Grant Subscription to User'}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab('gateways')}
                      className="w-full p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] flex items-center justify-between text-xs font-semibold text-slate-200 transition"
                    >
                      <span className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        <span>{lang === 'bn' ? 'বিকাশ ও নগদ মার্চেন্ট নম্বর আপডেট' : 'Update Merchant Numbers'}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* SUB-SYSTEM 2: PLATFORM BRANDING & WHITELABEL CUSTOMIZER    */}
          {/* ========================================================= */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              
              <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] p-6 space-y-6 shadow-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span>{lang === 'bn' ? 'প্ল্যাটফর্ম ব্র্যান্ডিং ও কাস্টমাইজার' : 'Branding & Whitelabel Customizer'}</span>
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold font-mono">
                      LIVE SYSTEM SETTINGS
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {lang === 'bn'
                      ? 'এখানে আপনি যে নাম বা ব্র্যান্ডিং সেট করবেন, তা সম্পূর্ণ ওয়েবসাইটের হেডার, ন্যাভবার, ল্যান্ডিং পেজ, চ্যাট ও ফুটারে তাৎক্ষণিকভাবে লাইভ হয়ে যাবে।'
                      : 'Customize platform name, brand prefix/suffix, announcements, and theme colors. Changes reflect immediately across the entire site.'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSaveBrandingAndSettings} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Platform Full Name */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        {lang === 'bn' ? 'সম্পূর্ণ প্ল্যাটফর্মের নাম (Platform Name):' : 'Full Platform Name:'}
                      </label>
                      <input
                        type="text"
                        required
                        value={brandingForm.appName}
                        onChange={(e) => setBrandingForm({ ...brandingForm, appName: e.target.value })}
                        placeholder="যেমন: OmniCraft AI বা বাংলা এআই"
                        className="w-full bg-[#050814] border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-indigo-500 transition shadow-inner"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {lang === 'bn' ? 'ব্র্যান্ডের মূল নাম যা পুরো সাইটে প্রদর্শিত হবে।' : 'The main brand name displayed across the system.'}
                      </span>
                    </div>

                    {/* Custom Domain Name */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        {lang === 'bn' ? 'কাস্টম ডোমেইন (Custom Domain):' : 'Custom Domain:'}
                      </label>
                      <input
                        type="text"
                        value={brandingForm.customDomain || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, customDomain: e.target.value })}
                        placeholder="e.g. omnicraft.ai or workspace.mydomain.com"
                        className="w-full bg-[#050814] border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500 transition shadow-inner"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {lang === 'bn' ? 'লগইন করার পর চ্যাটজিপিটি এই ডোমেইনে কাজ করবে।' : 'The domain under which all AI chats run.'}
                      </span>
                    </div>

                    {/* Website Brand Logo Upload / URL (Full Width) */}
                    <div className="md:col-span-2 p-5 rounded-3xl bg-gradient-to-br from-[#0B0F19] to-[#050814] border border-indigo-500/30 shadow-xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <span>{lang === 'bn' ? 'ওয়েবসাইট ব্র্যান্ড লোগো আপলোড ও ম্যানেজমেন্ট' : 'Website Brand Logo Upload & Management'}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                Global Brand Logo
                              </span>
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              {lang === 'bn' 
                                ? 'আপনার নিজস্ব ব্র্যান্ড ইমেজ লোগো (SVG/PNG) আপলোড করুন বা লিংক দিন। এটি পুরো সাইটের টেক্সট লোগোর স্থানে ডিসপ্লে হবে।' 
                                : 'Upload your custom SVG/PNG brand logo. It automatically replaces the text logo across Navbar, Footer, Login & Chat.'}
                            </p>
                          </div>
                        </div>

                        {brandingForm.logoUrl && (
                          <button
                            type="button"
                            onClick={() => setBrandingForm({ ...brandingForm, logoUrl: '' })}
                            className="px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold flex items-center gap-1.5 transition self-start sm:self-center"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{lang === 'bn' ? 'লোগো রিমুভ ও টেক্সট মোড' : 'Remove Logo (Use Text)'}</span>
                          </button>
                        )}
                      </div>

                      {/* Live Logo Preview Box - Dual View (Light vs Dark) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* Light Mode Preview */}
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[90px] relative overflow-hidden">
                          <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            Light Mode
                          </span>
                          {brandingForm.logoUrl ? (
                            <img 
                              src={brandingForm.logoUrl} 
                              alt="Brand Logo Light" 
                              className="h-10 max-w-[220px] object-contain drop-shadow-sm my-1" 
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="flex items-center gap-2 my-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1E40AF] via-[#2563EB] to-[#38BDF8] flex items-center justify-center text-white text-xs font-bold">
                                𖣐
                              </div>
                              <span className="font-extrabold text-lg text-slate-900">
                                {brandingForm.brandPrefix || 'OmniCraft'}{' '}
                                <span className="text-blue-600 font-bold">{brandingForm.brandSuffix || 'AI'}</span>
                              </span>
                            </div>
                          )}
                          <span className="text-[10px] text-slate-400 mt-1">
                            {brandingForm.logoUrl ? 'লাইভ ইমেজ ডিসপ্লে হচ্ছে' : 'টেক্সট মোডে ডিসপ্লে হচ্ছে'}
                          </span>
                        </div>

                        {/* Dark Mode Preview */}
                        <div className="p-3.5 rounded-2xl bg-[#070B16] border border-white/10 shadow-inner flex flex-col items-center justify-center min-h-[90px] relative overflow-hidden">
                          <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-white/[0.05] px-1.5 py-0.5 rounded">
                            Dark Mode
                          </span>
                          {brandingForm.logoUrl ? (
                            <img 
                              src={brandingForm.logoUrl} 
                              alt="Brand Logo Dark" 
                              className="h-10 max-w-[220px] object-contain drop-shadow-sm my-1" 
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="flex items-center gap-2 my-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1E40AF] via-[#2563EB] to-[#38BDF8] flex items-center justify-center text-white text-xs font-bold">
                                𖣐
                              </div>
                              <span className="font-extrabold text-lg text-white">
                                {brandingForm.brandPrefix || 'OmniCraft'}{' '}
                                <span className="text-blue-400 font-bold">{brandingForm.brandSuffix || 'AI'}</span>
                              </span>
                            </div>
                          )}
                          <span className="text-[10px] text-slate-500 mt-1">
                            {brandingForm.logoUrl ? 'লাইভ ইমেজ ডিসপ্লে হচ্ছে' : 'টেক্সট মোডে ডিসপ্লে হচ্ছে'}
                          </span>
                        </div>
                      </div>

                      {/* Controls: File Upload from PC & Presets */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <label className="py-2.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/25 transition hover:scale-102">
                          <Upload className="w-4 h-4" />
                          <span>{lang === 'bn' ? 'পিসি থেকে লোগো আপলোড করুন' : 'Upload Logo from PC'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                setBrandingForm({ ...brandingForm, logoUrl: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] text-slate-400 font-medium">স্যাম্পল লোগো:</span>
                            <button
                              type="button"
                              onClick={() => setBrandingForm({ ...brandingForm, logoUrl: 'https://api.iconify.design/lucide:sparkles.svg?color=%232563eb' })}
                              className="px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/10 text-[10px] font-mono text-slate-300 border border-white/10 transition"
                            >
                              Sparkle Logo
                            </button>
                            <button
                              type="button"
                              onClick={() => setBrandingForm({ ...brandingForm, logoUrl: 'https://api.iconify.design/lucide:bot.svg?color=%236366f1' })}
                              className="px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/10 text-[10px] font-mono text-slate-300 border border-white/10 transition"
                            >
                              Bot AI
                            </button>
                            <button
                              type="button"
                              onClick={() => setBrandingForm({ ...brandingForm, logoUrl: 'https://api.iconify.design/lucide:cpu.svg?color=%2306b6d4' })}
                              className="px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/10 text-[10px] font-mono text-slate-300 border border-white/10 transition"
                            >
                              Cyber Hex
                            </button>
                          </div>
                        </div>
                      </div>

                    {/* Brand Prefix & Suffix (For stylish two-tone logo fallback) */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        {lang === 'bn' ? 'লোগো প্রথম অংশ (Brand Prefix):' : 'Logo Prefix:'}
                      </label>
                      <input
                        type="text"
                        value={brandingForm.brandPrefix || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, brandPrefix: e.target.value })}
                        placeholder="যেমন: OmniCraft"
                        className="w-full bg-[#050814] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        {lang === 'bn' ? 'লোগো দ্বিতীয় অংশ (Brand Suffix - কালার্ড):' : 'Logo Suffix (Colored):'}
                      </label>
                      <input
                        type="text"
                        value={brandingForm.brandSuffix || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, brandSuffix: e.target.value })}
                        placeholder="যেমন: AI বা Studio"
                        className="w-full bg-[#050814] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Slogan EN */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        {lang === 'bn' ? 'ইংরেজি স্লোগান (Tagline EN):' : 'Tagline (English):'}
                      </label>
                      <input
                        type="text"
                        value={brandingForm.brandTagline || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, brandTagline: e.target.value })}
                        placeholder="All-in-One Smartest AI Workspace"
                        className="w-full bg-[#050814] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Slogan BN */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        {lang === 'bn' ? 'বাংলা স্লোগান (Tagline BN):' : 'Tagline (Bengali):'}
                      </label>
                      <input
                        type="text"
                        value={brandingForm.brandTaglineBn || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, brandTaglineBn: e.target.value })}
                        placeholder="বিশ্বমানের কৃত্রিম বুদ্ধিমত্তা ও প্রিমিয়াম টুলস হাব"
                        className="w-full bg-[#050814] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Top Marquee Announcement Ticker */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        {lang === 'bn' ? 'টপ অ্যানাউন্সমেন্ট মারকুই টেক্সট (Header Marquee):' : 'Top Marquee Ticker Announcement:'}
                      </label>
                      <input
                        type="text"
                        value={brandingForm.announcementText || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, announcementText: e.target.value })}
                        placeholder="★ OmniCraft AI Workspace Live: ChatGPT, Claude, Gemini & Grok In One Place!"
                        className="w-full bg-[#050814] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* USA Showcase Title */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        {lang === 'bn' ? 'ইউএসএ ফিচার লাইভ পেজ টাইটেল (USA Showcase Title):' : 'USA Feature Showcase Title:'}
                      </label>
                      <input
                        type="text"
                        value={brandingForm.usaShowcaseTitle || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, usaShowcaseTitle: e.target.value })}
                        placeholder="OmniCraft AI Official Workspace (ইউএসএ ফিচার লাইভ পেজ)"
                        className="w-full bg-[#050814] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* YouTube Video Showcase URL */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                        <span>{lang === 'bn' ? 'হোমপেজ শোকেস ইউটিউব ভিডিও লিঙ্ক (YouTube Video Live Link):' : 'Homepage Showcase YouTube Video URL:'}</span>
                        <span className="text-[10px] text-indigo-400 font-normal">YouTube Watch / Share / Embed URL</span>
                      </label>
                      <input
                        type="url"
                        value={brandingForm.showcaseYoutubeUrl || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, showcaseYoutubeUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ অথবা https://youtu.be/..."
                        className="w-full bg-[#050814] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        {lang === 'bn' ? 'এখানে যে ইউটিউব লিঙ্কটি দেবেন, হোমপেজের শোকেস ভিডিও প্লেয়ারে সেই ভিডিওটি লাইভ চলবে।' : 'The video from this YouTube URL will play live in the homepage showcase player.'}
                      </p>
                    </div>

                    {/* Support Phone & Email */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        {lang === 'bn' ? 'সাপোর্ট ফোন ও হোয়াটসঅ্যাপ:' : 'Support Hotline / WhatsApp:'}
                      </label>
                      <input
                        type="text"
                        value={brandingForm.supportPhone || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, supportPhone: e.target.value })}
                        className="w-full bg-[#050814] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        {lang === 'bn' ? 'অফিশিয়াল সাপোর্ট ইমেইল:' : 'Official Support Email:'}
                      </label>
                      <input
                        type="email"
                        value={brandingForm.supportEmail || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, supportEmail: e.target.value })}
                        className="w-full bg-[#050814] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Currency & Exchange Rate */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        {lang === 'bn' ? 'ডিফল্ট কারেন্সি:' : 'Default Currency:'}
                      </label>
                      <select
                        value={brandingForm.currency}
                        onChange={(e) => setBrandingForm({ ...brandingForm, currency: e.target.value as any })}
                        className="w-full bg-[#050814] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-bold"
                      >
                        <option value="BDT">BDT (৳ বাংলাদেশী টাকা)</option>
                        <option value="USD">USD ($ US Dollar)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        {lang === 'bn' ? 'ইউএসডি রেট (১ USD = BDT):' : 'USD Exchange Rate (1 USD = BDT):'}
                      </label>
                      <input
                        type="number"
                        value={brandingForm.bdtToUsdRate || 122}
                        onChange={(e) => setBrandingForm({ ...brandingForm, bdtToUsdRate: Number(e.target.value) })}
                        className="w-full bg-[#050814] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-mono"
                      />
                    </div>

                  </div>

                  {/* Interactive Live Brand Preview Card */}
                  <div className="p-5 rounded-2xl bg-[#050814] border border-white/10 space-y-3">
                    <div className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'লাইভ প্রিভিউ (ওয়েবসাইটে যেভাবে দেখাবে):' : 'Live Brand Preview (How it appears to visitors):'}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white text-slate-900 border border-slate-200 flex items-center justify-between shadow-md">
                      <div className="flex items-center gap-2.5">
                        {brandingForm.logoUrl ? (
                          <img 
                            src={brandingForm.logoUrl} 
                            alt={brandingForm.appName || 'Logo'} 
                            className="h-8 max-w-[200px] object-contain drop-shadow-sm" 
                          />
                        ) : (
                          <>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-sm font-bold text-sm">
                              𖣐
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className="font-extrabold text-xl text-slate-900 tracking-tight font-sans">
                                {brandingForm.brandPrefix || brandingForm.appName?.split(' ')[0] || 'OmniCraft'}
                              </span>
                              <span className="font-bold text-lg text-blue-600 font-sans tracking-tight">
                                {brandingForm.brandSuffix || brandingForm.appName?.split(' ').slice(1).join(' ') || 'AI'}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-600">
                        <span>Features</span>
                        <span>AI Models</span>
                        <span>Pricing</span>
                      </div>

                      <div className="px-4 py-1.5 rounded-full bg-blue-600 text-white font-bold text-xs shadow-sm">
                        Try for Free
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2 flex items-center gap-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black px-7 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition hover:scale-102 active:scale-98"
                    >
                      <Save className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'ব্র্যান্ডিং সেভ ও পুরো সাইটে লাইভ করুন' : 'Save & Publish Branding'}</span>
                    </button>
                    {settingsSaved && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                        <Check className="w-4 h-4" />
                        <span>{lang === 'bn' ? 'সফলভাবে সংরক্ষিত হয়েছে!' : 'Saved to system!'}</span>
                      </span>
                    )}
                  </div>

                </form>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* SUB-SYSTEM 3: SUBSCRIPTION PLANS & CATALOG                */}
          {/* ========================================================= */}
          {activeTab === 'plans' && (
            <div className="space-y-5">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-400" />
                    <span>{lang === 'bn' ? 'এআই সাবস্ক্রিপশন ক্যাটালগ ও ইনভেন্টরি' : 'AI Subscriptions & Catalog'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? 'প্ল্যানগুলোর মূল্য, ফিচার, সিট সংখ্যা ও সরাসরি অ্যাক্সেস মোড নিয়ন্ত্রণ করুন।' : 'Manage plan pricing, features, available seats, and domain access.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder={lang === 'bn' ? 'প্ল্যান বা প্রোভাইডার খুঁজুন...' : 'Search plans...'}
                      value={planSearch}
                      onChange={(e) => setPlanSearch(e.target.value)}
                      className="w-full bg-[#050814] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setEditingPlanId(null);
                      setPlanForm({
                        name: '',
                        provider: 'OpenAI',
                        category: 'AI & Education Tools',
                        description: '',
                        badge: 'NEW',
                        priceBDT: 499,
                        priceUSD: 4.99,
                        originalPriceBDT: 2000,
                        billingCycle: 'monthly',
                        featuresText: 'GPT-4o Full Access\nPrivate Chat Window\nFast Response Time',
                        accessType: 'in_app_chat',
                        directDomainUrl: 'https://chatgpt.com',
                        defaultModelId: 'chatgpt-4o',
                        availableSeats: 50,
                        imageUrl: '',
                        iconName: 'Sparkles',
                      });
                      setShowPlanModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">{lang === 'bn' ? 'যোগ করুন' : 'Add'}</span>
                  </button>
                </div>
              </div>

              {/* Plans Table - 100% Scroll-free, fully responsive, and in-page features */}
              <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] overflow-hidden shadow-xl">
                <div className="w-full overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#050814] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
                      <tr>
                        <th className="py-3 px-3 sm:px-4">{lang === 'bn' ? 'প্ল্যান ও ফিচারস' : 'Plan & Features'}</th>
                        <th className="py-3 px-2 sm:px-3 whitespace-nowrap">{lang === 'bn' ? 'মূল্য (BDT/USD)' : 'Price (BDT/USD)'}</th>
                        <th className="py-3 px-2 sm:px-3 whitespace-nowrap">{lang === 'bn' ? 'সিট ও বিক্রি' : 'Seats / Sold'}</th>
                        <th className="py-3 px-2 sm:px-3 whitespace-nowrap">{lang === 'bn' ? 'অ্যাক্সেস মোড' : 'Access Mode'}</th>
                        <th className="py-3 px-2 sm:px-3 text-center whitespace-nowrap">{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                        <th className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">{lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredPlans.map((plan) => {
                        const isExpanded = expandedPlanId === plan.id;
                        return (
                          <React.Fragment key={plan.id}>
                            <tr className={`hover:bg-white/[0.02] transition ${isExpanded ? 'bg-white/[0.03]' : ''}`}>
                              <td className="py-3 px-3 sm:px-4">
                                <div className="flex items-start gap-2.5">
                                  {plan.imageUrl ? (
                                    <img
                                      src={plan.imageUrl}
                                      alt=""
                                      className="w-8 h-8 rounded-lg object-contain bg-slate-900 border border-white/10 p-0.5 shrink-0 mt-0.5"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                      {plan.name.charAt(0)}
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-white flex items-center gap-1.5 flex-wrap">
                                      <span className="truncate">{plan.name}</span>
                                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shrink-0">
                                        {plan.provider}
                                      </span>
                                      {plan.badge && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                                          {plan.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate max-w-sm mt-0.5">
                                      {plan.description}
                                    </div>
                                    {plan.features && plan.features.length > 0 && (
                                      <div className="flex flex-wrap items-center gap-1 mt-1">
                                        {plan.features.slice(0, 2).map((feat, i) => (
                                          <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.06] truncate max-w-[130px]">
                                            ✓ {feat}
                                          </span>
                                        ))}
                                        {plan.features.length > 2 && (
                                          <button
                                            type="button"
                                            onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                                            className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/30 font-bold transition flex items-center gap-0.5"
                                          >
                                            +{plan.features.length - 2} {lang === 'bn' ? 'ফিচার' : 'more'}
                                            {isExpanded ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-2 sm:px-3 font-mono">
                                <div className="font-bold text-emerald-400 whitespace-nowrap">
                                  ৳{plan.priceBDT} <span className="text-slate-400 text-[10px]">(${plan.priceUSD})</span>
                                </div>
                                <div className="text-[10px] text-slate-400 capitalize">
                                  {plan.billingCycle || 'monthly'}
                                </div>
                              </td>
                              <td className="py-3 px-2 sm:px-3 font-mono">
                                <div className="text-white font-bold whitespace-nowrap">{plan.totalSold} sold</div>
                                <div className="text-slate-400 text-[10px] whitespace-nowrap">{plan.availableSeats} left</div>
                              </td>
                              <td className="py-3 px-2 sm:px-3">
                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.06] text-slate-300 border border-white/5 whitespace-nowrap">
                                  {plan.accessType}
                                </span>
                              </td>
                              <td className="py-3 px-2 sm:px-3 text-center">
                                <button
                                  onClick={() => handleTogglePlanStatus(plan)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition whitespace-nowrap ${
                                    plan.isActive
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  }`}
                                >
                                  {plan.isActive ? 'ACTIVE' : 'INACTIVE'}
                                </button>
                              </td>
                              <td className="py-3 px-3 sm:px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5 shrink-0">
                                  <button
                                    onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                                    title={isExpanded ? (lang === 'bn' ? 'সংক্ষেপ করুন' : 'Collapse') : (lang === 'bn' ? 'সকল ফিচার দেখুন' : 'View all features')}
                                    className={`p-1.5 rounded-lg transition ${
                                      isExpanded 
                                        ? 'bg-indigo-600 text-white shadow-sm' 
                                        : 'bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white'
                                    }`}
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleEditPlan(plan)}
                                    title="Edit Plan"
                                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white transition"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDuplicatePlan(plan)}
                                    title="Duplicate Plan"
                                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white transition"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-blue-400" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePlan(plan.id)}
                                    title="Delete Plan"
                                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Inline Expandable Plan Features Drawer */}
                            {isExpanded && (
                              <tr className="bg-indigo-950/20 border-b border-indigo-500/20">
                                <td colSpan={6} className="p-4">
                                  <div className="bg-[#050814] border border-indigo-500/30 rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-indigo-400" />
                                        <h5 className="font-bold text-xs text-white">
                                          {plan.name} — {lang === 'bn' ? 'প্ল্যানের পূর্ণাঙ্গ ফিচার ও ডিটেইলস' : 'Complete Plan Features & Details'}
                                        </h5>
                                      </div>
                                      <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded-md border border-indigo-500/30">
                                        {plan.category}
                                      </span>
                                    </div>

                                    {plan.features && plan.features.length > 0 ? (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        {plan.features.map((feat, idx) => (
                                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/[0.05]">
                                            <span className="text-emerald-400 font-bold shrink-0">✓</span>
                                            <span className="truncate">{feat}</span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-slate-400 italic">
                                        {lang === 'bn' ? 'কোনো কাস্টম ফিচার টেক্সট যোগ করা হয়নি।' : 'No extra features specified.'}
                                      </p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1 border-t border-white/[0.06] font-mono">
                                      <span>প্রোভাইডার: <strong className="text-white">{plan.provider}</strong></span>
                                      <span>মডেল আইডি: <strong className="text-white">{plan.defaultModelId}</strong></span>
                                      {plan.directDomainUrl && (
                                        <span>অ্যাক্সেস URL: <a href={plan.directDomainUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline">{plan.directDomainUrl}</a></span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* SUB-SYSTEM 3.5: AI & SERVICES MEDIA ASSETS MANAGER        */}
          {/* ========================================================= */}
          {activeTab === 'ai_assets' && (
            <div className="space-y-6">
              
              {/* Header Box */}
              <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <span>
                        {lang === 'bn' 
                          ? 'এআই মডেল ও সার্ভিস মিডিয়া ও ইমেজ ম্যানেজার' 
                          : 'AI Models & Services Media Assets Manager'}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                      {lang === 'bn' 
                        ? 'প্রতিটি এআই মডেল (ChatGPT, Claude, Gemini, Grok, Midjourney) এবং ডিজিটাল সার্ভিস (Canva, CapCut, Adobe, Windows, Netflix) এর ছবি, লোগো ও আইকন যুক্ত বা পরিবর্তন করুন। যা কাস্টমার স্টোর ও প্রতিটি কার্ডে সরাসরি প্রদর্শিত হবে।' 
                        : 'Upload, change, or assign official high-res logos and image URLs for all AI models and digital subscriptions.'}
                    </p>
                  </div>

                  {/* 1-Click Apply All Official Logos Button */}
                  <button
                    onClick={() => {
                      if (window.confirm(lang === 'bn' ? 'আপনি কি সমস্ত সার্ভিসে তাদের অফিশিয়াল হাই-রেজ্যুলেশন লোগো স্বয়ংক্রিয়ভাবে সেট করতে চান?' : 'Do you want to assign official logos to all services?')) {
                        const updatedPlans = plans.map(p => ({
                          ...p,
                          imageUrl: getOfficialLogoForPlan(p)
                        }));
                        storage.savePlans(updatedPlans);
                        onRefreshData();
                        showToast(lang === 'bn' ? 'সকল প্ল্যানে অফিশিয়াল ব্র্যান্ড লোগো সফলভাবে সেট করা হয়েছে!' : 'Official brand logos applied to all plans!');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-pink-600/30 transition shrink-0"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'সকল সার্ভিসে অফিসিয়াল লোগো সেট করুন' : 'Auto-Assign Official Logos'}</span>
                  </button>
                </div>

                {/* Search & Category Filter Bar */}
                <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder={lang === 'bn' ? 'সার্ভিস বা এআই মডেল খুঁজুন...' : 'Search model or service...'}
                      value={mediaPlanSearch}
                      onChange={(e) => setMediaPlanSearch(e.target.value)}
                      className="w-full bg-[#050814] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {['all', 'AI & Education Tools', 'Editing Tools', 'Windows', 'OTT & Streaming'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setMediaCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                          mediaCategoryFilter === cat
                            ? 'bg-pink-600 text-white shadow-md'
                            : 'bg-white/[0.04] text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat === 'all' ? (lang === 'bn' ? 'সকল সার্ভিস' : 'All') : cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Cards Grid for Image Management */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {plans
                  .filter(p => {
                    const matchesSearch = mediaPlanSearch.trim() === '' ||
                      p.name.toLowerCase().includes(mediaPlanSearch.toLowerCase()) ||
                      p.provider.toLowerCase().includes(mediaPlanSearch.toLowerCase()) ||
                      p.category.toLowerCase().includes(mediaPlanSearch.toLowerCase());
                    const matchesCat = mediaCategoryFilter === 'all' || p.category === mediaCategoryFilter;
                    return matchesSearch && matchesCat;
                  })
                  .map((plan) => {
                    const draftUrl = planImageDrafts[plan.id] !== undefined ? planImageDrafts[plan.id] : (plan.imageUrl || '');
                    const officialPreset = getOfficialLogoForPlan(plan);

                    return (
                      <div 
                        key={plan.id}
                        className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-pink-500/40 transition group"
                      >
                        {/* Top: Service info & Category badge */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-300 border border-white/10 uppercase">
                              {plan.category}
                            </span>
                            <h4 className="font-bold text-sm text-white mt-1.5 truncate" title={plan.name}>
                              {plan.name}
                            </h4>
                            <div className="text-[11px] text-slate-400 font-mono">
                              প্রোভাইডার: <span className="text-pink-400 font-bold">{plan.provider}</span> • ৳{plan.priceBDT}
                            </div>
                          </div>
                          
                          {plan.badge && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                              {plan.badge}
                            </span>
                          )}
                        </div>

                        {/* Middle: Live Image Preview Box */}
                        <div className="relative h-36 w-full rounded-2xl bg-[#050814] border border-white/10 flex items-center justify-center p-3 overflow-hidden group-hover:border-pink-500/30 transition">
                          {draftUrl ? (
                            <img
                              src={draftUrl}
                              alt={plan.name}
                              className="max-h-28 max-w-full object-contain rounded-xl drop-shadow-md group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-500 gap-1.5 text-xs text-center p-2">
                              <ImageIcon className="w-8 h-8 text-slate-600" />
                              <span>কোনো ইমেজ সেট করা নেই</span>
                              <span className="text-[10px] text-slate-600">নিচে লিংক দিন বা অফিসিয়াল লোগো নির্বাচন করুন</span>
                            </div>
                          )}

                          {/* Quick clear button if image is present */}
                          {draftUrl && (
                            <button
                              type="button"
                              onClick={() => setPlanImageDrafts(prev => ({ ...prev, [plan.id]: '' }))}
                              className="absolute top-2 right-2 p-1 rounded-lg bg-black/60 hover:bg-rose-500 text-white transition"
                              title="ইমেজ রিমুভ করুন"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Bottom: Action Buttons */}
                        <div className="space-y-2.5">
                          {/* File Upload & Official Preset Buttons Row */}
                          <div className="grid grid-cols-2 gap-2">
                            {/* File Upload Hidden Input Trigger */}
                            <label className="py-2.5 px-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs">
                              <Upload className="w-3.5 h-3.5 text-blue-400" />
                              <span>পিসি থেকে আপলোড</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    setPlanImageDrafts(prev => ({ ...prev, [plan.id]: reader.result as string }));
                                  };
                                  reader.readAsDataURL(file);
                                }}
                              />
                            </label>

                            {/* Official Logo 1-Click Preset */}
                            <button
                              type="button"
                              onClick={() => {
                                setPlanImageDrafts(prev => ({ ...prev, [plan.id]: officialPreset }));
                              }}
                              className="py-2.5 px-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                              title="অফিসিয়াল লোগো সেট করুন"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                              <span>অফিসিয়াল লোগো</span>
                            </button>
                          </div>

                          {/* Save Image Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const finalUrl = draftUrl.trim();
                              storage.updatePlan({
                                ...plan,
                                imageUrl: finalUrl || undefined
                              });
                              onRefreshData();
                              showToast(lang === 'bn' ? `"${plan.name}" এর ইমেজ সফলভাবে আপডেট হয়েছে!` : `Image updated for "${plan.name}"!`);
                            }}
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{lang === 'bn' ? 'ছবি সেভ ও লাইভ করুন' : 'Save & Publish Image'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* SUB-SYSTEM 4: PAYMENT ORDERS & TRXID APPROVAL             */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-5">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-400" />
                    <span>{lang === 'bn' ? 'পেমেন্ট অর্ডার ও TrxID অনুমোদন' : 'Payment Orders & Approvals'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? 'বিকাশ, নগদ বা রকেটে আসা TrxID যাচাই করে এক ক্লিকে লাইসেন্স কি ইস্যু করুন।' : 'Verify customer TrxIDs and approve subscriptions instantly.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder={lang === 'bn' ? 'TrxID, নাম বা মোবাইল...' : 'Search TrxID, name...'}
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="bg-[#050814] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 w-48 sm:w-60"
                    />
                  </div>

                  {/* Filter Pills */}
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition font-mono ${
                        orderFilter === st
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white/[0.04] text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#050814] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
                      <tr>
                        <th className="py-3.5 px-4">{lang === 'bn' ? 'অর্ডার আইডি / তারিখ' : 'Order ID / Date'}</th>
                        <th className="py-3.5 px-4">{lang === 'bn' ? 'গ্রাহক তথ্য' : 'Customer Info'}</th>
                        <th className="py-3.5 px-4">{lang === 'bn' ? 'প্ল্যান' : 'Plan'}</th>
                        <th className="py-3.5 px-4">{lang === 'bn' ? 'মেথড ও TrxID' : 'Method & TrxID'}</th>
                        <th className="py-3.5 px-4 font-mono">{lang === 'bn' ? 'পরিমাণ (BDT)' : 'Amount (BDT)'}</th>
                        <th className="py-3.5 px-4 text-center">{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                        <th className="py-3.5 px-4 text-right">{lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-white">{order.id}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{order.createdAt}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{order.userName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{order.userEmail}</div>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-200">
                            {order.planName}
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <div className="flex items-center gap-1.5 font-bold text-slate-200">
                              <span className="uppercase px-1.5 py-0.5 rounded text-[9px] bg-white/10">{order.method}</span>
                              <span className="text-amber-400">{order.trxId}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">Sender: {order.senderNumber}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                            ৳{order.amountBDT}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono ${
                              order.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : order.status === 'pending'
                                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30 animate-pulse'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {order.status === 'pending' ? (
                                <>
                                  <button
                                    onClick={() => handleApproveOrder(order.id)}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{lang === 'bn' ? 'অনুমোদন' : 'Approve'}</span>
                                  </button>
                                  <button
                                    onClick={() => handleRejectOrder(order.id)}
                                    className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                                    title="Reject"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => setPreviewOrder(order)}
                                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/10 text-slate-300 text-[11px] font-medium"
                                >
                                  {lang === 'bn' ? 'রিসিপ্ট' : 'Receipt'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* SUB-SYSTEM 5: USER DIRECTORY & ACCESS CONTROL             */}
          {/* ========================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-5">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    <span>{lang === 'bn' ? 'ইউজার ডিরেক্টরি ও সাবস্ক্রিপশন ম্যানেজমেন্ট' : 'User Directory & Subscriptions'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? 'যেকোনো ইউজারকে সরাসরি প্ল্যান উপহার দিন, মেয়াদ বাড়ান অথবা রোল পরিবর্তন করুন।' : 'Grant plans, extend validity, and assign roles to users.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder={lang === 'bn' ? 'নাম, ইমেইল বা ফোন...' : 'Search user...'}
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full bg-[#050814] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowCreateUserModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">{lang === 'bn' ? 'নতুন ইউজার' : 'Add User'}</span>
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#050814] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
                      <tr>
                        <th className="py-3.5 px-4">{lang === 'bn' ? 'ইউজার নাম' : 'User Name'}</th>
                        <th className="py-3.5 px-4">{lang === 'bn' ? 'ইমেইল ও মোবাইল' : 'Contact'}</th>
                        <th className="py-3.5 px-4">{lang === 'bn' ? 'রোল' : 'Role'}</th>
                        <th className="py-3.5 px-4">{lang === 'bn' ? 'চলমান প্ল্যান' : 'Current Plan'}</th>
                        <th className="py-3.5 px-4">{lang === 'bn' ? 'মেয়াদ শেষ' : 'Expiry'}</th>
                        <th className="py-3.5 px-4 text-right">{lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredUsers.map((u) => {
                        const currentPlan = plans.find(p => p.id === u.currentPlanId);
                        return (
                          <tr key={u.id} className="hover:bg-white/[0.02] transition">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <UserAvatar name={u.name} role={u.role} size="sm" />
                                <div>
                                  <div className="font-bold text-white">{u.name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">ID: {u.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono">
                              <div className="text-slate-200">{u.email}</div>
                              <div className="text-[10px] text-slate-400">{u.phone || 'N/A'}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                                u.role === 'super_admin'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                  : u.role === 'reseller'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-white/10 text-slate-300'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-200">
                              {currentPlan ? currentPlan.name : <span className="text-slate-500">ফ্রি ইউজার</span>}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-300">
                              {u.subscriptionExpiry || '—'}
                            </td>
                            <td className="py-3 px-3 sm:px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5 shrink-0">
                                <button
                                  onClick={() => setSelectedUserForGrant(u.id)}
                                  className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-[11px] font-bold transition border border-indigo-500/30 whitespace-nowrap"
                                  title={lang === 'bn' ? 'প্ল্যান উপহার দিন' : 'Grant Plan'}
                                >
                                  {lang === 'bn' ? 'প্ল্যান দিন' : 'Grant'}
                                </button>
                                <button
                                  onClick={() => handleExtendUserValidity(u.id, 30)}
                                  className="px-2 py-1 bg-white/[0.04] hover:bg-white/10 text-slate-300 rounded-lg text-[11px] font-mono whitespace-nowrap"
                                  title="+30 Days Validity"
                                >
                                  +30d
                                </button>
                                <button
                                  onClick={() => setEditingUser(u)}
                                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white transition"
                                  title={lang === 'bn' ? 'ইউজার এডিট করুন' : 'Edit User'}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id, u.name)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition"
                                  title={lang === 'bn' ? 'ইউজার ডিলিট করুন' : 'Delete User'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* SUB-SYSTEM 6: RESELLER NETWORK & WHOLESALE                */}
          {/* ========================================================= */}
          {activeTab === 'resellers' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Percent className="w-5 h-5 text-emerald-400" />
                    <span>{lang === 'bn' ? 'অনুমোদিত রিসেলার নেটওয়ার্ক ও পাইকারি সেলস' : 'Reseller Partner Network'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? 'রিসেলারদের ওয়ালেট ব্যালেন্স, পাইকারি ডিসকাউন্ট রেট ও মোট ক্লায়েন্ট সেলস পর্যালোচনা করুন।' : 'Track reseller commissions, wallet balances, and client activations.'}
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-mono">{resellersList.length} Partners</span>
              </div>

              {/* Resellers Table */}
              <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#050814] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
                    <tr>
                      <th className="py-3.5 px-4">{lang === 'bn' ? 'রিসেলার নাম' : 'Reseller'}</th>
                      <th className="py-3.5 px-4">{lang === 'bn' ? 'মোবাইল ও ইমেইল' : 'Contact'}</th>
                      <th className="py-3.5 px-4 text-right">{lang === 'bn' ? 'ওয়ালেট ব্যালেন্স' : 'Wallet Balance'}</th>
                      <th className="py-3.5 px-4 text-center">{lang === 'bn' ? 'পাইকারি ডিসকাউন্ট' : 'Discount'}</th>
                      <th className="py-3.5 px-4 text-center">{lang === 'bn' ? 'ক্লায়েন্ট সেলস' : 'Client Sales'}</th>
                      <th className="py-3.5 px-4 text-right">{lang === 'bn' ? 'রিচার্জ' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {resellersList.map((reseller) => {
                      const salesCount = resellerSales.filter(s => s.resellerId === reseller.id).length;
                      return (
                        <tr key={reseller.id} className="hover:bg-white/[0.02]">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{reseller.name}</div>
                            <span className="text-[10px] text-emerald-400 font-bold">VERIFIED RESELLER</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <div className="text-slate-300">{reseller.phone}</div>
                            <div className="text-[10px] text-slate-400">{reseller.email}</div>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 tabular-nums">
                            ৳{(reseller.walletBalanceBDT || 14500).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-400">
                            {reseller.resellerDiscountPercent || 25}% OFF
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                            {salesCount} টি সিট
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedResellerForTopup(reseller.id)}
                              className="px-3 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-xs font-bold transition border border-emerald-500/30"
                            >
                              + রিচার্জ
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Recent Reseller Sales */}
              <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] p-5 space-y-3">
                <h4 className="font-bold text-sm text-white">রিসেলারদের সাম্প্রতিক ক্লায়েন্ট বিক্রয় লগ</h4>
                <div className="space-y-2">
                  {resellerSales.slice(0, 5).map((sale) => (
                    <div key={sale.id} className="p-3.5 rounded-2xl bg-[#050814] border border-white/[0.06] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{sale.clientName} ({sale.planName})</div>
                        <div className="text-[11px] text-slate-400 font-mono">মোবাইল: {sale.clientPhone} · মেয়াদ: {sale.expiryDate}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold font-mono">৳{sale.sellingPriceBDT}</div>
                        <div className="text-[10px] text-amber-400 font-mono font-medium">রিসেলার প্রফিট: +৳{sale.profitBDT}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* SUB-SYSTEM 7: PAYMENT GATEWAYS CONFIGURATION              */}
          {/* ========================================================= */}
          {activeTab === 'gateways' && (
            <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] p-6 space-y-5 shadow-xl">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                  <span>{lang === 'bn' ? 'পেমেন্ট গেটওয়ে সেটিংস ও মার্চেন্ট নম্বর' : 'Payment Gateways & Merchants'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'bn'
                    ? 'গ্রাহক যখন সাবস্ক্রিপশন কিনবেন, তখন এই নম্বরগুলোতে টাকা পাঠিয়ে TrxID প্রদান করবেন।'
                    : 'Customer checkout mobile wallet numbers for bKash, Nagad, and Rocket.'}
                </p>
              </div>

              <form onSubmit={handleSaveBrandingAndSettings} className="space-y-4 max-w-xl">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    বিকাশ মার্চেন্ট / পার্সোনাল নম্বর:
                  </label>
                  <input
                    type="text"
                    value={brandingForm.bkashMerchant}
                    onChange={(e) => setBrandingForm({ ...brandingForm, bkashMerchant: e.target.value })}
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    নগদ মার্চেন্ট / পার্সোনাল নম্বর:
                  </label>
                  <input
                    type="text"
                    value={brandingForm.nagadMerchant}
                    onChange={(e) => setBrandingForm({ ...brandingForm, nagadMerchant: e.target.value })}
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    রকেট অ্যাকাউন্ট নম্বর:
                  </label>
                  <input
                    type="text"
                    value={brandingForm.rocketMerchant}
                    onChange={(e) => setBrandingForm({ ...brandingForm, rocketMerchant: e.target.value })}
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    উপায় / ব্যাংক অ্যাকাউন্ট তথ্য:
                  </label>
                  <input
                    type="text"
                    value={brandingForm.upayMerchant}
                    onChange={(e) => setBrandingForm({ ...brandingForm, upayMerchant: e.target.value })}
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={brandingForm.autoApprovePayments}
                      onChange={(e) => setBrandingForm({ ...brandingForm, autoApprovePayments: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-white/20"
                    />
                    <span>অটোমেটিক ভেরিফিকেশন অন রাখুন (TrxID সাবমিট করলেই সাথে সাথে সাবস্ক্রিপশন চালু হবে)</span>
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>সেটিংস সংরক্ষণ করুন</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* SUB-SYSTEM 7.5: FACEBOOK (META) PIXEL & ANALYTICS         */}
          {/* ========================================================= */}
          {activeTab === 'facebook_pixel' && (
            <div className="space-y-6">
              
              <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] p-6 space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                        f
                      </div>
                      <span>{lang === 'bn' ? 'ফেসবুক মেটা পিক্সেল (Meta Pixel) ট্র্যাকিং' : 'Facebook (Meta) Pixel & Ads Tracking'}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {lang === 'bn'
                        ? 'আপনার ফেসবুক অ্যাড ম্যানেজার বা ইভেন্টস ম্যানেজার থেকে পিক্সেল আইডি বসিয়ে ভিজিটর, লিড ও সেলস ট্র্যাক করুন।'
                        : 'Connect Meta Pixel ID to track page views, leads, checkouts, and purchase conversions from Facebook & Instagram Ads.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                      brandingForm.enableFacebookPixel && brandingForm.facebookPixelId
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-white/10'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        brandingForm.enableFacebookPixel && brandingForm.facebookPixelId ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                      }`} />
                      <span>
                        {brandingForm.enableFacebookPixel && brandingForm.facebookPixelId
                          ? (lang === 'bn' ? 'পিক্সেল সক্রিয় ও ট্র্যাকিং হচ্ছে' : 'Pixel Active & Tracking')
                          : (lang === 'bn' ? 'পিক্সেল নিষ্ক্রিয়' : 'Pixel Disabled')}
                      </span>
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSaveBrandingAndSettings} className="space-y-5 max-w-2xl relative z-10">
                  
                  {/* Enable / Disable Switch */}
                  <div className="flex items-center justify-between p-4 bg-[#050814] border border-white/10 rounded-2xl">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{lang === 'bn' ? 'ফেসবুক পিক্সেল সিস্টেম সক্রিয় করুন' : 'Enable Facebook Pixel Tracking'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">Meta Pixel</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {lang === 'bn'
                          ? 'সক্রিয় থাকলে স্বয়ংক্রিয়ভাবে পেজভিউ, চেকআউট ও পারচেজ ইভেন্ট ফেসবুক ইভেন্টস ম্যানেজারে পাঠাবে।'
                          : 'Automatically sends PageView, InitiateCheckout, and Purchase events to Meta Events Manager.'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBrandingForm({ ...brandingForm, enableFacebookPixel: !brandingForm.enableFacebookPixel })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        brandingForm.enableFacebookPixel ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          brandingForm.enableFacebookPixel ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Pixel ID Input */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                      <span>{lang === 'bn' ? 'ফেসবুক পিক্সেল আইডি (Pixel ID):' : 'Facebook Pixel ID (Numeric):'}</span>
                      <a
                        href="https://business.facebook.com/events_manager2"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
                      >
                        <span>Events Manager এ যান</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="যেমন: 123456789012345"
                        value={brandingForm.facebookPixelId || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, facebookPixelId: e.target.value.replace(/[^0-9]/g, '') })}
                        className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                      />
                      <div className="absolute right-2 top-2">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const text = await navigator.clipboard.readText();
                              const clean = text.replace(/[^0-9]/g, '');
                              if (clean) {
                                setBrandingForm({ ...brandingForm, facebookPixelId: clean });
                                showToast(lang === 'bn' ? 'পিক্সেল আইডি পেস্ট করা হয়েছে!' : 'Pixel ID pasted!');
                              }
                            } catch {}
                          }}
                          className="px-2.5 py-1 bg-white/[0.06] hover:bg-white/10 text-slate-300 rounded-lg text-[10px] font-mono"
                        >
                          {lang === 'bn' ? 'ক্লিপবোর্ড পেস্ট' : 'Paste'}
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {lang === 'bn' 
                        ? 'এটি সাধারণত ১৫-১৬ সংখ্যার একটি নিউমেরিক আইডি (যেমন: 1483928472910482)।' 
                        : 'Typically a 15-16 digit numeric identifier found in your Meta Events Manager.'}
                    </p>
                  </div>

                  {/* Actions & Test Button */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
                    >
                      <Save className="w-4 h-4" />
                      <span>{settingsSaved ? (lang === 'bn' ? 'সেভ হয়েছে!' : 'Saved!') : (lang === 'bn' ? 'পিক্সেল সংরক্ষণ করুন' : 'Save Pixel Settings')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!brandingForm.facebookPixelId) {
                          alert(lang === 'bn' ? 'অনুগ্রহ করে প্রথমে আপনার ফেসবুক পিক্সেল আইডি লিখুন এবং সেভ করুন।' : 'Please enter and save your Facebook Pixel ID first.');
                          return;
                        }
                        pixel.init(brandingForm.facebookPixelId, true);
                        pixel.trackCustom('TestPixelEvent', {
                          timestamp: new Date().toISOString(),
                          app: 'OmniCraft AI',
                          status: 'Success'
                        });
                        showToast(lang === 'bn' ? 'টেস্ট ইভেন্ট সফলভাবে পাঠানো হয়েছে! মেটা পিক্সেলে চেক করুন।' : 'Test event fired successfully! Check Meta Pixel Helper.');
                      }}
                      className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl text-xs font-bold transition flex items-center gap-2"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'bn' ? 'টেস্ট ইভেন্ট পাঠান' : 'Fire Test Event'}</span>
                    </button>
                  </div>
                </form>

                {/* E-Commerce Standard Events Overview */}
                <div className="border-t border-white/[0.08] pt-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'bn' ? 'স্বয়ংক্রিয়ভাবে ট্র্যাক হওয়া ই-কমার্স ইভেন্টসমূহ' : 'Tracked Standard E-Commerce Events'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-[#050814] border border-white/10 rounded-2xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-blue-400">PageView</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">AUTO</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'bn' ? 'যেকোনো পেজ বা মেনুতে ভিজিট করলেই ফায়ার হবে।' : 'Fires on every tab & page navigation.'}
                      </p>
                    </div>

                    <div className="bg-[#050814] border border-white/10 rounded-2xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-purple-400">ViewContent</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">AUTO</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'bn' ? 'গ্রাহক কোনো প্ল্যান ও মূল্য বিস্তারিত দেখলে।' : 'Fires when a plan or service details are viewed.'}
                      </p>
                    </div>

                    <div className="bg-[#050814] border border-white/10 rounded-2xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-amber-400">InitiateCheckout</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">AUTO</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'bn' ? 'গ্রাহক যখন কিনতে পেমেন্ট উইন্ডো ওপেন করবেন।' : 'Fires when user opens checkout payment modal.'}
                      </p>
                    </div>

                    <div className="bg-[#050814] border border-white/10 rounded-2xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-emerald-400">Purchase</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">CONVERSION</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'bn' ? 'বিকাশ/নগদে টাকা পাঠিয়ে TrxID সাবমিট করার সাথে সাথে।' : 'Fires with BDT order amount & TrxID upon payment.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Setup & Testing Guide */}
                <div className="bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border border-blue-500/20 rounded-2xl p-4 space-y-2">
                  <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'কীভাবে ফেসবুক পিক্সেল টেস্ট ও ভেরিফাই করবেন?' : 'How to Test & Verify Meta Pixel'}</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>
                      গুগল ক্রোম ব্রাউজারে <strong className="text-white">Meta Pixel Helper</strong> এক্সটেনশন ইনস্টল করুন।
                    </li>
                    <li>
                      আপনার ওয়েবসাইটের যেকোনো পেজে গেলে এক্সটেনশনটি সবুজ রঙ ধারণ করে ইভেন্টগুলো (<code className="text-blue-300 font-mono">PageView</code>, <code className="text-blue-300 font-mono">InitiateCheckout</code>) দেখাবে।
                    </li>
                    <li>
                      ফেসবুক অ্যাড ক্যাম্পেইন রান করার সময় <strong className="text-white">Purchase</strong> ইভেন্টকে কনভার্সন গোল হিসেবে সিলেক্ট করুন।
                    </li>
                  </ul>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* SUB-SYSTEM 7.6: AI ONE-TIME ACTIVATION LINKS & MASTER KEYS */}
          {/* ========================================================= */}
          {activeTab === 'ai_activation' && (
            <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] p-6 space-y-8 shadow-xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                <div>
                  <h3 className="font-black text-lg text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <span>{lang === 'bn' ? 'AI ওয়ান-টাইম অ্যাক্টিভেশন লিংক ও মাস্টার গেটওয়ে' : 'AI One-Time Activation Links & Master Keys'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    {lang === 'bn' 
                      ? 'ChatGPT, Claude, Gemini, Grok এর মাস্টার এক্সেস থেকে ১-ক্লিকে ইউনিক অ্যাক্টিভেশন লিংক তৈরি করুন। প্রতিটি গ্রাহক তাদের নিজস্ব জিমেইল দিয়ে লিংকটি একবারই সক্রিয় করতে পারবে।'
                      : 'Generate unique one-time activation links from your master ChatGPT, Claude, Gemini, and Grok subscriptions. Each link is locked to a single Gmail.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{linksList.filter(l => !(l.is_used || l.isUsed)).length} টি লিংক অব্যবহৃত</span>
                  </span>
                </div>
              </div>

              {/* Top Row: Link Generator & Master Keys */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1. Generator Card (7 Cols) */}
                <div className="lg:col-span-7 bg-[#070A14] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'bn' ? 'নতুন ওয়ান-টাইম অ্যাক্টিভেশন লিংক জেনারেট করুন' : 'Generate One-Time Activation Link'}</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">১ জিমেইলে ১ বার</span>
                  </div>

                  <form onSubmit={handleGenerateActivationLink} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          {lang === 'bn' ? 'এআই সার্ভিস ও মডেল:' : 'AI Service & Model:'}
                        </label>
                        <select
                          value={newLinkService}
                          onChange={(e) => setNewLinkService(e.target.value as any)}
                          className="w-full bg-[#0B0F19] border border-white/10 text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                        >
                          <option value="gemini">Google Gemini Advanced (AI Pro)</option>
                          <option value="chatgpt">ChatGPT Plus (GPT-4o & Canvas)</option>
                          <option value="claude">Claude 3.5 Sonnet Pro</option>
                          <option value="grok">xAI Grok 2 & Mini</option>
                          <option value="all_in_one">All-in-One AI VIP Bundle</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          {lang === 'bn' ? 'সাবস্ক্রিপশন মেয়াদকাল:' : 'Validity Duration:'}
                        </label>
                        <select
                          value={newLinkDays}
                          onChange={(e) => setNewLinkDays(Number(e.target.value))}
                          className="w-full bg-[#0B0F19] border border-white/10 text-white rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-emerald-500"
                        >
                          <option value={7}>৭ দিন (ট্রায়াল অ্যাক্সেস)</option>
                          <option value={15}>১৫ দিন (হাফ মান্থ)</option>
                          <option value={30}>৩০ দিন (১ মাস ফুল সাবস্ক্রিপশন)</option>
                          <option value={90}>৯০ দিন (৩ মাস সিজনাল)</option>
                          <option value={365}>৩৬৫ দিন (১ বছর অ্যানুয়াল)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isGeneratingLink}
                      className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition transform active:scale-95 disabled:opacity-50"
                    >
                      {isGeneratingLink ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>{lang === 'bn' ? 'এক ক্লিকে অ্যাক্টিভেশন লিংক তৈরি করুন' : 'Generate One-Time Link'}</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Just Generated Box */}
                  {justGeneratedLink && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>লিংক সফলভাবে তৈরি হয়েছে! কাস্টমারকে পাঠান:</span>
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">1-Time Use</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={justGeneratedLink}
                          className="flex-1 bg-[#050814] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-mono text-emerald-200 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(justGeneratedLink);
                            showToast(lang === 'bn' ? 'অ্যাক্টিভেশন লিংক কপি করা হয়েছে!' : 'Link copied to clipboard!');
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>কপি করুন</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        * গ্রাহক এই লিংকে ক্লিক করে তার জিমেইল দিলেই স্বয়ংক্রিয়ভাবে তার অ্যাক্টিভেশন সম্পন্ন হয়ে যাবে।
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Master AI Keys Card (5 Cols) */}
                <div className="lg:col-span-5 bg-[#070A14] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-indigo-400" />
                      <span>{lang === 'bn' ? 'মাস্টার এআই কি কনফিগারেশন' : 'Master AI Access Credentials'}</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">এনক্রিপ্টেড সেভ</span>
                  </div>

                  <form onSubmit={handleSaveMasterAiKeys} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1 flex items-center justify-between">
                        <span>Google Gemini API Key / Master Token:</span>
                        <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline">
                          AI Studio থেকে নিন ↗
                        </a>
                      </label>
                      <input
                        type="password"
                        value={brandingForm.geminiApiKey || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, geminiApiKey: e.target.value })}
                        placeholder="AIzaSy... (গুগল জেমিনি এপিআই কি)"
                        className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Gemini Master Account Email (যদি ফ্যামিলি গ্রুপ থাকে):
                      </label>
                      <input
                        type="email"
                        value={brandingForm.geminiAccountEmail || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, geminiAccountEmail: e.target.value })}
                        placeholder="admin.gemini@gmail.com"
                        className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        OpenAI Master API Key (ChatGPT-4o):
                      </label>
                      <input
                        type="password"
                        value={brandingForm.openaiApiKey || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, openaiApiKey: e.target.value })}
                        placeholder="sk-proj-..."
                        className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-300 block mb-1">Claude 3.5 Key:</label>
                        <input
                          type="password"
                          value={brandingForm.claudeApiKey || ''}
                          onChange={(e) => setBrandingForm({ ...brandingForm, claudeApiKey: e.target.value })}
                          placeholder="sk-ant-..."
                          className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-300 block mb-1">xAI Grok Key:</label>
                        <input
                          type="password"
                          value={brandingForm.grokApiKey || ''}
                          onChange={(e) => setBrandingForm({ ...brandingForm, grokApiKey: e.target.value })}
                          placeholder="xai-..."
                          className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={savingMasterKeys}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      {savingMasterKeys ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>মাস্টার কি সংরক্ষণ করুন</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

              </div>

              {/* Table of Generated Links */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'bn' ? 'জেনারেট করা ওয়ান-টাইম অ্যাক্টিভেশন লিংক ও ব্যবহার ট্র্যাকিং' : 'Activation Links Audit Log'}</span>
                  </h4>
                  <span className="text-xs text-slate-400">সর্বমোট: {linksList.length} টি</span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#070A14]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/[0.03] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="py-3 px-4">সার্ভিস</th>
                        <th className="py-3 px-4">মেয়াদ</th>
                        <th className="py-3 px-4">অ্যাক্টিভেশন লিংক</th>
                        <th className="py-3 px-4">স্ট্যাটাস</th>
                        <th className="py-3 px-4">ব্যবহৃত জিমেইল</th>
                        <th className="py-3 px-4 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {linksList.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-500">
                            এখনো কোনো অ্যাক্টিভেশন লিংক তৈরি করা হয়নি। উপরের ফরম থেকে তৈরি করুন।
                          </td>
                        </tr>
                      ) : (
                        linksList.map((link: any, idx: number) => {
                          const isCopied = copiedLinkId === (link.id || idx);
                          return (
                            <tr key={link.id || idx} className="hover:bg-white/[0.02] transition">
                              <td className="py-3.5 px-4 font-semibold text-white">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                                  <span>{link.service_name || link.serviceName}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-slate-300">
                                {link.validity_days || link.validityDays} দিন
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="font-mono text-[11px] text-slate-400 truncate max-w-xs block">
                                  {link.url}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                {link.is_used || link.isUsed ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                    <Lock className="w-3 h-3" />
                                    <span>ব্যবহৃত (Used)</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>অব্যবহৃত (Ready)</span>
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 font-mono text-xs text-indigo-300">
                                {(link.used_by_email || link.usedByEmail) ? (
                                  <span className="font-semibold">{link.used_by_email || link.usedByEmail}</span>
                                ) : (
                                  <span className="text-slate-600">—</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(link.url);
                                    setCopiedLinkId(link.id || idx);
                                    showToast(lang === 'bn' ? 'লিংক কপি করা হয়েছে!' : 'Link copied!');
                                    setTimeout(() => setCopiedLinkId(null), 2500);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[11px] font-semibold inline-flex items-center gap-1.5 transition"
                                >
                                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{isCopied ? 'কপি হয়েছে' : 'কপি লিংক'}</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Step-by-Step Bangla Blueprint Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-blue-950/20 to-transparent border border-indigo-500/20 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>জেমিনি ও অন্যান্য এআই আনলিমিটেড অ্যাক্সেস যুক্ত ও শেয়ার করার সম্পূর্ণ নিয়ম (বাংলা গাইড)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-[#050814] p-4 rounded-2xl border border-white/10 space-y-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">১</div>
                    <div className="font-bold text-white">জেমিনি মাস্টার এক্সেস নিন</div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Google AI Studio (<a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-blue-400 underline">aistudio.google.com</a>) থেকে আনলিমিটেড বা পেইড Gemini 1.5 Pro এপিআই কি অথবা Google One 2TB AI Premium একাউন্ট তৈরি করুন।
                    </p>
                  </div>

                  <div className="bg-[#050814] p-4 rounded-2xl border border-white/10 space-y-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">২</div>
                    <div className="font-bold text-white">মাস্টার কি সংরক্ষণ করুন</div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      উপরে দেওয়া "মাস্টার এআই কি কনফিগারেশন" বক্সে আপনার Gemini API Key বা ইমেইল দিয়ে "মাস্টার কি সংরক্ষণ করুন" বাটনে ক্লিক করুন।
                    </p>
                  </div>

                  <div className="bg-[#050814] p-4 rounded-2xl border border-white/10 space-y-2">
                    <div className="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-xs">৩</div>
                    <div className="font-bold text-white">ইউনিক লিংক জেনারেট</div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      যেকোনো গ্রাহকের জন্য জেমিনি সিলেক্ট করে মেয়াদ (যেমন ৩০ দিন) দিয়ে "এক ক্লিকে তৈরি করুন" চাপুন। সাথে সাথে একটি ওয়ান-টাইম সিকিউর লিংক পেয়ে যাবেন।
                    </p>
                  </div>

                  <div className="bg-[#050814] p-4 rounded-2xl border border-white/10 space-y-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">৪</div>
                    <div className="font-bold text-white">গ্রাহক জিমেইল অ্যাক্টিভেশন</div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      গ্রাহক ওই লিংকে ক্লিক করে তার নিজস্ব জিমেইল দিলেই সিস্টেম সাথে সাথে তাকে সিট ও ওয়ার্কস্পেস দিয়ে দিবে এবং লিংকটি অটোমেটিক লক (used) হয়ে যাবে।
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* SUB-SYSTEM 8: FEATURE FLAGS & MODULE TOGGLES              */}
          {/* ========================================================= */}
          {activeTab === 'features' && (
            <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] p-6 space-y-6 shadow-xl">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <span>{lang === 'bn' ? 'সিস্টেম ফিচার ফ্ল্যাগ ও মডিউল কন্ট্রোল' : 'System Feature Flags'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'bn' ? 'ওয়েবসাইটের যে ফিচারগুলো আপনি ক্লায়েন্টদের দেখাতে চান তা অন বা অফ রাখুন।' : 'Toggle public features and pages across the platform.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'enableUsaFeaturePage', title: 'ইউএসএ ফিচার লাইভ পেজ (USA Showcase Page)', desc: 'Dedicated full-screen workspace feature page' },
                  { key: 'enableInAppChat', title: 'ইন-অ্যাপ এআই চ্যাট কনসোল (In-App AI Chat)', desc: 'Direct multi-model workspace within our domain' },
                  { key: 'enableDomainProxy', title: 'ডোমেইন প্রক্সি রিভার্স মোড (Domain Proxy)', desc: 'Browser window with domain reverse proxy' },
                  { key: 'enableResellerNetwork', title: 'রিসেলার পার্টনার প্যানেল (Reseller Panel)', desc: 'Wholesale client management for agents' },
                  { key: 'enableFloatingChat', title: 'ফ্লোটিং এআই সাপোর্ট উইজেট (Floating Chat)', desc: 'Bottom-right quick helper bubble' },
                  { key: 'enableHeaderMarquee', title: 'টপ অ্যানাউন্সমেন্ট মারকুই (Top Marquee)', desc: 'Scrolling announcement ticker on header' },
                ].map((item) => {
                  const isEnabled = (brandingForm as any)[item.key] !== false;
                  return (
                    <div key={item.key} className="p-4 rounded-2xl bg-[#050814] border border-white/[0.06] flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-white text-xs">{item.title}</div>
                        <div className="text-[11px] text-slate-400">{item.desc}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...brandingForm, [item.key]: !isEnabled };
                          setBrandingForm(updated);
                          storage.saveSettings(updated);
                          onRefreshData();
                          showToast(isEnabled ? 'ফিচারটি সাময়িকভাবে বন্ধ করা হয়েছে' : 'ফিচারটি সচল করা হয়েছে');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
                          isEnabled
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {isEnabled ? 'ENABLED' : 'DISABLED'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SUB-SYSTEM 9: AUDIT LOGS & SECURITY                       */}
          {/* ========================================================= */}
          {activeTab === 'security' && (
            <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] p-6 space-y-6 shadow-xl">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <span>{lang === 'bn' ? 'সিস্টেম অডিট লগ ও সিকিউরিটি ভল্ট' : 'Audit Logs & Security Vault'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  অ্যাডমিন অ্যাক্টিভিটি ট্র্যাকিং, ডাটাবেস সিকিউরিটি ও ব্যাকআপ ব্যবস্থাপনা।
                </p>
              </div>

              {/* API Service Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-[#050814] border border-white/[0.06] space-y-1">
                  <div className="text-slate-400">OpenAI API Connection:</div>
                  <div className="font-bold text-emerald-400 font-mono">CONNECTED (GPT-4o)</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#050814] border border-white/[0.06] space-y-1">
                  <div className="text-slate-400">Anthropic Claude Engine:</div>
                  <div className="font-bold text-emerald-400 font-mono">OPERATIONAL (Sonnet 3.7)</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#050814] border border-white/[0.06] space-y-1">
                  <div className="text-slate-400">Google Gemini Pro:</div>
                  <div className="font-bold text-emerald-400 font-mono">ACTIVE (Gemini 2.5)</div>
                </div>
              </div>

              {/* Recent Audit Logs */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">সাম্প্রতিক অডিট লগ:</div>
                {[
                  { time: 'Just now', event: 'Super Admin opened settings panel', user: 'শিশির বাড়ৈ', ip: '103.114.98.12' },
                  { time: '12 mins ago', event: 'Order ORD-9821 approved automatically', user: 'System Worker', ip: 'internal' },
                  { time: '2 hours ago', event: 'New plan ChatGPT Plus seat updated', user: 'Admin', ip: '103.114.98.12' },
                  { time: 'Yesterday', event: 'Database backup synchronized successfully', user: 'Automated Cron', ip: 'internal' },
                ].map((log, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#050814] border border-white/[0.04] flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">{log.event}</span>
                    <span className="text-slate-500 text-[11px]">{log.user} · {log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SUB-SYSTEM 10: INSTRUCTIONS & OPERATIONS GUIDE            */}
          {/* ========================================================= */}
          {activeTab === 'instructions' && (
            <SubscriptionOperationsGuide
              settings={brandingForm}
              onOpenMarketplace={() => onOpenGuides()}
            />
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: PLAN CREATE / EDIT (LANDSCAPE WIDESCREEN)         */}
      {/* ========================================================= */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0B0F19] border border-white/10 rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header - Fixed at Top */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#070A13]/90 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {editingPlanId ? (lang === 'bn' ? 'এআই সাবস্ক্রিপশন এডিট করুন' : 'Edit Subscription') : (lang === 'bn' ? 'নতুন এআই সাবস্ক্রিপশন যোগ করুন' : 'Add New Subscription')}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'bn' ? 'ল্যান্ডস্কেপ ভিউ: বাম ও ডান পাশে সকল অপশন এক নজরে দেখুন' : 'Landscape layout: manage all service settings at a glance'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowPlanModal(false)} 
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - 2 Column Landscape Grid with smooth scroll if required */}
            <form onSubmit={handleSavePlan} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* LEFT COLUMN: Service Presets, Logo Upload & Mode (5 Cols) */}
                  <div className="lg:col-span-5 space-y-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
                    {/* Service Preset Quick-Pick */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                        <span>জনপ্রিয় সার্ভিস লোগো প্রিসেট:</span>
                        <span className="text-[10px] text-indigo-400 font-normal">১-ক্লিক অটো-ফিল</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-[#050814] rounded-xl border border-white/10">
                        {SERVICE_PRESETS.map((preset) => {
                          const isSelected = planForm.iconName === preset.iconName || planForm.name.toLowerCase().includes(preset.label.toLowerCase());
                          return (
                            <button
                              key={preset.iconName}
                              type="button"
                              onClick={() => {
                                setPlanForm({
                                  ...planForm,
                                  name: planForm.name && planForm.name !== '' ? planForm.name : preset.name,
                                  provider: preset.provider as any,
                                  category: preset.category as any,
                                  badge: preset.badge,
                                  iconName: preset.iconName,
                                  directDomainUrl: preset.directDomainUrl,
                                  imageUrl: preset.imageUrl || planForm.imageUrl,
                                });
                              }}
                              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold transition border ${
                                isSelected
                                  ? 'bg-indigo-600/30 border-indigo-500 text-white'
                                  : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {preset.imageUrl ? (
                                <img src={preset.imageUrl} alt="" className="w-3.5 h-3.5 object-contain" />
                              ) : (
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.color }} />
                              )}
                              <span>{preset.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Image and Live Thumbnail Preview */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        সার্ভিস লোগো ও ইমেজ (পিসি আপলোড / প্রিসেট):
                      </label>
                      <div className="flex items-center gap-3 bg-[#050814] p-2.5 rounded-xl border border-white/10">
                        <div className="w-12 h-12 rounded-xl border border-white/10 bg-[#070A13] flex items-center justify-center overflow-hidden shrink-0">
                          {planForm.imageUrl ? (
                            <img
                              src={planForm.imageUrl}
                              alt="Preview"
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <label className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm">
                              <Upload className="w-3.5 h-3.5" />
                              <span>পিসি ফাইল</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    setPlanForm({ ...planForm, imageUrl: reader.result as string });
                                  };
                                  reader.readAsDataURL(file);
                                }}
                              />
                            </label>
                            {planForm.imageUrl && (
                              <button
                                type="button"
                                onClick={() => setPlanForm({ ...planForm, imageUrl: '' })}
                                className="text-[11px] text-rose-400 hover:text-rose-300 py-1 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition"
                              >
                                মুছে ফেলুন
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-[9px] text-slate-400 font-medium">কুইক লোগো:</span>
                            {Object.entries(OFFICIAL_SERVICE_LOGOS).slice(0, 8).map(([key, url]) => (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setPlanForm({ ...planForm, imageUrl: url })}
                                className="px-1.5 py-0.5 rounded bg-white/[0.04] hover:bg-white/10 text-[9px] font-mono text-slate-300 border border-white/10 transition"
                              >
                                {key}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Access Type & Available Seats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">অ্যাক্সেস মোড:</label>
                        <select
                          value={planForm.accessType}
                          onChange={(e) => setPlanForm({ ...planForm, accessType: e.target.value as any })}
                          className="w-full bg-[#050814] border border-white/10 text-white rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                        >
                          <option value="in_app_chat">ইন-অ্যাপ চ্যাট</option>
                          <option value="domain_proxy">ডোমেইন প্রক্সি</option>
                          <option value="credentials">ক্রেডেনশিয়াল / লিংক</option>
                          <option value="api_seat">এপিআই সিট কি</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">মোট সিট সংখ্যা:</label>
                        <input
                          type="number"
                          value={planForm.availableSeats}
                          onChange={(e) => setPlanForm({ ...planForm, availableSeats: Number(e.target.value) })}
                          className="w-full bg-[#050814] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Plan Name, Category, Pricing, Description, Features (7 Cols) */}
                  <div className="lg:col-span-7 space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">প্ল্যানের নাম:</label>
                        <input
                          type="text"
                          required
                          value={planForm.name}
                          onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                          placeholder="যেমন: ChatGPT Plus Dedicated Seat"
                          className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">প্রোভাইডার:</label>
                        <select
                          value={planForm.provider}
                          onChange={(e) => setPlanForm({ ...planForm, provider: e.target.value as any })}
                          className="w-full bg-[#050814] border border-white/10 text-white rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                        >
                          <option value="OpenAI">OpenAI (ChatGPT)</option>
                          <option value="Anthropic">Anthropic (Claude)</option>
                          <option value="Midjourney">Midjourney</option>
                          <option value="Google">Google (Gemini)</option>
                          <option value="Microsoft">Microsoft</option>
                          <option value="Adobe">Adobe</option>
                          <option value="Netflix">Netflix</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">ক্যাটাগরি:</label>
                        <select
                          value={planForm.category}
                          onChange={(e) => setPlanForm({ ...planForm, category: e.target.value as any })}
                          className="w-full bg-[#050814] border border-white/10 text-white rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                        >
                          <option value="AI & Education Tools">AI & Education</option>
                          <option value="Top Picks">Top Picks</option>
                          <option value="OTT & Streaming">OTT & Streaming</option>
                          <option value="Editing Tools">Editing Tools</option>
                          <option value="Microsoft Office">Microsoft Office</option>
                          <option value="Windows">Windows</option>
                          <option value="Software & Productivity">Software & Apps</option>
                          <option value="VPN & Security">VPN & Security</option>
                          <option value="Giftcards">Giftcards</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">বিক্রয় মূল্য (BDT):</label>
                        <input
                          type="number"
                          required
                          value={planForm.priceBDT}
                          onChange={(e) => setPlanForm({ ...planForm, priceBDT: Number(e.target.value) })}
                          className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">মূল্য (USD $):</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={planForm.priceUSD}
                          onChange={(e) => setPlanForm({ ...planForm, priceUSD: Number(e.target.value) })}
                          className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">আসল বাজার মূল্য (BDT):</label>
                        <input
                          type="number"
                          value={planForm.originalPriceBDT}
                          onChange={(e) => setPlanForm({ ...planForm, originalPriceBDT: Number(e.target.value) })}
                          className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">সংক্ষিপ্ত বিবরণ:</label>
                        <input
                          type="text"
                          value={planForm.description}
                          onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                          placeholder="টুলসের মূল সুবিধার এক লাইনের বিবরণ"
                          className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1 flex items-center justify-between">
                        <span>ফিচারসমূহ (প্রতি লাইনে একটি):</span>
                        <span className="text-[10px] text-slate-400">বুলেট পয়েন্ট হিসেবে দেখানো হবে</span>
                      </label>
                      <textarea
                        rows={3}
                        value={planForm.featuresText}
                        onChange={(e) => setPlanForm({ ...planForm, featuresText: e.target.value })}
                        placeholder="GPT-4o ও GPT-4o mini ফুল অ্যাক্সেস&#10;প্ল্যাটফর্মের ভিতরেই ডিরেক্ট প্রাইভেট চ্যাট উইন্ডো&#10;কঠোর প্রাইভেসি ও ফাইল অ্যানালাইসিস"
                        className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer - Fixed at Bottom */}
              <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-white/[0.08] bg-[#070A13]/90 backdrop-blur-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition transform active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: GRANT PLAN TO USER                               */}
      {/* ========================================================= */}
      {selectedUserForGrant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-white/10 rounded-3xl max-w-sm w-full p-6 space-y-4">
            <h4 className="font-bold text-sm text-white">ইউজারকে সরাসরি প্ল্যান ও মেয়াদ দিন</h4>
            
            <div>
              <label className="text-xs text-slate-400 block mb-1">প্ল্যান নির্বাচন করুন:</label>
              <select
                value={planToGrant}
                onChange={(e) => setPlanToGrant(e.target.value)}
                className="w-full bg-[#050814] border border-white/10 text-white rounded-xl px-3 py-2 text-xs"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">মেয়াদকাল (Validity Days):</label>
              <select
                value={grantDays}
                onChange={(e) => setGrantDays(Number(e.target.value))}
                className="w-full bg-[#050814] border border-white/10 text-white rounded-xl px-3 py-2 text-xs font-mono"
              >
                <option value={7}>৭ দিন (ট্রায়াল)</option>
                <option value={15}>১৫ দিন</option>
                <option value={30}>৩০ দিন (১ মাস)</option>
                <option value={90}>৯০ দিন (৩ মাস)</option>
                <option value={365}>৩৬৫ দিন (১ বছর)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedUserForGrant(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleGrantPlanToUser(selectedUserForGrant)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
              >
                নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CREATE NEW USER                                  */}
      {/* ========================================================= */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h4 className="font-bold text-base text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-400" />
              <span>নতুন ইউজার তৈরি করুন</span>
            </h4>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">ইউজার নাম:</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="যেমন: সাকিব আহমেদ"
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">ইমেইল ঠিকানা:</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="sakib@gmail.com"
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">মোবাইল নম্বর (ঐচ্ছিক):</label>
                <input
                  type="text"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  placeholder="017xxxxxxxx"
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">ইউজার রোল:</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                  className="w-full bg-[#050814] border border-white/10 text-white rounded-xl px-3 py-2 text-xs"
                >
                  <option value="user">Regular Customer (সাধারণ গ্রাহক)</option>
                  <option value="reseller">Reseller Partner (রিসেলার পার্টনার)</option>
                  <option value="super_admin">Root Super Admin (সুপার অ্যাডমিন)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                >
                  ইউজার সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3.5: EDIT USER MODAL                                */}
      {/* ========================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-white/10 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <span>{lang === 'bn' ? 'ইউজার তথ্য ও রোল পরিবর্তন' : 'Edit User & Role'}</span>
              </h4>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {lang === 'bn' ? 'ইউজার নাম:' : 'User Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {lang === 'bn' ? 'ইমেইল অ্যাড্রেস:' : 'Email Address:'}
                </label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {lang === 'bn' ? 'মোবাইল নম্বর:' : 'Phone Number:'}
                </label>
                <input
                  type="text"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {lang === 'bn' ? 'অ্যাকাউন্ট রোল (Role):' : 'Account Role:'}
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  className="w-full bg-[#050814] border border-white/10 text-white rounded-xl px-3 py-2 text-xs"
                >
                  <option value="user">Regular Customer (সাধারণ গ্রাহক)</option>
                  <option value="reseller">Reseller Partner (রিসেলার পার্টনার)</option>
                  <option value="super_admin">Root Super Admin (সুপার অ্যাডমিন)</option>
                </select>
              </div>

              {editingUser.role === 'reseller' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {lang === 'bn' ? 'রিসেলার ওয়ালেট ব্যালেন্স (BDT):' : 'Wallet Balance (BDT):'}
                  </label>
                  <input
                    type="number"
                    value={editingUser.walletBalanceBDT || 0}
                    onChange={(e) => setEditingUser({ ...editingUser, walletBalanceBDT: Number(e.target.value) })}
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => {
                    const u = editingUser;
                    setEditingUser(null);
                    handleDeleteUser(u.id, u.name);
                  }}
                  className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'ইউজার মুছুন' : 'Delete'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                  >
                    {lang === 'bn' ? 'আপডেট সংরক্ষণ' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: TOP UP RESELLER BALANCE                          */}
      {/* ========================================================= */}
      {selectedResellerForTopup && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-white/10 rounded-3xl max-w-sm w-full p-6 space-y-4">
            <h4 className="font-bold text-sm text-white">রিসেলারের ওয়ালেটে ব্যালেন্স রিচার্জ করুন</h4>
            
            <div>
              <label className="text-xs text-slate-400 block mb-1">টাকার পরিমাণ (BDT):</label>
              <input
                type="number"
                value={topupAmountBDT}
                onChange={(e) => setTopupAmountBDT(Number(e.target.value))}
                className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold text-emerald-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedResellerForTopup(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                বাতিল
              </button>
              <button
                onClick={handleTopupReseller}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
              >
                রিচার্জ যোগ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: RECEIPT PREVIEW                                  */}
      {/* ========================================================= */}
      {previewOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h4 className="font-bold text-sm text-white">অর্ডার ভাউচার ও রিসিপ্ট</h4>
              <button onClick={() => setPreviewOrder(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono text-white font-bold">{previewOrder.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Customer:</span>
                <span className="text-white">{previewOrder.userName} ({previewOrder.userEmail})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Plan:</span>
                <span className="text-indigo-400 font-bold">{previewOrder.planName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">TrxID:</span>
                <span className="font-mono text-amber-400 font-bold">{previewOrder.trxId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-mono text-emerald-400 font-bold">৳{previewOrder.amountBDT}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Seat Key Issued:</span>
                <span className="font-mono text-white font-bold">{previewOrder.seatKey || 'N/A'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewOrder(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
