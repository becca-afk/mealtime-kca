export type Role = 'student' | 'staff' | 'admin';

export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';

export type ProductCategory = 'all' | 'main' | 'snack' | 'drink' | 'veg' | 'halal';

export interface MenuItem {
  id: number;
  name: string;
  subname?: string;
  emoji: string;
  img: string;
  price: number;
  calories: number;
  protein: number;
  rating: number;
  orders?: number;
  soldCount?: number;
  category: 'main' | 'snack' | 'drink';
  tags: string[];
  allergen?: string;
  allergens?: string;
  desc: string;
  prepTime?: string;
  available: boolean;
  badge?: 'hot' | 'new' | 'popular';
}

export interface CartItem {
  item: MenuItem;
  qty: number;
}

export interface OrderItem {
  id: number;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  ticketNo: string;
  regNo: string;
  studentName: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  payMethod: 'kca_wallet' | 'mpesa';
  mpesaRef?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  pickupTime?: string;
  pickupCode?: string;
  notes?: string;
  line?: string;
  paymentStatus?: 'paid' | 'pending';
  reviewed?: boolean;
}

export interface Transaction {
  id: string;
  type: 'topup' | 'debit' | 'meal_payment' | 'welcome_grant';
  amount: number;
  date: string;
  ref: string;
  phone?: string;
}

export interface StudentUser {
  regNo: string;
  email: string;
  name: string;
  department: string;
  walletBalance: number;
  transactions?: Transaction[];
}

export interface StaffUser {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'System Administrator';
}

export interface Feedback {
  id: number;
  orderId?: string;
  itemId: number;
  regNo: string;
  studentName?: string;
  rating: number;
  emoji: number;
  comment: string;
  date: string;
}

export interface CafeteriaStatus {
  open: boolean;
  campus: string;
  crowdStatus: string;
  activeOrdersCount: number;
  estimatedWaitMins: number;
  serverTime: string;
}

export interface DashboardData {
  orders: Order[];
  todayOrders: Order[];
  revenue: number;
  cost: number;
  profit: number;
  pending: number;
  ready: number;
}

export interface AnalyticsData {
  ordersToday: number;
  avgRating: number;
  lowRatedCount: number;
  lowRatedItems: MenuItem[];
  topSellers: MenuItem[];
}

export interface DailySalesReport {
  date: string;
  totalOrdersProcessed: number;
  totalRevenue: number;
  mostPopularItem: string;
  popularItemOrders: number;
  averagePrepTime: string;
}
