import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
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
      const sortedData = data.sort((a: any, b: any) => a.id - b.id);
      setCategories(sortedData);
      setCategoriesCache(sortedData);
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

  const halfLength = Math.ceil(categories.length / 2);
  const topRowCategories = categories.slice(0, halfLength);
  const bottomRowCategories = categories.slice(halfLength);

  const renderCategoryItem = ({ item: cat, index }: { item: any; index: number }) => {
    const name = String(cat?.name || "Category").trim();
    const image =
      typeof cat?.images === "string"
        ? cat.images
        : Array.isArray(cat?.images)
          ? cat.images[0]
          : cat?.image || defaultImage;

    return (
      <TouchableOpacity
        key={cat?.id || `${name}-${index}`}
        activeOpacity={0.9}
        className="w-28 items-center"
      >
        <View
          className="w-full bg-white rounded-2xl border border-gray-100 items-center py-3 px-2"
          style={{
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 3 },
          }}
        >
          <View className="w-20 h-20 bg-gray-50 rounded-lg items-center justify-center">
            <Image
              source={{ uri: image }}
              className="w-16 h-16"
              resizeMode="contain"
            />
          </View>

          <Text
            numberOfLines={1}
            className="mt-2 text-[13px] font-extrabold text-gray-800 text-center leading-4 px-1"
          >
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="py-6 bg-white">
      <View className="px-4 flex-row justify-between items-end mb-6">
        <View>
          <Text className="text-[24px] font-black text-gray-900">
            Shop by <Text className="text-green-600">Category</Text>
          </Text>
          <View className="w-16 h-1 bg-green-600 rounded-full mt-2" />
        </View>
      </View>

      {loading ? (
        <View className="px-4 flex-row flex-wrap justify-between">
          {Array.from({ length: 6 }).map((_, index) => (
            <View
              key={index}
              className="w-[30%] mb-6 items-center"
            >
              <View className="w-24 h-24 rounded-2xl bg-gray-200 mb-2" />
              <View className="w-12 h-3 rounded-full bg-gray-200" />
            </View>
          ))}
        </View>
      ) : (
        <View className="flex-col gap-y-6">
          <FlatList
            data={topRowCategories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item?.id?.toString() || `top-${index}`}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
            renderItem={renderCategoryItem}
          />
          <FlatList
            data={bottomRowCategories}
            horizontal
            inverted
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item?.id?.toString() || `bottom-${index}`}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
            renderItem={renderCategoryItem}
          />
        </View>
      )}
    </View>
  );
};
