import React, { useState, useEffect } from 'react';
import {
  Search,
  User,
  Globe,
  Truck,
  Calendar,
  Phone,
  MessageCircle,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Printer,
  MessageSquare,
  Check,
  Plus,
  ExternalLink,
  Sun,
  Moon,
  Package,
  Users,
  FileText,
  Calculator,
  Mail,
  Layout,
  Settings,
  LayoutDashboard,
  CheckCircle2,
  Filter,
  X,
  Eye,
  Download
} from 'lucide-react';
import { ProductVisual } from './ProductVisual';
import { AdminSidebar, AdminPageType } from './AdminSidebar';
import { dispatchOrderToCourier } from '../utils/courierService';
import {
  OrderItem,
  getStoredAdminOrders,
  saveStoredAdminOrders,
  resetStoredAdminOrders,
} from '../data/mockOrders';

export type { OrderItem };

interface AdminOrdersPageProps {
  onBackToDashboard: () => void;
  onBackToStore: () => void;
  onNavigate?: (page: AdminPageType) => void;
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({
  onBackToDashboard,
  onBackToStore,
  onNavigate,
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState('all');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState('all');
  const [selectedCourierFilter, setSelectedCourierFilter] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState('Delivered');
  const [bulkEmployee, setBulkEmployee] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
  const [viewingOrder, setViewingOrder] = useState<OrderItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBulkSmsModalOpen, setIsBulkSmsModalOpen] = useState(false);
  const [bulkSmsText, setBulkSmsText] = useState('প্রিয় গ্রাহক, আপনার অর্ডারটি সফলভাবে প্রক্রিয়াধীন রয়েছে। ধন্যবাদ—ইকমবাইট');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Create Form States
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustProduct, setNewCustProduct] = useState('T900 Ultra 2 Smartwatch');
  const [newCustQty, setNewCustQty] = useState('1');
  const [newCustAmount, setNewCustAmount] = useState('1450');
  const [newCustDeliveryCharge, setNewCustDeliveryCharge] = useState('80');
  const [newCustCourier, setNewCustCourier] = useState('Steadfast');
  const [newCustEmployee, setNewCustEmployee] = useState('Employee 1');
  const [newCustNotes, setNewCustNotes] = useState('');

  // Direct Courier Dispatch States
  const [courierDispatchOrder, setCourierDispatchOrder] = useState<OrderItem | null>(null);
  const [selectedCourierProvider, setSelectedCourierProvider] = useState<'Steadfast' | 'Pathao' | 'RedX'>('Steadfast');
  const [courierCodAmount, setCourierCodAmount] = useState<number>(0);
  const [courierNotes, setCourierNotes] = useState('');
  const [isBulkCourierModalOpen, setIsBulkCourierModalOpen] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  const handleOpenCourierModal = (ord: OrderItem) => {
    setCourierDispatchOrder(ord);
    setSelectedCourierProvider('Steadfast');
    setCourierCodAmount(ord.amount);
    setCourierNotes(ord.notes || 'Handle with care - Cash on delivery');
  };

  const handleConfirmCourierDispatch = async () => {
    if (!courierDispatchOrder) return;
    setIsDispatching(true);

    const res = await dispatchOrderToCourier({
      orderId: courierDispatchOrder.id,
      orderNumber: courierDispatchOrder.orderNumber,
      customerName: courierDispatchOrder.customerName,
      customerPhone: courierDispatchOrder.phone,
      customerAddress: courierDispatchOrder.address,
      codAmount: courierCodAmount,
      deliveryCharge: courierDispatchOrder.deliveryCharge,
      courier: selectedCourierProvider,
      notes: courierNotes,
    });

    setOrdersList((prev) =>
      prev.map((o) =>
        o.id === courierDispatchOrder.id
          ? {
              ...o,
              courier: selectedCourierProvider,
              courierTrackingCode: res.consignment.trackingCode,
              status: 'In Transit',
            }
          : o
      )
    );

    setIsDispatching(false);
    setCourierDispatchOrder(null);
    showToast(res.message);
  };

  const handleConfirmBulkCourierDispatch = async () => {
    if (selectedOrderIds.length === 0) return;
    setIsDispatching(true);

    const targetOrders = ordersList.filter((o) => selectedOrderIds.includes(o.id));
    for (const ord of targetOrders) {
      await dispatchOrderToCourier({
        orderId: ord.id,
        orderNumber: ord.orderNumber,
        customerName: ord.customerName,
        customerPhone: ord.phone,
        customerAddress: ord.address,
        codAmount: ord.amount,
        deliveryCharge: ord.deliveryCharge,
        courier: selectedCourierProvider,
        notes: ord.notes || 'Bulk Dispatch',
      });
    }

    setOrdersList((prev) =>
      prev.map((o) =>
        selectedOrderIds.includes(o.id)
          ? {
              ...o,
              courier: selectedCourierProvider,
              courierTrackingCode: `STF-${o.orderNumber}`,
              status: 'In Transit',
            }
          : o
      )
    );

    setIsDispatching(false);
    setIsBulkCourierModalOpen(false);
    showToast(`সফলভাবে ${targetOrders.length}টি অর্ডার ${selectedCourierProvider} কুরিয়ারে প্রেরণ করা হয়েছে!`);
  };

