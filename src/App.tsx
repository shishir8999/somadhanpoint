import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, CustomerUser, SentEmailItem } from './types';
import {
  ALL_NEW_PRODUCTS,
  HOT_DEALS_PRODUCTS,
  FLASH_SALE_PRODUCTS,
  TOP_RATED_PRODUCTS,
  BEST_SELLS_PRODUCTS,
  TEMPORARY_PRODUCTS,
} from './data/products';
import { TopBar } from './components/TopBar';
import { MainHeader } from './components/MainHeader';
import { NavBar } from './components/NavBar';
import { HeroSlider } from './components/HeroSlider';
import { CategoriesCarousel } from './components/CategoriesCarousel';
import { ProductSectionGrid } from './components/ProductSectionGrid';
import { FashionPromoBanner } from './components/FashionPromoBanner';
import { BrandSection } from './components/BrandSection';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { FooterNew } from './components/FooterNew';
import { FloatingButtons } from './components/FloatingButtons';
import { CartDrawerNew } from './components/CartDrawerNew';
import { OrderModal } from './components/OrderModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AuthModal } from './components/AuthModal';
import { CustomerProfileModal } from './components/CustomerProfileModal';
import { SentEmailModal } from './components/SentEmailModal';
import { getCurrentCustomer, logoutCustomer } from './utils/customerAuth';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminOrdersPage } from './components/AdminOrdersPage';
import { OrderCheckoutPage } from './components/OrderCheckoutPage';
import { AllProductsPage } from './components/AllProductsPage';
import { StockManagementPage } from './components/StockManagementPage';
import { AllCategoriesPage } from './components/AllCategoriesPage';
import { AllSectionsPage } from './components/AllSectionsPage';
import { AllBrandsPage } from './components/AllBrandsPage';
import { ProductVariantsPage } from './components/ProductVariantsPage';
import { AllReviewsPage } from './components/AllReviewsPage';
import { AllRolesPage } from './components/AllRolesPage';
import { AllAdminsPage } from './components/AllAdminsPage';
import { AllCustomersPage } from './components/AllCustomersPage';
import { CustomerWishlistPage } from './components/CustomerWishlistPage';
import { SalesReportPage } from './components/SalesReportPage';
import { EmployeeReportPage } from './components/EmployeeReportPage';
import { ProductReportPage } from './components/ProductReportPage';
import { CustomerReportPage } from './components/CustomerReportPage';
import { CourierIntegrationPage } from './components/CourierIntegrationPage';
import { CourierFeePage } from './components/CourierFeePage';
import { ScanToUpdatePage } from './components/ScanToUpdatePage';
import { CourierPaymentPage } from './components/CourierPaymentPage';
import { CourierInvoicePage } from './components/CourierInvoicePage';
import { AccountingPage } from './components/AccountingPage';
import { MessagesPage } from './components/MessagesPage';
import { SettingsAdminPage } from './components/SettingsAdminPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { CustomPagesAdminPage } from './components/CustomPagesAdminPage';
import { CustomPageView } from './components/CustomPageView';
import { ProductsCatalogPage } from './components/ProductsCatalogPage';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileNavDrawer } from './components/MobileNavDrawer';
import { AdminPageType } from './components/AdminSidebar';
import { appendOrderToAdminList } from './data/mockOrders';
import { CheckCircle2, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useStoreSettings } from './context/StoreSettingsContext';
import {
  initFacebookPixel,
  trackPageView,
  trackViewContent,
  trackAddToCart,
  trackAddToWishlist,
  trackInitiateCheckout,
  trackPurchase,
} from './utils/pixel';
import { fetchProductsFromDatabase } from './utils/apiSync';

