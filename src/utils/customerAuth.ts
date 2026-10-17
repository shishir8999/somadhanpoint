import { CustomerUser, SentEmailItem } from '../types';

export const DEFAULT_REGISTERED_USERS: CustomerUser[] = [
  {
    id: 'user-1',
    name: 'শিশির বড়াই',
    email: 'shishir@gmail.com',
    phone: '01982708789',
    password: '123456',
    createdAt: '১২ অক্টোবর ২০২৬, সকাল ১০:৩০',
  },
  {
    id: 'user-2',
    name: 'মোঃ সাকিব হোসেন',
    email: 'sakib@gmail.com',
    phone: '01712345678',
    password: '123456',
    createdAt: '১৪ অক্টোবর ২০২৬, দুপুর ০২:১৫',
  },
  {
    id: 'user-3',
    name: 'তাহমিদ আহমেদ',
    email: 'customer@gmail.com',
    phone: '01812345678',
    password: '123456',
    createdAt: '১৫ অক্টোবর ২০২৬, বিকাল ০৫:০০',
  },
];

const STORAGE_USERS_KEY = 'ummah_registered_users';
const STORAGE_CURRENT_USER_KEY = 'ummah_current_customer';
const STORAGE_SENT_EMAILS_KEY = 'ummah_sent_emails';
const STORAGE_PASSWORD_RESET_KEY = 'ummah_password_reset_otps';

// 1. Get all registered users from localStorage with defaults
export const getRegisteredUsers = (): CustomerUser[] => {
  if (typeof window === 'undefined') return DEFAULT_REGISTERED_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_REGISTERED_USERS));
      return DEFAULT_REGISTERED_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse registered users:', e);
  }
  return DEFAULT_REGISTERED_USERS;
};

// 2. Save users to localStorage
export const saveRegisteredUsers = (users: CustomerUser[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save registered users:', e);
  }
};

// 3. Get currently logged-in customer
export const getCurrentCustomer = (): CustomerUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to get current customer:', e);
  }
  return null;
};

// 4. Set currently logged-in customer
export const setCurrentCustomer = (user: CustomerUser | null): void => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
    window.dispatchEvent(new CustomEvent('customer_auth_changed', { detail: user }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to set current customer:', e);
  }
};

// 5. Get sent emails
export const getSentEmails = (): SentEmailItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_SENT_EMAILS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to get sent emails:', e);
  }
  return [];
};

// 6. Save a sent email and notify listeners
export const recordSentEmail = (emailItem: SentEmailItem): void => {
  if (typeof window === 'undefined') return;
  try {
    const current = getSentEmails();
    const updated = [emailItem, ...current];
    localStorage.setItem(STORAGE_SENT_EMAILS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('email_dispatched', { detail: emailItem }));
  } catch (e) {
    console.error('Failed to record sent email:', e);
  }
};

// 7. Register a new customer with Gmail
export interface RegisterResult {
  success: boolean;
  message: string;
  user?: CustomerUser;
  sentEmail?: SentEmailItem;
}

