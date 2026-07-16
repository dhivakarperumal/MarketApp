import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

export const WishlistScreen = () => {
  const navigation = useNavigation();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist');
      setWishlist(response.data.wishlist || response.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch wishlist', err);
      setError('Failed to load wishlist. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWishlist();
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-slate-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900">My Wishlist</Text>
      </View>
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ef4444" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 mb-4">{error}</Text>
          <TouchableOpacity onPress={fetchWishlist} className="bg-red-500 px-6 py-2 rounded-lg">
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          className="p-4 flex-1"
          contentContainerStyle={wishlist.length === 0 ? { flex: 1, justifyContent: 'center' } : {}}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {wishlist.length === 0 ? (
            <View className="items-center justify-center p-6">
              <View className="w-20 h-20 rounded-full bg-red-50 items-center justify-center mb-4">
                <Heart size={32} color="#ef4444" />
              </View>
              <Text className="text-lg font-bold text-slate-800 mb-2">Your wishlist is empty</Text>
              <Text className="text-center text-slate-500">
                Save items you love here and purchase them later.
              </Text>
            </View>
          ) : (
            wishlist.map((item: any, index: number) => (
              <View key={item.id || index} className="flex-row bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-4">
                <View className="w-20 h-20 bg-slate-100 rounded-xl mr-3 overflow-hidden">
                  {item.image_url ? (
                    <Image source={{ uri: item.image_url }} className="w-full h-full" resizeMode="cover" />
                  ) : (
                    <View className="flex-1 items-center justify-center">
                      <Heart size={20} color="#cbd5e1" />
                    </View>
                  )}
                </View>
                <View className="flex-1 justify-between py-1">
                  <View>
                    <Text className="font-bold text-slate-800 text-base mb-1" numberOfLines={1}>{item.name || 'Product Name'}</Text>
                    <Text className="font-bold text-green-600">₹{item.price || 0}</Text>
                  </View>
                  <TouchableOpacity className="flex-row items-center bg-slate-900 self-start px-3 py-1.5 rounded-lg mt-1">
                    <ShoppingCart size={14} color="#fff" className="mr-1" />
                    <Text className="text-white font-bold text-xs">Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};
