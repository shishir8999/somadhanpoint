import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserX,
  History,
  Hourglass,
  Calendar,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ChevronDown,
  Info
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

interface EmployeeReportPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

export const EmployeeReportPage: React.FC<EmployeeReportPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedDate, setSelectedDate] = useState('Today');

  // Exact 5 Employees matching Screenshot 3
  const employees = [
    {
      id: 'emp-1',
      avatar: 'E1',
      avatarBg: 'bg-rose-100 text-rose-700',
      name: 'Employee 1',
      role: 'employee',
      schedule: '09:00 – 17:00',
      status: 'Active',
      orders: 1,
      orderAmount: 730,
      discount: 0,
      deliveredQty: 0,
      deliveredAmount: 0,
      rate: '0%',
      fakeQty: 0,
      fakeAmount: 0,
      advance: 0,
      attempts: 0,
      inactive: 0,
      inactiveTime: '—',
      // pipeline status counts
      pending: 1,
    },
    {
      id: 'emp-2',
      avatar: 'A',
      avatarBg: 'bg-amber-100 text-amber-800',
      name: 'appbyte',
      role: 'admin',
      schedule: 'No schedule',
      status: 'Active',
      orders: 0,
      orderAmount: 0,
      discount: 0,
      deliveredQty: 0,
      deliveredAmount: 0,
      rate: '0%',
      fakeQty: 0,
      fakeAmount: 0,
      advance: 0,
      attempts: 0,
      inactive: 0,
      inactiveTime: '—',
      pending: 0,
    },
    {
      id: 'emp-3',
      avatar: 'E2',
      avatarBg: 'bg-rose-100 text-rose-700',
      name: 'Employee 2',
      role: 'employee',
      schedule: '17:00 – 01:00',
      status: 'Active',
      orders: 0,
      orderAmount: 0,
      discount: 0,
      deliveredQty: 0,
      deliveredAmount: 0,
      rate: '0%',
      fakeQty: 0,
      fakeAmount: 0,
      advance: 0,
      attempts: 0,
      inactive: 0,
      inactiveTime: '—',
      pending: 0,
    },
    {
      id: 'emp-4',
      avatar: 'E3',
      avatarBg: 'bg-rose-100 text-rose-700',
      name: 'Employee 3',
      role: 'employee',
      schedule: '01:00 – 09:00',
      status: 'Active',
      orders: 0,
      orderAmount: 0,
      discount: 0,
      deliveredQty: 0,
      deliveredAmount: 0,
      rate: '0%',
      fakeQty: 0,
      fakeAmount: 0,
      advance: 0,
      attempts: 0,
      inactive: 0,
      inactiveTime: '—',
      pending: 0,
    },
    {
      id: 'emp-5',
      avatar: 'M1',
      avatarBg: 'bg-orange-100 text-orange-800',
      name: 'Manager 1',
      role: 'manager',
      schedule: 'No schedule',
      status: 'Active',
      orders: 0,
      orderAmount: 0,
      discount: 0,
      deliveredQty: 0,
      deliveredAmount: 0,
      rate: '0%',
      fakeQty: 0,
      fakeAmount: 0,
      advance: 0,
      attempts: 0,
      inactive: 0,
      inactiveTime: '—',
      pending: 0,
    },
  ];

  const filteredEmployees = employees.filter((emp) => {
    if (selectedRole === 'All Roles') return true;
    return emp.role.toLowerCase() === selectedRole.toLowerCase();
  });

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="employee_report"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Filter Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Employee Report
            </h1>
            <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
              Performance Analytics
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Role</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-slate-400 focus:outline-hidden"
              >
                <option value="All Roles">All Roles</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-400">
              <Calendar className="w-4 h-4 text-slate-500" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent focus:outline-hidden cursor-pointer pr-2 font-semibold text-slate-800"
              >
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-w-7xl w-full space-y-6">
          {/* Top 5 Stat Cards matching Screenshot 3 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* 1. Total Employees */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Total Employees</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">5</h3>
              </div>
            </div>

            {/* 2. Active Now */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Active Now</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">5</h3>
              </div>
            </div>

            {/* 3. Inactive Now */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Inactive Now</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">0</h3>
              </div>
            </div>

            {/* 4. Inactive Periods */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Inactive Periods</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">0</h3>
              </div>
            </div>

            {/* 5. Total Inactive Time */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <Hourglass className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Total Inactive Time</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">0m</h3>
              </div>
            </div>
          </div>

          {/* Section 1: Employee Performance Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-800">
                  Employee Performance
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                5 people · sorted by order amount
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-semibold uppercase tracking-wider border-b border-slate-100">
                    <th className="py-3 px-4">EMPLOYEE</th>
                    <th className="py-3 px-3 text-center">ORDERS</th>
                    <th className="py-3 px-3 text-right">ORDER AMOUNT</th>
                    <th className="py-3 px-3 text-right">DISCOUNT</th>
                    <th className="py-3 px-3 text-center">DELIVERED</th>
                    <th className="py-3 px-3 text-center">RATE</th>
                    <th className="py-3 px-3 text-center">FAKE</th>
                    <th className="py-3 px-3 text-right">ADVANCE</th>
                    <th className="py-3 px-3 text-center">ATTEMPTS</th>
                    <th className="py-3 px-3 text-center">INACTIVE</th>
                    <th className="py-3 px-3 text-center">INACTIVE TIME</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Employee name & badge */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${emp.avatarBg}`}>
                            {emp.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">{emp.name}</span>
                              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                                {emp.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {emp.role} · {emp.schedule}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Orders */}
                      <td className="py-3 px-3 text-center font-bold text-slate-800">
                        {emp.orders}
                      </td>

                      {/* Order Amount */}
                      <td className="py-3 px-3 text-right font-bold text-slate-900">
                        ৳ {emp.orderAmount}
                      </td>

                      {/* Discount */}
                      <td className="py-3 px-3 text-right text-slate-500">
                        ৳ {emp.discount}
                      </td>

                      {/* Delivered */}
                      <td className="py-3 px-3 text-center text-slate-600">
                        <div>{emp.deliveredQty}</div>
                        <div className="text-[10px] text-slate-400">৳ {emp.deliveredAmount}</div>
                      </td>

                      {/* Rate */}
                      <td className="py-3 px-3 text-center font-bold text-rose-500">
                        {emp.rate}
                      </td>

                      {/* Fake */}
                      <td className="py-3 px-3 text-center text-slate-600">
                        <div>{emp.fakeQty}</div>
                        <div className="text-[10px] text-slate-400">৳ {emp.fakeAmount}</div>
                      </td>

                      {/* Advance */}
                      <td className="py-3 px-3 text-right text-slate-500">
                        ৳ {emp.advance}
                      </td>

                      {/* Attempts */}
                      <td className="py-3 px-3 text-center text-slate-500">
                        <div>{emp.attempts}</div>
                        {emp.orders > 0 && <div className="text-[10px] text-slate-400">avg 0.0/order</div>}
                      </td>

                      {/* Inactive */}
                      <td className="py-3 px-3 text-center text-slate-500">
                        {emp.inactive}
                      </td>

                      {/* Inactive Time */}
                      <td className="py-3 px-3 text-center text-slate-400">
                        {emp.inactiveTime}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Total Row matching Screenshot 3 */}
                <tfoot>
                  <tr className="bg-slate-50/80 font-bold border-t border-slate-200 text-slate-800">
                    <td className="py-3 px-4">Total</td>
                    <td className="py-3 px-3 text-center">1</td>
                    <td className="py-3 px-3 text-right">৳ 730</td>
                    <td className="py-3 px-3 text-right">৳ 0</td>
                    <td className="py-3 px-3 text-center">0</td>
                    <td className="py-3 px-3 text-center text-slate-400">—</td>
                    <td className="py-3 px-3 text-center">0</td>
                    <td className="py-3 px-3 text-right">৳ 0</td>
                    <td className="py-3 px-3 text-center">0</td>
                    <td className="py-3 px-3 text-center">0</td>
                    <td className="py-3 px-3 text-center text-slate-400">—</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Section 2: Employee Pipeline Report Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Employee Report
              </h3>
              <span className="text-xs text-slate-400">Status breakdown</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase font-semibold border-b border-slate-100">
                    <th className="py-2.5 px-3 text-slate-600">EMPLOYEE</th>
                    <th className="py-2.5 px-2 text-center text-slate-500">Incomplete</th>
                    <th className="py-2.5 px-2 text-center text-amber-700 bg-amber-50 rounded">Pending</th>
                    <th className="py-2.5 px-2 text-center text-amber-600">Pending Response</th>
                    <th className="py-2.5 px-2 text-center text-rose-500">No Response</th>
                    <th className="py-2.5 px-2 text-center text-red-600">Fake</th>
                    <th className="py-2.5 px-2 text-center text-purple-600">Advance Payment</th>
                    <th className="py-2.5 px-2 text-center text-slate-500">On Hold</th>
                    <th className="py-2.5 px-2 text-center text-blue-600">Confirmed</th>
                    <th className="py-2.5 px-2 text-center text-indigo-600">Processing</th>
                    <th className="py-2.5 px-2 text-center text-cyan-600">Ready For Pickup</th>
                    <th className="py-2.5 px-2 text-center text-sky-600">In Transit</th>
                    <th className="py-2.5 px-2 text-center text-emerald-600">Delivered</th>
                    <th className="py-2.5 px-2 text-center text-teal-600">Partial Delivered</th>
                    <th className="py-2.5 px-2 text-center text-orange-600">Returned</th>
                    <th className="py-2.5 px-2 text-center text-slate-400">Cancelled</th>
                    <th className="py-2.5 px-2 text-center text-rose-600">Lost</th>
                    <th className="py-2.5 px-3 text-right text-slate-800">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-center">
                  <tr>
                    <td className="py-3 px-3 text-left font-semibold text-slate-800">
                      Employee 1
                    </td>
                    <td className="py-3 px-2 text-slate-400">0</td>
                    <td className="py-3 px-2 font-bold text-amber-700 bg-amber-50/70">1</td>
                    <td className="py-3 px-2 text-slate-400">0</td>
                    <td className="py-3 px-2 text-slate-400">0</td>
                    <td className="py-3 px-2 text-slate-400">0</td>
                    <td className="py-3 px-2 text-slate-400">0</td>
                    <td className="py-3 px-2 text-slate-400">0</td>
                    <td className="py-3 px-2 text-slate-400">0</td>
                    <td className="py-3 px-2 text-slate-400">0</td>
                    <td className="py-3 px-2 text-slate-400">0</td>
                    <td className="py-3 px-2 text-slate-400">0</td>
                    <td className="py-3 px-2 text-slate-400">0</td>
                    <td className="py-3 px-2 text-slate-400">0</td>
                    <td className="py-3 px-2 text-slate-400">0</td>
                    <td className="py-3 px-2 text-slate-400">0</td>
                    <td className="py-3 px-2 text-slate-400">0</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">৳ 730</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-800 text-center">
                    <td className="py-2.5 px-3 text-left">Total</td>
                    <td className="py-2.5 px-2">0</td>
                    <td className="py-2.5 px-2 text-amber-700 bg-amber-50">1</td>
                    <td className="py-2.5 px-2">0</td>
                    <td className="py-2.5 px-2">0</td>
                    <td className="py-2.5 px-2">0</td>
                    <td className="py-2.5 px-2">0</td>
                    <td className="py-2.5 px-2">0</td>
                    <td className="py-2.5 px-2">0</td>
                    <td className="py-2.5 px-2">0</td>
                    <td className="py-2.5 px-2">0</td>
                    <td className="py-2.5 px-2">0</td>
                    <td className="py-2.5 px-2">0</td>
                    <td className="py-2.5 px-2">0</td>
                    <td className="py-2.5 px-2">0</td>
                    <td className="py-2.5 px-2">0</td>
                    <td className="py-2.5 px-2">0</td>
                    <td className="py-2.5 px-3 text-right">৳ 730</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Section 3: Inactive Period Log */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-800">
                  Inactive Period Log
                </h3>
              </div>
              <span className="text-xs text-slate-400">0 periods on record</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-semibold uppercase tracking-wider border-b border-slate-100">
                    <th className="py-3 px-4">EMPLOYEE</th>
                    <th className="py-3 px-4">INACTIVE SINCE</th>
                    <th className="py-3 px-4">ACTIVE AGAIN</th>
                    <th className="py-3 px-4">DURATION</th>
                    <th className="py-3 px-4">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      No inactive periods recorded yet. Periods appear here when an employee is deactivated and reactivated.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
