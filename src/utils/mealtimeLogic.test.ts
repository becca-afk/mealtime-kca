import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getInitialSessionState,
  calculateBudgetCombo,
  calculateOrderTotals,
  canPayWithWallet,
  validateReviewComment,
} from './mealtimeLogic';
import { DEFAULT_MENU } from '../data/defaultData';

test('getInitialSessionState defaults to LoginScreen when no session is saved', () => {
  const state = getInitialSessionState(null, '');
  assert.deepEqual(state, { isLoggedIn: false, role: 'student', currentPage: 'home' });
});

test('getInitialSessionState restores saved role across reloads', () => {
  assert.deepEqual(getInitialSessionState('staff', ''), {
    isLoggedIn: true,
    role: 'staff',
    currentPage: 'kds',
  });
  assert.deepEqual(getInitialSessionState('admin', ''), {
    isLoggedIn: true,
    role: 'admin',
    currentPage: 'analytics',
  });
  assert.deepEqual(getInitialSessionState('student', ''), {
    isLoggedIn: true,
    role: 'student',
    currentPage: 'home',
  });
});

test('getInitialSessionState ignores invalid values and supports autostart=1', () => {
  assert.deepEqual(getInitialSessionState('unknown', ''), {
    isLoggedIn: false,
    role: 'student',
    currentPage: 'home',
  });
  assert.deepEqual(getInitialSessionState(null, '?autostart=1'), {
    isLoggedIn: true,
    role: 'student',
    currentPage: 'home',
  });
});

test('calculateBudgetCombo respects budget limit and availability', () => {
  const combo = calculateBudgetCombo(DEFAULT_MENU, 120);
  assert.ok(combo.items.length >= 1);
  assert.ok(combo.total <= 120);
  assert.ok(combo.items.every(i => i.available));

  const impossible = calculateBudgetCombo(DEFAULT_MENU, 5);
  assert.equal(impossible.items.length, 0);
  assert.equal(impossible.total, 0);
});

test('calculateOrderTotals adds KSh 5 packaging fee cleanly', () => {
  assert.deepEqual(calculateOrderTotals([{ price: 120, qty: 1 }]), {
    subtotal: 120,
    serviceFee: 5,
    total: 125,
  });
  assert.deepEqual(calculateOrderTotals([]), {
    subtotal: 0,
    serviceFee: 0,
    total: 0,
  });
});

test('canPayWithWallet checks sufficient MealCard funds accurately', () => {
  assert.equal(canPayWithWallet(850, 125), true);
  assert.equal(canPayWithWallet(125, 125), true);
  assert.equal(canPayWithWallet(0, 125), false);
  assert.equal(canPayWithWallet(100, 125), false);
});

test('validateReviewComment enforces non-empty comment per SRS 4.8', () => {
  assert.equal(validateReviewComment(''), false);
  assert.equal(validateReviewComment('   '), false);
  assert.equal(validateReviewComment('Hot food and quick service!'), true);
});
