import React from 'react';
import { MapPin, Phone, Mail, ChevronRight, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { trackContact } from '../utils/pixel';

interface FooterNewProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenReturn: () => void;
  onOpenDelivery?: () => void;
  onOpenAbout?: () => void;
  onOpenContact: () => void;
  onOpenProducts?: () => void;
  onOpenHome?: () => void;
  onOpenAdmin?: () => void;
}

export const FooterNew: React.FC<FooterNewProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenReturn,
  onOpenDelivery,
  onOpenAbout,
  onOpenContact,
  onOpenProducts,
  onOpenHome,
  onOpenAdmin,
}) => {
  const { settings } = useStoreSettings();

  return (
    <footer id="contact" className="w-full bg-[#111827] text-slate-300 pt-10 pb-20 md:pb-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 3 Contact Cards Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8 border-b border-slate-800">
          {/* Card 1: Address */}
          <div className="flex items-start gap-3 bg-[#1f2937]/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
            <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">আমাদের ঠিকানা</h4>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed">
                {settings.address || 'সৌরভ কুঞ্জ, বেনারসি কমিউনিটি সেন্টার রোড, কদমতলী, ঢাকা ১২৩৬'}
              </p>
            </div>
          </div>

          {/* Card 2: Phone */}
          <div className="flex items-start gap-3 bg-[#1f2937]/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
            <Phone className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">আমাদের কল করুন</h4>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1 font-mono">
                <a href={`tel:${settings.phone1 || '01982708789'}`} className="hover:text-white transition-colors">
                  {settings.phone1 || '01982708789'}
                </a>
                {settings.phone2 && settings.phone2 !== settings.phone1 && (
                  <>
                    {' , '}
                    <a href={`tel:${settings.phone2}`} className="hover:text-white transition-colors">
                      {settings.phone2}
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Card 3: Email */}
          <div className="flex items-start gap-3 bg-[#1f2937]/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
            <Mail className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">আমাদের ইমেইল করুন</h4>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                <a href={`mailto:${settings.email || 'shishirbarai01982708789@gmail.com'}`} className="hover:text-white transition-colors">
                  {settings.email || 'shishirbarai01982708789@gmail.com'}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-slate-800">
          {/* Left Column: Brand & Socials */}
          <div className="space-y-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              {(settings.logoUrl || settings.footerLogoUrl) ? (
                <>
                  <div
                    onClick={onOpenHome}
                    className={`transition-all ${onOpenHome ? 'cursor-pointer' : ''} ${
                      settings.footerLogoBg === 'transparent'
                        ? 'p-1 inline-flex items-center justify-center'
                        : 'bg-white rounded-xl px-3.5 py-2 shadow-md border border-white/20 inline-flex items-center justify-center hover:shadow-lg'
                    }`}
                    title={settings.siteName}
                  >
                    <img
                      src={settings.logoUrl || settings.footerLogoUrl || '/somadhan-logo.svg'}
                      alt={settings.siteName}
                      className={`h-11 sm:h-12 w-auto max-w-[210px] object-contain ${
                        settings.footerLogoBg === 'transparent'
                          ? 'drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]'
                          : ''
                      }`}
                    />
                  </div>
                  {settings.showLogoText && (
                    <span
                      onClick={onOpenHome}
                      className={`text-xl sm:text-2xl font-black tracking-tight text-white font-sans ${
                        onOpenHome ? 'cursor-pointer hover:text-slate-200' : ''
                      }`}
                    >
                      {settings.siteName}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div
                    onClick={onOpenHome}
                    className={`w-9 h-9 rounded-lg bg-[#990000] flex items-center justify-center text-white shadow-xs ${
                      onOpenHome ? 'cursor-pointer' : ''
                    }`}
                  >
                    <svg viewBox="0 0 40 40" className="w-5 h-5 fill-white">
                      <path d="M20 4 L34 32 L26 32 L22 22 L14 22 L14 16 L25 16 L20 4 Z" />
                      <path d="M12 24 L6 36 L16 36 L18 30 Z" fill="#fecaca" />
                    </svg>
                  </div>
                  <span
                    onClick={onOpenHome}
                    className={`text-xl sm:text-2xl font-black tracking-tight text-white font-sans ${
                      onOpenHome ? 'cursor-pointer hover:text-slate-200' : ''
                    }`}
                  >
                    {settings.siteName.toLowerCase().includes('byte') ? (
                      <>
                        {settings.siteName.replace(/byte/i, '')}
                        <span className="italic text-red-500 font-serif">Byte</span>
                      </>
                    ) : (
                      settings.siteName
                    )}
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              {settings.description || (
                <>
                  সারাদেশে ক্যাশ অন ডেলিভারি (৪৮ থেকে ৭২ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি) হটলাইনঃ{' '}
                  <strong className="text-white">{settings.phone1 || '01982708789'}</strong>
                </>
              )}
            </p>

            <div>
              <p className="text-xs font-semibold text-slate-300 mb-2.5">আমাদের অনুসরণ করুন</p>
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* 1. Facebook */}
                <a
                  href={settings.facebook || 'https://www.facebook.com/shishir9barai'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
                  title="Facebook পেজ দেখুন"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* 2. Instagram */}
                <a
                  href={settings.instagram || 'https://www.instagram.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
                  title="Instagram প্রোফাইল দেখুন"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* 3. YouTube */}
                <a
                  href={settings.youtube || 'https://www.youtube.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#FF0000] hover:bg-[#e60000] text-white flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
                  title="YouTube চ্যানেল দেখুন"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* 4. TikTok */}
                <a
                  href={settings.tiktok || 'https://www.tiktok.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black hover:bg-zinc-900 text-white border border-slate-700 flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
                  title="TikTok দেখুন"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>

                {/* 5. WhatsApp */}
                <a
                  href={
                    settings.whatsapp1 && (settings.whatsapp1.startsWith('http://') || settings.whatsapp1.startsWith('https://'))
                      ? settings.whatsapp1
                      : `https://wa.me/88${(settings.whatsapp1 || settings.phone1 || '01982708789').replace(/\D/g, '').replace(/^88/, '')}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContact('whatsapp')}
                  className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
                  title="WhatsApp-এ যোগাযোগ করুন"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Useful Links */}
          <div>
            <h4 className="text-white text-sm font-bold mb-3">দরকারী লিংকসমূহ</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={onOpenHome || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
                    className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-red-500" />
                    <span>হোম</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenProducts}
                    className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-red-500" />
                    <span>পণ্যসমূহ</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenAbout || onOpenContact}
                    className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-red-500" />
                    <span>আমাদের সম্পর্কে</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenContact}
                    className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-red-500" />
                    <span>যোগাযোগ</span>
                  </button>
                </li>
              </ul>

              <ul className="space-y-2">
                <li>
                  <button
                    onClick={onOpenPrivacy}
                    className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-red-500" />
                    <span>প্রাইভেসি পলিসি</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenTerms}
                    className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-red-500" />
                    <span>শর্তাবলী</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenReturn}
                    className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-red-500" />
                    <span>রিটার্ন পলিসি</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenDelivery || onOpenReturn}
                    className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-red-500" />
                    <span>ডেলিভারি পলিসি</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright line with developer branding */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 border-t border-slate-800/80">
          <p className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <span>© {new Date().getFullYear()} {settings.siteName.toLowerCase()}. All rights reserved. | Developed by with</span>
            <a
              href="https://www.facebook.com/shishir9barai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-bold hover:underline transition-all inline-flex items-center gap-1 bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-0.5 rounded border border-amber-400/20 shadow-xs cursor-pointer tracking-wide"
              title="SHISHIR - Visit Facebook Profile (https://www.facebook.com/shishir9barai)"
            >
              <span>SHISHIR</span>
            </a>
          </p>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-slate-600 hover:text-slate-400 text-[11px] transition-colors cursor-pointer"
              title="Super Admin Portal (/admin)"
            >
              Admin Portal
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
