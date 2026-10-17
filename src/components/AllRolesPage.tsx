import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Hexagon,
  Shield,
  Check,
  X,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

export interface RoleItem {
  id: string;
  sl: number;
  name: string;
  permissionsCount: number;
  permissions: string[];
  createdAt: string;
  lastUpdate: string;
  isSystem?: boolean;
}

interface AllRolesPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

const AVAILABLE_PERMISSIONS: { group: string; permissions: string[] }[] = [
  {
    group: 'Orders Management',
    permissions: [
      'View Orders',
      'Create Order',
      'Edit Order',
      'Delete Order',
      'Change Order Status',
      'Print Invoice / Label',
      'Assign Courier',
      'Export Orders'
    ]
  },
  {
    group: 'Products & Inventory',
    permissions: [
      'View Products',
      'Create Product',
      'Edit Product',
      'Delete Product',
      'Manage Stock',
      'Manage Categories',
      'Manage Brands',
      'Manage Product Variants'
    ]
  },
  {
    group: 'User & Staff Management',
    permissions: [
      'View Admins',
      'Create Staff / Admin',
      'Edit Staff Permissions',
      'View Customers',
      'View Roles & Permissions'
    ]
  },
  {
    group: 'Reports & Analytics',
    permissions: [
      'View Sales Report',
      'View Employee Performance',
      'View Product Report',
      'View Customer Analytics',
      'Export Financial Data'
    ]
  },
  {
    group: 'Store & Courier Settings',
    permissions: [
      'Manage Courier APIs (Steadfast, Pathao)',
      'Manage Payment Methods',
      'Store Branding & Banners',
      'Manage SMS Gateway'
    ]
  }
];

