import React, { useState } from 'react';
import {
  Search,
  Ban,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

export interface CustomerRow {
  id: string;
  sl: number;
  name: string;
  number: string;
  address: string;
  status: 'Unblocked' | 'Blocked';
  ipAddress?: string;
  district: string;
  upazila: string;
}

interface AllCustomersPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

export const AllCustomersPage: React.FC<AllCustomersPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [statusFilter, setStatusFilter] = useState('All customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Exact 20 rows from Screenshot 2
  const [customersList, setCustomersList] = useState<CustomerRow[]>([
    {
      id: 'cust-1',
      sl: 1,
      name: 'শাহানা বেগম',
      number: '01873315210',
      address: 'সিলেট, জিন্দাবাজার, হোল্ডিং ১৭।',
      status: 'Unblocked',
      district: 'খুলনা',
      upazila: 'কাজলা',
    },
    {
      id: 'cust-2',
      sl: 2,
      name: 'জাহিদুল ইসলাম',
      number: '01825874033',
      address: 'রামপুরা, ব্লক C, ফ্ল্যাট 6D।',
      status: 'Unblocked',
      district: 'ময়মনসিংহ',
      upazila: 'জিন্দাবাজার',
    },
    {
      id: 'cust-3',
      sl: 3,
      name: 'রিয়াদ হোসেন',
      number: '01339331740',
      address: 'উত্তরা, সেক্টর 7, রোড 14, বাড়ি 23।',
      status: 'Unblocked',
      district: 'রংপুর',
      upazila: 'মিরপুর',
    },
    {
      id: 'cust-4',
      sl: 4,
      name: 'রুমানা বেগম',
      number: '01642270427',
      address: 'বাড্ডা, গুলশান 2, রোড 105, বাড়ি 14।',
      status: 'Unblocked',
      district: 'খুলনা',
      upazila: 'জিন্দাবাজার',
    },
    {
      id: 'cust-5',
      sl: 5,
      name: 'ইমরান হোসেন',
      number: '01824887159',
      address: 'মতিঝিল, বাংলাদেশ ব্যাংক ভবনের পাশে, রোড 3।',
      status: 'Unblocked',
      district: 'খুলনা',
      upazila: 'কাজলা',
    },
    {
      id: 'cust-6',
      sl: 6,
      name: 'বিদিশা রায়',
      number: '01720622496',
      address: 'যাত্রাবাড়ী, শহীদ জাহির রায় হোস্টেল এলাকা, বাড়ি 9।',
      status: 'Unblocked',
      district: 'খুলনা',
      upazila: 'নিউমার্কেট',
    },
    {
      id: 'cust-7',
      sl: 7,
      name: 'মোহাম্মদ আলী',
      number: '01860881646',
      address: 'নারায়ণগঞ্জ, চাষাঢ়া, রোড 8, বাড়ি 21।',
      status: 'Unblocked',
      district: 'রংপুর',
      upazila: 'সাভার',
    },
    {
      id: 'cust-8',
      sl: 8,
      name: 'নুরুল ইসলাম',
      number: '01965614226',
      address: 'মিরপুর 1, কাজলা শেরে বাংলা রোড, বাড়ি 76।',
      status: 'Unblocked',
      district: 'রাজশাহী',
      upazila: 'মিরপুর',
    },
    {
      id: 'cust-9',
      sl: 9,
      name: 'কামরুল ইসলাম',
      number: '01367104766',
      address: 'বাড়ি নাম্বার 13, রোড নাম্বার 3, এরিয়া 22।',
      status: 'Unblocked',
      district: 'সিলেট',
      upazila: 'আগ্রাবাদ',
    },
    {
      id: 'cust-10',
      sl: 10,
      name: 'তাসনিম রহমান',
      number: '01644711618',
      address: 'ফ্ল্যাট 3B, হাউস 22, রোড 5, বনানী, ঢাকা।',
      status: 'Unblocked',
      district: 'সিলেট',
      upazila: 'নিউমার্কেট',
    },
    {
      id: 'cust-11',
      sl: 11,
      name: 'তানজিনা আক্তার',
      number: '01433549424',
      address: 'খুলনা, নিউমার্কেট, রোড 4, হোল্ডিং 12।',
      status: 'Unblocked',
      district: 'ঢাকা',
      upazila: 'নিউমার্কেট',
    },
    {
      id: 'cust-12',
      sl: 12,
      name: 'সাইফুল ইসলাম',
      number: '01583673669',
      address: 'মুন্সিগঞ্জ, ওয়াগাড়িয়া, গ্রাম ও পোস্ট: ওয়াগাড়িয়া।',
      status: 'Unblocked',
      district: 'রাজশাহী',
      upazila: 'জিন্দাবাজার',
    },
    {
      id: 'cust-13',
      sl: 13,
      name: 'সাব্বির হোসেন',
      number: '01439392107',
      address: 'বাড়ি নাম্বার 13, রোড নাম্বার 3, এরিয়া 22।',
      status: 'Unblocked',
      district: 'রাজশাহী',
      upazila: 'কাশিপুর',
    },
    {
      id: 'cust-14',
      sl: 14,
      name: 'কামরুল ইসলাম',
      number: '01590620563',
      address: 'ময়মনসিংহ, কাছিঝিলা, গ্রাম: কাছিঝিলা।',
      status: 'Unblocked',
      district: 'ময়মনসিংহ',
      upazila: 'কাশিপুর',
    },
    {
      id: 'cust-15',
      sl: 15,
      name: 'রুবেল হোসেন',
      number: '01865220674',
      address: 'কক্সবাজার, কলাতলী, সামুদ্রিক রোড, হোল্ডিং 11।',
      status: 'Unblocked',
      district: 'চট্টগ্রাম',
      upazila: 'জিন্দাবাজার',
    },
    {
      id: 'cust-16',
      sl: 16,
      name: 'MD ISMAIL',
      number: '01798114617',
      address: 'Kvccyuf',
      status: 'Unblocked',
      ipAddress: 'Dhaka, Dhaka Division, Bangladesh',
      district: 'Dhaka Division',
      upazila: '—',
    },
    {
      id: 'cust-17',
      sl: 17,
      name: 'মোহাম্মদ ইউসুফ',
      number: '01662829947',
      address: 'বরিশাল, কাশিপুর, গ্রাম ও পোস্ট: কাশিপুর।',
      status: 'Unblocked',
      district: 'রংপুর',
      upazila: 'নিউমার্কেট',
    },
    {
      id: 'cust-18',
      sl: 18,
      name: 'আরিফুল ইসলাম',
      number: '01512321733',
      address: 'দিনাজপুর, বালুবাড়ি, রোড 2, বাড়ি 33।',
      status: 'Unblocked',
      district: 'সিলেট',
      upazila: 'নিউমার্কেট',
    },
    {
      id: 'cust-19',
      sl: 19,
      name: 'শেহরিয়ার কবির',
      number: '01688881509',
      address: 'খুলনা, নিউমার্কেট, রোড 4, হোল্ডিং 12।',
      status: 'Unblocked',
      district: 'চট্টগ্রাম',
      upazila: 'মিরপুর',
    },
    {
      id: 'cust-20',
      sl: 20,
      name: 'করিম উদ্দিন',
      number: '01910859657',
      address: 'নোয়াখালী, মাইজদী, সোনাপুর বাজার, বাড়ি ৪।',
      status: 'Unblocked',
      district: 'খুলনা',
      upazila: 'মিরপুর',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleBlock = (id: string, name: string) => {
    setCustomersList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'Unblocked' ? 'Blocked' : 'Unblocked';
          showToast(`গ্রাহক "${name}" কে ${nextStatus === 'Blocked' ? 'ব্লক' : 'আনব্লক'} করা হয়েছে!`);
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const filteredCustomers = customersList.filter((c) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.number.includes(searchQuery.trim()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All customers' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="all_customer"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Page Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 bg-[#111827] text-white px-4 py-2.5 rounded shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header & Search Row */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            All Customers
          </h1>

          <div className="flex items-center gap-2.5">
            {/* Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none"
            >
              <option value="All customers">All customers</option>
              <option value="Unblocked">Unblocked</option>
              <option value="Blocked">Blocked</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, number, or..."
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#990000] w-52 sm:w-72"
              />
            </div>
          </div>
        </header>

        {/* 3. Table */}
        <div className="p-6">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                {/* Dark Navy Header */}
                <thead className="bg-[#1e293b] text-white font-bold tracking-wide">
                  <tr>
                    <th className="py-3 px-3.5 w-12 text-center">Sl.</th>
                    <th className="py-3 px-3.5 min-w-[140px]">Name</th>
                    <th className="py-3 px-3.5 min-w-[120px]">Number</th>
                    <th className="py-3 px-3.5 min-w-[260px]">Address</th>
                    <th className="py-3 px-3.5 min-w-[100px]">Status</th>
                    <th className="py-3 px-3.5 min-w-[150px]">IP Address</th>
                    <th className="py-3 px-3.5 min-w-[100px]">District</th>
                    <th className="py-3 px-3.5 min-w-[100px]">Upazila</th>
                    <th className="py-3 px-3.5 text-center min-w-[100px]">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredCustomers.map((cust, idx) => (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Sl. */}
                      <td className="py-3 px-3.5 text-center font-medium text-slate-500">
                        {cust.sl || idx + 1}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-3.5 font-bold text-slate-900">
                        {cust.name}
                      </td>

                      {/* Number */}
                      <td className="py-3 px-3.5 font-mono text-slate-600">
                        {cust.number}
                      </td>

                      {/* Address */}
                      <td className="py-3 px-3.5 text-slate-600 max-w-sm truncate" title={cust.address}>
                        {cust.address}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5">
                        {cust.status === 'Unblocked' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            Unblocked
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                            Blocked
                          </span>
                        )}
                      </td>

                      {/* IP Address */}
                      <td className="py-3 px-3.5 text-slate-500 text-[11px]">
                        {cust.ipAddress || '—'}
                      </td>

                      {/* District */}
                      <td className="py-3 px-3.5 font-medium text-slate-700">
                        {cust.district}
                      </td>

                      {/* Upazila */}
                      <td className="py-3 px-3.5 text-slate-600">
                        {cust.upazila}
                      </td>

                      {/* Action: Block / Unblock */}
                      <td className="py-3 px-3.5 text-center">
                        <button
                          onClick={() => handleToggleBlock(cust.id, cust.name)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                            cust.status === 'Unblocked'
                              ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-300'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300'
                          }`}
                        >
                          <Ban className="w-3 h-3" />
                          <span>{cust.status === 'Unblocked' ? 'Block' : 'Unblock'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Strip */}
            <div className="py-4 px-6 border-t border-slate-200 bg-white flex items-center justify-center gap-1.5 text-xs">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded border border-slate-200 hover:bg-slate-200 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(1)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                  currentPage === 1
                    ? 'bg-[#990000] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                1
              </button>
              <button
                onClick={() => setCurrentPage(2)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                  currentPage === 2
                    ? 'bg-[#990000] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                2
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button
                onClick={() => setCurrentPage(34)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                  currentPage === 34
                    ? 'bg-[#990000] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                34
              </button>
              <button
                disabled={currentPage === 34}
                onClick={() => setCurrentPage((p) => Math.min(34, p + 1))}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded border border-slate-200 hover:bg-slate-200 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
