import React, { createContext, useContext, useState, ReactNode } from 'react';

type CategoryItem = {
  id?: number | string;
  name?: string;
  image?: string;
  images?: string[] | string;
};

interface StoreContextData {
  categoriesCache: CategoryItem[];
  setCategoriesCache: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
}

const StoreContext = createContext<StoreContextData | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [categoriesCache, setCategoriesCache] = useState<CategoryItem[]>([]);

  return (
    <StoreContext.Provider value={{ categoriesCache, setCategoriesCache }}>
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