// Build Cache Buster: 2026-10-18T23:32:00
// Helper to load and merge admin-managed products from localStorage
export const loadCombinedStoreProducts = (): Product[] => {
  if (typeof window === 'undefined') return ALL_NEW_PRODUCTS;
  try {
    const saved = localStorage.getItem('ummah_admin_products_list');
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const adminConverted: Product[] = parsed.map((p: any, idx: number) => {
          const numPrice =
            typeof p.price === 'number'
              ? p.price
              : parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0;
          const numOriginal =
            typeof p.originalPrice === 'number'
              ? p.originalPrice
              : p.originalPrice
              ? parseFloat(String(p.originalPrice).replace(/[^0-9.]/g, ''))
              : undefined;

          const primaryImage =
            p.imageUrl ||
            p.thumbnailUrl ||
            (p.galleryImages && p.galleryImages[0]) ||
            (p.colorVariants && p.colorVariants.find((c: any) => c.image)?.image) ||
            '/placeholder.png';

          return {
            id: String(p.id || `admin-prod-${idx}`),
            name: p.name || 'Unnamed Product',
            category: p.category && p.category !== '—' ? p.category : 'General',
            subcategory: p.subcategory,
            brand: p.brand && p.brand !== '—' ? p.brand : undefined,
            currentPrice: numPrice,
            originalPrice: numOriginal,
            badge: p.badge,
            badgeType: 'discount',
            section: p.section || 'hot_deals',
            visualType: p.visualType || 'formal_shoe',
            imageUrl: primaryImage,
            thumbnailUrl: primaryImage,
            galleryImages: p.galleryImages,
            sizes: p.sizes,
            colors: p.colors,
            colorVariants: p.colorVariants,
            sku: p.sku,
            description: p.description,
            inStock: p.inStock !== false,
          } as Product;
        });

        // The adminConverted list is the single source of truth.
        // DO NOT merge back deleted mock products!
        return adminConverted;
      }
    }
  } catch (e) {
    console.error('Failed to load store products from admin list', e);
  }
  return ALL_NEW_PRODUCTS;
};

