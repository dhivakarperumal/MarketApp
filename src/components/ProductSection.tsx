import React from 'react';
import { View, Text, FlatList } from 'react-native';
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

export const ProductSection: React.FC<ProductSectionProps> = ({ title, highlight, products, itemWidth = 170 }) => {
  if (!products || products.length === 0) return null;

  return (
    <View className="bg-white mt-4 pb-4">
      <SectionHeading title={title} highlight={highlight} />
      <FlatList 
        data={products}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 10 }}
        renderItem={({ item }) => (
          <View style={{ width: itemWidth }}>
            <ProductCard product={item} />
          </View>
        )}
      />
    </View>
  );
};
