import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PageSection {
  heading: string;
  body: string;
  icon?: string;
}

export interface CustomPageData {
  id: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  content: string;
  sections: PageSection[];
}

export const DEFAULT_PAGES_DATA: Record<string, CustomPageData> = {
  about_us: {
    id: 'about_us',
    title: 'আমাদের সম্পর্কে',
    subtitle: 'বাংলাদেশের বিশ্বস্ত ও নির্ভরযোগ্য ই-কমার্স শপিং প্ল্যাটফর্ম',
    lastUpdated: 'অক্টোবর ২০২৬',
    content:
      'আমাদের মূল লক্ষ্য হলো বাংলাদেশের প্রতিটি প্রান্তে গ্রাহকদের কাছে গুণগত মানসম্পন্ন, প্রিমিয়াম ও ১০০% অরিজিনাল পণ্য সরাসরি পৌঁছে দেওয়া। সততা, গ্রাহক সন্তুষ্টি এবং দ্রুততম সেবা নিশ্চিত করাই আমাদের প্রধান অঙ্গীকার।',
    sections: [
      {
        heading: 'আমাদের গল্প ও যাত্রা',
        body: 'গ্রাহকদের আস্থা ও ভালোবাসাকে পুঁজি করে আমাদের যাত্রা শুরু। নিত্যপ্রয়োজনীয় অর্গানিক পণ্য, প্রিমিয়াম গ্যাজেট এবং আধুনিক লাইফস্টাইল পণ্য সহজে সাশ্রয়ী মূল্যে ঘরে পৌঁছে দেওয়াই আমাদের ব্রত।',
        icon: 'Sparkles',
      },
      {
        heading: 'আমাদের মূল ভিশন ও মিশন',
        body: 'একটি স্বচ্ছ, নিরাপদ ও সহজ ই-কমার্স অভিজ্ঞতা গড়ে তোলা যেখানে প্রতিটি গ্রাহক নিশ্চিন্তে পণ্য দেখে ঘরে বসে ক্যাশ অন ডেলিভারিতে কেনাকাটা করতে পারবেন।',
        icon: 'Target',
      },
      {
        heading: 'কেন আমাদের নির্বাচন করবেন?',
        body: '১০০% জেনুইন পণ্য, যাচাই করে মূল্য পরিশোধের সুযোগ, দ্রুততম কুরিয়ার ডেলিভারি এবং সার্বক্ষণিক হেল্পলাইন সাপোর্ট আমাদের অনন্য করে তুলেছে।',
        icon: 'CheckCircle2',
      },
      {
        heading: 'গ্রাহক সন্তুষ্টির নিশ্চয়তা',
        body: 'আমাদের রয়েছে ডেডিকেটেড সাপোর্ট টিম। যেকোনো অনুসন্ধান বা প্রয়োজনে আমরা ফোন ও হোয়াটসঅ্যাপে সদা প্রস্তুত।',
        icon: 'ShieldCheck',
      },
    ],
  },
  contact_us: {
    id: 'contact_us',
    title: 'যোগাযোগ ও সাপোর্ট',
    subtitle: 'যে কোনো তথ্য বা সহযোগিতার জন্য সরাসরি আমাদের সাথে যোগাযোগ করুন',
    lastUpdated: 'অক্টোবর ২০২৬',
    content:
      'আমরা গ্রাহকদের যেকোনো প্রশ্নের উত্তর ও সেবা দিতে সবসময় প্রস্তুত। নিচের মাধ্যমে সরাসরি আমাদের সাথে যোগাযোগ করতে পারেন অথবা সরাসরি মেসেজ পাঠাতে পারেন।',
    sections: [
      {
        heading: 'অফিস ও শো-রুমের ঠিকানা',
        body: 'সৌরভ কুঞ্জ, বেনারসি কমিউনিটি সেন্টার রোড, কদমতলী, ঢাকা ১২৩৬, বাংলাদেশ।',
        icon: 'MapPin',
      },
      {
        heading: 'সরাসরি হেল্পলাইন ও কল',
        body: 'হটলাইন: 01982708789 (সকাল ৯টা থেকে রাত ১০টা পর্যন্ত প্রতিদিন খোলা)',
        icon: 'Phone',
      },
      {
        heading: 'হোয়াটসঅ্যাপ সাপোর্ট',
        body: 'হোয়াটসঅ্যাপ নম্বর: 01982708789। তাৎক্ষণিক চ্যাট ও অর্ডারের আপডেটের জন্য হোয়াটসঅ্যাপে মেসেজ দিন।',
        icon: 'MessageSquare',
      },
      {
        heading: 'অফিশিয়াল ইমেইল',
        body: 'ইমেইল: shishirbarai01982708789@gmail.com (২৪ ঘণ্টার মধ্যে রিপ্লাই দেওয়া হয়)',
        icon: 'Mail',
      },
    ],
  },
  privacy_policy: {
    id: 'privacy_policy',
    title: 'প্রাইভেসি পলিসি',
    subtitle: 'আপনার ব্যক্তিগত তথ্যের পূর্ণ নিরাপত্তা ও গোপনীয়তা আমাদের অঙ্গীকার',
    lastUpdated: 'অক্টোবর ২০২৬',
    content:
      'আমরা আমাদের গ্রাহকদের ব্যক্তিগত তথ্যের সর্বোচ্চ সুরক্ষা দিতে বদ্ধপরিকর। এই নীতিমালায় ব্যাখ্যা করা হয়েছে আমরা কীভাবে আপনার তথ্য সংগ্রহ, সংরক্ষণ ও ব্যবহার করি।',
    sections: [
      {
        heading: '১. আমরা যেসকল তথ্য সংগ্রহ করি',
        body: 'অর্ডার সফলভাবে পৌঁছে দেওয়ার জন্য আমরা আপনার নাম, ফোন নম্বর, ডেলিভারির ঠিকানা এবং অর্ডারকৃত পণ্যের বিবরণ সংগ্রহ করি। কোনো প্রকার কার্ডের পিন বা গোপনীয় পাসওয়ার্ড আমরা সংগ্রহ করি না।',
        icon: 'FileText',
      },
      {
        heading: '২. তথ্যের ব্যবহার',
        body: 'আপনার প্রদত্ত তথ্য শুধুমাত্র অর্ডার প্রসেসিং, কুরিয়ারে পার্সেল বুকিং, গ্রাহক সেবা ও ডেলিভারি সংক্রান্ত যোগাযোগের কাজে ব্যবহার করা হয়।',
        icon: 'Lock',
      },
      {
        heading: '৩. তথ্যের সুরক্ষা ও নিরাপত্তা',
        body: 'আমরা উন্নত এনক্রিপশন ও সিকিউর সার্ভার ব্যবহার করি। আপনার ব্যক্তিগত তথ্য তৃতীয় কোনো বিজ্ঞাপনদাতা বা অননুমোদিত পক্ষের সাথে কখনোই বিক্রি বা শেয়ার করা হয় না।',
        icon: 'ShieldCheck',
      },
      {
        heading: '৪. কুকিজ ও সাইট ব্যবহার',
        body: 'আমাদের ওয়েবসাইটে আপনার শপিং অভিজ্ঞতা আরও স্মুথ ও সুবিধাজনক করতে স্ট্যান্ডার্ড ব্রাউজার কুকিজ ব্যবহৃত হয়। আপনি চাইলে যেকোনো সময় ব্রাউজার থেকে কুকিজ ক্লিয়ার করতে পারেন।',
        icon: 'Cookie',
      },
    ],
  },
  terms_conditions: {
    id: 'terms_conditions',
    title: 'শর্তাবলী ও নিয়মাবলী',
    subtitle: 'ওয়েবসাইট ব্যবহারের সাধারণ নিয়মনীতি ও বিক্রয় শর্তাবলী',
    lastUpdated: 'অক্টোবর ২০২৬',
    content:
      'আমাদের ওয়েবসাইট থেকে কোনো পণ্য অর্ডার বা কেনাকাটা করার পূর্বে অনুগ্রহ করে নিচের শর্তাবলী ও নিয়মাবলীগুলো পড়ে নেওয়ার অনুরোধ করা হচ্ছে।',
    sections: [
      {
        heading: '১. অর্ডার গ্রহণ ও নিশ্চিতকরণ',
        body: 'ওয়েবসাইটে অর্ডার করার পর আমাদের প্রতিনিধি গ্রাহকের মোবাইল নম্বরে ফোন করে অর্ডার নিশ্চিত করবেন। সঠিক ফোন নম্বর ও ডেলিভারি ঠিকানা প্রদান করা গ্রাহকের দায়িত্ব।',
        icon: 'CheckCircle2',
      },
      {
        heading: '২. মূল্য ও পেমেন্ট পদ্ধতি',
        body: 'সব পণ্যের মূল্য ওয়েবসাইটে উল্লেখ করা আছে। আমরা সম্পূর্ণ ক্যাশ অন ডেলিভারি সুবিধা প্রদান করি। গ্রাহক পার্সেল রিসিভ করার সময় ডেলিভারি ম্যানের কাছে টাকা পরিশোধ করবেন।',
        icon: 'CreditCard',
      },
      {
        heading: '৩. ডেলিভারি সংক্রান্ত শর্ত',
        body: 'ঢাকা সিটির মধ্যে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ৪৮ থেকে ৭২ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন হয়। প্রাকৃতিক দুর্যোগ বা কুরিয়ার জনিত কারণে সামান্য বিলম্ব হতে পারে।',
        icon: 'Truck',
      },
      {
        heading: '৪. অর্ডার বাতিল সংক্রান্ত',
        body: 'পণ্য কুরিয়ারে পাঠানোর পূর্বে যেকোনো সময় গ্রাহক ফোন বা হোয়াটসঅ্যাপে জানিয়ে অর্ডার বাতিল করতে পারেন। কোনো ভুয়া বা অসদুপায়ে করা অর্ডার বাতিল করার অধিকার কর্তৃপক্ষ সংরক্ষণ করে।',
        icon: 'XCircle',
      },
    ],
  },
  return_policy: {
    id: 'return_policy',
    title: 'রিটার্ন ও রিফান্ড পলিসি',
    subtitle: 'সহজ ও ঝামেলামুক্ত ৭ দিনের রিটার্ন ও দ্রুত রিফান্ড সুবিধা',
    lastUpdated: 'অক্টোবর ২০২৬',
    content:
      'আমাদের সর্বোচ্চ চেষ্টা থাকে গ্রাহকদের কাছে ত্রুটিমুক্ত ও সঠিক পণ্য পৌঁছে দেওয়া। তবুও কোনো পণ্যে ত্রুটি থাকলে বা প্রত্যাশা অনুযায়ী না হলে আমরা সহজ রিটার্ন পলিসি অফার করি।',
    sections: [
      {
        heading: '১. রিটার্নের সময়সীমা (৭ দিন)',
        body: 'পণ্য ডেলিভারি পাওয়ার পর থেকে ৭ (সাত) দিনের মধ্যে রিটার্ন বা পরিবর্তনের জন্য আমাদের কাস্টমার সাপোর্টে যোগাযোগ করতে হবে।',
        icon: 'Clock',
      },
      {
        heading: '২. যেসকল ক্ষেত্রে রিটার্ন প্রযোজ্য',
        body: 'ত্রুটিপূর্ণ, ড্যামেজড, ভাঙা পণ্য পেলে অথবা অর্ডারকৃত পণ্যের সাথে প্রাপ্ত পণ্যের মিল না থাকলে সম্পূর্ণ বিনামূল্যে পণ্য পরিবর্তন অথবা রিটার্ন গ্রহণযোগ্য।',
        icon: 'CheckCircle2',
      },
      {
        heading: '৩. রিটার্নের শর্তসমূহ',
        body: 'পণ্যটি অব্যবহৃত অবস্থায়, অরিজিনাল প্যাকেট, এক্সেসরিজ এবং ইনভয়েস সহ ফেরত দিতে হবে। আনবক্সিং এর সময় একটি ছোট ভিডিও রাখলে দ্রুত সমাধান পাওয়া সহজ হয়।',
        icon: 'Package',
      },
      {
        heading: '৪. রিফান্ড প্রক্রিয়া',
        body: 'রিটার্নকৃত পণ্য আমাদের অফিসে পৌঁছানোর পর কোয়ালিটি চেক করে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে বিকাশ/নগদ/ব্যাংকের মাধ্যমে রিফান্ডের টাকা পাঠিয়ে দেওয়া হয়।',
        icon: 'RefreshCw',
      },
    ],
  },
  delivery_policy: {
    id: 'delivery_policy',
    title: 'ডেলিভারি পলিসি ও চার্জ',
    subtitle: 'সারাদেশে দ্রুততম সময়ে নিশ্চিত ক্যাশ অন ডেলিভারি',
    lastUpdated: 'অক্টোবর ২০২৬',
    content:
      'আমরা দেশের শীর্ষস্থানীয় কুরিয়ার সার্ভিসের মাধ্যমে দেশের ৬৪টি জেলা ও প্রত্যন্ত অঞ্চলেও দ্রুততম সময়ে হোম ডেলিভারি নিশ্চিত করি।',
    sections: [
      {
        heading: '১. ডেলিভারির সময়সীমা',
        body: 'ঢাকা শহরের ভেতর: ২৪ থেকে ৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি। ঢাকার বাইরের সকল জেলা ও থানা পর্যায়ে: ৪৮ থেকে ৭২ ঘণ্টার মধ্যে হোম ডেলিভারি।',
        icon: 'Clock',
      },
      {
        heading: '২. ডেলিভারি চার্জের বিবরণ',
        body: 'ঢাকা সিটির মধ্যে নিয়মিত ডেলিভারি চার্জ ৬০-৮০ টাকা এবং ঢাকার বাইরে ১০০-১২০ টাকা। বিশেষ অফার বা প্রোমো কোডের ক্ষেত্রে ফ্রি ডেলিভারি প্রযোজ্য হতে পারে।',
        icon: 'DollarSign',
      },
      {
        heading: '৩. আমাদের কুরিয়ার পার্টনার্স',
        body: 'আমরা স্টিডফাস্ট (Steadfast), পাঠাও (Pathao) এবং রেডএক্স (RedX)-এর মতো নির্ভরযোগ্য কুরিয়ার নেটওয়ার্কের মাধ্যমে অর্ডার ডেলিভারি করে থাকি।',
        icon: 'Truck',
      },
      {
        heading: '৪. পার্সেল রিসিভ করার নিয়ম',
        body: 'ডেলিভারি ম্যানের সামনে পার্সেলটি চেক করে মূল্য পরিশোধ করুন। কোনো সমস্যা দেখা দিলে ডেলিভারি ম্যান থাকা অবস্থাতেই আমাদের হেল্পলাইনে কল করুন।',
        icon: 'CheckCircle2',
      },
    ],
  },
};

