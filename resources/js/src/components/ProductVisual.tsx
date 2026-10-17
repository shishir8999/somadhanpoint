import React from 'react';

interface ProductVisualProps {
  visualType: string;
  name?: string;
  className?: string;
  color?: string;
  imageUrl?: string;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({ visualType, name, className = '', color, imageUrl }) => {
  if (imageUrl) {
    return (
      <div className={`w-full h-full flex items-center justify-center p-1 overflow-hidden ${className}`}>
        <img
          src={imageUrl}
          alt={name || 'Product Image'}
          className="w-full h-full object-contain transition-transform duration-200"
        />
      </div>
    );
  }
  switch (visualType) {
    // 1. Woman Khimar (Red)
    case 'cotton_khimar_red':
      return (
        <div className="w-full h-full bg-[#fdf2f2] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 120" className="w-24 h-28 drop-shadow-sm">
            <ellipse cx="50" cy="30" rx="14" ry="18" fill="#e29578" />
            <path d="M50 14 C36 14, 28 26, 28 40 C28 65, 14 90, 8 115 L92 115 C86 90, 72 65, 72 40 C72 26, 64 14, 50 14 Z" fill="#b91c1c" />
            <path d="M50 35 C42 35, 36 44, 38 56 C42 70, 58 70, 62 56 C64 44, 58 35, 50 35 Z" fill="#ef4444" />
            <ellipse cx="50" cy="46" rx="9" ry="12" fill="#ffd166" opacity="0.3" />
          </svg>
        </div>
      );

    // 2. Kids Khimar (Pink)
    case 'kids_khimar_pink':
      return (
        <div className="w-full h-full bg-[#fdf2f8] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 120" className="w-24 h-28 drop-shadow-sm">
            <ellipse cx="50" cy="32" rx="12" ry="15" fill="#fbcfe8" />
            <path d="M50 16 C38 16, 32 26, 32 40 C32 60, 20 85, 16 110 L84 110 C80 85, 68 60, 68 40 C68 26, 62 16, 50 16 Z" fill="#db2777" />
            <circle cx="35" cy="80" r="3" fill="#fdf2f8" />
            <circle cx="65" cy="80" r="3" fill="#fdf2f8" />
            <circle cx="50" cy="95" r="3" fill="#fdf2f8" />
            <ellipse cx="50" cy="44" rx="8" ry="10" fill="#fbcfe8" />
          </svg>
        </div>
      );

    // 3. President Tory Arabian Jubba (White)
    case 'president_jubba_white':
      return (
        <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 120" className="w-24 h-28 drop-shadow-sm">
            <path d="M35 15 L65 15 L78 115 L22 115 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <path d="M42 15 L58 15 L55 50 L45 50 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="50" cy="22" r="1.5" fill="#caa461" />
            <circle cx="50" cy="30" r="1.5" fill="#caa461" />
            <circle cx="50" cy="38" r="1.5" fill="#caa461" />
            <path d="M28 20 L12 55 L22 60 L32 30 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M72 20 L88 55 L78 60 L68 30 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          </svg>
        </div>
      );

    // 4. President Tory Arabian Jubba (Teal)
    case 'president_jubba_teal':
      return (
        <div className="w-full h-full bg-[#f0fdfa] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 120" className="w-24 h-28 drop-shadow-sm">
            <path d="M35 15 L65 15 L78 115 L22 115 Z" fill="#0d9488" />
            <path d="M42 15 L58 15 L55 50 L45 50 Z" fill="#115e59" />
            <circle cx="50" cy="22" r="1.5" fill="#fef08a" />
            <circle cx="50" cy="30" r="1.5" fill="#fef08a" />
            <circle cx="50" cy="38" r="1.5" fill="#fef08a" />
            <path d="M28 20 L12 55 L22 60 L32 30 Z" fill="#0f766e" />
            <path d="M72 20 L88 55 L78 60 L68 30 Z" fill="#0f766e" />
          </svg>
        </div>
      );

    // 5. President Tory Arabian Jubba (Navy)
    case 'president_jubba_navy':
      return (
        <div className="w-full h-full bg-[#f1f5f9] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 120" className="w-24 h-28 drop-shadow-sm">
            <path d="M35 15 L65 15 L78 115 L22 115 Z" fill="#1e293b" />
            <path d="M42 15 L58 15 L55 50 L45 50 Z" fill="#0f172a" />
            <circle cx="50" cy="22" r="1.5" fill="#e2e8f0" />
            <circle cx="50" cy="30" r="1.5" fill="#e2e8f0" />
            <circle cx="50" cy="38" r="1.5" fill="#e2e8f0" />
            <path d="M28 20 L12 55 L22 60 L32 30 Z" fill="#1e293b" />
            <path d="M72 20 L88 55 L78 60 L68 30 Z" fill="#1e293b" />
          </svg>
        </div>
      );

    // 6. Leather Half Shoe
    case 'leather_half_shoe':
      return (
        <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <path d="M15 65 C15 45, 35 35, 55 35 C75 35, 90 55, 90 75 L15 75 Z" fill="#18181b" />
            <rect x="25" y="45" width="40" height="15" rx="3" fill="#27272a" stroke="#3f3f46" strokeWidth="1" strokeDasharray="2,2" />
            <rect x="15" y="73" width="75" height="7" rx="2" fill="#52525b" />
            <circle cx="45" cy="52" r="2" fill="#caa461" />
          </svg>
        </div>
      );

    // 7. Embroidered Panjabi
    case 'embroidered_panjabi':
      return (
        <div className="w-full h-full bg-[#faf5ef] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 120" className="w-24 h-28 drop-shadow-sm">
            <path d="M30 18 L70 18 L76 112 L24 112 Z" fill="#78716c" />
            <path d="M44 18 L56 18 L54 60 L46 60 Z" fill="#57534e" />
            <path d="M43 25 C45 22, 55 22, 57 25" stroke="#fef08a" strokeWidth="1.5" fill="none" />
            <path d="M43 35 C45 32, 55 32, 57 35" stroke="#fef08a" strokeWidth="1.5" fill="none" />
            <path d="M43 45 C45 42, 55 42, 57 45" stroke="#fef08a" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      );

    // 8. Rechargeable Fan / Desktop Fan
    case 'rechargeable_fan':
    case 'desktop_fan': {
      let fanStroke = '#b91c1c';
      let fanFill = '#f1f5f9';
      let bladeFill = '#ef4444';
      let centerFill = '#991b1b';
      let baseFill = '#334155';

      const normColor = (color || '').toLowerCase();
      if (normColor.includes('black') || normColor.includes('কালো') || normColor.includes('dark')) {
        fanStroke = '#0f172a';
        fanFill = '#1e293b';
        bladeFill = '#475569';
        centerFill = '#0f172a';
        baseFill = '#090d16';
      } else if (normColor.includes('pink') || normColor.includes('গোলাপি') || normColor.includes('rose')) {
        fanStroke = '#db2777';
        fanFill = '#fdf2f8';
        bladeFill = '#f472b6';
        centerFill = '#be185d';
        baseFill = '#9d174d';
      } else if (normColor.includes('white') || normColor.includes('সাদা')) {
        fanStroke = '#cbd5e1';
        fanFill = '#ffffff';
        bladeFill = '#94a3b8';
        centerFill = '#64748b';
        baseFill = '#475569';
      } else if (normColor.includes('blue') || normColor.includes('নীল') || normColor.includes('navy')) {
        fanStroke = '#1d4ed8';
        fanFill = '#eff6ff';
        bladeFill = '#3b82f6';
        centerFill = '#1e40af';
        baseFill = '#1e3a8a';
      } else if (normColor.includes('green') || normColor.includes('সবুজ')) {
        fanStroke = '#059669';
        fanFill = '#ecfdf5';
        bladeFill = '#10b981';
        centerFill = '#047857';
        baseFill = '#064e3b';
      }

      return (
        <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <circle cx="50" cy="42" r="28" fill={fanFill} stroke={fanStroke} strokeWidth="2.5" />
            {/* Blades */}
            <path d="M50 42 C40 25, 60 25, 50 42 Z" fill={bladeFill} />
            <path d="M50 42 C67 32, 67 52, 50 42 Z" fill={bladeFill} />
            <path d="M50 42 C50 62, 33 52, 50 42 Z" fill={bladeFill} />
            <circle cx="50" cy="42" r="5" fill={centerFill} />
            <rect x="47" y="70" width="6" height="18" fill="#64748b" />
            <ellipse cx="50" cy="90" rx="20" ry="5" fill={baseFill} />
          </svg>
        </div>
      );
    }

    // 9. Digital Potato Chipper
    case 'potato_chipper':
      return (
        <div className="w-full h-full bg-[#f1f5f9] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <rect x="25" y="45" width="50" height="25" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
            <line x1="30" y1="45" x2="30" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="36" y1="45" x2="36" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="42" y1="45" x2="42" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Lever handle */}
            <line x1="70" y1="50" x2="90" y2="25" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
            <rect x="18" y="70" width="64" height="6" fill="#334155" />
          </svg>
        </div>
      );

    // 10. Furniture Moving Set
    case 'furniture_moving_set':
      return (
        <div className="w-full h-full bg-[#fef2f2] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            {/* 4 red dollies */}
            <rect x="18" y="25" width="28" height="22" rx="3" fill="#dc2626" />
            <circle cx="32" cy="36" r="6" fill="#1e293b" />
            <rect x="54" y="25" width="28" height="22" rx="3" fill="#dc2626" />
            <circle cx="68" cy="36" r="6" fill="#1e293b" />
            <rect x="18" y="55" width="28" height="22" rx="3" fill="#dc2626" />
            <circle cx="32" cy="66" r="6" fill="#1e293b" />
            <rect x="54" y="55" width="28" height="22" rx="3" fill="#dc2626" />
            <circle cx="68" cy="66" r="6" fill="#1e293b" />
          </svg>
        </div>
      );

    // 11. Rechargeable Table Lamp
    case 'table_lamp':
      return (
        <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <ellipse cx="50" cy="85" rx="18" ry="5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="50" y1="85" x2="50" y2="40" stroke="#94a3b8" strokeWidth="4" />
            <path d="M50 40 L70 25" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            <rect x="65" y="18" width="24" height="8" rx="2" fill="#38bdf8" />
            <polygon points="65,26 89,26 95,45 60,45" fill="#fef08a" opacity="0.4" />
          </svg>
        </div>
      );

    // 12. Desktop Table Fan
    case 'desktop_fan':
      return (
        <div className="w-full h-full bg-[#f0fdf4] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <circle cx="50" cy="45" r="24" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
            <circle cx="50" cy="45" r="6" fill="#15803d" />
            <path d="M50 45 C42 30, 58 30, 50 45 Z" fill="#22c55e" />
            <path d="M50 45 C65 42, 60 55, 50 45 Z" fill="#22c55e" />
            <path d="M50 45 C45 60, 35 52, 50 45 Z" fill="#22c55e" />
            <rect x="47" y="69" width="6" height="15" fill="#64748b" />
            <ellipse cx="50" cy="86" rx="16" ry="5" fill="#1e293b" />
          </svg>
        </div>
      );

    // 13. Elastic Pedal Puller
    case 'pedal_puller':
      return (
        <div className="w-full h-full bg-[#f0f9ff] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            {/* Handle */}
            <rect x="25" y="20" width="50" height="7" rx="3.5" fill="#0284c7" />
            {/* 4 Rubber tubes */}
            <line x1="38" y1="27" x2="38" y2="70" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="46" y1="27" x2="46" y2="70" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="54" y1="27" x2="54" y2="70" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="62" y1="27" x2="62" y2="70" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Foot pedals */}
            <rect x="25" y="70" width="22" height="14" rx="4" fill="#0284c7" />
            <rect x="53" y="70" width="22" height="14" rx="4" fill="#0284c7" />
          </svg>
        </div>
      );

