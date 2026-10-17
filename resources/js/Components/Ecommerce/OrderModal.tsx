import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, ShoppingBag, ShieldAlert, AlertCircle, Send } from 'lucide-react';
import { Product, Order, CartItem } from '../types';
import { ProductVisual } from './ProductVisual';
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

interface OrderModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  product,
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { settings } = useStoreSettings();
  const [orderSettings, setOrderSettings] = useState<OrderSettings>(getOrderSettings);

  useEffect(() => {
    const handleSync = () => setOrderSettings(getOrderSettings());
    window.addEventListener('order_settings_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('order_settings_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [district, setDistrict] = useState('ঢাকা');
  const [upazila, setUpazila] = useState('মিরপুর');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside_dhaka'>('dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Security & Verification States
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [sentOtp, setSentOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [smsSentToast, setSmsSentToast] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const deliveryFee = product.badge === 'ডেলিভারি ফ্রি' ? 0 : deliveryArea === 'dhaka' ? 70 : 130;
  const subtotal = product.currentPrice * quantity;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityAlert(null);

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('দয়া করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা লিখুন।');
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
        setSecurityAlert(`⚠️ Courier Protection: কুরিয়ার ডাটাবেজ অনুযায়ী এই নম্বরে পার্সেল ডেলিভারি সাকসেস রেশিও মাত্র ${risk.ratio}% (যা গ্রহণযোগ্য ${threshold}% এর কম)। ফেক অর্ডার এড়াতে ক্যাশ অন ডেলিভারি স্থগিত রাখা হয়েছে।`);
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

    executeFinalOrder();
  };

  const executeFinalOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = `EB-${Math.floor(100000 + Math.random() * 900000)}`;
      const cartItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity,
        unitPrice: product.currentPrice,
      };

      const addressString = orderSettings.locationFields
        ? `${district}, ${upazila} - ${customerAddress.trim()}`
        : customerAddress.trim();

      const newOrder: Order = {
        id: orderId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: addressString,
        deliveryArea,
        deliveryFee,
        paymentMethod,
        items: [cartItem],
        subtotal,
        total,
        status: 'Confirmed',
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
    }, 700);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.trim() !== sentOtp.trim()) {
      setOtpError('ভেরিফিকেশন কোডটি সঠিক নয়! অনুগ্রহ করে এসএমএস এ পাঠানো ৪ ডিজিটের কোডটি দিন।');
      return;
    }
    setOtpError('');
    executeFinalOrder();
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    setSecurityAlert(null);
    setIsOtpModalOpen(false);
    setSmsSentToast(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Header */}
        <div className="bg-[#990000] text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <h2 className="text-sm sm:text-base font-bold">
              {confirmedOrder ? 'অর্ডার সফল হয়েছে!' : 'অর্ডার ফর্ম (ক্যাশ অন ডেলিভারি)'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              আলহামদুলিল্লাহ! আপনার অর্ডারটি নিশ্চিত করা হয়েছে।
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              আমাদের কাস্টমার কেয়ার প্রতিনিধি শীঘ্রই আপনার নাম্বারে কল করে অর্ডারটি ভেরিফাই করবেন।
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-left text-xs space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between font-bold text-slate-800 border-b pb-1">
                <span>অর্ডার ট্র্যাকিং আইডি:</span>
                <span className="text-[#990000]">{confirmedOrder.id}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>গ্রাহক:</span>
                <span className="font-semibold text-slate-800">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>মোবাইল:</span>
                <span className="font-semibold text-slate-800">{confirmedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>পণ্য:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                  {product.name} (x{quantity})
                </span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold pt-1.5 border-t text-sm">
                <span>সর্বমোট বিল:</span>
                <span className="text-[#990000]">৳{confirmedOrder.total}</span>
              </div>
            </div>

            {smsSentToast && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center justify-center gap-2 max-w-sm mx-auto">
                <Send className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-medium text-[11px]">
                  আপনার নাম্বারে অর্ডার কনফার্মেশন SMS পাঠানো হয়েছে!
                </span>
              </div>
            )}

            <button
              onClick={handleClose}
              className="mt-3 px-6 py-2 rounded bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold transition-colors"
            >
              আরও কেনাকাটা করুন
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5">
            {/* Product Summary Row */}
            <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded border border-slate-200">
              <div className="w-14 h-14 bg-white rounded border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                <ProductVisual visualType={product.visualType} name={product.name} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold text-[#990000]">৳{product.currentPrice}</span>
                  {product.badge && (
                    <span className="text-[9px] bg-red-100 text-[#990000] font-bold px-1 rounded">
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>
              {/* Stepper */}
              <div className="flex items-center border border-slate-300 rounded shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-slate-200"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-slate-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Security Warning Box */}
            {securityAlert && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded p-3 text-xs text-amber-900 flex items-start gap-2.5 animate-in fade-in">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-amber-800 mb-0.5">অর্ডার নিরাপত্তা যাচাই সতর্কতা</p>
                  <p className="text-[11px] leading-relaxed">{securityAlert}</p>
                </div>
              </div>
            )}

            {/* Inputs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                আপনার নাম *
              </label>
              <input
                type="text"
                required
                placeholder="আপনার নাম লিখুন"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                মোবাইল নাম্বার *
              </label>
              <input
                type="tel"
                required
                placeholder="01XXXXXXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
              />
            </div>

            {/* Location Fields (District & Upazila if enabled) */}
            {orderSettings.locationFields && (
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    জেলা *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => {
                      const newDist = e.target.value;
                      setDistrict(newDist);
                      const defaultUp = BD_DISTRICTS[newDist]?.[0] || 'সদর';
                      setUpazila(defaultUp);
                      setDeliveryArea(newDist === 'ঢাকা' ? 'dhaka' : 'outside_dhaka');
                    }}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-[#990000]"
                  >
                    {Object.keys(BD_DISTRICTS).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    থানা / উপজেলা *
                  </label>
                  <select
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-[#990000]"
                  >
                    {(BD_DISTRICTS[district] || ['সদর']).map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                সম্পূর্ণ ঠিকানা (বাসা/রোড/থানা/জেলা) *
              </label>
              <textarea
                rows={2}
                required
                placeholder="আপনার বিস্তারিত ডেলিভারি ঠিকানা দিন"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
              />
            </div>

            {/* Delivery Area Options */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ডেলিভারি এরিয়া
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryArea('dhaka')}
                  className={`p-2 rounded border text-left transition-colors ${
                    deliveryArea === 'dhaka'
                      ? 'border-[#990000] bg-red-50 text-[#990000] font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <p className="font-semibold">ঢাকার ভিতরে</p>
                  <p className="text-[10px] text-slate-500">
                    {product.badge === 'ডেলিভারি ফ্রি' ? 'ডেলিভারি ফ্রি' : 'চার্জ ৳৭০'}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryArea('outside_dhaka')}
                  className={`p-2 rounded border text-left transition-colors ${
                    deliveryArea === 'outside_dhaka'
                      ? 'border-[#990000] bg-red-50 text-[#990000] font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <p className="font-semibold">ঢাকার বাইরে</p>
                  <p className="text-[10px] text-slate-500">
                    {product.badge === 'ডেলিভারি ফ্রি' ? 'ডেলিভারি ফ্রি' : 'চার্জ ৳১৩০'}
                  </p>
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>পণ্যের মূল্য:</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ডেলিভারি চার্জ:</span>
                <span>৳{deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t pt-1 text-sm">
                <span>সর্বমোট প্রদেয় বিল:</span>
                <span className="text-[#990000]">৳{total}</span>
              </div>
            </div>

            {/* Action buttons */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded bg-[#990000] hover:bg-[#800000] text-white font-bold text-xs sm:text-sm uppercase tracking-wide transition-colors shadow-md cursor-pointer"
            >
              {isSubmitting ? 'প্রসেসিং হচ্ছে...' : `অর্ডার নিশ্চিত করুন (৳${total})`}
            </button>
          </form>
        )}

        {/* OTP Verification Modal Overlay */}
        {isOtpModalOpen && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-lg p-5 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 text-[#990000] rounded-full flex items-center justify-center mx-auto">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">মোবাইল নম্বর যাচাইকরণ</h3>
                <p className="text-xs text-slate-500 mt-1">
                  আপনার মোবাইল নম্বর <strong className="text-slate-800">{customerPhone}</strong> এ একটি ৪ ডিজিটের ওটিপি (OTP) পাঠানো হয়েছে।
                </p>
              </div>

              {/* Development Simulation Pill */}
              <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800">
                <span className="font-semibold">টেস্টিং ডেমো ওটিপি কোড:</span>{' '}
                <span className="font-mono font-bold text-[#990000] tracking-widest text-sm bg-white px-2 py-0.5 rounded border border-amber-300">
                  {sentOtp}
                </span>
              </div>

              {otpError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-2 rounded flex items-center gap-1.5 justify-center">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <input
                  type="text"
                  maxLength={4}
                  autoFocus
                  placeholder="৪ ডিজিটের ওটিপি লিখুন"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-lg font-mono tracking-widest py-2 border-2 border-slate-300 rounded focus:border-[#990000] focus:outline-none"
                />

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsOtpModalOpen(false)}
                    className="flex-1 py-2 rounded border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                  >
                    বাতিল করুন
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 rounded bg-[#990000] text-white text-xs font-bold hover:bg-[#800000]"
                  >
                    {isSubmitting ? 'যাচাই হচ্ছে...' : 'ওটিপি ভেরিফাই'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
