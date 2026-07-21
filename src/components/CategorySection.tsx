import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Animated } from 'react-native';
import api from '../services/api';
import { useStore } from '../context/StoreContext';

const defaultImage = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';

export const CategorySection = () => {
  const { categoriesCache, setCategoriesCache } = useStore();
  const [categories, setCategories] = useState(categoriesCache || []);
  const [loading, setLoading] = useState(!categoriesCache || categoriesCache.length === 0);

  const topListRef = useRef<FlatList>(null);
  const bottomListRef = useRef<FlatList>(null);
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

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

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [loading, pulseAnim]);

  const halfLength = Math.ceil(categories.length / 2);
  const topRowCategories = categories.slice(0, halfLength);
  const bottomRowCategories = categories.slice(halfLength);

  // Auto-slide logic
  useEffect(() => {
    if (topRowCategories.length === 0 || bottomRowCategories.length === 0) return;

    let topIndex = 0;
    let bottomIndex = 0;

    const interval = setInterval(() => {
      topIndex = (topIndex + 1) % topRowCategories.length;
      bottomIndex = (bottomIndex + 1) % bottomRowCategories.length;

      topListRef.current?.scrollToIndex({
        index: topIndex,
        animated: true,
      });

      bottomListRef.current?.scrollToIndex({
        index: bottomIndex,
        animated: true,
      });
    }, 3000); // Slides every 3 seconds

    return () => clearInterval(interval);
  }, [topRowCategories.length, bottomRowCategories.length]);

  const getItemLayout = (_: any, index: number) => ({
    length: 128, // 112 (w-28) + 16 (gap)
    offset: 128 * index,
    index,
  });

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

  const renderSkeletonCard = (key: number) => (
    <Animated.View
      key={key}
      className="w-28 bg-white rounded-2xl border border-gray-100 items-center py-3 px-2"
      style={{
        opacity: pulseAnim,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <View className="w-20 h-20 bg-gray-100 rounded-lg mb-3" />
      <View className="w-16 h-3 bg-gray-200 rounded-full" />
    </Animated.View>
  );

  return (
    <View className="py-6 bg-white overflow-hidden">
      <View className="px-4 flex-row justify-between items-end mb-6">
        <View>
          <Text className="text-[24px] font-black text-gray-900">
            Shop by <Text className="text-green-600">Category</Text>
          </Text>
          <View className="w-16 h-1 bg-green-600 rounded-full mt-2" />
        </View>
      </View>

      {loading ? (
        <View className="flex-col gap-y-6">
          <View className="flex-row gap-4 px-4">
            {Array.from({ length: 5 }).map((_, index) => renderSkeletonCard(index))}
          </View>
          <View className="flex-row gap-4 px-4 -ml-8">
            {Array.from({ length: 5 }).map((_, index) => renderSkeletonCard(index + 5))}
          </View>
        </View>
      ) : (
        <View className="flex-col gap-y-6">
          <FlatList
            ref={topListRef}
            data={topRowCategories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item?.id?.toString() || `top-${index}`}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
            renderItem={renderCategoryItem}
            getItemLayout={getItemLayout}
          />
          <FlatList
            ref={bottomListRef}
            data={bottomRowCategories}
            horizontal
            inverted
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item?.id?.toString() || `bottom-${index}`}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
            renderItem={renderCategoryItem}
            getItemLayout={getItemLayout}
          />
        </View>
      )}
    </View>
  );
};
