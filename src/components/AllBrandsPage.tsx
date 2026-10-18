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
  Image as ImageIcon,
  AlertTriangle,
  Camera
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';
import { triggerGlobalSuccessModal } from '../context/SuccessModalContext';
import {
  fetchBrandsFromDatabase,
  saveBrandsToDatabase,
  deleteBrandFromDatabase,
} from '../utils/apiSync';

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
    name: 'Apex Premium',
    logoText: 'APEX',
    logoColor: 'text-red-700 font-black tracking-wider',
    productsCount: 12,
    createdDate: 'July 11, 2026',
  },
  {
    id: 'brand-2',
    name: 'Nature Care BD',
    logoText: 'NATURE CARE',
    logoColor: 'text-emerald-700 font-bold tracking-wider',
    productsCount: 8,
    createdDate: 'July 7, 2026',
  },
  {
    id: 'brand-3',
    name: 'Somadhan Pure',
    logoText: 'SOMADHAN',
    logoColor: 'text-blue-700 font-black tracking-wider',
    productsCount: 15,
    createdDate: 'July 7, 2026',
  },
  {
    id: 'brand-4',
    name: 'Walton',
    logoText: 'WALTON',
    logoColor: 'text-blue-700 font-black tracking-wider',
    productsCount: 7,
    createdDate: 'July 7, 2026',
  },
  {
    id: 'brand-5',
    name: 'Comforty',
    logoText: 'COMFORTY',
    logoColor: 'text-slate-800 font-black tracking-widest',
    productsCount: 7,
    createdDate: 'July 11, 2026',
  },
  {
    id: 'brand-6',
    name: 'Vision',
    logoText: 'VISION',
    logoColor: 'text-slate-800 font-bold tracking-wider',
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
  const [brandToDelete, setBrandToDelete] = useState<BrandRow | null>(null);
  const isInitialMount = useRef(true);

  // Direct table upload target
  const [directUploadBrandId, setDirectUploadBrandId] = useState<string | null>(null);
  const directTableFileInputRef = useRef<HTMLInputElement>(null);

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
      if (dbBrands && Array.isArray(dbBrands) && dbBrands.length > 0) {
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
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    try {
      localStorage.setItem('ummah_admin_brands_list', JSON.stringify(brandsList));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('brands-updated'));
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

  const handleDirectTableUpload = (brandId: string) => {
    setDirectUploadBrandId(brandId);
    if (directTableFileInputRef.current) {
      directTableFileInputRef.current.value = '';
      directTableFileInputRef.current.click();
    }
  };

  const onDirectFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && directUploadBrandId) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const base64Url = reader.result as string;
          const updated = brandsList.map((b) =>
            b.id === directUploadBrandId ? { ...b, imageUrl: base64Url } : b
          );
          setBrandsList(updated);
          try {
            localStorage.setItem('ummah_admin_brands_list', JSON.stringify(updated));
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('brands-updated'));
          } catch {}
          saveBrandsToDatabase(updated);
          showToast('ব্র্যান্ড ইমেজ সফলভাবে আপলোড ও সেভ হয়েছে!');
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

    const updated = brandsList.map((b) =>
      String(b.id) === String(editingBrand.id) ? editingBrand : b
    );
    setBrandsList(updated);
    try {
      localStorage.setItem('ummah_admin_brands_list', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('brands-updated'));
    } catch {}
    saveBrandsToDatabase(updated);

    showToast(`ব্র্যান্ড "${editingBrand.name}" সফলভাবে আপডেট হয়েছে!`);
    triggerGlobalSuccessModal({
      title: 'ব্র্যান্ড সেভ হয়েছে!',
      message: `ব্র্যান্ড "${editingBrand.name}" এর সকল তথ্য সফলভাবে সংরক্ষিত হয়েছে।`,
    });
    setEditingBrand(null);
  };

  const handleDeleteBrand = (brand: BrandRow) => {
    setBrandToDelete(brand);
  };

  const confirmDeleteBrand = () => {
    if (!brandToDelete) return;
    const id = brandToDelete.id;
    const name = brandToDelete.name;
    const updated = brandsList.filter((b) => String(b.id) !== String(id));
    setBrandsList(updated);
    setBrandToDelete(null);
    try {
      localStorage.setItem('ummah_admin_brands_list', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('brands-updated'));
    } catch {}
    saveBrandsToDatabase(updated);
    deleteBrandFromDatabase(id);
    showToast(`ব্র্যান্ড "${name}" মুছে ফেলা হয়েছে!`);
    triggerGlobalSuccessModal({
      title: 'ব্র্যান্ড মুছে ফেলা হয়েছে!',
      message: `"${name}" ব্র্যান্ডটি সফলভাবে ডাটাবেজ থেকে চিরতরে মুছে ফেলা হয়েছে।`,
    });
  };

  const filteredBrands = brandsList.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* Hidden file input for instant one-click table upload */}
      <input
        type="file"
        ref={directTableFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={onDirectFileChosen}
      />

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
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              All Brands (সকল ব্র্যান্ড)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              ব্র্যান্ডের লোগো/ছবি আপলোড করুন এবং নাম সরাসরি এডিট করুন
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
                placeholder="Search brands..."
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#990000] w-40 sm:w-64"
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
        <div className="p-4 sm:p-6">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                {/* Dark Navy Header */}
                <thead className="bg-[#1e293b] text-white font-bold tracking-wide">
                  <tr>
                    <th className="py-3 px-4 w-28 sm:w-36">Image (ছবি)</th>
                    <th className="py-3 px-4 min-w-[160px]">Name (ব্র্যান্ডের নাম)</th>
                    <th className="py-3 px-4 w-24 text-center">Products</th>
                    <th className="py-3 px-4 w-32 hidden md:table-cell">Created</th>
                    <th className="py-3 px-4 text-center w-36">Options</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredBrands.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        কোনো ব্র্যান্ড পাওয়া যায়নি। "+ Add Brand" ক্লিক করে নতুন ব্র্যান্ড যুক্ত করুন।
                      </td>
                    </tr>
                  ) : (
                    filteredBrands.map((brand) => (
                      <tr key={brand.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Drag handle + Brand Image/Logo with DIRECT Upload Trigger */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-slate-400 cursor-grab shrink-0" />
                            
                            {brand.imageUrl ? (
                              <div
                                onClick={() => handleDirectTableUpload(brand.id)}
                                className="relative w-16 h-10 rounded border border-slate-200 bg-white flex items-center justify-center p-1 shadow-2xs overflow-hidden group cursor-pointer hover:border-[#990000]"
                                title="ছবি পরিবর্তন করতে ক্লিক করুন"
                              >
                                <img
                                  src={brand.imageUrl}
                                  alt={brand.name}
                                  className="w-full h-full object-contain"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                  <Camera className="w-3.5 h-3.5" />
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleDirectTableUpload(brand.id)}
                                className="w-16 h-10 rounded border-2 border-dashed border-red-300 hover:border-[#990000] bg-red-50/70 hover:bg-red-100/90 text-[#990000] flex flex-col items-center justify-center p-0.5 transition-all cursor-pointer group shadow-2xs"
                                title="ব্র্যান্ডের ইমেজ আপলোড করতে ক্লিক করুন"
                              >
                                <Upload className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                <span className="text-[8px] font-bold mt-0.5 leading-tight">ইমেজ দিন</span>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Name (with quick edit click) */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              onClick={() => setEditingBrand(brand)}
                              className="font-bold text-slate-900 text-sm hover:text-[#990000] cursor-pointer"
                              title="নাম এডিট করতে ক্লিক করুন"
                            >
                              {brand.name}
                            </span>
                            <button
                              onClick={() => setEditingBrand(brand)}
                              className="text-slate-400 hover:text-amber-600 transition-colors p-0.5 cursor-pointer"
                              title="নাম এডিট করুন"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Products count */}
                        <td className="py-3 px-4 text-center font-bold text-slate-600">
                          {brand.productsCount}
                        </td>

                        {/* Created date */}
                        <td className="py-3 px-4 text-slate-500 font-medium hidden md:table-cell">
                          {brand.createdDate}
                        </td>

                        {/* Options: Edit, Delete */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setEditingBrand(brand)}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                              title="ব্র্যান্ডের নাম ও ছবি এডিট করুন"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteBrand(brand)}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                              title="ব্র্যান্ড মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
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
                  placeholder="যেমন: Apex Premium, Nature Care BD"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              {/* Brand Image Upload */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">ব্র্যান্ড লোগো / ছবি (Image Upload)</label>
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
                          className="text-[10px] text-red-600 hover:underline font-bold mt-0.5 cursor-pointer"
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
                        className="flex-1 py-2.5 px-3 border-2 border-dashed border-red-300 hover:border-[#990000] bg-red-50/50 hover:bg-red-50 rounded text-[#990000] flex items-center justify-center gap-1.5 font-bold transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
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
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
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
                <span>ব্র্যান্ডের নাম ও ছবি এডিট করুন</span>
              </h3>
              <button onClick={() => setEditingBrand(null)} className="text-white/80 hover:text-white cursor-pointer">
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
                  placeholder="ব্র্যান্ডের নাম লিখুন"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000] text-sm font-semibold"
                />
              </div>

              {/* Edit Brand Image */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">ব্র্যান্ড লোগো / ছবি (Image Upload)</label>
                <div className="space-y-2">
                  {editingBrand.imageUrl ? (
                    <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <img
                        src={editingBrand.imageUrl}
                        alt="Brand preview"
                        className="w-20 h-12 object-contain bg-white rounded border border-slate-200 p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-emerald-700 font-bold block truncate">
                          বর্তমান ছবি যুক্ত আছে
                        </span>
                        <div className="flex items-center gap-2 mt-1">
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
                            className="text-xs text-[#990000] hover:underline font-bold cursor-pointer"
                          >
                            ছবি পরিবর্তন করুন
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingBrand({ ...editingBrand, imageUrl: undefined })
                            }
                            className="text-xs text-red-600 hover:underline font-bold cursor-pointer"
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
                        className="w-full py-2.5 px-3 border-2 border-dashed border-red-300 hover:border-[#990000] bg-red-50/50 hover:bg-red-50 rounded-lg text-[#990000] flex items-center justify-center gap-1.5 font-bold transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>ডিভাইস থেকে নতুন ছবি আপলোড করুন</span>
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
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold shadow-xs cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CONFIRM DELETE BRAND MODAL                                */}
      {/* ========================================================= */}
      {brandToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#990000] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
                <h3 className="text-sm font-bold">ব্র্যান্ড মুছে ফেলার নিশ্চিতকরণ</h3>
              </div>
              <button
                onClick={() => setBrandToDelete(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-slate-700 space-y-1.5">
                <p className="font-bold text-red-900 text-sm">
                  আপনি কি নিশ্চিত যে এই ব্র্যান্ডটি মুছে ফেলতে চান?
                </p>
                <p className="font-semibold text-slate-800 text-xs">
                  ব্র্যান্ডের নাম: "{brandToDelete.name}"
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  এটি ডাটাবেজ থেকে স্থায়ীভাবে মুছে যাবে এবং ক্যাটালগ থেকে রিমুভ হবে।
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setBrandToDelete(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteBrand}
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
