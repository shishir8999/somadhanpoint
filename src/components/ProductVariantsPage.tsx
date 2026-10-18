import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  Layers,
  Palette,
  AlertTriangle,
  Check
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

// Color dictionary mapping names (English and Bengali) to hex codes
export const COLOR_MAP: Record<string, string> = {
  // English
  red: '#EF4444',
  green: '#10B981',
  blue: '#3B82F6',
  black: '#111827',
  white: '#FFFFFF',
  yellow: '#F59E0B',
  orange: '#F97316',
  purple: '#8B5CF6',
  pink: '#EC4899',
  navy: '#1E3A8A',
  maroon: '#800000',
  grey: '#6B7280',
  gray: '#6B7280',
  brown: '#78350F',
  sky: '#0EA5E9',
  skyblue: '#0EA5E9',
  teal: '#14B8A6',
  gold: '#D97706',
  golden: '#D97706',
  silver: '#E2E8F0',
  cyan: '#06B6D4',
  lime: '#84CC16',
  indigo: '#4F46E5',
  violet: '#7C3AED',
  magenta: '#D946EF',

  // Bengali
  'লাল': '#EF4444',
  'সবুজ': '#10B981',
  'নীল': '#3B82F6',
  'কালো': '#111827',
  'সাদা': '#FFFFFF',
  'হলুদ': '#F59E0B',
  'কমলা': '#F97316',
  'বেগুনী': '#8B5CF6',
  'গোলাপী': '#EC4899',
  'নেভি ব্লু': '#1E3A8A',
  'মেরুন': '#800000',
  'ধূসর': '#6B7280',
  'বাদামী': '#78350F',
  'আসমানী': '#0EA5E9',
  'টিল': '#14B8A6',
  'সোনালী': '#D97706',
  'রূপালী': '#E2E8F0',
};

// Preset palette for one-click selection
export const PRESET_COLOR_SWATCHES = [
  { name: 'Red', bangla: 'লাল', hex: '#EF4444' },
  { name: 'Green', bangla: 'সবুজ', hex: '#10B981' },
  { name: 'Blue', bangla: 'নীল', hex: '#3B82F6' },
  { name: 'Black', bangla: 'কালো', hex: '#111827' },
  { name: 'White', bangla: 'সাদা', hex: '#FFFFFF' },
  { name: 'Yellow', bangla: 'হলুদ', hex: '#F59E0B' },
  { name: 'Orange', bangla: 'কমলা', hex: '#F97316' },
  { name: 'Purple', bangla: 'বেগুনী', hex: '#8B5CF6' },
  { name: 'Pink', bangla: 'গোলাপী', hex: '#EC4899' },
  { name: 'Navy', bangla: 'নেভি ব্লু', hex: '#1E3A8A' },
  { name: 'Maroon', bangla: 'মেরুন', hex: '#800000' },
  { name: 'Grey', bangla: 'ধূসর', hex: '#6B7280' },
  { name: 'Sky Blue', bangla: 'আসমানী', hex: '#0EA5E9' },
  { name: 'Brown', bangla: 'বাদামী', hex: '#78350F' },
  { name: 'Teal', bangla: 'টিল', hex: '#14B8A6' },
  { name: 'Golden', bangla: 'সোনালী', hex: '#D97706' },
];

export const getColorHex = (val: string): string | null => {
  if (!val) return null;
  const clean = val.trim().toLowerCase();
  if (clean.startsWith('#') && (clean.length === 4 || clean.length === 7)) {
    return clean;
  }
  if (COLOR_MAP[clean]) {
    return COLOR_MAP[clean];
  }
  // Check if val contains a color name
  for (const [key, hex] of Object.entries(COLOR_MAP)) {
    if (clean === key || clean.includes(key)) {
      return hex;
    }
  }
  return null;
};

export const isColorOption = (name: string): boolean => {
  const n = (name || '').toLowerCase();
  return n.includes('color') || n.includes('colour') || n.includes('কালার') || n.includes('রং');
};

