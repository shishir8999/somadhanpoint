import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  Flame, 
  Tv, 
  LayoutGrid, 
  FileText, 
  Bot, 
  Palette, 
  Cpu, 
  ShieldCheck, 
  Gift 
} from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryNavProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const items: { label: string; value: ProductCategory; icon: any }[] = [
    { label: 'Home', value: 'All', icon: Home },
    { label: 'Shop', value: 'All', icon: ShoppingBag },
    { label: 'Top Picks', value: 'Top Picks', icon: Flame },
    { label: 'OTT & Streaming', value: 'OTT & Streaming', icon: Tv },
    { label: 'Windows', value: 'Windows', icon: LayoutGrid },
    { label: 'Microsoft Office', value: 'Microsoft Office', icon: FileText },
    { label: 'AI & Education Tools', value: 'AI & Education Tools', icon: Bot },
    { label: 'Editing Tools', value: 'Editing Tools', icon: Palette },
    { label: 'Software & Productivity', value: 'Software & Productivity', icon: Cpu },
    { label: 'VPN & Security', value: 'VPN & Security', icon: ShieldCheck },
    { label: 'Giftcards', value: 'Giftcards', icon: Gift },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive = selectedCategory === item.value && (item.label !== 'Home' && item.label !== 'Shop' ? true : selectedCategory === 'All');

          return (
            <button
              key={idx}
              onClick={() => onSelectCategory(item.value)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md font-bold dark:bg-white dark:text-slate-950'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/90 dark:bg-[#0E1322] dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:border-white/[0.08]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white dark:text-indigo-600' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
