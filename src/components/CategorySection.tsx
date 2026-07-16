import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { useStore } from '../context/StoreContext';

const defaultImage = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';

export const CategorySection = () => {
  const { categoriesCache, setCategoriesCache } = useStore();
  const [categories, setCategories] = useState(categoriesCache || []);
  const [loading, setLoading] = useState(!categoriesCache || categoriesCache.length === 0);

  const fetchCategories = async () => {
    try {
      if (categoriesCache && categoriesCache.length > 0) {
        setCategories(categoriesCache);
        setLoading(false);
        return;
      }

      const res = await api.get('/categories');
      const data = Array.isArray(res.data) ? res.data : [];
      setCategories(data);
      setCategoriesCache(data);
    } catch (error) {
      console.error(error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [categoriesCache, setCategoriesCache]);

  return (
    <View className="px-4 py-6 bg-white">
      <Text className="text-xl font-bold text-gray-900 mb-4">Shop By Category</Text>

      {loading ? (
        <View className="flex-row flex-wrap justify-between">
          {Array.from({ length: 8 }).map((_, index) => (
            <View
              key={index}
              className="w-[22%] mb-4 items-center"
            >
              <View className="w-16 h-16 rounded-2xl bg-gray-200 mb-2" />
              <View className="w-12 h-3 rounded-full bg-gray-200" />
            </View>
          ))}
        </View>
      ) : (
        <View className="flex-row flex-wrap justify-between">
          {Array.isArray(categories) && categories.map((cat, index) => {
            const name = String(cat?.name || 'Category').trim();
            const image =
              typeof cat?.images === 'string'
                ? cat.images
                : Array.isArray(cat?.images)
                  ? cat.images[0]
                  : cat?.image || defaultImage;

            return (
              <TouchableOpacity
                key={cat?.id || `${name}-${index}`}
                className="w-[22%] mb-4 items-center"
                activeOpacity={0.8}
              >
                <View className="w-16 h-16 rounded-2xl border border-gray-100 bg-white shadow-sm p-2 mb-2">
                  <Image
                    source={{ uri: image }}
                    className="w-full h-full rounded-xl"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-xs font-semibold text-gray-700 text-center">
                  {name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};
