import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Repeat,
  CreditCard,
  Calendar,
  Globe,
  MapPin,
  Clock,
  Search,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

interface CustomerReportPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

export const CustomerReportPage: React.FC<CustomerReportPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [customerSearch, setCustomerSearch] = useState('');

  // 10 Latest Customers from Screenshot 5
  const latestCustomers = [
    {
      id: 'c-1',
      avatar: 'H',
      avatarBg: 'bg-slate-100 text-slate-700',
      name: 'Hhh',
      phone: '01568659586',
      address: 'Bhj',
    },
    {
      id: 'c-2',
      avatar: 'A',
      avatarBg: 'bg-blue-100 text-blue-700',
      name: 'ae',
      phone: '01764427977',
      address: 'তানিয়া রহমান ফোন-০১৭৬৪০০৩০৮৮ ঠিকানা -...',
    },
    {
      id: 'c-3',
      avatar: 'D',
      avatarBg: 'bg-purple-100 text-purple-700',
      name: 'df',
      phone: '01953331500',
      address: 'তানিয়া রহমান ফোন-০১৭৬৪০০৩০৮৮ ঠিকানা -...',
    },
    {
      id: 'c-4',
      avatar: 'S',
      avatarBg: 'bg-emerald-100 text-emerald-700',
      name: 'shahid',
      phone: '01888888888',
      address: 'বাড়ি নাম্বার 13, রোড নাম্বার 3, এরিয়া 221',
    },
    {
      id: 'c-5',
      avatar: 'S',
      avatarBg: 'bg-emerald-100 text-emerald-700',
      name: 'Sojib',
      phone: '01762691586',
      address: 'Netrokona',
    },
    {
      id: 'c-6',
      avatar: 'L',
      avatarBg: 'bg-amber-100 text-amber-800',
      name: 'Liakot Ali',
      phone: '01982708789',
      address: 'Jashore',
    },
    {
      id: 'c-7',
      avatar: 'I',
      avatarBg: 'bg-rose-100 text-rose-700',
      name: 'imran',
      phone: '01779481759',
      address: 'halishahar a black , bus stand',
    },
    {
      id: 'c-8',
      avatar: 'জ',
      avatarBg: 'bg-cyan-100 text-cyan-800',
      name: 'জাহিদুল ইসলাম',
      phone: '01682037262',
      address: 'মিরপুর 1, কাজলা শেরে বাংলা রোড, বাড়ি 761',
    },
    {
      id: 'c-9',
      avatar: 'শ',
      avatarBg: 'bg-indigo-100 text-indigo-700',
      name: 'শুভাশিস ঘোষ',
      phone: '01510107199',
      address: 'হোল্ডিং 45, ব্লক C, মিরপুর 10, ঢাকা।',
    },
    {
      id: 'c-10',
      avatar: 'ন',
      avatarBg: 'bg-teal-100 text-teal-800',
      name: 'নাদিয়া ইয়াসমিন',
      phone: '01465135670',
      address: 'গুলশান 1, রোড 1, বাড়ি 501',
    },
  ];

  // 10 Top Repeated Customers from Screenshot 5
  const topRepeatedCustomers = [
    {
      id: 'rc-1',
      avatar: 'I',
      avatarBg: 'bg-rose-100 text-rose-700',
      name: 'imran',
      phone: '01779481759',
      address: 'halishahar a black , bus stand',
      orders: 8,
      ordersColor: 'text-red-600',
    },
    {
      id: 'rc-2',
      avatar: 'D',
      avatarBg: 'bg-purple-100 text-purple-700',
      name: 'df',
      phone: '01953331500',
      address: 'তানিয়া রহমান ফোন-০১৭৬৪০০৩০৮৮ ঠি...',
      orders: 2,
      ordersColor: 'text-red-500',
    },
    {
      id: 'rc-3',
      avatar: 'M',
      avatarBg: 'bg-slate-100 text-slate-700',
      name: 'Md Al Imran H',
      phone: '01983858653',
      address: '—',
      orders: 2,
      ordersColor: 'text-red-500',
    },
    {
      id: 'rc-4',
      avatar: 'A',
      avatarBg: 'bg-blue-100 text-blue-700',
      name: 'Arnan',
      phone: '01921737326',
      address: 'sh',
      orders: 2,
      ordersColor: 'text-red-500',
    },
    {
      id: 'rc-5',
      avatar: 'A',
      avatarBg: 'bg-blue-100 text-blue-700',
      name: 'Ab',
      phone: '01712345678',
      address: 'Thh',
      orders: 2,
      ordersColor: 'text-red-500',
    },
    {
      id: 'rc-6',
      avatar: 'S',
      avatarBg: 'bg-emerald-100 text-emerald-700',
      name: 'Shah Moazzem Hossain',
      phone: '01518331952',
      address: 'Dhaka dhaka',
      orders: 2,
      ordersColor: 'text-red-500',
    },
    {
      id: 'rc-7',
      avatar: 'H',
      avatarBg: 'bg-amber-100 text-amber-800',
      name: 'Hasan',
      phone: '01310101010',
      address: 'Dhaka',
      orders: 2,
      ordersColor: 'text-red-500',
    },
    {
      id: 'rc-8',
      avatar: 'D',
      avatarBg: 'bg-purple-100 text-purple-700',
      name: 'Demo',
      phone: '01800000000',
      address: 'Testing',
      orders: 2,
      ordersColor: 'text-red-500',
    },
    {
      id: 'rc-9',
      avatar: 'H',
      avatarBg: 'bg-slate-100 text-slate-700',
      name: 'Hhh',
      phone: '01568659586',
      address: 'Bhj',
      orders: 1,
      ordersColor: 'text-red-500',
    },
    {
      id: 'rc-10',
      avatar: 'A',
      avatarBg: 'bg-blue-100 text-blue-700',
      name: 'ae',
      phone: '01764427977',
      address: 'তানিয়া রহমান ফোন-০১৭৬৪০০৩০৮৮ ঠি...',
      orders: 1,
      ordersColor: 'text-red-500',
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="customer_report"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Filter Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Customer Report
            </h1>
            <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
              Audience & Retention
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-400">
              <Calendar className="w-4 h-4 text-slate-500" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent focus:outline-hidden cursor-pointer pr-2 font-semibold text-slate-800"
              >
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="This Month">This Month</option>
                <option value="All Time">All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-w-7xl w-full space-y-6">
          {/* Top 4 Stat Cards matching Screenshot 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Customers */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Total Customers</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">673</h3>
              </div>
            </div>

            {/* 2. New Customers */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">New Customers</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">1</h3>
              </div>
            </div>

            {/* 3. Repeated Customers */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Repeated Customers</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">0</h3>
              </div>
            </div>

            {/* 4. Registered Customers */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Registered Customers</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">0</h3>
              </div>
            </div>
          </div>

          {/* Section 1: Customer Sources & Customer Areas (2 columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Sources matching Screenshot 5 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100">
                Customer Sources
              </h3>

              <div className="flex flex-col items-center justify-center py-6">
                {/* Donut representation with green ring */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-400"
                      strokeWidth="5"
                      strokeDasharray="100, 100"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-900">1</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">CUSTOMERS</span>
                  </div>
                </div>

                {/* Pill tag matching Screenshot 5 */}
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-300">
                    <Globe className="w-3.5 h-3.5" />
                    Website 1
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Areas matching Screenshot 5 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col">
              <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 mb-6">
                Customer Areas
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <div className="w-24 truncate">Chittagong</div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-red-800 h-full rounded-full w-full"></div>
                    </div>
                  </div>
                  <div className="w-6 text-right font-bold text-slate-900">1</div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="w-24 truncate">Dhaka</div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-slate-300 h-full rounded-full w-0"></div>
                    </div>
                  </div>
                  <div className="w-6 text-right text-slate-400">0</div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="w-24 truncate">Sylhet</div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-slate-300 h-full rounded-full w-0"></div>
                    </div>
                  </div>
                  <div className="w-6 text-right text-slate-400">0</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Latest Customers & Top Repeated Customers (2 columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Latest Customers matching Screenshot 5 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-500" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Latest Customers
                  </h3>
                </div>
                <span className="text-xs text-slate-400">All time</span>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-100">
                      <th className="pb-2">CUSTOMER</th>
                      <th className="pb-2">PHONE</th>
                      <th className="pb-2">ADDRESS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {latestCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 pr-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${cust.avatarBg}`}>
                              {cust.avatar}
                            </div>
                            <span className="font-semibold text-slate-800 text-[11px]">
                              {cust.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 font-mono text-[11px] text-slate-600">
                          {cust.phone}
                        </td>
                        <td className="py-2.5 pl-2 text-[11px] text-slate-500 truncate max-w-[180px]" title={cust.address}>
                          {cust.address}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Repeated Customers matching Screenshot 5 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-rose-500" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Top Repeated Customers
                  </h3>
                </div>
                <span className="text-xs text-slate-400">All time</span>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-100">
                      <th className="pb-2">CUSTOMER</th>
                      <th className="pb-2">PHONE</th>
                      <th className="pb-2">ADDRESS</th>
                      <th className="pb-2 text-right">ORDERS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topRepeatedCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 pr-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${cust.avatarBg}`}>
                              {cust.avatar}
                            </div>
                            <span className="font-semibold text-slate-800 text-[11px]">
                              {cust.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 font-mono text-[11px] text-slate-600">
                          {cust.phone}
                        </td>
                        <td className="py-2.5 px-2 text-[11px] text-slate-500 truncate max-w-[150px]" title={cust.address}>
                          {cust.address}
                        </td>
                        <td className="py-2.5 pl-2 text-right font-black text-xs text-red-600">
                          {cust.orders}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
