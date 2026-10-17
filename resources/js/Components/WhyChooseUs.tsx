import React from 'react';
import { Zap, ShieldCheck, HeartHandshake, Headphones, Clock, Lock } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      title: 'স্বয়ংক্রিয় অ্যাক্টিভেশন',
      desc: 'TrxID সাবমিট করার সাথে সাথে সিস্টেম স্বয়ংক্রিয়ভাবে লাইসেন্স কি ও সিট বরাদ্দ করে।',
      icon: Zap,
      color: 'text-amber-400'
    },
    {
      title: '১০০% অরিজিনাল সার্ভিস',
      desc: 'প্রতিটি সাবস্ক্রিপশন ও সফটওয়্যার জেনুইন অফিশিয়াল লাইসেন্স দ্বারা পরিচালিত।',
      icon: ShieldCheck,
      color: 'text-emerald-400'
    },
    {
      title: 'রিপ্লেসমেন্ট গ্যারান্টি',
      desc: 'মেয়াদ চলাকালীন কোনো সমস্যা হলে সাথে সাথে ফ্রি রিপ্লেসমেন্ট প্রদান করা হয়।',
      icon: HeartHandshake,
      color: 'text-pink-400'
    },
    {
      title: 'কঠোর ডেটা প্রাইভেসি',
      desc: 'অন্য কোনো ব্যবহারকারী বা অ্যাডমিন আপনার ব্যক্তিগত চ্যাট বা ডকুমেন্ট দেখতে পারে না।',
      icon: Lock,
      color: 'text-indigo-400'
    },
    {
      title: '২৪/৭ ডেডিকেটেড সাপোর্ট',
      desc: 'হোয়াটসঅ্যাপ ও মেসেঞ্জারে যেকোনো প্রয়োজনে আমাদের সাপোর্ট টিম সর্বদা প্রস্তুত।',
      icon: Headphones,
      color: 'text-cyan-400'
    },
    {
      title: 'সহজ লোকাল পেমেন্ট',
      desc: 'বিকাশ, নগদ, রকেট ও কার্ডে কোনো বাড়তি ফি ছাড়া সরাসরি পেমেন্ট সুবিধা।',
      icon: Clock,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="py-12 space-y-6">
      <div className="text-center space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          কেন <span className="text-indigo-600 dark:text-indigo-400">Nexus Premium Store</span> থেকে নিবেন?
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          আমাদের সেবায় স্বস্তি — যেখানে কোয়ালিটি ও প্রাইভেসি সবার আগে
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {points.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#090E1B] border border-slate-200 dark:border-white/[0.08] hover:border-blue-400 dark:hover:border-white/20 transition flex items-start gap-3.5 shadow-xs dark:shadow-none"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.03] flex items-center justify-center shrink-0">
                <Icon className={`w-5 h-5 ${p.color}`} />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-1">{p.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
