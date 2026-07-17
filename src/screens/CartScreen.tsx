import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

import { ShoppingCart } from "lucide-react-native";
import {
  Plus,
  Minus,
  Trash2,
} from "lucide-react-native";

import { Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface CartItem {
  id: number;
  user_id: string;
  product_id: number;

  name: string;
  product_name: string;

  image: string;
  product_image: string;

  variant_color: string;
  variant_size: string;

  quantity: number;

  price: string;
  mrp: string;

  total_price: string;
  total_stock: string;
}

export const CartScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<any>();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  //-----------------------------------
  // Fetch Cart
  //-----------------------------------

  const fetchCart = async () => {
    try {
      const response = await api.get(`/cart/${user.id}`);

      setCart(response.data || []);
    } catch (error) {
      console.log("Cart Error :", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  //-----------------------------------
  // Initial Load
  //-----------------------------------

  useEffect(() => {
    fetchCart();
  }, []);

  //-----------------------------------
  // Pull To Refresh
  //-----------------------------------

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCart();
  }, []);

  //-----------------------------------
  // Sub Total
  //-----------------------------------

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  //-----------------------------------
  // Loading
  //-----------------------------------

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#16a34a" />

        <Text className="mt-4 text-slate-500">
          Loading Cart...
        </Text>
      </View>
    );
  }

  //-----------------------------------
  // Empty Cart
  //-----------------------------------

  if (cart.length === 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">

        <View className="w-28 h-28 rounded-full bg-green-100 items-center justify-center">

          <ShoppingCart
            size={55}
            color="#16a34a"
          />

        </View>

        <Text className="text-2xl font-bold mt-6">
          Your Cart is Empty
        </Text>

        <Text className="text-slate-500 text-center mt-3 leading-6">
          Looks like you haven't added anything to your cart yet.
        </Text>

      </View>
    );
  }

  const updateQuantity = async (
    item: CartItem,
    newQty: number
  ) => {
    if (newQty < 1) return;

    try {
      await api.put(`/cart/${item.id}`, {
        quantity: newQty,
      });

      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  const removeItem = async (id: number) => {
    try {
      await api.delete(`/cart/${id}`);

      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  //-----------------------------------
  // Main Screen
  //-----------------------------------

  return (
    <View className="flex-1 bg-slate-100">

      {/* Header */}

      <View className="bg-white px-5 pt-5 pb-4">

        <Text className="text-3xl font-bold">
          My Cart
        </Text>

        <Text className="text-slate-500 mt-1">
          {cart.length} Items
        </Text>

      </View>

      {/* Cart List */}

      <View className="flex-1">

        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#16a34a"]}
            />
          }
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 240,
          }}
          renderItem={({ item }) => (

            <View
              className="bg-white rounded-3xl p-4 mb-4"
              style={{
                elevation: 4,
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 8,
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
              }}
            >

              <View className="flex-row">

                {/* Product Image */}

                <Image
                  source={{
                    uri:
                      item.product_image ||
                      item.image,
                  }}
                  className="w-28 h-28 rounded-2xl bg-slate-100"
                  resizeMode="cover"
                />

                <View className="flex-1 ml-4 justify-between">

                  {/* Product Name */}

                  <View>

                    <Text
                      numberOfLines={2}
                      className="text-lg font-bold text-slate-900"
                    >

                      {item.product_name || item.name}

                    </Text>

                    <Text className="text-slate-500 mt-1">

                      {item.variant_size}

                    </Text>

                    <View className="flex-row items-center mt-3">

                      <Text className="text-green-700 text-xl font-bold">

                        ₹{item.price}

                      </Text>

                      <Text className="ml-3 text-slate-400 line-through">

                        ₹{item.mrp}

                      </Text>

                    </View>

                    <Text className="text-xs text-slate-400 mt-2">

                      Stock :

                      {item.total_stock}

                    </Text>

                  </View>

                  {/* Bottom */}

                  <View className="flex-row justify-between items-center mt-4">

                    {/* Quantity */}

                    <View className="flex-row items-center bg-green-50 rounded-full px-2 py-1">

                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(
                            item,
                            item.quantity - 1
                          )
                        }
                      >

                        <Minus
                          size={18}
                          color="#15803d"
                        />

                      </TouchableOpacity>

                      <Text className="mx-4 text-lg font-bold">

                        {item.quantity}

                      </Text>

                      <TouchableOpacity
                        disabled={
                          item.quantity >=
                          Number(item.total_stock)
                        }
                        onPress={() =>
                          updateQuantity(
                            item,
                            item.quantity + 1
                          )
                        }
                      >

                        <Plus
                          size={18}
                          color="#15803d"
                        />

                      </TouchableOpacity>

                    </View>

                    {/* Delete */}

                    <TouchableOpacity
                      onPress={() =>
                        removeItem(item.id)
                      }
                      className="bg-red-50 p-3 rounded-full"
                    >

                      <Trash2
                        size={20}
                        color="#ef4444"
                      />

                    </TouchableOpacity>

                  </View>

                </View>

              </View>

            </View>

          )}
        />

        {/* Order Summary */}

        <View
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl px-5 pt-5 pb-8"
          style={{
            elevation: 18,
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 12,
            shadowOffset: {
              width: 0,
              height: -3,
            },
          }}
        >
          <Text className="text-xl font-bold text-slate-900">
            Order Summary
          </Text>

          <View className="mt-5">

            <View className="flex-row justify-between mb-3">
              <Text className="text-slate-500">
                Subtotal
              </Text>

              <Text className="font-semibold">
                ₹{subtotal.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between mb-3">

              <Text className="text-slate-500">
                Delivery
              </Text>

              <Text className="text-green-600 font-bold">
                FREE
              </Text>

            </View>

            <View className="border-t border-slate-200 pt-4 flex-row justify-between">

              <Text className="text-lg font-bold">
                Total
              </Text>

              <Text className="text-xl font-extrabold text-green-700">
                ₹{subtotal.toFixed(2)}
              </Text>

            </View>

          </View>
        </View>
      </View>
    </View>
  );
};