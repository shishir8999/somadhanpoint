/**
 * Meta (Facebook) Pixel Universal Integration Service
 * Provides comprehensive tracking across entire e-commerce user journey:
 * - PageView
 * - ViewContent (Product View)
 * - AddToCart
 * - AddToWishlist
 * - InitiateCheckout
 * - Purchase
 * - Search
 * - Contact (WhatsApp / Hotline)
 */

import { Product, CartItem, Order } from '../types';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

export interface PixelEventLog {
  id: string;
  eventName: string;
  params?: Record<string, any>;
  timestamp: string;
}

const eventLogs: PixelEventLog[] = [];
let activePixelId: string | null = null;
const listeners: Array<(logs: PixelEventLog[]) => void> = [];

export const getPixelLogs = (): PixelEventLog[] => [...eventLogs];

export const onPixelLogUpdate = (callback: (logs: PixelEventLog[]) => void) => {
  listeners.push(callback);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx > -1) listeners.splice(idx, 1);
  };
};

const notifyListeners = () => {
  listeners.forEach((cb) => {
    try {
      cb([...eventLogs]);
    } catch {
      // ignore
    }
  });
};

/**
 * Initialize Meta / Facebook Pixel base code dynamically
 */
export const initFacebookPixel = (pixelId: string | undefined | null) => {
  if (typeof window === 'undefined') return;
  if (!pixelId || !pixelId.trim()) return;

  const cleanId = pixelId.trim();

  // If already initialized with this ID, do not re-inject snippet
  if (activePixelId === cleanId && window.fbq) {
    return;
  }

  // Inject standard Facebook Pixel snippet if window.fbq doesn't exist
  if (!window.fbq) {
    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
  }

  try {
    window.fbq('init', cleanId);
    activePixelId = cleanId;

    // Track initial PageView
    trackFacebookEvent('PageView', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });

    console.log(`[Meta Pixel] Successfully initialized with ID: ${cleanId}`);
  } catch (err) {
    console.warn('[Meta Pixel] Error during initialization:', err);
  }
};

/**
 * Generic event tracker with safety checks and admin diagnostic log
 */
export const trackFacebookEvent = (
  eventName: string,
  params: Record<string, any> = {}
) => {
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
  const logItem: PixelEventLog = {
    id: `px-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    eventName,
    params,
    timestamp,
  };

  eventLogs.unshift(logItem);
  if (eventLogs.length > 50) eventLogs.pop();
  notifyListeners();

  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      window.fbq('track', eventName, params);
      console.log(`[Meta Pixel Event: ${eventName}]`, params);
    } catch (err) {
      console.warn(`[Meta Pixel] Failed to track ${eventName}:`, err);
    }
  } else {
    console.log(`[Meta Pixel Simulation: ${eventName}]`, params);
  }
};

/**
 * Standard E-commerce Events
 */

// 1. PageView
export const trackPageView = (pageName?: string) => {
  trackFacebookEvent('PageView', {
    page_name: pageName || 'Storefront',
    page_title: document.title,
    page_path: window.location.pathname,
    page_location: window.location.href,
  });
};

// 2. ViewContent (Customer views a product)
export const trackViewContent = (product: Product) => {
  trackFacebookEvent('ViewContent', {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.id],
    content_type: 'product',
    value: product.currentPrice,
    currency: 'BDT',
  });
};

// 3. AddToCart
export const trackAddToCart = (product: Product, quantity: number = 1) => {
  trackFacebookEvent('AddToCart', {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.id],
    content_type: 'product',
    value: product.currentPrice * quantity,
    currency: 'BDT',
    quantity,
  });
};

// 4. AddToWishlist
export const trackAddToWishlist = (product: Product) => {
  trackFacebookEvent('AddToWishlist', {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.id],
    content_type: 'product',
    value: product.currentPrice,
    currency: 'BDT',
  });
};

// 5. InitiateCheckout
export const trackInitiateCheckout = (items: CartItem[], total: number) => {
  const contentIds = items.map((i) => i.product.id);
  const numItems = items.reduce((sum, i) => sum + i.quantity, 0);

  trackFacebookEvent('InitiateCheckout', {
    content_ids: contentIds,
    content_type: 'product',
    num_items: numItems,
    value: total,
    currency: 'BDT',
  });
};

// 6. Purchase (Order Confirmation)
export const trackPurchase = (order: Order) => {
  const contentIds = order.items.map((i) => i.product.id);
  const numItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

  trackFacebookEvent('Purchase', {
    content_ids: contentIds,
    content_type: 'product',
    value: order.total,
    currency: 'BDT',
    num_items: numItems,
    order_id: order.id,
    payment_method: order.paymentMethod,
    delivery_area: order.deliveryArea,
  });
};

// 7. Search
export const trackSearch = (query: string) => {
  if (!query || !query.trim()) return;
  trackFacebookEvent('Search', {
    search_string: query.trim(),
    content_category: 'Product Search',
  });
};

// 8. Contact (WhatsApp / Hotline)
export const trackContact = (method: 'whatsapp' | 'phone') => {
  trackFacebookEvent('Contact', {
    contact_method: method,
    value: 0,
    currency: 'BDT',
  });
};
