import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  FileText,
  Printer,
  Search,
  ArrowLeft,
  Trash2,
  Tag,
  CreditCard,
  AlertCircle,
  Package,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Send,
  X
} from 'lucide-react';
import { Product, Order, CartItem } from '../types';
import { ProductVisual } from './ProductVisual';
import { FLASH_SALE_PRODUCTS, HOT_DEALS_PRODUCTS } from '../data/products';
import { useStoreSettings } from '../context/StoreSettingsContext';
import {
  getOrderSettings,
  checkDuplicateOrder,
  recordOrderTimestamp,
  checkCourierRisk,
  detectVpnConnection,
  dispatchOrderConfirmationSms,
  BD_DISTRICTS,
  OrderSettings,
} from '../utils/orderSettings';

interface OrderCheckoutPageProps {
  cartItems: CartItem[];
  orders: Order[];
  onBackToHome: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onOrderSuccess: (order: Order) => void;
  onGoToAdminOrders?: () => void;
  initialSelectedProduct?: Product | null;
  initialTab?: 'checkout' | 'tracking';
}

export const OrderCheckoutPage: React.FC<OrderCheckoutPageProps> = ({
  cartItems,
  orders,
  onBackToHome,
  onUpdateQuantity,
  onRemoveItem,
  onOrderSuccess,
  onGoToAdminOrders,
  initialSelectedProduct,
  initialTab = 'checkout',
}) => {
  // Tabs: 'checkout' | 'tracking'
  const [activeTab, setActiveTab] = useState<'checkout' | 'tracking'>(initialTab);

  // Sync activeTab when initialTab prop updates
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const { settings } = useStoreSettings();
  const [orderSettings, setOrderSettings] = useState<OrderSettings>(getOrderSettings);

  // Sync settings when updated in admin
  useEffect(() => {
    const handleSync = () => {
      setOrderSettings(getOrderSettings());
    };
    window.addEventListener('order_settings_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('order_settings_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Checkout form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [district, setDistrict] = useState('ঢাকা');
  const [upazila, setUpazila] = useState('মিরপুর');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside_dhaka'>('dhaka');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');

  // Security & Verification States
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [sentOtp, setSentOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [smsSentToast, setSmsSentToast] = useState<string | null>(null);
  
  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Status & tracking states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [trackingQuery, setTrackingQuery] = useState('');
  const [selectedTrackOrder, setSelectedTrackOrder] = useState<Order | null>(null);

  // If cart is empty and an initialSelectedProduct was passed or default fallback
  const fallbackProduct = initialSelectedProduct || FLASH_SALE_PRODUCTS[6];
  const activeItems: CartItem[] = cartItems.length > 0 ? cartItems : [
    {
      id: `default-${fallbackProduct.id}`,
      product: fallbackProduct,
      quantity: 1,
      unitPrice: fallbackProduct.currentPrice,
    }
  ];

  // Price calculations
  const subtotal = activeItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const hasFreeDelivery = activeItems.some((item) => item.product.badge === 'ডেলিভারি ফ্রি');
  const deliveryFee = hasFreeDelivery ? 0 : deliveryArea === 'dhaka' ? 70 : 130;
  const total = Math.max(0, subtotal + deliveryFee - appliedDiscount);

  // Coupon handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode === 'EID50' || cleanCode === 'DISCOUNT50') {
      setAppliedDiscount(50);
      setCouponSuccess('৫০ টাকা ডিসকাউন্ট কুপন সফলভাবে যুক্ত হয়েছে!');
      setCouponError('');
    } else if (cleanCode === 'FREE100' || cleanCode === 'WELCOME100') {
      setAppliedDiscount(100);
      setCouponSuccess('১০০ টাকা স্পেশাল ডিসকাউন্ট যুক্ত হয়েছে!');
      setCouponError('');
    } else {
      setCouponError('কুপন কোডটি সঠিক নয়। (ট্রাই করুন: EID50 বা WELCOME100)');
      setCouponSuccess('');
    }
  };

  // Submit order with 100% active security checks
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityAlert(null);

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('দয়া করে আপনার নাম, মোবাইল নাম্বার এবং পূর্ণ ঠিকানা প্রদান করুন।');
      return;
    }

    if (customerPhone.trim().length < 11) {
      alert('দয়া করে সঠিক ১১ ডিজিটের মোবাইল নাম্বার লিখুন (যেমন: 017XXXXXXXX)।');
      return;
    }

    // Rule 1: VPN Protection Check
    if (orderSettings.vpnProtection) {
      const vpn = detectVpnConnection();
      if (vpn.isVpn) {
        setSecurityAlert(`⚠️ VPN Protection Alert: ${vpn.reason || 'VPN সক্রিয় সনাক্ত হয়েছে।'} ফেক অর্ডার এড়াতে VPN চালু অবস্থায় অর্ডার গ্রহণযোগ্য নয়। অনুগ্রহ করে VPN বন্ধ করে পেজটি রিফ্রেশ করুন।`);
        return;
      }
    }

    // Rule 2: Duplicate Order Block Check
    if (orderSettings.duplicateOrderBlock) {
      const blockMinutes = parseInt(orderSettings.orderBlockTime || '15', 10);
      const dup = checkDuplicateOrder(customerPhone, blockMinutes);
      if (dup.blocked) {
        setSecurityAlert(`⚠️ Duplicate Order Block: আপনি মাত্রই একটি অর্ডার করেছেন। অতিরিক্ত অর্ডার এড়াতে আগামী ${dup.remainingMinutes} মিনিট এই নম্বর থেকে আর অর্ডার করা যাবে না।`);
        return;
      }
    }

    // Rule 3: Courier Protection & Success Ratio Check
    if (orderSettings.courierProtection) {
      const threshold = parseInt(orderSettings.successRatio || '60', 10);
      const risk = checkCourierRisk(customerPhone, threshold);
      if (risk.atRisk) {
        setSecurityAlert(`⚠️ Courier Protection: কুরিয়ার ডাটাবেজ অনুযায়ী এই নম্বরে পার্সেল ডেলিভারি সাকসেস রেশিও মাত্র ${risk.ratio}% (যা গ্রহণযোগ্য ${threshold}% এর কম)। ফেক অর্ডার এড়াতে ক্যাশ অন ডেলিভারি স্থগিত রাখা হয়েছে। অনুগ্রহ করে বিকাশ বা নগদ সিলেক্ট করে অগ্রিম ডেলিভারি চার্জ দিয়ে অর্ডার নিশ্চিত করুন।`);
        return;
      }
    }

    // Rule 4: Mobile Number OTP Verification Check
    if (orderSettings.mobileVerification) {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setSentOtp(code);
      setEnteredOtp('');
      setOtpError('');
      setIsOtpModalOpen(true);
      return;
    }

    // Direct Order Finalize
    executeFinalOrder();
  };

  const executeFinalOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
      const addressString = orderSettings.locationFields
        ? `${district}, ${upazila} - ${customerAddress.trim()}${altPhone ? ` (বিকল্প নম্বর: ${altPhone})` : ''}`
        : `${district} - ${customerAddress.trim()}${altPhone ? ` (বিকল্প নম্বর: ${altPhone})` : ''}`;

      const newOrder: Order = {
        id: `EB-${orderNumber}`,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: addressString,
        deliveryArea,
        deliveryFee,
        paymentMethod,
        items: activeItems,
        subtotal,
        discount: appliedDiscount,
        total,
        status: 'Confirmed',
        courier: 'Steadfast Courier',
        courierTrackingCode: `STF-${orderNumber}`,
        notes: deliveryNotes.trim() || 'রেগুলার ডেলিভারি',
        createdAt: new Date().toLocaleDateString('bn-BD', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Record timestamp for duplicate protection
      recordOrderTimestamp(customerPhone);

      // Rule 5: Dispatch Automated Order Confirmation SMS
      if (orderSettings.orderConfirmationSms) {
        const sms = dispatchOrderConfirmationSms(newOrder, settings.siteName || 'Ummah BD');
        setSmsSentToast(sms.smsContent);
      }

      setConfirmedOrder(newOrder);
      onOrderSuccess(newOrder);
      setIsSubmitting(false);
      setIsOtpModalOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  // Filtered orders for tracking
  const searchResults = orders.filter((o) => {
    if (!trackingQuery.trim()) return true;
    const q = trackingQuery.toLowerCase().trim();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.customerName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-800 pb-16">
      {/* Top Header Strip */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToHome}
              className="text-xs font-bold text-slate-600 hover:text-[#990000] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>হোমপেজে ফিরে যান</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-[#990000]">
              {activeTab === 'tracking' ? 'অর্ডার ট্র্যাকিং ও ইতিহাস' : 'অর্ডার ও চেকআউট পেজ'}
            </span>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded border border-slate-200 text-xs font-bold">
              <button
                onClick={() => {
                  setActiveTab('checkout');
                  setSelectedTrackOrder(null);
                }}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeTab === 'checkout'
                    ? 'bg-[#990000] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                অর্ডার চেকআউট
              </button>
              <button
                onClick={() => setActiveTab('tracking')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'tracking'
                    ? 'bg-[#990000] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>অর্ডার ট্র্যাকিং ({orders.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* ========================================================= */}
        {/* TAB 1: ORDER CHECKOUT / CONFIRMATION VIEW                */}
        {/* ========================================================= */}
        {activeTab === 'checkout' && (
          <div>
            {confirmedOrder ? (
              /* Success / Invoice Receipt View */
              <div className="max-w-3xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 animate-in fade-in">
                <div className="text-center pb-6 border-b border-slate-200">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 mb-2">
                    অর্ডার সফলভাবে সম্পন্ন হয়েছে
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে
                  </h1>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    আমাদের কাস্টমার কেয়ার টিম শীঘ্রই আপনার মোবাইল নাম্বারে কল করে অর্ডারটি ভেরিফাই করবেন।
                  </p>
                </div>

                {/* Tracking Code and Live Progress */}
                <div className="my-6 bg-red-50/50 border border-red-100 rounded-lg p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-100 pb-3">
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold">অর্ডার আইডি নাম্বার:</span>
                      <p className="text-lg font-black text-[#990000]">{confirmedOrder.id}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold">কুরিয়ার ট্র্যাকিং কোড:</span>
                      <p className="text-sm font-bold text-slate-800">{confirmedOrder.courierTrackingCode} ({confirmedOrder.courier})</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold">অর্ডারের সময়:</span>
                      <p className="text-xs font-medium text-slate-700">{confirmedOrder.createdAt}</p>
                    </div>
                  </div>

                  {/* 4-Step Progress Tracker */}
                  <div className="pt-4">
                    <p className="text-xs font-bold text-slate-700 mb-3">লাইভ অর্ডার স্ট্যাটাস ট্র্যাকার:</p>
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-[#990000] text-white flex items-center justify-center font-bold mb-1 shadow-xs">
                          ✓
                        </div>
                        <span className="font-bold text-[#990000]">অর্ডার গৃহীত</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold mb-1 shadow-xs animate-pulse">
                          2
                        </div>
                        <span className="font-bold text-amber-700">কনফার্মেশন</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold mb-1">
                          3
                        </div>
                        <span className="text-slate-500">কুরিয়ারে হস্তান্তর</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold mb-1">
                          4
                        </div>
                        <span className="text-slate-500">ডেলিভারি সম্পন্ন</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Printable Invoice Details */}
                <div id="printable-invoice" className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded border border-slate-200">
                    <div>
                      <h4 className="font-bold text-slate-900 border-b pb-1 mb-2">গ্রাহকের তথ্য ও ঠিকানা:</h4>
                      <p className="text-slate-700 font-semibold">{confirmedOrder.customerName}</p>
                      <p className="text-slate-600">মোবাইল: {confirmedOrder.customerPhone}</p>
                      <p className="text-slate-600 mt-1 leading-relaxed">{confirmedOrder.customerAddress}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 border-b pb-1 mb-2">পেমেন্ট ও শিপিং তথ্য:</h4>
                      <p className="text-slate-700">পেমেন্ট মেথড: <span className="font-bold uppercase text-[#990000]">{confirmedOrder.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : confirmedOrder.paymentMethod}</span></p>
                      <p className="text-slate-700">ডেলিভারি এলাকা: <span className="font-semibold">{confirmedOrder.deliveryArea === 'dhaka' ? 'ঢাকার ভিতরে (২৪-৪৮ ঘণ্টা)' : 'ঢাকার বাইরে (৪৮-৭২ ঘণ্টা)'}</span></p>
                      <p className="text-slate-600 mt-1">বিশেষ নোট: {confirmedOrder.notes || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Order items table */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">অর্ডারকৃত পণ্যসমূহ:</h4>
                    <div className="border border-slate-200 rounded overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-2.5">পণ্য</th>
                            <th className="p-2.5 text-center">পরিমাণ</th>
                            <th className="p-2.5 text-right">মূল্য</th>
                            <th className="p-2.5 text-right">মোট</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {confirmedOrder.items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                              <td className="p-2.5 flex items-center gap-2">
                                <div className="w-8 h-8 rounded border border-slate-200 bg-white shrink-0 overflow-hidden flex items-center justify-center p-0.5">
                                  {item.selectedImage ? (
                                    <img src={item.selectedImage} alt={item.product.name} className="w-full h-full object-contain" />
                                  ) : (
                                    <ProductVisual visualType={item.product.visualType} name={item.product.name} color={item.selectedColor} />
                                  )}
                                </div>
                                <div>
                                  <span className="font-medium text-slate-800 block">{item.product.name}</span>
                                  {(item.selectedColor || item.selectedSize) && (
                                    <span className="text-[10px] text-slate-500 block">
                                      {[item.selectedColor && `কালার: ${item.selectedColor}`, item.selectedSize && `সাইজ: ${item.selectedSize}`].filter(Boolean).join(' | ')}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                              <td className="p-2.5 text-right text-slate-600">৳{item.unitPrice}</td>
                              <td className="p-2.5 text-right font-bold text-slate-900">৳{item.unitPrice * item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bill Summary */}
                  <div className="bg-slate-50 p-4 rounded border border-slate-200 max-w-sm ml-auto space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>সাবটোটাল:</span>
                      <span>৳{confirmedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>ডেলিভারি চার্জ:</span>
                      <span>৳{confirmedOrder.deliveryFee}</span>
                    </div>
                    {confirmedOrder.discount ? (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>ডিসকাউন্ট:</span>
                        <span>-৳{confirmedOrder.discount}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between text-slate-900 font-bold border-t border-slate-300 pt-2 text-sm">
                      <span>সর্বমোট প্রদেয় বিল:</span>
                      <span className="text-[#990000]">৳{confirmedOrder.total}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>ইনভয়েস প্রিন্ট করুন</span>
                    </button>
                    <a
                      href="tel:01982708789"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>হটলাইনে কল দিন (01982708789)</span>
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      setConfirmedOrder(null);
                      onBackToHome();
                    }}
                    className="px-6 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    আরও কেনাকাটা করুন
                  </button>
                </div>
              </div>
            ) : (
              /* Two-Column Checkout Form */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Customer and Shipping Information (7 Cols) */}
                <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-5 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 mb-5">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-[#990000] flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        ডেলিভারি ও কাস্টমার তথ্য
                      </h2>
                      <p className="text-xs text-slate-500">
                        সঠিক নাম, ঠিকানা ও সচল মোবাইল নাম্বার দিন যেন ডেলিভারি প্রতিনিধি সহজে যোগাযোগ করতে পারেন।
                      </p>
                    </div>
                  </div>

                  <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        আপনার পুরো নাম <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="যেমন: মোঃ সাকিব হোসেন"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:border-[#990000] bg-white text-slate-900"
                      />
                    </div>

                    {/* Phone Number Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          মোবাইল নাম্বার (১১ ডিজিট) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="017XXXXXXXX"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:border-[#990000] bg-white text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          বিকল্প মোবাইল নাম্বার (ঐচ্ছিক)
                        </label>
                        <input
                          type="tel"
                          value={altPhone}
                          onChange={(e) => setAltPhone(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:border-[#990000] bg-white text-slate-900"
                        />
                      </div>
                    </div>

                    {/* District & Location Fields */}
                    {orderSettings.locationFields ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                              জেলা নির্বাচন করুন <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={district}
                              onChange={(e) => {
                                const newDist = e.target.value;
                                setDistrict(newDist);
                                const upzList = BD_DISTRICTS[newDist] || [];
                                setUpazila(upzList[0] || '');
                                if (newDist === 'ঢাকা') {
                                  setDeliveryArea('dhaka');
                                } else {
                                  setDeliveryArea('outside_dhaka');
                                }
                              }}
                              className="w-full text-xs sm:text-sm px-3 py-2.5 border border-slate-300 rounded focus:outline-none focus:border-[#990000] bg-white text-slate-900"
                            >
                              {Object.keys(BD_DISTRICTS).map((d) => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                              উপজেলা / থানা নির্বাচন করুন <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={upazila}
                              onChange={(e) => setUpazila(e.target.value)}
                              className="w-full text-xs sm:text-sm px-3 py-2.5 border border-slate-300 rounded focus:outline-none focus:border-[#990000] bg-white text-slate-900"
                            >
                              {(BD_DISTRICTS[district] || ['সদর']).map((u) => (
                                <option key={u} value={u}>{u}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Automatic Delivery Zone badge */}
                        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium">নির্ধারিত ডেলিভারি চার্জ:</span>
                          <span className="font-bold text-[#990000]">
                            {district === 'ঢাকা' ? 'ঢাকার ভিতরে (৳৭০)' : 'ঢাকার বাইরে (৳১৩০)'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            জেলা নির্বাচন করুন <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={district}
                            onChange={(e) => {
                              setDistrict(e.target.value);
                              if (e.target.value === 'ঢাকা') {
                                setDeliveryArea('dhaka');
                              } else {
                                setDeliveryArea('outside_dhaka');
                              }
                            }}
                            className="w-full text-xs sm:text-sm px-3 py-2.5 border border-slate-300 rounded focus:outline-none focus:border-[#990000] bg-white text-slate-900"
                          >
                            <option value="ঢাকা">ঢাকা (Dhaka)</option>
                            <option value="চট্টগ্রাম">চট্টগ্রাম (Chittagong)</option>
                            <option value="সিলেট">সিলেট (Sylhet)</option>
                            <option value="রাজশাহী">রাজশাহী (Rajshahi)</option>
                            <option value="খুলনা">খুলনা (Khulna)</option>
                            <option value="বরিশাল">বরিশাল (Barisal)</option>
                            <option value="রংপুর">রংপুর (Rangpur)</option>
                            <option value="ময়মনসিংহ">ময়মনসিংহ (Mymensingh)</option>
                            <option value="গাজীপুর">গাজীপুর (Gazipur)</option>
                            <option value="নারায়ণগঞ্জ">নারায়ণগঞ্জ (Narayanganj)</option>
                            <option value="কুমিল্লা">কুমিল্লা (Cumilla)</option>
                            <option value="অন্যান্য">অন্যান্য জেলা</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            ডেলিভারি এরিয়া <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => setDeliveryArea('dhaka')}
                              className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                                deliveryArea === 'dhaka'
                                  ? 'border-[#990000] bg-red-50 text-[#990000] font-bold'
                                  : 'border-slate-300 text-slate-700 hover:border-slate-400'
                              }`}
                            >
                              <p className="font-bold">ঢাকার ভিতরে</p>
                              <p className="text-[10px] text-slate-500">
                                {hasFreeDelivery ? 'ডেলিভারি ফ্রি' : 'চার্জ ৳৭০'}
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeliveryArea('outside_dhaka')}
                              className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                                deliveryArea === 'outside_dhaka'
                                  ? 'border-[#990000] bg-red-50 text-[#990000] font-bold'
                                  : 'border-slate-300 text-slate-700 hover:border-slate-400'
                              }`}
                            >
                              <p className="font-bold">ঢাকার বাইরে</p>
                              <p className="text-[10px] text-slate-500">
                                {hasFreeDelivery ? 'ডেলিভারি ফ্রি' : 'চার্জ ৳১৩০'}
                              </p>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Full Address */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        সম্পূর্ণ ডেলিভারি ঠিকানা (বাসা/রোড/থানা/পোস্ট কোড) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="যেমন: বাড়ি #৪৫, রোড #০৭, সেক্টর #১১, উত্তরা, ঢাকা"
                        className="w-full text-xs sm:text-sm px-3.5 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000] bg-white text-slate-900"
                      />
                    </div>

                    {/* Delivery Notes */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        বিশেষ নির্দেশনা / নোট (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        placeholder="যেমন: অফিস টাইমে কল করবেন, বা গেটে রিসিভ করব"
                        className="w-full text-xs px-3.5 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000] bg-white text-slate-900"
                      />
                    </div>

                    {/* Payment Method Selector */}
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-slate-800 mb-2">
                        পেমেন্ট পদ্ধতি নির্বাচন করুন <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <label
                          className={`p-3 rounded border flex items-center gap-2.5 cursor-pointer transition-all ${
                            paymentMethod === 'cod'
                              ? 'border-[#990000] bg-red-50 ring-1 ring-[#990000]'
                              : 'border-slate-300 hover:border-slate-400 bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="text-[#990000] focus:ring-[#990000]"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">ক্যাশ অন ডেলিভারি</span>
                            <span className="text-[10px] text-slate-500 block">পণ্য হাতে পেয়ে টাকা দিন</span>
                          </div>
                        </label>

                        <label
                          className={`p-3 rounded border flex items-center gap-2.5 cursor-pointer transition-all ${
                            paymentMethod === 'bkash'
                              ? 'border-[#990000] bg-red-50 ring-1 ring-[#990000]'
                              : 'border-slate-300 hover:border-slate-400 bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'bkash'}
                            onChange={() => setPaymentMethod('bkash')}
                            className="text-[#990000] focus:ring-[#990000]"
                          />
                          <div>
                            <span className="text-xs font-bold text-pink-600 block">bKash (বিকাশ)</span>
                            <span className="text-[10px] text-slate-500 block">মার্চেন্ট পেমেন্ট</span>
                          </div>
                        </label>

                        <label
                          className={`p-3 rounded border flex items-center gap-2.5 cursor-pointer transition-all ${
                            paymentMethod === 'nagad'
                              ? 'border-[#990000] bg-red-50 ring-1 ring-[#990000]'
                              : 'border-slate-300 hover:border-slate-400 bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'nagad'}
                            onChange={() => setPaymentMethod('nagad')}
                            className="text-[#990000] focus:ring-[#990000]"
                          />
                          <div>
                            <span className="text-xs font-bold text-orange-600 block">Nagad (নগদ)</span>
                            <span className="text-[10px] text-slate-500 block">অনলাইন পে</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Right Column: Order Summary & Review (5 Cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white rounded-lg border border-slate-200 p-5 sm:p-6 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-[#990000]" />
                        <h3 className="text-sm font-bold text-slate-900">
                          অর্ডারের সারাংশ ({activeItems.reduce((acc, i) => acc + i.quantity, 0)} টি পণ্য)
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        নিরাপদ চেকআউট
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {activeItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded border border-slate-100 hover:border-slate-200 transition-colors"
                        >
                          <div className="w-14 h-14 rounded border border-slate-200 bg-slate-50 shrink-0 overflow-hidden flex items-center justify-center p-0.5">
                            {item.selectedImage ? (
                              <img src={item.selectedImage} alt={item.product.name} className="w-full h-full object-contain" />
                            ) : (
                              <ProductVisual visualType={item.product.visualType} name={item.product.name} color={item.selectedColor} />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate" title={item.product.name}>
                              {item.product.name}
                            </h4>
                            {(item.selectedColor || item.selectedSize) && (
                              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 my-0.5">
                                {item.selectedColor && (
                                  <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                                    {item.selectedColor}
                                  </span>
                                )}
                                {item.selectedSize && (
                                  <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-bold text-[#990000]">
                                    {item.selectedSize}
                                  </span>
                                )}
                              </div>
                            )}
                            <p className="text-[11px] text-slate-500 mt-0.5">৳{item.unitPrice} × {item.quantity}</p>

                            <div className="flex items-center gap-2 mt-1">
                              {/* Quantity Stepper */}
                              <div className="flex items-center border border-slate-300 rounded overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.id, -1)}
                                  className="w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-slate-100 cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-slate-800">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.id, 1)}
                                  className="w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-slate-100 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.id)}
                                className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                                title="পণ্য সরান"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-right font-bold text-xs text-[#990000] shrink-0">
                            ৳{item.unitPrice * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Coupon Input */}
                    <div className="pt-4 border-t border-slate-100 mt-4">
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="কুপন কোড (যেমন: EID50)"
                            className="w-full text-xs px-3 py-2 border border-slate-300 rounded uppercase font-semibold text-slate-800 focus:outline-none focus:border-[#990000]"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded transition-colors cursor-pointer"
                        >
                          প্রয়োগ
                        </button>
                      </form>
                      {couponSuccess && (
                        <p className="text-[11px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{couponSuccess}</span>
                        </p>
                      )}
                      {couponError && (
                        <p className="text-[11px] text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{couponError}</span>
                        </p>
                      )}
                    </div>

                    {/* Price Breakdown */}
                    <div className="pt-4 border-t border-slate-200 mt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>মোট পণ্যের মূল্য (Subtotal):</span>
                        <span className="font-semibold text-slate-800">৳{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>ডেলিভারি চার্জ:</span>
                        <span className="font-semibold text-slate-800">
                          {deliveryFee === 0 ? (
                            <span className="text-emerald-600 font-bold">ফ্রি (৳০)</span>
                          ) : (
                            `৳${deliveryFee}`
                          )}
                        </span>
                      </div>
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>কুপন ছাড় (Discount):</span>
                          <span>-৳{appliedDiscount}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-black text-slate-900 border-t border-slate-200 pt-2.5 text-base">
                        <span>সর্বমোট প্রদেয় বিল:</span>
                        <span className="text-[#990000]">৳{total}</span>
                      </div>
                    </div>

                    {/* Security Alert Banner (VPN / Duplicate / Courier Risk) */}
                    {securityAlert && (
                      <div className="mt-4 p-3.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs space-y-1.5 animate-in fade-in">
                        <div className="flex items-start gap-2">
                          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-bold text-rose-900">অর্ডার সুরক্ষায় সতর্কতা</h4>
                            <p className="leading-relaxed mt-0.5">{securityAlert}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Big Action Submit Button */}
                    <button
                      type="submit"
                      form="checkout-form"
                      disabled={isSubmitting}
                      className="w-full mt-5 py-3 rounded bg-[#990000] hover:bg-[#800000] text-white font-black text-sm uppercase tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <span>অর্ডার সম্পন্ন হচ্ছে...</span>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>অর্ডার কনফার্ম করুন (৳{total})</span>
                        </>
                      )}
                    </button>

                    {/* Guarantees */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-[10px] text-slate-500 text-center">
                      <div className="flex flex-col items-center">
                        <Truck className="w-4 h-4 text-[#990000] mb-1" />
                        <span>দ্রুত ডেলিভারি</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <ShieldCheck className="w-4 h-4 text-[#990000] mb-1" />
                        <span>১০০% আসল পণ্য</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <CreditCard className="w-4 h-4 text-[#990000] mb-1" />
                        <span>ক্যাশ অন ডেলিভারি</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ORDER TRACKING & CUSTOMER ORDER HISTORY           */}
        {/* ========================================================= */}
        {activeTab === 'tracking' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Search Box */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                আপনার অর্ডার ট্র্যাক ও ইতিহাস খুঁজুন
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                আপনার অর্ডার আইডি (যেমন: EB-123456) অথবা আপনার মোবাইল নাম্বার দিয়ে অনুসন্ধান করুন।
              </p>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={trackingQuery}
                    onChange={(e) => setTrackingQuery(e.target.value)}
                    placeholder="অর্ডার আইডি (EB-...) বা মোবাইল নাম্বার লিখুন..."
                    className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:border-[#990000] bg-white text-slate-900"
                  />
                </div>
                {trackingQuery && (
                  <button
                    onClick={() => setTrackingQuery('')}
                    className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 border border-slate-300 rounded"
                  >
                    রিসেট
                  </button>
                )}
              </div>
            </div>

            {/* If Single Order is Selected for Deep Dive */}
            {selectedTrackOrder ? (
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs animate-in fade-in">
                <button
                  onClick={() => setSelectedTrackOrder(null)}
                  className="text-xs font-bold text-[#990000] hover:underline flex items-center gap-1 mb-4 cursor-pointer"
                >
                  ← সকল অর্ডারে ফিরে যান
                </button>

                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-4">
                  <div>
                    <span className="text-xs text-slate-500">অর্ডার নম্বর:</span>
                    <h3 className="text-lg font-black text-slate-900">{selectedTrackOrder.id}</h3>
                    <p className="text-xs text-slate-500">{selectedTrackOrder.createdAt}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
                    {selectedTrackOrder.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded mb-4">
                  <div>
                    <p className="font-bold text-slate-800">গ্রাহকের নাম: {selectedTrackOrder.customerName}</p>
                    <p className="text-slate-600">মোবাইল: {selectedTrackOrder.customerPhone}</p>
                    <p className="text-slate-600 mt-1">ঠিকানা: {selectedTrackOrder.customerAddress}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">কুরিয়ার: {selectedTrackOrder.courier || 'Steadfast Courier'}</p>
                    <p className="text-slate-600">ট্র্যাকিং কোড: {selectedTrackOrder.courierTrackingCode || 'N/A'}</p>
                    <p className="text-slate-600 mt-1">পেমেন্ট মেথড: {selectedTrackOrder.paymentMethod.toUpperCase()}</p>
                  </div>
                </div>

                {/* Items */}
                <h4 className="text-xs font-bold text-slate-800 mb-2">অর্ডারকৃত আইটেম:</h4>
                <div className="space-y-2 mb-4">
                  {selectedTrackOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 border rounded text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded border bg-white overflow-hidden flex items-center justify-center p-0.5">
                          <ProductVisual visualType={item.product.visualType} name={item.product.name} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{item.product.name}</p>
                          <p className="text-[11px] text-slate-500">পরিমাণ: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#990000]">৳{item.unitPrice * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-black text-sm pt-3 border-t">
                  <span>সর্বমোট বিল:</span>
                  <span className="text-[#990000]">৳{selectedTrackOrder.total}</span>
                </div>
              </div>
            ) : (
              /* Orders List */
              <div className="space-y-3">
                {searchResults.length === 0 ? (
                  <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-slate-700">কোনো অর্ডার পাওয়া যায়নি</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      আপনি এখনও কোনো অর্ডার করেননি অথবা অনুসন্ধানে ভুল হয়েছে।
                    </p>
                    <button
                      onClick={() => setActiveTab('checkout')}
                      className="mt-4 px-4 py-2 bg-[#990000] text-white rounded text-xs font-bold hover:bg-[#800000]"
                    >
                      এখনই অর্ডার করুন
                    </button>
                  </div>
                ) : (
                  searchResults.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900">{order.id}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          গ্রাহক: <span className="font-semibold text-slate-800">{order.customerName}</span> ({order.customerPhone})
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {order.createdAt} • {order.items.length} টি পণ্য • কুরিয়ার: {order.courier || 'Steadfast'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-2 sm:pt-0">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">মোট বিল</span>
                          <span className="text-sm font-black text-[#990000]">৳{order.total}</span>
                        </div>
                        <button
                          onClick={() => setSelectedTrackOrder(order)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>বিস্তারিত</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rule: Mobile Number Verification OTP Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#990000] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <h3 className="text-sm font-bold">মোবাইল নাম্বার ভেরিফিকেশন (OTP)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOtpModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-600 leading-relaxed">
                  আপনার মোবাইল নম্বর <strong className="text-slate-900 font-mono">{customerPhone}</strong> এ ৪ ডিজিটের একটি ওটিপি কোড পাঠানো হয়েছে।
                </p>
                <div className="mt-2 inline-block bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono font-bold px-3 py-1 rounded-md">
                  [ভেরিফিকেশন কোড: {sentOtp}]
                </div>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={4}
                  autoFocus
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••"
                  className="w-full text-center text-2xl font-mono font-black tracking-widest py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-[#990000]"
                />
                {otpError && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold text-center">{otpError}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (enteredOtp.trim() === sentOtp) {
                    executeFinalOrder();
                  } else {
                    setOtpError('ভেরিফিকেশন কোডটি সঠিক নয়! পুনরায় চেক করুন।');
                  }
                }}
                className="w-full py-2.5 bg-[#990000] hover:bg-[#800000] text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                ভেরিফাই করে অর্ডার সম্পন্ন করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
