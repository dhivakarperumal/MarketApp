import React, { useState, useEffect, useContext } from "react";
import { 
  View, Text, ScrollView, TextInput, TouchableOpacity, 
  ActivityIndicator, Alert, PermissionsAndroid, Platform, Image
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { StoreContext } from "../context/StoreContext";
import api from "../services/api";
import Toast from "react-native-toast-message";
import Geolocation from "react-native-geolocation-service";
import RazorpayCheckout from "react-native-razorpay";
import { MapPin, Package, CreditCard, Shield, CheckCircle } from "lucide-react-native";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
];

const CheckoutScreen = () => {
  const { cart, fetchCart, clearCart } = useContext(StoreContext) || { cart: [], fetchCart: () => {}, clearCart: () => {} };
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const buyNowProduct = route.params?.product;
  const buyNowVariant = route.params?.variant;
  const buyNowSize = route.params?.size;
  const buyNowQuantity = route.params?.quantity || 1;

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [distanceInfo, setDistanceInfo] = useState({ loading: false, error: "", distanceKm: null as number | null });
  const [deliveryCharges, setDeliveryCharges] = useState<any>(null);
  const [taxSettings, setTaxSettings] = useState<any>(null);
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [storeSettings, setStoreSettings] = useState<any>(null);

  const [locationData, setLocationData] = useState({
    address: "", latitude: "", longitude: "",
  });

  const [form, setForm] = useState({
    user_id: user?.user_id || "", customer_name: "", customer_email: "",
    customer_phone: "", street_address: "", city: "", district: "",
    state: "", country: "India", zip_code: "", payment_method: "Online Payment",
  });

  const fetchAddresses = async () => {
    try {
      const res = await api.get(`/addresses/user/${user.user_id}`);
      const userAddresses = res.data || [];
      setAddresses(userAddresses);

      const defaultAddr = userAddresses.find((a: any) => a.is_default) || userAddresses[0];
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id);
        setForm((prev) => ({
          ...prev,
          customer_name: defaultAddr.customer_name || "",
          customer_email: defaultAddr.customer_email || "",
          customer_phone: defaultAddr.customer_phone || "",
          street_address: defaultAddr.street_address || "",
          city: defaultAddr.city || "",
          district: defaultAddr.district || "",
          state: defaultAddr.state || "",
          country: defaultAddr.country || "India",
          zip_code: defaultAddr.zip_code || "",
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.user_id) fetchAddresses();
  }, [user]);

  const fetchDeliveryCharges = async () => {
    try {
      const res = await api.get("/delivery-charges");
      let chargesData = null;
      if (res.data?.data) {
        chargesData = res.data.data;
      } else if (res.data && !res.data.success) {
        if (Array.isArray(res.data)) {
          chargesData = res.data.length > 0 ? res.data[0] : null;
        } else if (typeof res.data === 'object') {
          chargesData = res.data;
        }
      }
      if (chargesData && chargesData.id) {
        setDeliveryCharges(chargesData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const response = await api.get("/settings/payment");
      if (response.data?.success && response.data?.data) {
        const dbData = response.data.data;
        const mappedSettings = {
          cashSupport: dbData.cash_support !== 0 && dbData.cash_support !== "0",
          onlinePaymentSupport: dbData.online_payment_support !== 0 && dbData.online_payment_support !== "0",
          razorpayEnabled: dbData.razorpay_enabled !== 0 && dbData.razorpay_enabled !== "0",
          razorpayKey: dbData.razorpay_key || "",
        };
        setPaymentSettings(mappedSettings);
        const availableMethods = [];
        if (mappedSettings.cashSupport) availableMethods.push("cash");
        if (mappedSettings.onlinePaymentSupport) availableMethods.push("online");
        if (availableMethods.length === 1) {
          setPaymentMethod(availableMethods[0]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTaxSettings = async () => {
    try {
      const response = await api.get("/settings/store");
      if (response.data?.success && response.data?.data) {
        setStoreSettings(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDeliveryCharges();
    fetchPaymentSettings();
    fetchTaxSettings();
  }, []);

  const checkoutItems = buyNowProduct
    ? [
      {
        id: buyNowProduct.id,
        name: buyNowProduct.name,
        image: buyNowVariant?.images?.[0] || buyNowProduct?.thumbnail_image,
        price: buyNowProduct.offer_price || buyNowProduct.price,
        quantity: buyNowQuantity,
        size: buyNowSize,
        colorName: buyNowVariant?.color,
      },
    ]
    : cart;

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await api.get("/coupons");
      const coupons = res.data?.coupons || [];
      const coupon = coupons.find(
        (c: any) => c.code.toLowerCase() === couponCode.toLowerCase() && c.status === "active"
      );
      if (!coupon) {
        setCouponError("Invalid or inactive coupon code");
        setAppliedCoupon(null);
        return;
      }
      setAppliedCoupon(coupon);
      Toast.show({ type: "success", text1: "Coupon applied successfully!" });
    } catch (error) {
      setCouponError("Error validating coupon");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    Toast.show({ type: "success", text1: "Coupon removed" });
  };

  const calculateDeliveryCharge = (distanceKm: number | null, orderSubtotal: number) => {
    if (!deliveryCharges) return { charge: 0, message: "Delivery charges not available" };
    if (deliveryCharges.is_enabled === 0 || deliveryCharges.is_enabled === false) {
      return { charge: 0, message: "Delivery charges are currently waived/disabled" };
    }
    if (distanceKm === null || distanceKm === undefined) return { charge: 0, message: "" };

    const baseCharge = parseFloat(deliveryCharges.base_delivery_charge) || 0;
    const perKmCharge = parseFloat(deliveryCharges.per_km_delivery_charge) || 0;
    const maxDistance = parseFloat(deliveryCharges.maximum_delivery_distance) || 100;
    const freeDeliveryThreshold = parseFloat(deliveryCharges.free_delivery_minimum_order_amount) || 0;
    const freeDeliveryKm = parseFloat(deliveryCharges.free_delivery_km) || 0;

    if (distanceKm > maxDistance) {
      return { charge: 0, message: `Delivery not available beyond ${maxDistance} km.`, isError: true };
    }
    if (orderSubtotal >= freeDeliveryThreshold) {
      return { charge: 0, message: `Free delivery on orders ₹${freeDeliveryThreshold} and above` };
    }
    if (freeDeliveryKm > 0 && distanceKm <= freeDeliveryKm) {
      return { charge: 0, message: `Free delivery within ${freeDeliveryKm} km` };
    }
    const calculatedCharge = baseCharge + distanceKm * perKmCharge;
    return {
      charge: Math.round(calculatedCharge * 100) / 100,
      message: `Base ₹${baseCharge} + ${distanceKm}km × ₹${perKmCharge}/km`,
    };
  };

  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  };

  const detectDistanceToShop = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setDistanceInfo({ loading: false, error: 'Location permission denied', distanceKm: null });
      return;
    }
    setDistanceInfo((prev) => ({ ...prev, loading: true, error: "" }));

    Geolocation.getCurrentPosition(
      async (position) => {
        try {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          if (!storeSettings || !storeSettings.latitude || !storeSettings.longitude) {
            setDistanceInfo({ loading: false, error: 'Store location is not configured by admin.', distanceKm: null });
            return;
          }
          const shopLat = parseFloat(storeSettings.latitude);
          const shopLng = parseFloat(storeSettings.longitude);
          const distance = calculateDistanceKm(userLat, userLng, shopLat, shopLng);

          try {
            const reverseResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${userLat}&lon=${userLng}&addressdetails=1`);
            if (reverseResponse.ok) {
              const reverseData = await reverseResponse.json();
              const address = reverseData?.address || {};
              const fullAddress = reverseData.display_name;
              setLocationData({ address: fullAddress, latitude: String(userLat), longitude: String(userLng) });
              setForm((prev) => ({
                ...prev,
                street_address: [address.house_number, address.road, address.suburb].filter(Boolean).join(" ") || prev.street_address,
                city: address.city || address.town || prev.city,
                state: address.state || prev.state,
                zip_code: address.postcode || prev.zip_code,
              }));
            }
          } catch (err) {}

          setDistanceInfo({ loading: false, error: '', distanceKm: Number(distance.toFixed(1)) });
        } catch (error) {
          setDistanceInfo({ loading: false, error: 'We could not calculate the distance right now.', distanceKm: null });
        }
      },
      (error) => {
        setDistanceInfo({ loading: false, error: error.message, distanceKm: null });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const subtotal = checkoutItems.reduce((total: number, item: any) => total + parseFloat(item.price || 0) * item.quantity, 0);
  const deliveryInfo = calculateDeliveryCharge(distanceInfo.distanceKm, subtotal);
  const shipping = deliveryMethod === "pickup" ? 0 : deliveryInfo.charge;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === "percentage") {
      discountAmount = (subtotal * parseFloat(appliedCoupon.discount_value)) / 100;
    } else {
      discountAmount = parseFloat(appliedCoupon.discount_value);
    }
  }

  let calculatedTax = 0;
  if (taxSettings && taxSettings.enable_gst === 1) {
    const gstPercent = parseFloat((taxSettings.default_gst_percentage || "0%").replace("%", "")) || 0;
    if (taxSettings.tax_mode === 'Tax Inclusive') {
      calculatedTax = ((subtotal - discountAmount) * gstPercent) / (100 + gstPercent);
    } else {
      calculatedTax = ((subtotal - discountAmount) * gstPercent) / 100;
    }
  }

  let total = 0;
  if (taxSettings?.enable_gst === 1 && taxSettings?.tax_mode === 'Tax Inclusive') {
    total = Math.round((subtotal - discountAmount + shipping) * 100) / 100;
  } else {
    total = Math.round((subtotal - discountAmount + calculatedTax + shipping) * 100) / 100;
  }

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const saveOrder = async (paymentId: any = null) => {
    try {
      const orderItems = checkoutItems.map((item: any) => ({
        product_id: item.product_id || item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        user_id: user?.user_id,
      }));

      const orderData = {
        ...form,
        payment_status: paymentMethod === "online" ? "paid" : "pending",
        payment_method: paymentMethod === "online" ? "Online Payment" : "Cash",
        payment_id: paymentId,
        items: orderItems,
        total_amount: total,
        delivery_charge: shipping,
        delivery_method: deliveryMethod,
        distance_km: deliveryMethod === "pickup" ? 0 : distanceInfo.distanceKm,
        coupon_code: appliedCoupon?.code || null,
        coupon_discount: discountAmount || 0,
        subtotal_before_discount: subtotal,
      };

      await api.post("/orders", orderData);
      if (clearCart && typeof clearCart === 'function') {
        await clearCart();
      }
      Toast.show({ type: "success", text1: "Order Placed Successfully!" });
      navigation.navigate("Main", { screen: "Home" });
    } catch (error) {
      Alert.alert("Order failed", "An error occurred while placing the order.");
    }
  };

  const handleOrder = async () => {
    if (!form.customer_name.trim()) return Toast.show({ type: "error", text1: "Please enter your name" });
    if (!form.customer_phone.trim()) return Toast.show({ type: "error", text1: "Please enter phone number" });
    if (deliveryMethod === "delivery") {
      if (!form.street_address.trim()) return Toast.show({ type: "error", text1: "Please enter street address" });
      if (!form.city.trim()) return Toast.show({ type: "error", text1: "Please enter city" });
      if (deliveryInfo.isError) return Toast.show({ type: "error", text1: deliveryInfo.message });
    }
    if (!checkoutItems.length) return Alert.alert("No product to checkout");

    if (paymentMethod === "cash") {
      await saveOrder();
      return;
    }

    if (!paymentSettings?.razorpayEnabled || !paymentSettings?.razorpayKey?.trim()) {
      return Toast.show({ type: "error", text1: "Razorpay is not configured." });
    }

    var options = {
      description: 'Order Payment',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: paymentSettings.razorpayKey,
      amount: total * 100,
      name: 'SuperMarketApp',
      prefill: {
        email: form.customer_email,
        contact: form.customer_phone,
        name: form.customer_name
      },
      theme: { color: '#0e6827' }
    };
    
    RazorpayCheckout.open(options).then((data: any) => {
      saveOrder(data.razorpay_payment_id);
    }).catch((error: any) => {
      Alert.alert(`Error: ${error.code} | ${error.description}`);
    });
  };

  return (
    <ScrollView className="flex-1 bg-[#f7f8f3]">
      <View className="p-4 space-y-4">
        
        {/* Order Type */}
        <View className="bg-white p-4 rounded-2xl shadow-sm border border-green-100">
          <View className="flex-row items-center mb-3">
            <Package color="#0e6827" size={20} />
            <Text className="text-lg font-semibold text-slate-800 ml-2">Order Type</Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity 
              onPress={() => setDeliveryMethod("delivery")}
              className={`flex-1 p-3 rounded-xl border ${deliveryMethod === "delivery" ? "border-green-600 bg-green-50" : "border-gray-200"}`}
            >
              <Text className={`text-center font-semibold ${deliveryMethod === "delivery" ? "text-green-700" : "text-slate-500"}`}>Home Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setDeliveryMethod("pickup")}
              className={`flex-1 p-3 rounded-xl border ${deliveryMethod === "pickup" ? "border-green-600 bg-green-50" : "border-gray-200"}`}
            >
              <Text className={`text-center font-semibold ${deliveryMethod === "pickup" ? "text-green-700" : "text-slate-500"}`}>Store Pickup</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Details */}
        {deliveryMethod === "delivery" && (
          <View className="bg-white p-4 rounded-2xl shadow-sm border border-green-100 mt-4">
            <View className="flex-row items-center mb-3">
              <MapPin color="#0e6827" size={20} />
              <Text className="text-lg font-semibold text-slate-800 ml-2">Delivery Distance</Text>
            </View>
            <View className="bg-green-50 p-3 rounded-xl border border-green-100">
              <Text className="text-sm text-slate-600 mb-2">Estimate distance from shop to your location:</Text>
              
              {distanceInfo.distanceKm !== null && (
                <View className="mb-3">
                  <Text className="text-xl font-bold text-green-700">{distanceInfo.distanceKm} km</Text>
                  {deliveryInfo.message ? <Text className={`text-xs ${deliveryInfo.isError ? "text-red-500" : "text-green-600"}`}>{deliveryInfo.message}</Text> : null}
                </View>
              )}
              {distanceInfo.error ? <Text className="text-red-500 text-xs mb-2">{distanceInfo.error}</Text> : null}
              
              <TouchableOpacity onPress={detectDistanceToShop} disabled={distanceInfo.loading} className="bg-white border border-green-200 py-2 px-4 rounded-full self-start">
                <Text className="text-green-700 font-semibold">{distanceInfo.loading ? "Fetching..." : "Fetch location"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Customer Form */}
        <View className="bg-white p-4 rounded-2xl shadow-sm border border-green-100 mt-4">
          <Text className="text-lg font-semibold text-slate-800 mb-3">Customer Details</Text>
          <TextInput placeholder="Full Name" value={form.customer_name} onChangeText={(t) => handleChange("customer_name", t)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm text-black" />
          <TextInput placeholder="Email" value={form.customer_email} onChangeText={(t) => handleChange("customer_email", t)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm text-black" />
          <TextInput placeholder="Phone Number" value={form.customer_phone} onChangeText={(t) => handleChange("customer_phone", t)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black" keyboardType="phone-pad" />
        </View>

        {deliveryMethod === "delivery" && (
          <View className="bg-white p-4 rounded-2xl shadow-sm border border-green-100 mt-4">
            <Text className="text-lg font-semibold text-slate-800 mb-3">Shipping Address</Text>
            <TextInput placeholder="Street Address" value={form.street_address} onChangeText={(t) => handleChange("street_address", t)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm text-black" multiline />
            <View className="flex-row gap-3 mb-3">
              <TextInput placeholder="City" value={form.city} onChangeText={(t) => handleChange("city", t)} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black" />
              <TextInput placeholder="Zip Code" value={form.zip_code} onChangeText={(t) => handleChange("zip_code", t)} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black" />
            </View>
            <TextInput placeholder="State" value={form.state} onChangeText={(t) => handleChange("state", t)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black" />
          </View>
        )}

        {/* Order Summary */}
        <View className="bg-white p-4 rounded-2xl shadow-sm border border-green-100 mt-4 mb-8">
          <Text className="text-lg font-semibold text-slate-800 mb-3">Order Summary</Text>
          {checkoutItems.map((item: any, idx: number) => (
            <View key={item.id || idx} className="flex-row items-center mb-3 border-b border-gray-100 pb-2">
              <Text className="flex-1 text-sm text-slate-700">{item.name} (x{item.quantity})</Text>
              <Text className="text-sm font-semibold text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          
          <View className="flex-row justify-between mb-2 mt-2">
            <Text className="text-slate-500">Subtotal</Text>
            <Text className="text-slate-800 font-medium">₹{subtotal.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-500">Delivery</Text>
            <Text className="text-slate-800 font-medium">₹{shipping.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-4 border-t border-gray-100 pt-3">
            <Text className="text-lg font-bold text-slate-800">Total</Text>
            <Text className="text-lg font-bold text-green-700">₹{total.toFixed(2)}</Text>
          </View>

          {/* Payment Method */}
          <Text className="text-sm font-semibold text-slate-700 mb-2">Payment Method</Text>
          <View className="flex-row gap-3 mb-4">
            {paymentSettings?.cashSupport !== false && (
              <TouchableOpacity onPress={() => setPaymentMethod("cash")} className={`flex-1 p-3 rounded-xl border ${paymentMethod === "cash" ? "border-green-600 bg-green-50" : "border-gray-200"}`}>
                <Text className={`text-center font-semibold ${paymentMethod === "cash" ? "text-green-700" : "text-slate-500"}`}>Cash</Text>
              </TouchableOpacity>
            )}
            {paymentSettings?.onlinePaymentSupport !== false && (
              <TouchableOpacity onPress={() => setPaymentMethod("online")} className={`flex-1 p-3 rounded-xl border ${paymentMethod === "online" ? "border-green-600 bg-green-50" : "border-gray-200"}`}>
                <Text className={`text-center font-semibold ${paymentMethod === "online" ? "text-green-700" : "text-slate-500"}`}>Online</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={handleOrder} className="bg-green-700 py-4 rounded-xl mt-2 items-center">
            <Text className="text-white font-bold text-lg">Place Order</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
};

export default CheckoutScreen;
