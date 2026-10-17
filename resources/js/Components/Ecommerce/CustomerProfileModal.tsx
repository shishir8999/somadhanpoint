import React from 'react';
import { X, User, Mail, Phone, Calendar, LogOut, Package, ShieldCheck, Heart } from 'lucide-react';
import { CustomerUser } from '../types';
import { useStoreSettings } from '../context/StoreSettingsContext';

interface CustomerProfileModalProps {
  user: CustomerUser | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onGoToOrders?: () => void;
  onGoToWishlist?: () => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onLogout,
  onGoToOrders,
  onGoToWishlist,
}) => {
  const { settings } = useStoreSettings();

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Banner with Avatar */}
        <div className="bg-gradient-to-r from-[#990000] to-rose-700 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          {/* User Avatar Circle */}
          <div className="w-16 h-16 rounded-full bg-white text-[#990000] flex items-center justify-center font-black text-2xl mx-auto shadow-lg border-2 border-white/50">
            {user.name ? user.name.charAt(0) : 'U'}
          </div>

          <h3 className="text-base font-bold mt-2.5 tracking-tight">{user.name}</h3>
          <p className="text-xs text-red-100 flex items-center justify-center gap-1 mt-0.5">
            <Mail className="w-3 h-3" />
            <span>{user.email}</span>
          </p>
        </div>

        {/* Profile Details List */}
        <div className="p-5 space-y-4">
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>মোবাইল নম্বর:</span>
              </span>
              <span className="font-bold text-slate-800 font-mono">{user.phone}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>নিবন্ধন তারিখ:</span>
              </span>
              <span className="font-medium text-slate-700 text-[11px]">{user.createdAt}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
              <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>অ্যাকাউন্ট স্ট্যাটাস:</span>
              </span>
              <span className="font-bold text-emerald-800 text-[11px]">ভেরিফাইড কাস্টমার</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {onGoToOrders && (
              <button
                type="button"
                onClick={() => {
                  onGoToOrders();
                  onClose();
                }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-700 hover:text-[#990000] text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <Package className="w-4 h-4 text-[#990000]" />
                <span>আমার অর্ডারসমূহ</span>
              </button>
            )}

            {onGoToWishlist && (
              <button
                type="button"
                onClick={() => {
                  onGoToWishlist();
                  onClose();
                }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-700 hover:text-[#990000] text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4 text-[#990000]" />
                <span>পছন্দের তালিকা</span>
              </button>
            )}
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
