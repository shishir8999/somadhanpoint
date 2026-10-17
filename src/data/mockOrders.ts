import { Order } from '../types';

export interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  timeAgo?: string;
  customerName: string;
  phone: string;
  address: string;
  products: Array<{ name: string; qty: number; visualType: string; image?: string }>;
  amount: number;
  deliveryCharge: number;
  advance: number;
  discount: number;
  status:
    | 'Delivered'
    | 'Pending Response'
    | 'Cancelled'
    | 'No Response'
    | 'In Transit'
    | 'Processing'
    | 'Fake'
    | 'On Hold'
    | 'Incomplete'
    | 'Confirmed'
    | 'Pending'
    | 'New';
  courier: string;
  courierTrackingCode?: string;
  source?: string;
  notes?: string;
  employee: string;
}

export const ADMIN_ORDERS_STORAGE_KEY = 'ummah_admin_orders_list';

export const DEFAULT_MOCK_ORDERS: OrderItem[] = [
  {
    id: '57514',
    orderNumber: '57514',
    date: '29 Sept 26 • 9.17 PM',
    timeAgo: '3d ago',
    customerName: 'নাদিয়া ইয়াসমিন',
    phone: '01465135670',
    address: 'গুলশান ১, রোড ১, বাড়ি ৫০১, ঢাকা',
    products: [{ name: 'Kids mix Cotton...', qty: 2, visualType: 'kids_khimar_pink' }],
    amount: 1860,
    deliveryCharge: 80,
    advance: 0,
    discount: 0,
    status: 'Delivered',
    courier: 'Steadfast',
    notes: 'আজকের মধ্যে ডেলিভারি লাগবে।',
    employee: 'Employee 1',
  },
  {
    id: '57510',
    orderNumber: '57510',
    date: '29 Sept 26 • 3.21 PM',
    timeAgo: '4d ago',
    customerName: 'রেহানা বেগম',
    phone: '01925932193',
    address: 'মুগদা, রোড ৫, বাড়ি ৩১১, সিলেট',
    products: [
      { name: 'Digital Potato...', qty: 2, visualType: 'potato_chipper' },
      { name: '3D Hourglass...', qty: 2, visualType: 'wooden_wall_clock' },
      { name: 'Kids Cotton...', qty: 1, visualType: 'cotton_khimar_red' },
      { name: 'Silver Crest...', qty: 2, visualType: 'silver_crest_kettle' },
    ],
    amount: 7640,
    deliveryCharge: 60,
    advance: 0,
    discount: 0,
    status: 'Delivered',
    courier: 'Steadfast',
    employee: 'Employee 2',
  },
  {
    id: '57509',
    orderNumber: '57509',
    date: '29 Sept 26 • 2.07 AM',
    timeAgo: '4d ago',
    customerName: 'শেহরিয়ার কবির',
    phone: '01468417947',
    address: 'ফ্ল্যাট ৩বি, হাউস ২২, রোড ৫, উত্তরা, ঢাকা',
    products: [
      { name: 'Kids Cotton...', qty: 3, visualType: 'kids_khimar_pink' },
      { name: 'Kids mix...', qty: 1, visualType: 'cotton_khimar_red' },
      { name: 'Four In One...', qty: 3, visualType: 'circulating_fan' },
      { name: 'Surpass...', qty: 3, visualType: 'flashlight_speaker' },
    ],
    amount: 9650,
    deliveryCharge: 120,
    advance: 0,
    discount: 0,
    status: 'Delivered',
    courier: 'Steadfast',
    employee: 'Employee 1',
  },
  {
    id: '57508',
    orderNumber: '57508',
    date: '29 Sept 26 • 2.27 PM',
    timeAgo: '4d ago',
    customerName: 'বেলায়েত হোসেন',
    phone: '01966189294',
    address: 'বাড্ডা, গুলশান ২, রোড ১০৫, ঢাকা',
    products: [
      { name: 'Ultrapods Max...', qty: 2, visualType: 'ultrapods_max' },
      { name: 'President Tor...', qty: 1, visualType: 'president_jubba_white' },
      { name: 'Premium...', qty: 2, visualType: 'embroidered_panjabi' },
    ],
    amount: 5890,
    deliveryCharge: 150,
    advance: 0,
    discount: 0,
    status: 'Pending Response',
    courier: 'Steadfast',
    notes: 'পেমেন্ট ক্যাশ অন ডেলিভারি।',
    employee: 'Employee 1',
  },
  {
    id: '57503',
    orderNumber: '57503',
    date: '29 Sept 26 • 11.22 AM',
    timeAgo: '4d ago',
    customerName: 'তারিকুল ইসলাম',
    phone: '01863124247',
    address: 'মোহাম্মদপুর, ইসলাম টাওয়ার, ঢাকা',
    products: [{ name: "Men's Genuin... / 39", qty: 3, visualType: 'leather_half_shoe' }],
    amount: 3700,
    deliveryCharge: 100,
    advance: 0,
    discount: 0,
    status: 'Cancelled',
    courier: 'Steadfast',
    notes: 'কনফার্ম করার পর ফোন রিসিভ করেনি।',
    employee: 'Employee 3',
  },
  {
    id: '57498',
    orderNumber: '57498',
    date: '29 Sept 26 • 7.43 AM',
    timeAgo: '4d ago',
    customerName: 'মেহেদী হাসান',
    phone: '01530898251',
    address: 'দিনাজপুর, বালুবাড়ি, রোড ২',
    products: [
      { name: 'Smart Scalp...', qty: 1, visualType: 'scalp_massager' },
      { name: 'Premium...', qty: 2, visualType: 'school_bag_black' },
    ],
    amount: 3760,
    deliveryCharge: 120,
    advance: 0,
    discount: 0,
    status: 'No Response',
    courier: 'Steadfast',
    notes: 'পেমেন্ট ক্যাশ অন ডেলিভারি।',
    employee: 'Employee 1',
  },
  {
    id: '57492',
    orderNumber: '57492',
    date: '29 Sept 26 • 2.58 AM',
    timeAgo: '4d ago',
    customerName: 'মেহেদী হাসান',
    phone: '01462242446',
    address: 'বাড়ি নাম্বার ১৩, রোড নাম্বার ৩, ধানমন্ডি',
    products: [{ name: 'JioFi LTE-...', qty: 2, visualType: 'jiofi_router' }],
    amount: 3320,
    deliveryCharge: 120,
    advance: 0,
    discount: 0,
    status: 'In Transit',
    courier: 'Steadfast',
    notes: 'কনফার্ম করা হয়েছে।',
    employee: 'Employee 3',
  },
  {
    id: '57493',
    orderNumber: '57493',
    date: '29 Sept 26 • 2.07 AM',
    timeAgo: '4d ago',
    customerName: 'তামান্না ইয়াসমিন',
    phone: '01630070212',
    address: 'গ্রাম: রামপুর, পোস্ট: রামপুর, কুমিল্লা',
    products: [{ name: 'Premium...', qty: 1, visualType: 'laptop_bag' }],
    amount: 1450,
    deliveryCharge: 80,
    advance: 0,
    discount: 0,
    status: 'In Transit',
    courier: 'Steadfast',
    notes: 'কালকের মধ্যে ডেলিভারি।',
    employee: 'Employee 2',
  },
  {
    id: '57491',
    orderNumber: '57491',
    date: '29 Sept 26 • 1.03 AM',
    timeAgo: '4d ago',
    customerName: 'আনিসুর রহমান',
    phone: '01351347452',
    address: 'নারায়ণগঞ্জ, চাষাড়া, রোড ৪',
    products: [{ name: 'JioFi LTE-...', qty: 3, visualType: 'jiofi_router' }],
    amount: 4880,
    deliveryCharge: 80,
    advance: 0,
    discount: 0,
    status: 'In Transit',
    courier: 'Steadfast',
    employee: 'Employee 1',
  },
  {
    id: '57489',
    orderNumber: '57489',
    date: '28 Sept 26 • 10.11 PM',
    timeAgo: '4d ago',
    customerName: 'ফাতেমা খাতুন',
    phone: '01751597315',
    address: 'পাবনা, গোপালপুর, গ্রাম ও পোস্ট',
    products: [{ name: 'Smart Multi...', qty: 3, visualType: 'table_lamp' }],
    amount: 3620,
    deliveryCharge: 80,
    advance: 0,
    discount: 0,
    status: 'In Transit',
    courier: 'Steadfast',
    employee: 'Employee 3',
  },
  {
    id: '57472',
    orderNumber: '57472',
    date: '28 Sept 26 • 4.44 AM',
    timeAgo: '5d ago',
    customerName: 'মোহাম্মদ ইউসুফ',
    phone: '01662829947',
    address: 'বরিশাল, কাশিপুর, গ্রাম ও পোস্ট',
    products: [
      { name: 'Mini USB...', qty: 2, visualType: 'desktop_fan' },
      { name: 'Air 31 Wireless...', qty: 3, visualType: 'ultrapods_max' },
      { name: 'President Tor...', qty: 1, visualType: 'president_jubba_teal' },
    ],
    amount: 5830,
    deliveryCharge: 80,
    advance: 0,
    discount: 0,
    status: 'Delivered',
    courier: 'Steadfast',
    notes: 'কনফার্ম করা হয়েছে।',
    employee: 'Employee 1',
  },
  {
    id: '57465',
    orderNumber: '57465',
    date: '27 Sept 26 • 10.55 PM',
    timeAgo: '5d ago',
    customerName: 'বেলায়েত হোসেন',
    phone: '01480692697',
    address: 'উত্তরা, সেক্টর ৭, রোড ১৪, বাড়ি ১২',
    products: [
      { name: 'President Tor...', qty: 1, visualType: 'president_jubba_navy' },
      { name: 'Multifunction...', qty: 2, visualType: 'silver_crest_kettle' },
      { name: 'Vacuum Flask...', qty: 3, visualType: 'flashlight_speaker' },
      { name: 'Kids Cotton...', qty: 2, visualType: 'kids_khimar_pink' },
    ],
    amount: 7150,
    deliveryCharge: 60,
    advance: 0,
    discount: 0,
    status: 'Pending Response',
    courier: 'Steadfast',
    employee: 'Employee 1',
  },
  {
    id: '57460',
    orderNumber: '57460',
    date: '27 Sept 26 • 4.33 PM',
    timeAgo: '6d ago',
    customerName: 'মাহমুদা আক্তার',
    phone: '01431605090',
    address: 'দিনাজপুর, বালুবাড়ি, রোড ২',
    products: [
      { name: 'Mini USB...', qty: 2, visualType: 'desktop_fan' },
      { name: 'ZF18 Sensor...', qty: 1, visualType: 'scalp_massager' },
    ],
    amount: 3110,
    deliveryCharge: 60,
    advance: 0,
    discount: 0,
    status: 'Processing',
    courier: 'Steadfast',
    notes: 'কনফার্ম করা হয়েছে।',
    employee: 'Employee 3',
  },
  {
    id: '57456',
    orderNumber: '57456',
    date: '27 Sept 26 • 12.47 PM',
    timeAgo: '6d ago',
    customerName: 'বেলায়েত হোসেন',
    phone: '01722288218',
    address: 'হোল্ডিং ৪৫, ব্লক C, মিরপুর ১০, ঢাকা',
    products: [
      { name: 'Mini USB...', qty: 1, visualType: 'desktop_fan' },
      { name: 'Kids mix...', qty: 3, visualType: 'kids_khimar_pink' },
      { name: 'Laxasfit S9 pr...', qty: 3, visualType: 'laxasfit_s9' },
      { name: 'Rechargeable...', qty: 1, visualType: 'rechargeable_fan' },
    ],
    amount: 7300,
    deliveryCharge: 100,
    advance: 0,
    discount: 0,
    status: 'In Transit',
    courier: 'Steadfast',
    employee: 'Employee 1',
  },
  {
    id: '57457',
    orderNumber: '57457',
    date: '27 Sept 26 • 12.05 PM',
    timeAgo: '6d ago',
    customerName: 'কামরুল ইসলাম',
    phone: '01677314055',
    address: 'কুমিল্লা, ঝাউতলা, রোড ৩, বাসা ১২',
    products: [
      { name: 'Kids Cotton...', qty: 2, visualType: 'cotton_khimar_red' },
      { name: 'Kids mix...', qty: 1, visualType: 'kids_khimar_pink' },
      { name: 'Luxury Tissue...', qty: 2, visualType: 'wooden_tissue_box' },
    ],
    amount: 4650,
    deliveryCharge: 100,
    advance: 0,
    discount: 0,
    status: 'Fake',
    courier: 'Steadfast',
    notes: 'আজকের মধ্যে ডেলিভারি।',
    employee: 'Employee 1',
  },
  {
    id: '57452',
    orderNumber: '57452',
    date: '27 Sept 26 • 6.56 AM',
    timeAgo: '6d ago',
    customerName: 'জাহাঙ্গীর আলম',
    phone: '01343148035',
    address: 'দিনাজপুর, বালুবাড়ি, রোড ২',
    products: [
      { name: 'Multifunction...', qty: 2, visualType: 'silver_crest_kettle' },
      { name: 'Kids Cherry...', qty: 1, visualType: 'cotton_khimar_red' },
      { name: 'ZF18 Sensor...', qty: 1, visualType: 'scalp_massager' },
      { name: 'Premium...', qty: 3, visualType: 'embroidered_panjabi' },
    ],
    amount: 6750,
    deliveryCharge: 80,
    advance: 0,
    discount: 0,
    status: 'Fake',
    courier: 'Steadfast',
    employee: 'Employee 3',
  },
  {
    id: '57450',
    orderNumber: '57450',
    date: '27 Sept 26 • 5.56 AM',
    timeAgo: '6d ago',
    customerName: 'মুমতাহা বেগম',
    phone: '01528401282',
    address: 'যাত্রাবাড়ী, শহীদ জাহির রায়হান রোড',
    products: [
      { name: 'Kids Cotton...', qty: 2, visualType: 'cotton_khimar_red' },
      { name: 'JioFi LTE-...', qty: 2, visualType: 'jiofi_router' },
      { name: 'T900 Ultra 2...', qty: 3, visualType: 't900_ultra' },
    ],
    amount: 7560,
    deliveryCharge: 60,
    advance: 0,
    discount: 0,
    status: 'Delivered',
    courier: 'Steadfast',
    employee: 'Employee 2',
  },
  {
    id: '57449',
    orderNumber: '57449',
    date: '27 Sept 26 • 5.06 AM',
    timeAgo: '6d ago',
    customerName: 'শুভাশিস ঘোষ',
    phone: '01929520539',
    address: 'গাজীপুর, চান্দা বাজার, বাড়ি ৪৫',
    products: [{ name: 'Surpass...', qty: 3, visualType: 'flashlight_speaker' }],
    amount: 3300,
    deliveryCharge: 150,
    advance: 0,
    discount: 0,
    status: 'Pending Response',
    courier: 'Steadfast',
    notes: 'কনফার্ম করার পর ফোন রিসিভ করেনি।',
    employee: 'Employee 1',
  },
  {
    id: '57434',
    orderNumber: '57434',
    date: '24 Sept 26 • 4.27 PM',
    timeAgo: '9d ago',
    customerName: 'সাব্বির হোসেন',
    phone: '01639073330',
    address: 'বসুন্ধরা, ব্লক E, ফ্ল্যাট ৪B',
    products: [
      { name: 'Hanging Neck...', qty: 3, visualType: 'neck_fan' },
      { name: 'AAA 1.5V...', qty: 1, visualType: 'table_lamp' },
      { name: 'Cotton Panel...', qty: 1, visualType: 'cotton_bedsheet' },
    ],
    amount: 4620,
    deliveryCharge: 120,
    advance: 0,
    discount: 0,
    status: 'On Hold',
    courier: 'Steadfast',
    notes: 'আজকের মধ্যে লাগবে।',
    employee: 'Employee 3',
  },
  {
    id: '57432',
    orderNumber: '57432',
    date: '24 Sept 26 • 3.41 PM',
    timeAgo: '9d ago',
    customerName: 'শুভাশিস ঘোষ',
    phone: '01870723661',
    address: 'যাত্রাবাড়ী, শহীদ জাহির রায়হান রোড, বাড়ি ৯১, খুলনা',
    products: [
      { name: 'Portable Retr...', qty: 1, visualType: 'potato_chipper' },
      { name: 'Furniture Eas...', qty: 2, visualType: 'furniture_moving_set' },
      { name: 'Kids mix...', qty: 1, visualType: 'kids_khimar_pink' },
      { name: 'Kids Cotton...', qty: 1, visualType: 'cotton_khimar_red' },
    ],
    amount: 4180,
    deliveryCharge: 60,
    advance: 0,
    discount: 0,
    status: 'Cancelled',
    courier: 'Steadfast',
    notes: 'আজকের মধ্যে লাগবে।',
    employee: 'Employee 1',
  },
];

