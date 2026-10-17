export type UserRole = 'super_admin' | 'reseller' | 'user';

export interface User {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  currentPlanId: string | null;
  subscriptionStartDate?: string | null;
  subscriptionExpiry: string | null;
  tokenUsage: number;
  maxTokens: number;
  activeSeatKey?: string;
  joinedAt: string;
  walletBalanceBDT?: number;
  resellerDiscountPercent?: number;
}

export interface ResellerClientSale {
  id: string | number;
  resellerId: string | number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  planId: string;
  planName: string;
  durationDays: number;
  durationLabel: string;
  startDate: string;
  expiryDate: string;
  seatKey: string;
  wholesaleCostBDT: number;
  sellingPriceBDT: number;
  profitBDT: number;
  status: 'active' | 'expiring_soon' | 'expired';
  createdAt: string;
  credentialsOrUrl?: string;
}

export type AccessType = 'in_app_chat' | 'domain_proxy' | 'credentials' | 'api_seat';

export type ProductCategory = 
  | 'All' 
  | 'Top Picks' 
  | 'AI & Education Tools' 
  | 'OTT & Streaming' 
  | 'Windows' 
  | 'Microsoft Office' 
  | 'Editing Tools' 
  | 'Software & Productivity' 
  | 'VPN & Security' 
  | 'Giftcards'
  | 'Text & Code'
  | 'Image & Design'
  | 'Marketing'
  | 'Full Bundle';

export interface AISubscriptionPlan {
  id: string;
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Midjourney' | 'NexusAgents' | 'LipikaAI' | 'LipikaWorkspace' | 'Google' | 'Microsoft' | 'Netflix' | 'Adobe' | 'Other';
  category: ProductCategory;
  description: string;
  iconName: string;
  imageUrl?: string;
  badge?: string;
  isOutOfStock?: boolean;
  priceBDT: number;
  priceUSD: number;
  originalPriceBDT: number;
  billingCycle: 'monthly' | 'quarterly' | 'yearly' | 'lifetime';
  features: string[];
  accessType: AccessType;
  directDomainUrl: string;
  defaultModelId: string;
  availableSeats: number;
  totalSold: number;
  isActive: boolean;
  brandColor?: string;
  credentialsGuide?: string;
}

export interface ChatMessage {
  id: string | number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelId: string;
  tokensEstimated?: number;
  attachedDocName?: string;
}

export interface UserDocument {
  id: string | number;
  userId: string | number;
  name: string;
  size: string;
  type: string;
  content: string;
  uploadedAt: string;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'upay' | 'card' | 'sslcommerz';
export type PaymentStatus = 'approved' | 'pending' | 'rejected';

export interface PaymentOrder {
  id: string | number;
  userId: string | number;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  amountBDT: number;
  amountUSD: number;
  method: PaymentMethod;
  senderNumber: string;
  trxId: string;
  status: PaymentStatus;
  createdAt: string;
  approvedAt?: string;
  seatKey: string;
  note?: string;
}

export interface SystemSettings {
  appName: string;
  brandPrefix: string;
  brandSuffix: string;
  logoUrl?: string;
  brandTagline: string;
  brandTaglineBn: string;
  announcementText: string;
  usaShowcaseTitle: string;
  showcaseYoutubeUrl?: string;
  badgeText: string;
  primaryColor: 'blue' | 'indigo' | 'purple' | 'emerald' | 'amber' | 'rose';
  logoIcon: 'Sparkles' | 'Bot' | 'Cpu' | 'Zap' | 'Globe' | 'Layers';
  customDomain: string;
  defaultCreditPercentage: number;
  bkashMerchant: string;
  nagadMerchant: string;
  rocketMerchant: string;
  upayMerchant: string;
  autoApprovePayments: boolean;
  currency: 'BDT' | 'USD';
  bdtToUsdRate: number;
  chatgptProxyUrl: string;
  supportPhone: string;
  supportEmail: string;
  enableUsaFeaturePage: boolean;
  enableInAppChat: boolean;
  enableDomainProxy: boolean;
  enableResellerNetwork: boolean;
  enableFloatingChat: boolean;
  enableHeaderMarquee: boolean;
}

export interface BusinessGuideTopic {
  id: string;
  titleBn: string;
  titleEn: string;
  tag: string;
  readTime: string;
  descriptionBn: string;
  descriptionEn: string;
  keyPointsBn: string[];
  keyPointsEn: string[];
  fullGuideMarkdownBn: string;
}

export interface CustomerReview {
  id: string | number;
  name: string;
  avatar: string;
  rating: number;
  verified: boolean;
  date: string;
  commentBn: string;
  productName: string;
}

export interface FAQItem {
  id: string | number;
  questionBn: string;
  answerBn: string;
}
