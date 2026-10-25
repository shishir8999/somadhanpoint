import React, { useState, useEffect } from 'react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  Truck,
  Calculator,
  Mail,
  Settings,
  ChevronDown,
  ChevronUp,
  Moon,
  Sun,
  ExternalLink,
  Sidebar,
  PanelLeftOpen,
  PanelLeftClose,
  LogOut,
  BookOpen,
  Menu,
  X,
  Sliders,
  ImageIcon,
  Sparkles
} from 'lucide-react';

export type AdminPageType =
  | 'dashboard'
  | 'orders'
  | 'all_products'
  | 'stock_management'
  | 'all_categories'
  | 'all_sections'
  | 'all_brands'
  | 'product_variants'
  | 'reviews'
  | 'slider_settings'
  | 'promo_settings'
  | 'all_admin'
  | 'all_customer'
  | 'customer_wishlist'
  | 'all_role'
  | 'sales_report'
  | 'employee_report'
  | 'product_report'
  | 'customer_report'
  | 'courier_integration'
  | 'courier_fee'
  | 'courier_scan'
  | 'courier_payment'
  | 'courier_invoice'
  | 'accounting'
  | 'messages'
  | 'custom_pages'
  | 'settings';

interface AdminSidebarProps {
  activePage: AdminPageType;
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
  onLogout?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activePage,
  onNavigate,
  onBackToStore,
  onLogout,
}) => {
  const { settings } = useStoreSettings();

  // Dark mode state with persistence and DOM sync
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('ecom_admin_dark_mode');
      if (stored !== null) return stored === 'true';
      return document.documentElement.classList.contains('dark');
    } catch {
      return false;
    }
  });

  // Collapsed sidebar state with persistence (desktop only)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ecom_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Mobile drawer open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Accordion states
  const [isProductExpanded, setIsProductExpanded] = useState(
    ['all_products', 'stock_management', 'all_categories', 'all_sections', 'all_brands', 'product_variants', 'reviews'].includes(activePage)
  );
  const [isUsersExpanded, setIsUsersExpanded] = useState(
    ['all_admin', 'all_customer', 'customer_wishlist', 'all_role'].includes(activePage)
  );
  const [isReportsExpanded, setIsReportsExpanded] = useState(
    ['sales_report', 'employee_report', 'product_report', 'customer_report'].includes(activePage)
  );
  const [isCourierExpanded, setIsCourierExpanded] = useState(
    ['courier_integration', 'courier_fee', 'courier_scan', 'courier_payment', 'courier_invoice'].includes(activePage)
  );

  // Sync dark mode class on document.documentElement
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('ecom_admin_dark_mode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('ecom_admin_dark_mode', 'false');
      }
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  // Global event listeners for mobile drawer
  useEffect(() => {
    const handleToggle = () => setIsMobileOpen((prev) => !prev);
    const handleOpen = () => setIsMobileOpen(true);
    const handleClose = () => setIsMobileOpen(false);

    window.addEventListener('toggle-admin-mobile-sidebar', handleToggle);
    window.addEventListener('open-admin-mobile-sidebar', handleOpen);
    window.addEventListener('close-admin-mobile-sidebar', handleClose);
    return () => {
      window.removeEventListener('toggle-admin-mobile-sidebar', handleToggle);
      window.removeEventListener('open-admin-mobile-sidebar', handleOpen);
      window.removeEventListener('close-admin-mobile-sidebar', handleClose);
    };
  }, []);

  // Lock body scroll on mobile when drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // Toggle Collapse
  const handleToggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    try {
      localStorage.setItem('ecom_admin_sidebar_collapsed', String(next));
    } catch {
      // ignore
    }
  };

  // Toggle Dark Mode
  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleNavClick = (page: AdminPageType) => {
    onNavigate(page);
    setIsMobileOpen(false);
  };

  const currentLogo = settings.logoUrl || '/somadhan-logo.svg';

  // Navigation Items Renderer
  const renderNavItems = (isMobile: boolean) => {
    const collapsed = !isMobile && isCollapsed;

    return (
      <div className={`p-2 space-y-1 text-xs ${collapsed ? 'flex flex-col items-center' : ''}`}>
        {/* 1. Dashboard */}
        <button
          onClick={() => handleNavClick('dashboard')}
          title="Dashboard"
          className={`flex items-center transition-colors text-left cursor-pointer ${
            collapsed
              ? `w-10 h-10 justify-center rounded-lg ${
                  activePage === 'dashboard' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              : `w-full gap-2.5 px-3 py-2 rounded-lg ${
                  activePage === 'dashboard' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-emerald-400 shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </button>

        {/* 2. Orders */}
        <button
          onClick={() => handleNavClick('orders')}
          title="Orders"
          className={`flex items-center transition-colors text-left cursor-pointer ${
            collapsed
              ? `w-10 h-10 justify-center rounded-lg ${
                  activePage === 'orders' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              : `w-full justify-between px-3 py-2 rounded-lg ${
                  activePage === 'orders' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
            {!collapsed && <span>Orders</span>}
          </div>
          {!collapsed && activePage === 'orders' && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
        </button>

        {/* 3. Product (Accordion) */}
        <div className={collapsed ? 'w-full flex flex-col items-center' : 'w-full'}>
          <button
            onClick={() => {
              if (collapsed) {
                handleNavClick('all_products');
              } else {
                setIsProductExpanded(!isProductExpanded);
              }
            }}
            title="Product (All Products, Stocks, Categories...)"
            className={`flex items-center transition-colors text-left cursor-pointer ${
              collapsed
                ? `w-10 h-10 justify-center rounded-lg ${
                    ['all_products', 'stock_management', 'all_categories', 'all_sections', 'all_brands', 'product_variants', 'reviews'].includes(activePage)
                      ? 'bg-[#1f2937] text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                : `w-full justify-between px-3 py-2 rounded-lg ${
                    ['all_products', 'stock_management', 'all_categories', 'all_sections', 'all_brands', 'product_variants', 'reviews'].includes(activePage)
                      ? 'bg-[#1f2937]/70 text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-emerald-400 shrink-0" />
              {!collapsed && <span>Product</span>}
            </div>
            {!collapsed && (
              isProductExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {!collapsed && isProductExpanded && (
            <div className="pl-6 pr-2 py-1 space-y-0.5 border-l border-slate-700/60 ml-4 my-1">
              {[
                { id: 'all_products', label: 'All Products' },
                { id: 'stock_management', label: 'Stock Management' },
                { id: 'all_categories', label: 'All Categories' },
                { id: 'all_sections', label: 'All Sections' },
                { id: 'all_brands', label: 'All Brands' },
                { id: 'product_variants', label: 'Product Variants' },
                { id: 'reviews', label: 'Reviews' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as AdminPageType)}
                  className={`w-full text-left px-3 py-1.5 rounded text-[11px] transition-colors block cursor-pointer ${
                    activePage === item.id
                      ? 'bg-[#1e293b] text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Users (Accordion) */}
        <div className={collapsed ? 'w-full flex flex-col items-center' : 'w-full'}>
          <button
            onClick={() => {
              if (collapsed) {
                handleNavClick('all_role');
              } else {
                setIsUsersExpanded(!isUsersExpanded);
              }
            }}
            title="Users (All Role, Admins, Customers)"
            className={`flex items-center transition-colors text-left cursor-pointer ${
              collapsed
                ? `w-10 h-10 justify-center rounded-lg ${
                    ['all_admin', 'all_customer', 'customer_wishlist', 'all_role'].includes(activePage)
                      ? 'bg-[#1f2937] text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                : `w-full justify-between px-3 py-2 rounded-lg ${
                    ['all_admin', 'all_customer', 'customer_wishlist', 'all_role'].includes(activePage)
                      ? 'bg-[#1f2937]/70 text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-emerald-400 shrink-0" />
              {!collapsed && <span>Users</span>}
            </div>
            {!collapsed && (
              isUsersExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {!collapsed && isUsersExpanded && (
            <div className="pl-6 pr-2 py-1 space-y-0.5 border-l border-slate-700/60 ml-4 my-1">
              {[
                { id: 'all_admin', label: 'All Admin' },
                { id: 'all_customer', label: 'All Customer' },
                { id: 'customer_wishlist', label: 'Customer Wishlist' },
                { id: 'all_role', label: 'All Role' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as AdminPageType)}
                  className={`w-full text-left px-3 py-1.5 rounded text-[11px] transition-colors block cursor-pointer ${
                    activePage === item.id
                      ? 'bg-[#1e293b] text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5. Reports (Accordion) */}
        <div className={collapsed ? 'w-full flex flex-col items-center' : 'w-full'}>
          <button
            onClick={() => {
              if (collapsed) {
                handleNavClick('sales_report');
              } else {
                setIsReportsExpanded(!isReportsExpanded);
              }
            }}
            title="Reports (Sales, Employee, Product, Customer)"
            className={`flex items-center transition-colors text-left cursor-pointer ${
              collapsed
                ? `w-10 h-10 justify-center rounded-lg ${
                    ['sales_report', 'employee_report', 'product_report', 'customer_report'].includes(activePage)
                      ? 'bg-[#1f2937] text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                : `w-full justify-between px-3 py-2 rounded-lg ${
                    ['sales_report', 'employee_report', 'product_report', 'customer_report'].includes(activePage)
                      ? 'bg-[#1f2937]/70 text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
              {!collapsed && <span>Reports</span>}
            </div>
            {!collapsed && (
              isReportsExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {!collapsed && isReportsExpanded && (
            <div className="pl-6 pr-2 py-1 space-y-0.5 border-l border-slate-700/60 ml-4 my-1">
              {[
                { id: 'sales_report', label: 'Sales Report' },
                { id: 'employee_report', label: 'Employee Report' },
                { id: 'product_report', label: 'Product Report' },
                { id: 'customer_report', label: 'Customer Report' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as AdminPageType)}
                  className={`w-full text-left px-3 py-1.5 rounded text-[11px] transition-colors block cursor-pointer ${
                    activePage === item.id
                      ? 'bg-[#1e293b] text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 6. Courier (Accordion) */}
        <div className={collapsed ? 'w-full flex flex-col items-center' : 'w-full'}>
          <button
            onClick={() => {
              if (collapsed) {
                handleNavClick('courier_fee');
              } else {
                setIsCourierExpanded(!isCourierExpanded);
              }
            }}
            title="Courier (Courier Fee, Scan To Update, Payment, Invoice)"
            className={`flex items-center transition-colors text-left cursor-pointer ${
              collapsed
                ? `w-10 h-10 justify-center rounded-lg ${
                    ['courier_fee', 'courier_scan', 'courier_payment', 'courier_invoice'].includes(activePage)
                      ? 'bg-[#1f2937] text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                : `w-full justify-between px-3 py-2 rounded-lg ${
                    ['courier_fee', 'courier_scan', 'courier_payment', 'courier_invoice'].includes(activePage)
                      ? 'bg-[#1f2937]/70 text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              {!collapsed && <span>Courier</span>}
            </div>
            {!collapsed && (
              isCourierExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {!collapsed && isCourierExpanded && (
            <div className="pl-6 pr-2 py-1 space-y-0.5 border-l border-slate-700/60 ml-4 my-1">
              {[
                { id: 'courier_integration', label: 'Send to Courier (ইন্টিগ্রেশন)' },
                { id: 'courier_fee', label: 'Courier Fee & API' },
                { id: 'courier_scan', label: 'Scan To Update' },
                { id: 'courier_payment', label: 'Courier Payment' },
                { id: 'courier_invoice', label: 'Courier Invoice' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as AdminPageType)}
                  className={`w-full text-left px-3 py-1.5 rounded text-[11px] transition-colors block cursor-pointer ${
                    activePage === item.id
                      ? 'bg-[#1e293b] text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 7. Accounting */}
        <button
          onClick={() => handleNavClick('accounting')}
          title="Accounting"
          className={`flex items-center transition-colors text-left cursor-pointer ${
            collapsed
              ? `w-10 h-10 justify-center rounded-lg ${
                  activePage === 'accounting' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              : `w-full gap-2.5 px-3 py-2 rounded-lg ${
                  activePage === 'accounting' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-400 shrink-0" />
          {!collapsed && <span>Accounting</span>}
        </button>

        {/* 8. Messages */}
        <button
          onClick={() => handleNavClick('messages')}
          title="Messages"
          className={`flex items-center transition-colors text-left cursor-pointer ${
            collapsed
              ? `w-10 h-10 justify-center rounded-lg ${
                  activePage === 'messages' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              : `w-full gap-2.5 px-3 py-2 rounded-lg ${
                  activePage === 'messages' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
          }`}
        >
          <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
          {!collapsed && <span>Messages</span>}
        </button>

        {/* 9. Pages (পেইজসমূহ এডিটর) */}
        <button
          onClick={() => handleNavClick('custom_pages')}
          title="Custom Pages Manager (পেইজসমূহ এডিটর)"
          className={`flex items-center transition-colors text-left cursor-pointer ${
            collapsed
              ? `w-10 h-10 justify-center rounded-lg ${
                  activePage === 'custom_pages' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              : `w-full gap-2.5 px-3 py-2 rounded-lg ${
                  activePage === 'custom_pages' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
          {!collapsed && <span>Pages (পেইজসমূহ)</span>}
        </button>

        {/* 10. Home Slider Settings (হোম স্লাইডার) */}
        <button
          onClick={() => handleNavClick('slider_settings')}
          title="Home Slider Settings (হোম স্লাইডার)"
          className={`flex items-center transition-colors text-left cursor-pointer ${
            collapsed
              ? `w-10 h-10 justify-center rounded-lg ${
                  activePage === 'slider_settings' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              : `w-full gap-2.5 px-3 py-2 rounded-lg ${
                  activePage === 'slider_settings' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
          }`}
        >
          <Sliders className="w-4 h-4 text-emerald-400 shrink-0" />
          {!collapsed && <span>Home Slider (স্লাইডার)</span>}
        </button>

        {/* 11. Promo Banner Settings (প্রমো ব্যানার ও কালেকশন) */}
        <button
          onClick={() => handleNavClick('promo_settings')}
          title="Promo Banner Settings (প্রমো ব্যানার ও স্পেশাল কালেকশন)"
          className={`flex items-center transition-colors text-left cursor-pointer ${
            collapsed
              ? `w-10 h-10 justify-center rounded-lg ${
                  activePage === 'promo_settings' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              : `w-full gap-2.5 px-3 py-2 rounded-lg ${
                  activePage === 'promo_settings' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          {!collapsed && <span>Promo Banner (প্রমো ব্যানার)</span>}
        </button>

        {/* 12. Settings */}
        <button
          onClick={() => handleNavClick('settings')}
          title="Settings"
          className={`flex items-center transition-colors text-left cursor-pointer ${
            collapsed
              ? `w-10 h-10 justify-center rounded-lg ${
                  activePage === 'settings' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              : `w-full gap-2.5 px-3 py-2 rounded-lg ${
                  activePage === 'settings' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
          }`}
        >
          <Settings className="w-4 h-4 text-emerald-400 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    );
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. DESKTOP PERMANENT SIDEBAR (Hidden on Mobile < md)   */}
      {/* ======================================================== */}
      <aside
        className={`hidden md:flex ${
          isCollapsed ? 'w-16' : 'w-60'
        } bg-[#111827] text-slate-300 flex-col shrink-0 min-h-screen border-r border-slate-800 select-none transition-all duration-300 ease-in-out relative z-20`}
      >
        {/* Brand Header */}
        {isCollapsed ? (
          <div className="h-16 px-2 flex items-center justify-between border-b border-slate-800">
            <div
              className="cursor-pointer mx-auto flex flex-col items-center gap-1"
              onClick={() => onNavigate('dashboard')}
              title={`${settings.siteName} Dashboard`}
            >
              <img
                src="/somadhan-icon.svg"
                alt="Logo"
                className="w-8 h-8 rounded-lg object-contain drop-shadow-sm hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/somadhan-icon.svg';
                }}
              />
            </div>

            <div className="flex flex-col gap-1 items-center">
              <button
                type="button"
                onClick={handleToggleCollapse}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                title="Expand Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                type="button"
                onClick={handleToggleDarkMode}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-16 px-3.5 flex items-center justify-between border-b border-slate-800">
            <div
              className="flex items-center gap-2 cursor-pointer max-w-[175px] overflow-hidden"
              onClick={() => onNavigate('dashboard')}
              title={`${settings.siteName} ড্যাশবোর্ড`}
            >
              <img
                src={currentLogo}
                alt="Somadhan Point"
                className="h-8 max-w-[155px] object-contain drop-shadow-sm"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/somadhan-logo.svg';
                }}
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleToggleDarkMode}
                className="text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={handleToggleCollapse}
                className="text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                title="Collapse Sidebar"
              >
                <Sidebar className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Nav Menu */}
        <nav className="flex-1 overflow-y-auto no-scrollbar">
          {renderNavItems(false)}
        </nav>

        {/* Bottom Storefront & Logout */}
        <div className="p-2 border-t border-slate-800 space-y-1.5">
          <button
            onClick={onBackToStore}
            title="ভিজিট স্টোরফ্রন্ট (Visit Storefront)"
            className={`rounded bg-red-700 hover:bg-red-800 text-white text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
              isCollapsed ? 'w-10 h-10 mx-auto' : 'w-full py-2 px-3 gap-2'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span>স্টোর দেখুন</span>}
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              title="লগআউট (Logout)"
              className={`rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer border border-slate-700 ${
                isCollapsed ? 'w-10 h-10 mx-auto' : 'w-full py-1.5 px-3 gap-2'
              }`}
            >
              <LogOut className="w-3.5 h-3.5 shrink-0 text-rose-400" />
              {!isCollapsed && <span>লগআউট</span>}
            </button>
          )}
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MOBILE SLIDE-OVER DRAWER (Visible on Mobile < md)   */}
      {/* ======================================================== */}
      {/* Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 md:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#111827] text-slate-300 flex flex-col border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out md:hidden select-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header with Logo & Close */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div
            className="flex items-center gap-2 cursor-pointer max-w-[160px] overflow-hidden"
            onClick={() => handleNavClick('dashboard')}
          >
            <img
              src={currentLogo}
              alt="Somadhan Point"
              className="h-8 max-w-[145px] object-contain drop-shadow-sm"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/somadhan-logo.svg';
              }}
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleToggleDarkMode}
              className="text-slate-400 hover:text-white p-2 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="text-slate-400 hover:text-white p-2 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Links */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-2">
          {renderNavItems(true)}
        </nav>

        {/* Mobile Drawer Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#0c121e] shrink-0 space-y-2">
          <button
            type="button"
            onClick={() => {
              onBackToStore();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded bg-red-700 hover:bg-red-800 text-white transition-colors cursor-pointer shadow-md"
          >
            <ExternalLink className="w-4 h-4" />
            <span>লাইভ স্টোরফ্রন্ট দেখুন</span>
          </button>
          {onLogout && (
            <button
              type="button"
              onClick={() => {
                onLogout();
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded bg-slate-800/80 hover:bg-slate-800 text-rose-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>লগআউট করুন</span>
            </button>
          )}
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 3. MOBILE FLOATING QUICK MENU TRIGGER BUTTON           */}
      {/* ======================================================== */}
      {!isMobileOpen && (
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="fixed bottom-4 left-4 z-40 md:hidden bg-[#990000] hover:bg-[#800000] text-white px-3.5 py-2.5 rounded-full shadow-2xl border border-red-400/40 flex items-center gap-2 font-bold text-xs active:scale-95 transition-all cursor-pointer animate-in fade-in"
          title="সুপার অ্যাডমিন মেনু খুলুন"
        >
          <Menu className="w-4 h-4" />
          <span>অ্যাডমিন মেনু</span>
        </button>
      )}
    </>
  );
};