export default function App() {
  const { settings } = useStoreSettings();

  // Navigation View:
  const [currentView, setCurrentView] = useState<
    | 'home'
    | 'product_detail'
    | 'order_page'
    | 'products'
    | 'about_us'
    | 'contact_us'
    | 'privacy_policy'
    | 'terms_conditions'
    | 'return_policy'
    | 'delivery_policy'
    | 'admin_login'
    | 'admin_dashboard'
    | 'admin_orders'
    | 'admin_products'
    | 'admin_stocks'
    | 'admin_categories'
    | 'admin_sections'
    | 'admin_brands'
    | 'admin_variants'
    | 'admin_reviews'
    | 'admin_roles'
    | 'admin_all_admin'
    | 'admin_all_customer'
    | 'admin_customer_wishlist'
    | 'admin_sales_report'
    | 'admin_employee_report'
    | 'admin_product_report'
    | 'admin_customer_report'
    | 'admin_courier_integration'
    | 'admin_courier_fee'
    | 'admin_courier_scan'
    | 'admin_courier_payment'
    | 'admin_courier_invoice'
    | 'admin_accounting'
    | 'admin_messages'
    | 'admin_custom_pages'
    | 'admin_settings'
    | 'admin_slider_settings'
    | 'admin_promo_settings'
  >('home');

  // Initial tab for OrderCheckoutPage ('checkout' | 'tracking')
  const [orderInitialTab, setOrderInitialTab] = useState<'checkout' | 'tracking'>('checkout');

  const handleOpenOrderTracking = () => {
    setOrderInitialTab('tracking');
    setCurrentView('order_page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic products list from localStorage + mock products
  const [storeProducts, setStoreProducts] = useState<Product[]>(loadCombinedStoreProducts);
  // Search query carried over to ProductsCatalogPage
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');

  // Sync storeProducts with server database on mount
  useEffect(() => {
    fetchProductsFromDatabase().then((dbProducts) => {
      if (dbProducts && Array.isArray(dbProducts)) {
        try {
          localStorage.setItem('ummah_admin_products_list', JSON.stringify(dbProducts));
          setStoreProducts(loadCombinedStoreProducts());
        } catch {}
      }
    });
  }, []);

  // Sync storeProducts when localStorage changes or custom event fires
  useEffect(() => {
    const handleStorageUpdate = () => {
      setStoreProducts(loadCombinedStoreProducts());
    };
    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('products-updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('products-updated', handleStorageUpdate);
    };
  }, []);

  // Search Submit Handler
  const handleSearchSubmit = (query: string) => {
    setCatalogSearchQuery(query);
    setSelectedCategory(undefined);
    setCurrentView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Section product lists (derived STRICTLY from storeProducts)
  const hotDealsProducts = React.useMemo(() => {
    const list = storeProducts.filter((p) => p.section === 'hot_deals');
    if (list.length > 0) return list;
    return storeProducts.slice(0, 10);
  }, [storeProducts]);

  const flashSaleProducts = React.useMemo(() => {
    const list = storeProducts.filter((p) => p.section === 'flash_sale');
    if (list.length > 0) return list;
    return storeProducts.slice(0, 10);
  }, [storeProducts]);

  const topRatedProducts = React.useMemo(() => {
    const list = storeProducts.filter((p) => p.section === 'top_rated');
    if (list.length > 0) return list;
    return storeProducts.slice(0, 10);
  }, [storeProducts]);

  const bestSellsProducts = React.useMemo(() => {
    const list = storeProducts.filter((p) => p.section === 'best_sells');
    if (list.length > 0) return list;
    return storeProducts.slice(0, 10);
  }, [storeProducts]);

  const temporaryProducts = React.useMemo(() => {
    const list = storeProducts.filter((p) => p.section === 'temporary');
    if (list.length > 0) return list;
    return storeProducts.slice(0, 10);
  }, [storeProducts]);

  // Mobile menu drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Default selected product for PDP (Image 2)
  const [selectedProduct, setSelectedProduct] = useState<Product>(() => storeProducts[0] || FLASH_SALE_PRODUCTS[6]);

  // Cart state with persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ecom_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [];
  });

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ecom_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [];
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ecom_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [];
  });

  // Modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [orderModalProduct, setOrderModalProduct] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Customer Auth & Email Notification States
  const [currentCustomer, setCurrentCustomerState] = useState<CustomerUser | null>(getCurrentCustomer);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sentEmailModalData, setSentEmailModalData] = useState<SentEmailItem | null>(null);
  const [isSentEmailModalOpen, setIsSentEmailModalOpen] = useState(false);

  useEffect(() => {
    const handleCustomerAuthChange = (e: any) => {
      if (e && e.detail !== undefined) {
        setCurrentCustomerState(e.detail);
      } else {
        setCurrentCustomerState(getCurrentCustomer());
      }
    };

    const handleEmailDispatched = (e: any) => {
      if (e && e.detail) {
        setSentEmailModalData(e.detail);
        setIsSentEmailModalOpen(true);
      }
    };

    window.addEventListener('customer_auth_changed', handleCustomerAuthChange);
    window.addEventListener('email_dispatched', handleEmailDispatched);
    window.addEventListener('storage', handleCustomerAuthChange);

    return () => {
      window.removeEventListener('customer_auth_changed', handleCustomerAuthChange);
      window.removeEventListener('email_dispatched', handleEmailDispatched);
      window.removeEventListener('storage', handleCustomerAuthChange);
    };
  }, []);

  const handleCustomerLogout = () => {
    logoutCustomer();
    setCurrentCustomerState(null);
    setIsProfileOpen(false);
    if (typeof showToast === 'function') {
      showToast('সফলভাবে লগআউট সম্পন্ন হয়েছে!');
    } else {
      setToastMessage('সফলভাবে লগআউট সম্পন্ন হয়েছে!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('ecom_cart', JSON.stringify(cartItems));
    } catch (e) {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('ecom_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      // ignore
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('ecom_orders', JSON.stringify(orders));
    } catch (e) {
      // ignore
    }
  }, [orders]);

  const navigateToAdmin = () => {
    try {
      window.history.pushState(null, '', '/admin');
    } catch {
      // ignore
    }
    const isAuth = localStorage.getItem('ecom_super_admin_session') === 'true';
    if (isAuth) {
      setCurrentView('admin_dashboard');
    } else {
      setCurrentView('admin_login');
    }
  };

  const navigateToStore = () => {
    try {
      window.history.pushState(null, '', '/');
    } catch {
      // ignore
    }
    setCurrentView('home');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('ecom_super_admin_session');
    navigateToStore();
    showToast('সুপার অ্যাডমিন থেকে লগআউট সম্পন্ন হয়েছে');
  };

  const handleAdminLoginSuccess = () => {
    try {
      window.history.pushState(null, '', '/admin');
    } catch {
      // ignore
    }
    setCurrentView('admin_dashboard');
    showToast('সুপার অ্যাডমিন প্যানেলে স্বাগতম!');
  };

  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;

      if (
        path === '/admin' ||
        path.startsWith('/admin') ||
        hash === '#admin' ||
        search.includes('admin=true')
      ) {
        const isAuth = localStorage.getItem('ecom_super_admin_session') === 'true';
        if (isAuth) {
          setCurrentView((prev) => (prev.startsWith('admin_') && prev !== 'admin_login' ? prev : 'admin_dashboard'));
        } else {
          setCurrentView('admin_login');
        }
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    window.addEventListener('hashchange', handleUrlRouting);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        navigateToAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
      window.removeEventListener('hashchange', handleUrlRouting);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 1. Initialize Facebook / Meta Pixel across entire application
  useEffect(() => {
    if (settings.fbPixelId && settings.fbPixelId.trim()) {
      initFacebookPixel(settings.fbPixelId);
    }
  }, [settings.fbPixelId]);

  // 2. Track PageView automatically on every view/route change
  useEffect(() => {
    trackPageView(currentView);
  }, [currentView]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleAddToCart = (
    product: Product,
    quantity: number = 1,
    options?: { color?: string; size?: string; image?: string }
  ) => {
    // Meta Pixel: Track AddToCart
    trackAddToCart(product, quantity);

    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedColor === options?.color &&
        item.selectedSize === options?.size
    );
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${options?.color || ''}-${options?.size || ''}-${Date.now()}`,
        product,
        quantity,
        unitPrice: product.currentPrice,
        selectedColor: options?.color,
        selectedSize: options?.size,
        selectedImage: options?.image || product.thumbnailUrl || product.imageUrl,
      };
      setCartItems((prev) => [...prev, newItem]);
    }
    const variantTag = [options?.color, options?.size].filter(Boolean).join(' / ');
    showToast(`"${product.name}"${variantTag ? ` (${variantTag})` : ''} কার্টে যোগ করা হয়েছে!`);
  };

  const handleInstantOrder = (
    product: Product,
    quantity: number = 1,
    options?: { color?: string; size?: string; image?: string }
  ) => {
    setSelectedProduct(product);

    // Meta Pixel: Track AddToCart & InitiateCheckout
    trackAddToCart(product, quantity);
    trackInitiateCheckout(
      [
        {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          unitPrice: product.currentPrice,
          selectedColor: options?.color,
          selectedSize: options?.size,
          selectedImage: options?.image || product.thumbnailUrl || product.imageUrl,
        },
      ],
      product.currentPrice * quantity
    );

    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedColor === options?.color &&
        item.selectedSize === options?.size
    );
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${options?.color || ''}-${options?.size || ''}-${Date.now()}`,
        product,
        quantity,
        unitPrice: product.currentPrice,
        selectedColor: options?.color,
        selectedSize: options?.size,
        selectedImage: options?.image || product.thumbnailUrl || product.imageUrl,
      };
      setCartItems((prev) => [...prev, newItem]);
    }
    setOrderInitialTab('checkout');
    setCurrentView('order_page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    // Meta Pixel: Track ViewContent
    trackViewContent(product);
    setCurrentView('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleWishlist = (product: Product) => {
    if (wishlistIds.includes(product.id)) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast(`উইশলিস্ট থেকে সরানো হয়েছে`);
    } else {
      // Meta Pixel: Track AddToWishlist
      trackAddToWishlist(product);
      setWishlistIds((prev) => [...prev, product.id]);
      showToast(`"${product.name}" উইশলিস্টে যুক্ত হয়েছে!`);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleProceedToCheckoutFromCart = () => {
    setIsCartOpen(false);
    // Meta Pixel: Track InitiateCheckout
    trackInitiateCheckout(cartItems, totalCartPrice);
    setOrderInitialTab('checkout');
    setCurrentView('order_page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryFilter = (catName: string) => {
    setSelectedCategory(catName);
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setTimeout(() => {
      const targetElement = document.getElementById('flash-sale');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleFilterSection = (sectionKey: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setTimeout(() => {
      if (sectionKey === 'all') {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      } else {
        const el = document.getElementById(sectionKey);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const wishlistedProducts = storeProducts.filter((p) => wishlistIds.includes(p.id));

  // Admin Navigation Handler
  const handleAdminNavigate = (page: AdminPageType) => {
    switch (page) {
      case 'dashboard':
        setCurrentView('admin_dashboard');
        break;
      case 'orders':
        setCurrentView('admin_orders');
        break;
      case 'all_products':
        setCurrentView('admin_products');
        break;
      case 'stock_management':
        setCurrentView('admin_stocks');
        break;
      case 'all_categories':
        setCurrentView('admin_categories');
        break;
      case 'all_sections':
        setCurrentView('admin_sections');
        break;
      case 'all_brands':
        setCurrentView('admin_brands');
        break;
      case 'product_variants':
        setCurrentView('admin_variants');
        break;
      case 'reviews':
        setCurrentView('admin_reviews');
        break;
      case 'all_role':
        setCurrentView('admin_roles');
        break;
      case 'sales_report':
        setCurrentView('admin_sales_report');
        break;
      case 'employee_report':
        setCurrentView('admin_employee_report');
        break;
      case 'product_report':
        setCurrentView('admin_product_report');
        break;
      case 'customer_report':
        setCurrentView('admin_customer_report');
        break;
      case 'courier_integration':
        setCurrentView('admin_courier_integration');
        break;
      case 'courier_fee':
        setCurrentView('admin_courier_fee');
        break;
      case 'courier_scan':
        setCurrentView('admin_courier_scan');
        break;
      case 'courier_payment':
        setCurrentView('admin_courier_payment');
        break;
      case 'courier_invoice':
        setCurrentView('admin_courier_invoice');
        break;
      case 'accounting':
        setCurrentView('admin_accounting');
        break;
      case 'messages':
        setCurrentView('admin_messages');
        break;
      case 'settings':
        setCurrentView('admin_settings');
        break;
      case 'slider_settings':
        setCurrentView('admin_slider_settings');
        break;
      case 'promo_settings':
        setCurrentView('admin_promo_settings');
        break;
      case 'custom_pages':
        setCurrentView('admin_custom_pages');
        break;
      case 'all_admin':
        setCurrentView('admin_all_admin');
        break;
      case 'all_customer':
        setCurrentView('admin_all_customer');
        break;
      case 'customer_wishlist':
        setCurrentView('admin_customer_wishlist');
        break;
    }
  };

  // Super Admin: All Admins Page
  if (currentView === 'admin_all_admin') {
    return (
      <AllAdminsPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // Super Admin: All Customers Page
  if (currentView === 'admin_all_customer') {
    return (
      <AllCustomersPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // Super Admin: Customer Wishlist Page
  if (currentView === 'admin_customer_wishlist') {
    return (
      <CustomerWishlistPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }


  // Super Admin: Accounting Page (Screenshot 3)
  if (currentView === 'admin_accounting') {
    return (
      <AccountingPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // Super Admin: Messages Page (Screenshot 4)
  if (currentView === 'admin_messages') {
    return (
      <MessagesPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }


  // Super Admin: Settings Page (Screenshot 6)
  if (currentView === 'admin_settings') {
    return (
      <SettingsAdminPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // Super Admin: Home Slider Settings Page
  if (currentView === 'admin_slider_settings') {
    return (
      <SettingsAdminPage
        initialTab="slider"
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // Super Admin: Promo Banner Settings Page
  if (currentView === 'admin_promo_settings') {
    return (
      <SettingsAdminPage
        initialTab="promo"
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // Super Admin: Custom Pages Manager & Editor
  if (currentView === 'admin_custom_pages') {
    return (
      <CustomPagesAdminPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
        onViewLivePage={(pageId) => {
          setCurrentView(pageId as any);
        }}
      />
    );
  }

  // Super Admin: Courier Integration & Dispatch Hub
  if (currentView === 'admin_courier_integration') {
    return (
      <CourierIntegrationPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // Super Admin: Courier Fee Page (Screenshot 1)
  if (currentView === 'admin_courier_fee') {
    return (
      <CourierFeePage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // Super Admin: Scan To Update Page (Screenshot 2)
  if (currentView === 'admin_courier_scan') {
    return (
      <ScanToUpdatePage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // Super Admin: Courier Payment Page (Screenshot 3)
  if (currentView === 'admin_courier_payment') {
    return (
      <CourierPaymentPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // Super Admin: Courier Invoice Page (Screenshot 4)
  if (currentView === 'admin_courier_invoice') {
    return (
      <CourierInvoicePage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // Super Admin: All Roles Page (Screenshot 1)
  if (currentView === 'admin_roles') {
    return (
      <AllRolesPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // Super Admin: Sales Report Page (Screenshot 2)
  if (currentView === 'admin_sales_report') {
    return (
      <SalesReportPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // Super Admin: Employee Report Page (Screenshot 3)
  if (currentView === 'admin_employee_report') {
    return (
      <EmployeeReportPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // Super Admin: Product Report Page (Screenshot 4)
  if (currentView === 'admin_product_report') {
    return (
      <ProductReportPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // Super Admin: Customer Report Page (Screenshot 5)
  if (currentView === 'admin_customer_report') {
    return (
      <CustomerReportPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // 1. Super Admin: All Products Page (Screenshot 1)
  if (currentView === 'admin_products') {
    return (
      <AllProductsPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // 2. Super Admin: Stock Management Page (Screenshot 2)
  if (currentView === 'admin_stocks') {
    return (
      <StockManagementPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // 3. Super Admin: All Categories Page (Screenshot 3)
  if (currentView === 'admin_categories') {
    return (
      <AllCategoriesPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // 4. Super Admin: All Sections Page (New Screenshot 1)
  if (currentView === 'admin_sections') {
    return (
      <AllSectionsPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // 5. Super Admin: All Brands Page (New Screenshot 2)
  if (currentView === 'admin_brands') {
    return (
      <AllBrandsPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // 6. Super Admin: Product Variants Page (New Screenshot 3)
  if (currentView === 'admin_variants') {
    return (
      <ProductVariantsPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // 7. Super Admin: All Reviews Page (New Screenshot 4)
  if (currentView === 'admin_reviews') {
    return (
      <AllReviewsPage
        onNavigate={handleAdminNavigate}
        onBackToStore={() => setCurrentView('home')}
      />
    );
  }

  // 8. Super Admin: Orders View
  if (currentView === 'admin_orders') {
    return (
      <AdminOrdersPage
        onBackToDashboard={() => setCurrentView('admin_dashboard')}
        onBackToStore={() => setCurrentView('home')}
        onNavigate={handleAdminNavigate}
      />
    );
  }

  // Super Admin: Login Page (/admin)
  if (currentView === 'admin_login') {
    return (
      <AdminLoginPage
        onLoginSuccess={handleAdminLoginSuccess}
        onBackToStore={navigateToStore}
      />
    );
  }

  // 9. Super Admin: Dashboard View
  if (currentView === 'admin_dashboard') {
    return (
      <AdminDashboard
        onBackToStore={navigateToStore}
        onGoToOrders={() => setCurrentView('admin_orders')}
        onNavigate={handleAdminNavigate}
        onLogout={handleAdminLogout}
        orders={orders}
      />
    );
  }

  // 3. If in Dedicated Order & Checkout Page
  if (currentView === 'order_page') {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased font-sans">
        {toastMessage && (
          <div className="fixed top-16 right-4 z-50 bg-[#111827] text-white px-4 py-2.5 rounded shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <TopBar />

        <MainHeader
          cartCount={totalCartCount}
          wishlistCount={wishlistIds.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          allProducts={storeProducts}
          onSelectProduct={handleViewProduct}
          onOpenOrderTracking={handleOpenOrderTracking}
          onSearchSubmit={handleSearchSubmit}
          currentCustomer={currentCustomer}
          onOpenProfile={() => setIsProfileOpen(true)}
          onLogout={handleCustomerLogout}
        />

        <NavBar
          onSelectCategory={handleCategoryFilter}
          onFilterSection={handleFilterSection}
          onContactClick={() => {
            setCurrentView('home');
            setTimeout(() => {
              const el = document.getElementById('contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />

        <main className="flex-1">
          <OrderCheckoutPage
            cartItems={cartItems}
            orders={orders}
            onBackToHome={() => setCurrentView('home')}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveCartItem}
            onOrderSuccess={(order) => {
              setOrders((prev) => [order, ...prev]);
              setCartItems([]);
              appendOrderToAdminList(order);
              // Meta Pixel: Track Purchase event
              trackPurchase(order);
              showToast(`অর্ডার আইডি ${order.id} কনফার্ম হয়েছে!`);
            }}
            initialSelectedProduct={selectedProduct}
            initialTab={orderInitialTab}
          />
        </main>

        <FooterNew
          onOpenHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenProducts={() => {
            setCurrentView('products');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAbout={() => {
            setCurrentView('about_us');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenContact={() => {
            setCurrentView('contact_us');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPrivacy={() => {
            setCurrentView('privacy_policy');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenTerms={() => {
            setCurrentView('terms_conditions');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenReturn={() => {
            setCurrentView('return_policy');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenDelivery={() => {
            setCurrentView('delivery_policy');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAdmin={navigateToAdmin}
        />

        <FloatingButtons
          cartCount={totalCartCount}
          cartTotal={totalCartPrice}
          onOpenCart={() => setIsCartOpen(true)}
        />

        <CartDrawerNew
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveCartItem}
          onProceedToCheckout={handleProceedToCheckoutFromCart}
        />

        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          products={wishlistedProducts}
          onAddToCart={handleAddToCart}
          onInstantOrder={handleInstantOrder}
          onRemoveFromWishlist={handleToggleWishlist}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={(user) => {
            setCurrentCustomerState(user);
            showToast(`স্বাগতম, ${user.name}!`);
          }}
          onShowEmail={(email) => {
            setSentEmailModalData(email);
            setIsSentEmailModalOpen(true);
          }}
        />

        <CustomerProfileModal
          user={currentCustomer}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onLogout={handleCustomerLogout}
          onGoToOrders={handleOpenOrderTracking}
          onGoToWishlist={() => setIsWishlistOpen(true)}
        />

        <SentEmailModal
          email={sentEmailModalData}
          isOpen={isSentEmailModalOpen}
          onClose={() => setIsSentEmailModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-[#111827] text-white px-4 py-2.5 rounded shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Notice Announcement Bar */}
      <TopBar />

      {/* 2. Main Header */}
      <MainHeader
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        allProducts={storeProducts}
        onSelectProduct={handleViewProduct}
        onOpenOrderTracking={handleOpenOrderTracking}
        onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        onSearchSubmit={handleSearchSubmit}
        currentCustomer={currentCustomer}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleCustomerLogout}
      />

      {/* 3. Deep Red Navigation Bar */}
      <NavBar
        onSelectCategory={(catName) => {
          setSelectedCategory(catName);
          setCatalogSearchQuery('');
          setCurrentView('products');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onFilterSection={handleFilterSection}
        onContactClick={() => {
          setCurrentView('contact_us');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main View: PDP | Products Catalog | Custom Pages (About Us, Contact, Policies) | Homepage */}
      {currentView === 'product_detail' ? (
        <main className="flex-1 pb-24 md:pb-10">
          <ProductDetailPage
            product={selectedProduct}
            onBackToHome={() => setCurrentView('home')}
            onAddToCart={handleAddToCart}
            onInstantOrder={handleInstantOrder}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        </main>
      ) : currentView === 'products' ? (
        <main className="flex-1 pb-24 md:pb-10">
          <ProductsCatalogPage
            allProducts={storeProducts}
            onAddToCart={handleAddToCart}
            onInstantOrder={handleInstantOrder}
            onViewProduct={handleViewProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onBackToHome={() => setCurrentView('home')}
            initialCategory={selectedCategory}
            initialSearchQuery={catalogSearchQuery}
          />
        </main>
      ) : ['about_us', 'contact_us', 'privacy_policy', 'terms_conditions', 'return_policy', 'delivery_policy'].includes(currentView) ? (
        <main className="flex-1 pb-24 md:pb-10">
          <CustomPageView
            pageId={currentView as any}
            onBackToHome={() => setCurrentView('home')}
            onGoToProducts={() => {
              setCurrentView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      ) : (
        <main className="flex-1 pb-24 md:pb-8 space-y-2">
          {/* Top Hero Banner (Cooking Oil) */}
          <HeroSlider />

          {/* Circular Category Carousel */}
          <CategoriesCarousel
            onSelectCategory={(catName) => {
              setSelectedCategory(catName);
              setCatalogSearchQuery('');
              setCurrentView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            selectedCategory={selectedCategory}
          />

          {/* Section 1: Hot Deals */}
          <ProductSectionGrid
            id="hot-deals"
            title="Hot Deals"
            products={hotDealsProducts}
            onAddToCart={handleAddToCart}
            onInstantOrder={handleInstantOrder}
            onViewProduct={handleViewProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onViewAll={() => {
              setCurrentView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Middle Promotional Banner: Fashion, Bags & Shoes Promo */}
          <FashionPromoBanner />

          {/* Section 2: Flash Sale */}
          <ProductSectionGrid
            id="flash-sale"
            title="Flash Sale"
            products={flashSaleProducts}
            onAddToCart={handleAddToCart}
            onInstantOrder={handleInstantOrder}
            onViewProduct={handleViewProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onViewAll={() => {
              setCurrentView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Section 3: Top Rated */}
          <ProductSectionGrid
            id="top-rated"
            title="Top Rated"
            products={topRatedProducts}
            onAddToCart={handleAddToCart}
            onInstantOrder={handleInstantOrder}
            onViewProduct={handleViewProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onViewAll={() => {
              setCurrentView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Section 4: Best Sells */}
          <ProductSectionGrid
            id="best-sells"
            title="Best Sells"
            products={bestSellsProducts}
            onAddToCart={handleAddToCart}
            onInstantOrder={handleInstantOrder}
            onViewProduct={handleViewProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onViewAll={() => {
              setCurrentView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Section 5: Temporary Section */}
          <ProductSectionGrid
            id="temporary"
            title="Temporary Section"
            products={temporaryProducts}
            onAddToCart={handleAddToCart}
            onInstantOrder={handleInstantOrder}
            onViewProduct={handleViewProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onViewAll={() => {
              setCurrentView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Section 6: আমাদের ব্র্যান্ড (Our Brands) */}
          <BrandSection onSelectBrand={(brandName) => handleSearchSubmit(brandName)} />

          {/* Section 7: আমাদের কাস্টমার রিভিউ (Customer Reviews) */}
          <CustomerReviewsSection />
        </main>
      )}

      {/* Footer */}
      <div id="contact">
        <FooterNew
          onOpenHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenProducts={() => {
            setCurrentView('products');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAbout={() => {
            setCurrentView('about_us');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenContact={() => {
            setCurrentView('contact_us');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPrivacy={() => {
            setCurrentView('privacy_policy');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenTerms={() => {
            setCurrentView('terms_conditions');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenReturn={() => {
            setCurrentView('return_policy');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenDelivery={() => {
            setCurrentView('delivery_policy');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAdmin={navigateToAdmin}
        />
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigateHome={() => setCurrentView('home')}
        onNavigateProducts={() => {
          setSelectedCategory('all');
          setCurrentView('products');
        }}
        onNavigateCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentView('products');
        }}
        onNavigatePage={(pId) => {
          setCurrentView(pId as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateOrderPage={handleOpenOrderTracking}
        onOpenAdmin={navigateToAdmin}
        currentCustomer={currentCustomer}
        onOpenAuth={() => {
          setIsMobileMenuOpen(false);
          setIsAuthOpen(true);
        }}
        onOpenProfile={() => {
          setIsMobileMenuOpen(false);
          setIsProfileOpen(true);
        }}
        onLogout={handleCustomerLogout}
      />

      {/* Mobile Bottom Navigation Bar (Fixed at bottom on mobile) */}
      <MobileBottomNav
        currentView={currentView}
        cartCount={totalCartCount}
        onGoHome={() => {
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoProducts={() => {
          setCurrentView('products');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCategories={() => setIsMobileMenuOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onOpenOrderTracking={handleOpenOrderTracking}
      />

      {/* Floating Cart and Chat Button */}
      <FloatingButtons
        cartCount={totalCartCount}
        cartTotal={totalCartPrice}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawerNew
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckoutFromCart}
      />

      {/* Quick Order Modal */}
      <OrderModal
        product={orderModalProduct}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onOrderSuccess={(order) => {
          setOrders((prev) => [order, ...prev]);
          appendOrderToAdminList(order);
          // Meta Pixel: Track Purchase event
          trackPurchase(order);
          showToast(`অর্ডার আইডি ${order.id} কনফার্ম হয়েছে!`);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={wishlistedProducts}
        onAddToCart={handleAddToCart}
        onInstantOrder={handleInstantOrder}
        onRemoveFromWishlist={handleToggleWishlist}
      />

      {/* Login | Register Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentCustomerState(user);
          showToast(`স্বাগতম, ${user.name}!`);
        }}
        onShowEmail={(email) => {
          setSentEmailModalData(email);
          setIsSentEmailModalOpen(true);
        }}
      />

      {/* Customer Profile Modal */}
      <CustomerProfileModal
        user={currentCustomer}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={handleCustomerLogout}
        onGoToOrders={handleOpenOrderTracking}
        onGoToWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Sent Email & Gmail Notification Modal */}
      <SentEmailModal
        email={sentEmailModalData}
        isOpen={isSentEmailModalOpen}
        onClose={() => setIsSentEmailModalOpen(false)}
      />
    </div>
  );
}
