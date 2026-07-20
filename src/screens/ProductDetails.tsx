import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { Star, ShoppingCart } from 'lucide-react-native';

export const ProductDetails = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const id = route.params?.id || route.params?.productId || null;

  const [product, setProduct] = useState<any>(route.params?.product || null);
  const [loading, setLoading] = useState(!product);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);

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
  const displayImage = selectedImage || images[0];

  const currentPrice = selectedVariant?.sellingPrice || selectedVariant?.selling_price || product.offer_price || product.selling_price || product.price;
  const currentMrp = selectedVariant?.mrp || product.mrp;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <View className="h-80 rounded-xl overflow-hidden">
          <Swiper autoplay loop showsPagination dotColor="#e5e7eb" activeDotColor="#16a34a">
            {images.map((img, idx) => (
              <Image key={idx} source={{ uri: img }} className="w-full h-80" resizeMode="cover" />
            ))}
          </Swiper>
        </View>

        <Text className="text-2xl font-bold text-slate-900 mt-4">{product.name}</Text>

        <View className="flex-row items-center gap-2 mt-2">
          <Star size={16} color="#fbbf24" fill="#fbbf24" />
          <Text className="text-sm text-slate-700">{parseFloat(String(product.rating || '0.0')).toFixed(1)}</Text>
          <Text className="text-sm text-slate-500">({product.review_count || 0})</Text>
        </View>

        <View className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100 flex-row items-end gap-3">
          <Text className="text-2xl font-bold text-green-700">₹{currentPrice}</Text>
          {currentMrp && <Text className="text-base line-through text-gray-400 mb-1">₹{currentMrp}</Text>}
        </View>

        {product.variants?.length > 0 && (
          <View className="mt-6">
            <Text className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">Available Variants</Text>
            <View className="flex-row flex-wrap gap-3">
              {product.variants.map((variant: any, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setSelectedVariant(variant);
                    if (variant.images?.[0]) setSelectedImage(resolveImage(variant.images[0]));
                    if (variant.selectedSizes?.[0]) setSelectedSize(variant.selectedSizes[0]);
                    setQuantity(1);
                  }}
                  className={`rounded-full border px-5 py-2 transition ${selectedVariant?.quantity === variant.quantity && selectedVariant?.unit === variant.unit ? "border-green-600 bg-green-600" : "border-gray-200 bg-white"}`}
                >
                  <Text className={`font-semibold ${selectedVariant?.quantity === variant.quantity && selectedVariant?.unit === variant.unit ? "text-white" : "text-gray-700"}`}>
                    {variant.quantity} {variant.unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {selectedVariant?.selectedSizes?.length > 0 && !(selectedVariant.selectedSizes.length === 1 && selectedVariant.selectedSizes[0].toLowerCase() === "free size") && (
          <View className="mt-6">
            <Text className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">Select Size</Text>
            <View className="flex-row flex-wrap gap-3">
              {selectedVariant.selectedSizes.map((size: string, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedSize(size)}
                  className={`rounded-full border px-5 py-2 transition ${selectedSize === size ? "border-green-600 bg-green-600" : "border-gray-200 bg-white"}`}
                >
                  <Text className={`font-semibold ${selectedSize === size ? "text-white" : "text-gray-700"}`}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View className="mt-6">
          <Text className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2">Description</Text>
          <Text className="text-base text-gray-700 leading-6">{product.description || 'No description available.'}</Text>
        </View>

        <View className="mt-6">
           <Text className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">Quantity</Text>
           <View className="flex-row items-center gap-3 w-32 bg-gray-100 rounded-xl justify-between px-2 py-1">
            <TouchableOpacity onPress={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3">
              <Text className="text-lg font-bold text-gray-700">-</Text>
            </TouchableOpacity>
            <Text className="font-bold text-lg text-gray-800">{quantity}</Text>
            <TouchableOpacity onPress={() => setQuantity((q) => q + 1)} className="p-3">
              <Text className="text-lg font-bold text-gray-700">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-8 flex-row gap-4 pb-8">
          <TouchableOpacity onPress={() => Alert.alert('Added', `Added ${product.name} to cart`)} className="flex-1 bg-green-600 py-4 rounded-xl items-center justify-center shadow-md">
            <Text className="text-white font-bold text-lg">Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Checkout', { product, variant: selectedVariant, size: selectedSize, quantity })} className="flex-1 bg-yellow-400 py-4 rounded-xl items-center justify-center shadow-md">
            <Text className="text-black font-bold text-lg">Buy Now</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
};

export default ProductDetails;
