import React from 'react';
import { View, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import ProductCard from './ProductCard';

interface ProductSectionProps {
  title: string;
  highlight: string;
  products: any[];
  itemWidth?: number;
}

const SectionHeading = ({ title, highlight }: { title: string, highlight: string }) => (
  <View className="px-4 py-4 bg-white mt-2">
    <View className="flex-row justify-between items-end">
      <View>
        <Text className="text-[24px] font-black text-gray-900">
          {title} <Text className="text-green-600">{highlight}</Text>
        </Text>
        <View className="w-16 h-1 bg-green-600 rounded-full mt-2" />
      </View>
    </View>
  </View>
);

export const ProductSection: React.FC<ProductSectionProps> = ({ title, highlight, products, itemWidth = '48%' as any }) => {
  if (!products || products.length === 0) return null;

  const chunkArray = (arr: any[], size: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const productSlides = chunkArray(products, 2);

  return (
    <View className="bg-white mt-4 pb-4">
      <SectionHeading title={title} highlight={highlight} />
      <View style={{ height: 350, marginTop: 10 }}>
        <Swiper
          autoplay
          autoplayTimeout={5}
          loop
          showsButtons={false}
          showsPagination={false}
        >
          {productSlides.map((slide, slideIndex) => (
            <View
              key={slideIndex}
              className="flex-row justify-start px-3 h-full"
              style={{ gap: 12 }}
            >
              {slide.map((item: any, index: number) => (
                <View key={item.id || index} style={{ flex: 1, maxWidth: '48%', height: '100%' }}>
                  <ProductCard product={item} />
                </View>
              ))}
            </View>
          ))}
        </Swiper>
      </View>
    </View>
  );
};
