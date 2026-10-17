import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Clock,
  Shield,
  X,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

export interface AdminUserRow {
  id: string;
  sl: number;
  name: string;
  number: string;
  status: 'Active' | 'Inactive';
  role: 'admin' | 'employee' | 'manager';
  schedule?: string;
  createdAt: string;
}

interface AllAdminsPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

export const AllAdminsPage: React.FC<AllAdminsPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserRow | null>(null);

  // New admin form
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'employee' | 'manager'>('employee');
  const [newSchedule, setNewSchedule] = useState('09:00 AM – 05:00 PM');

  // Exact 5 rows from Screenshot 1
  const [adminsList, setAdminsList] = useState<AdminUserRow[]>([
    {
      id: 'adm-1',
      sl: 1,
      name: 'Super Admin',
      number: '01982708789',
      status: 'Active',
      role: 'admin',
      createdAt: 'July 5, 2026',
    },
    {
      id: 'adm-2',
      sl: 2,
      name: 'Employee 3',
      number: '01993998364',
      status: 'Active',
      role: 'employee',
      schedule: '01:00 AM – 09:00 AM',
      createdAt: 'September 18, 2026',
    },
    {
      id: 'adm-3',
      sl: 3,
      name: 'Employee 2',
      number: '01884757736',
      status: 'Active',
      role: 'employee',
      schedule: '05:00 PM – 01:00 AM',
      createdAt: 'September 18, 2026',
    },
    {
      id: 'adm-4',
      sl: 4,
      name: 'Employee 1',
      number: '01738411233',
      status: 'Active',
      role: 'employee',
      schedule: '09:00 AM – 05:00 PM',
      createdAt: 'September 18, 2026',
    },
    {
      id: 'adm-5',
      sl: 5,
      name: 'Manager 1',
      number: '01384777521',
      status: 'Active',
      role: 'manager',
      createdAt: 'September 18, 2026',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newNumber.trim()) return;

    const newRow: AdminUserRow = {
      id: `adm-${Date.now()}`,
      sl: adminsList.length + 1,
      name: newName.trim(),
      number: newNumber.trim(),
      status: 'Active',
      role: newRole,
      schedule: newRole === 'employee' ? newSchedule : undefined,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setAdminsList((prev) => [...prev, newRow]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewNumber('');
    showToast(`নতুন অ্যাডমিন/স্টাফ "${newRow.name}" সফলভাবে যুক্ত হয়েছে!`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    setAdminsList((prev) =>
      prev.map((a) => (a.id === editingAdmin.id ? editingAdmin : a))
    );
    showToast(`"${editingAdmin.name}" সফলভাবে আপডেট করা হয়েছে!`);
    setEditingAdmin(null);
  };

  const handleDeleteAdmin = (id: string, name: string) => {
    if (confirm(`আপনি কি সত্যিই "${name}" কে তালিকা থেকে মুছে ফেলতে চান?`)) {
      setAdminsList((prev) => prev.filter((a) => a.id !== id));
      showToast(`"${name}" মুছে ফেলা হয়েছে!`);
    }
  };

  const filteredAdmins = adminsList.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    a.number.includes(searchQuery.trim()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="all_admin"
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
            All Admins
          </h1>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search admins..."
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#990000] w-48 sm:w-64"
              />
            </div>

            {/* Red + Add Admin Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Admin</span>
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
                    <th className="py-3 px-4 w-12 text-center">Sl.</th>
                    <th className="py-3 px-4 min-w-[160px]">Name</th>
                    <th className="py-3 px-4 min-w-[140px]">Number</th>
                    <th className="py-3 px-4 min-w-[100px]">Status</th>
                    <th className="py-3 px-4 min-w-[120px]">Role</th>
                    <th className="py-3 px-4 min-w-[180px]">Schedule</th>
                    <th className="py-3 px-4 min-w-[160px]">Created At</th>
                    <th className="py-3 px-4 text-center min-w-[160px]">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredAdmins.map((adm, idx) => (
                    <tr key={adm.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Sl. */}
                      <td className="py-3.5 px-4 text-center font-medium text-slate-500">
                        {adm.sl || idx + 1}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {adm.name}
                      </td>

                      {/* Number */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                        {adm.number}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          {adm.status}
                        </span>
                      </td>

                      {/* Role Pill with Circle */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full border border-blue-500"></span>
                          <span>{adm.role}</span>
                        </span>
                      </td>

                      {/* Schedule */}
                      <td className="py-3.5 px-4">
                        {adm.schedule ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                            <Clock className="w-3 h-3 text-purple-500" />
                            <span>{adm.schedule}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        {adm.createdAt}
                      </td>

                      {/* Actions: Edit, Delete */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingAdmin(adm)}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteAdmin(adm.id, adm.name)}
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
      {/* MODAL 1: ADD ADMIN                                       */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#990000] text-white p-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">নতুন অ্যাডমিন / স্টাফ যুক্ত করুন</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">নাম *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেমন: Employee 4"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">মোবাইল নাম্বার *</label>
                <input
                  type="tel"
                  required
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">রোল (Role)</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded focus:outline-none"
                  >
                    <option value="employee">employee (স্টাফ)</option>
                    <option value="manager">manager (ম্যানেজার)</option>
                    <option value="admin">admin (অ্যাডমিন)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ডিউটি শিডিউল</label>
                  <select
                    value={newSchedule}
                    onChange={(e) => setNewSchedule(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded focus:outline-none"
                  >
                    <option value="09:00 AM – 05:00 PM">09:00 AM – 05:00 PM</option>
                    <option value="05:00 PM – 01:00 AM">05:00 PM – 01:00 AM</option>
                    <option value="01:00 AM – 09:00 AM">01:00 AM – 09:00 AM</option>
                    <option value="—">শিডিউল নেই (—)</option>
                  </select>
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
                  সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT ADMIN                                      */}
      {/* ========================================================= */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#1e293b] text-white p-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">অ্যাডমিন তথ্য সম্পাদনা</h3>
              <button onClick={() => setEditingAdmin(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">নাম *</label>
                <input
                  type="text"
                  required
                  value={editingAdmin.name}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">মোবাইল নাম্বার *</label>
                <input
                  type="tel"
                  required
                  value={editingAdmin.number}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, number: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">রোল</label>
                  <select
                    value={editingAdmin.role}
                    onChange={(e) =>
                      setEditingAdmin({ ...editingAdmin, role: e.target.value as any })
                    }
                    className="w-full px-2.5 py-2 border border-slate-300 rounded focus:outline-none"
                  >
                    <option value="admin">admin</option>
                    <option value="employee">employee</option>
                    <option value="manager">manager</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">স্ট্যাটাস</label>
                  <select
                    value={editingAdmin.status}
                    onChange={(e) =>
                      setEditingAdmin({ ...editingAdmin, status: e.target.value as any })
                    }
                    className="w-full px-2.5 py-2 border border-slate-300 rounded focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
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