export const registerCustomer = (
  name: string,
  email: string,
  phone: string,
  password: string
): RegisterResult => {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim();

  if (!cleanName) {
    return { success: false, message: 'অনুগ্রহ করে আপনার পুরো নাম লিখুন।' };
  }

  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return { success: false, message: 'অনুগ্রহ করে সঠিক জিমেইল / ইমেইল ঠিকানা প্রদান করুন।' };
  }

  if (!cleanPhone || cleanPhone.length < 10) {
    return { success: false, message: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নাম্বার লিখুন।' };
  }

  if (!password || password.length < 6) {
    return { success: false, message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' };
  }

  const users = getRegisteredUsers();
  const exists = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (exists) {
    return {
      success: false,
      message: `এই জিমেইল (${cleanEmail}) দিয়ে পূর্বে একটি অ্যাকাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করুন।`,
    };
  }

  const dateStr = new Date().toLocaleString('bn-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const newUser: CustomerUser = {
    id: `cust-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    password,
    createdAt: dateStr,
  };

  const updatedUsers = [newUser, ...users];
  saveRegisteredUsers(updatedUsers);
  setCurrentCustomer(newUser);

  // Dispatch Welcome Email
  const welcomeEmail: SentEmailItem = {
    id: `mail-${Date.now()}`,
    to: cleanEmail,
    toName: cleanName,
    from: 'Somadhan Point <noreply@somadhanpoint.com>',
    subject: '🎉 অভিনন্দন! Somadhan Point-এ আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে',
    bodyText: `প্রিয় ${cleanName},\n\nSomadhan Point-এ স্বাগতম! আপনার অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে।\n\nলগইন জিমেইল: ${cleanEmail}\nমোবাইল নাম্বার: ${cleanPhone}\nতারিখ: ${dateStr}\n\nআপনার যেকোনো প্রয়োজনে আমরা সর্বদা পাশে আছি। হ্যাপি শপিং!`,
    type: 'welcome',
    sentAt: dateStr,
  };

  recordSentEmail(welcomeEmail);

  return {
    success: true,
    message: 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে এবং আপনার জিমেইলে নিশ্চিতকরণ বার্তা পাঠানো হয়েছে!',
    user: newUser,
    sentEmail: welcomeEmail,
  };
};

// 8. Login Customer
export interface LoginResult {
  success: boolean;
  message: string;
  user?: CustomerUser;
}

export const loginCustomer = (email: string, password: string): LoginResult => {
  const cleanEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();

  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return {
      success: false,
      message: 'এই জিমেইল অ্যাড্রেস দিয়ে কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি। অনুগ্রহ করে রেজিস্টার করুন।',
    };
  }

  if (user.password && user.password !== password) {
    return {
      success: false,
      message: 'ভুল পাসওয়ার্ড! আপনি যদি পাসওয়ার্ড ভুলে গিয়ে থাকেন, তবে "পাসওয়ার্ড ভুলে গেছেন?" বাটনে ক্লিক করুন।',
    };
  }

  setCurrentCustomer(user);

  return {
    success: true,
    message: `স্বাগতম, ${user.name}! সফলভাবে লগইন সম্পন্ন হয়েছে।`,
    user,
  };
};

// 9. Forgot Password: Request OTP
export interface RequestResetResult {
  success: boolean;
  message: string;
  otp?: string;
  sentEmail?: SentEmailItem;
}

export const requestPasswordReset = (email: string): RequestResetResult => {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'অনুগ্রহ করে সঠিক জিমেইল অ্যাড্রেস লিখুন।' };
  }

  const users = getRegisteredUsers();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return {
      success: false,
      message: 'এই জিমেইলটি আমাদের সিস্টেমে নিবন্ধিত নেই। অনুগ্রহ করে সঠিক জিমেইল দিন।',
    };
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const dateStr = new Date().toLocaleString('bn-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // Save OTP in localStorage with timestamp
  const resetRecord = {
    email: cleanEmail,
    otp,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
  };
  localStorage.setItem(STORAGE_PASSWORD_RESET_KEY, JSON.stringify(resetRecord));

  // Dispatch Password Reset Email
  const resetEmail: SentEmailItem = {
    id: `mail-reset-${Date.now()}`,
    to: cleanEmail,
    toName: user.name,
    from: 'Somadhan Point Security <security@somadhanpoint.com>',
    subject: `🔑 পাসওয়ার্ড রিসেট ভেরিফিকেশন কোড: ${otp}`,
    bodyText: `প্রিয় ${user.name},\n\nআপনার Somadhan Point অ্যাকাউন্টের পাসওয়ার্ড রিসেট করার অনুরোধ গ্রহণ করা হয়েছে।\n\nআপনার ৬ সংখ্যার ভেরিফিকেশন কোড (OTP): ${otp}\n\nএই কোডটির মেয়াদ ১৫ মিনিট থাকবে। নিরাপত্তার স্বার্থে কোডটি কাউকে বলবেন না।`,
    otpCode: otp,
    type: 'reset_password',
    sentAt: dateStr,
  };

  recordSentEmail(resetEmail);

  return {
    success: true,
    message: `আপনার জিমেইল (${cleanEmail})-এ ৬ সংখ্যার ভেরিফিকেশন কোড (OTP) পাঠানো হয়েছে!`,
    otp,
    sentEmail: resetEmail,
  };
};

// 10. Verify OTP & Reset Password
export interface ResetPasswordResult {
  success: boolean;
  message: string;
  user?: CustomerUser;
  sentEmail?: SentEmailItem;
}

export const verifyAndResetPassword = (
  email: string,
  enteredOtp: string,
  newPassword: string
): ResetPasswordResult => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = enteredOtp.trim();

  if (!cleanOtp || cleanOtp.length !== 6) {
    return { success: false, message: 'অনুগ্রহ করে ৬ সংখ্যার সঠিক ভেরিফিকেশন কোড দিন।' };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' };
  }

  try {
    const raw = localStorage.getItem(STORAGE_PASSWORD_RESET_KEY);
    if (!raw) {
      return { success: false, message: 'ভেরিফিকেশন সেশনের মেয়াদ শেষ হয়েছে। পুনরায় কোড পাঠান।' };
    }
    const record = JSON.parse(raw);
    if (record.email !== cleanEmail) {
      return { success: false, message: 'ইমেইল অ্যাড্রেস মেলেনি। পুনরায় চেষ্টা করুন।' };
    }
    if (Date.now() > record.expiresAt) {
      return { success: false, message: 'ভেরিফিকেশন কোডের মেয়াদ উত্তীর্ণ হয়েছে। নতুন কোড নিন।' };
    }
    if (record.otp !== cleanOtp) {
      return { success: false, message: 'ভেরিফিকেশন কোড ভুল হয়েছে! অনুগ্রহ করে আপনার জিমেইলে আসা ৬ সংখ্যার কোডটি চেক করুন।' };
    }

    // Update user password
    const users = getRegisteredUsers();
    let updatedUser: CustomerUser | undefined;

    const updatedUsers = users.map((u) => {
      if (u.email.toLowerCase() === cleanEmail) {
        updatedUser = { ...u, password: newPassword };
        return updatedUser;
      }
      return u;
    });

    if (!updatedUser) {
      return { success: false, message: 'ইউজার পাওয়া যায়নি।' };
    }

    saveRegisteredUsers(updatedUsers);
    localStorage.removeItem(STORAGE_PASSWORD_RESET_KEY);
    setCurrentCustomer(updatedUser);

    const dateStr = new Date().toLocaleString('bn-BD', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Confirmation email
    const confirmEmail: SentEmailItem = {
      id: `mail-confirm-${Date.now()}`,
      to: cleanEmail,
      toName: updatedUser.name,
      from: 'Somadhan Point Security <security@somadhanpoint.com>',
      subject: '🔒 আপনার পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে',
      bodyText: `প্রিয় ${updatedUser.name},\n\nআপনার Somadhan Point অ্যাকাউন্টের পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে।\nসময়: ${dateStr}\n\nআপনি যদি এই পরিবর্তনটি না করে থাকেন, তবে অবিলম্বে আমাদের সাথে যোগাযোগ করুন।`,
      type: 'password_changed',
      sentAt: dateStr,
    };

    recordSentEmail(confirmEmail);

    return {
      success: true,
      message: 'পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে এবং আপনি স্বয়ংক্রিয়ভাবে লগইন হয়েছেন!',
      user: updatedUser,
      sentEmail: confirmEmail,
    };
  } catch (e) {
    return { success: false, message: 'ত্রুটি ঘটেছে, অনুগ্রহ করে আবার চেষ্টা করুন।' };
  }
};

// 11. Logout Customer
export const logoutCustomer = (): void => {
  setCurrentCustomer(null);
};