export const ProductVariantsPage: React.FC<ProductVariantsPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<VariantOptionRow | null>(null);
  const [variantToDelete, setVariantToDelete] = useState<VariantOptionRow | null>(null);

  // Add Form state
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'general' | 'color'>('general');
  const [newValuesList, setNewValuesList] = useState<string[]>([]);
  const [newGeneralInput, setNewGeneralInput] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#EF4444');
  const [customColorName, setCustomColorName] = useState('');

  // Edit Form state
  const [editValuesList, setEditValuesList] = useState<string[]>([]);
  const [editType, setEditType] = useState<'general' | 'color'>('general');
  const [editGeneralInput, setEditGeneralInput] = useState('');
  const [editCustomColorHex, setEditCustomColorHex] = useState('#3B82F6');
  const [editCustomColorName, setEditCustomColorName] = useState('');

  const DEFAULT_VARIANTS: VariantOptionRow[] = [
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
  ];

  // Exact rows with localStorage persistence
  const [variantsList, setVariantsList] = useState<VariantOptionRow[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ummah_admin_variants_list');
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_VARIANTS;
  });

  // Save to localStorage whenever variantsList changes
  useEffect(() => {
    try {
      localStorage.setItem('ummah_admin_variants_list', JSON.stringify(variantsList));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('variants-updated'));
    } catch (e) {}
  }, [variantsList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Switch add type when name changes
  const handleNameChange = (val: string) => {
    setNewName(val);
    if (isColorOption(val)) {
      setNewType('color');
    }
  };

  // Add / Remove color in Add modal
  const handleToggleColorInAdd = (colName: string) => {
    if (newValuesList.includes(colName)) {
      setNewValuesList(newValuesList.filter((c) => c !== colName));
    } else {
      setNewValuesList([...newValuesList, colName]);
    }
  };

  const handleAddCustomColorInAdd = () => {
    const name = customColorName.trim() || customColorHex;
    if (!newValuesList.includes(name)) {
      setNewValuesList([...newValuesList, name]);
      setCustomColorName('');
    }
  };

  // Add / Remove color in Edit modal
  const handleToggleColorInEdit = (colName: string) => {
    if (editValuesList.includes(colName)) {
      setEditValuesList(editValuesList.filter((c) => c !== colName));
    } else {
      setEditValuesList([...editValuesList, colName]);
    }
  };

  const handleAddCustomColorInEdit = () => {
    const name = editCustomColorName.trim() || editCustomColorHex;
    if (!editValuesList.includes(name)) {
      setEditValuesList([...editValuesList, name]);
      setEditCustomColorName('');
    }
  };

  const openAddModal = () => {
    setNewName('');
    setNewType('general');
    setNewValuesList([]);
    setNewGeneralInput('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: VariantOptionRow) => {
    setEditingVariant(item);
    setEditValuesList([...item.values]);
    setEditGeneralInput(item.values.join(', '));
    setEditType(isColorOption(item.name) ? 'color' : 'general');
  };

  const handleAddVariant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    let finalValues: string[] = [];
    if (newType === 'color' || isColorOption(newName)) {
      finalValues = newValuesList;
    } else {
      finalValues = newGeneralInput
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    }

    if (finalValues.length === 0) {
      alert('অনুগ্রহ করে অন্তত একটি ভ্যালু বা কালার নির্বাচন করুন');
      return;
    }

    const newOption: VariantOptionRow = {
      id: `var-${Date.now()}`,
      name: newName.trim(),
      values: finalValues,
      createdDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setVariantsList((prev) => [...prev, newOption]);
    setIsAddModalOpen(false);
    showToast(`নতুন ভ্যারিয়েন্ট "${newOption.name}" যুক্ত হয়েছে!`);
    triggerGlobalSuccessModal({
      title: 'ভ্যারিয়েন্ট তৈরি হয়েছে!',
      message: `নতুন অপশন "${newOption.name}" সফলভাবে যুক্ত ও সংরক্ষিত হয়েছে।`,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVariant) return;

    let finalValues: string[] = [];
    if (editType === 'color' || isColorOption(editingVariant.name)) {
      finalValues = editValuesList;
    } else {
      finalValues = editGeneralInput
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    }

    if (finalValues.length === 0) {
      alert('অনুগ্রহ করে অন্তত একটি ভ্যালু বা কালার নির্বাচন করুন');
      return;
    }

    const updatedItem = {
      ...editingVariant,
      values: finalValues,
    };

    setVariantsList((prev) =>
      prev.map((v) => (v.id === updatedItem.id ? updatedItem : v))
    );
    showToast(`ভ্যারিয়েন্ট অপশন "${updatedItem.name}" আপডেট করা হয়েছে!`);
    triggerGlobalSuccessModal({
      title: 'ভ্যারিয়েন্ট সেভ হয়েছে!',
      message: `ভ্যারিয়েন্ট অপশন "${updatedItem.name}" এর মান সফলভাবে সংরক্ষিত হয়েছে।`,
    });
    setEditingVariant(null);
  };

  const confirmDeleteVariant = () => {
    if (!variantToDelete) return;
    const name = variantToDelete.name;
    setVariantsList((prev) => prev.filter((v) => v.id !== variantToDelete.id));
    setVariantToDelete(null);
    showToast(`"${name}" অপশনটি মুছে ফেলা হয়েছে!`);
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
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Variant Options (ভ্যারিয়েন্ট অপশন)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              কালার নির্বাচন করুন ও ভিজ্যুয়ালি শনাক্ত করুন, সাইজ ও অন্যান্য অপশন পরিচালনা করুন
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search options..."
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#990000] w-40 sm:w-64"
              />
            </div>

            {/* Red + Add Option Button */}
            <button
              onClick={openAddModal}
              className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Option</span>
            </button>
          </div>
        </header>

        {/* 3. Table */}
        <div className="p-4 sm:p-6">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                {/* Dark Navy Header */}
                <thead className="bg-[#1e293b] text-white font-bold tracking-wide">
                  <tr>
                    <th className="py-3 px-5 w-36">Name (নাম)</th>
                    <th className="py-3 px-5 min-w-[280px]">Values (মান ও ভিজ্যুয়াল কালার)</th>
                    <th className="py-3 px-5 w-32 hidden md:table-cell">Created</th>
                    <th className="py-3 px-5 text-center w-36">Options</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredVariants.map((item) => {
                    const isColor = isColorOption(item.name);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Name */}
                        <td className="py-3 px-5 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            {isColor ? (
                              <Palette className="w-4 h-4 text-purple-600 shrink-0" />
                            ) : (
                              <Layers className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className="capitalize">{item.name}</span>
                          </div>
                        </td>

                        {/* Values with VISUAL Color Identification */}
                        <td className="py-3 px-5">
                          <div className="flex flex-wrap items-center gap-2">
                            {item.values.map((val, idx) => {
                              const hex = getColorHex(val);

                              if (hex || isColor) {
                                const resolvedHex = hex || '#94A3B8';
                                return (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-800 font-bold text-[11px] shadow-2xs hover:shadow-xs transition-shadow"
                                    title={`কালার: ${val} (${resolvedHex})`}
                                  >
                                    <span
                                      className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-inner shrink-0"
                                      style={{ backgroundColor: resolvedHex }}
                                    />
                                    <span className="capitalize">{val}</span>
                                  </span>
                                );
                              }

                              return (
                                <span
                                  key={idx}
                                  className="px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px]"
                                >
                                  {val}
                                </span>
                              );
                            })}
                          </div>
                        </td>

                        {/* Created */}
                        <td className="py-3 px-5 text-slate-500 font-medium hidden md:table-cell">
                          {item.createdDate}
                        </td>

                        {/* Options: Edit, Delete */}
                        <td className="py-3 px-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditModal(item)}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                              title="অপশন ও কালার এডিট করুন"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => setVariantToDelete(item)}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                              title="অপশন মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD VARIANT OPTION                               */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#990000] text-white p-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>নতুন ভ্যারিয়েন্ট অপশন তৈরি করুন</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVariant} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  অপশন নাম (যেমন: Color, Size, Weight) *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="যেমন: Color অথবা Size"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000] font-semibold"
                />
              </div>

              {/* Type Switcher */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">অপশন ধরন নির্বাচন করুন</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('color')}
                    className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      newType === 'color' || isColorOption(newName)
                        ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Palette className="w-4 h-4 text-purple-600" />
                    <span>কালার অপশন (Color)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewType('general')}
                    className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      newType === 'general' && !isColorOption(newName)
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>সাধারণ অপশন (Size, etc)</span>
                  </button>
                </div>
              </div>

              {/* COLOR SELECTION SECTION */}
              {newType === 'color' || isColorOption(newName) ? (
                <div className="space-y-3 bg-purple-50/50 p-3.5 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 text-xs flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5 text-purple-600" />
                      <span>কালার প্যালেট থেকে সিলেক্ট করুন:</span>
                    </span>
                    <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-2 py-0.5 rounded-full">
                      {newValuesList.length} টি কালার সিলেক্টেড
                    </span>
                  </div>

                  {/* Preset Swatches */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-48 overflow-y-auto p-1 bg-white rounded border border-slate-200">
                    {PRESET_COLOR_SWATCHES.map((swatch) => {
                      const isSelected = newValuesList.includes(swatch.name.toLowerCase()) || newValuesList.includes(swatch.name);
                      return (
                        <button
                          key={swatch.name}
                          type="button"
                          onClick={() => handleToggleColorInAdd(swatch.name.toLowerCase())}
                          className={`flex items-center gap-1.5 px-2 py-1.5 rounded border text-left transition-all cursor-pointer text-[11px] ${
                            isSelected
                              ? 'bg-purple-50 border-purple-500 text-purple-900 font-bold ring-1 ring-purple-400'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs shrink-0"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span className="truncate">{swatch.name}</span>
                          {isSelected && <Check className="w-3 h-3 text-purple-600 ml-auto shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Color Input */}
                  <div className="pt-2 border-t border-purple-100 flex items-center gap-2">
                    <input
                      type="color"
                      value={customColorHex}
                      onChange={(e) => setCustomColorHex(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5 shrink-0"
                      title="কালার পিকার থেকে পছন্দ করুন"
                    />
                    <input
                      type="text"
                      value={customColorName}
                      onChange={(e) => setCustomColorName(e.target.value)}
                      placeholder="কাস্টম কালারের নাম (যেমন: Royal Blue)"
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-none focus:border-purple-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomColorInAdd}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold text-xs cursor-pointer shrink-0"
                    >
                      + কালার দিন
                    </button>
                  </div>

                  {/* Selected Color Chips */}
                  {newValuesList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {newValuesList.map((col) => {
                        const hex = getColorHex(col) || '#94A3B8';
                        return (
                          <span
                            key={col}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-800 text-[11px] font-bold shadow-2xs"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: hex }}
                            />
                            <span className="capitalize">{col}</span>
                            <button
                              type="button"
                              onClick={() => handleToggleColorInAdd(col)}
                              className="text-slate-400 hover:text-red-600 ml-0.5 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* GENERAL VALUES INPUT (Like Size) */
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ভ্যালুসমূহ (কমা দিয়ে লিখুন) *
                  </label>
                  <input
                    type="text"
                    value={newGeneralInput}
                    onChange={(e) => setNewGeneralInput(e.target.value)}
                    placeholder="যেমন: 38, 39, 40, 41, 42 অথবা S, M, L, XL"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    প্রতিটি মান কমা (,) দিয়ে আলাদা করুন।
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold shadow-xs cursor-pointer"
                >
                  ভ্যারিয়েন্ট সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT VARIANT OPTION                              */}
      {/* ========================================================= */}
      {editingVariant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#1e293b] text-white p-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Edit className="w-4 h-4 text-amber-400" />
                <span>ভ্যারিয়েন্ট ও কালার অপশন সম্পাদনা</span>
              </h3>
              <button onClick={() => setEditingVariant(null)} className="text-white/80 hover:text-white cursor-pointer">
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
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000] font-semibold"
                />
              </div>

              {/* Type Switcher */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">অপশন ধরন</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditType('color')}
                    className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      editType === 'color' || isColorOption(editingVariant.name)
                        ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Palette className="w-4 h-4 text-purple-600" />
                    <span>কালার ভ্যারিয়েন্ট</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditType('general')}
                    className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      editType === 'general' && !isColorOption(editingVariant.name)
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>সাধারণ ভ্যারিয়েন্ট</span>
                  </button>
                </div>
              </div>

              {/* COLOR SELECTION SECTION */}
              {editType === 'color' || isColorOption(editingVariant.name) ? (
                <div className="space-y-3 bg-purple-50/50 p-3.5 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 text-xs flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5 text-purple-600" />
                      <span>কালার নির্বাচন করুন:</span>
                    </span>
                    <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-2 py-0.5 rounded-full">
                      {editValuesList.length} টি কালার যুক্ত আছে
                    </span>
                  </div>

                  {/* Preset Swatches */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-48 overflow-y-auto p-1 bg-white rounded border border-slate-200">
                    {PRESET_COLOR_SWATCHES.map((swatch) => {
                      const isSelected = editValuesList.includes(swatch.name.toLowerCase()) || editValuesList.includes(swatch.name);
                      return (
                        <button
                          key={swatch.name}
                          type="button"
                          onClick={() => handleToggleColorInEdit(swatch.name.toLowerCase())}
                          className={`flex items-center gap-1.5 px-2 py-1.5 rounded border text-left transition-all cursor-pointer text-[11px] ${
                            isSelected
                              ? 'bg-purple-50 border-purple-500 text-purple-900 font-bold ring-1 ring-purple-400'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs shrink-0"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span className="truncate">{swatch.name}</span>
                          {isSelected && <Check className="w-3 h-3 text-purple-600 ml-auto shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Color Input */}
                  <div className="pt-2 border-t border-purple-100 flex items-center gap-2">
                    <input
                      type="color"
                      value={editCustomColorHex}
                      onChange={(e) => setEditCustomColorHex(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5 shrink-0"
                      title="কালার পিকার থেকে পছন্দ করুন"
                    />
                    <input
                      type="text"
                      value={editCustomColorName}
                      onChange={(e) => setEditCustomColorName(e.target.value)}
                      placeholder="কাস্টম কালারের নাম"
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-none focus:border-purple-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomColorInEdit}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold text-xs cursor-pointer shrink-0"
                    >
                      + যোগ করুন
                    </button>
                  </div>

                  {/* Current Active Color Chips */}
                  {editValuesList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {editValuesList.map((col) => {
                        const hex = getColorHex(col) || '#94A3B8';
                        return (
                          <span
                            key={col}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-[11px] font-bold shadow-2xs"
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: hex }}
                            />
                            <span className="capitalize">{col}</span>
                            <button
                              type="button"
                              onClick={() => handleToggleColorInEdit(col)}
                              className="text-slate-400 hover:text-red-600 ml-0.5 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* GENERAL VALUES INPUT */
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ভ্যালুসমূহ (কমা দিয়ে লিখুন) *
                  </label>
                  <input
                    type="text"
                    value={editGeneralInput}
                    onChange={(e) => setEditGeneralInput(e.target.value)}
                    placeholder="যেমন: 38, 39, 40, 41, 42"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    প্রতিটি মান কমা (,) দিয়ে আলাদা করুন।
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingVariant(null)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold shadow-xs cursor-pointer"
                >
                  আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CONFIRM DELETE MODAL                                      */}
      {/* ========================================================= */}
      {variantToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#990000] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
                <h3 className="text-sm font-bold">ভ্যারিয়েন্ট মুছে ফেলার নিশ্চিতকরণ</h3>
              </div>
              <button
                onClick={() => setVariantToDelete(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-slate-700 space-y-1.5">
                <p className="font-bold text-red-900 text-sm">
                  আপনি কি নিশ্চিত যে এই ভ্যারিয়েন্টটি মুছে ফেলতে চান?
                </p>
                <p className="font-semibold text-slate-800 text-xs">
                  অপশন নাম: "{variantToDelete.name}"
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  এটি মুছে ফেললে প্রোডাক্ট অপশন তালিকা থেকে এই ভ্যারিয়েন্টটি চিরতরে বাদ যাবে।
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setVariantToDelete(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteVariant}
                  className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>হ্যাঁ, মুছে ফেলুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
