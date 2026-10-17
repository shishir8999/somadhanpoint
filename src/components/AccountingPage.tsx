import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Tag,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  ChevronDown,
  X,
  CheckCircle2,
  Trash2,
  Edit
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';
import { triggerGlobalSuccessModal } from '../context/SuccessModalContext';

interface AccountingPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

interface ExpenseItem {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  note?: string;
}

export const AccountingPage: React.FC<AccountingPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('All Expenses');
  const [typeFilter, setTypeFilter] = useState('Expense');
  const [timeFilter, setTimeFilter] = useState('Today');

  // Modals
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [categories, setCategories] = useState(['Packaging', 'Courier Delivery', 'Office Rent', 'Facebook Ads', 'Salaries']);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Form
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState('Packaging');
  const [expAmount, setExpAmount] = useState('');
  const [expNote, setExpNote] = useState('');

  // State
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalIncome = 730;
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;

    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title: expTitle,
      category: expCategory,
      amount: Number(expAmount),
      date: 'Today',
      note: expNote,
    };

    setExpenses([newExp, ...expenses]);
    setIsAddExpenseOpen(false);
    setExpTitle('');
    setExpAmount('');
    setExpNote('');
    setToastMessage('খরচ সফলভাবে যোগ করা হয়েছে!');
    setTimeout(() => setToastMessage(null), 3000);
    triggerGlobalSuccessModal({
      title: 'হিসাব সংরক্ষণ হয়েছে!',
      message: `খরচের বিবরণ "${newExp.title}" (৳${newExp.amount}) সফলভাবে সেভ করা হয়েছে।`,
    });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const catName = newCategoryName.trim();
    setCategories([...categories, catName]);
    setIsAddCategoryOpen(false);
    setNewCategoryName('');
    triggerGlobalSuccessModal({
      title: 'ক্যাটাগরি যুক্ত হয়েছে!',
      message: `খরচের ক্যাটাগরি "${catName}" সফলভাবে তৈরি হয়েছে।`,
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="accounting"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Action Bar matching Screenshot 3 */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-end gap-3 sticky top-0 z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* + Add Expense button */}
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Expense</span>
            </button>

            {/* Add Expense Category button */}
            <button
              onClick={() => setIsAddCategoryOpen(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              <span>Add Expense Category</span>
            </button>

            {/* All Expenses dropdown */}
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="pl-3 pr-7 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="All Expenses">All Expenses</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Expense dropdown */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-3 pr-7 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Today dropdown */}
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="pl-8 pr-7 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="This Month">This Month</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
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

          {/* 3 Top Stat Cards matching Screenshot 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* 1. Total Income */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Total Income</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">৳ {totalIncome}</h3>
              </div>
            </div>

            {/* 2. Total Expense */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Total Expense</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">৳ {totalExpense}</h3>
              </div>
            </div>

            {/* 3. Net Balance */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Net Balance</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">৳ {netBalance}</h3>
              </div>
            </div>
          </div>

          {/* Main Card below: Empty State or Table */}
          {expenses.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs py-20 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Receipt className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-600">No expenses found</p>
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="mt-4 text-xs font-bold text-[#990000] hover:underline"
              >
                + Add your first expense
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800">
                  Recorded Expenses ({expenses.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-semibold border-b border-slate-100">
                      <th className="py-2.5 px-4">EXPENSE TITLE</th>
                      <th className="py-2.5 px-4">CATEGORY</th>
                      <th className="py-2.5 px-4">DATE</th>
                      <th className="py-2.5 px-4 text-right">AMOUNT</th>
                      <th className="py-2.5 px-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expenses.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-slate-900">{item.title}</td>
                        <td className="py-3 px-4 text-slate-600">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{item.date}</td>
                        <td className="py-3 px-4 text-right font-bold text-rose-600">৳ {item.amount}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteExpense(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal: Add Expense */}
        {isAddExpenseOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Add New Expense</h3>
                <button onClick={() => setIsAddExpenseOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Title</label>
                  <input
                    type="text"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    placeholder="e.g. Courier Parcel Box Purchase"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={expCategory}
                      onChange={(e) => setExpCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (৳)</label>
                    <input
                      type="number"
                      value={expAmount}
                      onChange={(e) => setExpAmount(e.target.value)}
                      placeholder="e.g. 1500"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Note (Optional)</label>
                  <textarea
                    rows={2}
                    value={expNote}
                    onChange={(e) => setExpNote(e.target.value)}
                    placeholder="Write invoice reference..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddExpenseOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#990000] hover:bg-[#800000] rounded-lg shadow-2xs"
                  >
                    Save Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Expense Category */}
        {isAddCategoryOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Add Expense Category</h3>
                <button onClick={() => setIsAddCategoryOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>

              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Utility Bills, Tea & Snacks"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#990000] rounded-lg"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
