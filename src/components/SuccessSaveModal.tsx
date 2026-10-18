import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  subMessage?: string;
  buttonText?: string;
  onViewSite?: () => void;
}

/**
 * Lightweight, non-intrusive Corner Save Notification
 * Replaces the giant full-screen modal with a sleek top-right toast.
 */
export const SuccessSaveModal: React.FC<SuccessSaveModalProps> = ({
  isOpen,
  onClose,
  title = 'সফলভাবে সেভ হয়েছে!',
  message = 'আপনার সকল পরিবর্তন সফলভাবে সংরক্ষিত হয়েছে।',
  subMessage,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 sm:top-5 sm:right-5 z-50 max-w-sm w-[calc(100%-2rem)] sm:w-auto pointer-events-none animate-in slide-in-from-top-3 fade-in duration-200">
      <div className="pointer-events-auto bg-slate-900/95 text-white border border-emerald-500/40 rounded-xl shadow-2xl p-3 sm:p-3.5 flex items-center gap-3 backdrop-blur-md">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">
              {title || 'সফলভাবে সেভ হয়েছে!'}
            </h4>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-1 mt-0.5">
            {subMessage || message || 'ডাটাবেসে সফলভাবে সংরক্ষিত হয়েছে'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
