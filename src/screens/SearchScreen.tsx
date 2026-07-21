import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search, X } from 'lucide-react-native';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

interface Product {
  id: number;
  name: string;
  selling_price: string;
  mrp: string;
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
  category_id?: number;
}

export const SearchScreen = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  // Category filter from CategoryScreen
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ── Fetch all products ────────────────────────────────────────────────────
  const fetchAllProducts = async () => {
    try {
      const res = await api.get('/products');
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setAllProducts(data);
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  // ── Fetch products by category ────────────────────────────────────────────
  const fetchByCategory = async (categoryId: number) => {
    let all = allProducts;
    if (all.length === 0) {
      all = await fetchAllProducts();
    }
    // Filter locally to guarantee we only show products for this category
    return all.filter((p: Product) => Number(p.category_id) === Number(categoryId));
  };

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchAllProducts().then(data => {
      // Avoid overwriting if a category filter is active or is about to be active
      if (!route.params?.categoryId) {
        setActiveCategoryId((currentId) => {
          if (!currentId) setFiltered(data);
          return currentId;
        });
      }
      setLoading(false);
    });
  }, []);

  // ── React to category params when tab is focused ──────────────────────────
  useFocusEffect(
    useCallback(() => {
      const catId: number | undefined = route.params?.categoryId;
      const catName: string | undefined = route.params?.categoryName;

      if (catId) {
        setActiveCategoryId(catId);
        setActiveCategoryName(catName ?? null);
        setQuery('');
        setLoading(true);
        fetchByCategory(catId).then(data => {
          setFiltered(data);
          setLoading(false);
        });
        // Clear params so re-focusing without new params doesn't re-filter
        navigation.setParams({ categoryId: undefined, categoryName: undefined });
      }
    }, [route.params?.categoryId])
  );

  // ── Live text filter on top of current product set ───────────────────────
  useEffect(() => {
    if (!query.trim()) {
      if (activeCategoryId) {
        // Re-apply category filter
        fetchByCategory(activeCategoryId).then(setFiltered);
      } else {
        setFiltered(allProducts);
      }
    } else {
      const q = query.toLowerCase();
      const base = activeCategoryId
        ? filtered  // already category-filtered
        : allProducts;
      setFiltered(base.filter(p => p.name.toLowerCase().includes(q)));
    }
  }, [query]);

  // ── Clear category filter ─────────────────────────────────────────────────
  const clearCategory = () => {
    setActiveCategoryId(null);
    setActiveCategoryName(null);
    setQuery('');
    setFiltered(allProducts);
  };

  // ── Pull to refresh ───────────────────────────────────────────────────────
  const onRefresh = async () => {
    setRefreshing(true);
    if (activeCategoryId) {
      const data = await fetchByCategory(activeCategoryId);
      setFiltered(data);
    } else {
      const data = await fetchAllProducts();
      setFiltered(data);
    }
    setRefreshing(false);
  };

  const isSearching = query.trim().length > 0;

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingBottom: insets.bottom }}>

      {/* ── Search Bar ── */}
      <View
        className="bg-white px-4 pt-3 pb-3 border-b border-slate-100"
        style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>
        <View className="flex-row items-center bg-slate-100 rounded-2xl px-4">
          <Search size={18} color="#16a34a" />
          <TextInput
            className="flex-1 ml-3 text-slate-800 text-base py-3"
            placeholder={activeCategoryName ? `Search in ${activeCategoryName}...` : 'Search all products...'}
            placeholderTextColor="#94a3b8"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Active Category Chip ── */}
        {activeCategoryName && (
          <View className="flex-row items-center mt-2">
            <View className="flex-row items-center bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
              <Text className="text-green-700 text-xs font-bold mr-2">
                📂 {activeCategoryName}
              </Text>
              <TouchableOpacity onPress={clearCategory} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <X size={13} color="#16a34a" />
              </TouchableOpacity>
            </View>
            <Text className="text-slate-400 text-xs ml-2">
              Tap ✕ to show all
            </Text>
          </View>
        )}
      </View>

      {/* ── Content ── */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-slate-500 mt-3 font-medium">
            {activeCategoryName ? `Loading ${activeCategoryName}...` : 'Loading products...'}
          </Text>
        </View>
      ) : filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Search size={52} color="#cbd5e1" />
          <Text className="text-slate-700 font-bold text-xl mt-4 mb-1">No results found</Text>
          <Text className="text-slate-400 text-center text-sm mb-4">
            {activeCategoryName
              ? `No products in "${activeCategoryName}"`
              : 'Try a different keyword.'}
          </Text>
          <TouchableOpacity onPress={clearCategory} className="bg-green-600 px-6 py-2.5 rounded-full">
            <Text className="text-white font-semibold">Show All Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => <ProductCard product={item} />}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 8 }}
          contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 4, paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16a34a']} tintColor="#16a34a" />
          }
          ListHeaderComponent={
            <View className="mb-3 ml-2">
              {activeCategoryName && !isSearching ? (
                <Text className="text-slate-500 text-sm">
                  <Text className="text-green-600 font-bold">{filtered.length}</Text>
                  {' '}product{filtered.length !== 1 ? 's' : ''} in{' '}
                  <Text className="text-green-600 font-bold">"{activeCategoryName}"</Text>
                </Text>
              ) : isSearching ? (
                <Text className="text-slate-500 text-sm">
                  <Text className="text-green-600 font-bold">{filtered.length}</Text>
                  {' '}result{filtered.length !== 1 ? 's' : ''} for "
                  <Text className="text-green-600 font-semibold">{query}</Text>"
                </Text>
              ) : (
                <Text className="text-slate-500 text-sm">
                  All Products —{' '}
                  <Text className="text-green-600 font-bold">{filtered.length}</Text> items
                </Text>
              )}
            </View>
          }
        />
      )}
    </View>
  );
};
