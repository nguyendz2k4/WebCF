'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, CartItem, ToastNotification } from '@/types';

interface AppContextType {
  // Auth state
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;

  // Cart state
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  formattedCartTotal: string;

  // Checkout / Buy Now state
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutItems: CartItem[];
  openCheckout: (items?: CartItem[] | CartItem) => void;
  buyNow: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;

  // Toast state
  toasts: ToastNotification[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'cart') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_USERS: Record<string, User> = {
  owner: {
    id: 'usr_owner_01',
    name: 'Nguyễn Đăng Quang',
    email: 'quang.nguyen@auracoffee.vn',
    phone: '0909 000 247',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'owner',
    shopName: 'Aura Specialty Coffee Lab',
  },
  barista: {
    id: 'usr_barista_02',
    name: 'Lê Minh Tuấn (Head Barista)',
    email: 'tuan.barista@auracoffee.vn',
    phone: '0912 345 678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'barista',
    shopName: 'The Workshop Coffee',
  },
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  // Toast state
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Initial local storage hydration
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('aura_coffee_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const savedCart = localStorage.getItem('aura_coffee_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Error hydrating localStorage', e);
    }
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_coffee_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [cart]);

  // Save User to LocalStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('aura_coffee_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('aura_coffee_user');
      }
    } catch (e) {
      console.error('Error saving user to localStorage', e);
    }
  }, [user]);

  // Toast Helper
  const addToast = (title: string, message: string, type: 'success' | 'info' | 'cart' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth methods
  const login = (userData: Partial<User>) => {
    const fullUser: User = {
      id: userData.id || `usr_${Date.now()}`,
      name: userData.name || 'Quý Khách Hàng',
      email: userData.email || 'guest@customer.vn',
      phone: userData.phone || '0909 000 247',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: userData.role || 'guest',
      shopName: userData.shopName || 'Quán Cà Phê Mới',
    };
    setUser(fullUser);
    setIsAuthModalOpen(false);
    addToast('Đăng nhập thành công', `Chào mừng ${fullUser.name} đã quay trở lại Aura Coffee!`, 'success');
  };

  const logout = () => {
    setUser(null);
    addToast('Đã đăng xuất', 'Bạn đã đăng xuất an toàn khỏi tài khoản.', 'info');
  };

  // Cart methods
  const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qty = newItem.quantity || 1;
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === newItem.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [...prevCart, { ...newItem, quantity: qty }];
      }
    });

    addToast(
      'Đã thêm vào giỏ hàng',
      `${newItem.title} (${qty > 1 ? qty + 'x' : '1 sản phẩm'})`,
      'cart'
    );
  };

  const removeFromCart = (id: string) => {
    const removedItem = cart.find((i) => i.id === id);
    setCart((prev) => prev.filter((item) => item.id !== id));
    if (removedItem) {
      addToast('Đã xóa khỏi giỏ', `${removedItem.title} đã được loại bỏ.`, 'info');
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Checkout / Buy Now methods
  const openCheckout = (items?: CartItem[] | CartItem) => {
    if (!user) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      addToast('Yêu cầu đăng nhập', 'Vui lòng đăng nhập tài khoản để tiến hành đặt hàng.', 'info');
      return;
    }

    if (items) {
      const itemList = Array.isArray(items) ? items : [items];
      setCheckoutItems(itemList);
    } else {
      setCheckoutItems(cart);
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const buyNow = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const directItem: CartItem = {
      ...item,
      quantity: item.quantity || 1,
    };

    if (!user) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      addToast('Yêu cầu đăng nhập', 'Vui lòng đăng nhập tài khoản để tiến hành Mua Ngay.', 'info');
      return;
    }

    setCheckoutItems([directItem]);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const formattedCartTotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(cartTotal);

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        formattedCartTotal,
        isCheckoutOpen,
        setIsCheckoutOpen,
        checkoutItems,
        openCheckout,
        buyNow,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export { DEMO_USERS };
