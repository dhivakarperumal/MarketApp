import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Star, ShoppingCart, Zap, TrendingUp } from 'lucide-react-native';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

interface Product {
  id: number;
  name: string;
  selling_price: string;
  mrp: string;
  offer: string;
  thumbnail_image: string;
  rating: string;
  review_count: number;
  status: string;
  featured_product: boolean;
  best_seller: boolean;
  todays_deal: boolean;
  delivery_time: string;
  stock_quantity: string;
  product_code: string;
}

export const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/products');

      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && response.data.data) {
        setProducts(response.data.data);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      console.error('Fetch Products Error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load products';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderProductBadges = (product: Product) => {
    return (
      <View className="absolute top-2 right-2 flex-col gap-1">
        {product.todays_deal && (
          <View className="bg-red-500 px-2 py-1 rounded-lg flex-row items-center gap-1">
            <Zap size={12} color="white" />
            <Text className="text-white text-[10px] font-bold">Deal</Text>
          </View>
        )}
        {product.best_seller && (
          <View className="bg-orange-500 px-2 py-1 rounded-lg">
            <Text className="text-white text-[10px] font-bold">Bestseller</Text>
          </View>
        )}
        {product.featured_product && (
          <View className="bg-blue-500 px-2 py-1 rounded-lg flex-row items-center gap-1">
            <TrendingUp size={12} color="white" />
            <Text className="text-white text-[10px] font-bold">Featured</Text>
          </View>
        )}
      </View>
    );
  };

  const renderProductCard = ({ item }: { item: Product }) => {
    return <ProductCard product={item} />;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-slate-600 mt-3">Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center px-6">
        <Text className="text-red-600 font-bold text-lg mb-3">Oops!</Text>
        <Text className="text-slate-600 text-center mb-6">{error}</Text>
        <TouchableOpacity
          onPress={fetchProducts}
          className="bg-green-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-bold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ShoppingCart size={48} color="#ccc" />
        <Text className="text-slate-600 mt-3 font-semibold">No products available</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 py-5 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Products Grid */}
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 8,
          }}
          contentContainerStyle={{
            paddingVertical: 8,
            paddingHorizontal: 4,
            paddingBottom: 110,
          }}
        />
      </ScrollView>
    </View>
  );
};
