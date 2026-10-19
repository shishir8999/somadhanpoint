import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, ShieldCheck, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleHardReload = () => {
    try {
      // Clear potentially corrupted transient session items
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  private handleCleanReset = () => {
    try {
      localStorage.removeItem('ecom_admin_sidebar_collapsed');
      localStorage.removeItem('ecom_admin_dark_mode');
    } catch {}
    window.location.href = '/admin';
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 font-sans selection:bg-red-600">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-white tracking-tight">
                পৃষ্ঠাটি লোড হতে সমস্যা হয়েছে
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                ব্রাউজারের ক্যাশ অথবা পুরানো ডাটার কারণে সাময়িক ত্রুটি হতে পারে। নিচের বাটনে ক্লিক করে পুনরায় লোড করুন।
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-black/40 border border-slate-700/60 text-[11px] font-mono text-red-300 text-left overflow-x-auto max-h-24">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleHardReload}
                className="w-full py-2.5 px-4 rounded-xl bg-[#990000] hover:bg-[#b30000] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-900/30 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>পুনরায় লোড করুন</span>
              </button>

              <button
                type="button"
                onClick={this.handleCleanReset}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>অ্যাডমিন রিলোড</span>
              </button>
            </div>

            <button
              type="button"
              onClick={this.handleGoHome}
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto pt-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>মূল ওয়েবসাইটে ফিরে যান</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