    // 14. Laptop Bag
    case 'laptop_bag':
      return (
        <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <rect x="20" y="38" width="60" height="44" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <path d="M38 38 C38 24, 62 24, 62 38" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <rect x="30" y="50" width="40" height="2" fill="#64748b" />
            <rect x="47" y="58" width="6" height="5" fill="#caa461" />
          </svg>
        </div>
      );

    // 15. Circulating Fan
    case 'circulating_fan':
      return (
        <div className="w-full h-full bg-[#ecfeff] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <circle cx="50" cy="46" r="26" fill="#cffafe" stroke="#0891b2" strokeWidth="3" />
            <circle cx="50" cy="46" r="6" fill="#0e7490" />
            <path d="M50 46 C40 30, 60 30, 50 46 Z" fill="#06b6d4" />
            <path d="M50 46 C65 40, 65 55, 50 46 Z" fill="#06b6d4" />
            <path d="M50 46 C45 62, 35 55, 50 46 Z" fill="#06b6d4" />
            <ellipse cx="50" cy="85" rx="18" ry="5" fill="#155e75" />
          </svg>
        </div>
      );

    // 16. Smart Scalp Massager
    case 'scalp_massager':
      return (
        <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <ellipse cx="50" cy="40" rx="26" ry="18" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
            <ellipse cx="50" cy="30" rx="14" ry="6" fill="#e2e8f0" />
            <circle cx="50" cy="28" r="4" fill="#0284c7" />
            {/* Massage claw points */}
            <circle cx="34" cy="62" r="5" fill="#cbd5e1" />
            <circle cx="45" cy="68" r="5" fill="#cbd5e1" />
            <circle cx="55" cy="68" r="5" fill="#cbd5e1" />
            <circle cx="66" cy="62" r="5" fill="#cbd5e1" />
          </svg>
        </div>
      );

