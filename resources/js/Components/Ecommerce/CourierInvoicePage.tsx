import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Truck,
  UploadCloud,
  ChevronDown,
  CheckCircle2,
  FileText,
  AlertCircle,
  Download,
  Trash2
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

interface CourierInvoicePageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

interface ParsedInvoiceItem {
  trackingId: string;
  orderId: string;
  customerName: string;
  codAmount: number;
  deliveryCharge: number;
  codFee: number;
  netPayable: number;
  status: 'Delivered' | 'Returned';
}

export const CourierInvoicePage: React.FC<CourierInvoicePageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [selectedCourier, setSelectedCourier] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedItems, setParsedItems] = useState<ParsedInvoiceItem[]>([]);

  const handleSimulateUpload = (fileName: string = 'SteadFast_Payment_Statement_Oct2026.xlsx') => {
    if (!selectedCourier) {
      alert('অনুগ্রহ করে প্রথমে কুরিয়ার নির্বাচন করুন (Select Courier)');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setUploadedFile(fileName);
      setParsedItems([
        {
          trackingId: 'ST-9837264',
          orderId: '#ORD-1001',
          customerName: 'Md Al Imran H',
          codAmount: 1200,
          deliveryCharge: 150,
          codFee: 12,
          netPayable: 1038,
          status: 'Delivered',
        },
        {
          trackingId: 'ST-9837299',
          orderId: '#ORD-1003',
          customerName: 'নাদিয়া ইয়াসমিন',
          codAmount: 1450,
          deliveryCharge: 80,
          codFee: 14,
          netPayable: 1356,
          status: 'Delivered',
        },
        {
          trackingId: 'ST-9837310',
          orderId: '#ORD-1008',
          customerName: 'শুভাশিস ঘোষ',
          codAmount: 500,
          deliveryCharge: 80,
          codFee: 5,
          netPayable: 415,
          status: 'Delivered',
        },
        {
          trackingId: 'ST-9837340',
          orderId: '#ORD-1012',
          customerName: 'জাহিদুল ইসলাম',
          codAmount: 0,
          deliveryCharge: 120,
          codFee: 0,
          netPayable: -120,
          status: 'Returned',
        },
      ]);
      setIsProcessing(false);
    }, 600);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSimulateUpload(e.target.files[0].name);
    }
  };

  const totalCollected = parsedItems.reduce((acc, i) => acc + i.codAmount, 0);
  const totalCharges = parsedItems.reduce((acc, i) => acc + i.deliveryCharge + i.codFee, 0);
  const totalNet = parsedItems.reduce((acc, i) => acc + i.netPayable, 0);

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="courier_invoice"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-6 max-w-5xl w-full mx-auto space-y-6">
          {/* Main Card matching Screenshot 4 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <FileSpreadsheet className="w-5 h-5 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">Courier Invoice</h2>
            </div>

            {/* Courier Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Courier <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Truck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <select
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 text-xs font-medium text-slate-800 border border-rose-300/90 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 appearance-none bg-white cursor-pointer shadow-2xs"
                >
                  <option value="">Select Courier</option>
                  <option value="SteadFast">SteadFast</option>
                  <option value="Pathao">Pathao</option>
                  <option value="Redx">Redx</option>
                  <option value="Carrybee">Carrybee</option>
                  <option value="Paperfly">Paperfly</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Upload Drag & Drop Zone matching Screenshot 4 */}
            <label className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50 relative">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-500 mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Click to upload an Excel file
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                .xlsx, .xls or .csv
              </p>

              {isProcessing && (
                <div className="mt-3 text-xs text-blue-600 font-semibold animate-pulse">
                  Processing and reconciling invoice statement...
                </div>
              )}
            </label>

            {/* Quick Demo Upload Button */}
            {!uploadedFile && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedCourier) setSelectedCourier('SteadFast');
                    setTimeout(() => handleSimulateUpload(), 100);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Load Sample SteadFast Invoice Statement (.xlsx)
                </button>
              </div>
            )}

            {/* Parsed Invoice Overview */}
            {uploadedFile && (
              <div className="space-y-6 pt-4 border-t border-slate-100 animate-in fade-in">
                {/* File Badge & Summary */}
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{uploadedFile}</h4>
                      <p className="text-[11px] text-slate-500">
                        Courier: {selectedCourier || 'SteadFast'} • {parsedItems.length} orders reconciled
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setParsedItems([]);
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-[11px] font-medium text-slate-500">Total COD Collected</p>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">৳ {totalCollected}</h3>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-[11px] font-medium text-slate-500">Courier Fees & Charges</p>
                    <h3 className="text-lg font-bold text-rose-600 mt-1">-৳ {totalCharges}</h3>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
                    <p className="text-[11px] font-bold text-emerald-800">Net Disbursed to Bank</p>
                    <h3 className="text-xl font-extrabold text-emerald-600 mt-1">৳ {totalNet}</h3>
                  </div>
                </div>

                {/* Detailed Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-semibold border-b border-slate-100">
                        <th className="py-2.5 px-3">TRACKING ID</th>
                        <th className="py-2.5 px-3">ORDER ID</th>
                        <th className="py-2.5 px-3">CUSTOMER</th>
                        <th className="py-2.5 px-3 text-right">COD</th>
                        <th className="py-2.5 px-3 text-right">DELIVERY FEE</th>
                        <th className="py-2.5 px-3 text-right">NET PAYABLE</th>
                        <th className="py-2.5 px-3 text-center">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-mono font-medium text-slate-700">{item.trackingId}</td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">{item.orderId}</td>
                          <td className="py-3 px-3 font-medium text-slate-800">{item.customerName}</td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900">৳ {item.codAmount}</td>
                          <td className="py-3 px-3 text-right text-rose-600">-৳ {item.deliveryCharge + item.codFee}</td>
                          <td className="py-3 px-3 text-right font-extrabold text-emerald-600">৳ {item.netPayable}</td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
