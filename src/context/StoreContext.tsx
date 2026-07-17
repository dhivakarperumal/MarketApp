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
}

const StoreContext = createContext<StoreContextData | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [categoriesCache, setCategoriesCache] = useState<CategoryItem[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
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
  }, [userId]);

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
        // prepare payload similar to web: minimal fields
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

  return (
    <StoreContext.Provider value={{ categoriesCache, setCategoriesCache, wishlist, fetchWishlist, toggleWishlist }}>
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
