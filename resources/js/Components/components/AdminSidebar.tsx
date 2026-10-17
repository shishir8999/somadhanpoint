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
  BookOpen
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

  // Collapsed sidebar state with persistence
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ecom_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

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

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-60'
      } bg-[#111827] text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 select-none transition-all duration-300 ease-in-out relative z-20`}
    >
      {/* Brand Header */}
      {isCollapsed ? (
        <div className="h-16 px-2 flex items-center justify-between border-b border-slate-800">
          <div
            className="cursor-pointer mx-auto flex flex-col items-center gap-1"
            onClick={() => onNavigate('dashboard')}
            title={`${settings.siteName} Dashboard`}
          >
            {settings.logoUrl ? (
              <div
                className={`transition-all ${
                  settings.adminLogoBg === 'transparent'
                    ? 'p-0.5'
                    : 'bg-white rounded-lg p-1 shadow-sm border border-white/20 flex items-center justify-center'
                }`}
              >
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  className={`w-7 h-7 object-contain ${
                    settings.adminLogoBg === 'transparent'
                      ? 'drop-shadow-[0_1px_4px_rgba(255,255,255,0.3)]'
                      : ''
                  }`}
                />
              </div>
            ) : (
              <span className="text-base font-bold tracking-tight text-white font-sans">
                E<span className="italic text-red-500 font-serif">B</span>
              </span>
            )}
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
            className="flex items-center gap-2 cursor-pointer max-w-[170px] overflow-hidden"
            onClick={() => onNavigate('dashboard')}
            title={`${settings.siteName} ড্যাশবোর্ড`}
          >
            {settings.logoUrl ? (
              <>
                <div
                  className={`transition-all shrink-0 ${
                    settings.adminLogoBg === 'transparent'
                      ? 'p-0.5'
                      : 'bg-white rounded-lg px-2.5 py-1.5 shadow-md border border-white/20 inline-flex items-center justify-center'
                  }`}
                >
                  <img
                    src={settings.logoUrl}
                    alt="Logo"
                    className={`h-8 max-w-[135px] object-contain ${
                      settings.adminLogoBg === 'transparent'
                        ? 'drop-shadow-[0_1px_6px_rgba(255,255,255,0.3)]'
                        : ''
                    }`}
                  />
                </div>
                {settings.showLogoText && (
                  <span className="text-sm font-bold tracking-tight text-white font-sans truncate">
                    {settings.siteName}
                  </span>
                )}
              </>
            ) : (
              <span className="text-xl font-bold tracking-tight text-white font-sans truncate">
                {settings.siteName.toLowerCase().includes('byte') ? (
                  <>
                    {settings.siteName.replace(/byte/i, '')}
                    <span className="italic text-red-500 font-serif">Byte</span>
                  </>
                ) : (
                  settings.siteName
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
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
      <nav className={`p-2 space-y-1 flex-1 text-xs overflow-y-auto ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {/* 1. Dashboard */}
        <button
          onClick={() => onNavigate('dashboard')}
          title="Dashboard"
          className={`flex items-center transition-colors text-left cursor-pointer ${
            isCollapsed
              ? `w-10 h-10 justify-center rounded-lg ${
                  activePage === 'dashboard' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              : `w-full gap-2.5 px-3 py-2 rounded-lg ${
                  activePage === 'dashboard' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-emerald-400 shrink-0" />
          {!isCollapsed && <span>Dashboard</span>}
        </button>

        {/* 2. Orders */}
        <button
          onClick={() => onNavigate('orders')}
          title="Orders"
          className={`flex items-center transition-colors text-left cursor-pointer ${
            isCollapsed
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
            {!isCollapsed && <span>Orders</span>}
          </div>
          {!isCollapsed && activePage === 'orders' && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
        </button>

        {/* 3. Product (Accordion) */}
        <div className={isCollapsed ? 'w-full flex flex-col items-center' : 'w-full'}>
          <button
            onClick={() => {
              if (isCollapsed) {
                onNavigate('all_products');
              } else {
                setIsProductExpanded(!isProductExpanded);
              }
            }}
            title="Product (All Products, Stocks, Categories...)"
            className={`flex items-center transition-colors text-left cursor-pointer ${
              isCollapsed
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
              {!isCollapsed && <span>Product</span>}
            </div>
            {!isCollapsed && (
              isProductExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {!isCollapsed && isProductExpanded && (
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
                  onClick={() => onNavigate(item.id as AdminPageType)}
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
        <div className={isCollapsed ? 'w-full flex flex-col items-center' : 'w-full'}>
          <button
            onClick={() => {
              if (isCollapsed) {
                onNavigate('all_role');
              } else {
                setIsUsersExpanded(!isUsersExpanded);
              }
            }}
            title="Users (All Role, Admins, Customers)"
            className={`flex items-center transition-colors text-left cursor-pointer ${
              isCollapsed
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
              {!isCollapsed && <span>Users</span>}
            </div>
            {!isCollapsed && (
              isUsersExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {!isCollapsed && isUsersExpanded && (
            <div className="pl-6 pr-2 py-1 space-y-0.5 border-l border-slate-700/60 ml-4 my-1">
              {[
                { id: 'all_admin', label: 'All Admin' },
                { id: 'all_customer', label: 'All Customer' },
                { id: 'customer_wishlist', label: 'Customer Wishlist' },
                { id: 'all_role', label: 'All Role' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as AdminPageType)}
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
        <div className={isCollapsed ? 'w-full flex flex-col items-center' : 'w-full'}>
          <button
            onClick={() => {
              if (isCollapsed) {
                onNavigate('sales_report');
              } else {
                setIsReportsExpanded(!isReportsExpanded);
              }
            }}
            title="Reports (Sales, Employee, Product, Customer)"
            className={`flex items-center transition-colors text-left cursor-pointer ${
              isCollapsed
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
              {!isCollapsed && <span>Reports</span>}
            </div>
            {!isCollapsed && (
              isReportsExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {!isCollapsed && isReportsExpanded && (
            <div className="pl-6 pr-2 py-1 space-y-0.5 border-l border-slate-700/60 ml-4 my-1">
              {[
                { id: 'sales_report', label: 'Sales Report' },
                { id: 'employee_report', label: 'Employee Report' },
                { id: 'product_report', label: 'Product Report' },
                { id: 'customer_report', label: 'Customer Report' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as AdminPageType)}
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
        <div className={isCollapsed ? 'w-full flex flex-col items-center' : 'w-full'}>
          <button
            onClick={() => {
              if (isCollapsed) {
                onNavigate('courier_fee');
              } else {
                setIsCourierExpanded(!isCourierExpanded);
              }
            }}
            title="Courier (Courier Fee, Scan To Update, Payment, Invoice)"
            className={`flex items-center transition-colors text-left cursor-pointer ${
              isCollapsed
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
              {!isCollapsed && <span>Courier</span>}
            </div>
            {!isCollapsed && (
              isCourierExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {!isCollapsed && isCourierExpanded && (
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
                  onClick={() => onNavigate(item.id as AdminPageType)}
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
          onClick={() => onNavigate('accounting')}
          title="Accounting"
          className={`flex items-center transition-colors text-left cursor-pointer ${
            isCollapsed
              ? `w-10 h-10 justify-center rounded-lg ${
                  activePage === 'accounting' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              : `w-full gap-2.5 px-3 py-2 rounded-lg ${
                  activePage === 'accounting' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-400 shrink-0" />
          {!isCollapsed && <span>Accounting</span>}
        </button>

        {/* 9. Messages */}
        <button
          onClick={() => onNavigate('messages')}
          title="Messages"
          className={`flex items-center transition-colors text-left cursor-pointer ${
            isCollapsed
              ? `w-10 h-10 justify-center rounded-lg ${
                  activePage === 'messages' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              : `w-full gap-2.5 px-3 py-2 rounded-lg ${
                  activePage === 'messages' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
          }`}
        >
          <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
          {!isCollapsed && <span>Messages</span>}
        </button>

        {/* 10. Pages (পেইজসমূহ এডিটর) */}
        <button
          onClick={() => onNavigate('custom_pages')}
          title="Custom Pages Manager (পেইজসমূহ এডিটর)"
          className={`flex items-center transition-colors text-left cursor-pointer ${
            isCollapsed
              ? `w-10 h-10 justify-center rounded-lg ${
                  activePage === 'custom_pages' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              : `w-full gap-2.5 px-3 py-2 rounded-lg ${
                  activePage === 'custom_pages' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
          {!isCollapsed && <span>Pages (পেইজসমূহ)</span>}
        </button>

        {/* 11. Settings */}
        <button
          onClick={() => onNavigate('settings')}
          title="Settings"
          className={`flex items-center transition-colors text-left cursor-pointer ${
            isCollapsed
              ? `w-10 h-10 justify-center rounded-lg ${
                  activePage === 'settings' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              : `w-full gap-2.5 px-3 py-2 rounded-lg ${
                  activePage === 'settings' ? 'bg-[#1f2937] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
          }`}
        >
          <Settings className="w-4 h-4 text-emerald-400 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </nav>

      {/* Bottom Storefront & Logout quick switchers */}
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
  );
};