interface CustomPagesContextType {
  pages: Record<string, CustomPageData>;
  getPage: (id: string) => CustomPageData;
  updatePage: (id: string, updatedData: Partial<CustomPageData>) => void;
  resetPage: (id: string) => void;
  resetAllPages: () => void;
}

const CustomPagesContext = createContext<CustomPagesContextType>({
  pages: DEFAULT_PAGES_DATA,
  getPage: (id: string) => DEFAULT_PAGES_DATA[id] || DEFAULT_PAGES_DATA.about_us,
  updatePage: () => {},
  resetPage: () => {},
  resetAllPages: () => {},
});

export const CustomPagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<Record<string, CustomPageData>>(() => {
    try {
      const saved = localStorage.getItem('ecom_custom_pages_data');
      if (saved) {
        return { ...DEFAULT_PAGES_DATA, ...JSON.parse(saved) };
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_PAGES_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ecom_custom_pages_data', JSON.stringify(pages));
    } catch (e) {
      // ignore
    }
  }, [pages]);

  const getPage = (id: string): CustomPageData => {
    return pages[id] || DEFAULT_PAGES_DATA[id] || DEFAULT_PAGES_DATA.about_us;
  };

  const updatePage = (id: string, updatedData: Partial<CustomPageData>) => {
    setPages((prev) => {
      const current = prev[id] || DEFAULT_PAGES_DATA[id];
      const merged = { ...current, ...updatedData };
      return { ...prev, [id]: merged };
    });
  };

  const resetPage = (id: string) => {
    if (DEFAULT_PAGES_DATA[id]) {
      setPages((prev) => ({
        ...prev,
        [id]: DEFAULT_PAGES_DATA[id],
      }));
    }
  };

  const resetAllPages = () => {
    setPages(DEFAULT_PAGES_DATA);
  };

  return (
    <CustomPagesContext.Provider
      value={{
        pages,
        getPage,
        updatePage,
        resetPage,
        resetAllPages,
      }}
    >
      {children}
    </CustomPagesContext.Provider>
  );
};

export const useCustomPages = () => useContext(CustomPagesContext);