/**
 * Loads stored admin orders from localStorage.
 * If user has explicitly modified/deleted orders (even if empty []), returns that.
 * Only returns default mock orders on fresh first run.
 */
export const getStoredAdminOrders = (): OrderItem[] => {
  if (typeof window === 'undefined') return DEFAULT_MOCK_ORDERS;
  try {
    const saved = localStorage.getItem(ADMIN_ORDERS_STORAGE_KEY);
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse admin orders from localStorage', e);
  }
  return DEFAULT_MOCK_ORDERS;
};

/**
 * Persists admin orders into localStorage.
 */
export const saveStoredAdminOrders = (orders: OrderItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADMIN_ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('ummah_admin_orders_updated'));
  } catch (e) {
    console.error('Failed to save orders to localStorage', e);
  }
};

/**
 * Resets admin orders back to demo mock orders.
 */
export const resetStoredAdminOrders = (): OrderItem[] => {
  saveStoredAdminOrders(DEFAULT_MOCK_ORDERS);
  return DEFAULT_MOCK_ORDERS;
};

/**
 * Helper to append a newly placed customer Order into the Admin Orders list.
 */
export const appendOrderToAdminList = (order: Order): void => {
  if (typeof window === 'undefined') return;
  try {
    const currentList = getStoredAdminOrders();
    const newAdminOrder: OrderItem = {
      id: String(order.id),
      orderNumber: String(order.id),
      date: 'Just now',
      timeAgo: 'Just now',
      customerName: order.customerName || 'গ্রাহক',
      phone: order.customerPhone || '',
      address: order.customerAddress || 'ঢাকা',
      products: Array.isArray(order.items)
        ? order.items.map((it) => ({
            name: it.product?.name || 'পণ্য',
            qty: it.quantity || 1,
            visualType: it.product?.visualType || 'kids_khimar_pink',
          }))
        : [{ name: 'অর্ডার আইটেম', qty: 1, visualType: 'kids_khimar_pink' }],
      amount: order.total || 0,
      deliveryCharge: order.deliveryFee || 0,
      advance: 0,
      discount: order.discount || 0,
      status: (order.status as any) || 'Pending',
      courier: order.courier || 'Steadfast',
      courierTrackingCode: order.courierTrackingCode || '',
      notes: order.notes || 'Website Checkout',
      source: 'Website',
      employee: 'Employee 1',
    };
    const updated = [newAdminOrder, ...currentList.filter((o) => o.id !== newAdminOrder.id)];
    saveStoredAdminOrders(updated);
  } catch (e) {
    console.error('Failed to append order to admin list', e);
  }
};
