import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

interface WishlistItem {
  id: number;
  user_id: string;
  product_id: number;
  product_name: string;
  product_image: string;
  price: string;
  mrp: string;
  variant_size: string;
  variant_color: string | null;
  total_price: string;
}

export const Wishlist = () => {
  const { user } = useContext(AuthContext);

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.user_id) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/wishlist/${user?.user_id}`);

      setWishlist(response.data || []);
    } catch (error) {
      console.log('Wishlist Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-lg font-semibold text-gray-500">
              Your wishlist is empty
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-4 mb-4 shadow">

            <Image
              source={{ uri: item.product_image }}
              className="w-full h-44 rounded-xl"
              resizeMode="cover"
            />

            <Text
              className="text-lg font-bold text-gray-800 mt-3"
              numberOfLines={2}
            >
              {item.product_name}
            </Text>

            <Text className="text-green-700 text-xl font-bold mt-2">
              ₹{item.price}
            </Text>

            <Text className="text-gray-400 line-through">
              ₹{item.mrp}
            </Text>

            <Text className="text-gray-600 mt-1">
              Size: {item.variant_size}
            </Text>

          </View>
        )}
      />
    </View>
  );
};