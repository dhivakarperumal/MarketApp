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
  TextInput,
} from "react-native";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

import { ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";

import { useStore } from "../context/StoreContext";

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

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  //-----------------------------------
  // Fetch Cart
  //-----------------------------------

  const { cart, fetchCart, updateCartQuantity, removeFromCart, budgetMode, budgetAmount, updateBudget } = useStore();
  const [localBudgetMode, setLocalBudgetMode] = useState<boolean>(budgetMode);
  const [localBudgetAmount, setLocalBudgetAmount] = useState<number>(budgetAmount || 0);
  const [showBudgetSettings, setShowBudgetSettings] = useState<boolean>(false);
  const fetchCartLocal = async () => {
    setLoading(true);
    try {
      await fetchCart();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  //-----------------------------------
  // Initial Load
  //-----------------------------------

  useEffect(() => {
    fetchCartLocal();
  }, []);

  useEffect(() => {
    setLocalBudgetMode(budgetMode);
    setLocalBudgetAmount(budgetAmount || 0);
  }, [budgetMode, budgetAmount]);

  //-----------------------------------
  // Pull To Refresh
  //-----------------------------------

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCartLocal();
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

  const updateQuantity = async (item: any, newQty: number) => {
    if (newQty < 1) return;
    await updateCartQuantity(item.id, newQty, item);
  };

  const removeItem = async (id: any) => {
    await removeFromCart(id);
  };

  //-----------------------------------
  // Main Screen
  //-----------------------------------

  return (
    <View className="flex-1 bg-slate-100">
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
            paddingBottom: 280,
          }}
          ListHeaderComponent={
            <View className="mb-4">
              <TouchableOpacity
                onPress={() => setShowBudgetSettings(!showBudgetSettings)}
                className="bg-white rounded-2xl p-4 flex-row justify-between items-center shadow-sm"
                style={{
                  elevation: 2,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 5,
                  shadowOffset: { width: 0, height: 2 },
                }}
              >
                <Text className="text-lg font-bold text-slate-900">Budget Settings</Text>
                {showBudgetSettings ? <ChevronUp size={24} color="#16a34a" /> : <ChevronDown size={24} color="#16a34a" />}
              </TouchableOpacity>

              {showBudgetSettings && (
                <View className="mt-2 rounded-[1.75rem] border border-green-100 bg-white p-4">
                  <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => { setLocalBudgetMode(false); updateBudget(false, localBudgetAmount); }} className="flex-row items-center gap-2">
                      <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: '#d1fae5', backgroundColor: !localBudgetMode ? '#0e6827' : '#fff' }} />
                      <Text className="text-sm font-medium text-slate-700">Without Budget</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setLocalBudgetMode(true); updateBudget(true, localBudgetAmount); }} className="flex-row items-center gap-2">
                      <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: '#d1fae5', backgroundColor: localBudgetMode ? '#0e6827' : '#fff' }} />
                      <Text className="text-sm font-medium text-slate-700">With Budget</Text>
                    </TouchableOpacity>
                  </View>

                  {localBudgetMode && (
                    <View className="mt-4 flex-row gap-2 items-center">
                      <View style={{ flex: 1 }}>
                        <View style={{ position: 'relative' }}>
                          <Text style={{ position: 'absolute', left: 12, top: 10, color: '#94a3b8' }}>₹</Text>
                          <TextInput
                            keyboardType="numeric"
                            value={String(localBudgetAmount)}
                            onChangeText={(t) => setLocalBudgetAmount(Number(t))}
                            placeholder="Enter budget"
                            style={{ paddingLeft: 24, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', height: 44 }}
                          />
                        </View>
                      </View>
                      <TouchableOpacity onPress={async () => { await updateBudget(true, localBudgetAmount); }} className="rounded-xl bg-[#0e6827] px-4 py-2">
                        <Text className="text-sm font-semibold text-white">Save</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {localBudgetMode && (
                    <View className="mt-4 rounded-xl p-4 bg-gray-50 border border-gray-100">
                      <View className="flex-row justify-between text-sm mb-2">
                        <Text className="font-medium text-slate-700">Budget Usage</Text>
                        <Text className="font-semibold text-slate-900">₹{subtotal.toFixed(0)} / ₹{localBudgetAmount}</Text>
                      </View>
                      <View className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <View
                          className={`${subtotal > localBudgetAmount ? 'bg-red-500' : subtotal === localBudgetAmount ? 'bg-amber-500' : 'bg-[#0e6827]'}`}
                          style={{ width: `${Math.min((subtotal / (localBudgetAmount || 1)) * 100, 100)}%`, height: '100%' }}
                        />
                      </View>
                      <View className="mt-2 text-xs font-medium">
                        {subtotal > localBudgetAmount ? (
                          <Text className="text-red-500">You have exceeded your budget by ₹{(subtotal - localBudgetAmount).toFixed(2)}. Please remove items.</Text>
                        ) : subtotal === localBudgetAmount ? (
                          <Text className="text-amber-600">You have reached your budget limit.</Text>
                        ) : (
                          <Text className="text-green-600">You can still buy items worth ₹{(localBudgetAmount - subtotal).toFixed(2)}.</Text>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          }
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
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl px-5 pt-5 pb-24"
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

            <View className="mt-3">

              <View className="flex-row justify-between mb-3">
                <Text className="text-slate-500">Subtotal</Text>
                <Text className="font-semibold">₹{subtotal.toFixed(2)}</Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text className="text-slate-500">Delivery</Text>
                <Text className="text-green-600 font-bold">FREE</Text>
              </View>

              <View className="border-t border-slate-200 pt-4 flex-row justify-between">
                <Text className="text-lg font-bold">Total</Text>
                <Text className="text-xl font-extrabold text-green-700">₹{subtotal.toFixed(2)}</Text>
              </View>

              <TouchableOpacity 
                onPress={() => navigation.navigate("Checkout")}
                className="bg-[#0e6827] mt-4 py-4 rounded-xl items-center"
              >
                <Text className="text-white  font-bold text-lg">Proceed to Checkout</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </View>
    </View>
  );
};