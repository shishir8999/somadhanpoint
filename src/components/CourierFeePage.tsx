import React, { useState } from 'react';
import {
  Truck,
  Lock,
  Plus,
  Trash2,
  MapPin,
  Coins,
  Link,
  Key,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Save,
  CheckCircle2,
  X
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

interface CourierFeePageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  district: string;
}

export const CourierFeePage: React.FC<CourierFeePageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [isActive, setIsActive] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delivery Zones matching Screenshot 1
  const [zones, setZones] = useState<DeliveryZone[]>([
    {
      id: 'zone-1',
      name: 'ঢাকার বাইরে',
      fee: 150,
      district: 'All Districts',
    },
    {
      id: 'zone-2',
      name: 'ঢাকার ভিতরে',
      fee: 80,
      district: 'ঢাকা',
    },
  ]);

  // Accordion open states
  const [expandedCourier, setExpandedCourier] = useState<string>('steadfast');

  // SteadFast Credentials
  const [steadfastUrl, setSteadfastUrl] = useState('https://portal.packzy.com/api/v1');
  const [steadfastApiKey, setSteadfastApiKey] = useState('');
  const [steadfastSecretKey, setSteadfastSecretKey] = useState('');
  const [steadfastWebhook, setSteadfastWebhook] = useState('');
  const [showSteadfastKey, setShowSteadfastKey] = useState(false);
  const [showSteadfastSecret, setShowSteadfastSecret] = useState(false);
  const [showSteadfastWebhook, setShowSteadfastWebhook] = useState(false);

  // Pathao Credentials
  const [pathaoClientId, setPathaoClientId] = useState('');
  const [pathaoClientSecret, setPathaoClientSecret] = useState('');
  const [pathaoStoreId, setPathaoStoreId] = useState('');

  // Redx Credentials
  const [redxToken, setRedxToken] = useState('');

  // Carrybee Credentials
  const [carrybeeApiKey, setCarrybeeApiKey] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddZone = () => {
    const newZone: DeliveryZone = {
      id: `zone-${Date.now()}`,
      name: 'উপজেলা / সাব-ডিস্ট্রিক্ট',
      fee: 120,
      district: 'All Districts',
    };
    setZones([...zones, newZone]);
  };

  const handleDeleteZone = (id: string) => {
    if (zones.length <= 1) {
      alert('কমপক্ষে একটি ডেলিভারি জোন থাকতে হবে!');
      return;
    }
    setZones(zones.filter((z) => z.id !== id));
  };

  const handleUpdateZone = (id: string, field: keyof DeliveryZone, value: any) => {
    setZones(
      zones.map((z) => (z.id === id ? { ...z, [field]: value } : z))
    );
  };

  const handleSave = () => {
    // Save to localStorage or store config
    localStorage.setItem(
      'ecom_courier_settings',
      JSON.stringify({
        isActive,
        zones,
        steadfast: { url: steadfastUrl, apiKey: steadfastApiKey, secretKey: steadfastSecretKey },
        pathao: { clientId: pathaoClientId, storeId: pathaoStoreId },
      })
    );
    showToast('ডেলিভারি ফি ও কুরিয়ার সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="courier_fee"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-6 max-w-7xl w-full space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-xs flex items-center justify-between shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-emerald-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Section 1: Courier Delivery Box matching Screenshot 1 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5">
            {/* Header & Toggle */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">Courier Delivery</h2>
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">Active</span>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    isActive ? 'bg-[#990000]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Delivery Zones List */}
            <div className="space-y-4">
              {zones.map((zone) => (
                <div key={zone.id} className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Name Input */}
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Name
                    </label>
                    <div className="relative">
                      <Truck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={zone.name}
                        onChange={(e) => handleUpdateZone(zone.id, 'name', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-800 font-medium"
                      />
                    </div>
                  </div>

                  {/* Fee Input */}
                  <div className="w-full sm:w-48">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Fee
                    </label>
                    <div className="relative">
                      <Coins className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="number"
                        value={zone.fee}
                        onChange={(e) => handleUpdateZone(zone.id, 'fee', Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-800 font-bold"
                      />
                    </div>
                  </div>

                  {/* Districts Dropdown */}
                  <div className="w-full sm:w-56">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Districts
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <select
                        value={zone.district}
                        onChange={(e) => handleUpdateZone(zone.id, 'district', e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-xs border border-rose-300/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-800 font-medium appearance-none bg-white cursor-pointer"
                      >
                        <option value="All Districts">All Districts</option>
                        <option value="ঢাকা">ঢাকা</option>
                        <option value="চট্টগ্রাম">চট্টগ্রাম</option>
                        <option value="সিলেট">সিলেট</option>
                        <option value="রাজশাহী">রাজশাহী</option>
                        <option value="খুলনা">খুলনা</option>
                        <option value="বরিশাল">বরিশাল</option>
                        <option value="রংপুর">রংপুর</option>
                        <option value="ময়মনসিংহ">ময়মনসিংহ</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="sm:pt-5">
                    <button
                      type="button"
                      onClick={() => handleDeleteZone(zone.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Zone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* + Add Zone Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleAddZone}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer py-1.5 px-3 border border-dashed border-slate-300 rounded-lg hover:border-slate-400"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Zone</span>
              </button>
            </div>
          </div>

          {/* Section 2: API Credentials Box matching Screenshot 1 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Lock className="w-4 h-4 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">API Credentials</h2>
            </div>

            <div className="space-y-3">
              {/* Accordion 1: SteadFast */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedCourier(expandedCourier === 'steadfast' ? '' : 'steadfast')
                  }
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-bold text-slate-800 bg-slate-50/50 hover:bg-slate-100/60 transition-colors"
                >
                  <span>SteadFast</span>
                  {expandedCourier === 'steadfast' ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {expandedCourier === 'steadfast' && (
                  <div className="p-5 space-y-4 border-t border-slate-100 bg-white animate-in fade-in">
                    {/* URL */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        URL
                      </label>
                      <div className="relative">
                        <Link className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={steadfastUrl}
                          onChange={(e) => setSteadfastUrl(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-800 font-mono"
                        />
                      </div>
                    </div>

                    {/* API Key & Secret Key */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* API Key */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          API Key
                        </label>
                        <div className="relative">
                          <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type={showSteadfastKey ? 'text' : 'password'}
                            value={steadfastApiKey}
                            onChange={(e) => setSteadfastApiKey(e.target.value)}
                            placeholder="Enter API Key"
                            className="w-full pl-9 pr-9 py-2 text-xs border border-rose-300/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-800"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSteadfastKey(!showSteadfastKey)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showSteadfastKey ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Secret Key */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Secret Key
                        </label>
                        <div className="relative">
                          <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type={showSteadfastSecret ? 'text' : 'password'}
                            value={steadfastSecretKey}
                            onChange={(e) => setSteadfastSecretKey(e.target.value)}
                            placeholder="Enter Secret Key"
                            className="w-full pl-9 pr-9 py-2 text-xs border border-rose-300/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-800"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSteadfastSecret(!showSteadfastSecret)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showSteadfastSecret ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Webhook Token */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Webhook Token
                      </label>
                      <div className="relative">
                        <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type={showSteadfastWebhook ? 'text' : 'password'}
                          value={steadfastWebhook}
                          onChange={(e) => setSteadfastWebhook(e.target.value)}
                          placeholder="Enter Webhook Token"
                          className="w-full pl-9 pr-9 py-2 text-xs border border-rose-300/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSteadfastWebhook(!showSteadfastWebhook)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showSteadfastWebhook ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Pathao */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedCourier(expandedCourier === 'pathao' ? '' : 'pathao')
                  }
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-bold text-slate-800 bg-slate-50/50 hover:bg-slate-100/60 transition-colors"
                >
                  <span>Pathao</span>
                  {expandedCourier === 'pathao' ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {expandedCourier === 'pathao' && (
                  <div className="p-5 space-y-4 border-t border-slate-100 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Client ID
                        </label>
                        <input
                          type="text"
                          value={pathaoClientId}
                          onChange={(e) => setPathaoClientId(e.target.value)}
                          placeholder="Enter Pathao Client ID"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Client Secret
                        </label>
                        <input
                          type="password"
                          value={pathaoClientSecret}
                          onChange={(e) => setPathaoClientSecret(e.target.value)}
                          placeholder="Enter Pathao Secret"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Redx */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedCourier(expandedCourier === 'redx' ? '' : 'redx')
                  }
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-bold text-slate-800 bg-slate-50/50 hover:bg-slate-100/60 transition-colors"
                >
                  <span>Redx</span>
                  {expandedCourier === 'redx' ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {expandedCourier === 'redx' && (
                  <div className="p-5 space-y-4 border-t border-slate-100 bg-white">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        API Access Token
                      </label>
                      <input
                        type="password"
                        value={redxToken}
                        onChange={(e) => setRedxToken(e.target.value)}
                        placeholder="Enter Redx Token"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 4: Carrybee */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedCourier(expandedCourier === 'carrybee' ? '' : 'carrybee')
                  }
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-bold text-slate-800 bg-slate-50/50 hover:bg-slate-100/60 transition-colors"
                >
                  <span>Carrybee</span>
                  {expandedCourier === 'carrybee' ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {expandedCourier === 'carrybee' && (
                  <div className="p-5 space-y-4 border-t border-slate-100 bg-white">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        API Key
                      </label>
                      <input
                        type="text"
                        value={carrybeeApiKey}
                        onChange={(e) => setCarrybeeApiKey(e.target.value)}
                        placeholder="Enter Carrybee API Key"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Right: Save Settings Button matching Screenshot 1 */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
