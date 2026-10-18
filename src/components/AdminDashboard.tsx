import React, { useState } from 'react';
import { 
  Package, 
  Users, 
  FileText, 
  Truck, 
  MessageSquare, 
  Calculator, 
  Mail, 
  Layout, 
  Settings, 
  ChevronDown, 
  Calendar, 
  AlertTriangle, 
  Plus, 
  Bell, 
  User, 
  Moon, 
  Sun,
  TrendingDown,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  LayoutDashboard,
  Menu
} from 'lucide-react';
import { Order } from '../types';
import { AdminSidebar, AdminPageType } from './AdminSidebar';
import { triggerGlobalSuccessModal } from '../context/SuccessModalContext';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onGoToOrders: () => void;
  onNavigate?: (page: AdminPageType) => void;
  onLogout?: () => void;
  orders: Order[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onBackToStore, 
  onGoToOrders,
  onNavigate,
  onLogout,
  orders 
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  // New order state for quick create
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newAmount, setNewAmount] = useState('730');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, hasSub: false, action: () => setSelectedMenu('dashboard') },
    { id: 'orders', label: 'Orders', icon: FileText, hasSub: false, action: onGoToOrders },
    { id: 'product', label: 'Product', icon: Package, hasSub: true, action: () => setSelectedMenu('product') },
    { id: 'users', label: 'Users', icon: Users, hasSub: true, action: () => setSelectedMenu('users') },
    { id: 'reports', label: 'Reports', icon: FileText, hasSub: true, action: () => setSelectedMenu('reports') },
    { id: 'courier', label: 'Courier', icon: Truck, hasSub: true, action: () => setSelectedMenu('courier') },
    { id: 'sms', label: 'SMS', icon: MessageSquare, hasSub: true, action: () => setSelectedMenu('sms') },
    { id: 'accounting', label: 'Accounting', icon: Calculator, hasSub: false, action: () => setSelectedMenu('accounting') },
    { id: 'messages', label: 'Messages', icon: Mail, hasSub: false, action: () => setSelectedMenu('messages') },
    { id: 'landing', label: 'Landing Pages', icon: Layout, hasSub: false, action: () => setSelectedMenu('landing') },
    { id: 'settings', label: 'Settings', icon: Settings, hasSub: false, action: () => setSelectedMenu('settings') },
  ];

  // Activity bars mock
  const activityData = [
    { date: '09-03', val: 7 },
    { date: '09-05', val: 5 },
    { date: '09-08', val: 4 },
    { date: '09-10', val: 6 },
    { date: '09-11', val: 7 },
    { date: '09-12', val: 8 },
    { date: '09-13', val: 9 },
    { date: '09-15', val: 6 },
    { date: '09-18', val: 28 },
    { date: '09-21', val: 9 },
    { date: '09-23', val: 24 },
    { date: '09-24', val: 24 },
    { date: '09-26', val: 22 },
    { date: '09-28', val: 28 },
    { date: '10-01', val: 3 },
    { date: '10-02', val: 4 },
  ];

  const recentOrdersList = [
    { id: '#57528', item: 'Regrsi RE-NY032 Wireless Neckb...', amount: '৳ 730', employee: 'Employee 1', status: 'Pending', statusColor: 'bg-amber-100 text-amber-800' },
    { id: '#57527', item: 'Premium Quality Ambroydary C...', sub: '+8 more item(s)', amount: '৳ 13,790', employee: 'Employee 2', status: 'Pending', statusColor: 'bg-amber-100 text-amber-800' },
    { id: '#57526', item: 'Rechargeable Rain Cloud Humidi...', amount: '৳ 2,000', employee: 'Employee 2', status: 'Pending', statusColor: 'bg-amber-100 text-amber-800' },
    { id: '#57525', item: 'Premium School Bag PSB101', amount: '৳ 1,430', employee: 'Employee 2', status: 'Pending', statusColor: 'bg-amber-100 text-amber-800' },
    { id: '#57524', item: 'Premium School Bag PSB104', amount: '৳ 1,430', employee: 'Employee 2', status: 'Incomplete', statusColor: 'bg-slate-100 text-slate-700' },
    { id: '#57523', item: 'Smart Multi Function Table Lamp', amount: '৳ 1,260', employee: 'Employee 1', status: 'Pending', statusColor: 'bg-amber-100 text-amber-800' },
    { id: '#57522', item: 'Elastic Pedal Puller Resistance Ba...', amount: '৳ 1,450', employee: 'Employee 1', status: 'Pending', statusColor: 'bg-amber-100 text-amber-800' },
    { id: '#57521', item: 'Kids Cherry Borqa with Nikab KC...', amount: '৳ 1,150', employee: 'Employee 2', status: 'Pending', statusColor: 'bg-amber-100 text-amber-800' },
    { id: '#57520', item: '3D Hourglass Deep Sea Sandscape', amount: '৳ 1,300', employee: 'Employee 2', status: 'Pending', statusColor: 'bg-amber-100 text-amber-800' },
    { id: '#57517', item: 'Premium School Bag PSB103', sub: '+2 more item(s)', amount: '৳ 5,660', employee: 'Employee 2', status: 'In Transit', statusColor: 'bg-blue-100 text-blue-800' },
  ];

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f4f6f9] text-slate-800'}`}>
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="dashboard"
        onNavigate={(page) => {
          if (page === 'orders') onGoToOrders();
          else if (onNavigate) onNavigate(page);
        }}
        onBackToStore={onBackToStore}
        onLogout={onLogout}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="min-h-14 py-2 sm:h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs gap-2">
          {/* Left: Mobile Menu Trigger + Date Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-admin-mobile-sidebar'))}
              className="md:hidden p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="অ্যাডমিন মেনু খুলুন"
            >
              <Menu className="w-4 h-4 text-slate-800" />
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Today</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Right Action Icons & Buttons (Responsive & Scrollable if needed) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar py-1">
            {/* Stock Alert */}
            <button 
              onClick={() => onNavigate && onNavigate('stock_management')}
              className="px-2 sm:px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-xs font-bold flex items-center gap-1 hover:bg-amber-100 shrink-0 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden sm:inline">Stock Alert</span>
              <span className="text-[11px]">(1)</span>
            </button>

            {/* Create Order */}
            <button
              onClick={() => setShowCreateOrder(true)}
              className="px-2.5 sm:px-3 py-1.5 bg-[#990000] hover:bg-[#800000] text-white rounded-md text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Order</span>
            </button>

            {/* Check Balance */}
            <button 
              onClick={() => onNavigate && onNavigate('accounting')}
              className="px-2 sm:px-3 py-1.5 bg-[#990000] hover:bg-[#800000] text-white rounded-md text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs shrink-0 cursor-pointer"
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">৳</span>
              <span className="hidden sm:inline">Check Balance</span>
              <span className="sm:hidden text-xs">730</span>
            </button>

            {/* Notification Bell */}
            <button className="p-1.5 text-slate-500 hover:text-slate-800 relative shrink-0 cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-red-600 absolute top-1 right-1"></span>
            </button>

            {/* Avatar */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 text-xs font-bold shrink-0">
              SA
            </div>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <main className="p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          {/* Row 1: Top 4 KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {/* Card 1: Total Orders */}
            <div 
              onClick={onGoToOrders}
              className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between cursor-pointer hover:border-red-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500">Total Orders</span>
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-right sm:text-left">
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900">1</h3>
                <span className="text-[9px] sm:text-[10px] font-bold text-red-600 flex items-center justify-end sm:justify-start gap-0.5 mt-0.5">
                  <TrendingDown className="w-2.5 h-2.5" />
                  -75.0% <span className="text-slate-400 font-normal hidden xs:inline">VS Yesterday</span>
                </span>
              </div>
            </div>

            {/* Card 2: Total Sales */}
            <div 
              onClick={() => onNavigate && onNavigate('sales_report')}
              className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between cursor-pointer hover:border-red-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500">Total Sales</span>
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
                  ৳
                </div>
              </div>
              <div className="text-right sm:text-left">
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900">৳ 730</h3>
                <span className="text-[9px] sm:text-[10px] font-bold text-red-600 flex items-center justify-end sm:justify-start gap-0.5 mt-0.5">
                  <TrendingDown className="w-2.5 h-2.5" />
                  -96.1% <span className="text-slate-400 font-normal hidden xs:inline">VS Yesterday</span>
                </span>
              </div>
            </div>

            {/* Card 3: Total Items */}
            <div 
              onClick={() => onNavigate && onNavigate('all_products')}
              className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between cursor-pointer hover:border-red-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500">Total Items</span>
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="text-right sm:text-left">
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900">1</h3>
                <span className="text-[9px] sm:text-[10px] font-bold text-red-600 flex items-center justify-end sm:justify-start gap-0.5 mt-0.5">
                  <TrendingDown className="w-2.5 h-2.5" />
                  -91.7% <span className="text-slate-400 font-normal hidden xs:inline">VS Yesterday</span>
                </span>
              </div>
            </div>

            {/* Card 4: Total Customers */}
            <div 
              onClick={() => onNavigate && onNavigate('all_customer')}
              className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between cursor-pointer hover:border-red-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500">Total Customers</span>
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-right sm:text-left">
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900">1</h3>
                <span className="text-[9px] sm:text-[10px] font-bold text-red-600 flex items-center justify-end sm:justify-start gap-0.5 mt-0.5">
                  <TrendingDown className="w-2.5 h-2.5" />
                  -66.7% <span className="text-slate-400 font-normal hidden xs:inline">VS Yesterday</span>
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Order Activity Bar Chart (Left) + Top Selling Products (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Order Activity Bar Chart */}
            <div className="lg:col-span-8 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Order activity</h4>
                  <span className="text-xs text-slate-500">📅 Activity Overview</span>
                </div>
                <div className="text-xs font-semibold text-slate-700">
                  TOTAL <strong className="text-slate-900">290</strong> • AVG <strong className="text-slate-900">9</strong> • BEST 📈 <strong className="text-[#990000]">30</strong>
                </div>
              </div>

              {/* Bar Chart Mockup */}
              <div className="h-52 flex items-end justify-between gap-1.5 pt-6 pb-2 px-2 border-b border-slate-100">
                {activityData.map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      style={{ height: `${(bar.val / 30) * 160}px` }}
                      className="w-full max-w-[16px] bg-[#990000] group-hover:bg-red-700 rounded-t transition-all"
                      title={`${bar.date}: ${bar.val} orders`}
                    />
                    <span className="text-[9px] text-slate-400 rotate-45 mt-2 hidden sm:inline">
                      {bar.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="lg:col-span-4 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
              <h4 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2">
                Top Selling Products
              </h4>
              <div className="text-xs">
                <div className="grid grid-cols-12 text-[10px] uppercase font-bold text-slate-400 pb-2 border-b">
                  <span className="col-span-3">IMAGE</span>
                  <span className="col-span-5">NAME</span>
                  <span className="col-span-2 text-center">SOLD</span>
                  <span className="col-span-2 text-right">PRICE</span>
                </div>
                <div className="grid grid-cols-12 items-center py-2.5 border-b border-slate-100">
                  <div className="col-span-3 w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-xs">
                    🎧
                  </div>
                  <div className="col-span-5 font-semibold text-slate-800 truncate">
                    Regrsi ...
                  </div>
                  <div className="col-span-2 text-center font-bold">1</div>
                  <div className="col-span-2 text-right font-bold text-slate-900">৳ 650</div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Order Status Donut (Left) + Order Areas (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Order Status Donut */}
            <div className="lg:col-span-8 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h4 className="text-sm font-bold text-slate-900">Order status</h4>
                <button
                  onClick={onGoToOrders}
                  className="text-xs text-[#990000] font-semibold hover:underline"
                >
                  সব অর্ডার দেখুন →
                </button>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                {/* Yellow Donut */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#fef08a" strokeWidth="4" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="4"
                      strokeDasharray="88 100"
                    />
                  </svg>
                  <span className="absolute text-3xl font-black text-slate-900">1</span>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">
                      Pending
                    </span>
                    <span className="font-semibold text-slate-700">1</span>
                    <span className="font-bold text-slate-900">৳ 730</span>
                  </div>
                  <p className="text-xs text-slate-500 pt-2 border-t font-semibold">
                    Total: <strong className="text-slate-900">৳ 730</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Order Areas */}
            <div className="lg:col-span-4 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
              <h4 className="text-sm font-bold text-slate-900 mb-4 border-b pb-2">Order Areas</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Chittagong</span>
                    <span>1</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#990000] w-full rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Recent Orders Table (Left) + Order Sources (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-8 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs overflow-x-auto">
              <div className="flex items-center justify-between mb-3 border-b pb-2">
                <h4 className="text-sm font-bold text-slate-900">Recent Orders</h4>
                <button
                  onClick={onGoToOrders}
                  className="text-xs text-[#990000] font-bold hover:underline flex items-center gap-1"
                >
                  <span>সম্পূর্ণ অর্ডার পেজ খুলুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-[10px] uppercase font-bold text-slate-400">
                    <th className="pb-2">ORDER ID</th>
                    <th className="pb-2">ITEM</th>
                    <th className="pb-2">AMOUNT</th>
                    <th className="pb-2">EMPLOYEE</th>
                    <th className="pb-2 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrdersList.map((ord) => (
                    <tr
                      key={ord.id}
                      onClick={onGoToOrders}
                      className="hover:bg-slate-50 cursor-pointer"
                    >
                      <td className="py-2.5 font-bold text-slate-900">{ord.id}</td>
                      <td className="py-2.5 text-slate-800">
                        <p className="truncate max-w-[200px] font-medium">{ord.item}</p>
                        {ord.sub && <p className="text-[10px] text-slate-400">{ord.sub}</p>}
                      </td>
                      <td className="py-2.5 font-bold text-slate-900">{ord.amount}</td>
                      <td className="py-2.5 text-slate-600">{ord.employee}</td>
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ord.statusColor}`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Sources */}
            <div className="lg:col-span-4 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-4 border-b pb-2">Order Sources</h4>
                {/* Emerald Green Donut */}
                <div className="relative w-36 h-36 mx-auto my-4 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="4" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="block text-2xl font-black text-slate-900">1</span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">ORDERS</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2 border-t">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-full inline-block">
                  Website 1
                </span>
              </div>
            </div>
          </div>

          {/* Row 5: Hourly Report (Left) + Order Health (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Hourly Report Line Chart */}
            <div className="lg:col-span-8 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-3 border-b pb-2 text-xs">
                <span className="font-bold text-slate-900">
                  Hourly Report <span className="text-slate-400 font-normal">Orders in the last 24 hours</span>
                </span>
                <span className="text-slate-600 font-semibold">
                  TOTAL <strong>1</strong> • AVG <strong>0</strong> • PEAK 📈 <strong>1 2 PM</strong>
                </span>
              </div>

              {/* Sparkline Canvas / SVG */}
              <div className="h-36 w-full flex items-end">
                <svg className="w-full h-28" viewBox="0 0 600 100">
                  <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="50" x2="600" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                  {/* Point at 2 PM */}
                  <path
                    d="M 0 90 L 350 90 L 400 30 L 450 90 L 600 90"
                    fill="none"
                    stroke="#990000"
                    strokeWidth="2.5"
                  />
                  <circle cx="400" cy="30" r="4" fill="#990000" />
                </svg>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                <span>12 AM</span>
                <span>3 AM</span>
                <span>6 AM</span>
                <span>9 AM</span>
                <span>12 PM</span>
                <span>3 PM</span>
                <span>6 PM</span>
                <span>9 PM</span>
              </div>
            </div>

            {/* Order Health Gauge */}
            <div className="lg:col-span-4 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
              <h4 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2">Order health</h4>
              <div className="relative w-32 h-32 mx-auto my-2 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="4" />
                </svg>
                <span className="absolute text-xl font-black text-slate-900">100%</span>
              </div>
              <div className="space-y-1.5 text-xs pt-3 border-t">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Real Order
                  </span>
                  <span className="font-bold">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5 font-medium text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span> Fake Order
                  </span>
                  <span className="font-bold text-slate-400">0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 6: Brand Overview & Category Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Brand Overview</h4>
                <p className="text-xs text-slate-400">No data found</p>
              </div>
              <div className="w-20 h-20 rounded-full border-4 border-slate-200 flex flex-col items-center justify-center text-xs">
                <span className="font-bold">0</span>
                <span className="text-[10px] text-slate-400">৳ 0</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Category Overview</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    WI
                  </span>
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">Wired Headphone</p>
                    <p className="text-slate-500">1 orders • ৳ 650</p>
                  </div>
                </div>
              </div>
              <div className="w-20 h-20 rounded-full border-4 border-blue-600 flex flex-col items-center justify-center text-xs">
                <span className="font-bold">1</span>
                <span className="text-[10px] text-slate-500">৳ 650</span>
              </div>
            </div>
          </div>

          {/* Row 7: 365-day Activity Heatmap (GitHub Contribution style) */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4 border-b pb-2 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-600" />
                <span className="font-bold text-slate-900">
                  Order Activity <span className="text-slate-400 font-normal">Orders in the last 365 days</span>
                </span>
              </div>
              <div className="text-slate-600 font-semibold">
                TOTAL <strong>687</strong> • HIGHEST <strong>30</strong> • LOWEST <strong>0</strong> • AVERAGE <strong>1.9</strong>
              </div>
            </div>

            {/* Heatmap grid mockup */}
            <div className="overflow-x-auto no-scrollbar py-2">
              <div className="flex gap-1 items-center">
                {[...Array(38)].map((_, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-1">
                    {[...Array(7)].map((_, rowIdx) => {
                      let bg = 'bg-slate-100';
                      if (colIdx > 26) {
                        const r = (colIdx * 7 + rowIdx) % 10;
                        if (r === 1) bg = 'bg-red-200';
                        else if (r === 2 || r === 3) bg = 'bg-red-400';
                        else if (r === 4 || r === 5) bg = 'bg-red-600';
                        else if (r > 5) bg = 'bg-[#7f1d1d]';
                      }
                      return (
                        <div
                          key={rowIdx}
                          className={`w-3.5 h-3.5 rounded-xs ${bg} hover:ring-1 hover:ring-slate-900 cursor-pointer`}
                          title={`Day ${colIdx * 7 + rowIdx}: activity`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-3 border-t">
              <span>Hover a cell to see daily orders</span>
              <div className="flex items-center gap-1">
                <span>Less</span>
                <span className="w-2.5 h-2.5 bg-slate-100 rounded-xs"></span>
                <span className="w-2.5 h-2.5 bg-red-200 rounded-xs"></span>
                <span className="w-2.5 h-2.5 bg-red-400 rounded-xs"></span>
                <span className="w-2.5 h-2.5 bg-red-600 rounded-xs"></span>
                <span className="w-2.5 h-2.5 bg-[#7f1d1d] rounded-xs"></span>
                <span>More</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Quick Create Order Modal */}
      {showCreateOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              ম্যানুয়াল অর্ডার তৈরি করুন (Admin Create Order)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">কাস্টমারের নাম</label>
                <input
                  type="text"
                  placeholder="নাম"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">ফোন নম্বর</label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">ঠিকানা</label>
                <textarea
                  placeholder="ঠিকানা"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  rows={2}
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">অর্ডার এমাউন্ট (৳)</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <button
                onClick={() => setShowCreateOrder(false)}
                className="w-1/2 py-2 border rounded text-xs font-semibold"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  triggerGlobalSuccessModal({
                    title: 'অর্ডার সেভ হয়েছে!',
                    message: 'অর্ডারটি সফলভাবে সংরক্ষিত হয়েছে এবং সিস্টেমে যুক্ত হয়েছে।',
                  });
                  setShowCreateOrder(false);
                }}
                className="w-1/2 py-2 bg-[#990000] text-white rounded text-xs font-bold"
              >
                অর্ডার সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