    // 17-20. Premium School Bags (Black, Red, Blue, Beige)
    case 'school_bag_black':
    case 'school_bag_red':
    case 'school_bag_blue':
    case 'school_bag_beige': {
      const colors: Record<string, { bg: string; accent: string }> = {
        school_bag_black: { bg: '#1e293b', accent: '#334155' },
        school_bag_red: { bg: '#991b1b', accent: '#b91c1c' },
        school_bag_blue: { bg: '#1e40af', accent: '#2563eb' },
        school_bag_beige: { bg: '#d4b996', accent: '#b08968' },
      };
      const c = colors[visualType] || colors.school_bag_black;
      return (
        <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 120" className="w-22 h-26 drop-shadow">
            {/* Top Loop */}
            <path d="M42 22 C42 14, 58 14, 58 22" stroke="#475569" strokeWidth="3" fill="none" />
            {/* Main body */}
            <path d="M26 35 C26 22, 74 22, 74 35 L76 100 C76 106, 24 106, 24 100 Z" fill={c.bg} />
            {/* Front pocket */}
            <rect x="32" y="60" width="36" height="34" rx="4" fill={c.accent} />
            <line x1="32" y1="68" x2="68" y2="68" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.7" />
          </svg>
        </div>
      );
    }

    // 21. JioFi Router
    case 'jiofi_router':
      return (
        <div className="w-full h-full bg-[#f1f5f9] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <rect x="25" y="32" width="50" height="36" rx="8" fill="#0f172a" />
            <circle cx="50" cy="50" r="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="50" y="53" textAnchor="middle" fill="#38bdf8" fontSize="6" fontWeight="bold">Jio</text>
            <circle cx="34" cy="40" r="1.5" fill="#22c55e" />
            <circle cx="66" cy="40" r="1.5" fill="#38bdf8" />
          </svg>
        </div>
      );

