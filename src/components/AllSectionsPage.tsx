import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  X,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

export interface SectionRow {
  id: string;
  name: string;
  bannerVisual?: string;
  productsCount: number;
  type: 'Slide' | 'Grid';
  createdDate: string;
}

interface AllSectionsPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

export const AllSectionsPage: React.FC<AllSectionsPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionRow | null>(null);

  // New section form
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'Slide' | 'Grid'>('Slide');
  const [newProductsCount, setNewProductsCount] = useState(10);

  // Exact 5 rows from Screenshot 1
  const [sectionsList, setSectionsList] = useState<SectionRow[]>([
    {
      id: 'sec-1',
      name: 'Hot Deals',
      productsCount: 11,
      type: 'Slide',
      createdDate: 'July 7, 2026',
    },
    {
      id: 'sec-2',
      name: 'Flash Sale',
      bannerVisual: 'spice_promo',
      productsCount: 10,
      type: 'Grid',
      createdDate: 'July 7, 2026',
    },
    {
      id: 'sec-3',
      name: 'Top Rated',
      productsCount: 10,
      type: 'Slide',
      createdDate: 'July 7, 2026',
    },
    {
      id: 'sec-4',
      name: 'Best Sells',
      productsCount: 10,
      type: 'Slide',
      createdDate: 'July 7, 2026',
    },
    {
      id: 'sec-5',
      name: 'Temporary Section',
      productsCount: 10,
      type: 'Grid',
      createdDate: 'July 28, 2026',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newSec: SectionRow = {
      id: `sec-${Date.now()}`,
      name: newName.trim(),
      productsCount: Number(newProductsCount),
      type: newType,
      createdDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setSectionsList((prev) => [newSec, ...prev]);
    setIsAddModalOpen(false);
    setNewName('');
    showToast(`নতুন সেকশন "${newSec.name}" যুক্ত হয়েছে!`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    setSectionsList((prev) =>
      prev.map((s) => (s.id === editingSection.id ? editingSection : s))
    );
    showToast(`সেকশন "${editingSection.name}" সফলভাবে আপডেট হয়েছে!`);
    setEditingSection(null);
  };

  const handleDeleteSection = (id: string, name: string) => {
    if (confirm(`আপনি কি সত্যিই "${name}" সেকশনটি মুছে ফেলতে চান?`)) {
      setSectionsList((prev) => prev.filter((s) => s.id !== id));
      showToast(`সেকশন "${name}" মুছে ফেলা হয়েছে!`);
    }
  };

  const filteredSections = sectionsList.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="all_sections"
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
            All Sections
          </h1>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sections..."
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#990000] w-48 sm:w-64"
              />
            </div>

            {/* Red + Add Section Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Section</span>
            </button>
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
                    <th className="py-3 px-4 min-w-[140px]">Banner</th>
                    <th className="py-3 px-4 min-w-[240px]">Name</th>
                    <th className="py-3 px-4 min-w-[120px]">Products</th>
                    <th className="py-3 px-4 min-w-[120px]">Type</th>
                    <th className="py-3 px-4 min-w-[160px]">Created</th>
                    <th className="py-3 px-4 text-center min-w-[160px]">Options</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredSections.map((sec) => (
                    <tr key={sec.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Drag handle + Banner */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                          <div className="w-12 h-6 rounded border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                            {sec.bannerVisual ? (
                              <div className="w-full h-full bg-linear-to-r from-amber-700 to-red-800 flex items-center justify-center text-[7px] text-white font-bold">
                                BANNER
                              </div>
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5 text-slate-300" />
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {sec.name}
                      </td>

                      {/* Products */}
                      <td className="py-3 px-4 font-semibold text-slate-600">
                        {sec.productsCount}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3 px-4">
                        {sec.type === 'Slide' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-600">
                            Slide
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-600">
                            Grid
                          </span>
                        )}
                      </td>

                      {/* Created */}
                      <td className="py-3 px-4 text-slate-500 font-medium">
                        {sec.createdDate}
                      </td>

                      {/* Options: Edit, Delete */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingSection(sec)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteSection(sec.id, sec.name)}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD SECTION                                     */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#990000] text-white p-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">নতুন সেকশন যুক্ত করুন</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSection} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">সেকশনের নাম *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেমন: Eid Special Offers"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্রদর্শন ধরন (Type)</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded focus:outline-none"
                  >
                    <option value="Slide">Slide (হরাইজন্টাল স্লাইডার)</option>
                    <option value="Grid">Grid (প্রোডাক্ট গ্রিড ভিউ)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্রোডাক্ট সংখ্যা</label>
                  <input
                    type="number"
                    value={newProductsCount}
                    onChange={(e) => setNewProductsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-100 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold shadow-xs"
                >
                  সেকশন সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT SECTION                                    */}
      {/* ========================================================= */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#1e293b] text-white p-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">সেকশন সম্পাদনা</h3>
              <button onClick={() => setEditingSection(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">সেকশনের নাম *</label>
                <input
                  type="text"
                  required
                  value={editingSection.name}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">টাইপ</label>
                  <select
                    value={editingSection.type}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, type: e.target.value as any })
                    }
                    className="w-full px-2.5 py-2 border border-slate-300 rounded focus:outline-none"
                  >
                    <option value="Slide">Slide</option>
                    <option value="Grid">Grid</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্রোডাক্ট সংখ্যা</label>
                  <input
                    type="number"
                    value={editingSection.productsCount}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        productsCount: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-100 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold shadow-xs"
                >
                  আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
