import React, { useState, useEffect, useContext } from "react";
import { 
  View, Text, ScrollView, TextInput, TouchableOpacity, 
  ActivityIndicator, Alert, PermissionsAndroid, Platform, Image, StatusBar, Modal, FlatList
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import api from "../services/api";
import Toast from "react-native-toast-message";
import Geolocation from "react-native-geolocation-service";
import RazorpayCheckout from "react-native-razorpay";
import { MapPin, Package, CreditCard, Shield, CheckCircle, User, Mail, Phone, Home, Building2, Map, Navigation, ArrowLeft } from "lucide-react-native";
import { calculateStockConsumptionInBaseUnits } from "../utils/stockUtils";
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
];

const CheckoutScreen = () => {
  const storeContextData = useStore();
  const cart = storeContextData?.cart || [];
  const fetchCart = storeContextData?.fetchCart || (() => {});
  // clearCart is not in the original StoreContext.tsx, let's just make it a noop if it's undefined
  const clearCart = (storeContextData as any)?.clearCart || (() => {});
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

  const insets = useSafeAreaInsets();

  const [form, setForm] = useState({
    user_id: user?.user_id || "", customer_name: "", customer_email: "",
    customer_phone: "", street_address: "", city: "", district: "",
    state: "", country: "India", zip_code: "", payment_method: "Online Payment",
  });

  const [stateModalVisible, setStateModalVisible] = useState(false);

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
        variant_info: buyNowVariant,
        total_stock: buyNowProduct.total_stock,
        stock_quantity: buyNowVariant?.stock_quantity ?? buyNowProduct.stock_quantity,
        product_code: buyNowProduct.product_code,
        type: buyNowProduct.type,
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
            const reverseResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${userLat}&lon=${userLng}&addressdetails=1`,
              {
                headers: {
                  'User-Agent': 'SuperMarketApp/1.0',
                  'Accept': 'application/json'
                }
              }
            );
            if (reverseResponse.ok) {
              const reverseData = await reverseResponse.json();
              const address = reverseData?.address || {};
              const fullAddress = reverseData.display_name;
              
              if (fullAddress) {
                setLocationData({ address: fullAddress, latitude: String(userLat), longitude: String(userLng) });
                
                setForm((prev) => ({
                  ...prev,
                  street_address: fullAddress,
                  city: address.city || address.town || address.county || address.state_district || prev.city,
                  state: address.state || prev.state,
                  zip_code: address.postcode || prev.zip_code,
                }));
              }
            } else {
              console.log("Reverse Geocoding failed: ", reverseResponse.status);
            }
          } catch (err) {
            console.error("Geocoding Error: ", err);
          }

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
        variant_info: item.variant_info || null,
        variant_color: item.colorName || item.variant_color || null,
        variant_size: item.size || item.variant_size || null,
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
      navigation.replace("Orders");
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

    // Validate Stock
    for (const item of checkoutItems) {
      const consumedStock = calculateStockConsumptionInBaseUnits(
        item.variant_info?.weight || item.variant_info?.quantity || item.variant_size || item.size || null,
        item.variant_info?.unit || item.variant_info?.measurementUnit || item.variant_unit || null,
        item.quantity
      );
      
      const finalConsumedStock = consumedStock > 0 ? consumedStock : (parseFloat(item.quantity) || 0);
      
      const productCode = String(item.product_code || '').trim().toUpperCase();
      const isComboProduct = productCode.startsWith('SPMC') || String(item.type || '').trim() === '1';

      if (isComboProduct) {
        if (item.total_stock !== undefined && item.total_stock < finalConsumedStock) {
          return Toast.show({ type: "error", text1: `Insufficient stock for ${item.name}` });
        }
      } else {
        const availableStock = item.total_stock ?? item.variant_info?.stock_quantity ?? item.stock_quantity;
        if (availableStock !== undefined && availableStock < finalConsumedStock) {
          return Toast.show({ type: "error", text1: `Insufficient stock for ${item.name}` });
        }
      }
    }

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
    <View className="flex-1 bg-[#f7f8f3]" style={{ paddingBottom: insets.bottom }}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      
      {/* Premium Header */}
      <View 
        className="bg-green-600 pb-5 px-4 rounded-b-[40px] z-20 shadow-sm shadow-green-700/20 flex-row items-center justify-between"
        style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 20 }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
          >
            <ArrowLeft size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white pr-4">Checkout</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
        <View className="bg-white p-5 rounded-3xl shadow-sm shadow-slate-100 border border-slate-100 mt-4">
          <View className="flex-row items-center mb-4">
            <User color="#0e6827" size={20} />
            <Text className="text-lg font-bold text-slate-800 ml-2">Customer Details</Text>
          </View>
          
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 mb-3">
            <User color="#94a3b8" size={18} />
            <TextInput placeholder="Full Name" placeholderTextColor="#94a3b8" value={form.customer_name} onChangeText={(t) => handleChange("customer_name", t)} className="flex-1 py-3.5 px-3 text-sm text-slate-800 font-medium" />
          </View>
          
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 mb-3">
            <Mail color="#94a3b8" size={18} />
            <TextInput placeholder="Email Address" placeholderTextColor="#94a3b8" value={form.customer_email} onChangeText={(t) => handleChange("customer_email", t)} className="flex-1 py-3.5 px-3 text-sm text-slate-800 font-medium" keyboardType="email-address" autoCapitalize="none" />
          </View>
          
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3">
            <Phone color="#94a3b8" size={18} />
            <TextInput placeholder="Phone Number" placeholderTextColor="#94a3b8" value={form.customer_phone} onChangeText={(t) => handleChange("customer_phone", t)} className="flex-1 py-3.5 px-3 text-sm text-slate-800 font-medium" keyboardType="phone-pad" />
          </View>
        </View>

        {deliveryMethod === "delivery" && (
          <View className="bg-white p-5 rounded-3xl shadow-sm shadow-slate-100 border border-slate-100 mt-4">
            <View className="flex-row items-center mb-4">
              <Home color="#0e6827" size={20} />
              <Text className="text-lg font-bold text-slate-800 ml-2">Shipping Address</Text>
            </View>

            {/* Saved Address Selector */}
            {addresses.length > 0 && (
              <View className="mb-4">
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Saved Addresses</Text>
                {addresses.map((addr: any) => (
                  <TouchableOpacity
                    key={addr.id}
                    onPress={() => {
                      setSelectedAddress(addr.id);
                      setForm((prev: any) => ({
                        ...prev,
                        customer_name: addr.customer_name || "",
                        customer_email: addr.customer_email || "",
                        customer_phone: addr.customer_phone || "",
                        street_address: addr.street_address || "",
                        city: addr.city || "",
                        district: addr.district || "",
                        state: addr.state || "",
                        country: addr.country || "India",
                        zip_code: addr.zip_code || "",
                      }));
                    }}
                    className={`flex-row items-center p-3 mb-2 rounded-xl border ${selectedAddress === addr.id ? "border-green-600 bg-green-50" : "border-slate-200 bg-slate-50"}`}
                  >
                    <View className={`w-9 h-9 rounded-full items-center justify-center mr-3 ${selectedAddress === addr.id ? "bg-green-100" : "bg-slate-100"}`}>
                      <MapPin size={18} color={selectedAddress === addr.id ? "#16a34a" : "#94a3b8"} />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text className={`font-bold text-sm ${selectedAddress === addr.id ? "text-green-700" : "text-slate-700"}`}>{addr.address_type || "Home"}</Text>
                        {addr.is_default ? <View className="ml-2 bg-green-100 px-1.5 py-0.5 rounded"><Text className="text-[9px] font-bold text-green-700">DEFAULT</Text></View> : null}
                      </View>
                      <Text className="text-xs text-slate-500 mt-0.5" numberOfLines={1}>{addr.street_address}, {addr.city}</Text>
                    </View>
                    <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${selectedAddress === addr.id ? "border-green-600" : "border-slate-300"}`}>
                      {selectedAddress === addr.id && <View className="w-2.5 h-2.5 rounded-full bg-green-600" />}
                    </View>
                  </TouchableOpacity>
                ))}
                <View className="h-px bg-slate-100 my-3" />
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Or Enter Manually</Text>
              </View>
            )}

            <View className="flex-row items-start bg-slate-50 border border-slate-200 rounded-xl px-3 mb-3">
              <MapPin color="#94a3b8" size={18} className="mt-4" />
              <TextInput placeholder="Street Address (House No, Building, Street)" placeholderTextColor="#94a3b8" value={form.street_address} onChangeText={(t) => handleChange("street_address", t)} className="flex-1 py-3.5 px-3 text-sm text-slate-800 font-medium" multiline />
            </View>
            
            <View className="flex-row gap-3 mb-3">
              <View className="flex-1 flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3">
                <Building2 color="#94a3b8" size={18} />
                <TextInput placeholder="City" placeholderTextColor="#94a3b8" value={form.city} onChangeText={(t) => handleChange("city", t)} className="flex-1 py-3.5 px-2 text-sm text-slate-800 font-medium" />
              </View>
              <View className="flex-1 flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3">
                <Navigation color="#94a3b8" size={18} />
                <TextInput placeholder="Zip Code" placeholderTextColor="#94a3b8" value={form.zip_code} onChangeText={(t) => handleChange("zip_code", t)} className="flex-1 py-3.5 px-2 text-sm text-slate-800 font-medium" keyboardType="number-pad" />
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => setStateModalVisible(true)}
              className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-3.5 mb-3"
            >
              <Map color="#94a3b8" size={18} />
              <Text className={`flex-1 px-3 text-sm font-medium ${form.state ? 'text-slate-800' : 'text-[#94a3b8]'}`}>
                {form.state || "Select State"}
              </Text>
            </TouchableOpacity>

            <Modal
              visible={stateModalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setStateModalVisible(false)}
            >
              <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl h-2/3 p-4">
                  <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 pb-3">
                    <Text className="text-lg font-bold text-slate-800">Select State</Text>
                    <TouchableOpacity onPress={() => setStateModalVisible(false)} className="p-2">
                      <Text className="text-green-700 font-bold">Close</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={indianStates}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className="py-4 border-b border-gray-50"
                        onPress={() => {
                          handleChange("state", item);
                          setStateModalVisible(false);
                        }}
                      >
                        <Text className={`text-base ${form.state === item ? 'text-green-700 font-bold' : 'text-slate-700'}`}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>
            </Modal>
          </View>
        )}

        {/* Coupon Code */}
        <View className="bg-white p-4 rounded-2xl shadow-sm border border-green-100 mt-4">
          <Text className="text-lg font-semibold text-slate-800 mb-3">Coupon Code</Text>
          {appliedCoupon ? (
            <View className="bg-green-50 p-3 rounded-xl border border-green-100 flex-row items-center justify-between">
              <View>
                <Text className="text-green-800 font-bold">{appliedCoupon.code}</Text>
                <Text className="text-green-600 text-xs mt-1">Coupon applied successfully</Text>
              </View>
              <TouchableOpacity onPress={removeCoupon}>
                <Text className="text-red-500 font-semibold text-sm">Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View className="flex-row gap-2">
                <TextInput 
                  placeholder="Enter coupon code" 
                  value={couponCode} 
                  onChangeText={setCouponCode} 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black uppercase" 
                  autoCapitalize="characters"
                />
                <TouchableOpacity 
                  onPress={applyCoupon} 
                  disabled={couponLoading}
                  className={`px-5 py-3 rounded-xl justify-center ${couponLoading ? 'bg-gray-400' : 'bg-[#0e6827]'}`}
                >
                  {couponLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text className="text-white font-semibold">Apply</Text>
                  )}
                </TouchableOpacity>
              </View>
              {couponError ? <Text className="text-red-500 text-xs mt-2">{couponError}</Text> : null}
            </View>
          )}
        </View>

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
          {discountAmount > 0 && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-green-600">Discount ({appliedCoupon?.code})</Text>
              <Text className="text-green-600 font-medium">-₹{discountAmount.toFixed(2)}</Text>
            </View>
          )}
          {calculatedTax > 0 && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-500">
                Tax {taxSettings?.tax_mode === 'Tax Inclusive' ? '(Inclusive)' : ''}
              </Text>
              <Text className="text-slate-800 font-medium">₹{calculatedTax.toFixed(2)}</Text>
            </View>
          )}
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-500">Delivery</Text>
            <Text className="text-slate-800 font-medium">
              {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
            </Text>
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
    </View>
  );
};

export default CheckoutScreen;