    // 22. Hoco GPS Tracker
    case 'hoco_gps_tracker':
      return (
        <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <rect x="30" y="30" width="40" height="40" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="38" cy="38" r="3.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
            <text x="50" y="54" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">hoco.</text>
          </svg>
        </div>
      );

    // 23. Wooden Wall Clock
    case 'wooden_wall_clock':
      return (
        <div className="w-full h-full bg-[#fefce8] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <circle cx="50" cy="50" r="38" fill="#78350f" stroke="#451a03" strokeWidth="2" />
            <circle cx="50" cy="50" r="34" fill="#92400e" />
            <circle cx="50" cy="50" r="22" fill="#78350f" opacity="0.6" />
            {/* Arabic calligraphy silhouette motif */}
            <path d="M40 45 C45 35, 55 35, 60 45" stroke="#fef08a" strokeWidth="1.5" fill="none" />
            <line x1="50" y1="50" x2="50" y2="30" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="50" x2="64" y2="50" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="50" r="3" fill="#fef08a" />
          </svg>
        </div>
      );

    // 24. Luxury Wooden Tissue Box
    case 'wooden_tissue_box':
      return (
        <div className="w-full h-full bg-[#fffbeb] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <polygon points="20,50 35,32 80,32 65,50" fill="#b45309" stroke="#78350f" strokeWidth="1" />
            <polygon points="20,50 65,50 65,75 20,75" fill="#92400e" stroke="#78350f" strokeWidth="1" />
            <polygon points="65,50 80,32 80,57 65,75" fill="#78350f" stroke="#451a03" strokeWidth="1" />
            {/* Tissue protruding */}
            <ellipse cx="50" cy="38" rx="8" ry="3" fill="#451a03" />
            <path d="M48 38 C46 25, 56 25, 54 38 Z" fill="#ffffff" />
          </svg>
        </div>
      );

