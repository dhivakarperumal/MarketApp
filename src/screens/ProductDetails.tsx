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
        setProduct(res.data || res.data?.data || null);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load product');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProduct();
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
          <Star size={16} color="#fbbf24" />
          <Text className="text-sm text-slate-700">{product.rating || '0.0'}</Text>
          <Text className="text-sm text-slate-500">({product.review_count || 0})</Text>
        </View>

        <View className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
          <Text className="text-xl font-bold text-green-700">₹{product.offer_price || product.selling_price || product.price}</Text>
          {product.mrp && <Text className="text-sm line-through text-gray-400">₹{product.mrp}</Text>}
        </View>

        <View className="mt-4">
          <Text className="text-sm text-gray-700">{product.description || 'No description available.'}</Text>
        </View>

        <View className="mt-6 flex-row items-center gap-3">
          <TouchableOpacity onPress={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-2 bg-gray-100 rounded-xl">
            <Text>-</Text>
          </TouchableOpacity>
          <Text className="font-bold">{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity((q) => q + 1)} className="px-4 py-2 bg-gray-100 rounded-xl">
            <Text>+</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 flex-row gap-3">
          <TouchableOpacity onPress={() => Alert.alert('Added', `Added ${product.name} x${quantity} to cart`)} className="flex-1 bg-green-600 py-3 rounded-xl items-center justify-center">
            <Text className="text-white font-bold">Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('Buy', 'Buy now flow')} className="flex-1 bg-yellow-400 py-3 rounded-xl items-center justify-center">
            <Text className="text-black font-bold">Buy Now</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
};

export default ProductDetails;