export const AllRolesPage: React.FC<AllRolesPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial roles matching Screenshot 1
  const [rolesList, setRolesList] = useState<RoleItem[]>([
    {
      id: 'role-1',
      sl: 1,
      name: 'employee',
      permissionsCount: 2,
      permissions: ['View Orders', 'Change Order Status'],
      createdAt: 'September 18, 2026',
      lastUpdate: 'September 18, 2026',
      isSystem: true
    },
    {
      id: 'role-2',
      sl: 2,
      name: 'manager',
      permissionsCount: 46,
      permissions: AVAILABLE_PERMISSIONS.flatMap((g) => g.permissions).slice(0, 18),
      createdAt: 'September 18, 2026',
      lastUpdate: 'September 18, 2026',
      isSystem: true
    },
    {
      id: 'role-3',
      sl: 3,
      name: 'admin',
      permissionsCount: 56,
      permissions: AVAILABLE_PERMISSIONS.flatMap((g) => g.permissions),
      createdAt: 'September 18, 2026',
      lastUpdate: 'September 18, 2026',
      isSystem: true
    }
  ]);

  // Modal states
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter roles
  const filteredRoles = rolesList.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.permissionsCount.toString().includes(searchQuery)
  );

  const handleOpenEdit = (role: RoleItem) => {
    setEditingRole(role);
    setSelectedPermissions(role.permissions || []);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    setRolesList((prev) =>
      prev.map((r) =>
        r.id === editingRole.id
          ? {
              ...r,
              name: editingRole.name,
              permissions: selectedPermissions,
              permissionsCount: selectedPermissions.length,
              lastUpdate: 'Today'
            }
          : r
      )
    );
    showToast(`Role "${editingRole.name}" updated successfully!`);
    setEditingRole(null);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newRole: RoleItem = {
      id: `role-${Date.now()}`,
      sl: rolesList.length + 1,
      name: newRoleName.trim().toLowerCase(),
      permissionsCount: selectedPermissions.length,
      permissions: selectedPermissions,
      createdAt: 'Today',
      lastUpdate: 'Today'
    };

    setRolesList((prev) => [...prev, newRole]);
    showToast(`New role "${newRole.name}" created!`);
    setIsCreateModalOpen(false);
    setNewRoleName('');
    setSelectedPermissions([]);
  };

  const togglePermission = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="all_role"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Bar Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              All Roles
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {rolesList.length} Roles
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input matching Screenshot 1 */}
            <div className="relative w-64 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roles..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder-slate-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Create Role Button */}
            <button
              onClick={() => {
                setSelectedPermissions([]);
                setNewRoleName('');
                setIsCreateModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Role</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-w-7xl w-full">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-xs flex items-center justify-between shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">{toastMessage}</span>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="text-emerald-600 hover:text-emerald-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Table Container Card */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                {/* Dark Blue / Navy Header matching Screenshot 1 */}
                <thead>
                  <tr className="bg-[#1c336b] text-white font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 w-14">Sl.</th>
                    <th className="py-3 px-6">Role Name</th>
                    <th className="py-3 px-6">Permissions</th>
                    <th className="py-3 px-6">Created At</th>
                    <th className="py-3 px-6">Last Update</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRoles.map((role) => (
                    <tr
                      key={role.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Sl. */}
                      <td className="py-4 px-4 text-slate-500 font-medium">
                        {role.sl}
                      </td>

                      {/* Role Name with Red Hexagon Icon */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Hexagon className="w-3.5 h-3.5 text-red-500 fill-red-50" />
                          <span className="font-semibold text-slate-800 capitalize text-xs">
                            {role.name}
                          </span>
                        </div>
                      </td>

                      {/* Permissions Badge */}
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleOpenEdit(role)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#e0f2fe] text-[#0284c7] hover:bg-[#bae6fd] transition-colors cursor-pointer"
                        >
                          <Shield className="w-3 h-3 text-[#0284c7]" />
                          <span>{role.permissionsCount} permissions</span>
                        </button>
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-6 text-slate-600">
                        {role.createdAt}
                      </td>

                      {/* Last Update */}
                      <td className="py-4 px-6 text-slate-600">
                        {role.lastUpdate}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(role)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-blue-400 px-3 py-1 rounded-md transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredRoles.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No roles found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Edit Role Modal */}
        {editingRole && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Edit Role & Permissions: <span className="capitalize">{editingRole.name}</span>
                  </h3>
                </div>
                <button
                  onClick={() => setEditingRole(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={editingRole.name}
                    onChange={(e) =>
                      setEditingRole({ ...editingRole, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-slate-700">
                      Assigned Permissions ({selectedPermissions.length} selected)
                    </label>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPermissions(
                            AVAILABLE_PERMISSIONS.flatMap((g) => g.permissions)
                          )
                        }
                        className="text-blue-600 hover:underline"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => setSelectedPermissions([])}
                        className="text-slate-500 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                    {AVAILABLE_PERMISSIONS.map((group) => (
                      <div key={group.group} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                        <h4 className="text-xs font-bold text-slate-800 mb-2">
                          {group.group}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {group.permissions.map((perm) => {
                            const isChecked = selectedPermissions.includes(perm);
                            return (
                              <label
                                key={perm}
                                className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer transition-colors ${
                                  isChecked
                                    ? 'bg-blue-50/60 text-blue-900 font-medium'
                                    : 'hover:bg-slate-100 text-slate-600'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(perm)}
                                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                                />
                                <span className="truncate">{perm}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditingRole(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Role Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Create New Staff Role
                  </h3>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRole} className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Role Name (e.g. support, accountant, courier_manager)
                  </label>
                  <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Enter role title..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-slate-700">
                      Assign Permissions ({selectedPermissions.length} selected)
                    </label>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPermissions(
                            AVAILABLE_PERMISSIONS.flatMap((g) => g.permissions)
                          )
                        }
                        className="text-blue-600 hover:underline"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => setSelectedPermissions([])}
                        className="text-slate-500 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                    {AVAILABLE_PERMISSIONS.map((group) => (
                      <div key={group.group} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                        <h4 className="text-xs font-bold text-slate-800 mb-2">
                          {group.group}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {group.permissions.map((perm) => {
                            const isChecked = selectedPermissions.includes(perm);
                            return (
                              <label
                                key={perm}
                                className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer transition-colors ${
                                  isChecked
                                    ? 'bg-blue-50/60 text-blue-900 font-medium'
                                    : 'hover:bg-slate-100 text-slate-600'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(perm)}
                                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                                />
                                <span className="truncate">{perm}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                  >
                    Create Role
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
