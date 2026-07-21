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
import { ArrowLeft, Trash2, ShoppingCart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingBottom: insets.bottom }}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      {/* Header Background */}
      <View 
        className="bg-green-600 pb-5 px-4 rounded-b-[40px] z-10 shadow-sm shadow-green-700/20"
        style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 20 }}
      >
        <View className="flex-row items-center mb-2">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
          >
            <ArrowLeft size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">My Wishlist</Text>
        </View>
      </View>
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      ) : (
        <View className="flex-1 px-3 mt-4">
          <FlatList
            data={wishlist}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 4 }}
            contentContainerStyle={wishlist.length === 0 ? { flex: 1, justifyContent: 'center' } : { paddingBottom: 40, paddingTop: 10 }}
            ListEmptyComponent={
              <View className="items-center justify-center py-10 mt-10">
                <Text className="text-lg font-semibold text-slate-500">
                  Your wishlist is empty
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View className="bg-white rounded-3xl p-3 mb-4 shadow-sm shadow-slate-200 border border-slate-50 w-[48%]">
                <View className="relative">
                  <Image
                    source={{ uri: item.product_image }}
                    className="w-full h-36 rounded-2xl bg-slate-100"
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-sm"
                    onPress={() => console.log('Remove', item.id)}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                <View className="mt-3 flex-1 justify-between">
                  <View>
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
                  </View>

                  <View className="mt-3">
                    <View className="flex-row items-center flex-wrap">
                      <Text className="text-green-700 text-lg font-bold mr-2">
                        ₹{item.price}
                      </Text>
                      {item.mrp && item.mrp !== item.price && (
                        <Text className="text-slate-400 line-through text-xs mt-0.5">
                          ₹{item.mrp}
                        </Text>
                      )}
                    </View>
                    
                    <TouchableOpacity 
                      className="bg-green-600 flex-row items-center justify-center py-2.5 rounded-xl mt-3 shadow-sm shadow-green-200"
                      onPress={() => console.log('Add to cart')}
                    >
                      <ShoppingCart size={16} color="#ffffff" className="mr-1.5" />
                      <Text className="text-white font-bold text-xs">Add to Cart</Text>
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