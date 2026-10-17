// Facebook (Meta) Pixel Tracking Service for OmniCraft AI

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

class FacebookPixelService {
  private currentPixelId: string | null = null;
  private isInitialized = false;

  /**
   * Initialize Facebook Pixel with given ID
   */
  init(pixelId?: string, force = false): void {
    if (!pixelId || typeof window === 'undefined') return;
    const cleanId = pixelId.trim();
    if (!cleanId) return;

    if (this.isInitialized && this.currentPixelId === cleanId && !force) {
      return;
    }

    this.currentPixelId = cleanId;

    // Standard Meta Pixel snippet
    if (!window.fbq) {
      (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function() {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    }

    try {
      window.fbq('init', cleanId);
      window.fbq('track', 'PageView');
      this.isInitialized = true;
      console.log(`%c[Meta Pixel] Initialized successfully with ID: ${cleanId}`, 'color: #1877F2; font-weight: bold;');
    } catch (e) {
      console.warn('[Meta Pixel] Failed to initialize:', e);
    }
  }

  /**
   * Generic track event wrapper
   */
  track(eventName: string, params?: Record<string, any>): void {
    if (typeof window === 'undefined' || !window.fbq) return;
    try {
      if (params) {
        window.fbq('track', eventName, params);
      } else {
        window.fbq('track', eventName);
      }
      console.log(`%c[Meta Pixel] Event: ${eventName}`, 'color: #1877F2; font-weight: bold;', params || '');
    } catch (e) {
      console.warn(`[Meta Pixel] Error tracking ${eventName}:`, e);
    }
  }

  /**
   * Custom event tracking
   */
  trackCustom(eventName: string, params?: Record<string, any>): void {
    if (typeof window === 'undefined' || !window.fbq) return;
    try {
      window.fbq('trackCustom', eventName, params || {});
      console.log(`%c[Meta Pixel] Custom Event: ${eventName}`, 'color: #1877F2; font-weight: bold;', params || '');
    } catch (e) {
      console.warn(`[Meta Pixel] Error tracking custom event ${eventName}:`, e);
    }
  }

  // ==========================================
  // E-COMMERCE STANDARD EVENTS
  // ==========================================

  /**
   * PageView Event
   */
  trackPageView(pageName?: string): void {
    this.track('PageView', pageName ? { page_name: pageName } : undefined);
  }

  /**
   * ViewContent Event when a user views a plan
   */
  trackViewContent(plan: { id: string; name: string; priceBDT: number; provider?: string }): void {
    this.track('ViewContent', {
      content_name: plan.name,
      content_category: plan.provider || 'AI Subscription',
      content_ids: [plan.id],
      content_type: 'product',
      value: plan.priceBDT,
      currency: 'BDT',
    });
  }

  /**
   * InitiateCheckout Event when user opens payment modal
   */
  trackInitiateCheckout(plan: { id: string; name: string; priceBDT: number; provider?: string }): void {
    this.track('InitiateCheckout', {
      content_name: plan.name,
      content_category: plan.provider || 'AI Subscription',
      content_ids: [plan.id],
      content_type: 'product',
      value: plan.priceBDT,
      currency: 'BDT',
      num_items: 1,
    });
  }

  /**
   * Purchase Event when order is submitted
   */
  trackPurchase(order: { id: string; planName: string; amountBDT: number; method: string }): void {
    this.track('Purchase', {
      content_name: order.planName,
      content_type: 'product',
      value: order.amountBDT,
      currency: 'BDT',
      order_id: order.id,
      payment_method: order.method,
    });
  }

  /**
   * Lead Event when user registers or requests info
   */
  trackLead(user: { name?: string; email?: string }): void {
    this.track('Lead', {
      content_name: 'Customer Registration / Lead',
      user_email: user.email,
    });
  }

  /**
   * Check if pixel is currently active
   */
  isActive(): boolean {
    return this.isInitialized && !!this.currentPixelId;
  }

  getPixelId(): string | null {
    return this.currentPixelId;
  }
}

export const pixel = new FacebookPixelService();
