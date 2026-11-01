import { MenuItem, Order, StudentUser, StaffUser, CafeteriaStatus, DashboardData, AnalyticsData, Feedback } from '../types';
import { DEFAULT_MENU, DEFAULT_ORDERS, DEFAULT_STUDENT, DEFAULT_STATUS, DEFAULT_FEEDBACKS } from '../data/defaultData';

const API_BASE = '';

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return fallback;
}

function setStorage<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    // ignore
  }
}

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
    const orders = getStorage<Order[]>('kca_orders_cache', DEFAULT_ORDERS);
    const activeCount = orders.filter(o => o.status === 'placed' || o.status === 'preparing').length;
    const now = new Date();
    const hour = now.getHours();

    let crowdStatus = 'Low Traffic 🟢';
    let waitMin = Math.max(3, activeCount * 2);

    if (hour >= 12 && hour <= 14) {
      crowdStatus = 'Peak Lunch Rush 🔥';
      waitMin = Math.max(12, activeCount * 3);
    } else if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 18)) {
      crowdStatus = 'Moderate Rush 🟡';
      waitMin = Math.max(7, activeCount * 2.5);
    }

    const localStatus: CafeteriaStatus = {
      open: true,
      campus: 'KCA University Main Campus (Ruaraka)',
      crowdStatus,
      activeOrdersCount: activeCount,
      estimatedWaitMins: Math.round(waitMin),
      serverTime: now.toLocaleTimeString(),
    };

    return safeFetch<CafeteriaStatus>(`${API_BASE}/api/status`, undefined, localStatus);
  },

  async getMenu(): Promise<MenuItem[]> {
    const cachedMenu = getStorage<MenuItem[]>('kca_menu_cache', DEFAULT_MENU);
    return safeFetch<MenuItem[]>(`${API_BASE}/api/menu`, undefined, cachedMenu);
  },

  async getOrders(regNo?: string): Promise<Order[]> {
    const cachedOrders = getStorage<Order[]>('kca_orders_cache', DEFAULT_ORDERS);
    const filtered = regNo ? cachedOrders.filter(o => o.regNo === regNo) : cachedOrders;
    const url = regNo ? `${API_BASE}/api/orders?regNo=${encodeURIComponent(regNo)}` : `${API_BASE}/api/orders`;
    return safeFetch<Order[]>(url, undefined, filtered);
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
        const data = await res.json();
        // Sync local cache
        const orders = getStorage<Order[]>('kca_orders_cache', DEFAULT_ORDERS);
        orders.unshift(data.order);
        setStorage('kca_orders_cache', orders);
        return data;
      }
    } catch (e) {
      // fallback
    }

    // Local fallback creation for GitHub Pages / offline
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

    const orders = getStorage<Order[]>('kca_orders_cache', DEFAULT_ORDERS);
    orders.unshift(mockOrder);
    setStorage('kca_orders_cache', orders);

    let currentBalance: number | null = null;
    if (payload.payMethod === 'kca_wallet') {
      const student = getStorage<StudentUser>('kca_student_user', DEFAULT_STUDENT);
      student.walletBalance = Math.max(0, student.walletBalance - total);
      if (!student.transactions) student.transactions = [];
      student.transactions.unshift({
        id: `TX-${Date.now()}`,
        type: 'meal_payment',
        amount: total,
        date: 'Just now',
        ref: `MEAL-${payload.items[0]?.name?.substring(0, 8) || 'DISH'}`,
      });
      setStorage('kca_student_user', student);
      currentBalance = student.walletBalance;
    }

    return { success: true, order: mockOrder, walletBalance: currentBalance };
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<{ success: boolean; order?: Order }> {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        // Update local cache
        const orders = getStorage<Order[]>('kca_orders_cache', DEFAULT_ORDERS);
        const idx = orders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
          orders[idx].status = status;
          setStorage('kca_orders_cache', orders);
        }
        return data;
      }
    } catch (e) {
      // fallback
    }

    // Local fallback for GitHub Pages
    const orders = getStorage<Order[]>('kca_orders_cache', DEFAULT_ORDERS);
    const ord = orders.find(o => o.id === orderId);
    if (ord) {
      ord.status = status;
      setStorage('kca_orders_cache', orders);
      return { success: true, order: ord };
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
      // Offline fallback for GitHub Pages
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
        const savedStudent = getStorage<StudentUser>('kca_student_user', DEFAULT_STUDENT);
        const student: StudentUser = {
          ...savedStudent,
          regNo: regNo || '2502692',
          email: payload.input.includes('@') ? payload.input : `${regNo || '2502692'}@students.kcau.ac.ke`,
          name: regNo === '2502692' ? 'Rebecca Nabusambya' : (savedStudent.name || `Student ${regNo}`),
        };
        setStorage('kca_student_user', student);
        return {
          success: true,
          role: 'student',
          student,
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
    const student = getStorage<StudentUser>('kca_student_user', DEFAULT_STUDENT);
    student.walletBalance += amount;
    if (!student.transactions) student.transactions = [];
    student.transactions.unshift({
      id: `TX-${Date.now()}`,
      type: 'topup',
      amount,
      phone: phone || '0712345678',
      date: 'Just now',
      ref,
    });
    setStorage('kca_student_user', student);
    return { success: true, newBalance: student.walletBalance, ref };
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
    const feedbacks = getStorage<Feedback[]>('kca_feedbacks_cache', DEFAULT_FEEDBACKS);
    feedbacks.unshift(fb);
    setStorage('kca_feedbacks_cache', feedbacks);

    return { success: true, feedback: fb, updatedRating: 4.8 };
  },

  async getDashboard(): Promise<DashboardData> {
    const orders = getStorage<Order[]>('kca_orders_cache', DEFAULT_ORDERS);
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayOrders = orders.filter((order: any) => new Date(order.createdAt) >= startOfDay);
    const revenue = todayOrders.reduce((sum: number, order: any) => sum + (Number(order.total) || 0), 0);
    const ingredientCost = todayOrders.reduce((sum: number, order: any) => {
      const itemCost = (order.items || []).reduce((total: number, item: any) => {
        const unitPrice = Number(item.price) || 0;
        const qty = Number(item.qty) || 1;
        return total + (unitPrice * qty * 0.55);
      }, 0);
      return sum + itemCost;
    }, 0);

    const localDash: DashboardData = {
      orders,
      todayOrders,
      revenue,
      cost: Math.round(ingredientCost),
      profit: Math.round(revenue - ingredientCost),
      pending: orders.filter((o: any) => o.status !== 'picked_up').length,
      ready: orders.filter((o: any) => o.status === 'ready').length,
    };

    return safeFetch<DashboardData>(`${API_BASE}/api/dashboard`, undefined, localDash);
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const orders = getStorage<Order[]>('kca_orders_cache', DEFAULT_ORDERS);
    const feedbacks = getStorage<Feedback[]>('kca_feedbacks_cache', DEFAULT_FEEDBACKS);
    const menu = getStorage<MenuItem[]>('kca_menu_cache', DEFAULT_MENU);

    const avgRating = feedbacks.length
      ? (feedbacks.reduce((a, b) => a + b.rating, 0) / feedbacks.length).toFixed(1)
      : '4.8';

    const localAnalytics: AnalyticsData = {
      ordersToday: orders.length,
      avgRating: parseFloat(avgRating),
      lowRatedCount: 0,
      lowRatedItems: [],
      topSellers: menu.slice(0, 4),
    };

    return safeFetch<AnalyticsData>(`${API_BASE}/api/analytics`, undefined, localAnalytics);
  },
};
