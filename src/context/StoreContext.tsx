import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

type CategoryItem = {
  id?: number | string;
  name?: string;
  image?: string;
  images?: string[] | string;
};

interface StoreContextData {
  categoriesCache: CategoryItem[];
  setCategoriesCache: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
  wishlist: any[];
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (product: any) => Promise<void>;
  removeFromWishlist: (productId: any) => Promise<void>;
  updateCartQuantity: (cartId: any, qty: number, item?: any) => Promise<void>;
  removeFromCart: (cartId: any) => Promise<void>;
  budgetMode: boolean;
  budgetAmount: number;
  updateBudget: (mode: boolean, amount?: number) => Promise<void>;
}

const StoreContext = createContext<StoreContextData | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [categoriesCache, setCategoriesCache] = useState<CategoryItem[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const auth = React.useContext(AuthContext);
  const userId = auth?.user?.user_id || auth?.user?.id || null;

  const fetchWishlist = async () => {
    if (!userId) {
      setWishlist([]);
      return;
    }
    try {
      const res = await api.get(`/wishlist/${userId}`);
      setWishlist(res.data || []);
    } catch (err) {
      console.error('Fetch wishlist error:', err);
      setWishlist([]);
    }
  };

  useEffect(() => {
    fetchWishlist();
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    if (!userId) {
      setCart([]);
      return;
    }
    try {
      const res = await api.get(`/cart/${userId}`);
      setCart(res.data || []);
    } catch (err) {
      console.error('Fetch cart error:', err);
      setCart([]);
    }
  };

  const updateCartQuantity = async (cartId: any, qty: number, item?: any) => {
    if (!userId) return;
    try {
      const payload: any = { quantity: qty };
      if (item && item.price) {
        payload.price = item.price;
        payload.total_price = Number(item.price) * qty;
      }
      await api.put(`/cart/${cartId}`, payload);
      await fetchCart();
    } catch (err) {
      console.error('Update cart quantity error:', err);
    }
  };

  const removeFromCart = async (cartId: any) => {
    if (!userId) return;
    try {
      await api.delete(`/cart/${cartId}`);
      await fetchCart();
    } catch (err) {
      console.error('Remove from cart error:', err);
    }
  };

  // Budget settings persisted locally
  const [budgetMode, setBudgetMode] = useState<boolean>(false);
  const [budgetAmount, setBudgetAmount] = useState<number>(0);

  const updateBudget = async (mode: boolean, amount?: number) => {
    setBudgetMode(mode);
    if (typeof amount === 'number') setBudgetAmount(amount);
    // persist in backend or AsyncStorage if needed
  };

  const addToCart = async (product: any, qty = 1) => {
    if (!userId) {
      console.warn('User not logged in - cannot add to cart');
      return;
    }
    const productId = product?.id || product?.product_id;
    try {
      await api.post('/cart', {
        user_id: userId,
        product_id: productId,
        quantity: qty,
        price: product?.offer_price || product?.selling_price || product?.price || 0,
      });
      await fetchCart();
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  const toggleWishlist = async (product: any) => {
    if (!userId) {
      // could show a toast or prompt login
      console.warn('User not logged in - cannot toggle wishlist');
      return;
    }

    const productId = product?.id || product?.product_id;
    const exists = wishlist.some((w) => w.product_id === productId || w.id === productId);

    try {
      if (exists) {
        await api.delete(`/wishlist/${userId}/${productId}`);
      } else {
        await api.post('/wishlist', {
          user_id: userId,
          product_id: productId,
          price: product?.offer_price || product?.selling_price || product?.price || 0,
        });
      }
      await fetchWishlist();
    } catch (err) {
      console.error('Toggle wishlist error:', err);
    }
  };

  const removeFromWishlist = async (productId: any) => {
    if (!userId) return;
    try {
      await api.delete(`/wishlist/${userId}/${productId}`);
      await fetchWishlist();
    } catch (err) {
      console.error('Remove from wishlist error:', err);
    }
  };

  return (
    <StoreContext.Provider value={{ categoriesCache, setCategoriesCache, wishlist, fetchWishlist, toggleWishlist, removeFromWishlist, cart, fetchCart, addToCart, updateCartQuantity, removeFromCart, budgetMode, budgetAmount, updateBudget }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
