import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation();

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

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      {/* Header Background */}
      <View className="bg-green-600 pb-10 pt-6 px-4 rounded-b-[40px] z-10 shadow-sm shadow-green-700/20">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
          >
            <ArrowLeft size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">My Wishlist</Text>
        </View>
      </View>
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      ) : (
        <View className="flex-1 px-4 -mt-6">
          <FlatList
            data={wishlist}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={wishlist.length === 0 ? { flex: 1, justifyContent: 'center' } : { paddingBottom: 20 }}
            ListEmptyComponent={
              <View className="items-center justify-center py-10 mt-10">
                <Text className="text-lg font-semibold text-slate-500">
                  Your wishlist is empty
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm shadow-slate-200 border border-slate-100">
                <Image
                  source={{ uri: item.product_image }}
                  className="w-full h-48 rounded-xl bg-slate-100"
                  resizeMode="cover"
                />

                <Text
                  className="text-lg font-bold text-slate-800 mt-3"
                  numberOfLines={2}
                >
                  {item.product_name}
                </Text>

                <View className="flex-row items-center mt-2">
                  <Text className="text-green-700 text-xl font-bold mr-2">
                    ₹{item.price}
                  </Text>
                  {item.mrp && item.mrp !== item.price && (
                    <Text className="text-slate-400 line-through text-sm">
                      ₹{item.mrp}
                    </Text>
                  )}
                </View>

                {item.variant_size && (
                  <Text className="text-slate-500 mt-1 font-medium text-sm">
                    Size: {item.variant_size}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};