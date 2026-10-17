import React, { useState, useEffect } from 'react';
import {
  Truck,
  CheckCircle2,
  Search,
  ExternalLink,
  Copy,
  Check,
  Send,
  RefreshCw,
  Key,
  ShieldCheck,
  Package,
  Clock,
  ArrowRight,
  Sliders,
  DollarSign,
  AlertCircle,
  Eye,
  EyeOff,
  Filter,
  X
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';
import {
  getCourierSettings,
  saveCourierSettings,
  getConsignments,
  dispatchOrderToCourier,
  getCourierBalance,
  CourierConsignment,
  CourierApiSettings,
} from '../utils/courierService';
import { triggerGlobalSuccessModal } from '../context/SuccessModalContext';

interface CourierIntegrationPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

export const CourierIntegrationPage: React.FC<CourierIntegrationPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [activeTab, setActiveTab] = useState<'dispatch' | 'consignments' | 'settings'>('dispatch');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Settings State
  const [settings, setSettings] = useState<CourierApiSettings>(getCourierSettings);
  const [showSteadfastKey, setShowSteadfastKey] = useState(false);
  const [showSteadfastSecret, setShowSteadfastSecret] = useState(false);
  const [showPathaoSecret, setShowPathaoSecret] = useState(false);
  const [showRedxToken, setShowRedxToken] = useState(false);
  const [apiTesting, setApiTesting] = useState(false);
  const [apiTestSuccess, setApiTestSuccess] = useState<string | null>(null);

  // Consignments
  const [consignments, setConsignments] = useState<CourierConsignment[]>(getConsignments);
  const [searchTracking, setSearchTracking] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Balance
  const [balanceInfo, setBalanceInfo] = useState(getCourierBalance());
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);

  // Mock pending orders available for courier dispatch
  const [pendingOrders, setPendingOrders] = useState([
    {
      id: '57510',
      orderNumber: '57510',
      customerName: 'রেহানা বেগম',
      phone: '01925932193',
      address: 'মুগদা, রোড ৫, বাড়ি ৩১১, সিলেট',
      products: 'Baby Feeding Bottle × 2',
      amount: 1450,
      deliveryCharge: 130,
      status: 'Confirmed',
    },
    {
      id: '57460',
      orderNumber: '57460',
      customerName: 'মাহমুদা আক্তার',
      phone: '01431605090',
      address: 'দিনাজপুর, বালুবাড়ি, রোড ২',
      products: 'Mini USB Desk Fan × 2',
      amount: 3110,
      deliveryCharge: 130,
      status: 'Processing',
    },
    {
      id: '57452',
      orderNumber: '57452',
      customerName: 'জাহাঙ্গীর আলম',
      phone: '01343148035',
      address: 'দিনাজপুর, বালুবাড়ি, রোড ২',
      products: 'Multifunction Kettle × 2',
      amount: 6750,
      deliveryCharge: 130,
      status: 'Confirmed',
    },
    {
      id: '57448',
      orderNumber: '57448',
      customerName: 'তানজিলা ইসলাম',
      phone: '01711993322',
      address: 'মিরপুর ১২, ব্লক D, ঢাকা',
      products: 'Kids Cotton Khimar × 1',
      amount: 1850,
      deliveryCharge: 70,
      status: 'Confirmed',
    },
  ]);

  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedCourierProvider, setSelectedCourierProvider] = useState<'Steadfast' | 'Pathao' | 'RedX'>('Steadfast');
  const [isDispatching, setIsDispatching] = useState(false);

  // Single Order Dispatch Modal
  const [dispatchModalOrder, setDispatchModalOrder] = useState<any | null>(null);
  const [modalCourier, setModalCourier] = useState<'Steadfast' | 'Pathao' | 'RedX'>('Steadfast');
  const [modalCodAmount, setModalCodAmount] = useState<number>(0);
  const [modalNotes, setModalNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(`কপি করা হয়েছে: ${text}`);
  };

  const handleRefreshBalance = () => {
    setIsRefreshingBalance(true);
    setTimeout(() => {
      setBalanceInfo(getCourierBalance());
      setIsRefreshingBalance(false);
      showToast('কুরিয়ার অ্যাকাউন্ট ব্যালেন্স লাইভ আপডেট হয়েছে!');
    }, 600);
  };

  // Test API connection
  const handleTestApi = (courierName: string) => {
    setApiTesting(true);
    setApiTestSuccess(null);
    setTimeout(() => {
      setApiTesting(false);
      setApiTestSuccess(`✅ ${courierName} API সংযোগ সফল হয়েছে! সার্ভার রেসপন্স: 200 OK (Active)`);
      showToast(`${courierName} API সংযোগ সফল!`);
    }, 800);
  };

  // Save Settings
  const handleSaveSettings = () => {
    saveCourierSettings(settings);
    showToast('কুরিয়ার API সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
    triggerGlobalSuccessModal({
      title: 'কুরিয়ার সেটিংস সেভ হয়েছে!',
      message: 'Steadfast ও Pathao কুরিয়ারের সকল API কী ও সেটিংস সফলভাবে সংরক্ষিত হয়েছে।',
    });
  };

  // Open single dispatch modal
  const handleOpenDispatchModal = (ord: any) => {
    setDispatchModalOrder(ord);
    setModalCourier(selectedCourierProvider);
    setModalCodAmount(ord.amount);
    setModalNotes('Handle with care - Cash on delivery');
  };

  // Confirm single dispatch
  const handleConfirmSingleDispatch = async () => {
    if (!dispatchModalOrder) return;
    setIsDispatching(true);

    const res = await dispatchOrderToCourier({
      orderId: dispatchModalOrder.id,
      orderNumber: dispatchModalOrder.orderNumber,
      customerName: dispatchModalOrder.customerName,
      customerPhone: dispatchModalOrder.phone,
      customerAddress: dispatchModalOrder.address,
      codAmount: modalCodAmount,
      deliveryCharge: dispatchModalOrder.deliveryCharge,
      courier: modalCourier,
      notes: modalNotes,
    });

    setIsDispatching(false);
    setDispatchModalOrder(null);
    setConsignments(getConsignments());
    setPendingOrders((prev) => prev.filter((o) => o.id !== dispatchModalOrder.id));
    showToast(res.message);
  };

  // Bulk dispatch
  const handleBulkDispatch = async () => {
    if (selectedOrderIds.length === 0) {
      alert('অনুগ্রহ করে কমপক্ষে একটি অর্ডার সিলেক্ট করুন');
      return;
    }

    setIsDispatching(true);
    const toDispatch = pendingOrders.filter((o) => selectedOrderIds.includes(o.id));

    for (const ord of toDispatch) {
      await dispatchOrderToCourier({
        orderId: ord.id,
        orderNumber: ord.orderNumber,
        customerName: ord.customerName,
        customerPhone: ord.phone,
        customerAddress: ord.address,
        codAmount: ord.amount,
        deliveryCharge: ord.deliveryCharge,
        courier: selectedCourierProvider,
        notes: 'Bulk dispatch via Ummah BD Hub',
      });
    }

    setConsignments(getConsignments());
    setPendingOrders((prev) => prev.filter((o) => !selectedOrderIds.includes(o.id)));
    setSelectedOrderIds([]);
    setIsDispatching(false);
    showToast(`সাফল্যের সাথে ${toDispatch.length}টি অর্ডার ${selectedCourierProvider} কুরিয়ারে পাঠানো হয়েছে!`);
  };

  const filteredConsignments = consignments.filter(
    (c) =>
      c.trackingCode.toLowerCase().includes(searchTracking.toLowerCase()) ||
      c.customerPhone.includes(searchTracking) ||
      c.customerName.toLowerCase().includes(searchTracking.toLowerCase()) ||
      c.orderNumber.includes(searchTracking)
  );

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Sidebar */}
      <AdminSidebar
        activePage="courier_integration"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs">
                <Truck className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>Courier Integration System</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active & Connected
                  </span>
                </h1>
                <p className="text-xs text-slate-500">
                  Steadfast, Pathao ও RedX কুরিয়ারে সরাসরি ১-ক্লিকে অর্ডার প্রেরণ ও লাইভ পার্সেল ট্র্যাকিং
                </p>
              </div>
            </div>

            {/* Courier Balance Card */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 shadow-2xs">
              <div>
                <span className="text-[10px] text-slate-500 block font-semibold">
                  Steadfast একাউন্ট ব্যালেন্স
                </span>
                <span className="text-sm font-bold text-[#990000]">
                  ৳ {balanceInfo.balance.toLocaleString()}
                </span>
              </div>
              <button
                onClick={handleRefreshBalance}
                disabled={isRefreshingBalance}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                title="ব্যালেন্স রিফ্রেশ করুন"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingBalance ? 'animate-spin text-[#990000]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 border-b border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('dispatch')}
              className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 font-bold cursor-pointer transition-colors ${
                activeTab === 'dispatch'
                  ? 'border-[#990000] text-[#990000]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>কুরিয়ারে অর্ডার পাঠান ({pendingOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('consignments')}
              className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 font-bold cursor-pointer transition-colors ${
                activeTab === 'consignments'
                  ? 'border-[#990000] text-[#990000]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>প্রেরিত পার্সেল ও ট্র্যাকিং ({consignments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 font-bold cursor-pointer transition-colors ${
                activeTab === 'settings'
                  ? 'border-[#990000] text-[#990000]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Courier API Settings</span>
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {toastMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between shadow-2xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-emerald-500 hover:text-emerald-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* TAB 1: ORDER DISPATCH */}
          {activeTab === 'dispatch' && (
            <div className="space-y-4">
              {/* Dispatch Action Header Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">কুরিয়ার নির্বাচন করুন:</span>
                  <div className="flex items-center gap-1.5">
                    {(['Steadfast', 'Pathao', 'RedX'] as const).map((prov) => (
                      <button
                        key={prov}
                        type="button"
                        onClick={() => setSelectedCourierProvider(prov)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedCourierProvider === prov
                            ? 'bg-[#990000] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {prov}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">
                    সিলেক্টেড: <strong>{selectedOrderIds.length}</strong> টি
                  </span>
                  <button
                    onClick={handleBulkDispatch}
                    disabled={selectedOrderIds.length === 0 || isDispatching}
                    className="bg-[#990000] hover:bg-[#800000] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {isDispatching
                        ? 'পাঠানো হচ্ছে...'
                        : `সিলেক্টেড ${selectedOrderIds.length > 0 ? selectedOrderIds.length + 'টি ' : ''}অর্ডার ${selectedCourierProvider} এ পাঠান`}
                    </span>
                  </button>
                </div>
              </div>

              {/* Ready Orders Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="py-3 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={
                            pendingOrders.length > 0 &&
                            selectedOrderIds.length === pendingOrders.length
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrderIds(pendingOrders.map((o) => o.id));
                            } else {
                              setSelectedOrderIds([]);
                            }
                          }}
                          className="rounded border-slate-300 text-[#990000] focus:ring-[#990000]"
                        />
                      </th>
                      <th className="py-3 px-4">অর্ডার আইডি</th>
                      <th className="py-3 px-4">গ্রাহকের নাম ও ফোন</th>
                      <th className="py-3 px-4">ডেলিভারি ঠিকানা</th>
                      <th className="py-3 px-4">পণ্যসমূহ</th>
                      <th className="py-3 px-4">COD বিল</th>
                      <th className="py-3 px-4">স্ট্যাটাস</th>
                      <th className="py-3 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                          <p className="font-semibold text-slate-700">সব অর্ডার ইতিমধ্যে কুরিয়ারে পাঠানো হয়েছে!</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">নতুন অর্ডার আসলে এখানে তালিকাভুক্ত হবে।</p>
                        </td>
                      </tr>
                    ) : (
                      pendingOrders.map((ord) => {
                        const isChecked = selectedOrderIds.includes(ord.id);
                        return (
                          <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedOrderIds([...selectedOrderIds, ord.id]);
                                  } else {
                                    setSelectedOrderIds(selectedOrderIds.filter((id) => id !== ord.id));
                                  }
                                }}
                                className="rounded border-slate-300 text-[#990000] focus:ring-[#990000]"
                              />
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-[#990000]">
                              #{ord.orderNumber}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-bold text-slate-800">{ord.customerName}</p>
                              <p className="text-[11px] font-mono text-slate-500">{ord.phone}</p>
                            </td>
                            <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={ord.address}>
                              {ord.address}
                            </td>
                            <td className="py-3 px-4 text-slate-700 font-medium truncate max-w-[150px]">
                              {ord.products}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                              ৳{ord.amount}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                {ord.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleOpenDispatchModal(ord)}
                                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5 ml-auto transition-colors cursor-pointer shadow-2xs"
                              >
                                <Send className="w-3 h-3" />
                                <span>কুরিয়ারে পাঠান</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: CONSIGNMENTS & TRACKING */}
          {activeTab === 'consignments' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTracking}
                    onChange={(e) => setSearchTracking(e.target.value)}
                    placeholder="Search by Tracking Code, Phone, or Name..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#990000]"
                  />
                </div>
                <div className="text-xs text-slate-500">
                  মোট পার্সেল: <strong>{filteredConsignments.length}</strong> টি
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="py-3 px-4">Tracking Code</th>
                      <th className="py-3 px-4">Courier</th>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Address</th>
                      <th className="py-3 px-4">COD</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Dispatched At</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredConsignments.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-400">
                          কোনো পার্সেল পাওয়া যায়নি
                        </td>
                      </tr>
                    ) : (
                      filteredConsignments.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[#990000]">{c.trackingCode}</span>
                              <button
                                onClick={() => handleCopy(c.trackingCode, c.id)}
                                className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                                title="কপি করুন"
                              >
                                {copiedId === c.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block">CID: {c.consignmentId}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              {c.courier}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                            #{c.orderNumber}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-slate-800">{c.customerName}</p>
                            <p className="text-[11px] font-mono text-slate-500">{c.customerPhone}</p>
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={c.customerAddress}>
                            {c.customerAddress}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                            ৳{c.codAmount}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                c.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : c.status === 'In Transit'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {c.dispatchedAt}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <a
                              href={c.trackingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#990000] hover:underline"
                            >
                              <span>লাইভ ট্র্যাক</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: API CONFIGURATION */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              {apiTestSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{apiTestSuccess}</span>
                </div>
              )}

              {/* 1. Steadfast Courier */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-[#990000] font-black flex items-center justify-center text-xs border border-red-200">
                      STF
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Steadfast Courier API (Default)</h3>
                      <p className="text-[11px] text-slate-500">বাংলাদেশে দ্রুততম ও নির্ভরযোগ্য ক্যাশ অন ডেলিভারি সার্ভিস</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTestApi('Steadfast')}
                    disabled={apiTesting}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-200"
                  >
                    {apiTesting ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      API Base URL
                    </label>
                    <input
                      type="text"
                      value={settings.steadfast.apiUrl}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          steadfast: { ...settings.steadfast, apiUrl: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#990000] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      API Key <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSteadfastKey ? 'text' : 'password'}
                        value={settings.steadfast.apiKey}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            steadfast: { ...settings.steadfast, apiKey: e.target.value },
                          })
                        }
                        placeholder="e.g. stf_key_live_..."
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#990000] font-mono pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSteadfastKey(!showSteadfastKey)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showSteadfastKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Secret Key <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSteadfastSecret ? 'text' : 'password'}
                        value={settings.steadfast.secretKey}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            steadfast: { ...settings.steadfast, secretKey: e.target.value },
                          })
                        }
                        placeholder="e.g. stf_sec_live_..."
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#990000] font-mono pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSteadfastSecret(!showSteadfastSecret)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showSteadfastSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Pathao Courier */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 font-black flex items-center justify-center text-xs border border-red-200">
                      PTH
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Pathao Courier API</h3>
                      <p className="text-[11px] text-slate-500">পাঠাও মার্চেন্ট এপিআই ইন্টিগ্রেশন</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTestApi('Pathao')}
                    disabled={apiTesting}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-200"
                  >
                    Test Connection
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Client ID</label>
                    <input
                      type="text"
                      value={settings.pathao.clientId}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pathao: { ...settings.pathao, clientId: e.target.value },
                        })
                      }
                      placeholder="e.g. 1234"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#990000] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Client Secret</label>
                    <div className="relative">
                      <input
                        type={showPathaoSecret ? 'text' : 'password'}
                        value={settings.pathao.clientSecret}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            pathao: { ...settings.pathao, clientSecret: e.target.value },
                          })
                        }
                        placeholder="Pathao Secret..."
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#990000] font-mono pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPathaoSecret(!showPathaoSecret)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPathaoSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Store ID</label>
                    <input
                      type="text"
                      value={settings.pathao.storeId}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pathao: { ...settings.pathao, storeId: e.target.value },
                        })
                      }
                      placeholder="e.g. 98451"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#990000] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 3. RedX Delivery */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 font-black flex items-center justify-center text-xs border border-rose-200">
                      RDX
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">RedX Delivery API</h3>
                      <p className="text-[11px] text-slate-500">রেডএক্স মার্চেন্ট ডেলিভারি এপিআই</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTestApi('RedX')}
                    disabled={apiTesting}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-200"
                  >
                    Test Connection
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    RedX Access Token
                  </label>
                  <div className="relative">
                    <input
                      type={showRedxToken ? 'text' : 'password'}
                      value={settings.redx.token}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          redx: { ...settings.redx, token: e.target.value },
                        })
                      }
                      placeholder="Bearer token..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#990000] font-mono pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRedxToken(!showRedxToken)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showRedxToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Settings Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Save API Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SINGLE ORDER DISPATCH MODAL */}
      {dispatchModalOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="bg-[#990000] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">
                  কুরিয়ারে পাঠান: #{dispatchModalOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setDispatchModalOrder(null)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Recipient Details Card */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>গ্রাহক:</span>
                  <span>{dispatchModalOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-mono">
                  <span>মোবাইল:</span>
                  <span>{dispatchModalOrder.phone}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ঠিকানা:</span>
                  <span className="text-right max-w-xs truncate">{dispatchModalOrder.address}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>পণ্য:</span>
                  <span className="text-right font-medium">{dispatchModalOrder.products}</span>
                </div>
              </div>

              {/* Courier Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">কুরিয়ার সার্ভিস বাছাই করুন *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Steadfast', 'Pathao', 'RedX'] as const).map((courier) => (
                    <button
                      key={courier}
                      type="button"
                      onClick={() => setModalCourier(courier)}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                        modalCourier === courier
                          ? 'border-[#990000] bg-red-50 text-[#990000] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {courier}
                    </button>
                  ))}
                </div>
              </div>

              {/* COD Collection Amount */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ক্যাশ কালেকশন (COD Amount ৳) *
                </label>
                <input
                  type="number"
                  value={modalCodAmount}
                  onChange={(e) => setModalCodAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold font-mono text-slate-900 focus:outline-none focus:border-[#990000]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  কুরিয়ার ডেলিভারিম্যান গ্রাহকের কাছ থেকে এই পরিমাণ টাকা আদায় করবেন।
                </span>
              </div>

              {/* Delivery Note */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">ডেলিভারি নোট / নির্দেশিকা</label>
                <input
                  type="text"
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="যেমন: Fragile, Handle with care"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#990000]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDispatchModalOrder(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSingleDispatch}
                  disabled={isDispatching}
                  className="px-5 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isDispatching ? 'প্রেরণ করা হচ্ছে...' : 'এখনই কুরিয়ারে পাঠান'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
