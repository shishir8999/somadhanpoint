import React, { useState } from 'react';
import {
  Search,
  CreditCard,
  Activity,
  Truck,
  Calendar,
  ChevronDown,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  DollarSign,
  FileText,
  AlertCircle
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

interface CourierPaymentPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

interface PaymentRecord {
  id: string;
  sl: number;
  orderNumber: string;
  trackingCode: string;
  courier: string;
  customerName: string;
  customerPhone: string;
  collectedAmount: number;
  deliveryFee: number;
  codCharge: number;
  payableAmount: number;
  status: 'Pending' | 'Paid' | 'Disputed';
  date: string;
}

export const CourierPaymentPage: React.FC<CourierPaymentPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [orderQuery, setOrderQuery] = useState('');
  const [productQuery, setProductQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All Payment');
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [courierFilter, setCourierFilter] = useState('All Courier');
  const [timeFilter, setTimeFilter] = useState('All time');

  // Sample payment records matching the courier workflow
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([
    {
      id: 'pay-1',
      sl: 1,
      orderNumber: '#ORD-1001',
      trackingCode: 'ST-9837264',
      courier: 'SteadFast',
      customerName: 'Md Al Imran H',
      customerPhone: '01983858653',
      collectedAmount: 1200,
      deliveryFee: 150,
      codCharge: 12,
      payableAmount: 1038,
      status: 'Pending',
      date: 'Today',
    },
    {
      id: 'pay-2',
      sl: 2,
      orderNumber: '#ORD-1002',
      trackingCode: 'PTH-552418',
      courier: 'Pathao',
      customerName: 'Sojib Ahmed',
      customerPhone: '01762691586',
      collectedAmount: 730,
      deliveryFee: 80,
      codCharge: 7,
      payableAmount: 643,
      status: 'Pending',
      date: 'Today',
    },
    {
      id: 'pay-3',
      sl: 3,
      orderNumber: '#ORD-1003',
      trackingCode: 'ST-9837299',
      courier: 'SteadFast',
      customerName: 'নাদিয়া ইয়াসমিন',
      customerPhone: '01465135670',
      collectedAmount: 1450,
      deliveryFee: 80,
      codCharge: 14,
      payableAmount: 1356,
      status: 'Paid',
      date: 'Yesterday',
    },
  ]);

  // Filtering records based on 6 top filters
  const filteredRecords = paymentRecords.filter((record) => {
    // Order query
    if (orderQuery && !record.orderNumber.toLowerCase().includes(orderQuery.toLowerCase()) && !record.trackingCode.toLowerCase().includes(orderQuery.toLowerCase()) && !record.customerName.toLowerCase().includes(orderQuery.toLowerCase())) {
      return false;
    }
    // Status filter
    if (statusFilter !== 'All Status' && record.status !== statusFilter) {
      return false;
    }
    // Courier filter
    if (courierFilter !== 'All Courier' && record.courier !== courierFilter) {
      return false;
    }
    return true;
  });

  const handleMarkAsPaid = (id: string) => {
    setPaymentRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Paid' } : r))
    );
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="courier_payment"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Filter Bar matching Screenshot 3 */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {/* 1. Search orders */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* 2. Search products */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-rose-300/80 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500 focus:border-red-500 text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* 3. All Payment */}
            <div className="relative">
              <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-700 font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="All Payment">All Payment</option>
                <option value="COD">Cash on Delivery</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* 4. Pending */}
            <div className="relative">
              <Activity className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs border border-rose-300/80 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500 text-slate-800 font-semibold appearance-none bg-white cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Disputed">Disputed</option>
                <option value="All Status">All Status</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* 5. All Courier */}
            <div className="relative">
              <Truck className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <select
                value={courierFilter}
                onChange={(e) => setCourierFilter(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-700 font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="All Courier">All Courier</option>
                <option value="SteadFast">SteadFast</option>
                <option value="Pathao">Pathao</option>
                <option value="Redx">Redx</option>
                <option value="Carrybee">Carrybee</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* 6. All time */}
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-700 font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="All time">All time</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-w-7xl w-full space-y-6">
          {/* If no matching orders found (Matches Screenshot 3 empty state) */}
          {filteredRecords.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs py-16 text-center">
              <p className="text-xs text-slate-400 font-medium">No orders found</p>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setOrderQuery('');
                    setProductQuery('');
                    setStatusFilter('All Status');
                    setCourierFilter('All Courier');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Reset filters to view demo payments
                </button>
              </div>
            </div>
          ) : (
            /* Courier Payment Reconciliation Table */
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800">
                    Courier Payment Reconciliation ({filteredRecords.length} orders)
                  </h3>
                </div>
                <button
                  onClick={() => alert('Exporting Payment Sheet CSV...')}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Sheet
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-semibold border-b border-slate-100">
                      <th className="py-2.5 px-3">SL.</th>
                      <th className="py-2.5 px-3">ORDER / TRACKING</th>
                      <th className="py-2.5 px-3">COURIER</th>
                      <th className="py-2.5 px-3">CUSTOMER</th>
                      <th className="py-2.5 px-3 text-right">COLLECTED</th>
                      <th className="py-2.5 px-3 text-right">DELIVERY FEE</th>
                      <th className="py-2.5 px-3 text-right">COD FEE</th>
                      <th className="py-2.5 px-3 text-right">NET PAYABLE</th>
                      <th className="py-2.5 px-3 text-center">STATUS</th>
                      <th className="py-2.5 px-3 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3 text-slate-400">{item.sl}</td>
                        <td className="py-3 px-3">
                          <p className="font-mono font-bold text-slate-900">{item.orderNumber}</p>
                          <p className="text-[10px] font-mono text-slate-400">{item.trackingCode}</p>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">
                          {item.courier}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-800">{item.customerName}</p>
                          <p className="text-[10px] font-mono text-slate-400">{item.customerPhone}</p>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                          ৳ {item.collectedAmount}
                        </td>
                        <td className="py-3 px-3 text-right text-rose-600">
                          -৳ {item.deliveryFee}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-500">
                          -৳ {item.codCharge}
                        </td>
                        <td className="py-3 px-3 text-right font-extrabold text-emerald-600 text-sm">
                          ৳ {item.payableAmount}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {item.status === 'Pending' ? (
                            <button
                              onClick={() => handleMarkAsPaid(item.id)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                            >
                              Mark Paid
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">Reconciled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
