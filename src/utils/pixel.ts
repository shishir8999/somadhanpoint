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
 * Extract 15 or 16 digit Pixel ID from code snippet
 */
export const extractPixelIdFromCode = (code: string | undefined | null): string => {
  if (!code || typeof code !== 'string') return '';
  // 1. Match fbq('init', '1234567890123456')
  const fbqMatch = code.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d{14,18})['"]/i);
  if (fbqMatch && fbqMatch[1]) return fbqMatch[1];

  // 2. Match id=1234567890123456
  const idParamMatch = code.match(/[?&]id=(\d{14,18})/i);
  if (idParamMatch && idParamMatch[1]) return idParamMatch[1];

  // 3. Match any standalone 15 or 16 digit number
  const numMatch = code.match(/\b(\d{15,16})\b/);
  if (numMatch && numMatch[1]) return numMatch[1];

  return '';
};

/**
 * Safely inject user custom Facebook Pixel / Tracking code snippet into DOM
 */
export const injectCustomPixelScript = (code: string | undefined | null) => {
  if (typeof window === 'undefined') return;
  const scriptContainerId = 'meta-pixel-custom-container';
  const existing = document.getElementById(scriptContainerId);
  if (existing) {
    existing.remove();
  }

  if (!code || !code.trim()) return;

  const container = document.createElement('div');
  container.id = scriptContainerId;
  container.setAttribute('aria-hidden', 'true');
  container.style.display = 'none';

  const cleanCode = code.trim();

  // If code contains HTML tags like <script> or <noscript>
  if (cleanCode.includes('<script') || cleanCode.includes('<noscript')) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanCode, 'text/html');

    // Re-create <script> elements so they execute immediately
    const scriptElements = doc.querySelectorAll('script');
    scriptElements.forEach((origScript) => {
      const scriptEl = document.createElement('script');
      if (origScript.src) {
        scriptEl.src = origScript.src;
        scriptEl.async = true;
      }
      if (origScript.textContent) {
        scriptEl.textContent = origScript.textContent;
      }
      container.appendChild(scriptEl);
    });

    // Append non-script elements (like <noscript>)
    const noscripts = doc.querySelectorAll('noscript, img');
    noscripts.forEach((el) => {
      container.appendChild(el.cloneNode(true));
    });
  } else {
    // Raw JavaScript snippet without <script> tags
    const scriptEl = document.createElement('script');
    scriptEl.textContent = cleanCode;
    container.appendChild(scriptEl);
  }

  document.head.appendChild(container);
};

export const getActivePixelId = () => activePixelId;

/**
 * Initialize Meta / Facebook Pixel (supports both 16-digit ID and Full Custom Base Code)
 */
export const initFacebookPixel = (
  pixelId?: string | undefined | null,
  customCode?: string | undefined | null
) => {
  if (typeof window === 'undefined') return;

  // 1. Inject custom pixel script if provided
  if (customCode && customCode.trim()) {
    injectCustomPixelScript(customCode);
  }

  // 2. Determine effective pixel ID
  const effectiveId = (pixelId && pixelId.trim())
    ? pixelId.trim()
    : extractPixelIdFromCode(customCode);

  if (!effectiveId) {
    return;
  }

  // If already initialized with this ID, do not re-inject snippet
  if (activePixelId === effectiveId && window.fbq) {
    return;
  }

  // 3. Inject standard Facebook Pixel snippet if window.fbq doesn't exist
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
    window.fbq('init', effectiveId);
    activePixelId = effectiveId;

    // Track initial PageView
    trackFacebookEvent('PageView', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });

    console.log(`[Meta Pixel] Successfully initialized with ID: ${effectiveId}`);
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
