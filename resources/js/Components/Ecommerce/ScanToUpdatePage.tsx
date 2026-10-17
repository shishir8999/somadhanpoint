import React, { useState } from 'react';
import {
  Truck,
  RotateCcw,
  Barcode,
  ChevronDown,
  CheckCircle2,
  Clock,
  Package,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

interface ScanToUpdatePageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

interface ScannedRecord {
  id: string;
  orderNumber: string;
  courier: string;
  action: 'shipping' | 'return';
  timestamp: string;
  status: string;
}

export const ScanToUpdatePage: React.FC<ScanToUpdatePageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [activeTab, setActiveTab] = useState<'shipping' | 'return'>('shipping');
  const [selectedCourier, setSelectedCourier] = useState('SteadFast');
  const [orderInput, setOrderInput] = useState('');
  const [lastScanned, setLastScanned] = useState<ScannedRecord | null>(null);
  const [scannedHistory, setScannedHistory] = useState<ScannedRecord[]>([
    {
      id: 'scan-1',
      orderNumber: '#ORD-9841',
      courier: 'SteadFast',
      action: 'shipping',
      timestamp: '11:42 AM',
      status: 'In Transit / Shipped',
    },
    {
      id: 'scan-2',
      orderNumber: '#ORD-9840',
      courier: 'SteadFast',
      action: 'shipping',
      timestamp: '11:38 AM',
      status: 'In Transit / Shipped',
    },
  ]);

  const handleProcessScan = (orderNum: string) => {
    if (!orderNum.trim()) return;

    const newRecord: ScannedRecord = {
      id: `scan-${Date.now()}`,
      orderNumber: orderNum.trim().startsWith('#') ? orderNum.trim() : `#${orderNum.trim()}`,
      courier: selectedCourier,
      action: activeTab,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: activeTab === 'shipping' ? 'In Transit / Shipped' : 'Returned to Merchant',
    };

    setLastScanned(newRecord);
    setScannedHistory([newRecord, ...scannedHistory]);
    setOrderInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleProcessScan(orderInput);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="courier_scan"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Tabs matching Screenshot 2 */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-8 sticky top-0 z-10">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`flex items-center gap-2 py-2 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'shipping'
                ? 'text-[#990000] border-[#990000]'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Scan to Shipping</span>
          </button>

          <button
            onClick={() => setActiveTab('return')}
            className={`flex items-center gap-2 py-2 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'return'
                ? 'text-[#990000] border-[#990000]'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Scan to Return</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-w-4xl w-full mx-auto space-y-6">
          {/* Main Scanning Card matching Screenshot 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-8 space-y-6">
            {/* Courier Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Courier
              </label>
              <div className="relative">
                <Truck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <select
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 text-xs font-medium text-slate-800 border border-rose-300/90 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 appearance-none bg-white cursor-pointer shadow-2xs"
                >
                  <option value="SteadFast">SteadFast</option>
                  <option value="Pathao">Pathao</option>
                  <option value="Redx">Redx</option>
                  <option value="Carrybee">Carrybee</option>
                  <option value="Paperfly">Paperfly</option>
                  <option value="Sundarban">Sundarban Courier</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Order Number Input with Barcode Icon */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Order Number
              </label>
              <div className="relative">
                <Barcode className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={orderInput}
                  onChange={(e) => setOrderInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Scan barcode or type order number"
                  autoFocus
                  className="w-full pl-11 pr-4 py-2.5 text-xs text-slate-800 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Scan the invoice barcode — the scanner enters the order number and submits automatically.
              </p>
            </div>

            {/* Quick barcode simulation buttons */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium">Test Barcodes:</span>
              {['#ORD-1042', '#ORD-1043', '#ORD-1044', '#ORD-1045'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleProcessScan(code)}
                  className="px-2.5 py-1 text-[11px] font-mono font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Recent Scan Feedback Card */}
            {lastScanned && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-950">
                      Order {lastScanned.orderNumber} updated!
                    </h4>
                    <p className="text-[11px] text-emerald-700">
                      Dispatched with {lastScanned.courier} • Status: {lastScanned.status}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-600 font-mono">
                  {lastScanned.timestamp}
                </span>
              </div>
            )}
          </div>

          {/* Session Scanning History Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-800">
                  Scanned in this Session ({scannedHistory.length})
                </h3>
              </div>
              <button
                onClick={() => setScannedHistory([])}
                className="text-[11px] text-slate-400 hover:text-slate-600"
              >
                Clear History
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-semibold border-b border-slate-100">
                    <th className="py-2.5 px-4">ORDER NUMBER</th>
                    <th className="py-2.5 px-4">COURIER</th>
                    <th className="py-2.5 px-4">TYPE</th>
                    <th className="py-2.5 px-4">STATUS</th>
                    <th className="py-2.5 px-4 text-right">SCANNED AT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scannedHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {item.orderNumber}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {item.courier}
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-[11px] font-medium text-slate-600">
                          {item.action}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400 text-[11px]">
                        {item.timestamp}
                      </td>
                    </tr>
                  ))}

                  {scannedHistory.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No orders scanned in this session yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
