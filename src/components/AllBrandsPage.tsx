import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  X,
  CheckCircle2,
  Tag,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';
import { triggerGlobalSuccessModal } from '../context/SuccessModalContext';
import { fetchBrandsFromDatabase, saveBrandsToDatabase } from '../utils/apiSync';

export interface BrandRow {
  id: string;
  name: string;
  logoText: string;
  logoColor: string;
  imageUrl?: string;
  productsCount: number;
  createdDate: string;
}

interface AllBrandsPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

const DEFAULT_BRANDS: BrandRow[] = [
  {
    id: 'brand-1',
    name: 'Comforty',
    logoText: 'COMFORTY',
    logoColor: 'text-slate-800 font-black tracking-widest',
    productsCount: 7,
    createdDate: 'July 11, 2026',
  },
  {
    id: 'brand-2',
    name: 'Vision',
    logoText: 'VISION',
    logoColor: 'text-slate-800 font-bold tracking-wider',
    productsCount: 7,
    createdDate: 'July 7, 2026',
  },
  {
    id: 'brand-3',
    name: 'Walton',
    logoText: 'WALTON',
    logoColor: 'text-blue-700 font-black tracking-wider',
    productsCount: 7,
    createdDate: 'July 7, 2026',
  },
];

export const AllBrandsPage: React.FC<AllBrandsPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandRow | null>(null);

  // New brand form
  const [newName, setNewName] = useState('');
  const [newProductsCount, setNewProductsCount] = useState(7);
  const [newImageUrl, setNewImageUrl] = useState('');
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Brands list with localStorage persistence
  const [brandsList, setBrandsList] = useState<BrandRow[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ummah_admin_brands_list');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Failed to load brands from localStorage', e);
      }
    }
    return DEFAULT_BRANDS;
  });

  // Initial load from server database
  useEffect(() => {
    fetchBrandsFromDatabase().then((dbBrands) => {
      if (dbBrands && Array.isArray(dbBrands)) {
        setBrandsList(dbBrands);
        try {
          localStorage.setItem('ummah_admin_brands_list', JSON.stringify(dbBrands));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('brands-updated'));
        } catch {}
      }
    });
  }, []);

  // Persist to localStorage and server database whenever brands change
  useEffect(() => {
    try {
      localStorage.setItem('ummah_admin_brands_list', JSON.stringify(brandsList));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to save brands to localStorage', e);
    }
    // Save permanently to server database
    saveBrandsToDatabase(brandsList);
  }, [brandsList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onSuccess(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newBrand: BrandRow = {
      id: `brand-${Date.now()}`,
      name: newName.trim(),
      logoText: newName.trim().toUpperCase(),
      logoColor: 'text-slate-900 font-black',
      imageUrl: newImageUrl.trim() || undefined,
      productsCount: Number(newProductsCount),
      createdDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setBrandsList((prev) => [newBrand, ...prev]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewImageUrl('');
    showToast(`নতুন ব্র্যান্ড "${newBrand.name}" যুক্ত হয়েছে!`);
    triggerGlobalSuccessModal({
      title: 'ব্র্যান্ড যুক্ত হয়েছে!',
      message: `নতুন ব্র্যান্ড "${newBrand.name}" সফলভাবে ক্যাটালগে যুক্ত হয়েছে।`,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;

    setBrandsList((prev) =>
      prev.map((b) => (b.id === editingBrand.id ? editingBrand : b))
    );
    showToast(`ব্র্যান্ড "${editingBrand.name}" সফলভাবে আপডেট হয়েছে!`);
    triggerGlobalSuccessModal({
      title: 'ব্র্যান্ড সেভ হয়েছে!',
      message: `ব্র্যান্ড "${editingBrand.name}" এর সকল তথ্য সফলভাবে সংরক্ষিত হয়েছে।`,
    });
    setEditingBrand(null);
  };

  const handleDeleteBrand = (id: string, name: string) => {
    if (confirm(`আপনি কি সত্যিই "${name}" ব্র্যান্ডটি মুছে ফেলতে চান?`)) {
      const updated = brandsList.filter((b) => b.id !== id);
      setBrandsList(updated);
      try {
        localStorage.setItem('ummah_admin_brands_list', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('brands-updated'));
      } catch {}
      saveBrandsToDatabase(updated);
      fetch(`/api/brands/${id}`, { method: 'DELETE' });
      showToast(`ব্র্যান্ড "${name}" মুছে ফেলা হয়েছে!`);
      triggerGlobalSuccessModal({
        title: 'ব্র্যান্ড মুছে ফেলা হয়েছে!',
        message: `"${name}" ব্র্যান্ডটি সফলভাবে ডাটাবেজ থেকে চিরতরে মুছে ফেলা হয়েছে।`,
      });
    }
  };

  const filteredBrands = brandsList.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="all_brands"
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
            All Brands
          </h1>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brands..."
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#990000] w-48 sm:w-64"
              />
            </div>

            {/* Red + Add Brand Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Brand</span>
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
                    <th className="py-3 px-4 min-w-[140px]">Image</th>
                    <th className="py-3 px-4 min-w-[240px]">Name</th>
                    <th className="py-3 px-4 min-w-[140px]">Products</th>
                    <th className="py-3 px-4 min-w-[160px]">Created</th>
                    <th className="py-3 px-4 text-center min-w-[160px]">Options</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredBrands.map((brand) => (
                    <tr key={brand.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Drag handle + Brand Image/Logo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                          <div className="w-14 h-8 rounded border border-slate-200 bg-white flex items-center justify-center px-1 shadow-2xs overflow-hidden">
                            {brand.imageUrl ? (
                              <img
                                src={brand.imageUrl}
                                alt={brand.name}
                                className="w-full h-full object-contain"
                              />
                            ) : brand.name === 'Comforty' ? (
                              <span className="text-[10px] font-black tracking-widest text-slate-800">
                                COMFORTY
                              </span>
                            ) : brand.name === 'Vision' ? (
                              <span className="text-[10px] font-black tracking-wider text-slate-900 flex items-center">
                                VISI<span className="text-red-600">O</span>N
                              </span>
                            ) : brand.name === 'Walton' ? (
                              <span className="text-[10px] font-black tracking-wider text-blue-700 flex items-center gap-0.5">
                                <span className="text-red-600 font-extrabold text-xs">W</span> WALTON
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-700">
                                {brand.logoText}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {brand.name}
                      </td>

                      {/* Products count */}
                      <td className="py-3 px-4 font-semibold text-slate-600">
                        {brand.productsCount}
                      </td>

                      {/* Created date */}
                      <td className="py-3 px-4 text-slate-500 font-medium">
                        {brand.createdDate}
                      </td>

                      {/* Options: Edit, Delete */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingBrand(brand)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteBrand(brand.id, brand.name)}
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
      {/* MODAL 1: ADD BRAND                                       */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#990000] text-white p-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>নতুন ব্র্যান্ড যুক্ত করুন</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBrand} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ব্র্যান্ডের নাম *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেমন: Samsung, Bata, Apex"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              {/* Brand Image Upload */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">ব্র্যান্ড লোগো / ছবি (Image)</label>
                <div className="space-y-2">
                  {newImageUrl ? (
                    <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded">
                      <img
                        src={newImageUrl}
                        alt="Brand preview"
                        className="w-16 h-10 object-contain bg-white rounded border border-slate-200 p-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-emerald-700 font-bold block truncate">
                          ছবি সিলেক্ট করা হয়েছে
                        </span>
                        <button
                          type="button"
                          onClick={() => setNewImageUrl('')}
                          className="text-[10px] text-red-600 hover:underline font-bold mt-0.5"
                        >
                          ছবি রিমুভ করুন
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={addFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileChange(e, (url) => setNewImageUrl(url))}
                      />
                      <button
                        type="button"
                        onClick={() => addFileInputRef.current?.click()}
                        className="flex-1 py-2 px-3 border-2 border-dashed border-slate-300 hover:border-[#990000] rounded text-slate-600 hover:text-[#990000] flex items-center justify-center gap-1.5 font-bold transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>ছবি আপলোড করুন (ডিভাইস থেকে)</span>
                      </button>
                    </div>
                  )}

                  {/* Or Image URL */}
                  <div>
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="অথবা ইমেজের সরাসরি লিঙ্ক (URL) পেস্ট করুন"
                      className="w-full px-3 py-1.5 text-[11px] border border-slate-200 rounded focus:outline-none focus:border-[#990000] text-slate-700 placeholder-slate-400"
                    />
                  </div>
                </div>
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
                  className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold shadow-xs cursor-pointer"
                >
                  ব্র্যান্ড সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT BRAND                                      */}
      {/* ========================================================= */}
      {editingBrand && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#1e293b] text-white p-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Edit className="w-4 h-4 text-amber-400" />
                <span>ব্র্যান্ড সম্পাদনা</span>
              </h3>
              <button onClick={() => setEditingBrand(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ব্র্যান্ডের নাম *</label>
                <input
                  type="text"
                  required
                  value={editingBrand.name}
                  onChange={(e) =>
                    setEditingBrand({ ...editingBrand, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              {/* Edit Brand Image */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">ব্র্যান্ড লোগো / ছবি (Image)</label>
                <div className="space-y-2">
                  {editingBrand.imageUrl ? (
                    <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded">
                      <img
                        src={editingBrand.imageUrl}
                        alt="Brand preview"
                        className="w-16 h-10 object-contain bg-white rounded border border-slate-200 p-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-emerald-700 font-bold block truncate">
                          বর্তমান ছবি যুক্ত আছে
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <input
                            type="file"
                            ref={editFileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageFileChange(e, (url) =>
                                setEditingBrand({ ...editingBrand, imageUrl: url })
                              )
                            }
                          />
                          <button
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            className="text-[10px] text-[#990000] hover:underline font-bold"
                          >
                            ছবি পরিবর্তন করুন
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingBrand({ ...editingBrand, imageUrl: undefined })
                            }
                            className="text-[10px] text-red-600 hover:underline font-bold"
                          >
                            মুছে ফেলুন
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        ref={editFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageFileChange(e, (url) =>
                            setEditingBrand({ ...editingBrand, imageUrl: url })
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        className="w-full py-2 px-3 border-2 border-dashed border-slate-300 hover:border-[#990000] rounded text-slate-600 hover:text-[#990000] flex items-center justify-center gap-1.5 font-bold transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>ছবি আপলোড করুন (ডিভাইস থেকে)</span>
                      </button>
                    </div>
                  )}

                  <input
                    type="url"
                    value={editingBrand.imageUrl || ''}
                    onChange={(e) =>
                      setEditingBrand({
                        ...editingBrand,
                        imageUrl: e.target.value || undefined,
                      })
                    }
                    placeholder="অথবা ইমেজের সরাসরি লিঙ্ক (URL) পেস্ট করুন"
                    className="w-full px-3 py-1.5 text-[11px] border border-slate-200 rounded focus:outline-none focus:border-[#990000] text-slate-700 placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রোডাক্ট সংখ্যা</label>
                <input
                  type="number"
                  value={editingBrand.productsCount}
                  onChange={(e) =>
                    setEditingBrand({
                      ...editingBrand,
                      productsCount: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBrand(null)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-100 font-bold"
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
    </div>
  );
};
