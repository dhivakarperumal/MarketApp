import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { Star, ShoppingCart, ArrowLeft, Heart } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';
import Toast from 'react-native-toast-message';

export const ProductDetails = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { addToCart } = useStore();
  const id = route.params?.id || route.params?.productId || null;

  const [product, setProduct] = useState<any>(route.params?.product || null);
  const [loading, setLoading] = useState(!product);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  const resolveImage = (url?: string | null) => {
    if (!url || typeof url !== 'string') return null;
    const t = url.trim();
    if (!t) return null;
    if (t.startsWith('http') || t.startsWith('data:')) return t;
    return t;
  };

  const normalizeImageList = (value: any) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return [];
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [parsed].filter(Boolean);
      } catch {
        return [trimmed];
      }
    }
    return [value];
  };

  const getDisplayImages = (data: any) => {
    const candidates = [
      data?.variants?.[0]?.images,
      data?.thumbnail_image,
      data?.product_images,
      data?.images,
      data?.image,
      data?.image_url,
    ];

    const imgs = Array.from(
      new Set(
        candidates
          .flatMap((c: any) => normalizeImageList(c))
          .map(resolveImage)
          .filter(Boolean),
      ),
    );

    if (imgs.length > 0) return imgs;
    return [`https://ui-avatars.com/api/?name=${encodeURIComponent(data?.name || 'Product')}&background=random`];
  };

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      if (product) return;
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        if (!mounted) return;
        const data = res.data || res.data?.data || null;
        setProduct(data);
        if (data?.variants?.length > 0) {
          setSelectedVariant(data.variants[0]);
          if (data.variants[0].selectedSizes?.[0]) {
            setSelectedSize(data.variants[0].selectedSizes[0]);
          }
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load product');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProduct();
    if (product && product.variants?.length > 0 && !selectedVariant) {
        setSelectedVariant(product.variants[0]);
        if (product.variants[0].selectedSizes?.[0]) {
          setSelectedSize(product.variants[0].selectedSizes[0]);
        }
    }
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (product?.variants && Array.isArray(product.variants) && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600">Product not found</Text>
      </View>
    );
  }

  const images = getDisplayImages(product);
  
  const currentItem = selectedVariant || product;
  const displayPrice = currentItem.offer_price || currentItem.sellingPrice || currentItem.selling_price || currentItem.price;
  const currentMrp = currentItem.mrp;
  const discount = currentMrp && displayPrice
    ? Math.round(((currentMrp - displayPrice) / currentMrp) * 100)
    : 0;
  const stock = Number(currentItem.total_stock ?? currentItem.stock_quantity ?? product.total_stock ?? product.stock_quantity ?? 0);
  const variants = Array.isArray(product.variants) ? product.variants : [];
  
  let comboItems = [];
  try {
    if (Array.isArray(product.combo_items)) comboItems = product.combo_items;
    else if (typeof product.combo_items === 'string') comboItems = JSON.parse(product.combo_items || '[]');
  } catch (e) {
    comboItems = [];
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />

      {/* Premium Header */}
      <View className="bg-green-600 pb-5 pt-5 px-4 rounded-b-[40px] z-20 shadow-sm shadow-green-700/20 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
          >
            <ArrowLeft size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white pr-4">Product Details</Text>
        </View>
        <TouchableOpacity
          onPress={() => setWishlisted(!wishlisted)}
          className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
        >
          <Heart size={20} color={wishlisted ? '#ef4444' : '#ffffff'} fill={wishlisted ? '#ef4444' : 'transparent'} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false} className="pt-2">
        {/* Image Swiper */}
        <View className="h-80 bg-slate-100">
          <Swiper autoplay loop showsPagination dotColor="#e2e8f0" activeDotColor="#16a34a">
            {images.map((img: string, idx: number) => (
              <Image key={idx} source={{ uri: img }} className="w-full h-80" resizeMode="cover" />
            ))}
          </Swiper>
        </View>

        {/* Product Info Card */}
        <View className="bg-white rounded-t-[32px] -mt-6 px-5 pt-6 pb-32 z-10">

          {/* Name & Rating */}
          <View className="flex-row items-start justify-between mb-1">
            <Text className="text-xl font-bold text-slate-900 flex-1 pr-2">{product.name}</Text>
            <View className="flex-row items-center bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
              <Star size={13} color="#f59e0b" fill="#f59e0b" />
              <Text className="text-xs font-bold text-amber-700 ml-1">{product.rating || '0.0'}</Text>
            </View>
          </View>
          <Text className="text-slate-400 text-sm mb-4">({product.review_count || 0} reviews)</Text>

          {/* Price Row */}
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-green-700 mr-3">₹{displayPrice}</Text>
              {currentMrp && (
                <Text className="text-base line-through text-slate-400 mr-2">₹{currentMrp}</Text>
              )}
              {discount > 0 && (
                <View className="bg-green-100 px-2 py-0.5 rounded-md">
                  <Text className="text-green-700 text-xs font-bold">{discount}% OFF</Text>
                </View>
              )}
            </View>
            
            <View className={`px-3 py-1 rounded-full ${stock > 0 ? (stock < 10 ? 'bg-orange-100' : 'bg-green-100') : 'bg-red-100'}`}>
               <Text className={`text-xs font-bold ${stock > 0 ? (stock < 10 ? 'text-orange-700' : 'text-green-700') : 'text-red-700'}`}>
                 {stock > 0 ? `${stock} in stock` : 'Out of Stock'}
               </Text>
            </View>
          </View>

          {/* Variants Selector */}
          {variants.length > 0 && (
            <View className="mb-5">
              <Text className="text-sm font-bold text-slate-700 mb-2">Select Weight / Size</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {variants.map((v: any, idx: number) => {
                  const isSelected = selectedVariant === v;
                  const weightLabel = `${v.quantity || v.weight_volume || ''} ${v.unit || ''}`.trim();
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setSelectedVariant(v)}
                      className={`mr-3 px-5 py-2 rounded-xl border ${isSelected ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-white'}`}
                    >
                      <Text className={`font-semibold ${isSelected ? 'text-green-700' : 'text-slate-600'}`}>
                        {weightLabel || 'Standard'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Combo Items */}
          {comboItems.length > 0 && (
            <View className="mb-5">
              <Text className="text-sm font-bold text-slate-700 mb-3">Combo Includes</Text>
              <View className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                {comboItems.map((item: any, idx: number) => {
                  const itemName = typeof item === 'string' ? item : (item.name || item.product_name || item.item_name || 'Item');
                  const itemQty = typeof item === 'object' && item.quantity ? ` x${item.quantity}` : '';
                  return (
                    <View key={idx} className={`flex-row items-center ${idx !== comboItems.length - 1 ? 'mb-2.5' : ''}`}>
                      <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3" />
                      <Text className="text-slate-600 flex-1 text-sm font-medium">{itemName}{itemQty}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          <View className="h-px bg-slate-100 mb-5" />

          {/* Description */}
          <Text className="text-sm font-bold text-slate-700 mb-2">Description</Text>
          <Text className="text-sm text-slate-500 leading-relaxed mb-5">
            {product.description || 'No description available.'}
          </Text>

          {/* Quantity */}
          <View className="flex-row items-center mb-4">
            <Text className="text-sm font-bold text-slate-700 flex-1">Quantity</Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 items-center justify-center"
                disabled={stock === 0}
              >
                <Text className={`text-xl font-bold ${stock === 0 ? 'text-slate-300' : 'text-slate-600'}`}>−</Text>
              </TouchableOpacity>
              <View className="w-10 h-10 items-center justify-center border-l border-r border-slate-200">
                <Text className={`font-bold ${stock === 0 ? 'text-slate-400' : 'text-slate-800'}`}>{stock === 0 ? 0 : quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.min(stock, q + 1))}
                className="w-10 h-10 items-center justify-center"
                disabled={stock === 0 || quantity >= stock}
              >
                <Text className={`text-xl font-bold ${stock === 0 || quantity >= stock ? 'text-slate-300' : 'text-green-600'}`}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Sticky Bottom Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-5 py-4 flex-row gap-3">
        <TouchableOpacity
          onPress={async () => {
            const itemToAdd = {
              ...product,
              ...currentItem,
              id: product.id || product.product_id,
              variant_size: currentItem !== product ? `${currentItem.quantity || currentItem.weight_volume || ''} ${currentItem.unit || ''}`.trim() : null
            };
            await addToCart(itemToAdd, quantity);
            Toast.show({ type: 'success', text1: 'Added to Cart', text2: `${product.name} x${quantity}` });
          }}
          disabled={stock === 0}
          className={`flex-1 flex-row items-center justify-center border py-3.5 rounded-2xl ${stock === 0 ? 'bg-slate-100 border-slate-200' : 'bg-green-50 border-green-500'}`}
        >
          <ShoppingCart size={18} color={stock === 0 ? "#94a3b8" : "#16a34a"} />
          <Text className={`font-bold ml-2 ${stock === 0 ? 'text-slate-400' : 'text-green-700'}`}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Checkout', {
              product: product,
              variant: selectedVariant,
              quantity: quantity
            });
          }}
          disabled={stock === 0}
          className={`flex-1 py-3.5 rounded-2xl items-center justify-center ${stock === 0 ? 'bg-slate-200' : 'bg-green-600'}`}
        >
          <Text className={`font-bold text-base ${stock === 0 ? 'text-slate-400' : 'text-white'}`}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetails;

