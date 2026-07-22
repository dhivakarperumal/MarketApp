import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';
import { ArrowLeft, Trash2, Heart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
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
  const { removeFromWishlist } = useStore();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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

  const handleRemove = async (item: WishlistItem) => {
    try {
      const productId = item.product_id || item.id;
      await removeFromWishlist(productId);
      setWishlist(prev => prev.filter(w => w.id !== item.id && w.product_id !== productId));
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item from wishlist');
    }
  };

  return (
    <View className="flex-1 bg-[#f7f9f7]" style={{ paddingBottom: insets.bottom }}>
      <StatusBar barStyle="light-content" backgroundColor="#0e6827" />
      {/* Header Background */}
      <View 
        className="bg-[#0e6827] pb-5 px-4 rounded-b-[40px] z-10 shadow-sm shadow-green-900/20"
        style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 20 }}
      >
        <View className="flex-row items-center mb-2">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center mr-4"
          >
            <ArrowLeft size={22} color="#ffffff" />
          </TouchableOpacity>
          <View className="flex-row items-center">
            <Text className="text-2xl font-bold text-white mr-2">My Wishlist</Text>
            {wishlist.length > 0 && (
              <View className="bg-white/20 px-2 py-0.5 rounded-full">
                <Text className="text-white text-xs font-bold">{wishlist.length}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0e6827" />
        </View>
      ) : (
        <View className="flex-1 px-4 mt-4">
          <FlatList
            data={wishlist}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={wishlist.length === 0 ? { flex: 1, justifyContent: 'center' } : { paddingBottom: 110, paddingTop: 10 }}
            ListEmptyComponent={
              <View className="items-center justify-center bg-white rounded-3xl p-10 shadow-sm shadow-slate-200 mt-6 mx-2">
                <View className="w-24 h-24 rounded-full bg-red-50 items-center justify-center mb-6">
                  <Heart size={42} color="#ef4444" />
                </View>
                <Text className="text-lg font-bold text-[#0e6827]">Your Wishlist is Empty</Text>
                <Text className="text-slate-500 text-center mt-3 leading-6">
                  Save products you love and they'll appear here for quick access anytime.
                </Text>
                <TouchableOpacity 
                  className="mt-8 bg-[#ffc107] px-8 py-3 rounded-xl shadow-sm"
                  onPress={() => navigation.navigate('Shop' as never)}
                >
                  <Text className="text-black font-bold text-center">Browse Products</Text>
                </TouchableOpacity>
              </View>
            }
            renderItem={({ item }) => (
              <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm shadow-slate-200 border border-green-100 flex-row">
                {/* Image */}
                <Image
                  source={{ uri: item.product_image }}
                  className="w-24 h-24 rounded-xl border-2 border-green-100 bg-white mr-4"
                  resizeMode="cover"
                />

                {/* Details */}
                <View className="flex-1 justify-between">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-2">
                      <Text
                        className="text-sm font-bold text-slate-800"
                        numberOfLines={2}
                      >
                        {item.product_name}
                      </Text>

                      {item.variant_size && (
                        <Text className="text-slate-500 mt-1 font-medium text-xs">
                          Size: {item.variant_size}
                        </Text>
                      )}
                      
                      <View className="mt-2 flex-row items-center">
                        <Text className="text-[#0e6827] text-base font-bold mr-2">
                          ₹{item.price}
                        </Text>
                        {item.mrp && item.mrp !== item.price && (
                          <Text className="text-slate-400 line-through text-xs mt-0.5">
                            ₹{item.mrp}
                          </Text>
                        )}
                      </View>
                    </View>

                    <TouchableOpacity 
                      className="w-10 h-10 rounded-xl bg-red-50 items-center justify-center ml-2"
                      onPress={() => handleRemove(item)}
                    >
                      <Trash2 size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};