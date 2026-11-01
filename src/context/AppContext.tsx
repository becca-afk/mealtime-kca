import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { MenuItem, Order, StudentUser, StaffUser, AdminUser, Role, CafeteriaStatus, Feedback } from '../types';
import { DEFAULT_MENU, DEFAULT_ORDERS, DEFAULT_STUDENT, DEFAULT_STAFF, DEFAULT_ADMIN, DEFAULT_STATUS, DEFAULT_FEEDBACKS } from '../data/defaultData';
import { api } from '../services/api';
import { playOrderReadyChime } from '../utils/audio';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'rush' | 'promo' | 'system';
  icon: string;
  read: boolean;
}

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  currentUser: StudentUser | null;
  currentStaff: StaffUser | null;
  currentAdmin: AdminUser | null;
  isLoggedIn: boolean;
  loginStudent: (student: StudentUser) => void;
  loginStaff: (staff: StaffUser) => void;
  loginAdmin: (admin: AdminUser) => void;
  registerStudent: (details: { name: string; regNo: string; email: string; password: string }) => boolean;
  logout: () => void;

  currentPage: string;
  setCurrentPage: (page: string) => void;

  menu: MenuItem[];
  toggleItemAvailability: (itemId: number) => void;
  cart: { [id: number]: number };
  addToCart: (itemId: number, qty?: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartCalories: number;
  cartProtein: number;

  orders: Order[];
  activeOrder: Order | null;
  status: CafeteriaStatus;
  refreshStatus: () => Promise<void>;

  notifications: AppNotification[];
  unreadNotifsCount: number;
  markAllNotifsRead: () => void;
  addNotification: (title: string, message: string, type?: AppNotification['type'], icon?: string) => void;

  feedbacks: Feedback[];

  // Modals state
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isStkOpen: boolean;
  setIsStkOpen: (open: boolean) => void;
  stkPayload: { phone: string; amount: number; regNo: string; orderPayload?: any } | null;
  setStkPayload: (payload: any) => void;
  isTopupOpen: boolean;
  setIsTopupOpen: (open: boolean) => void;
  isQrOpen: boolean;
  setIsQrOpen: (open: boolean) => void;
  qrOrder: Order | null;
  setQrOrder: (order: Order | null) => void;
  isFeedbackOpen: boolean;
  setIsFeedbackOpen: (open: boolean) => void;
  feedbackTarget: { orderId?: string; item: MenuItem } | null;
  setFeedbackTarget: (target: { orderId?: string; item: MenuItem } | null) => void;
  isItemDetailOpen: boolean;
  setIsItemDetailOpen: (open: boolean) => void;
  detailItem: MenuItem | null;
  setDetailItem: (item: MenuItem | null) => void;
  isNotifDrawerOpen: boolean;
  setIsNotifDrawerOpen: (open: boolean) => void;
  isRegisterOpen: boolean;
  setIsRegisterOpen: (open: boolean) => void;

  // Actions
  placeOrder: (payMethod: 'kca_wallet' | 'mpesa', pickupTime?: string, notes?: string, mpesaPhone?: string) => Promise<boolean>;
  confirmMpesaOrder: (pin: string) => Promise<{ success: boolean; error?: string }>;
  topupWallet: (amount: number, phone?: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => Promise<void>;
  simulateIncomingOrder: () => void;
  submitReview: (orderId: string | undefined, itemId: number, rating: number, emoji: number, comment: string) => Promise<boolean>;

  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;

  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  darkTheme: boolean;
  setDarkTheme: (dark: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('student');
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(DEFAULT_STUDENT);
  const [currentStaff, setCurrentStaff] = useState<StaffUser | null>(DEFAULT_STAFF);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(DEFAULT_ADMIN);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<string>('home');

  const [menu, setMenu] = useState<MenuItem[]>(DEFAULT_MENU);
  const [cart, setCart] = useState<{ [id: number]: number }>({});
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);
  const [status, setStatus] = useState<CafeteriaStatus>(DEFAULT_STATUS);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(DEFAULT_FEEDBACKS);

  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Order in Progress: Ticket #KCA-047',
      message: 'Beef Stew + Ugali is currently cooking in the kitchen. Pickup pass will activate when ready.',
      time: '2 mins ago',
      type: 'info',
      icon: '🍛',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Peak Lunch Rush Advisory',
      message: 'Cafeteria crowds peak between 12:15 PM and 1:30 PM. Pre-order now to skip the counter queue!',
      time: '12 mins ago',
      type: 'rush',
      icon: '📈',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Comrade Budget Meal of the Day',
      message: 'Chapati + Yellow Beans combo is currently KSh 60 only (480 kcal · 18g Protein).',
      time: '1 hour ago',
      type: 'promo',
      icon: '💰',
      read: false,
    },
    {
      id: 'notif-4',
      title: 'KCA Student MealCard Active',
      message: 'Logged in as 2502692@students.kcau.ac.ke with instant 1-tap checkout enabled.',
      time: 'Today',
      type: 'system',
      icon: '💳',
      read: true,
    },
  ]);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStkOpen, setIsStkOpen] = useState(false);
  const [stkPayload, setStkPayload] = useState<{ phone: string; amount: number; regNo: string; orderPayload?: any } | null>(null);
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrOrder, setQrOrder] = useState<Order | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState<{ orderId?: string; item: MenuItem } | null>(null);
  const [isItemDetailOpen, setIsItemDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Sync dark theme class
  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkTheme]);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const addNotification = useCallback((title: string, message: string, type: AppNotification['type'] = 'info', icon = '🔔') => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      type,
      icon,
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // Active student order
  const activeOrder = orders.find(
    o => o.regNo === (currentUser?.regNo || '2502692') && (o.status === 'placed' || o.status === 'preparing' || o.status === 'ready')
  ) || null;

  const refreshStatus = useCallback(async () => {
    try {
      const data = await api.getStatus();
      setStatus(data);
      showToast('Queue status refreshed', 'info');
    } catch {
      // ignore
    }
  }, [showToast]);

  // Inventory toggle
  const toggleItemAvailability = (itemId: number) => {
    setMenu(prev =>
      prev.map(it => {
        if (it.id === itemId) {
          const newAvail = !it.available;
          showToast(`${it.name} is now ${newAvail ? 'Available 🟢' : 'Sold Out 🔴'}`, newAvail ? 'success' : 'warning');
          return { ...it, available: newAvail };
        }
        return it;
      })
    );
  };

  // Cart operations
  const addToCart = (itemId: number, qty = 1) => {
    const found = menu.find(m => m.id === itemId);
    if (!found || !found.available) {
      showToast('Sorry, this dish is currently Sold Out!', 'error');
      return;
    }
    setCart(prev => {
      const currentQty = prev[itemId] || 0;
      return { ...prev, [itemId]: currentQty + qty };
    });
    showToast(`Added ${found.name} to tray`, 'success');
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const copy = { ...prev };
      if (copy[itemId] > 1) {
        copy[itemId] -= 1;
      } else {
        delete copy[itemId];
      }
      return copy;
    });
  };

  const clearCart = () => setCart({});

  const cartCount = Object.values(cart).reduce((sum, q) => sum + q, 0);

  const cartTotal = Object.entries(cart).reduce((sum, [idStr, q]) => {
    const item = menu.find(m => m.id === Number(idStr));
    return sum + (item ? item.price * q : 0);
  }, 0);

  const cartCalories = Object.entries(cart).reduce((sum, [idStr, q]) => {
    const item = menu.find(m => m.id === Number(idStr));
    return sum + (item ? item.calories * q : 0);
  }, 0);

  const cartProtein = Object.entries(cart).reduce((sum, [idStr, q]) => {
    const item = menu.find(m => m.id === Number(idStr));
    return sum + (item ? item.protein * q : 0);
  }, 0);

  // Place Order
  const placeOrder = async (
    payMethod: 'kca_wallet' | 'mpesa',
    pickupTime = 'ASAP (~8 min)',
    notes = '',
    mpesaPhone = '0712345678'
  ): Promise<boolean> => {
    if (cartCount === 0) {
      showToast('Your meal tray is empty!', 'warning');
      return false;
    }

    const items = Object.entries(cart).map(([idStr, qty]) => {
      const m = menu.find(it => it.id === Number(idStr))!;
      return { id: m.id, name: m.name, qty, price: m.price };
    });

    const total = cartTotal + 5; // +5 packaging fee

    if (payMethod === 'kca_wallet') {
      if (!currentUser || currentUser.walletBalance < total) {
        showToast('Insufficient MealCard balance! Please top up your wallet or pay via M-Pesa.', 'error');
        return false;
      }

      const res = await api.createOrder({
        regNo: currentUser.regNo,
        studentName: currentUser.name,
        items,
        payMethod: 'kca_wallet',
        pickupTime,
        notes,
      });

      if (res.success && res.order) {
        setCurrentUser(prev => {
          if (!prev) return null;
          const newBal = prev.walletBalance - total;
          const newTx = {
            id: `TX-${Date.now()}`,
            type: 'meal_payment' as const,
            amount: total,
            date: 'Just now',
            ref: `MEAL-${items[0]?.name.substring(0, 8)}`,
          };
          return {
            ...prev,
            walletBalance: newBal,
            transactions: [newTx, ...(prev.transactions || [])],
          };
        });

        setOrders(prev => [res.order, ...prev.filter(o => o.id !== res.order.id)]);
        clearCart();
        setIsCartOpen(false);
        showToast(`🎉 Order Placed! Ticket ${res.order.ticketNo}`, 'success');
        addNotification(`Order Placed: ${res.order.ticketNo}`, `Meal ordered with MealCard. Collect at Counter B.`, 'success', '🍛');
        setCurrentPage('home');
        return true;
      }
    } else {
      // M-Pesa STK push path
      setStkPayload({
        phone: mpesaPhone,
        amount: total,
        regNo: currentUser?.regNo || '2502692',
        orderPayload: {
          regNo: currentUser?.regNo || '2502692',
          studentName: currentUser?.name || 'Rebecca Nabusambya',
          items,
          payMethod: 'mpesa' as const,
          pickupTime,
          notes,
        },
      });
      setIsCartOpen(false);
      setIsStkOpen(true);
      return true;
    }

    return false;
  };

  // M-Pesa STK Push Confirmation with 90% success rate simulation (as per SRS Section 4.4)
  const confirmMpesaOrder = async (pin: string): Promise<{ success: boolean; error?: string }> => {
    if (!stkPayload || !stkPayload.orderPayload) {
      return { success: false, error: 'No active payment session' };
    }

    // 90% success rate simulation per SRS Section 4.4
    const isSuccessful = Math.random() < 0.90;

    if (!isSuccessful) {
      return {
        success: false,
        error: 'Safaricom M-Pesa STK request timed out or cancelled on device. Please retry.',
      };
    }

    try {
      const res = await api.createOrder(stkPayload.orderPayload);
      if (res.success && res.order) {
        setOrders(prev => [res.order, ...prev.filter(o => o.id !== res.order.id)]);
        clearCart();
        setIsStkOpen(false);
        setStkPayload(null);
        showToast(`🎉 M-Pesa Payment Received! Ticket ${res.order.ticketNo}`, 'success');
        addNotification(`Payment Confirmed: ${res.order.ticketNo}`, `KSh ${res.order.total} paid via M-Pesa. Show QR pass at Counter B.`, 'success', '🟢');
        setCurrentPage('home');
        return { success: true };
      }
    } catch {
      return { success: false, error: 'Transaction could not be completed. Please try again.' };
    }

    return { success: false, error: 'Payment processing error' };
  };

  // Wallet topup (minimum KSh 10 per SRS Section 4.5)
  const topupWallet = async (amount: number, phone = '0712345678'): Promise<boolean> => {
    if (!currentUser) return false;
    if (amount < 10) {
      showToast('Minimum top-up amount is KSh 10', 'warning');
      return false;
    }
    const res = await api.topupWallet(currentUser.regNo, amount, phone);
    if (res.success) {
      setCurrentUser(prev => {
        if (!prev) return null;
        const newBal = prev.walletBalance + amount;
        const newTx = {
          id: `TX-${Date.now()}`,
          type: 'topup' as const,
          amount,
          date: 'Just now',
          ref: res.ref,
          phone,
        };
        return {
          ...prev,
          walletBalance: newBal,
          transactions: [newTx, ...(prev.transactions || [])],
        };
      });
      setIsTopupOpen(false);
      showToast(`💳 Topped up KSh ${amount.toLocaleString()} to MealCard!`, 'success');
      addNotification('MealCard Top Up Successful', `Deposited KSh ${amount.toLocaleString()} via M-Pesa (${phone}). Ref: ${res.ref}`, 'system', '💳');
      return true;
    }
    return false;
  };

  // KDS order status transitions
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    await api.updateOrderStatus(orderId, newStatus);
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o))
    );

    const targetOrder = orders.find(o => o.id === orderId);
    const isMyOrder = targetOrder?.regNo === currentUser?.regNo;

    if (newStatus === 'ready') {
      if (audioEnabled) {
        playOrderReadyChime();
      }
      showToast(`🔔 Ticket ${targetOrder?.ticketNo || orderId} is READY for pickup at Counter B!`, 'success');
      if (isMyOrder) {
        addNotification('Order Ready for Pickup! 🍽️', `Ticket ${targetOrder?.ticketNo} is READY at Counter B! Show your QR code pass to collect.`, 'success', '🔔');
      }
    } else if (newStatus === 'preparing') {
      showToast(`🔥 Kitchen started cooking Ticket ${targetOrder?.ticketNo || orderId}`, 'info');
      if (isMyOrder) {
        addNotification('Order Cooking 🍳', `Cafeteria staff started preparing your food.`, 'info', '🍳');
      }
    } else if (newStatus === 'picked_up') {
      showToast(`✓ Order ${targetOrder?.ticketNo || orderId} marked as picked up!`, 'info');
    }
  };

  const simulateIncomingOrder = () => {
    const randomDish = menu[Math.floor(Math.random() * menu.length)];
    const ticketNo = `#KCA-${Math.floor(100 + Math.random() * 900)}`;
    const randomOrder: Order = {
      id: `KCA-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      ticketNo,
      regNo: `250${Math.floor(1000 + Math.random() * 8999)}`,
      studentName: 'Campus Comrade',
      items: [{ id: randomDish.id, name: randomDish.name, price: randomDish.price, qty: 1 }],
      subtotal: randomDish.price,
      serviceFee: 5,
      total: randomDish.price + 5,
      payMethod: 'mpesa',
      status: 'placed',
      createdAt: new Date().toISOString(),
      notes: 'Demo queue order',
      line: 'Counter B',
      paymentStatus: 'paid',
    };
    setOrders(prev => [randomOrder, ...prev]);
    showToast(`👨‍🍳 New ticket arrived: ${ticketNo}!`, 'info');
  };

  // Submit Review per SRS Section 4.8 (mandatory text comment)
  const submitReview = async (
    orderId: string | undefined,
    itemId: number,
    rating: number,
    emoji: number,
    comment: string
  ): Promise<boolean> => {
    if (!comment.trim()) {
      showToast('Review comment cannot be empty (per SRS Section 4.8)', 'warning');
      return false;
    }

    const anonymizedReg = currentUser?.regNo ? `${currentUser.regNo.slice(0, 4)}***` : '2502***';

    const newFeedback: Feedback = {
      id: Date.now(),
      orderId,
      itemId,
      regNo: currentUser?.regNo || '2502692',
      studentName: anonymizedReg,
      rating,
      emoji,
      comment: comment.trim(),
      date: 'Today',
    };

    setFeedbacks(prev => [newFeedback, ...prev]);

    setMenu(prev =>
      prev.map(m => {
        if (m.id === itemId) {
          const itemFeedbacks = [newFeedback, ...feedbacks.filter(f => f.itemId === itemId)];
          const sum = itemFeedbacks.reduce((a, b) => a + b.rating, 0);
          const updatedRating = parseFloat((sum / itemFeedbacks.length).toFixed(1));
          return { ...m, rating: updatedRating };
        }
        return m;
      })
    );

    if (orderId) {
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, reviewed: true } : o)));
    }

    setIsFeedbackOpen(false);
    setFeedbackTarget(null);
    showToast('⭐ Review submitted! Thank you for rating the cafeteria food.', 'success');
    return true;
  };

  // Student Registration per SRS Appendix C
  const registerStudent = (details: { name: string; regNo: string; email: string; password: string }): boolean => {
    const newStudent: StudentUser = {
      regNo: details.regNo,
      email: details.email,
      name: details.name,
      department: 'KCA University Student',
      walletBalance: 0, // Starts with KSh 0 per SRS Section 4.1!
      transactions: [],
    };
    setCurrentUser(newStudent);
    setRole('student');
    setIsLoggedIn(true);
    setIsRegisterOpen(false);
    showToast(`Welcome to MealTime, ${details.name}! Please top up your MealCard to place orders.`, 'success');
    addNotification('Account Created', `Registered as ${details.regNo}. New accounts start with KSh 0 balance. Top up via M-Pesa.`, 'system', '🎓');
    return true;
  };

  const loginStudent = (student: StudentUser) => {
    setCurrentUser(student);
    setRole('student');
    setIsLoggedIn(true);
    showToast(`Welcome back, ${student.name}!`, 'success');
  };

  const loginStaff = (staff: StaffUser) => {
    setCurrentStaff(staff);
    setRole('staff');
    setIsLoggedIn(true);
    setCurrentPage('kds');
    showToast(`Authenticated as ${staff.name} (${staff.role})`, 'success');
  };

  const loginAdmin = (admin: AdminUser) => {
    setCurrentAdmin(admin);
    setRole('admin');
    setIsLoggedIn(true);
    setCurrentPage('analytics');
    showToast(`Authenticated as Administrator (${admin.name})`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('Signed out of MealTime session', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        currentStaff,
        currentAdmin,
        isLoggedIn,
        loginStudent,
        loginStaff,
        loginAdmin,
        registerStudent,
        logout,
        currentPage,
        setCurrentPage,
        menu,
        toggleItemAvailability,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        cartCalories,
        cartProtein,
        orders,
        activeOrder,
        status,
        refreshStatus,
        notifications,
        unreadNotifsCount,
        markAllNotifsRead,
        addNotification,
        feedbacks,
        isCartOpen,
        setIsCartOpen,
        isStkOpen,
        setIsStkOpen,
        stkPayload,
        setStkPayload,
        isTopupOpen,
        setIsTopupOpen,
        isQrOpen,
        setIsQrOpen,
        qrOrder,
        setQrOrder,
        isFeedbackOpen,
        setIsFeedbackOpen,
        feedbackTarget,
        setFeedbackTarget,
        isItemDetailOpen,
        setIsItemDetailOpen,
        detailItem,
        setDetailItem,
        isNotifDrawerOpen,
        setIsNotifDrawerOpen,
        isRegisterOpen,
        setIsRegisterOpen,
        placeOrder,
        confirmMpesaOrder,
        topupWallet,
        updateOrderStatus,
        simulateIncomingOrder,
        submitReview,
        toasts,
        showToast,
        audioEnabled,
        setAudioEnabled,
        darkTheme,
        setDarkTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
