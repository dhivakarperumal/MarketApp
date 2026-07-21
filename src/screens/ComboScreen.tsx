import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { Star, ShoppingCart, Heart, Tag, Eye } from 'lucide-react-native';
import api from '../services/api';

interface ComboItem {
  id?: number;
  product_name?: string;
  name?: string;
  quantity?: number;
}

interface Combo {
  id: number;
  name: string;
  selling_price: string;
  mrp: string;
  offer_price?: string;
  offer: string;
  thumbnail_image: string;
  rating: string;
  review_count: number;
  status: string;
  featured_product: boolean;
  best_seller: boolean;
  todays_deal: boolean;
  delivery_time: string;
  stock_quantity: string;
  product_code: string;
  description?: string;
  combo_items?: ComboItem[];
  type: number;
}

const resolveImage = (url: string | null | undefined): string | null => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http') || trimmed.startsWith('data:')) return trimmed;
  return trimmed;
};

const getImage = (combo: Combo): string => {
  const candidates = [
    combo.thumbnail_image,
  ];
  
  for (const candidate of candidates) {
    const resolved = resolveImage(candidate);
    if (resolved) return resolved;
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    combo.name || 'Combo'
  )}&background=d1fae5&color=065f46&size=400`;
};

const isCombo = (p: Combo): boolean => {
  return String(p.type) === '1';
};

export const ComboScreen = () => {
  const [allCombos, setAllCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/products');
      
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.products)
          ? response.data.products
          : [];
      
      const combos = data.filter(isCombo);
      setAllCombos(combos);
    } catch (err: any) {
      console.error('Fetch Combos Error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load combos';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCombos();
  };

  const renderComboCard = ({ item }: { item: Combo }) => {
    const price = parseFloat(item.offer_price || item.selling_price || '0');
    const mrp = parseFloat(item.mrp || '0');
    const discountPct =
      mrp > 0 && price > 0 && mrp > price
        ? Math.round((1 - price / mrp) * 100)
        : 0;
    const savings = mrp > price ? (mrp - price).toFixed(2) : '0';
    const imgSrc = getImage(item);

    const comboItems = Array.isArray(item.combo_items) ? item.combo_items : [];

    return (
      <TouchableOpacity className="bg-white rounded-2xl shadow-md mx-2 mb-4 overflow-hidden flex-1 max-w-1/2">
        {/* Image Section */}
        <View className="relative w-full h-48 bg-gray-100">
          <Image
            source={{ uri: imgSrc }}
            className="w-full h-full"
            resizeMode="cover"
          />
          
          {/* Discount Badge */}
          {discountPct > 0 && (
            <View className="absolute top-3 left-3 bg-red-500 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">{discountPct}% OFF</Text>
            </View>
          )}

          {/* Combo Badge */}
          <View className="absolute top-3 left-3 mt-7 bg-green-700 px-2 py-1 rounded-full">
            <Text className="text-white text-[9px] font-bold">COMBO</Text>
          </View>

          {/* Wishlist Button */}
          <TouchableOpacity className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md">
            <Heart size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View className="p-4 flex-1 justify-between">
          <View>
            {/* Title and Rating */}
            <View className="flex-row justify-between items-start gap-2 mb-2">
              <Text className="text-sm font-bold text-slate-900 flex-1 flex-wrap" numberOfLines={2}>
                {item.name}
              </Text>
              <View className="flex-row items-center gap-1">
                <Star size={12} color="#eab308" fill="#eab308" />
                <Text className="text-xs font-bold text-slate-800">
                  {parseFloat(item.rating).toFixed(1)}
                </Text>
              </View>
            </View>

            {/* Product Code */}
            {item.product_code && (
              <View className="bg-green-50 px-2 py-0.5 rounded-full mb-2 self-start">
                <Text className="text-[9px] font-bold text-green-700">{item.product_code}</Text>
              </View>
            )}

            {/* Combo Items */}
            {comboItems.length > 0 && (
              <View className="mt-3 gap-1">
                <Text className="text-[8px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Includes
                </Text>
                {comboItems.slice(0, 3).map((item, index) => (
                  <View key={index} className="flex-row items-center gap-1">
                    <Tag size={10} color="#16a34a" />
                    <Text className="text-xs text-slate-600 flex-1" numberOfLines={1}>
                      {item.product_name || item.name || `Item ${index + 1}`}
                      {item.quantity && item.quantity > 1 ? ` × ${item.quantity}` : ''}
                    </Text>
                  </View>
                ))}
                {comboItems.length > 3 && (
                  <Text className="text-xs text-green-600 font-bold mt-1">
                    +{comboItems.length - 3} more items
                  </Text>
                )}
              </View>
            )}

            {/* Description Fallback */}
            {comboItems.length === 0 && item.description && (
              <Text className="text-xs text-slate-500 mt-2 line-clamp-2">
                {item.description}
              </Text>
            )}

            {/* Pricing */}
            <View className="mt-4 gap-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-xl font-bold text-green-700">
                  ₹{price.toFixed(2)}
                </Text>
                {mrp > price && (
                  <Text className="text-xs line-through text-slate-400">
                    ₹{mrp.toFixed(2)}
                  </Text>
                )}
              </View>
              {parseFloat(savings) > 0 && (
                <Text className="text-xs font-bold text-red-500">
                  Save ₹{savings}
                </Text>
              )}
            </View>

            {/* Stock Status */}
            <Text className={`text-xs font-semibold mt-2 ${parseFloat(item.stock_quantity) > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(item.stock_quantity) > 0 ? '✓ In Stock' : '✗ Out of Stock'}
            </Text>
          </View>

          {/* Buttons */}
          <View className="mt-4 gap-2">
            <TouchableOpacity className="bg-slate-100 py-2 rounded-xl flex-row items-center justify-center gap-1 border border-slate-200">
              <Eye size={14} color="#475569" />
              <Text className="text-slate-700 font-bold text-xs">Quick View</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-green-600 py-2 rounded-xl flex-row items-center justify-center gap-1">
              <ShoppingCart size={14} color="white" />
              <Text className="text-white font-bold text-xs">Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-slate-600 mt-3">Loading combos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center px-6">
        <Text className="text-red-600 font-bold text-lg mb-3">Oops!</Text>
        <Text className="text-slate-600 text-center mb-6">{error}</Text>
        <TouchableOpacity
          onPress={fetchCombos}
          className="bg-green-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-bold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (allCombos.length === 0) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
          <Tag size={32} color="#16a34a" />
        </View>
        <Text className="text-slate-800 font-bold text-lg">No Combos Found</Text>
        <Text className="text-slate-500 text-sm mt-2">No combo products available yet.</Text>
        <TouchableOpacity
          onPress={fetchCombos}
          className="bg-green-600 px-6 py-3 rounded-lg mt-6"
        >
          <Text className="text-white font-bold">Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#16a34a"]} />
        }
      >

        {/* Combos Grid */}
        <FlatList
          data={allCombos}
          renderItem={renderComboCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 4, paddingBottom: 110 }}
        />
      </ScrollView>
    </View>
  );
};
