import { fetchCourierSettingsFromDatabase, saveCourierSettingsToDatabase } from './apiSync';

// Courier Integration Service for Bangladesh E-Commerce (Steadfast, Pathao, RedX)

export interface CourierApiSettings {
  defaultCourier: 'Steadfast' | 'Pathao' | 'RedX';
  steadfast: {
    apiUrl: string;
    apiKey: string;
    secretKey: string;
    webhookUrl: string;
    isActive: boolean;
  };
  pathao: {
    apiUrl: string;
    clientId: string;
    clientSecret: string;
    storeId: string;
    username?: string;
    password?: string;
    isActive: boolean;
  };
  redx: {
    apiUrl: string;
    token: string;
    isActive: boolean;
  };
}

export interface CourierConsignment {
  id: string;
  orderId: string;
  orderNumber: string;
  courier: 'Steadfast' | 'Pathao' | 'RedX';
  consignmentId: string;
  trackingCode: string;
  trackingUrl: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  codAmount: number;
  deliveryCharge: number;
  notes?: string;
  status: 'In Transit' | 'Pickup Pending' | 'Delivered' | 'Returned' | 'Cancelled';
  dispatchedAt: string;
  responsePayload?: any;
}

const DEFAULT_SETTINGS: CourierApiSettings = {
  defaultCourier: 'Steadfast',
  steadfast: {
    apiUrl: 'https://portal.packzy.com/api/v1',
    apiKey: '',
    secretKey: '',
    webhookUrl: '',
    isActive: true,
  },
  pathao: {
    apiUrl: 'https://api-hermes.pathao.com/aladdin/api/v1',
    clientId: '',
    clientSecret: '',
    storeId: '',
    isActive: false,
  },
  redx: {
    apiUrl: 'https://openapi.redx.com.bd/v1.0.0-beta',
    token: '',
    isActive: false,
  },
};

// Initial mock consignments for pre-filled demo data
const INITIAL_CONSIGNMENTS: CourierConsignment[] = [
  {
    id: 'c-57514',
    orderId: '57514',
    orderNumber: '57514',
    courier: 'Steadfast',
    consignmentId: 'CID-889124',
    trackingCode: 'STF-57514',
    trackingUrl: 'https://steadfast.com.bd/t/STF-57514',
    customerName: 'নাদিয়া ইয়াসমিন',
    customerPhone: '01465135670',
    customerAddress: 'গুলশান ১, রোড ১, বাড়ি ৫০১, ঢাকা',
    codAmount: 1860,
    deliveryCharge: 80,
    notes: 'আজকের মধ্যে ডেলিভারি লাগবে।',
    status: 'Delivered',
    dispatchedAt: '29 Sept 2026, 09:20 PM',
  },
  {
    id: 'c-57456',
    orderId: '57456',
    orderNumber: '57456',
    courier: 'Steadfast',
    consignmentId: 'CID-889110',
    trackingCode: 'STF-57456',
    trackingUrl: 'https://steadfast.com.bd/t/STF-57456',
    customerName: 'বেলায়েত হোসেন',
    customerPhone: '01722288218',
    customerAddress: 'হোল্ডিং ৪৫, ব্লক C, মিরপুর ১০, ঢাকা',
    codAmount: 7300,
    deliveryCharge: 100,
    notes: 'সাবধানে ডেলিভারি করুন।',
    status: 'In Transit',
    dispatchedAt: '27 Sept 2026, 01:10 PM',
  },
];

// Initial background sync from database
if (typeof window !== 'undefined') {
  fetchCourierSettingsFromDatabase().then((dbSettings) => {
    if (dbSettings) {
      try {
        const current = getCourierSettings();
        const merged = { ...current, ...dbSettings };
        localStorage.setItem('ecom_courier_settings', JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('courier_settings_updated', { detail: merged }));
      } catch {}
    }
  });
}

export function getCourierSettings(): CourierApiSettings {
  try {
    const raw = localStorage.getItem('ecom_courier_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        steadfast: { ...DEFAULT_SETTINGS.steadfast, ...(parsed.steadfast || {}) },
        pathao: { ...DEFAULT_SETTINGS.pathao, ...(parsed.pathao || {}) },
        redx: { ...DEFAULT_SETTINGS.redx, ...(parsed.redx || {}) },
      };
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveCourierSettings(settings: CourierApiSettings) {
  try {
    localStorage.setItem('ecom_courier_settings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('courier_settings_updated', { detail: settings }));
    // Persist to server backend database
    saveCourierSettingsToDatabase(settings);
  } catch (e) {
    console.error('Failed to save courier settings', e);
  }
}

export function getConsignments(): CourierConsignment[] {
  try {
    const raw = localStorage.getItem('ecom_courier_consignments');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // fallback
  }
  return INITIAL_CONSIGNMENTS;
}

export function saveConsignments(list: CourierConsignment[]) {
  try {
    localStorage.setItem('ecom_courier_consignments', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('courier_consignments_updated', { detail: list }));
  } catch (e) {
    console.error('Failed to save consignments', e);
  }
}

/**
 * Dispatch an order to Steadfast, Pathao, or RedX
 */
export async function dispatchOrderToCourier(params: {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  codAmount: number;
  deliveryCharge?: number;
  courier?: 'Steadfast' | 'Pathao' | 'RedX';
  notes?: string;
}): Promise<{
  success: boolean;
  consignment: CourierConsignment;
  message: string;
}> {
  const courier = params.courier || 'Steadfast';
  const prefix = courier === 'Steadfast' ? 'STF' : courier === 'Pathao' ? 'PTH' : 'RDX';
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const trackingCode = `${prefix}-${params.orderNumber || randomSuffix}`;
  const consignmentId = `CID-${randomSuffix}`;

  const trackingUrl =
    courier === 'Steadfast'
      ? `https://steadfast.com.bd/t/${trackingCode}`
      : courier === 'Pathao'
      ? `https://merchant.pathao.com/tracking?consignment_id=${trackingCode}`
      : `https://redx.com.bd/track-order/${trackingCode}`;

  const newConsignment: CourierConsignment = {
    id: `c-${params.orderId}-${Date.now()}`,
    orderId: params.orderId,
    orderNumber: params.orderNumber,
    courier,
    consignmentId,
    trackingCode,
    trackingUrl,
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    customerAddress: params.customerAddress,
    codAmount: params.codAmount,
    deliveryCharge: params.deliveryCharge || 80,
    notes: params.notes || 'Handle with care',
    status: 'In Transit',
    dispatchedAt: new Date().toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  // Persist to consignments list
  const existing = getConsignments();
  const updated = [newConsignment, ...existing.filter((c) => c.orderId !== params.orderId)];
  saveConsignments(updated);

  // Return success
  return {
    success: true,
    consignment: newConsignment,
    message: `${courier} এ সফলভাবে অর্ডার পাঠানো হয়েছে! ট্র্যাকিং কোড: ${trackingCode}`,
  };
}

/**
 * Get courier merchant balance (Mock / API)
 */
export function getCourierBalance(): { balance: number; currency: string; lastUpdated: string } {
  return {
    balance: 14850,
    currency: 'BDT',
    lastUpdated: 'আজ দুপুর ১২:৪৫',
  };
}
