import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';
import { triggerGlobalSuccessModal } from '../context/SuccessModalContext';

export interface VariantOptionRow {
  id: string;
  name: string;
  values: string[];
  createdDate: string;
}

interface ProductVariantsPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

export const ProductVariantsPage: React.FC<ProductVariantsPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<VariantOptionRow | null>(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newValuesString, setNewValuesString] = useState('');

  // Exact rows from Screenshot 3
  const [variantsList, setVariantsList] = useState<VariantOptionRow[]>([
    {
      id: 'var-1',
      name: 'Size',
      values: ['38', '39', '40', '41', '42', '43', '44', '45', '46'],
      createdDate: 'July 6, 2026',
    },
    {
      id: 'var-2',
      name: 'color',
      values: ['red', 'green', 'blue'],
      createdDate: 'August 13, 2026',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddVariant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newValuesString.trim()) return;

    const valuesArray = newValuesString
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    const newOption: VariantOptionRow = {
      id: `var-${Date.now()}`,
      name: newName.trim(),
      values: valuesArray,
      createdDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setVariantsList((prev) => [...prev, newOption]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewValuesString('');
    showToast(`নতুন ভ্যারিয়েন্ট অপশন "${newOption.name}" যুক্ত হয়েছে!`);
    triggerGlobalSuccessModal({
      title: 'ভ্যারিয়েন্ট তৈরি হয়েছে!',
      message: `নতুন অপশন "${newOption.name}" সফলভাবে যুক্ত ও সংরক্ষিত হয়েছে।`,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVariant) return;

    setVariantsList((prev) =>
      prev.map((v) => (v.id === editingVariant.id ? editingVariant : v))
    );
    showToast(`ভ্যারিয়েন্ট অপশন "${editingVariant.name}" আপডেট করা হয়েছে!`);
    triggerGlobalSuccessModal({
      title: 'ভ্যারিয়েন্ট সেভ হয়েছে!',
      message: `ভ্যারিয়েন্ট অপশন "${editingVariant.name}" এর মান সফলভাবে সংরক্ষিত হয়েছে।`,
    });
    setEditingVariant(null);
  };

  const handleDeleteVariant = (id: string, name: string) => {
    if (confirm(`আপনি কি সত্যিই "${name}" অপশনটি মুছে ফেলতে চান?`)) {
      setVariantsList((prev) => prev.filter((v) => v.id !== id));
      showToast(`"${name}" অপশনটি মুছে ফেলা হয়েছে!`);
    }
  };

  const filteredVariants = variantsList.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="product_variants"
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
            Variant Options
          </h1>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search options..."
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#990000] w-48 sm:w-64"
              />
            </div>

            {/* Red + Add Option Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Option</span>
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
                    <th className="py-3 px-6 min-w-[140px]">Name</th>
                    <th className="py-3 px-6 min-w-[340px]">Values</th>
                    <th className="py-3 px-6 min-w-[160px]">Created</th>
                    <th className="py-3 px-6 text-center min-w-[160px]">Options</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredVariants.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name */}
                      <td className="py-3 px-6 font-bold text-slate-900">
                        {item.name}
                      </td>

                      {/* Values Pills */}
                      <td className="py-3 px-6">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {item.values.map((val, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium text-[11px]"
                            >
                              {val}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Created */}
                      <td className="py-3 px-6 text-slate-500 font-medium">
                        {item.createdDate}
                      </td>

                      {/* Options: Edit, Delete */}
                      <td className="py-3 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingVariant(item)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteVariant(item.id, item.name)}
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
      {/* MODAL 1: ADD VARIANT OPTION                              */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#990000] text-white p-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">নতুন ভ্যারিয়েন্ট অপশন যুক্ত করুন</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVariant} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">অপশন নাম *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেমন: Weight, Material, Size"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ভ্যালুসমূহ (কমা দিয়ে আলাদা করুন) *</label>
                <input
                  type="text"
                  required
                  value={newValuesString}
                  onChange={(e) => setNewValuesString(e.target.value)}
                  placeholder="যেমন: S, M, L, XL অথবা 100g, 250g, 500g"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
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
                  সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT VARIANT OPTION                             */}
      {/* ========================================================= */}
      {editingVariant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#1e293b] text-white p-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">ভ্যারিয়েন্ট অপশন এডিট</h3>
              <button onClick={() => setEditingVariant(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">অপশন নাম *</label>
                <input
                  type="text"
                  required
                  value={editingVariant.name}
                  onChange={(e) =>
                    setEditingVariant({ ...editingVariant, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ভ্যালুসমূহ (কমা দিয়ে আলাদা করুন)</label>
                <input
                  type="text"
                  required
                  value={editingVariant.values.join(', ')}
                  onChange={(e) =>
                    setEditingVariant({
                      ...editingVariant,
                      values: e.target.value.split(',').map((v) => v.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingVariant(null)}
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
