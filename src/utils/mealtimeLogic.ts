import { MenuItem, Role } from '../types';

export const SESSION_STORAGE_KEY = 'mealtime_session';
export const PACKAGING_SERVICE_FEE = 5;

export function safeSessionGet(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSessionSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Ignore storage quota or sandboxed iframe SecurityError
  }
}

export function safeSessionRemove(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Ignore storage quota or sandboxed iframe SecurityError
  }
}

export function isValidRole(value: string | null | undefined): value is Role {
  return value === 'student' || value === 'staff' || value === 'admin';
}

export function getInitialSessionState(
  storedRole: string | null,
  searchString = ''
): { isLoggedIn: boolean; role: Role; currentPage: string } {
  if (isValidRole(storedRole)) {
    return {
      isLoggedIn: true,
      role: storedRole,
      currentPage: storedRole === 'staff' ? 'kds' : storedRole === 'admin' ? 'analytics' : 'home',
    };
  }

  if (searchString) {
    const params = new URLSearchParams(searchString);
    if (params.get('autostart') === '1') {
      return {
        isLoggedIn: true,
        role: 'student',
        currentPage: 'home',
      };
    }
  }

  return {
    isLoggedIn: false,
    role: 'student',
    currentPage: 'home',
  };
}

export function calculateBudgetCombo(
  menu: MenuItem[],
  budget: number
): { items: MenuItem[]; total: number; calories: number; protein: number } {
  const available = menu.filter(m => m.available && m.price <= budget);

  if (available.length === 0) {
    return { items: [], total: 0, calories: 0, protein: 0 };
  }

  if (budget <= 50) {
    const topSingle = [...available].sort((a, b) => b.rating - a.rating)[0];
    return topSingle
      ? { items: [topSingle], total: topSingle.price, calories: topSingle.calories, protein: topSingle.protein }
      : { items: [], total: 0, calories: 0, protein: 0 };
  }

  let bestPair: [MenuItem, MenuItem] | null = null;
  let highestRating = -1;

  for (let i = 0; i < available.length; i++) {
    for (let j = i + 1; j < available.length; j++) {
      const sum = available[i].price + available[j].price;
      if (sum <= budget) {
        const avgScore = (available[i].rating + available[j].rating) / 2;
        if (avgScore > highestRating) {
          highestRating = avgScore;
          bestPair = [available[i], available[j]];
        }
      }
    }
  }

  if (bestPair) {
    return {
      items: bestPair,
      total: bestPair[0].price + bestPair[1].price,
      calories: bestPair[0].calories + bestPair[1].calories,
      protein: bestPair[0].protein + bestPair[1].protein,
    };
  }

  const bestSingle = [...available].sort((a, b) => b.rating - a.rating)[0];
  if (bestSingle) {
    return {
      items: [bestSingle],
      total: bestSingle.price,
      calories: bestSingle.calories,
      protein: bestSingle.protein,
    };
  }

  return { items: [], total: 0, calories: 0, protein: 0 };
}

export function calculateOrderTotals(
  items: { price: number; qty: number }[],
  serviceFee = PACKAGING_SERVICE_FEE
): { subtotal: number; serviceFee: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const fee = items.length > 0 ? serviceFee : 0;
  return {
    subtotal,
    serviceFee: fee,
    total: subtotal + fee,
  };
}

export function canPayWithWallet(walletBalance: number, orderTotal: number): boolean {
  return Number.isFinite(walletBalance) && Number.isFinite(orderTotal) && orderTotal > 0 && walletBalance >= orderTotal;
}

export function validateReviewComment(comment: string): boolean {
  return comment.trim().length > 0;
}
