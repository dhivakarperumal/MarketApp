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
import { Star, ShoppingCart, Zap, TrendingUp } from 'lucide-react-native';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { useStore } from '../context/StoreContext';

interface Category {
  id: number;
  name: string;
  images?: string | string[];
  image?: string;
}

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
  category_id?: number | string;
}

export const ProductsScreen = () => {
  const { categoriesCache, setCategoriesCache } = useStore();
  const [categories, setCategories] = useState<Category[]>(categoriesCache || []);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products and categories concurrently
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);

      // Handle products
      if (prodRes.data && Array.isArray(prodRes.data)) {
        setProducts(prodRes.data);
      } else if (prodRes.data && prodRes.data.data) {
        setProducts(prodRes.data.data);
      } else {
        setProducts([]);
      }

      // Handle categories
      if (catRes.data && Array.isArray(catRes.data)) {
        // Sort categories by ID ascending so the "first added" category shows first
        const sortedCategories = [...catRes.data].sort((a, b) => a.id - b.id);
        setCategories(sortedCategories);
        setCategoriesCache(sortedCategories);
      }
    } catch (err: any) {
      console.error('Fetch Data Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load data';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  const getCategoryImage = (cat: Category) => {
    if (typeof cat.images === 'string') return cat.images;
    if (Array.isArray(cat.images) && cat.images.length > 0) return cat.images[0];
    if (cat.image) return cat.image;
    return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';
  };

  const renderProductBadges = (product: Product) => {
    return (
      <View className="absolute top-2 right-2 flex-col gap-1">
        {product.todays_deal && (
          <View className="bg-red-500 px-2 py-1 rounded-lg flex-row items-center gap-1">
            <Zap size={12} color="white" />
            <Text className="text-white text-[10px] font-bold">Deal</Text>
          </View>
        )}
        {product.best_seller && (
          <View className="bg-orange-500 px-2 py-1 rounded-lg">
            <Text className="text-white text-[10px] font-bold">Bestseller</Text>
          </View>
        )}
        {product.featured_product && (
          <View className="bg-blue-500 px-2 py-1 rounded-lg flex-row items-center gap-1">
            <TrendingUp size={12} color="white" />
            <Text className="text-white text-[10px] font-bold">Featured</Text>
          </View>
        )}
      </View>
    );
  };

  const renderProductCard = ({ item }: { item: Product }) => {
    return <ProductCard product={item} />;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-slate-600 mt-3">Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center px-6">
        <Text className="text-red-600 font-bold text-lg mb-3">Oops!</Text>
        <Text className="text-slate-600 text-center mb-6">{error}</Text>
        <TouchableOpacity
          onPress={fetchAllData}
          className="bg-green-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-bold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filteredProducts = activeCategoryId 
    ? products.filter(p => Number(p.category_id) === activeCategoryId)
    : products;

  return (
    <View className="flex-1 bg-slate-50 flex-row">
      {/* Left Sidebar - Categories */}
      <View style={{ width: 110, backgroundColor: '#ffffff', borderRightWidth: 1, borderRightColor: '#e2e8f0' }}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* All Categories Option */}
          <TouchableOpacity
            onPress={() => setActiveCategoryId(null)}
            style={{
              paddingVertical: 14,
              alignItems: 'center',
              backgroundColor: activeCategoryId === null ? '#f8fafc' : '#ffffff',
              borderLeftWidth: 4,
              borderLeftColor: activeCategoryId === null ? '#9333ea' : 'transparent',
            }}
          >
            <View className="w-14 h-14 rounded-full bg-slate-50 items-center justify-center mb-2 border border-slate-200 shadow-sm">
              <Star size={24} color={activeCategoryId === null ? "#9333ea" : "#f59e0b"} fill={activeCategoryId === null ? "#9333ea" : "#fde68a"} />
            </View>
            <Text style={{ fontSize: 11, textAlign: 'center', color: activeCategoryId === null ? '#9333ea' : '#475569', fontWeight: activeCategoryId === null ? '700' : '500' }}>
              Popular
            </Text>
          </TouchableOpacity>

          {/* Category List */}
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id.toString()}
                onPress={() => setActiveCategoryId(cat.id)}
                style={{
                  paddingVertical: 14,
                  alignItems: 'center',
                  backgroundColor: isActive ? '#f8fafc' : '#ffffff',
                  borderLeftWidth: 4,
                  borderLeftColor: isActive ? '#9333ea' : 'transparent',
                }}
              >
                <View className="w-14 h-14 rounded-full bg-slate-50 items-center justify-center mb-2 border border-slate-200 overflow-hidden shadow-sm">
                  <Image
                    source={{ uri: getCategoryImage(cat) }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>
                <Text style={{ fontSize: 11, textAlign: 'center', paddingHorizontal: 4, color: isActive ? '#9333ea' : '#475569', fontWeight: isActive ? '700' : '500' }}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Right Side - Products */}
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        {filteredProducts.length === 0 ? (
          <View className="flex-1 items-center justify-center pt-20">
            <ShoppingCart size={48} color="#ccc" />
            <Text className="text-slate-500 mt-3">No products available</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#16a34a"]} />
            }
            columnWrapperStyle={{
              justifyContent: "space-between",
              paddingHorizontal: 8,
            }}
            contentContainerStyle={{
              paddingTop: 12,
              paddingHorizontal: 4,
              paddingBottom: 50,
            }}
            ListHeaderComponent={
              <View className="px-3 pb-3 pt-2">
                <Text className="text-lg font-bold text-slate-800">
                  {activeCategoryId ? categories.find(c => c.id === activeCategoryId)?.name : 'Featured On Meesho'}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
};
