import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  GripVertical,
  X,
  CheckCircle2,
  FolderOpen,
  Layers,
  Tag,
  PlusCircle,
  AlertTriangle,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { ProductVisual } from './ProductVisual';
import { AdminSidebar, AdminPageType } from './AdminSidebar';
import { triggerGlobalSuccessModal } from '../context/SuccessModalContext';
import { fetchCategoriesFromDatabase, saveCategoriesToDatabase } from '../utils/apiSync';

export interface SubCategoryItem {
  id: string;
  name: string;
  slug?: string;
  productCount?: number;
}

export interface CategoryRow {
  id: string;
  name: string;
  visualType: string;
  imageUrl?: string;
  subcategoriesCount: number;
  subcategories: SubCategoryItem[];
  createdDate: string;
}

interface AllCategoriesPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

export const INITIAL_CATEGORIES_WITH_SUBS: CategoryRow[] = [
  {
    id: 'cat-1',
    name: 'Woman Khimar',
    visualType: 'cat_khimar',
    subcategoriesCount: 4,
    createdDate: 'July 15, 2026',
    subcategories: [
      { id: 'sub-1-1', name: 'Cotton Khimar (কটন খিমার)' },
      { id: 'sub-1-2', name: 'Georgette Khimar (জর্জেট খিমার)' },
      { id: 'sub-1-3', name: 'Two-Piece Khimar Set (টু-পিস খিমার সেট)' },
      { id: 'sub-1-4', name: 'French Khimar (ফ্রেঞ্চ খিমার)' },
    ],
  },
  {
    id: 'cat-2',
    name: 'FORMAL SHOE',
    visualType: 'cat_formal_shoe',
    subcategoriesCount: 4,
    createdDate: 'July 7, 2026',
    subcategories: [
      { id: 'sub-2-1', name: 'Leather Half Shoe (লেদার হাফ সু)' },
      { id: 'sub-2-2', name: 'Oxford Formal Shoe (অক্সফোর্ড সু)' },
      { id: 'sub-2-3', name: 'Loafer Shoe (লোফার সু)' },
      { id: 'sub-2-4', name: 'Pure Leather Sandal (লেদার স্যান্ডেল)' },
    ],
  },
  {
    id: 'cat-3',
    name: 'Woman Borka',
    visualType: 'cat_borka',
    subcategoriesCount: 3,
    createdDate: 'July 15, 2026',
    subcategories: [
      { id: 'sub-3-1', name: 'Dubai Cherry Borka (দুবাই চেরি বোরকা)' },
      { id: 'sub-3-2', name: 'Abaya Borka (আবায়া বোরকা)' },
      { id: 'sub-3-3', name: 'Coat Borka (কোট বোরকা)' },
    ],
  },
  {
    id: 'cat-4',
    name: 'Kids Khimar',
    visualType: 'cat_kids_khimar',
    subcategoriesCount: 2,
    createdDate: 'July 15, 2026',
    subcategories: [
      { id: 'sub-4-1', name: 'Kids Cotton Khimar (কিডস কটন খিমার)' },
      { id: 'sub-4-2', name: 'Kids Party Khimar (কিডস পার্টি খিমার)' },
    ],
  },
  {
    id: 'cat-5',
    name: "Man's Shirt",
    visualType: 'cat_shirt',
    subcategoriesCount: 3,
    createdDate: 'July 15, 2026',
    subcategories: [
      { id: 'sub-5-1', name: 'Formal Cotton Shirt (ফরমাল কটন শার্ট)' },
      { id: 'sub-5-2', name: 'Casual Oxford Shirt (ক্যাজুয়াল অক্সফোর্ড শার্ট)' },
      { id: 'sub-5-3', name: 'Printed Linen Shirt (প্রিন্টেড লিনেন শার্ট)' },
    ],
  },
  {
    id: 'cat-6',
    name: 'Winter Jacket',
    visualType: 'cat_jacket',
    subcategoriesCount: 3,
    createdDate: 'July 15, 2026',
    subcategories: [
      { id: 'sub-6-1', name: 'Windbreaker Jacket (উইন্ডব্রেকার জ্যাকেট)' },
      { id: 'sub-6-2', name: 'Bomber Jacket (বোম্বার জ্যাকেট)' },
      { id: 'sub-6-3', name: 'Hoodie Jacket (হুডি জ্যাকেট)' },
    ],
  },
  {
    id: 'cat-7',
    name: "Man's Jubba",
    visualType: 'cat_jubba',
    subcategoriesCount: 3,
    createdDate: 'July 15, 2026',
    subcategories: [
      { id: 'sub-7-1', name: 'Arabian Tory Jubba (অ্যারাবিয়ান তরি জুব্বা)' },
      { id: 'sub-7-2', name: 'Embroidered Jubba (এমব্রয়ডারি জুব্বা)' },
      { id: 'sub-7-3', name: 'Short Kurta Jubba (শর্ট কুর্তা জুব্বা)' },
    ],
  },
  {
    id: 'cat-8',
    name: 'Electronics',
    visualType: 'cat_electronics',
    subcategoriesCount: 3,
    createdDate: 'July 15, 2026',
    subcategories: [
      { id: 'sub-8-1', name: 'Rechargeable Table Fans (রিচার্জেবল টেবিল ফ্যান)' },
      { id: 'sub-8-2', name: 'Electric Kettles & Grinders (কেতলি ও গ্রাইন্ডার)' },
      { id: 'sub-8-3', name: 'Desk Lamps & Lights (ডেস্ক ল্যাম্প ও লাইট)' },
    ],
  },
  {
    id: 'cat-9',
    name: 'Leather Goods',
    visualType: 'cat_leather',
    subcategoriesCount: 3,
    createdDate: 'July 15, 2026',
    subcategories: [
      { id: 'sub-9-1', name: 'Executive Laptop Bags (ল্যাপটপ ব্যাগ)' },
      { id: 'sub-9-2', name: 'Genuine Leather Wallets (লেদার ওয়ালেট)' },
      { id: 'sub-9-3', name: 'Leather Belts (লেদার বেল্ট)' },
    ],
  },
  {
    id: 'cat-10',
    name: 'Gadget and Accessories',
    visualType: 'cat_gadgets',
    subcategoriesCount: 3,
    createdDate: 'July 7, 2026',
    subcategories: [
      { id: 'sub-10-1', name: 'Smart Watches (স্মার্ট ওয়াচ)' },
      { id: 'sub-10-2', name: 'Wireless Earbuds & Headphones (ইয়ারবাডস ও হেডফোন)' },
      { id: 'sub-10-3', name: 'Bluetooth Speakers (ব্লুটুথ স্পিকার)' },
    ],
  },
];

