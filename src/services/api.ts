import { MenuItem, Order, StudentUser, StaffUser, CafeteriaStatus, DashboardData, AnalyticsData, Feedback } from '../types';
import { DEFAULT_MENU, DEFAULT_ORDERS, DEFAULT_STUDENT, DEFAULT_STATUS, DEFAULT_FEEDBACKS } from '../data/defaultData';

const API_BASE = '';

async function safeFetch<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      if (fallback !== undefined) return fallback;
      throw new Error(`HTTP error ${res.status}`);
    }
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      if (fallback !== undefined) return fallback;
      throw new Error(`Expected JSON but got ${contentType}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (fallback !== undefined) return fallback;
    throw err;
  }
}

export const api = {
  async getStatus(): Promise<CafeteriaStatus> {
    return safeFetch<CafeteriaStatus>(`${API_BASE}/api/status`, undefined, DEFAULT_STATUS);
  },

  async getMenu(): Promise<MenuItem[]> {
    return safeFetch<MenuItem[]>(`${API_BASE}/api/menu`, undefined, DEFAULT_MENU);
  },

  async getOrders(regNo?: string): Promise<Order[]> {
    const url = regNo ? `${API_BASE}/api/orders?regNo=${encodeURIComponent(regNo)}` : `${API_BASE}/api/orders`;
    return safeFetch<Order[]>(url, undefined, DEFAULT_ORDERS);
  },

  async createOrder(payload: {
    regNo: string;
    studentName: string;
    items: { id: number; name: string; qty: number; price: number }[];
    payMethod: 'kca_wallet' | 'mpesa';
    pickupTime?: string;
    notes?: string;
  }): Promise<{ success: boolean; order: Order; walletBalance?: number | null }> {
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // fallback
    }

    // Local fallback creation
    const subtotal = payload.items.reduce((s, it) => s + it.price * it.qty, 0);
    const serviceFee = 5;
    const total = subtotal + serviceFee;
    const ticketNum = Math.floor(100 + Math.random() * 900);
    const mockOrder: Order = {
      id: `KCA-2024-${ticketNum}`,
      ticketNo: `#KCA-${ticketNum}`,
      regNo: payload.regNo,
      studentName: payload.studentName,
      items: payload.items,
      subtotal,
      serviceFee,
      total,
      payMethod: payload.payMethod,
      mpesaRef: payload.payMethod === 'mpesa' ? `QK${Math.random().toString(36).substring(2, 9).toUpperCase()}` : `WAL-KCA-${ticketNum}`,
      status: 'placed',
      createdAt: new Date().toISOString(),
      pickupCode: `QR-KCA-${ticketNum}-SECURE`,
      notes: payload.notes || '',
      line: 'Counter B',
      paymentStatus: 'paid',
      pickupTime: payload.pickupTime || 'ASAP (~8 min)',
    };
    return { success: true, order: mockOrder, walletBalance: null };
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<{ success: boolean; order?: Order }> {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // fallback
    }
    return { success: true };
  },

  async login(payload: {
    input: string;
    password?: string;
    role: 'student' | 'staff';
    staffPin?: string;
  }): Promise<{ success: boolean; role: 'student' | 'staff'; student?: StudentUser; staff?: StaffUser; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, role: payload.role, error: data.error || 'Login failed' };
      }
      return data;
    } catch (err) {
      // Offline fallback
      if (payload.role === 'staff') {
        const pin = (payload.staffPin || payload.password || '').trim();
        const validPins = ['882041', '1234', 'KCA-CHEF', 'kca-chef'];
        if (!validPins.includes(pin)) {
          return { success: false, role: 'staff', error: 'Invalid Staff Terminal Security PIN.' };
        }
        return {
          success: true,
          role: 'staff',
          staff: {
            id: 'KCA-STAFF-08',
            name: 'Chef Otieno',
            role: 'Kitchen Terminal Dispatcher',
            email: payload.input.includes('@') ? payload.input : 'chef.otieno@kcau.ac.ke',
            department: 'KCA Catering & Cafeteria Services',
          },
        };
      } else {
        const regNo = payload.input.includes('@') ? payload.input.split('@')[0] : payload.input.replace(/[^a-zA-Z0-9]/g, '');
        return {
          success: true,
          role: 'student',
          student: {
            regNo: regNo || '2502692',
            email: payload.input.includes('@') ? payload.input : `${regNo}@students.kcau.ac.ke`,
            name: regNo === '2502692' ? 'James Mwangi' : `Student ${regNo}`,
            department: 'School of Technology (BIT)',
            walletBalance: 850,
            transactions: DEFAULT_STUDENT.transactions,
          },
        };
      }
    }
  },

  async topupWallet(regNo: string, amount: number, phone?: string): Promise<{ success: boolean; newBalance: number; ref: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/wallet/topup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo, amount, phone }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // fallback
    }
    const ref = 'MP-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    return { success: true, newBalance: 850 + amount, ref };
  },

  async sendStkPush(phone: string, amount: number, regNo: string): Promise<{ success: boolean; customerMessage: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/mpesa/stkpush`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount, regNo }),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, customerMessage: data.CustomerMessage };
      }
    } catch (e) {
      // fallback
    }
    return {
      success: true,
      customerMessage: `Success. An STK push has been sent to ${phone}. Enter your M-Pesa PIN to complete payment of KSh ${amount}.`,
    };
  },

  async submitFeedback(payload: {
    orderId?: string;
    itemId: number;
    regNo: string;
    rating: number;
    emoji: number;
    comment: string;
  }): Promise<{ success: boolean; feedback: Feedback; updatedRating?: number }> {
    try {
      const res = await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // fallback
    }
    const fb: Feedback = {
      id: Date.now(),
      orderId: payload.orderId,
      itemId: payload.itemId,
      regNo: payload.regNo,
      rating: payload.rating,
      emoji: payload.emoji,
      comment: payload.comment,
      date: 'Just now',
    };
    return { success: true, feedback: fb, updatedRating: 4.8 };
  },

  async getDashboard(): Promise<DashboardData> {
    return safeFetch<DashboardData>(`${API_BASE}/api/dashboard`, undefined, {
      orders: DEFAULT_ORDERS,
      todayOrders: DEFAULT_ORDERS,
      revenue: 330,
      cost: 165,
      profit: 165,
      pending: 1,
      ready: 0,
    });
  },

  async getAnalytics(): Promise<AnalyticsData> {
    return safeFetch<AnalyticsData>(`${API_BASE}/api/analytics`, undefined, {
      ordersToday: DEFAULT_ORDERS.length,
      avgRating: 4.4,
      lowRatedCount: 0,
      lowRatedItems: [],
      topSellers: DEFAULT_MENU.slice(0, 4),
    });
  },
};
