import { 
  User, 
  UserRole,
  AISubscriptionPlan, 
  ChatMessage, 
  UserDocument, 
  PaymentOrder, 
  SystemSettings, 
  BusinessGuideTopic,
  CustomerReview,
  FAQItem,
  ResellerClientSale 
} from '../types';

const INITIAL_PLANS: AISubscriptionPlan[] = [
  // Top Picks & AI Tools
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    provider: 'OpenAI',
    category: 'AI & Education Tools',
    description: 'GPT-4o ও DALL-E আনলিমিটেড অ্যাক্সেস, ইন-অ্যাপ চ্যাট এবং নিজস্ব ডোমেইন প্রক্সি ভিউ।',
    iconName: 'chatgpt',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    badge: 'HOT',
    priceBDT: 400,
    priceUSD: 3.50,
    originalPriceBDT: 2450,
    billingCycle: 'monthly',
    features: [
      'GPT-4o ও GPT-4o mini ফুল অ্যাক্সেস',
      'প্ল্যাটফর্মের ভিতরেই ডিরেক্ট প্রাইভেট চ্যাট উইন্ডো',
      'চ্যাটজিপিটি অফিসিয়াল ডোমেইন রিভার্স প্রক্সি',
      'কঠোর প্রাইভেসি: আপনার চ্যাট হিস্ট্রি সম্পূর্ণ গোপন',
      'ডকুমেন্ট ও ফাইল আপলোড করে প্রাইভেট অ্যানালাইসিস'
    ],
    accessType: 'in_app_chat',
    directDomainUrl: 'https://chatgpt.com',
    defaultModelId: 'chatgpt-4o',
    availableSeats: 48,
    totalSold: 312,
    isActive: true,
    brandColor: '#10A37F'
  },
  {
    id: 'canva-pro',
    name: 'Canva Pro',
    provider: 'Other',
    category: 'Editing Tools',
    description: '১০০+ মিলিয়ন প্রিমিয়াম স্টক ফটো, ম্যাজিক রিসাইজ, ব্র্যান্ড কিট এবং ব্যাকগ্রাউন্ড রিমুভার।',
    iconName: 'canva',
    imageUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-canva-3521344-2944747.png',
    badge: 'BEST SELLER',
    priceBDT: 50,
    priceUSD: 0.50,
    originalPriceBDT: 650,
    billingCycle: 'monthly',
    features: [
      'Canva Pro ফুল লাইসেন্স',
      'ম্যাজিক স্টুডিও ও এআই টুলস',
      '১০০+ মিলিয়ন প্রিমিয়াম এলিমেন্টস',
      'ইনস্ট্যান্ট ইনভাইটেশন লিংক ডেলিভারি'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://canva.com',
    defaultModelId: 'general',
    availableSeats: 85,
    totalSold: 940,
    isActive: true,
    brandColor: '#00C4CC'
  },
  {
    id: 'capcut-pro',
    name: 'CapCut Pro',
    provider: 'Other',
    category: 'Editing Tools',
    description: 'প্রিমিয়াম ভিডিও ইফেক্ট, অটো ক্যাপশন, এআই বডি ইফেক্ট এবং 4K এক্সপোর্ট সুবিধা।',
    iconName: 'capcut',
    imageUrl: 'https://cdn.worldvectorlogo.com/logos/capcut-icon.svg',
    badge: 'TRENDING',
    priceBDT: 300,
    priceUSD: 2.50,
    originalPriceBDT: 1200,
    billingCycle: 'monthly',
    features: [
      'CapCut Pro প্রিমিয়াম ইফেক্টস',
      'অটো-ক্যাপশন ও এআই সাবটাইটেল',
      'উইন্ডোজ, ম্যাক ও মোবাইল সাপোর্ট',
      'নো ওয়াটারমার্ক 4K এক্সপোর্ট'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://capcut.com',
    defaultModelId: 'general',
    availableSeats: 35,
    totalSold: 420,
    isActive: true,
    brandColor: '#000000'
  },
  {
    id: 'gemini-advance',
    name: 'Gemini Advance (AI Pro)',
    provider: 'Google',
    category: 'AI & Education Tools',
    description: 'গুগলের শক্তিশালী Gemini 1.5 Pro ও আল্ট্রা মডেলের আনলিমিটেড অ্যাক্সেস ও ২ মিলিয়ন টোকেন।',
    iconName: 'gemini',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
    badge: 'POPULAR',
    priceBDT: 250,
    priceUSD: 2.20,
    originalPriceBDT: 2400,
    billingCycle: 'monthly',
    features: [
      'Gemini 1.5 Pro ও Flash লাইভ ইঞ্জিন',
      'ইন-প্ল্যাটফর্ম প্রাইভেট চ্যাট উইন্ডো',
      'বড় বই ও ডেটাসেট পড়ার ক্ষমতা',
      'গুগল ওয়ার্কস্পেস ইন্টিগ্রেশন'
    ],
    accessType: 'in_app_chat',
    directDomainUrl: 'https://gemini.google.com',
    defaultModelId: 'chatgpt-4o',
    availableSeats: 60,
    totalSold: 215,
    isActive: true,
    brandColor: '#4285F4'
  },
  {
    id: 'claude-ai-pro',
    name: 'Claude AI Pro',
    provider: 'Anthropic',
    category: 'AI & Education Tools',
    description: 'বিশ্বের এক নম্বর রেটিংপ্রাপ্ত Claude 3.5 Sonnet ইঞ্জিন, কোডিং ও দীর্ঘ লেখার জন্য সেরা।',
    iconName: 'claude',
    imageUrl: 'https://anthropic.com/images/icons/apple-touch-icon.png',
    badge: 'VIP',
    priceBDT: 2650,
    priceUSD: 22.00,
    originalPriceBDT: 4000,
    billingCycle: 'monthly',
    features: [
      'Claude 3.5 Sonnet প্রো ফিচারসমূহ',
      '200,000 টোকেন কনটেক্সট ক্যাপাসিটি',
      'ইন-প্ল্যাটফর্ম চ্যাট ও প্রাইভেট স্পেস',
      'আর্টিফ্যাক্টস ইন্টারেক্টিভ উইন্ডো'
    ],
    accessType: 'in_app_chat',
    directDomainUrl: 'https://claude.ai',
    defaultModelId: 'claude-3-5',
    availableSeats: 12,
    totalSold: 130,
    isActive: true,
    brandColor: '#D97706'
  },
  {
    id: 'midjourney-sub',
    name: 'Midjourney Subscription',
    provider: 'Midjourney',
    category: 'AI & Education Tools',
    description: 'ফটোরিয়ালিস্টিক আর্ট, লোগো ও প্রোডাক্ট ডিজাইনের জন্য Midjourney v6.1 ফাস্ট মোড।',
    iconName: 'midjourney',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
    badge: 'ARTIST CHOICE',
    priceBDT: 1550,
    priceUSD: 13.00,
    originalPriceBDT: 3600,
    billingCycle: 'monthly',
    features: [
      'Midjourney v6.1 ও Niji v6',
      'ইন-প্ল্যাটফর্ম প্রম্পট ক্রাফটার',
      'প্রাইভেট ডিসকর্ড সার্ভার সিট',
      'কমার্শিয়াল ইউসেজ রাইটস'
    ],
    accessType: 'domain_proxy',
    directDomainUrl: 'https://discord.com',
    defaultModelId: 'midjourney-prompter',
    availableSeats: 18,
    totalSold: 190,
    isActive: true,
    brandColor: '#7C3AED'
  },
  {
    id: 'netflix-subscription',
    name: 'Netflix Subscription',
    provider: 'Netflix',
    category: 'OTT & Streaming',
    description: 'Ultra HD 4K প্রিমিয়াম স্ক্রিন, বাংলা সাবটাইটেল এবং টিভি/মোবাইল সাপোর্ট।',
    iconName: 'netflix',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    badge: 'POPULAR',
    priceBDT: 350,
    priceUSD: 3.00,
    originalPriceBDT: 1200,
    billingCycle: 'monthly',
    features: [
      'Ultra HD (4K) কোয়ালিটি',
      'পার্সোনাল প্রোফাইল উইথ পিন লক',
      'স্মার্ট টিভি, ল্যাপটপ ও ফোন সাপোর্ট',
      '৩০ দিনের ফুল ওয়ারেন্টি'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://netflix.com',
    defaultModelId: 'general',
    availableSeats: 40,
    totalSold: 850,
    isActive: true,
    brandColor: '#E50914'
  },
  {
    id: 'prime-video',
    name: 'Prime Video Subscription',
    provider: 'Other',
    category: 'OTT & Streaming',
    description: 'অ্যামাজন প্রাইম ভিডিওর সমস্ত প্রিমিয়াম মুভি ও সিরিজ আনলিমিটেড দেখার সুযোগ।',
    iconName: 'Tv',
    badge: 'BEST VALUE',
    priceBDT: 120,
    priceUSD: 1.00,
    originalPriceBDT: 400,
    billingCycle: 'monthly',
    features: [
      'Full HD ও 4K স্ট্রিমিং',
      'পার্সোনাল প্রোফাইল সাপোর্ট',
      'অফলাইন ডাউনলোড সুবিধা',
      '৩০ দিনের রিপ্লেসমেন্ট ওয়ারেন্টি'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://primevideo.com',
    defaultModelId: 'general',
    availableSeats: 50,
    totalSold: 410,
    isActive: true,
    brandColor: '#00A8E1'
  },
  {
    id: 'netflix-prime-crunchy-combo',
    name: 'Netflix + Prime + Crunchyroll Combo Pack',
    provider: 'Netflix',
    category: 'OTT & Streaming',
    description: 'এক সাথে নেটফ্লিক্স, প্রাইম ভিডিও এবং ক্রাঞ্চিরোল এর মেগা স্ট্রিমিং কম্বো প্যাক।',
    iconName: 'Crown',
    badge: 'SUPER COMBO',
    priceBDT: 500,
    priceUSD: 4.50,
    originalPriceBDT: 1800,
    billingCycle: 'monthly',
    features: [
      '৩টি জনপ্রিয় স্ট্রিমিং সার্ভিস একসাথে',
      'আল্ট্রা এইচডি কোয়ালিটি ও প্রাইভেট প্রোফাইল',
      'অ্যানিমে ও হলিউড মুভি আনলিমিটেড',
      '৩০ দিনের ফুল গ্যারান্টি'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://netflix.com',
    defaultModelId: 'general',
    availableSeats: 25,
    totalSold: 560,
    isActive: true,
    brandColor: '#E50914'
  },
  {
    id: 'crunchyroll-premium',
    name: 'Crunchyroll Premium',
    provider: 'Other',
    category: 'OTT & Streaming',
    description: 'জাপানি প্রিমিয়াম অ্যানিমে শো, বিজ্ঞাপনমুক্ত স্ট্রিমিং ও সিমুলকাস্ট পর্ব।',
    iconName: 'Tv',
    badge: 'ANIME',
    priceBDT: 120,
    priceUSD: 1.00,
    originalPriceBDT: 350,
    billingCycle: 'monthly',
    features: [
      'অ্যাড-ফ্রি অ্যানিমে স্ট্রিমিং',
      'জাপানের একই দিনে নতুন এপিসোড',
      'ফুল এইচডি 1080p কোয়ালিটি'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://crunchyroll.com',
    defaultModelId: 'general',
    availableSeats: 30,
    totalSold: 280,
    isActive: true,
    brandColor: '#F47521'
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium',
    provider: 'Google',
    category: 'OTT & Streaming',
    description: 'বিজ্ঞাপনমুক্ত ইউটিউব ভিডিও, ব্যাকগ্রাউন্ড প্লে এবং ইউটিউব মিউজিক প্রিমিয়াম।',
    iconName: 'Play',
    badge: 'HOT',
    priceBDT: 50,
    priceUSD: 0.50,
    originalPriceBDT: 250,
    billingCycle: 'monthly',
    features: [
      '১০০% অ্যাড-ফ্রি ভিডিও',
      'ব্যাকগ্রাউন্ড প্লে ও পিকচার-ইন-পিকচার',
      'ইউটিউব মিউজিক আনলিমিটেড',
      'নিজস্ব জিমেইল ইনভাইটেশন'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://youtube.com',
    defaultModelId: 'general',
    availableSeats: 90,
    totalSold: 1200,
    isActive: true,
    brandColor: '#FF0000'
  },
  {
    id: 'nordvpn-subscription',
    name: 'NordVPN Subscription',
    provider: 'Other',
    category: 'VPN & Security',
    description: 'বিশ্বের দ্রুততম ভিপিএন, হাই-স্পিড সিকিউর ব্রাউজিং এবং স্ট্রিমিং আনব্লকার।',
    iconName: 'Shield',
    badge: 'FASTEST',
    priceBDT: 150,
    priceUSD: 1.30,
    originalPriceBDT: 600,
    billingCycle: 'monthly',
    features: [
      '৬০০০+ হাই স্পিড সার্ভার',
      'ম্যালওয়্যার ও ট্র্যাকার প্রোটেকশন',
      'উইন্ডোজ, ম্যাক, অ্যান্ড্রয়েড ও আইওএস'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://nordvpn.com',
    defaultModelId: 'general',
    availableSeats: 45,
    totalSold: 390,
    isActive: true,
    brandColor: '#4687FF'
  },
  {
    id: 'surfshark-vpn',
    name: 'SurfShark VPN Subscription',
    provider: 'Other',
    category: 'VPN & Security',
    description: 'আনলিমিটেড ডিভাইস কানেকশন, ক্লিনওয়েব অ্যাডব্লকার এবং সুপারফাস্ট স্পিড।',
    iconName: 'Shield',
    badge: 'UNLIMITED',
    priceBDT: 150,
    priceUSD: 1.30,
    originalPriceBDT: 650,
    billingCycle: 'monthly',
    features: [
      'আনলিমিটেড ডিভাইস এক্সেস',
      'ক্লিনওয়েব অ্যাড ও ট্র্যাকার ব্লকার',
      'নো লগ পলিসি ভেরিফাইড'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://surfshark.com',
    defaultModelId: 'general',
    availableSeats: 35,
    totalSold: 210,
    isActive: true,
    brandColor: '#1FA9AC'
  },
  {
    id: 'win10-pro-key',
    name: 'Windows 10 Pro Licence Key',
    provider: 'Microsoft',
    category: 'Windows',
    description: 'লাইফটাইম ওরিজিনাল মাইক্রোসফট উইন্ডোজ ১০ প্রো জেনুইন রিটেল অ্যাক্টিভেশন কি।',
    iconName: 'Cpu',
    badge: 'LIFETIME',
    priceBDT: 450,
    priceUSD: 3.90,
    originalPriceBDT: 850,
    billingCycle: 'lifetime',
    features: [
      '১০০% জেনুইন অফিশিয়াল অ্যাক্টিভেশন',
      'লাইফটাইম মেয়াদ ও আপডেট সুবিধা',
      '১ পিসি অ্যাক্টিভেশন রিটেল কি'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://microsoft.com',
    defaultModelId: 'general',
    availableSeats: 70,
    totalSold: 650,
    isActive: true,
    brandColor: '#0078D7'
  },
  {
    id: 'win11-pro-key',
    name: 'Windows 11 Pro Licence Key',
    provider: 'Microsoft',
    category: 'Windows',
    description: 'মাইক্রোসফট উইন্ডোজ ১১ প্রো লেটেস্ট ওএস জেনুইন লাইফটাইম লাইসেন্স কি।',
    iconName: 'Cpu',
    badge: 'GENUINE',
    priceBDT: 450,
    priceUSD: 3.90,
    originalPriceBDT: 950,
    billingCycle: 'lifetime',
    features: [
      'উইন্ডোজ ১১ প্রো অফিশিয়াল লাইসেন্স',
      'লাইফটাইম ভ্যালিডিটি ও সাপোর্ট',
      'ইনস্ট্যান্ট ডিজিটাল ডেলিভারি'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://microsoft.com',
    defaultModelId: 'general',
    availableSeats: 65,
    totalSold: 580,
    isActive: true,
    brandColor: '#0078D7'
  },
  {
    id: 'office-2021-pro',
    name: 'Microsoft Office 2021 Pro Plus',
    provider: 'Microsoft',
    category: 'Microsoft Office',
    description: 'Word, Excel, PowerPoint, Outlook সহ কমপ্লিট অফিস স্যুট জেনুইন লাইফটাইম কি।',
    iconName: 'FileText',
    badge: 'OFFICE PRO',
    priceBDT: 499,
    priceUSD: 4.20,
    originalPriceBDT: 2000,
    billingCycle: 'lifetime',
    features: [
      'Word, Excel, PowerPoint, Outlook',
      '১ পিসির জন্য লাইফটাইম লাইসেন্স',
      'অফিশিয়াল সেটআপ ডাউনলোড লিংক'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://office.com',
    defaultModelId: 'general',
    availableSeats: 50,
    totalSold: 710,
    isActive: true,
    brandColor: '#D83B01'
  },
  {
    id: 'office-365',
    name: 'Microsoft Office 365 Subscription',
    provider: 'Microsoft',
    category: 'Microsoft Office',
    description: '৫টি ডিভাইসে ব্যবহার, ১ টেরাবাইট ক্লাউড ওয়ানড্রাইভ স্টোরেজ ও লেটেস্ট আপডেট।',
    iconName: 'Cloud',
    badge: 'CLOUD 1TB',
    priceBDT: 600,
    priceUSD: 5.00,
    originalPriceBDT: 1200,
    billingCycle: 'monthly',
    features: [
      '৫টি ডিভাইসে অ্যাক্টিভেশন (PC/Mac/Phone)',
      '1TB OneDrive ক্লাউড স্টোরেজ',
      'সর্বদা লেটেস্ট অফিস অ্যাপস আপডেট'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://office.com',
    defaultModelId: 'general',
    availableSeats: 30,
    totalSold: 340,
    isActive: true,
    brandColor: '#EA3E23'
  },
  {
    id: 'grammarly-premium',
    name: 'Grammarly Premium',
    provider: 'Other',
    category: 'AI & Education Tools',
    description: 'এডভান্সড গ্রামার চেকার, প্লেজিয়ারিজম ডিটেক্টর এবং এআই রিরাইটিং সাজেশন।',
    iconName: 'FileText',
    badge: 'STUDENT CHOICE',
    priceBDT: 190,
    priceUSD: 1.60,
    originalPriceBDT: 650,
    billingCycle: 'monthly',
    features: [
      'এডভান্সড গ্রামার ও টোন ডিটেকশন',
      'প্লেজিয়ারিজম চেকার সুবিধা',
      'ব্রাউজার এক্সটেনশন ও এমএস ওয়ার্ড সাপোর্ট'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://grammarly.com',
    defaultModelId: 'general',
    availableSeats: 55,
    totalSold: 460,
    isActive: true,
    brandColor: '#15C39A'
  },
  {
    id: 'quillbot-premium',
    name: 'QuillBot Premium',
    provider: 'Other',
    category: 'AI & Education Tools',
    description: 'আনলিমিটেড প্যারাফ্রেজিং, কো-রাইটার, সামারাইজার ও একাডেমিক রাইটিং অ্যাসিস্ট্যান্ট।',
    iconName: 'Edit3',
    badge: 'POPULAR',
    priceBDT: 200,
    priceUSD: 1.70,
    originalPriceBDT: 700,
    billingCycle: 'monthly',
    features: [
      'আনলিমিটেড শব্দ প্যারাফ্রেজ',
      'সমস্ত প্রিমিয়াম মোডস আনলকড',
      'দ্রুততম প্রসেসিং স্পিড'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://quillbot.com',
    defaultModelId: 'general',
    availableSeats: 60,
    totalSold: 530,
    isActive: true,
    brandColor: '#4CA154'
  },
  {
    id: 'elevenlabs-premium',
    name: 'ElevenLabs Premium Subscription',
    provider: 'Other',
    category: 'AI & Education Tools',
    description: 'বিশ্বের সবচেয়ে বাস্তবসম্মত এআই ভয়েস জেনারেটর, ভয়েস ক্লোনিং ও টেক্সট-টু-স্পিচ।',
    iconName: 'Mic',
    badge: 'VOICE AI',
    priceBDT: 650,
    priceUSD: 5.50,
    originalPriceBDT: 1800,
    billingCycle: 'monthly',
    features: [
      'প্রিমিয়াম ফটোরিয়ালিস্টিক এআই ভয়েস',
      'কাস্টম ভয়েস ক্লোনিং ফিচার',
      'বাংলা ও ইংরেজি উভয় ভাষায় উচ্চারণ'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://elevenlabs.io',
    defaultModelId: 'general',
    availableSeats: 20,
    totalSold: 180,
    isActive: true,
    brandColor: '#000000'
  },
  {
    id: 'freepik-premium',
    name: 'Freepik Premium',
    provider: 'Other',
    category: 'Editing Tools',
    description: 'মিলিয়ন ভেক্টর, পিএসডি, আইকন, স্টক ফটো এবং কমার্শিয়াল লাইসেন্স ডাউনলোডার।',
    iconName: 'Image',
    badge: 'DESIGNER',
    priceBDT: 450,
    priceUSD: 3.80,
    originalPriceBDT: 1200,
    billingCycle: 'monthly',
    features: [
      'দৈনিক আনলিমিটেড প্রিমিয়াম ডাউনলোড',
      'প্রিমিয়াম পিএসডি ও ভেক্টর ফাইল',
      'কমার্শিয়াল ইউসেজ লাইসেন্স'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://freepik.com',
    defaultModelId: 'general',
    availableSeats: 40,
    totalSold: 320,
    isActive: true,
    brandColor: '#1273EB'
  },
  {
    id: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud',
    provider: 'Adobe',
    category: 'Editing Tools',
    description: 'Photoshop, Illustrator, Premiere Pro, After Effects সহ সমস্ত এডোবি অ্যাপস।',
    iconName: 'Palette',
    badge: 'ALL APPS',
    priceBDT: 650,
    priceUSD: 5.50,
    originalPriceBDT: 4500,
    billingCycle: 'monthly',
    features: [
      'সমস্ত এডোবি প্রিমিয়াম অ্যাপস অ্যাক্সেস',
      'জেনারেটিভ ফিল ও এআই সুবিধা',
      'উইন্ডোজ ও ম্যাক ওএস সাপোর্ট'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://adobe.com',
    defaultModelId: 'general',
    availableSeats: 25,
    totalSold: 290,
    isActive: true,
    brandColor: '#FA0F00'
  },
  {
    id: 'idm-lifetime',
    name: 'Internet Download Manager (IDM) - Lifetime Licence',
    provider: 'Other',
    category: 'Software & Productivity',
    description: 'অফিশিয়াল ইন্টারনেট ডাউনলোড ম্যানেজার অরিজিনাল লাইফটাইম লাইসেন্স কি।',
    iconName: 'Download',
    badge: 'LIFETIME',
    priceBDT: 2050,
    priceUSD: 17.50,
    originalPriceBDT: 3700,
    billingCycle: 'lifetime',
    features: [
      '৫ গুণ দ্রুত ডাউনলোড স্পিড',
      'লাইফটাইম অফিশিয়াল অ্যাক্টিভেশন',
      '৩ বছরের ফ্রি সফটওয়্যার আপডেট'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://internetdownloadmanager.com',
    defaultModelId: 'general',
    availableSeats: 35,
    totalSold: 310,
    isActive: true,
    brandColor: '#2B68B3'
  },
  {
    id: 'google-drive-storage',
    name: 'Google Drive Storage Subscription',
    provider: 'Google',
    category: 'Software & Productivity',
    description: 'আপনার ব্যক্তিগত জিমেইলে 2TB গুগল ড্রাইভ ও গুগল ফটোস ক্লাউড স্টোরেজ।',
    iconName: 'HardDrive',
    badge: '2TB CLOUD',
    priceBDT: 250,
    priceUSD: 2.10,
    originalPriceBDT: 850,
    billingCycle: 'monthly',
    features: [
      'আপনার নিজস্ব জিমেইল অ্যাকাউন্টে অ্যাক্টিভেশন',
      'Google Photos ও Drive ফুল ব্যাকআপ',
      '১০০% নিরাপদ ও পার্সোনাল'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://drive.google.com',
    defaultModelId: 'general',
    availableSeats: 50,
    totalSold: 490,
    isActive: true,
    brandColor: '#34A853'
  },
  {
    id: 'apple-itunes-giftcard',
    name: 'Apple iTunes Gift Card ($5)',
    provider: 'Other',
    category: 'Giftcards',
    description: 'ইউএস অ্যাপল অ্যাপ স্টোর, আইক্লাউড স্টোরেজ এবং ইন-অ্যাপ পার্চেজের জন্য গিফট কার্ড।',
    iconName: 'CreditCard',
    badge: 'GIFTCARD',
    priceBDT: 700,
    priceUSD: 6.00,
    originalPriceBDT: 850,
    billingCycle: 'lifetime',
    features: [
      '১০০% অফিশিয়াল অ্যাপল ডিজিটাল কোড',
      'US অ্যাপল আইডি রিডিম সুবিধা',
      'ইনস্ট্যান্ট কোড ডেলিভারি'
    ],
    accessType: 'credentials',
    directDomainUrl: 'https://apple.com',
    defaultModelId: 'general',
    availableSeats: 40,
    totalSold: 210,
    isActive: true,
    brandColor: '#000000'
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'শিশির বাড়ৈ (সুপার অ্যাডমিন)',
    email: 'shishirbarai01982708789@gmail.com',
    phone: '01982708789',
    role: 'super_admin',
    avatar: '',
    currentPlanId: 'chatgpt-plus',
    subscriptionStartDate: '2026-01-01',
    subscriptionExpiry: '2027-12-31',
    tokenUsage: 12450,
    maxTokens: 500000,
    activeSeatKey: 'NEXUS-ADMIN-SUPREME',
    joinedAt: '2026-01-01'
  },
  {
    id: 'user_reseller',
    name: 'রাকিবুল হাসান (অনুমোদিত রিসেলার)',
    email: 'rakib.reseller@gmail.com',
    phone: '01933445566',
    role: 'reseller',
    avatar: '',
    currentPlanId: 'chatgpt-plus',
    subscriptionStartDate: '2026-02-01',
    subscriptionExpiry: '2027-02-01',
    tokenUsage: 3500,
    maxTokens: 500000,
    activeSeatKey: 'NEXUS-RESELLER-GOLD',
    joinedAt: '2026-02-01',
    walletBalanceBDT: 14500,
    resellerDiscountPercent: 25
  },
  {
    id: 'user_shishir',
    name: 'শিশির বাড়ৈ (কাস্টমার অ্যাকাউন্ট)',
    email: 'shishirbarai01982708789@gmail.com',
    phone: '01982708789',
    role: 'user',
    avatar: '',
    currentPlanId: 'chatgpt-plus',
    subscriptionStartDate: '2026-10-10',
    subscriptionExpiry: '2026-11-15',
    tokenUsage: 4520,
    maxTokens: 500000,
    activeSeatKey: 'NEXUS-GPT4-99824',
    joinedAt: '2026-02-15'
  },
  {
    id: 'user_nusrat',
    name: 'নুসরাত জাহান (কাস্টমার - মেয়াদ শেষ)',
    email: 'nusrat.designer@gmail.com',
    phone: '01855667788',
    role: 'user',
    avatar: '',
    currentPlanId: 'canva-pro',
    subscriptionStartDate: '2026-09-01',
    subscriptionExpiry: '2026-10-01',
    tokenUsage: 450,
    maxTokens: 10000,
    activeSeatKey: 'NEXUS-CANVA-EXPIRED',
    joinedAt: '2026-03-01'
  }
];

const INITIAL_RESELLER_SALES: ResellerClientSale[] = [
  {
    id: 'RS-101',
    resellerId: 'user_reseller',
    clientName: 'হাসান মাহমুদ (সফটওয়্যার ইঞ্জিনিয়ার)',
    clientPhone: '01799887766',
    clientEmail: 'hasan.code@gmail.com',
    planId: 'chatgpt-plus',
    planName: 'ChatGPT Plus (GPT-4o)',
    durationDays: 30,
    durationLabel: '১ মাস (৩০ দিন)',
    startDate: '2026-10-05',
    expiryDate: '2026-11-04',
    seatKey: 'RES-GPT4-H7812',
    wholesaleCostBDT: 300,
    sellingPriceBDT: 450,
    profitBDT: 150,
    status: 'active',
    createdAt: '2026-10-05 11:20:00',
    credentialsOrUrl: 'https://chatgpt.com (SSO Token: RES-GPT4-H7812)'
  },
  {
    id: 'RS-102',
    resellerId: 'user_reseller',
    clientName: 'সায়মা আক্তার (গ্রাফিক্স ডিজাইনার)',
    clientPhone: '01822334455',
    clientEmail: 'sayma.arts@gmail.com',
    planId: 'canva-pro',
    planName: 'Canva Pro Full License',
    durationDays: 365,
    durationLabel: '১ বছর (৩৬৫ দিন)',
    startDate: '2026-06-01',
    expiryDate: '2027-05-31',
    seatKey: 'RES-CANVA-S9011',
    wholesaleCostBDT: 400,
    sellingPriceBDT: 650,
    profitBDT: 250,
    status: 'active',
    createdAt: '2026-06-01 16:45:00',
    credentialsOrUrl: 'ইনভাইটেশন লিংক: canva.com/join/res-s9011'
  },
  {
    id: 'RS-103',
    resellerId: 'user_reseller',
    clientName: 'আরিফ হোসেন (ডিজিটাল মার্কেটার)',
    clientPhone: '01911447788',
    clientEmail: 'arif.agency@gmail.com',
    planId: 'capcut-pro',
    planName: 'CapCut Pro VIP',
    durationDays: 7,
    durationLabel: '৭ দিন (ট্রায়াল)',
    startDate: '2026-10-01',
    expiryDate: '2026-10-08',
    seatKey: 'RES-CAP-A4432',
    wholesaleCostBDT: 100,
    sellingPriceBDT: 180,
    profitBDT: 80,
    status: 'expired',
    createdAt: '2026-10-01 09:15:00',
    credentialsOrUrl: 'CapCut VIP Seat: RES-CAP-A4432'
  }
];

const INITIAL_ORDERS: PaymentOrder[] = [
  {
    id: 'ORD-9821',
    userId: 'user_shishir',
    userName: 'শিশির বাড়ৈ',
    userEmail: 'shishirbarai01982708789@gmail.com',
    planId: 'chatgpt-plus',
    planName: 'ChatGPT Plus',
    amountBDT: 400,
    amountUSD: 3.50,
    method: 'bkash',
    senderNumber: '01982708789',
    trxId: 'BK9A87XYZ4',
    status: 'approved',
    createdAt: '2026-10-10 14:32:00',
    approvedAt: '2026-10-10 14:35:12',
    seatKey: 'NEXUS-GPT4-99824',
    note: 'অটোমেটিক ভেরিফাইড এবং অ্যাক্টিভেটেড'
  },
  {
    id: 'ORD-9822',
    userId: 'user_nusrat',
    userName: 'নুসরাত জাহান',
    userEmail: 'nusrat.designer@gmail.com',
    planId: 'canva-pro',
    planName: 'Canva Pro',
    amountBDT: 50,
    amountUSD: 0.50,
    method: 'nagad',
    senderNumber: '01855667788',
    trxId: 'NG547289QX',
    status: 'pending',
    createdAt: '2026-10-14 11:20:00',
    seatKey: 'NEXUS-CANVA-88',
    note: 'অ্যাডমিন রিভিউ অপেক্ষমান'
  }
];

const INITIAL_SETTINGS: SystemSettings = {
  appName: 'OmniCraft AI',
  brandPrefix: 'OmniCraft',
  brandSuffix: 'AI',
  logoUrl: '',
  brandTagline: 'All-in-One Smartest AI Workspace & Subscription Hub',
  brandTaglineBn: 'বিশ্বমানের কৃত্রিম বুদ্ধিমত্তা ও প্রিমিয়াম ডিজিটাল টুলস হাব',
  announcementText: '★ OmniCraft AI Workspace Live: ChatGPT, Claude, Gemini, Midjourney ও Grok এক ছাদের নিচে!',
  usaShowcaseTitle: 'OmniCraft AI Official Workspace (ইউএসএ ফিচার লাইভ পেজ)',
  showcaseYoutubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  badgeText: 'NEW v4.5 LIVE',
  primaryColor: 'indigo',
  logoIcon: 'Sparkles',
  customDomain: 'omnicraft.ai',
  defaultCreditPercentage: 100,
  bkashMerchant: '01982708789',
  nagadMerchant: '01982708789',
  rocketMerchant: '01982708789',
  upayMerchant: '01982708789',
  autoApprovePayments: true,
  currency: 'BDT',
  bdtToUsdRate: 122,
  chatgptProxyUrl: 'https://chatgpt.com',
  supportPhone: '+880 1982-708789',
  supportEmail: 'support@omnicraft.ai',
  enableUsaFeaturePage: true,
  enableInAppChat: true,
  enableDomainProxy: true,
  enableResellerNetwork: true,
  enableFloatingChat: true,
  enableHeaderMarquee: true,
  facebookPixelId: '',
  enableFacebookPixel: false
};

const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev_1',
    name: 'Sajinur Rahman Sajid',
    avatar: 'SR',
    rating: 5,
    verified: true,
    date: '২ দিন আগে',
    commentBn: 'অসাধারণ সার্ভিস! বিকাশ দিয়ে পেমেন্ট করার ৫ মিনিটের মধ্যেই ChatGPT Plus একটিভ হয়ে গেছে। ইন-অ্যাপ চ্যাট খুব ফাস্ট কাজ করে।',
    productName: 'ChatGPT Plus'
  },
  {
    id: 'rev_2',
    name: 'Debadrita Roy',
    avatar: 'DR',
    rating: 5,
    verified: true,
    date: '৩ দিন আগে',
    commentBn: 'Canva Pro মাত্র ৫০ টাকায় পেলাম! সাথে সাথে ইনভাইট পেয়েছি। এদের সার্ভিস ১০০% ট্রাস্টেড। ধন্যবাদ টিমকে।',
    productName: 'Canva Pro'
  },
  {
    id: 'rev_3',
    name: 'Alif Hasan',
    avatar: 'AH',
    rating: 5,
    verified: true,
    date: '১ সপ্তাহ আগে',
    commentBn: 'গিটহাব কোডিং ও গবেষণার জন্য Claude 3.5 Sonnet নিয়েছি। প্রাইভেসি সুরক্ষা অনেক ভালো, অন্য কেউ আমার কোড দেখতে পায় না।',
    productName: 'Claude AI Pro'
  },
  {
    id: 'rev_4',
    name: 'Tarek Jamil',
    avatar: 'TJ',
    rating: 5,
    verified: true,
    date: '৫ দিন আগে',
    commentBn: 'নেটফ্লিক্স + প্রাইম কম্বো প্যাক নিয়েছি। ফোর-কে কোয়ালিটি কোনো বাফারিং ছাড়াই চলে। কাস্টমার সাপোর্ট অনেক ফ্রেন্ডলি।',
    productName: 'Netflix + Prime Combo'
  }
];

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq_1',
    questionBn: 'অর্ডার করার কতক্ষণ পর ডেলিভারি পাব?',
    answerBn: 'আমাদের সিস্টেমে বিকাশ বা নগদ TrxID ভেরিফিকেশনের পর অধিকাংশ ডিজিটাল প্রোডাক্ট ও এআই সাবস্ক্রিপশন তাৎক্ষণিক (১ থেকে ৫ মিনিটের মধ্যে) স্বয়ংক্রিয়ভাবে সক্রিয় হয়ে যায়। এছাড়া হোয়াটসঅ্যাপে হেল্পলাইন সর্বদা সচল থাকে।'
  },
  {
    id: 'faq_2',
    questionBn: 'প্রোডাক্টগুলো কি ১০০% অফিসিয়াল ও অরিজিনাল?',
    answerBn: 'হ্যাঁ, প্রতিটি সাবস্ক্রিপশন এবং লাইসেন্স কি অফিশিয়াল প্রোভাইডার থেকে সংগ্রহকৃত এবং ফুল মেয়াদের রিপ্লেসমেন্ট ওয়ারেন্টি দ্বারা সুরক্ষিত।'
  },
  {
    id: 'faq_3',
    questionBn: 'পেমেন্ট কীভাবে করব?',
    answerBn: 'আপনি সরাসরি বিকাশ, নগদ, রকেট অথবা কার্ডের মাধ্যমে পেমেন্ট করতে পারেন। পণ্য পছন্দ করে "সাবস্ক্রাইব করুন" বাটনে চাপলে স্ক্রিনে মার্চেন্ট নাম্বার ও বিস্তারিত নির্দেশিকা দেখতে পাবেন।'
  },
  {
    id: 'faq_4',
    questionBn: 'ইউজারদের চ্যাট বা ফাইল কি অন্য কেউ দেখতে পারবে?',
    answerBn: 'না! আমাদের প্ল্যাটফর্ম জিরো-নলেজ মাল্টি-টেন্যান্ট এনক্রিপশনে পরিচালিত। প্রতিটি ইউজারের চ্যাট ও ডকুমেন্ট সম্পূর্ণ আলাদা ভল্টে সংরক্ষিত হয়, যা অন্য কোনো ইউজার বা অ্যাডমিন দেখতে পারে না।'
  },
  {
    id: 'faq_5',
    questionBn: 'সাবস্ক্রিপশনের মেয়াদ শেষ হলে কি রিনিউ করা যাবে?',
    answerBn: 'হ্যাঁ, মেয়াদ শেষ হওয়ার আগে বা পরে ড্যাশবোর্ড থেকে সহজেই রিনিউ করতে পারবেন।'
  }
];

const BUSINESS_GUIDES: BusinessGuideTopic[] = [
  {
    id: 'guide-sourcing-models',
    titleBn: 'এআই ও ডিজিটাল সাবস্ক্রিপশন রিসেলিং বিজনেস মডেল',
    titleEn: 'Digital Subscription Reselling Business Models & Sourcing',
    tag: 'বিজনেস মডেল',
    readTime: '৬ মিনিট',
    descriptionBn: 'কিভাবে পাইকারি রেটে ChatGPT, Canva, Netflix সোর্স করে লাভজনকভাবে বিক্রি করবেন।',
    descriptionEn: 'How to source OpenAI, Canva, and streaming licenses at bulk rates.',
    keyPointsBn: [
      'OpenAI Team ও Enterprise সিট সোর্সিং মেথড',
      'ইন-অ্যাপ প্রাইভেট প্রক্সির মাধ্যমে কাস্টমার ডেটা সুরক্ষিত রাখা',
      'বিকাশ ও নগদের মাধ্যমে স্থানীয় গ্রাহকদের কাছে সহজ পেমেন্ট'
    ],
    keyPointsEn: [
      'OpenAI Team Workspace aggregation',
      'API Proxy & Token quota reselling',
      'Session token protection without password exposure'
    ],
    fullGuideMarkdownBn: `### ডিজিটাল সাবস্ক্রিপশন রিসেলিং ব্লুপ্রিন্ট\n\nবাংলাদেশে ডিজিটাল প্রোডাক্ট ও এআই টুলের ব্যাপক চাহিদা রয়েছে। বিকাশ ও নগদে সুলভ মূল্যে সাবস্ক্রিপশন প্রদান করে প্রতি মাসে ৫০,০০০ - ১,০০,০০০+ টাকা নিট প্রফিট করা সম্ভব।`
  }
];

class StorageService {
  getPlans(): AISubscriptionPlan[] {
    const raw = localStorage.getItem('nexus_plans_v2');
    if (!raw) {
      localStorage.setItem('nexus_plans_v2', JSON.stringify(INITIAL_PLANS));
      return INITIAL_PLANS;
    }
    try {
      const parsed: AISubscriptionPlan[] = JSON.parse(raw);
      // Auto-supplement missing imageUrl or iconName from initial presets
      return parsed.map((p) => {
        if (!p.imageUrl) {
          const match = INITIAL_PLANS.find((init) => init.id === p.id);
          if (match?.imageUrl) {
            return { ...p, imageUrl: match.imageUrl };
          }
        }
        return p;
      });
    } catch {
      return INITIAL_PLANS;
    }
  }

  savePlans(plans: AISubscriptionPlan[]): void {
    localStorage.setItem('nexus_plans_v2', JSON.stringify(plans));
  }

  addPlan(plan: AISubscriptionPlan): void {
    const plans = this.getPlans();
    plans.unshift(plan);
    this.savePlans(plans);
  }

  createPlan(plan: AISubscriptionPlan): void {
    this.addPlan(plan);
  }

  updatePlan(updatedPlan: AISubscriptionPlan): void {
    const plans = this.getPlans().map(p => p.id === updatedPlan.id ? updatedPlan : p);
    this.savePlans(plans);
  }

  deletePlan(planId: string): void {
    const plans = this.getPlans().filter(p => p.id !== planId);
    this.savePlans(plans);
  }

  getUsers(): User[] {
    const raw = localStorage.getItem('nexus_users_v2');
    if (!raw) {
      localStorage.setItem('nexus_users_v2', JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      let parsed: User[] = JSON.parse(raw);
      // Migrate old demo name Tanvir to Shishir Barai
      let hasChange = false;
      parsed = parsed.map(u => {
        if (u.id === 'user_tanvir' || u.name.includes('তানভীর')) {
          hasChange = true;
          return {
            ...u,
            id: 'user_shishir',
            name: 'শিশির বাড়ৈ (কাস্টমার অ্যাকাউন্ট)',
            email: 'shishirbarai01982708789@gmail.com',
            phone: '01982708789'
          };
        }
        return u;
      });
      if (hasChange) {
        localStorage.setItem('nexus_users_v2', JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return INITIAL_USERS;
    }
  }

  saveUsers(users: User[]): void {
    localStorage.setItem('nexus_users_v2', JSON.stringify(users));
  }

  deleteUser(userId: string): void {
    const users = this.getUsers().filter(u => u.id !== userId);
    this.saveUsers(users);
  }

  updateUser(updatedUser: User): void {
    const users = this.getUsers().map(u => u.id === updatedUser.id ? updatedUser : u);
    this.saveUsers(users);
  }

  isLoggedIn(): boolean {
    const raw = localStorage.getItem('nexus_is_logged_in_v2');
    return raw === 'true';
  }

  loginUser(userId: string): void {
    localStorage.setItem('nexus_is_logged_in_v2', 'true');
    this.setCurrentUser(userId);
  }

  logout(): void {
    localStorage.setItem('nexus_is_logged_in_v2', 'false');
    localStorage.removeItem('nexus_current_user_v2');
  }

  loginWithCredentials(emailOrPhone: string, _password?: string): User | null {
    const users = this.getUsers();
    const cleanQuery = emailOrPhone.trim().toLowerCase();
    const found = users.find(u => 
      u.email.toLowerCase() === cleanQuery || 
      (u.phone && u.phone.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, ''))
    );
    if (found) {
      this.loginUser(found.id);
      return found;
    }
    return null;
  }

  registerUser(data: { name: string; email: string; phone?: string; role?: UserRole }): User {
    const users = this.getUsers();
    const newUser: User = {
      id: 'user_' + Date.now(),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || '',
      role: data.role || 'user',
      avatar: '',
      currentPlanId: null,
      subscriptionExpiry: null,
      tokenUsage: 0,
      maxTokens: 50000,
      joinedAt: new Date().toISOString().split('T')[0]
    };
    users.push(newUser);
    this.saveUsers(users);
    this.loginUser(newUser.id);
    return newUser;
  }

  getCurrentUser(): User {
    const raw = localStorage.getItem('nexus_current_user_id_v2');
    const users = this.getUsers();
    if (raw) {
      const found = users.find(u => String(u.id) === String(raw));
      if (found) return found;
    }
    // Default to regular customer (Tanvir Ahmed)
    const customerUser = users.find(u => u.role === 'user');
    return customerUser || users[0];
  }

  setCurrentUser(userId: string): void {
    localStorage.setItem('nexus_current_user_id_v2', userId);
  }

  // Wishlist
  getWishlist(userId: string): string[] {
    const raw = localStorage.getItem(`nexus_wishlist_${userId}`);
    if (!raw) return ['chatgpt-plus', 'canva-pro'];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  toggleWishlist(userId: string, planId: string): string[] {
    const current = this.getWishlist(userId);
    const updated = current.includes(planId)
      ? current.filter(id => id !== planId)
      : [...current, planId];
    localStorage.setItem(`nexus_wishlist_${userId}`, JSON.stringify(updated));
    return updated;
  }

  // Chats & Docs (Strictly Isolated)
  getUserChats(userId: string): ChatMessage[] {
    const key = `nexus_chats_${userId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initialChat: ChatMessage[] = [
        {
          id: 'welcome-msg',
          role: 'assistant',
          content: `স্বাগতম! আপনি এখন **NexusAI Hub** এর নিরাপদ চ্যাটজিপিটি ও এআই ওয়ার্কস্পেসে যুক্ত আছেন।\n\n🔒 **১০০% কঠোর প্রাইভেসি এনক্রিপ্টেড**: আপনার সমস্ত চ্যাট হিস্ট্রি ও আপলোড করা ডকুমেন্ট সম্পূর্ণ ব্যক্তিগত। অন্য কোনো গ্রাহক বা ব্যক্তি এটি দেখতে পারবে না।\n\nআপনি কী বিষয়ে জানতে চান বা কোনো কোড/লেখা তৈরি করতে চান?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelId: 'chatgpt-4o'
        }
      ];
      localStorage.setItem(key, JSON.stringify(initialChat));
      return initialChat;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  saveUserChats(userId: string, messages: ChatMessage[]): void {
    localStorage.setItem(`nexus_chats_${userId}`, JSON.stringify(messages));
  }

  clearUserChats(userId: string): void {
    localStorage.removeItem(`nexus_chats_${userId}`);
  }

  getUserDocuments(userId: string): UserDocument[] {
    const key = `nexus_docs_${userId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      const sampleDoc: UserDocument = {
        id: `doc_${Date.now()}`,
        userId,
        name: 'My_Confidential_Notes.txt',
        size: '1.2 KB',
        type: 'text/plain',
        content: 'এটি আপনার সম্পূর্ণ ব্যক্তিগত ও সুরক্ষিত ডকুমেন্ট। এআই এই ডকুমেন্টের তথ্য অনুযায়ী প্রশ্নের উত্তর দিতে পারবে, কিন্তু অন্য কোনো ব্যবহারকারী এই ডেটা দেখতে পারবে না।',
        uploadedAt: 'আজ, ১০:১৫ AM'
      };
      localStorage.setItem(key, JSON.stringify([sampleDoc]));
      return [sampleDoc];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  saveUserDocuments(userId: string, docs: UserDocument[]): void {
    localStorage.setItem(`nexus_docs_${userId}`, JSON.stringify(docs));
  }

  addDocument(userId: string, doc: Omit<UserDocument, 'id' | 'userId' | 'uploadedAt'>): UserDocument {
    const docs = this.getUserDocuments(userId);
    const newDoc: UserDocument = {
      ...doc,
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      uploadedAt: new Date().toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    docs.unshift(newDoc);
    this.saveUserDocuments(userId, docs);
    return newDoc;
  }

  deleteDocument(userId: string, docId: string): void {
    const docs = this.getUserDocuments(userId).filter(d => d.id !== docId);
    this.saveUserDocuments(userId, docs);
  }

  // Orders
  getOrders(): PaymentOrder[] {
    const raw = localStorage.getItem('nexus_orders_v2');
    if (!raw) {
      localStorage.setItem('nexus_orders_v2', JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ORDERS;
    }
  }

  saveOrders(orders: PaymentOrder[]): void {
    localStorage.setItem('nexus_orders_v2', JSON.stringify(orders));
  }

  createOrder(orderData: Omit<PaymentOrder, 'id' | 'createdAt' | 'status' | 'seatKey'>): PaymentOrder {
    const orders = this.getOrders();
    const isAutoApprove = this.getSettings().autoApprovePayments;
    const seatKey = 'NEXUS-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
    
    const newOrder: PaymentOrder = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: isAutoApprove ? 'approved' : 'pending',
      createdAt: new Date().toLocaleString('en-US', { hour12: true }),
      approvedAt: isAutoApprove ? new Date().toLocaleString('en-US', { hour12: true }) : undefined,
      seatKey
    };

    orders.unshift(newOrder);
    this.saveOrders(orders);

    if (isAutoApprove) {
      this.activateSubscriptionForUser(newOrder.userId, newOrder.planId, seatKey);
    }

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: 'approved' | 'rejected'): void {
    const orders = this.getOrders();
    const target = orders.find(o => o.id === orderId);
    if (!target) return;

    target.status = status;
    if (status === 'approved') {
      target.approvedAt = new Date().toLocaleString('en-US', { hour12: true });
      this.activateSubscriptionForUser(target.userId, target.planId, target.seatKey);
    }
    this.saveOrders(orders);
  }

  activateSubscriptionForUser(userId: string, planId: string, seatKey: string, customDurationDays?: number): void {
    const users = this.getUsers();
    const plans = this.getPlans();
    const plan = plans.find(p => p.id === planId);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const duration = customDurationDays || (plan?.billingCycle === 'yearly' ? 365 : 30);
      const today = new Date();
      const expiry = new Date();
      expiry.setDate(today.getDate() + duration);
      
      const earnedCredits = plan ? Math.max(100, plan.priceBDT) : 500;
      const earnedTokens = earnedCredits * 1000;

      users[userIndex].currentPlanId = planId;
      users[userIndex].subscriptionStartDate = today.toISOString().split('T')[0];
      users[userIndex].subscriptionExpiry = expiry.toISOString().split('T')[0];
      users[userIndex].activeSeatKey = seatKey;
      users[userIndex].maxTokens = Math.max(users[userIndex].maxTokens || 0, 100000) + earnedTokens;
      this.saveUsers(users);
    }
  }

  getSettings(): SystemSettings {
    const raw = localStorage.getItem('nexus_settings_v2');
    if (!raw) {
      localStorage.setItem('nexus_settings_v2', JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    try {
      const parsed = JSON.parse(raw);
      // Clean migration: If the existing saved appName was the placeholder or old lipika name, migrate to new brand
      if (
        !parsed.appName || 
        parsed.appName === 'Nexus AI & Premium Store' || 
        parsed.appName.toLowerCase().includes('lipika')
      ) {
        parsed.appName = INITIAL_SETTINGS.appName;
        parsed.brandPrefix = INITIAL_SETTINGS.brandPrefix;
        parsed.brandSuffix = INITIAL_SETTINGS.brandSuffix;
        parsed.usaShowcaseTitle = INITIAL_SETTINGS.usaShowcaseTitle;
        parsed.announcementText = INITIAL_SETTINGS.announcementText;
        parsed.brandTagline = INITIAL_SETTINGS.brandTagline;
        parsed.brandTaglineBn = INITIAL_SETTINGS.brandTaglineBn;
        parsed.supportEmail = INITIAL_SETTINGS.supportEmail;
        parsed.customDomain = INITIAL_SETTINGS.customDomain;
        localStorage.setItem('nexus_settings_v2', JSON.stringify({ ...INITIAL_SETTINGS, ...parsed }));
      }
      return { ...INITIAL_SETTINGS, ...parsed };
    } catch {
      return INITIAL_SETTINGS;
    }
  }

  saveSettings(settings: SystemSettings): void {
    localStorage.setItem('nexus_settings_v2', JSON.stringify(settings));
    // Asynchronously sync with Laravel backend
    if (typeof fetch !== 'undefined') {
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      }).catch(() => {
        // Silent offline fallback
      });
    }
  }

  // Reseller Sales Management
  getResellerSales(resellerId?: string): ResellerClientSale[] {
    const raw = localStorage.getItem('nexus_reseller_sales_v1');
    let sales: ResellerClientSale[] = INITIAL_RESELLER_SALES;
    if (raw) {
      try {
        sales = JSON.parse(raw);
      } catch {
        sales = INITIAL_RESELLER_SALES;
      }
    } else {
      localStorage.setItem('nexus_reseller_sales_v1', JSON.stringify(INITIAL_RESELLER_SALES));
    }

    // Auto-update status based on current date
    const now = new Date();
    sales = sales.map(s => {
      const exp = new Date(s.expiryDate);
      const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        return { ...s, status: 'expired' as const };
      } else if (diffDays <= 3) {
        return { ...s, status: 'expiring_soon' as const };
      }
      return { ...s, status: 'active' as const };
    });

    if (resellerId) {
      return sales.filter(s => s.resellerId === resellerId);
    }
    return sales;
  }

  saveResellerSales(sales: ResellerClientSale[]): void {
    localStorage.setItem('nexus_reseller_sales_v1', JSON.stringify(sales));
  }

  createResellerSale(saleData: Omit<ResellerClientSale, 'id' | 'createdAt'>): ResellerClientSale {
    const sales = this.getResellerSales();
    const newSale: ResellerClientSale = {
      ...saleData,
      id: `RS-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toLocaleString('en-US', { hour12: true })
    };
    sales.unshift(newSale);
    this.saveResellerSales(sales);

    // If reseller has wallet, deduct wholesale cost
    const users = this.getUsers();
    const resellerIndex = users.findIndex(u => u.id === saleData.resellerId);
    if (resellerIndex !== -1 && users[resellerIndex].walletBalanceBDT !== undefined) {
      users[resellerIndex].walletBalanceBDT = Math.max(0, (users[resellerIndex].walletBalanceBDT || 0) - saleData.wholesaleCostBDT);
      this.saveUsers(users);
    }

    return newSale;
  }

  // Extend or renew subscription validity by N days
  extendSubscription(userId: string, additionalDays: number): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const user = users[userIndex];
      const baseDate = user.subscriptionExpiry && new Date(user.subscriptionExpiry) > new Date()
        ? new Date(user.subscriptionExpiry)
        : new Date();
      baseDate.setDate(baseDate.getDate() + additionalDays);
      user.subscriptionExpiry = baseDate.toISOString().split('T')[0];
      this.saveUsers(users);
    }
  }

  // Universal Subscription Validity Evaluator
  checkSubscriptionValidity(expiryDate: string | null): {
    isValid: boolean;
    daysRemaining: number;
    isExpiringSoon: boolean;
    statusLabel: string;
    badgeColor: string;
    percentRemaining: number;
  } {
    if (!expiryDate) {
      return {
        isValid: false,
        daysRemaining: 0,
        isExpiringSoon: false,
        statusLabel: 'কোনো সক্রিয় প্ল্যান নেই',
        badgeColor: 'bg-slate-800 text-slate-400 border-slate-700',
        percentRemaining: 0,
      };
    }

    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 0) {
      return {
        isValid: false,
        daysRemaining: 0,
        isExpiringSoon: false,
        statusLabel: 'মেয়াদ উত্তীর্ণ (Expired)',
        badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
        percentRemaining: 0,
      };
    }

    const isExpiringSoon = daysRemaining <= 5;
    const percentRemaining = Math.min(100, Math.max(5, Math.round((daysRemaining / 30) * 100)));

    return {
      isValid: true,
      daysRemaining,
      isExpiringSoon,
      statusLabel: isExpiringSoon ? `দ্রুত শেষ হবে (আর ${daysRemaining} দিন বাকি)` : `সক্রিয় (আর ${daysRemaining} দিন বাকি)`,
      badgeColor: isExpiringSoon 
        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      percentRemaining,
    };
  }

  getReviews(): CustomerReview[] {
    return CUSTOMER_REVIEWS;
  }

  getFAQs(): FAQItem[] {
    return FAQ_ITEMS;
  }

  getGuides(): BusinessGuideTopic[] {
    return BUSINESS_GUIDES;
  }
}

export const storage = new StorageService();
