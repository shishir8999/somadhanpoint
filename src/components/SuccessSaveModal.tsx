import React, { useEffect } from 'react';
import { CheckCircle2, Check, X, ExternalLink } from 'lucide-react';

interface SuccessSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  subMessage?: string;
  buttonText?: string;
  onViewSite?: () => void;
}

export const SuccessSaveModal: React.FC<SuccessSaveModalProps> = ({
  isOpen,
  onClose,
  title = 'সফলভাবে সংরক্ষিত হয়েছে!',
  message = 'আপনার সকল পরিবর্তন সফলভাবে সেভ করা হয়েছে এবং ওয়েবসাইটে তাৎক্ষণিকভাবে আপডেট কার্যকর হয়েছে।',
  subMessage,
  buttonText = 'ঠিক আছে (OK)',
  onViewSite,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7 text-center border border-slate-100 transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Success Icon */}
        <div className="mx-auto mb-5 relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-40"></div>
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-11 h-11 text-white stroke-[2.5]" />
          </div>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>সফলভাবে সম্পন্ন হয়েছে</span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          {message}
        </p>

        {subMessage && (
          <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-5">
            {subMessage}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{buttonText}</span>
          </button>

          {onViewSite && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewSite();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-slate-500" />
              <span>ওয়েবসাইট দেখুন</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
