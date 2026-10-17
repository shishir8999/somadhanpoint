import React, { useState } from 'react';
import {
  Mail,
  Search,
  Trash2,
  Phone,
  MessageCircle,
  Clock,
  X,
  CheckCircle2
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

interface MessagesPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

interface MessageRecord {
  id: string;
  sl: number;
  name: string;
  number: string;
  message: string;
  createdAt: string;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Exact 2 messages from Screenshot 4
  const [messagesList, setMessagesList] = useState<MessageRecord[]>([
    {
      id: 'msg-1',
      sl: 1,
      name: 'Shajidur Rahman',
      number: '01883746523',
      message: 'আমার একটি অর্ডার ছিল। সিটের কি অবস্থা জানতে চাচ্ছিলাম।',
      createdAt: 'September 18, 2026',
    },
    {
      id: 'msg-2',
      sl: 2,
      name: 'Adiba',
      number: '01688452509',
      message: 'আমি গতকাল একটি অর্ডার করেছিলাম।\nঅর্ডার আইডি 2257।\nপণ্য দুইটা পাঠাবেন।',
      createdAt: 'September 18, 2026',
    },
  ]);

  const handleDelete = (id: string) => {
    setMessagesList((prev) => prev.filter((m) => m.id !== id));
    setToastMessage('মেসেজটি মুছে ফেলা হয়েছে!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredMessages = messagesList.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.number.includes(searchQuery) ||
    m.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="messages"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar matching Screenshot 4 */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Messages
            </h1>
            <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
              {messagesList.length}
            </span>
          </div>

          {/* Search Input matching Screenshot 4 */}
          <div className="relative w-64 sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-w-7xl w-full space-y-6">
          {toastMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)}><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* Table Container Card */}
          <div className="bg-white rounded-xl shadow-2xs border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                {/* Dark Navy Header matching Screenshot 4 */}
                <thead>
                  <tr className="bg-[#1c336b] text-white font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 w-14">Sl.</th>
                    <th className="py-3 px-6 w-48">Name</th>
                    <th className="py-3 px-6 w-40">Number</th>
                    <th className="py-3 px-6">Message</th>
                    <th className="py-3 px-6 w-44">Created At</th>
                    <th className="py-3 px-6 text-right w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMessages.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 text-slate-500 font-medium">
                        {item.sl}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        {item.name}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-600">
                        {item.number}
                      </td>
                      <td className="py-4 px-6 text-slate-700 whitespace-pre-line leading-relaxed">
                        {item.message}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {item.createdAt}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md transition-colors shadow-2xs cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredMessages.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No messages found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
