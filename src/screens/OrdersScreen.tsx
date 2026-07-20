import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Modal, ActivityIndicator, StatusBar } from "react-native";
import { Package, Truck, CheckCircle, Clock, XCircle, ArrowLeft } from "lucide-react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return {
          classes: "bg-emerald-50 border-emerald-200",
          textClass: "text-emerald-600",
          icon: <CheckCircle size={14} color="#059669" />,
        };
      case "shipped":
        return {
          classes: "bg-blue-50 border-blue-200",
          textClass: "text-blue-600",
          icon: <Truck size={14} color="#2563eb" />,
        };
      case "processing":
        return {
          classes: "bg-amber-50 border-amber-200",
          textClass: "text-amber-600",
          icon: <Clock size={14} color="#d97706" />,
        };
      default:
        return {
          classes: "bg-gray-50 border-gray-200",
          textClass: "text-gray-600",
          icon: <Package size={14} color="#4b5563" />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View className={`flex-row items-center px-3 py-1 rounded-full border ${config.classes}`}>
      {config.icon}
      <Text className={`ml-1 text-xs font-bold ${config.textClass}`}>
        {status}
      </Text>
    </View>
  );
};

export const OrdersScreen = () => {
  const { user } = useContext(AuthContext) as any;
  const navigation = useNavigation<any>();

  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trackOrderId, setTrackOrderId] = useState("");

  const handleTrackOrder = () => {
    if (!trackOrderId.trim()) {
      Toast.show({ type: "error", text1: "Please enter an Order ID" });
      return;
    }
    
    const foundOrder = orders.find(
      (o) => o.id?.toString() === trackOrderId.trim() || o.order_id === trackOrderId.trim()
    );

    if (foundOrder) {
      openOrderDetails(foundOrder);
    } else {
      Toast.show({ type: "error", text1: "Order not found or invalid Order ID" });
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get("/orders");
        const allOrders = res.data || [];
        const userOrders = allOrders.filter(
          (order: any) => order.user_id === user?.user_id || order.user_id === user?.id
        );
        userOrders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_id || user?.id) fetchOrders();
  }, [user]);

  const openOrderDetails = async (order: any) => {
    setLoadingOrder(true);
    setShowPopup(true);
    try {
      const orderRes = await api.get(`/orders/${order.id}`);
      setSelectedOrder(orderRes.data);
    } catch (error) {
      console.error("Failed to load order details", error);
      setSelectedOrder(order); // fallback
    } finally {
      setLoadingOrder(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FDFBF7]">
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      {/* Premium Header */}
      <View className="bg-green-600 pb-5 pt-10 px-4 rounded-b-[40px] z-10 shadow-sm shadow-green-700/20">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Main", { screen: "Home" })} 
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
          >
            <ArrowLeft size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">My Orders</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TextInput
            placeholder="Enter Order ID"
            placeholderTextColor="#cbd5e1"
            className="flex-1 px-4 py-3 border border-green-500 rounded-xl bg-white/10 text-white font-medium"
            value={trackOrderId}
            onChangeText={setTrackOrderId}
          />
          <TouchableOpacity
            onPress={handleTrackOrder}
            className="bg-white px-5 py-3 rounded-xl justify-center items-center shadow-sm"
          >
            <Text className="text-green-700 font-bold">Track</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
           <ActivityIndicator size="large" color="#0e6827" />
        </View>
      ) : (
        <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 40 }}>
          {orders.length === 0 ? (
            <Text className="text-gray-500 text-center mt-10">No orders found</Text>
          ) : (
            orders.map((order) => (
              <TouchableOpacity
                key={order.id}
                onPress={() => openOrderDetails(order)}
                className="bg-white rounded-3xl border border-green-100 shadow-sm mb-4 overflow-hidden"
              >
                <View className="h-1.5 w-full" style={{ backgroundColor: '#0e6827' }}></View>

                <View className="p-5">
                  <View className="flex-row justify-between mb-3 border-b border-gray-100 pb-3">
                    <Text className="text-gray-500 text-sm">Order ID</Text>
                    <Text className="font-bold text-gray-800">{order.order_id || order.id}</Text>
                  </View>
                  <View className="flex-row justify-between mb-3 border-b border-gray-100 pb-3">
                    <Text className="text-gray-500 text-sm">Date</Text>
                    <Text className="font-semibold text-gray-800">
                      {new Date(order.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <View className="flex-row justify-between mb-3 border-b border-gray-100 pb-3 items-center">
                    <Text className="text-gray-500 text-sm">Status</Text>
                    <StatusBadge status={order.status} />
                  </View>
                  <View className="flex-row justify-between pt-2">
                    <Text className="font-bold text-gray-800 text-base">Total Amount</Text>
                    <Text className="font-bold text-[#0e6827] text-lg">
                      ₹{order.total_amount}
                    </Text>
                  </View>
                </View>

                <View className="px-5 pb-5">
                  <Text className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Items Preview</Text>
                  {order.items?.slice(0, 2).map((item: any, index: number) => (
                    <View key={index} className="flex-row gap-3 mb-2 items-center">
                       <Image
                          source={{ uri: item.image || "https://via.placeholder.com/150" }}
                          className="w-12 h-12 rounded-lg bg-gray-100"
                       />
                       <View className="flex-1">
                          <Text className="font-semibold text-gray-800 text-sm" numberOfLines={1}>{item.product_name}</Text>
                          <Text className="text-xs text-gray-500">Qty: {item.quantity}</Text>
                       </View>
                    </View>
                  ))}
                  {order.items?.length > 2 && (
                    <Text className="text-xs text-[#0e6827] font-semibold mt-1">+{order.items.length - 2} more items</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {/* POPUP Modal */}
      <Modal visible={showPopup} animationType="slide" transparent={true} onRequestClose={() => setShowPopup(false)}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-[#f7f8f3] rounded-t-3xl h-[90%] overflow-hidden">
            <View className="flex-row justify-between items-center px-6 py-5 bg-[#0e6827]">
              <Text className="text-xl font-bold text-white">Order Details</Text>
              <TouchableOpacity onPress={() => setShowPopup(false)}>
                <XCircle size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-5" contentContainerStyle={{ paddingBottom: 40 }}>
              {loadingOrder ? (
                 <View className="flex-1 justify-center items-center py-20">
                    <ActivityIndicator size="large" color="#0e6827" />
                 </View>
              ) : selectedOrder ? (
                <>
                  <View className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-5">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Order Tracking</Text>
                    <View className="relative ml-2">
                      <View className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200" />
                      <View className="space-y-6">
                        {selectedOrder.status?.toLowerCase() === "cancelled" ? (
                          <View className="flex-row items-center gap-4">
                            <View className="w-10 h-10 rounded-full items-center justify-center bg-red-100 z-10">
                              <XCircle size={18} color="#dc2626" />
                            </View>
                            <View>
                              <Text className="font-bold text-red-600">Cancelled</Text>
                              <Text className="text-xs text-red-500">Order was cancelled</Text>
                            </View>
                          </View>
                        ) : (
                          <>
                            <View className="flex-row items-center gap-4">
                              <View className="w-10 h-10 rounded-full items-center justify-center bg-green-100 z-10">
                                <Package size={18} color="#0e6827" />
                              </View>
                              <View>
                                <Text className="font-bold text-gray-800">Order Placed</Text>
                                <Text className="text-xs text-gray-500">We have received your order</Text>
                              </View>
                            </View>
                            <View className="flex-row items-center gap-4">
                              <View className={`w-10 h-10 rounded-full items-center justify-center z-10 ${["packing", "shipped", "shipping", "out for delivery", "delivered"].includes(selectedOrder.status?.toLowerCase()) ? "bg-green-100" : "bg-gray-100"}`}>
                                <Package size={18} color={["packing", "shipped", "shipping", "out for delivery", "delivered"].includes(selectedOrder.status?.toLowerCase()) ? "#0e6827" : "#9ca3af"} />
                              </View>
                              <View>
                                <Text className={`font-bold ${["packing", "shipped", "shipping", "out for delivery", "delivered"].includes(selectedOrder.status?.toLowerCase()) ? "text-gray-800" : "text-gray-400"}`}>Packing</Text>
                                <Text className="text-xs text-gray-500">Your order is being packed</Text>
                              </View>
                            </View>
                            <View className="flex-row items-center gap-4">
                              <View className={`w-10 h-10 rounded-full items-center justify-center z-10 ${["shipped", "shipping", "out for delivery", "delivered"].includes(selectedOrder.status?.toLowerCase()) ? "bg-green-100" : "bg-gray-100"}`}>
                                <Truck size={18} color={["shipped", "shipping", "out for delivery", "delivered"].includes(selectedOrder.status?.toLowerCase()) ? "#0e6827" : "#9ca3af"} />
                              </View>
                              <View>
                                <Text className={`font-bold ${["shipped", "shipping", "out for delivery", "delivered"].includes(selectedOrder.status?.toLowerCase()) ? "text-gray-800" : "text-gray-400"}`}>Shipping</Text>
                                <Text className="text-xs text-gray-500">Your order is on the way</Text>
                              </View>
                            </View>
                            <View className="flex-row items-center gap-4">
                              <View className={`w-10 h-10 rounded-full items-center justify-center z-10 ${["out for delivery", "delivered"].includes(selectedOrder.status?.toLowerCase()) ? "bg-green-100" : "bg-gray-100"}`}>
                                <Truck size={18} color={["out for delivery", "delivered"].includes(selectedOrder.status?.toLowerCase()) ? "#0e6827" : "#9ca3af"} />
                              </View>
                              <View>
                                <Text className={`font-bold ${["out for delivery", "delivered"].includes(selectedOrder.status?.toLowerCase()) ? "text-gray-800" : "text-gray-400"}`}>Out for Delivery</Text>
                                <Text className="text-xs text-gray-500">Your order is out for delivery</Text>
                              </View>
                            </View>
                            <View className="flex-row items-center gap-4">
                              <View className={`w-10 h-10 rounded-full items-center justify-center z-10 ${selectedOrder.status?.toLowerCase() === "delivered" ? "bg-green-100" : "bg-gray-100"}`}>
                                <CheckCircle size={18} color={selectedOrder.status?.toLowerCase() === "delivered" ? "#0e6827" : "#9ca3af"} />
                              </View>
                              <View>
                                <Text className={`font-bold ${selectedOrder.status?.toLowerCase() === "delivered" ? "text-gray-800" : "text-gray-400"}`}>Delivered</Text>
                                <Text className="text-xs text-gray-500">Order has been delivered</Text>
                              </View>
                            </View>
                          </>
                        )}
                      </View>
                    </View>
                  </View>

                  <View className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-5">
                    <Text className="font-bold text-lg text-gray-800 mb-3">Order Summary</Text>
                    <View className="space-y-3">
                      <View className="flex-row justify-between border-b border-gray-100 pb-2">
                        <Text className="text-gray-500 text-sm">Order ID</Text>
                        <Text className="font-semibold text-gray-800">{selectedOrder.order_id || selectedOrder.id}</Text>
                      </View>
                      <View className="flex-row justify-between border-b border-gray-100 pb-2 items-center">
                        <Text className="text-gray-500 text-sm">Status</Text>
                        <StatusBadge status={selectedOrder.status} />
                      </View>
                      {selectedOrder.tracking_number && (
                        <View className="flex-row justify-between border-b border-gray-100 pb-2">
                          <Text className="text-gray-500 text-sm">Tracking ID</Text>
                          <Text className="font-semibold text-gray-800">{selectedOrder.tracking_number}</Text>
                        </View>
                      )}
                      {selectedOrder.courier_name && (
                        <View className="flex-row justify-between border-b border-gray-100 pb-2">
                          <Text className="text-gray-500 text-sm">Courier</Text>
                          <Text className="font-semibold text-gray-800">{selectedOrder.courier_name}</Text>
                        </View>
                      )}
                      <View className="flex-row justify-between pt-2">
                        <Text className="font-bold text-gray-800">Total Paid</Text>
                        <Text className="font-bold text-[#0e6827]">₹{selectedOrder.total_amount}</Text>
                      </View>
                    </View>
                  </View>

                  <View className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-5">
                    <Text className="font-bold text-lg text-gray-800 mb-3">Shipping Address</Text>
                    {(() => {
                      let addr = selectedOrder.shipping_address;
                      if (typeof addr === 'string') {
                        try { addr = JSON.parse(addr); } catch (e) { }
                      }
                      const cName = addr?.customer_name || selectedOrder.customer_name;
                      const sAddr = addr?.street_address || selectedOrder.street_address;
                      const city = addr?.city || selectedOrder.city;
                      const zip = addr?.zip_code || selectedOrder.zip_code;
                      const phone = addr?.customer_phone || selectedOrder.customer_phone;
                      
                      return (
                        <View>
                          <Text className="font-semibold text-gray-800 mb-1">{cName || 'N/A'}</Text>
                          <Text className="text-gray-600 text-sm">{sAddr}</Text>
                          <Text className="text-gray-600 text-sm">{city} {zip ? `- ${zip}` : ''}</Text>
                          <Text className="text-gray-600 text-sm mt-1 font-medium">Phone: {phone}</Text>
                        </View>
                      )
                    })()}
                  </View>

                  <View className="mb-5">
                    <Text className="font-bold text-lg text-gray-800 mb-3">Products</Text>
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <View key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-3 flex-row gap-4">
                         <Image source={{ uri: item.image || "https://via.placeholder.com/150" }} className="w-20 h-24 rounded-xl bg-gray-50" />
                         <View className="flex-1">
                            <Text className="font-bold text-gray-800 text-base" numberOfLines={2}>{item.product_name || item.name}</Text>
                            <Text className="font-bold text-[#0e6827] mt-1">₹{item.price}</Text>
                            <View className="mt-2 flex-row gap-4">
                              <Text className="text-gray-500 text-xs font-medium">Qty: {item.quantity}</Text>
                              {(item.color || item.variant_color) && (
                                <Text className="text-gray-500 text-xs font-medium">Color: {item.color || item.variant_color}</Text>
                              )}
                              {(item.size || item.variant_size) && (
                                <Text className="text-gray-500 text-xs font-medium">Size: {item.size || item.variant_size}</Text>
                              )}
                            </View>
                            <Text className="text-gray-700 text-sm font-semibold mt-2">Subtotal: ₹{item.price * item.quantity}</Text>
                         </View>
                      </View>
                    ))}
                  </View>
                </>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
};