export const AllCategoriesPage: React.FC<AllCategoriesPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);
  const [viewingCategory, setViewingCategory] = useState<CategoryRow | null>(null);
  const [subcategoryManagingCategory, setSubcategoryManagingCategory] = useState<CategoryRow | null>(null);

  // New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newVisualType, setNewVisualType] = useState('cat_khimar');
  const [newCatImageUrl, setNewCatImageUrl] = useState('');
  const [newCatSubcategories, setNewCatSubcategories] = useState<string[]>([]);
  const [tempSubcatInput, setTempSubcatInput] = useState('');
  const addCategoryFileInputRef = useRef<HTMLInputElement>(null);
  const editCategoryFileInputRef = useRef<HTMLInputElement>(null);

  // Quick subcategory adder in Subcategory Manager modal
  const [modalNewSubInput, setModalNewSubInput] = useState('');

  // Categories list with localStorage persistence
  const [categoriesList, setCategoriesList] = useState<CategoryRow[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ummah_admin_categories_list');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Failed to load categories from localStorage', e);
      }
    }
    return INITIAL_CATEGORIES_WITH_SUBS;
  });

  // Initial load from server database
  useEffect(() => {
    fetchCategoriesFromDatabase().then((dbCats) => {
      if (dbCats && Array.isArray(dbCats) && dbCats.length > 0) {
        setCategoriesList(dbCats);
        try {
          localStorage.setItem('ummah_admin_categories_list', JSON.stringify(dbCats));
          window.dispatchEvent(new Event('storage'));
        } catch {}
      }
    });
  }, []);

  // Sync categoriesList to localStorage and server database
  useEffect(() => {
    try {
      localStorage.setItem('ummah_admin_categories_list', JSON.stringify(categoriesList));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
    // Save permanently to server database
    saveCategoriesToDatabase(categoriesList);
  }, [categoriesList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCategoryImageUpload = (
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

  // 1. Add Category Handler
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const subs: SubCategoryItem[] = newCatSubcategories.map((s, idx) => ({
      id: `sub-${Date.now()}-${idx}`,
      name: s.trim(),
    }));

    const newCat: CategoryRow = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      visualType: newVisualType,
      imageUrl: newCatImageUrl.trim() || undefined,
      subcategoriesCount: subs.length,
      subcategories: subs,
      createdDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setCategoriesList((prev) => [newCat, ...prev]);
    setIsAddModalOpen(false);
    setNewCatName('');
    setNewCatImageUrl('');
    setNewCatSubcategories([]);
    setTempSubcatInput('');
    showToast(`নতুন ক্যাটাগরি "${newCat.name}" তৈরি হয়েছে!`);
    triggerGlobalSuccessModal({
      title: 'ক্যাটাগরি তৈরি হয়েছে!',
      message: `নতুন ক্যাটাগরি "${newCat.name}" সফলভাবে সংরক্ষিত ও সাইটে সক্রিয় করা হয়েছে।`,
    });
  };

  // Add subcategory chip in new category form
  const handleAddTempSubcategory = () => {
    if (!tempSubcatInput.trim()) return;
    if (!newCatSubcategories.includes(tempSubcatInput.trim())) {
      setNewCatSubcategories([...newCatSubcategories, tempSubcatInput.trim()]);
    }
    setTempSubcatInput('');
  };

  // 2. Save Edit Category Handler
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setCategoriesList((prev) =>
      prev.map((c) =>
        c.id === editingCategory.id
          ? {
              ...editingCategory,
              subcategoriesCount: editingCategory.subcategories?.length || 0,
            }
          : c
      )
    );
    showToast(`ক্যাটাগরি "${editingCategory.name}" আপডেট করা হয়েছে!`);
    triggerGlobalSuccessModal({
      title: 'ক্যাটাগরি সেভ হয়েছে!',
      message: `ক্যাটাগরি "${editingCategory.name}" এর পরিবর্তনসমূহ সফলভাবে সংরক্ষণ করা হয়েছে।`,
    });
    setEditingCategory(null);
  };

  // 3. Delete Category Handler
  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`আপনি কি সত্যিই "${name}" ক্যাটাগরিটি মুছে ফেলতে চান?`)) {
      setCategoriesList((prev) => prev.filter((c) => c.id !== id));
      showToast(`"${name}" ক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে!`);
    }
  };

  // 4. Sub-category Direct Management Handlers
  const handleAddSubcategoryToCurrent = (catId: string, subName: string) => {
    if (!subName.trim()) return;

    const newSub: SubCategoryItem = {
      id: `sub-${Date.now()}`,
      name: subName.trim(),
    };

    setCategoriesList((prev) =>
      prev.map((c) => {
        if (c.id === catId) {
          const updatedSubs = [...(c.subcategories || []), newSub];
          const updatedCat = {
            ...c,
            subcategories: updatedSubs,
            subcategoriesCount: updatedSubs.length,
          };
          if (subcategoryManagingCategory?.id === catId) {
            setSubcategoryManagingCategory(updatedCat);
          }
          return updatedCat;
        }
        return c;
      })
    );

    setModalNewSubInput('');
    showToast(`সাব-ক্যাটাগরি "${subName.trim()}" যোগ করা হয়েছে!`);
  };

  const handleDeleteSubcategoryFromCurrent = (catId: string, subId: string, subName: string) => {
    if (confirm(`আপনি কি "${subName}" সাব-ক্যাটাগরিটি মুছে ফেলতে চান?`)) {
      setCategoriesList((prev) =>
        prev.map((c) => {
          if (c.id === catId) {
            const updatedSubs = (c.subcategories || []).filter((s) => s.id !== subId);
            const updatedCat = {
              ...c,
              subcategories: updatedSubs,
              subcategoriesCount: updatedSubs.length,
            };
            if (subcategoryManagingCategory?.id === catId) {
              setSubcategoryManagingCategory(updatedCat);
            }
            return updatedCat;
          }
          return c;
        })
      );
      showToast(`সাব-ক্যাটাগরি "${subName}" মুছে ফেলা হয়েছে!`);
    }
  };

  const filteredCategories = categoriesList.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="all_categories"
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

        {/* Top Header Row */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              All Categories & Subcategories
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              ক্যাটাগরি এবং তার ভেতরে সাব-ক্যাটাগরি তৈরি ও পরিচালনা করুন
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
                placeholder="Search categories..."
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#990000] w-48 sm:w-64"
              />
            </div>

            {/* Red + Add Category Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>
        </header>

        {/* 3. Categories Table */}
        <div className="p-6">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                {/* Dark Navy Header */}
                <thead className="bg-[#1e293b] text-white font-bold tracking-wide">
                  <tr>
                    <th className="py-3 px-4 min-w-[100px]">Image</th>
                    <th className="py-3 px-4 min-w-[200px]">Category Name</th>
                    <th className="py-3 px-4 min-w-[260px]">Subcategories (সাব-ক্যাটাগরি)</th>
                    <th className="py-3 px-4 min-w-[140px]">Created Date</th>
                    <th className="py-3 px-4 text-center min-w-[220px]">Options</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredCategories.map((cat) => {
                    const subCount = cat.subcategories?.length ?? cat.subcategoriesCount ?? 0;
                    return (
                      <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Drag Handle + Image */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                            <div className="w-10 h-10 rounded border border-slate-200 bg-slate-50 shrink-0 overflow-hidden flex items-center justify-center p-0.5 shadow-2xs">
                              {cat.imageUrl ? (
                                <img
                                  src={cat.imageUrl}
                                  alt={cat.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <ProductVisual visualType={cat.visualType} name={cat.name} />
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Name */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                            {cat.name}
                          </span>
                        </td>

                        {/* Subcategories Column: with Interactive Badges & quick manager */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSubcategoryManagingCategory(cat)}
                                title="সাব-ক্যাটাগরি পরিচালনা করতে ক্লিক করুন"
                                className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                              >
                                <Layers className="w-3 h-3 text-purple-600" />
                                <span>{subCount} টি সাব-ক্যাটাগরি</span>
                              </button>
                            </div>

                            {/* Show first 3 subcategories as chips */}
                            {cat.subcategories && cat.subcategories.length > 0 && (
                              <div className="flex flex-wrap gap-1 max-w-sm">
                                {cat.subcategories.slice(0, 3).map((sub) => (
                                  <span
                                    key={sub.id}
                                    className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium truncate max-w-[120px]"
                                    title={sub.name}
                                  >
                                    {sub.name}
                                  </span>
                                ))}
                                {cat.subcategories.length > 3 && (
                                  <button
                                    onClick={() => setSubcategoryManagingCategory(cat)}
                                    className="text-[10px] text-purple-700 font-bold hover:underline"
                                  >
                                    +{cat.subcategories.length - 3} আরও
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Created Date */}
                        <td className="py-3 px-4 text-slate-500 font-medium">
                          {cat.createdDate}
                        </td>

                        {/* Options: Subcategories, View, Edit, Delete */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Manage Subcategories Button */}
                            <button
                              onClick={() => setSubcategoryManagingCategory(cat)}
                              className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="সাব-ক্যাটাগরি যোগ বা বাদ দিন"
                            >
                              <Layers className="w-3 h-3" />
                              <span>সাব-ক্যাটাগরি</span>
                            </button>

                            {/* View Button */}
                            <button
                              onClick={() => setViewingCategory(cat)}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View</span>
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => setEditingCategory(cat)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
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
      {/* MODAL 1: ADD CATEGORY WITH SUB-CATEGORIES                 */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#990000] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-amber-300" />
                <h3 className="text-sm font-bold">নতুন ক্যাটাগরি ও সাব-ক্যাটাগরি যুক্ত করুন</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরির নাম *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="যেমন: Kids Collection, Footwear"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000] text-slate-900"
                />
              </div>

              {/* Category Image Upload */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ক্যাটাগরি ছবি (Image Upload)
                </label>
                <div className="space-y-2">
                  {newCatImageUrl ? (
                    <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      <img
                        src={newCatImageUrl}
                        alt="Category preview"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-emerald-700 font-bold block truncate">
                          ছবি সফলভাবে সিলেক্ট করা হয়েছে
                        </span>
                        <button
                          type="button"
                          onClick={() => setNewCatImageUrl('')}
                          className="text-[10px] text-red-600 hover:underline font-bold mt-1"
                        >
                          ছবি রিমুভ করুন
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        ref={addCategoryFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleCategoryImageUpload(e, (url) => setNewCatImageUrl(url))
                        }
                      />
                      <button
                        type="button"
                        onClick={() => addCategoryFileInputRef.current?.click()}
                        className="w-full py-2 px-3 border-2 border-dashed border-slate-300 hover:border-[#990000] rounded-lg text-slate-600 hover:text-[#990000] flex items-center justify-center gap-1.5 font-bold transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>ডিভাইস থেকে ক্যাটাগরির ছবি আপলোড করুন</span>
                      </button>
                    </div>
                  )}

                  <input
                    type="url"
                    value={newCatImageUrl}
                    onChange={(e) => setNewCatImageUrl(e.target.value)}
                    placeholder="অথবা ইমেজের সরাসরি লিঙ্ক (URL) পেস্ট করুন"
                    className="w-full px-3 py-1.5 text-[11px] border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000] text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">অথবা ডিফল্ট আইকন টাইপ</label>
                <select
                  value={newVisualType}
                  onChange={(e) => setNewVisualType(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:outline-none bg-white text-slate-900 cursor-pointer"
                >
                  <option value="cat_khimar">Woman Khimar (ছবি)</option>
                  <option value="cat_formal_shoe">Formal Shoe (ছবি)</option>
                  <option value="cat_borka">Woman Borka (ছবি)</option>
                  <option value="cat_kids_khimar">Kids Khimar (ছবি)</option>
                  <option value="cat_shirt">Man's Shirt (ছবি)</option>
                  <option value="cat_jacket">Winter Jacket (ছবি)</option>
                  <option value="cat_jubba">Man's Jubba (ছবি)</option>
                  <option value="cat_electronics">Electronics (ছবি)</option>
                  <option value="cat_leather">Leather Goods (ছবি)</option>
                  <option value="cat_gadgets">Gadget and Accessories (ছবি)</option>
                </select>
              </div>

              {/* Subcategories Section */}
              <div className="p-3.5 bg-purple-50/50 border border-purple-200 rounded-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-purple-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-700" />
                    <span>এই ক্যাটাগরির ভেতরে সাব-ক্যাটাগরি (ঐচ্ছিক)</span>
                  </label>
                  <span className="text-[11px] text-purple-700 font-bold">
                    {newCatSubcategories.length} টি যুক্ত আছে
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempSubcatInput}
                    onChange={(e) => setTempSubcatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTempSubcategory();
                      }
                    }}
                    placeholder="সাব-ক্যাটাগরির নাম লিখুন (যেমন: কটন শার্ট, সিল্ক শার্ট)..."
                    className="flex-1 px-3 py-1.5 border border-purple-300 rounded-lg bg-white focus:outline-none focus:border-purple-600 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTempSubcategory}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>যোগ করুন</span>
                  </button>
                </div>

                {newCatSubcategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {newCatSubcategories.map((sub, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-purple-300 text-purple-900 rounded-full font-bold text-[11px] shadow-2xs"
                      >
                        <span>{sub}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setNewCatSubcategories(newCatSubcategories.filter((_, i) => i !== idx))
                          }
                          className="text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  ক্যাটাগরি সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT CATEGORY & ITS SUB-CATEGORIES               */}
      {/* ========================================================= */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#1e293b] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold">ক্যাটাগরি সম্পাদনা: {editingCategory.name}</h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরির নাম *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000] text-slate-900"
                />
              </div>

              {/* Edit Category Image Upload */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ক্যাটাগরি ছবি (Image Upload)
                </label>
                <div className="space-y-2">
                  {editingCategory.imageUrl ? (
                    <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      <img
                        src={editingCategory.imageUrl}
                        alt="Category preview"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-emerald-700 font-bold block truncate">
                          বর্তমান ছবি যুক্ত আছে
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="file"
                            ref={editCategoryFileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleCategoryImageUpload(e, (url) =>
                                setEditingCategory({ ...editingCategory, imageUrl: url })
                              )
                            }
                          />
                          <button
                            type="button"
                            onClick={() => editCategoryFileInputRef.current?.click()}
                            className="text-[10px] text-[#990000] hover:underline font-bold cursor-pointer"
                          >
                            ছবি পরিবর্তন করুন
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingCategory({ ...editingCategory, imageUrl: undefined })
                            }
                            className="text-[10px] text-red-600 hover:underline font-bold cursor-pointer"
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
                        ref={editCategoryFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleCategoryImageUpload(e, (url) =>
                            setEditingCategory({ ...editingCategory, imageUrl: url })
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() => editCategoryFileInputRef.current?.click()}
                        className="w-full py-2 px-3 border-2 border-dashed border-slate-300 hover:border-[#990000] rounded-lg text-slate-600 hover:text-[#990000] flex items-center justify-center gap-1.5 font-bold transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>ডিভাইস থেকে ক্যাটাগরির ছবি আপলোড করুন</span>
                      </button>
                    </div>
                  )}

                  <input
                    type="url"
                    value={editingCategory.imageUrl || ''}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        imageUrl: e.target.value || undefined,
                      })
                    }
                    placeholder="অথবা ইমেজের সরাসরি লিঙ্ক (URL) পেস্ট করুন"
                    className="w-full px-3 py-1.5 text-[11px] border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000] text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">অথবা ডিফল্ট আইকন টাইপ</label>
                <select
                  value={editingCategory.visualType}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, visualType: e.target.value })
                  }
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:outline-none bg-white text-slate-900 cursor-pointer"
                >
                  <option value="cat_khimar">Woman Khimar (ছবি)</option>
                  <option value="cat_formal_shoe">Formal Shoe (ছবি)</option>
                  <option value="cat_borka">Woman Borka (ছবি)</option>
                  <option value="cat_kids_khimar">Kids Khimar (ছবি)</option>
                  <option value="cat_shirt">Man's Shirt (ছবি)</option>
                  <option value="cat_jacket">Winter Jacket (ছবি)</option>
                  <option value="cat_jubba">Man's Jubba (ছবি)</option>
                  <option value="cat_electronics">Electronics (ছবি)</option>
                  <option value="cat_leather">Leather Goods (ছবি)</option>
                  <option value="cat_gadgets">Gadget and Accessories (ছবি)</option>
                </select>
              </div>

              {/* Subcategories list in Edit Modal */}
              <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-700" />
                    <span>বর্তমান সাব-ক্যাটাগরি তালিকা ({editingCategory.subcategories?.length || 0})</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(editingCategory.subcategories || []).map((s) => (
                    <span
                      key={s.id}
                      className="px-2.5 py-1 bg-white border border-purple-300 text-purple-900 rounded-full font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                    >
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingCategory.subcategories || []).filter(
                            (x) => x.id !== s.id
                          );
                          setEditingCategory({
                            ...editingCategory,
                            subcategories: updated,
                            subcategoriesCount: updated.length,
                          });
                        }}
                        className="text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  {(!editingCategory.subcategories || editingCategory.subcategories.length === 0) && (
                    <p className="text-slate-400 italic">কোনো সাব-ক্যাটাগরি নেই</p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: DEDICATED SUB-CATEGORY MANAGER                   */}
      {/* ========================================================= */}
      {subcategoryManagingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-purple-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-300" />
                <div>
                  <h3 className="text-sm font-bold">
                    {subcategoryManagingCategory.name} - সাব-ক্যাটাগরি পরিচালনা
                  </h3>
                  <p className="text-[11px] text-purple-200">
                    এই ক্যাটাগরির ভেতরে সাব-ক্যাটাগরি যোগ ও নিয়ন্ত্রণ করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSubcategoryManagingCategory(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Add New Subcategory Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="font-bold text-slate-800 block">
                  নতুন সাব-ক্যাটাগরি যোগ করুন:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={modalNewSubInput}
                    onChange={(e) => setModalNewSubInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubcategoryToCurrent(
                          subcategoryManagingCategory.id,
                          modalNewSubInput
                        );
                      }
                    }}
                    placeholder="সাব-ক্যাটাগরির নাম লিখুন (যেমন: কটন খিমার, লেদার লোফার)..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-purple-600 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleAddSubcategoryToCurrent(
                        subcategoryManagingCategory.id,
                        modalNewSubInput
                      )
                    }
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>যোগ করুন</span>
                  </button>
                </div>
              </div>

              {/* Subcategories List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800">
                    বর্তমান সাব-ক্যাটাগরি তালিকা ({subcategoryManagingCategory.subcategories?.length || 0}):
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    ক্লিক করে যে কোনো সাব-ক্যাটাগরি মুছে ফেলতে পারেন
                  </span>
                </div>

                {!subcategoryManagingCategory.subcategories ||
                subcategoryManagingCategory.subcategories.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-500 space-y-1">
                    <Layers className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="font-semibold">বর্তমানে কোনো সাব-ক্যাটাগরি যুক্ত নেই</p>
                    <p className="text-[11px] text-slate-400">
                      উপরের ইনপুট বক্সে নাম লিখে "+ যোগ করুন" বাটনে চাপ দিন।
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                    {subcategoryManagingCategory.subcategories.map((sub, idx) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg hover:border-purple-300 transition-colors shadow-2xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-slate-800 truncate" title={sub.name}>
                            {sub.name}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteSubcategoryFromCurrent(
                              subcategoryManagingCategory.id,
                              sub.id,
                              sub.name
                            )
                          }
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                          title="এই সাব-ক্যাটাগরি মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSubcategoryManagingCategory(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
                >
                  সম্পন্ন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: VIEW CATEGORY PREVIEW WITH SUB-CATEGORIES        */}
      {/* ========================================================= */}
      {viewingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#1e293b] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold">ক্যাটাগরি প্রিভিউ</h3>
              </div>
              <button
                onClick={() => setViewingCategory(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-center space-y-3.5 text-xs">
              <div className="w-20 h-20 rounded-full border-2 border-slate-200 bg-slate-50 mx-auto overflow-hidden flex items-center justify-center p-2 shadow-xs">
                <ProductVisual visualType={viewingCategory.visualType} name={viewingCategory.name} />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">{viewingCategory.name}</h4>
                <p className="text-slate-500 mt-1">তৈরির তারিখ: {viewingCategory.createdDate}</p>
              </div>

              {/* Subcategories list */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-left space-y-1.5">
                <span className="font-bold text-slate-700 block text-[11px]">
                  সাব-ক্যাটাগরি তালিকা ({viewingCategory.subcategories?.length || 0} টি):
                </span>
                {viewingCategory.subcategories && viewingCategory.subcategories.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {viewingCategory.subcategories.map((sub) => (
                      <span
                        key={sub.id}
                        className="px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded text-[10px] font-semibold"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-[11px]">কোনো সাব-ক্যাটাগরি নেই</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => {
                    const current = viewingCategory;
                    setViewingCategory(null);
                    setSubcategoryManagingCategory(current);
                  }}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>সাব-ক্যাটাগরি পরিচালনা</span>
                </button>
                <button
                  onClick={() => setViewingCategory(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
