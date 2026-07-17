import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { useStore } from '../context/StoreContext';
import Swiper from "react-native-swiper";

const defaultImage = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';

export const CategorySection = () => {

  const chunkArray = (arr: any[], size: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const { categoriesCache, setCategoriesCache } = useStore();
  const [categories, setCategories] = useState(categoriesCache || []);
  const [loading, setLoading] = useState(!categoriesCache || categoriesCache.length === 0);
  const categorySlides = chunkArray(categories, 6);

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
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-xl font-bold text-gray-900">
          Shop By Category
        </Text>

        <TouchableOpacity activeOpacity={0.8}>
          <Text className="text-green-600 font-semibold">
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-row flex-wrap justify-between">
          {Array.from({ length: 8 }).map((_, index) => (
            <View
              key={index}
              className="w-[30%] mb-6 items-center"
            >
              <View className="w-16 h-16 rounded-2xl bg-gray-200 mb-2" />
              <View className="w-12 h-3 rounded-full bg-gray-200" />
            </View>
          ))}
        </View>
      ) : (
        <View style={{ height: 300 }}>
          <Swiper
            autoplay
            autoplayTimeout={4}
            loop
            showsButtons={false}
            showsPagination
            dotColor="#D1D5DB"
            activeDotColor="#16A34A"
            paginationStyle={{ bottom: -5 }}
          >
            {categorySlides.map((slide, slideIndex) => (
              <View
                key={slideIndex}
                className="flex-row flex-wrap justify-between px-1"
              >
                {slide.map((cat: any, index: number) => {
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
                      className="w-[30%] mb-6 items-center"
                      activeOpacity={0.85}
                    >
                      <View
                        className="w-24 h-24 rounded-3xl bg-white border border-gray-100 p-1.5 mb-3"
                        style={{
                          elevation: 3,
                          shadowColor: "#000",
                          shadowOpacity: 0.08,
                          shadowRadius: 6,
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                        }}
                      >
                        <Image
                          source={{ uri: image }}
                          className="w-full h-full rounded-2xl"
                          resizeMode="contain"
                        />
                      </View>

                      <Text
                        numberOfLines={2}
                        className="text-xs font-semibold text-gray-700 text-center"
                      >
                        {name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </Swiper>
        </View>
      )}
    </View>
  );
};