  // Regular essential order statuses for e-commerce
  const REGULAR_STATUS_OPTIONS = [
    { value: 'All', label: 'সকল অর্ডার (All Orders)' },
    { value: 'Pending', label: 'পেন্ডিং / নতুন (Pending)' },
    { value: 'Confirmed', label: 'কনফার্মড (Confirmed)' },
    { value: 'Processing', label: 'প্রক্রিয়াধীন (Processing)' },
    { value: 'In Transit', label: 'কুরিয়ারে / ট্রানজিট (In Transit)' },
    { value: 'Delivered', label: 'ডেলিভারি সম্পন্ন (Delivered)' },
    { value: 'Cancelled', label: 'বাতিল (Cancelled)' },
    { value: 'Returned', label: 'রিটার্ন (Returned)' },
    { value: 'On Hold', label: 'স্থগিত / হোল্ড (On Hold)' },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Persistent orders dataset loaded from localStorage or default mock
  const [ordersList, setOrdersList] = useState<OrderItem[]>(getStoredAdminOrders);

  // Automatically save to localStorage on every change
  useEffect(() => {
    saveStoredAdminOrders(ordersList);
  }, [ordersList]);

  // Status badge color mapper
  const getStatusBadge = (status: OrderItem['status'] | string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'In Transit':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Confirmed':
        return 'bg-teal-50 text-teal-700 border border-teal-200';
      case 'Processing':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'Pending':
      case 'Pending Response':
      case 'New':
        return 'bg-amber-50 text-amber-800 border border-amber-200';
      case 'Cancelled':
      case 'Fake':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'Returned':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'On Hold':
        return 'bg-yellow-50 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  // Filter orders based on dropdowns & search
  const filteredOrders = ordersList.filter((ord) => {
    // 1. Status Filter Dropdown
    const matchesStatus =
      selectedStatusTab === 'All'
        ? true
        : selectedStatusTab === 'Pending'
        ? ['Pending', 'Pending Response', 'New', 'Incomplete', 'No Response'].includes(ord.status)
        : selectedStatusTab === 'Cancelled'
        ? ['Cancelled', 'Fake'].includes(ord.status)
        : ord.status.toLowerCase() === selectedStatusTab.toLowerCase();

    // 2. Order Search
    const matchesOrderSearch =
      searchOrderQuery.trim() === '' ||
      ord.orderNumber.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      ord.phone.includes(searchOrderQuery) ||
      ord.address.toLowerCase().includes(searchOrderQuery.toLowerCase());

    // 3. Product Search
    const matchesProductSearch =
      searchProductQuery.trim() === '' ||
      ord.products.some((p) => p.name.toLowerCase().includes(searchProductQuery.toLowerCase()));

    // 4. Employee Filter
    const matchesEmployee =
      selectedEmployeeFilter === 'all' || ord.employee === selectedEmployeeFilter;

    // 5. Courier Filter
    const matchesCourier =
      selectedCourierFilter === 'all' ||
      ord.courier.toLowerCase() === selectedCourierFilter.toLowerCase();

    // 6. Source Filter
    const matchesSource =
      selectedSourceFilter === 'all' ||
      (ord.source || 'Website').toLowerCase() === selectedSourceFilter.toLowerCase();

    return matchesStatus && matchesOrderSearch && matchesProductSearch && matchesEmployee && matchesCourier && matchesSource;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplyBulkAction = () => {
    if (selectedOrderIds.length === 0) {
      showToast('দয়া করে অন্তত একটি অর্ডার নির্বাচন করুন।');
      return;
    }
    setOrdersList((prev) =>
      prev.map((o) => {
        if (selectedOrderIds.includes(o.id)) {
          return {
            ...o,
            status: (bulkStatus as any) || o.status,
            employee: bulkEmployee || o.employee,
          };
        }
        return o;
      })
    );
    showToast(`${selectedOrderIds.length} টি অর্ডারে স্ট্যাটাস ও এমপ্লয়ি সফলভাবে আপডেট হয়েছে!`);
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm('আপনি কি সত্যিই এই অর্ডারটি মুছে ফেলতে চান?')) {
      const next = ordersList.filter((o) => o.id !== id);
      setOrdersList(next);
      saveStoredAdminOrders(next);
      setSelectedOrderIds((prev) => prev.filter((item) => item !== id));
      if (viewingOrder?.id === id) setViewingOrder(null);
      if (editingOrder?.id === id) setEditingOrder(null);
      showToast('অর্ডার সফলভাবে মুছে ফেলা হয়েছে।');
    }
  };

  const handleBulkDeleteOrders = () => {
    if (selectedOrderIds.length === 0) {
      showToast('দয়া করে কমপক্ষে একটি অর্ডার নির্বাচন করুন।');
      return;
    }
    const count = selectedOrderIds.length;
    if (confirm(`আপনি কি সত্যিই নির্বাচিত ${count} টি অর্ডার একসাথে মুছে ফেলতে চান?`)) {
      const next = ordersList.filter((o) => !selectedOrderIds.includes(o.id));
      setOrdersList(next);
      saveStoredAdminOrders(next);
      if (viewingOrder && selectedOrderIds.includes(viewingOrder.id)) setViewingOrder(null);
      if (editingOrder && selectedOrderIds.includes(editingOrder.id)) setEditingOrder(null);
      setSelectedOrderIds([]);
      showToast(`${count} টি অর্ডার সফলভাবে মুছে ফেলা হয়েছে!`);
    }
  };

  const handleResetDefaultOrders = () => {
    if (confirm('আপনি কি ডেমো অর্ডার তালিকা আবার ফিরিয়ে আনতে চান?')) {
      const restored = resetStoredAdminOrders();
      setOrdersList(restored);
      setSelectedOrderIds([]);
      showToast('ডেমো অর্ডার সফলভাবে ফিরিয়ে আনা হয়েছে!');
    }
  };

  const handlePrintOrder = (ord: OrderItem) => {
    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (!printWindow) {
      alert('পপআপ উইন্ডো ব্লক করা রয়েছে। অনুগ্রহ করে ব্রাউজার সেটিংস থেকে পপআপ অ্যালাউ করুন।');
      return;
    }
    const itemsHtml = ord.products
      .map(
        (p, idx) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: center;">${idx + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 600; color: #0f172a;">${p.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: center; font-weight: bold;">${p.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: right;">৳${Math.round(ord.amount / ord.products.reduce((acc, i) => acc + i.qty, 1)).toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: right; font-weight: bold; color: #0f172a;">৳${ord.amount.toLocaleString()}</td>
      </tr>
    `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>ইনভয়েস - #${ord.orderNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap');
            body { font-family: 'Hind Siliguri', 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 30px; margin: 0; background: #fff; }
            .invoice-box { max-width: 760px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #990000; padding-bottom: 16px; margin-bottom: 20px; }
            .brand-name { font-size: 24px; font-weight: 800; color: #990000; }
            .order-tag { font-size: 13px; color: #64748b; margin-top: 4px; font-weight: 600; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
            .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; font-size: 12px; }
            .info-card h4 { margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
            .info-card p { margin: 4px 0; line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #cbd5e1; }
            .totals { margin-left: auto; width: 300px; }
            .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 12px; border-bottom: 1px solid #f1f5f9; }
            .grand-total { font-size: 15px; font-weight: 800; color: #990000; border-top: 2px solid #cbd5e1; border-bottom: 2px solid #cbd5e1; margin-top: 6px; padding: 10px 0; }
            .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 14px; }
            .status-badge { display: inline-block; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; background: #fee2e2; color: #990000; }
            @media print {
              body { padding: 0; background: #fff; }
              .invoice-box { border: none; padding: 0; box-shadow: none; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div>
                <div class="brand-name">Somadhan Point</div>
                <div class="order-tag">অর্ডার ইনভয়েস: #${ord.orderNumber} | তারিখ: ${ord.date}</div>
                <div style="margin-top: 6px;"><span class="status-badge">${ord.status}</span></div>
              </div>
              <div style="text-align: right; font-size: 12px; color: #475569;">
                <div style="font-weight: bold; font-size: 14px; color: #0f172a;">Somadhan Point E-Commerce</div>
                <div>হেল্পলাইন: 01800000000</div>
                <div>অ্যাসাইন কর্মী: ${ord.employee || 'Admin'}</div>
              </div>
            </div>

            <div class="grid">
              <div class="info-card">
                <h4>গ্রাহকের তথ্য (Customer Details)</h4>
                <p><strong>নাম:</strong> ${ord.customerName}</p>
                <p><strong>মোবাইল:</strong> ${ord.phone}</p>
                <p><strong>ঠিকানা:</strong> ${ord.address}</p>
              </div>
              <div class="info-card">
                <h4>ডেলিভারি ও কুরিয়ার (Fulfillment)</h4>
                <p><strong>কুরিয়ার:</strong> ${ord.courier} ${ord.courierTrackingCode ? `(${ord.courierTrackingCode})` : ''}</p>
                <p><strong>উৎস:</strong> ${ord.source || 'Website'}</p>
                <p><strong>স্ট্যাটাস:</strong> ${ord.status}</p>
                ${ord.notes ? `<p><strong>নোট:</strong> ${ord.notes}</p>` : ''}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 30px; text-align: center;">#</th>
                  <th>আইটেম বিবরণ</th>
                  <th style="text-align: center; width: 60px;">পরিমাণ</th>
                  <th style="text-align: right; width: 100px;">মূল্য</th>
                  <th style="text-align: right; width: 110px;">মোট</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="totals">
              <div class="total-row"><span>পণ্য মূল্য:</span><span>৳${(ord.amount - (ord.deliveryCharge || 0)).toLocaleString()}</span></div>
              <div class="total-row"><span>ডেলিভারি চার্জ:</span><span>+ ৳${(ord.deliveryCharge || 0).toLocaleString()}</span></div>
              ${ord.advance ? `<div class="total-row"><span>অগ্রিম পরিশোধ:</span><span>- ৳${ord.advance.toLocaleString()}</span></div>` : ''}
              ${ord.discount ? `<div class="total-row"><span>ডিসকাউন্ট:</span><span>- ৳${ord.discount.toLocaleString()}</span></div>` : ''}
              <div class="total-row grand-total"><span>ক্যাশ অন ডেলিভারি (প্রদেয়):</span><span>৳${(ord.amount - (ord.advance || 0)).toLocaleString()}</span></div>
            </div>

            <div class="footer">
              <p>আমাদের সাথে কেনাকাটা করার জন্য ধন্যবাদ! কোনো সমস্যা হলে হেল্পলাইনে যোগাযোগ করুন।</p>
              <p style="font-size: 10px; color: #cbd5e1;">সিস্টেম জেনারেটেড ইনভয়েস • কোনো সিল বা স্বাক্ষরের প্রয়োজন নেই</p>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) return;

    const newOrder: OrderItem = {
      id: String(Date.now()).slice(-5),
      orderNumber: String(Date.now()).slice(-5),
      date: 'Just now',
      timeAgo: '1m ago',
      customerName: newCustName,
      phone: newCustPhone,
      address: newCustAddress || 'ঢাকা',
      products: [
        {
          name: newCustProduct,
          qty: parseInt(newCustQty) || 1,
          visualType: 't900_ultra',
        },
      ],
      amount: parseInt(newCustAmount) || 1450,
      deliveryCharge: parseInt(newCustDeliveryCharge) || 80,
      advance: 0,
      discount: 0,
      status: 'Confirmed',
      courier: newCustCourier,
      employee: newCustEmployee,
      notes: newCustNotes,
      source: 'Manual',
    };

    setOrdersList([newOrder, ...ordersList]);
    setIsCreateModalOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewCustNotes('');
    showToast(`নতুন অর্ডার #${newOrder.orderNumber} সফলভাবে তৈরি করা হয়েছে!`);
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="orders"
        onNavigate={(page) => {
          if (page === 'dashboard') onBackToDashboard();
          else if (onNavigate) onNavigate(page);
        }}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Order Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Row 1: Search & Dropdown Filters */}
        <div className="bg-white border-b border-slate-200 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          {/* Quick Create + Icon */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center hover:bg-rose-100 transition-colors cursor-pointer shadow-2xs"
              title="নতুন অর্ডার তৈরি করুন (Create Order)"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Search orders */}
            <div className="relative w-48 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchOrderQuery}
                onChange={(e) => setSearchOrderQuery(e.target.value)}
                placeholder="Search orders."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#990000]"
              />
            </div>

            {/* Search product */}
            <div className="relative w-40 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchProductQuery}
                onChange={(e) => setSearchProductQuery(e.target.value)}
                placeholder="Search product"
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#990000]"
              />
            </div>
          </div>

          {/* Right Dropdown Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* 1. Status Filter Dropdown */}
            <div className="flex items-center border-2 border-rose-300 rounded-lg px-2.5 py-1.5 bg-white shadow-2xs hover:border-[#990000] transition-colors">
              <Filter className="w-3.5 h-3.5 text-[#990000] mr-1.5 shrink-0" />
              <select
                value={selectedStatusTab}
                onChange={(e) => setSelectedStatusTab(e.target.value)}
                className="bg-transparent text-slate-900 font-bold focus:outline-none text-xs cursor-pointer"
              >
                {REGULAR_STATUS_OPTIONS.map((opt) => {
                  const count =
                    opt.value === 'All'
                      ? ordersList.length
                      : opt.value === 'Pending'
                      ? ordersList.filter((o) =>
                          ['Pending', 'Pending Response', 'New', 'Incomplete', 'No Response'].includes(o.status)
                        ).length
                      : opt.value === 'Cancelled'
                      ? ordersList.filter((o) => ['Cancelled', 'Fake'].includes(o.status)).length
                      : ordersList.filter(
                          (o) => o.status.toLowerCase() === opt.value.toLowerCase()
                        ).length;

                  return (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 2. Employee filter */}
            <div className="flex items-center border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white shadow-2xs">
              <User className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <select
                value={selectedEmployeeFilter}
                onChange={(e) => setSelectedEmployeeFilter(e.target.value)}
                className="bg-transparent text-slate-700 font-medium focus:outline-none text-xs cursor-pointer"
              >
                <option value="all">All Employees</option>
                <option value="Employee 1">Employee 1</option>
                <option value="Employee 2">Employee 2</option>
                <option value="Employee 3">Employee 3</option>
              </select>
            </div>

            {/* 3. Source filter */}
            <div className="flex items-center border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <select
                value={selectedSourceFilter}
                onChange={(e) => setSelectedSourceFilter(e.target.value)}
                className="bg-transparent text-slate-700 font-medium focus:outline-none text-xs cursor-pointer"
              >
                <option value="all">All Source</option>
                <option value="Website">Website</option>
                <option value="Facebook">Facebook</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {/* 4. Courier filter */}
            <div className="flex items-center border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white shadow-2xs">
              <Truck className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <select
                value={selectedCourierFilter}
                onChange={(e) => setSelectedCourierFilter(e.target.value)}
                className="bg-transparent text-slate-700 font-medium focus:outline-none text-xs cursor-pointer"
              >
                <option value="all">All Courier</option>
                <option value="Steadfast">Steadfast</option>
                <option value="Pathao">Pathao</option>
                <option value="RedX">RedX</option>
              </select>
            </div>

            {/* 5. Date filter */}
            <div className="flex items-center border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <select
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="bg-transparent text-slate-700 font-medium focus:outline-none text-xs cursor-pointer"
              >
                <option value="all">All time</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="This Month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Header Row 3: Bulk Actions Bar */}
        <div className="bg-[#fafafa] border-b border-slate-200 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#990000]">
              Selected ({selectedOrderIds.length})
            </span>

            <button
              onClick={() => setIsBulkSmsModalOpen(true)}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-50 flex items-center gap-1 font-medium cursor-pointer"
            >
              <MessageSquare className="w-3 h-3 text-slate-500" />
              <span>SMS</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-50 flex items-center gap-1 font-medium cursor-pointer"
            >
              <Printer className="w-3 h-3 text-slate-500" />
              <span>Print</span>
            </button>

            <button
              onClick={() => {
                if (selectedOrderIds.length === 0) {
                  alert('অনুগ্রহ করে কমপক্ষে একটি অর্ডার নির্বাচন করুন');
                  return;
                }
                setIsBulkCourierModalOpen(true);
              }}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              title="সিলেক্টেড অর্ডারগুলো সরাসরি কুরিয়ারে পাঠান"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Send to Courier ({selectedOrderIds.length})</span>
            </button>

            <button
              onClick={handleBulkDeleteOrders}
              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="নির্বাচিত অর্ডারগুলো একসাথে ডিলিট করুন"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Delete ({selectedOrderIds.length})</span>
            </button>

            {/* Dropdowns */}
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 font-medium text-xs focus:outline-none cursor-pointer"
            >
              <option value="">Update status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="On Hold">On Hold</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </select>

            <select
              value={bulkEmployee}
              onChange={(e) => setBulkEmployee(e.target.value)}
              className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 font-medium text-xs focus:outline-none cursor-pointer"
            >
              <option value="">Assign employee</option>
              <option value="Employee 1">Employee 1</option>
              <option value="Employee 2">Employee 2</option>
              <option value="Employee 3">Employee 3</option>
            </select>

            <button
              onClick={handleApplyBulkAction}
              className="px-3 py-1 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3 h-3" />
              <span>Apply</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            {selectedStatusTab !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-[#990000] border border-rose-200 font-bold text-[11px]">
                <span>ফিল্টার: {selectedStatusTab}</span>
                <button
                  type="button"
                  onClick={() => setSelectedStatusTab('All')}
                  className="hover:bg-rose-200 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[#990000] cursor-pointer"
                  title="ফিল্টার রিসেট করুন"
                >
                  ✕
                </button>
              </span>
            )}
            <div>
              মোট অর্ডার: <strong className="text-slate-900">{filteredOrders.length}</strong> টি
            </div>
          </div>
        </div>

        {/* 3. Main Data Table */}
        <div className="flex-1 overflow-x-auto p-4 sm:p-6 bg-[#f8fafc]">
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <th className="p-3 w-8">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectedOrderIds.length > 0 &&
                        selectedOrderIds.length === filteredOrders.length
                      }
                      className="rounded border-slate-300 text-[#990000] focus:ring-0 cursor-pointer w-4 h-4"
                      title="সবগুলো অর্ডার একসাথে সিলেক্ট করতে এখানে ক্লিক করুন"
                    />
                  </th>
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">Customer</th>
                  <th className="p-2.5">Products</th>
                  <th className="p-2.5">Amount</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Courier</th>
                  <th className="p-2.5">Notes</th>
                  <th className="p-2.5">Assign</th>
                  <th className="px-3 py-2.5 text-center sticky right-0 bg-[#f8fafc] border-l border-slate-200 z-10 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] min-w-[170px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-10 text-center text-slate-500 text-xs">
                      <p className="font-semibold text-slate-600 mb-1">কোনো অর্ডার পাওয়া যায়নি</p>
                      <p className="text-[11px] text-slate-400 mb-2">আপনি নির্বাচিত অর্ডারগুলো ডিলিট করেছেন অথবা কোনো ফিল্টারের সাথে মিলছে না।</p>
                      <button
                        onClick={handleResetDefaultOrders}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-[#990000] border border-rose-200 rounded font-semibold text-xs cursor-pointer transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>ডেমো অর্ডারগুলো রিস্টোর করতে এখানে ক্লিক করুন</span>
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const isSelected = selectedOrderIds.includes(ord.id);
                    return (
                      <tr
                        key={ord.id}
                        className={`group hover:bg-slate-50/80 transition-colors ${
                          isSelected ? 'bg-red-50/20' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="p-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(ord.id)}
                            className="rounded border-slate-300 text-[#990000] focus:ring-0"
                          />
                        </td>

                        {/* Order ID & Date */}
                        <td className="p-2.5 whitespace-nowrap">
                          <span className="font-bold text-slate-900 block text-xs">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{ord.date}</span>
                          <span className="text-[10px] text-slate-400 font-medium block">
                            {ord.timeAgo}
                          </span>
                        </td>

                        {/* Customer Info */}
                        <td className="p-2.5 min-w-[160px] max-w-[190px]">
                          <span className="font-bold text-slate-900 block text-xs truncate">
                            {ord.customerName}
                          </span>
                          <div className="flex items-center gap-1.5 my-0.5">
                            <span className="text-slate-600 text-xs font-mono">{ord.phone}</span>
                            <a
                              href={`tel:${ord.phone}`}
                              className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200"
                              title="Call"
                            >
                              <Phone className="w-2.5 h-2.5" />
                            </a>
                            <a
                              href={`https://wa.me/88${ord.phone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-2.5 h-2.5" />
                            </a>
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[170px]" title={ord.address}>
                            {ord.address}
                          </span>
                        </td>

                        {/* Products Thumbnails & Summary */}
                        <td className="p-2.5 min-w-[170px] max-w-[200px]">
                          <div className="space-y-1">
                            {ord.products.map((p, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                                  <ProductVisual visualType={p.visualType} />
                                </div>
                                <span className="text-[11px] font-medium text-slate-700 truncate max-w-[150px]">
                                  {p.qty}× {p.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="p-2.5 whitespace-nowrap">
                          <span className="font-bold text-slate-900 block text-xs">
                            ৳ {ord.amount.toLocaleString()}
                          </span>
                          <span className="text-[9px] text-slate-400 block">
                            Adv {ord.advance} • Disc {ord.discount}
                          </span>
                          <span className="text-[9px] text-slate-500 block font-medium">
                            Delivery {ord.deliveryCharge}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-2.5 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block ${getStatusBadge(
                              ord.status
                            )}`}
                          >
                            {ord.status}
                          </span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">
                            0 attempts
                          </span>
                        </td>

                        {/* Courier & Tracking */}
                        <td className="p-2.5 whitespace-nowrap">
                          <span className="font-semibold text-slate-800 block text-xs">{ord.courier}</span>
                          {ord.courierTrackingCode || ord.status === 'In Transit' || ord.status === 'Delivered' ? (
                            <a
                              href={`https://steadfast.com.bd/t/${ord.courierTrackingCode || 'STF-' + ord.orderNumber}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors mt-0.5"
                              title="কুরিয়ার লাইভ ট্র্যাকিং পেজ দেখুন"
                            >
                              <span>{ord.courierTrackingCode || `STF-${ord.orderNumber}`}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenCourierModal(ord)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded transition-colors mt-0.5 cursor-pointer shadow-2xs"
                              title="সরাসরি কুরিয়ারে পাঠান"
                            >
                              <Truck className="w-2.5 h-2.5" />
                              <span>কুরিয়ারে পাঠান</span>
                            </button>
                          )}
                        </td>

                        {/* Notes */}
                        <td className="p-2.5 min-w-[110px] max-w-[130px] text-slate-500 text-[10px]">
                          {ord.notes ? (
                            <span className="truncate block max-w-[110px]" title={ord.notes}>
                              {ord.notes}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Assign Employee */}
                        <td className="p-2.5 whitespace-nowrap text-slate-700 font-medium">
                          {ord.employee}
                        </td>

                        {/* Actions: Sticky to Right */}
                        <td
                          className={`px-3 py-2.5 text-center whitespace-nowrap sticky right-0 border-l border-slate-200 z-10 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] transition-colors ${
                            isSelected ? 'bg-red-50/95' : 'bg-white group-hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            {/* 1. View Invoice / Details */}
                            <button
                              type="button"
                              onClick={() => setViewingOrder(ord)}
                              className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center hover:bg-sky-100 hover:scale-105 transition-all cursor-pointer shadow-2xs"
                              title="অর্ডার ইনভয়েস দেখুন (View Invoice)"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* 2. Download / Print Slip */}
                            <button
                              type="button"
                              onClick={() => handlePrintOrder(ord)}
                              className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center hover:bg-indigo-100 hover:scale-105 transition-all cursor-pointer shadow-2xs"
                              title="ইনভয়েস প্রিন্ট / ডাউনলোড করুন (Print / Download Invoice)"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            {/* 3. Edit Order */}
                            <button
                              type="button"
                              onClick={() => setEditingOrder(ord)}
                              className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center hover:bg-amber-100 hover:scale-105 transition-all cursor-pointer shadow-2xs"
                              title="অর্ডার এডিট করুন (Edit Order)"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* 4. Delete Order */}
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(ord.id)}
                              className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center hover:bg-rose-100 hover:scale-105 transition-all cursor-pointer shadow-2xs"
                              title="অর্ডার মুছে ফেলুন (Delete Order)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* 5. Direct Courier Dispatch */}
                            <button
                              type="button"
                              onClick={() => handleOpenCourierModal(ord)}
                              className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 hover:scale-105 transition-all cursor-pointer shadow-2xs"
                              title="সরাসরি কুরিয়ারে পাঠান (Send to Courier)"
                            >
                              <Truck className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-center gap-1.5 text-xs">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(1)}
                className={`w-7 h-7 rounded text-xs font-bold ${
                  currentPage === 1 ? 'bg-[#990000] text-white' : 'border border-slate-200'
                }`}
              >
                1
              </button>
              <button
                onClick={() => setCurrentPage(2)}
                className={`w-7 h-7 rounded text-xs font-bold ${
                  currentPage === 2 ? 'bg-[#990000] text-white' : 'border border-slate-200'
                }`}
              >
                2
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button
                onClick={() => setCurrentPage(9)}
                className={`w-7 h-7 rounded text-xs font-bold ${
                  currentPage === 9 ? 'bg-[#990000] text-white' : 'border border-slate-200'
                }`}
              >
                9
              </button>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-[#111827] text-white px-4 py-2.5 rounded shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Create New Order Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">নতুন অর্ডার তৈরি করুন (Create Order)</h3>
                  <p className="text-[11px] text-slate-500">গ্রাহকের তথ্য ও পণ্যের বিবরণ দিয়ে অর্ডার এন্ট্রি করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">গ্রাহকের নাম *</label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="e.g. তানভীর হাসান"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#990000]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#990000] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">ডেলিভারি ঠিকানা *</label>
                <textarea
                  rows={2}
                  required
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="e.g. রোড ৪, বাড়ি ১২, ধানমন্ডি, ঢাকা"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">পণ্য</label>
                  <input
                    type="text"
                    value={newCustProduct}
                    onChange={(e) => setNewCustProduct(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#990000]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">পরিমাণ (Quantity)</label>
                  <input
                    type="number"
                    min="1"
                    value={newCustQty}
                    onChange={(e) => setNewCustQty(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">মোট মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={newCustAmount}
                    onChange={(e) => setNewCustAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#990000] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ডেলিভারি চার্জ (৳)</label>
                  <input
                    type="number"
                    value={newCustDeliveryCharge}
                    onChange={(e) => setNewCustDeliveryCharge(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">কুরিয়ার নির্বাচন</label>
                  <select
                    value={newCustCourier}
                    onChange={(e) => setNewCustCourier(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none"
                  >
                    <option value="Steadfast">Steadfast</option>
                    <option value="Pathao">Pathao</option>
                    <option value="RedX">RedX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">অ্যাসাইন এমপ্লয়ি</label>
                  <select
                    value={newCustEmployee}
                    onChange={(e) => setNewCustEmployee(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none"
                  >
                    <option value="Employee 1">Employee 1</option>
                    <option value="Employee 2">Employee 2</option>
                    <option value="Employee 3">Employee 3</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">বিশেষ নোট</label>
                <input
                  type="text"
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  placeholder="e.g. জরুরি ডেলিভারি, ফোন দিয়ে ডেলিভারি"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
                >
                  অর্ডার সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Bulk SMS Modal */}
      {isBulkSmsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Send Bulk SMS</h3>
                  <p className="text-[11px] text-slate-500">
                    নির্বাচিত {selectedOrderIds.length} জন গ্রাহককে SMS পাঠান
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkSmsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">মেসেজ টেমপ্লেট</label>
                <select
                  onChange={(e) => setBulkSmsText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none"
                >
                  <option value="প্রিয় গ্রাহক, আপনার অর্ডারটি সফলভাবে প্রক্রিয়াধীন রয়েছে। ধন্যবাদ—ইকমবাইট">
                    অর্ডার কনফার্মেশন মেসেজ
                  </option>
                  <option value="প্রিয় গ্রাহক, আপনার পার্সেলটি কুরিয়ারে হস্তান্তর করা হয়েছে। দ্রুতই ডেলিভারি পাবেন।">
                    কুরিয়ার হ্যান্ডওভার মেসেজ
                  </option>
                  <option value="প্রিয় গ্রাহক, আপনার অর্ডারটি আজ ডেলিভারি হতে পারে। অনুগ্রহ করে ফোন সচল রাখুন।">
                    আজকের ডেলিভারি অ্যালার্ট
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">SMS টেক্সট</label>
                <textarea
                  rows={4}
                  value={bulkSmsText}
                  onChange={(e) => setBulkSmsText(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#990000] leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setIsBulkSmsModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  setIsBulkSmsModalOpen(false);
                  showToast(`${selectedOrderIds.length} জন গ্রাহককে SMS সফলভাবে পাঠানো হয়েছে!`);
                }}
                className="px-5 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
              >
                SMS পাঠান ({selectedOrderIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Enhanced Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  অর্ডার আপডেট: #{editingOrder.orderNumber}
                </h3>
                <p className="text-[11px] text-slate-500">গ্রাহকের বিবরণ, স্ট্যাটাস ও কুরিয়ার তথ্য পরিবর্তন করুন</p>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">গ্রাহকের নাম</label>
                  <input
                    type="text"
                    value={editingOrder.customerName}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, customerName: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ফোন নম্বর</label>
                  <input
                    type="text"
                    value={editingOrder.phone}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ডেলিভারি ঠিকানা</label>
                <textarea
                  rows={2}
                  value={editingOrder.address}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">অর্ডার স্ট্যাটাস</label>
                  <select
                    value={editingOrder.status}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Pending">Pending (পেন্ডিং)</option>
                    <option value="Confirmed">Confirmed (কনফার্মড)</option>
                    <option value="Processing">Processing (প্রসেসিং)</option>
                    <option value="In Transit">In Transit (কুরিয়ারে)</option>
                    <option value="Delivered">Delivered (ডেলিভার্ড)</option>
                    <option value="On Hold">On Hold (অন হোল্ড)</option>
                    <option value="Cancelled">Cancelled (বাতিল)</option>
                    <option value="Returned">Returned (রিটার্নড)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">কুরিয়ার</label>
                  <select
                    value={editingOrder.courier}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, courier: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Steadfast">Steadfast</option>
                    <option value="Pathao">Pathao</option>
                    <option value="RedX">RedX</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">অ্যাসাইন এমপ্লয়ি</label>
                  <select
                    value={editingOrder.employee}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, employee: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Employee 1">Employee 1</option>
                    <option value="Employee 2">Employee 2</option>
                    <option value="Employee 3">Employee 3</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">মোট মূল্য (৳)</label>
                  <input
                    type="number"
                    value={editingOrder.amount}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        amount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">নোটস</label>
                <textarea
                  rows={2}
                  value={editingOrder.notes || ''}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="w-1/2 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  setOrdersList((prev) =>
                    prev.map((o) => (o.id === editingOrder.id ? editingOrder : o))
                  );
                  setEditingOrder(null);
                  showToast('অর্ডার সফলভাবে আপডেট হয়েছে!');
                }}
                className="w-1/2 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
              >
                সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Professional Order Details & Invoice Modal (দেখা যায় ও ডাউনলোড করা যায়) */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    অর্ডার ইনভয়েস: #{viewingOrder.orderNumber}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(
                      viewingOrder.status
                    )}`}
                  >
                    {viewingOrder.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  তারিখ: {viewingOrder.date} ({viewingOrder.timeAgo}) • উৎস: {viewingOrder.source || 'Website'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintOrder(viewingOrder)}
                  className="px-3 py-1.5 bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  title="ইনভয়েস প্রিন্ট বা ডাউনলোড করুন"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>প্রিন্ট / ডাউনলোড</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const ord = viewingOrder;
                    setViewingOrder(null);
                    setEditingOrder(ord);
                  }}
                  className="px-2.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  title="অর্ডার এডিট করুন"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>এডিট</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingOrder(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Customer & Courier Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-[#990000]">
                  <User className="w-3.5 h-3.5" />
                  <span>গ্রাহকের তথ্য</span>
                </h4>
                <div className="text-slate-800 font-bold">{viewingOrder.customerName}</div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-900 font-bold">{viewingOrder.phone}</span>
                  <a
                    href={`tel:${viewingOrder.phone}`}
                    className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200"
                    title="Call"
                  >
                    <Phone className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href={`https://wa.me/88${viewingOrder.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">{viewingOrder.address}</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-emerald-700">
                  <Truck className="w-3.5 h-3.5" />
                  <span>ডেলিভারি ও কুরিয়ার</span>
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">কুরিয়ার পার্টনার:</span>
                  <span className="font-bold text-slate-800">{viewingOrder.courier}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">ট্র্যাকিং কোড:</span>
                  {viewingOrder.courierTrackingCode || viewingOrder.status === 'In Transit' || viewingOrder.status === 'Delivered' ? (
                    <a
                      href={`https://steadfast.com.bd/t/${viewingOrder.courierTrackingCode || 'STF-' + viewingOrder.orderNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{viewingOrder.courierTrackingCode || `STF-${viewingOrder.orderNumber}`}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ) : (
                    <span className="text-slate-400">পাঠানো হয়নি</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">দায়িত্বপ্রাপ্ত কর্মী:</span>
                  <span className="font-medium text-slate-800">{viewingOrder.employee || 'Admin'}</span>
                </div>
                {viewingOrder.notes && (
                  <div className="text-[11px] bg-white border border-slate-200 p-2 rounded text-slate-600 mt-1">
                    <strong>নোট:</strong> {viewingOrder.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Products Table */}
            <div>
              <h4 className="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-slate-500" />
                <span>অর্ডারকৃত পণ্যসমূহ</span>
              </h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="p-2.5">পণ্য</th>
                      <th className="p-2.5 text-center">পরিমাণ</th>
                      <th className="p-2.5 text-right">মূল্য</th>
                      <th className="p-2.5 text-right">মোট</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingOrder.products.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-2.5 flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                            <ProductVisual visualType={p.visualType} />
                          </div>
                          <span className="font-semibold text-slate-800">{p.name}</span>
                        </td>
                        <td className="p-2.5 text-center font-bold text-slate-700">{p.qty}</td>
                        <td className="p-2.5 text-right text-slate-600">
                          ৳{Math.round(viewingOrder.amount / viewingOrder.products.reduce((acc, i) => acc + i.qty, 1)).toLocaleString()}
                        </td>
                        <td className="p-2.5 text-right font-bold text-slate-900">
                          ৳{viewingOrder.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1.5 ml-auto max-w-xs">
              <div className="flex justify-between text-slate-600">
                <span>পণ্য মূল্য (Subtotal):</span>
                <span>৳{(viewingOrder.amount - (viewingOrder.deliveryCharge || 0)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ডেলিভারি চার্জ:</span>
                <span>+ ৳{(viewingOrder.deliveryCharge || 0).toLocaleString()}</span>
              </div>
              {viewingOrder.advance ? (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>অগ্রিম পরিশোধ (Advance):</span>
                  <span>- ৳{viewingOrder.advance.toLocaleString()}</span>
                </div>
              ) : null}
              {viewingOrder.discount ? (
                <div className="flex justify-between text-rose-600 font-medium">
                  <span>ডিসকাউন্ট:</span>
                  <span>- ৳{viewingOrder.discount.toLocaleString()}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-sm font-extrabold text-[#990000] border-t border-slate-200 pt-2">
                <span>ক্যাশ অন ডেলিভারি (প্রদেয়):</span>
                <span>৳{(viewingOrder.amount - (viewingOrder.advance || 0)).toLocaleString()}</span>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const ord = viewingOrder;
                    handleDeleteOrder(ord.id);
                  }}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>অর্ডার ডিলিট করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const ord = viewingOrder;
                    setViewingOrder(null);
                    handleOpenCourierModal(ord);
                  }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>কুরিয়ারে পাঠান</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintOrder(viewingOrder)}
                  className="px-4 py-1.5 bg-[#990000] hover:bg-[#800000] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট / ডাউনলোড স্লিপ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingOrder(null)}
                  className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE ORDER COURIER DISPATCH MODAL */}
      {courierDispatchOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="bg-[#990000] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">
                  কুরিয়ারে পাঠান: #{courierDispatchOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setCourierDispatchOrder(null)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>গ্রাহকের নাম:</span>
                  <span>{courierDispatchOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-mono">
                  <span>মোবাইল:</span>
                  <span>{courierDispatchOrder.phone}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ডেলিভারি ঠিকানা:</span>
                  <span className="text-right max-w-xs truncate">{courierDispatchOrder.address}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">কুরিয়ার সার্ভিস বাছাই করুন *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Steadfast', 'Pathao', 'RedX'] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => setSelectedCourierProvider(prov)}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                        selectedCourierProvider === prov
                          ? 'border-[#990000] bg-red-50 text-[#990000] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ক্যাশ কালেকশন (COD Amount ৳) *
                </label>
                <input
                  type="number"
                  value={courierCodAmount}
                  onChange={(e) => setCourierCodAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold font-mono text-slate-900 focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ডেলিভারি নির্দেশিকা / নোট</label>
                <input
                  type="text"
                  value={courierNotes}
                  onChange={(e) => setCourierNotes(e.target.value)}
                  placeholder="যেমন: Handle with care"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCourierDispatchOrder(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCourierDispatch}
                  disabled={isDispatching}
                  className="px-5 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{isDispatching ? 'পাঠানো হচ্ছে...' : 'এখনই কুরিয়ারে পাঠান'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BULK COURIER DISPATCH MODAL */}
      {isBulkCourierModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="bg-[#990000] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">
                  একসাথে {selectedOrderIds.length}টি অর্ডার কুরিয়ারে পাঠান
                </h3>
              </div>
              <button
                onClick={() => setIsBulkCourierModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                আপনি <strong>{selectedOrderIds.length}</strong>টি অর্ডার নির্বাচন করেছেন। এক ক্লিকে এগুলো সরাসরি কুরিয়ার এপিআইতে সাবমিট করা হবে এবং ট্র্যাকিং কোড জেনারেট হবে।
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">কুরিয়ার নির্বাচন করুন *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Steadfast', 'Pathao', 'RedX'] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => setSelectedCourierProvider(prov)}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                        selectedCourierProvider === prov
                          ? 'border-[#990000] bg-red-50 text-[#990000] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>সিলেক্টেড অর্ডার সংখ্যা:</span>
                  <span className="font-bold text-slate-800">{selectedOrderIds.length} টি</span>
                </div>
                <div className="flex justify-between">
                  <span>মোট ক্যাশ কালেকশন (আনুমানিক):</span>
                  <span className="font-bold text-[#990000] font-mono">
                    ৳{' '}
                    {ordersList
                      .filter((o) => selectedOrderIds.includes(o.id))
                      .reduce((sum, o) => sum + o.amount, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBulkCourierModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBulkCourierDispatch}
                  disabled={isDispatching}
                  className="px-5 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>
                    {isDispatching ? 'প্রেরণ করা হচ্ছে...' : `কনফার্ম ও কুরিয়ারে পাঠান (${selectedOrderIds.length})`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
