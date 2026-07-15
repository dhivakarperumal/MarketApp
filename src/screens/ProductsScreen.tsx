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
    const offerPercentage = parseFloat(item.offer);
    const sellingPrice = parseFloat(item.selling_price);
    const mrpPrice = parseFloat(item.mrp);

    return (
      <TouchableOpacity className="bg-white rounded-xl shadow-sm m-2 overflow-hidden flex-1 max-w-1/2">
        {/* Product Image */}
        <View className="relative w-full h-40 bg-gray-100">
          {item.thumbnail_image ? (
            <Image
              source={{ uri: item.thumbnail_image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <ShoppingCart size={40} color="#ccc" />
            </View>
          )}
          {renderProductBadges(item)}
        </View>

        {/* Product Info */}
        <View className="p-3 flex-1 justify-between">
          <View>
            <Text className="text-sm font-bold text-slate-900 mb-1" numberOfLines={2}>
              {item.name}
            </Text>
            
            {/* Rating */}
            {parseFloat(item.rating) > 0 && (
              <View className="flex-row items-center gap-1 mb-2">
                <Star size={14} color="#fbbf24" fill="#fbbf24" />
                <Text className="text-xs font-semibold text-slate-700">
                  {parseFloat(item.rating).toFixed(1)}
                </Text>
                <Text className="text-xs text-slate-500">({item.review_count})</Text>
              </View>
            )}

            {/* Price */}
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-lg font-bold text-green-600">₹{sellingPrice.toFixed(2)}</Text>
              <Text className="text-sm line-through text-slate-500">₹{mrpPrice.toFixed(2)}</Text>
              {offerPercentage > 0 && (
                <Text className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold">
                  {offerPercentage.toFixed(0)}% OFF
                </Text>
              )}
            </View>

            {/* Delivery Info */}
            {item.delivery_time && (
              <Text className="text-xs text-green-600 font-semibold mb-2">
                📦 {item.delivery_time}
              </Text>
            )}

            {/* Stock Status */}
            <Text className={`text-xs font-semibold ${parseFloat(item.stock_quantity) > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(item.stock_quantity) > 0 ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity className="bg-green-600 py-2 rounded-lg mt-3 flex-row items-center justify-center gap-2">
            <ShoppingCart size={16} color="white" />
            <Text className="text-white font-bold text-sm">Add</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
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
    <View className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-green-600 px-4 py-4">
          <Text className="text-white text-2xl font-bold">Products</Text>
          <Text className="text-green-100 text-sm">{products.length} items available</Text>
        </View>

        {/* Products Grid */}
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </ScrollView>
    </View>
  );
};
