import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import { ArrowLeft, Package } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export const OrdersScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      // Request with user_id param in case the backend supports it
      const response = await api.get('/orders', {
        params: { user_id: user?.user_id }
      });
      
      let fetchedOrders = response.data.orders || response.data || [];
      
      // Filter locally to guarantee we only show this user's orders
      if (user && user.user_id && Array.isArray(fetchedOrders)) {
        fetchedOrders = fetchedOrders.filter((order: any) => order.user_id === user.user_id);
      }
      
      setOrders(fetchedOrders);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch orders', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
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
          <Text className="text-xl font-bold text-white">My Orders</Text>
        </View>
      </View>
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 mb-4">{error}</Text>
          <TouchableOpacity onPress={fetchOrders} className="bg-green-600 px-6 py-2 rounded-lg">
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          className="p-4 flex-1"
          contentContainerStyle={orders.length === 0 ? { flex: 1, justifyContent: 'center' } : {}}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {orders.length === 0 ? (
            <View className="items-center justify-center py-10">
              <Package size={48} color="#cbd5e1" className="mb-4" />
              <Text className="text-slate-500">You have no recent orders.</Text>
            </View>
          ) : (
            orders.map((order: any, index: number) => (
              <View key={order.id || index} className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-bold text-slate-800">Order #{order.order_number || `ORD00${index + 1}`}</Text>
                  <Text className="text-green-600 font-medium text-sm bg-green-100 px-2 py-1 rounded-md">
                    {order.status || 'Delivered'}
                  </Text>
                </View>
                <Text className="text-slate-500 text-sm mb-2">
                  {order.total_items || 0} Items • ₹{order.total_amount || 0}
                </Text>
                <Text className="text-slate-400 text-xs">
                  Placed on {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recently'}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};