    // 25. Silver Crest Stainless Steel Cooker/Kettle
    case 'silver_crest_kettle':
      return (
        <div className="w-full h-full bg-[#f1f5f9] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <path d="M30 40 L70 40 L66 82 L34 82 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
            <rect x="42" y="32" width="16" height="8" rx="2" fill="#1e293b" />
            <path d="M70 46 C82 46, 82 72, 70 76" fill="none" stroke="#1e293b" strokeWidth="4" />
            <text x="50" y="62" textAnchor="middle" fill="#475569" fontSize="6" fontWeight="bold">SILVER</text>
          </svg>
        </div>
      );

    // 26. Hanging Neck Charging Fan
    case 'neck_fan':
      return (
        <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <path d="M28 65 C18 45, 30 25, 50 25 C70 25, 82 45, 72 65" fill="none" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
            <circle cx="28" cy="65" r="9" fill="#0284c7" />
            <circle cx="72" cy="65" r="9" fill="#0284c7" />
          </svg>
        </div>
      );

    // 27. Cotton Panel Bedsheet
    case 'cotton_bedsheet':
      return (
        <div className="w-full h-full bg-[#fff1f2] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <rect x="20" y="30" width="60" height="45" rx="3" fill="#e11d48" />
            <rect x="26" y="36" width="48" height="33" fill="#be123c" />
            <circle cx="50" cy="52" r="8" fill="#fda4af" />
          </svg>
        </div>
      );

    // 28. SY-322 Multifunctional Flashlight Speaker
    case 'flashlight_speaker':
      return (
        <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <rect x="38" y="24" width="24" height="52" rx="6" fill="#1e293b" />
            <rect x="36" y="22" width="28" height="8" rx="2" fill="#0284c7" />
            <circle cx="50" cy="46" r="6" fill="#334155" />
            <circle cx="50" cy="62" r="4" fill="#334155" />
          </svg>
        </div>
      );

    // 29. Laxasfit S9 Pro Smart Watch
    case 'laxasfit_s9':
      return (
        <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <rect x="42" y="12" width="16" height="24" rx="3" fill="#f97316" />
            <rect x="42" y="64" width="16" height="24" rx="3" fill="#f97316" />
            <rect x="34" y="30" width="32" height="40" rx="8" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="#22c55e" strokeWidth="2" />
            <text x="50" y="53" textAnchor="middle" fill="#fff" fontSize="6">10:08</text>
          </svg>
        </div>
      );

