'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { User, CartItem, ToastNotification } from '@/types';
import { apiRequest, ApiError, errorMessage } from '@/lib/api-client';
import { parseSession, parseCart, type Credentials, type Registration } from '@/lib/contracts';

interface AppContextType {
  // Auth state
  user: User | null;
  isLoggedIn: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (details: Registration) => Promise<void>;
  authLoading: boolean;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;

  // Cart state
  cart: CartItem[];
  cartLoading: boolean;
  cartError: string;
  refreshCart: () => Promise<void>;
  checkoutFromCart: boolean;
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


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState('');
  const [checkoutFromCart, setCheckoutFromCart] = useState(false);
  const cartLock = useRef(false);
  const authLock = useRef(false);
  const cartGeneration = useRef(0);
  const authGeneration = useRef(0);
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

  useEffect(() => {
    const controller = new AbortController();
    const generation = authGeneration.current;
    apiRequest('/auth/me', { signal: controller.signal }).then(value => {
      if (!controller.signal.aborted && generation === authGeneration.current) setUser(parseSession(value).user);
    }).catch(error => {
      if (!controller.signal.aborted && !(error instanceof ApiError && error.status === 401)) {
        addToast('Chưa thể kiểm tra tài khoản', errorMessage(error));
      }
    }).finally(() => { if (!controller.signal.aborted && generation === authGeneration.current) setAuthLoading(false); });
    void refreshCart();
    const expired = () => {
      authGeneration.current++; cartGeneration.current++;
      setUser(null); setCart([]); setCheckoutItems([]); setIsCheckoutOpen(false);
      setCartError('Phiên đã hết hạn. Vui lòng đăng nhập và tải lại giỏ hàng.');
    };
    const resume = () => { if (document.visibilityState === 'visible') {
      const generation = authGeneration.current;
      apiRequest('/auth/me').then(value => { if (generation === authGeneration.current) setUser(parseSession(value).user); }).catch(error => {
        if (generation === authGeneration.current && error instanceof ApiError && error.status === 401) expired();
      });
    } };
    window.addEventListener('aura:session-expired', expired);
    document.addEventListener('visibilitychange', resume);
    return () => { controller.abort(); cartGeneration.current++; window.removeEventListener('aura:session-expired', expired); document.removeEventListener('visibilitychange', resume); };
  }, []);

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

  // Identity is always obtained from the server; the browser never chooses its role.
  const login = async (credentials: Credentials) => {
    if (authLock.current) throw new ApiError(409);
    authLock.current = true; authGeneration.current++; setAuthLoading(true);
    try {
      await apiRequest('/auth/login', { method: 'POST', body: credentials });
      const session = parseSession(await apiRequest('/auth/me'));
      setUser(session.user); setIsAuthModalOpen(false);
      await refreshCart();
      addToast('Đăng nhập thành công', 'Chào mừng ' + session.user.name + ' quay trở lại.', 'success');
    } finally { authLock.current = false; setAuthLoading(false); }
  };
  const register = async (details: Registration) => {
    await apiRequest('/auth/register', { method: 'POST', body: details });
    setAuthModalMode('login');
    addToast('Đã tạo tài khoản', 'Vui lòng kiểm tra email xác minh trước khi đăng nhập.', 'success');
  };
  const logout = async () => {
    if (authLock.current) return;
    authLock.current = true; authGeneration.current++;
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
      cartGeneration.current++; setUser(null); setCart([]); setCheckoutItems([]); setIsCheckoutOpen(false); setIsCartOpen(false);
      addToast('Đã đăng xuất', 'Phiên đăng nhập đã kết thúc.', 'info');
    } catch (error) { addToast('Chưa thể đăng xuất', errorMessage(error)); }
    finally { authLock.current = false; }
  };
  async function refreshCart() {
    const generation = ++cartGeneration.current;
    setCartLoading(true);
    try {
      const items = parseCart(await apiRequest('/cart'));
      if (generation === cartGeneration.current) { setCart(items); setCartError(''); }
    } catch (error) { if (generation === cartGeneration.current) { setCart([]); setCartError(errorMessage(error)); } }
    finally { if (generation === cartGeneration.current) setCartLoading(false); }
  }
  async function mutateCart(path: string, method: 'POST' | 'PUT' | 'DELETE', body?: unknown) {
    if (cartLock.current) return;
    cartLock.current = true; const generation = ++cartGeneration.current;
    setCartLoading(true);
    try {
      const items = parseCart(await apiRequest(path, { method, body }));
      if (generation === cartGeneration.current) { setCart(items); setCartError(''); }
    } catch (error) {
      if (generation === cartGeneration.current) setCartError(errorMessage(error));
      addToast('Chưa thể cập nhật giỏ hàng', errorMessage(error));
    } finally { cartLock.current = false; if (generation === cartGeneration.current) setCartLoading(false); }
  }
  const addToCart = async (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const quantity = item.quantity ?? 1;
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 999) return;
    setIsCartOpen(true);
    // Prices, names and availability are resolved by BE from the product ID.
    await mutateCart('/cart/items', 'POST', { productId: item.id, quantity });
  };
  const removeFromCart = (id: string) => { void mutateCart('/cart/items/' + encodeURIComponent(id), 'DELETE'); };
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) { removeFromCart(id); return; }
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 999) return;
    void mutateCart('/cart/items/' + encodeURIComponent(id), 'PUT', { quantity });
  };
  const clearCart = () => { void mutateCart('/cart', 'DELETE'); };

  // Checkout / Buy Now methods
  const openCheckout = (items?: CartItem[] | CartItem) => {
    if (authLoading) { addToast('Đang kiểm tra tài khoản', 'Vui lòng chờ kiểm tra phiên đăng nhập hoàn tất.'); return; }
    if (!user) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      addToast('Yêu cầu đăng nhập', 'Vui lòng đăng nhập tài khoản để tiến hành đặt hàng.', 'info');
      return;
    }

    if (!items && (cartLoading || cartError || !cart.length)) { addToast('Chưa thể đặt hàng', 'Vui lòng tải lại giỏ hàng trước khi tiếp tục.'); return; }
    setCheckoutFromCart(!items);
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
    if (authLoading) { addToast('Đang kiểm tra tài khoản', 'Vui lòng chờ kiểm tra phiên đăng nhập hoàn tất.'); return; }
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

    setCheckoutFromCart(false);
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
        register,
        authLoading,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        cart,
        cartLoading,
        cartError,
        refreshCart,
        checkoutFromCart,
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
