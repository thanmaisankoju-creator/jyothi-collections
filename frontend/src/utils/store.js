// frontend/src/utils/store.js
import { create } from 'zustand';

// ── CART STORE ────────────────────────────────────────────
export const useCartStore = create((set, get) => ({
  items: [],

  addItem: (product, size) => {
    const items   = get().items;
    const existing = items.find(i => i.id === product.id && i.size === size);
    if (existing) {
      set({ items: items.map(i =>
        i.id === product.id && i.size === size
          ? { ...i, qty: i.qty + 1 }
          : i
      )});
    } else {
      set({ items: [...items, { ...product, size, qty: 1 }] });
    }
  },

  changeQty: (id, size, delta) => {
    const items = get().items
      .map(i => i.id === id && i.size === size ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0);
    set({ items });
  },

  removeItem: (id, size) =>
    set({ items: get().items.filter(i => !(i.id === id && i.size === size)) }),

  clearCart: () => set({ items: [] }),

  total:    () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
  totalQty: () => get().items.reduce((s, i) => s + i.qty, 0),
}));

// ── THEME STORE ───────────────────────────────────────────
export const useThemeStore = create((set) => ({
  theme: 'classic',
  setTheme: (t) => {
    document.documentElement.setAttribute('data-theme', t);
    set({ theme: t });
  },
}));

// ── ADMIN STORE ───────────────────────────────────────────
export const useAdminStore = create((set) => ({
  isAuthenticated: !!localStorage.getItem('jc_admin_token'),
  token: localStorage.getItem('jc_admin_token') || null,

  login: (token) => {
    localStorage.setItem('jc_admin_token', token);
    set({ isAuthenticated: true, token });
  },

  logout: () => {
    localStorage.removeItem('jc_admin_token');
    set({ isAuthenticated: false, token: null });
  },
}));

// ── UI STORE ──────────────────────────────────────────────
export const useUIStore = create((set) => ({
  cartOpen     : false,
  searchOpen   : false,
  adminLockOpen: false,
  adminPanelOpen: false,

  openCart      : () => set({ cartOpen: true }),
  closeCart     : () => set({ cartOpen: false }),
  openSearch    : () => set({ searchOpen: true }),
  closeSearch   : () => set({ searchOpen: false }),
  openAdminLock : () => set({ adminLockOpen: true }),
  closeAdminLock: () => set({ adminLockOpen: false }),
  openAdminPanel: () => set({ adminPanelOpen: true, adminLockOpen: false }),
  closeAdminPanel: () => set({ adminPanelOpen: false }),
}));