    // 30. T900 Ultra 2 Pro Smart Watch
    case 't900_ultra':
      return (
        <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            {/* Multi color straps display */}
            <rect x="18" y="25" width="8" height="50" rx="2" fill="#f97316" />
            <rect x="30" y="25" width="8" height="50" rx="2" fill="#eab308" />
            <rect x="62" y="25" width="8" height="50" rx="2" fill="#06b6d4" />
            <rect x="74" y="25" width="8" height="50" rx="2" fill="#1e293b" />
            {/* Center watch */}
            <rect x="42" y="30" width="16" height="40" rx="4" fill="#0f172a" stroke="#d97706" strokeWidth="2" />
          </svg>
        </div>
      );

    // 31. Ultrapods Max Wireless Earbuds
    case 'ultrapods_max':
      return (
        <div className="w-full h-full bg-[#f1f5f9] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <rect x="30" y="28" width="40" height="44" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <rect x="42" y="44" width="16" height="12" rx="2" fill="#0f172a" />
            <text x="50" y="53" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">95</text>
          </svg>
        </div>
      );

    // 32. Hoco W35 Max Wireless Headphones
    case 'hoco_w35':
      return (
        <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <path d="M26 55 C24 30, 76 30, 74 55" fill="none" stroke="#18181b" strokeWidth="5" strokeLinecap="round" />
            <rect x="20" y="50" width="12" height="24" rx="6" fill="#27272a" />
            <rect x="68" y="50" width="12" height="24" rx="6" fill="#27272a" />
          </svg>
        </div>
      );

    // 33. Regrsi RE-NY032 Bluetooth Neckband
    case 'regrsi_neckband':
      return (
        <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow">
            <path d="M30 65 C22 35, 78 35, 70 65" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <rect x="26" y="60" width="8" height="18" rx="3" fill="#334155" />
            <rect x="66" y="60" width="8" height="18" rx="3" fill="#334155" />
          </svg>
        </div>
      );

    // Category circles
    case 'cat_khimar':
      return (
        <div className="w-full h-full rounded-full bg-[#fee2e2] flex items-center justify-center text-xl">
          🧕
        </div>
      );
    case 'cat_formal_shoe':
      return (
        <div className="w-full h-full rounded-full bg-[#f1f5f9] flex items-center justify-center text-xl">
          👞
        </div>
      );
    case 'cat_borka':
      return (
        <div className="w-full h-full rounded-full bg-[#e2e8f0] flex items-center justify-center text-xl">
          👗
        </div>
      );
    case 'cat_kids_khimar':
      return (
        <div className="w-full h-full rounded-full bg-[#fce7f3] flex items-center justify-center text-xl">
          🌸
        </div>
      );
    case 'cat_shirt':
      return (
        <div className="w-full h-full rounded-full bg-[#e0f2fe] flex items-center justify-center text-xl">
          👔
        </div>
      );
    case 'cat_jacket':
      return (
        <div className="w-full h-full rounded-full bg-[#fef3c7] flex items-center justify-center text-xl">
          🧥
        </div>
      );
    case 'cat_jubba':
      return (
        <div className="w-full h-full rounded-full bg-[#f1f5f9] flex items-center justify-center text-xl">
          🥻
        </div>
      );
    case 'cat_electronics':
      return (
        <div className="w-full h-full rounded-full bg-[#e0e7ff] flex items-center justify-center text-xl">
          🔌
        </div>
      );
    case 'cat_leather':
      return (
        <div className="w-full h-full rounded-full bg-[#fed7aa] flex items-center justify-center text-xl">
          💼
        </div>
      );
    case 'cat_gadget':
      return (
        <div className="w-full h-full rounded-full bg-[#ccfbf1] flex items-center justify-center text-xl">
          📱
        </div>
      );

    default:
      return (
        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
          পণ্য
        </div>
      );
  }
};
