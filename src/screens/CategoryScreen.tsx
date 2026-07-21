import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../context/StoreContext';
import api from '../services/api';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';

const TILE_COLORS = [
  { bg: '#f0fdf4', border: '#bbf7d0' },
  { bg: '#eff6ff', border: '#bfdbfe' },
  { bg: '#fdf4ff', border: '#e9d5ff' },
  { bg: '#fff7ed', border: '#fed7aa' },
  { bg: '#fdf2f8', border: '#fbcfe8' },
  { bg: '#f0fdfa', border: '#99f6e4' },
  { bg: '#fefce8', border: '#fde68a' },
  { bg: '#fff1f2', border: '#fecdd3' },
];

interface Category {
  id: number;
  name: string;
  images?: string | string[];
  image?: string;
}

export const CategoryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { categoriesCache, setCategoriesCache } = useStore();
  const [categories, setCategories] = useState<Category[]>(categoriesCache || []);
  const [loading, setLoading] = useState(!categoriesCache || categoriesCache.length === 0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      const data = Array.isArray(res.data) ? res.data : [];
      setCategories(data);
      setCategoriesCache(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!categoriesCache || categoriesCache.length === 0) {
      fetchCategories();
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCategories();
  };

  const getImage = (cat: Category) => {
    if (typeof cat.images === 'string') return cat.images;
    if (Array.isArray(cat.images) && cat.images.length > 0) return cat.images[0];
    if (cat.image) return cat.image;
    return DEFAULT_IMAGE;
  };

  const handleCategoryPress = (cat: Category) => {
    // Navigate to Search tab and pass category filter
    navigation.navigate('Search', {
      categoryId: cat.id,
      categoryName: cat.name,
    });
  };

  const renderItem = ({ item, index }: { item: Category; index: number }) => {
    const color = TILE_COLORS[index % TILE_COLORS.length];
    const imageUri = getImage(item);

    return (
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={() => handleCategoryPress(item)}
        style={{
          width: '47%',
          marginBottom: 14,
          borderRadius: 20,
          backgroundColor: color.bg,
          borderWidth: 1.5,
          borderColor: color.border,
          alignItems: 'center',
          paddingVertical: 20,
          paddingHorizontal: 10,
          elevation: 3,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
        }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
          }}>
          <Image
            source={{ uri: imageUri }}
            style={{ width: 56, height: 56, borderRadius: 28 }}
            resizeMode="cover"
          />
        </View>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: '#1e293b',
            textAlign: 'center',
            lineHeight: 18,
          }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSkeleton = () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={i}
          style={{ width: '47%', height: 160, marginBottom: 14, borderRadius: 20, backgroundColor: '#f1f5f9' }}
        />
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingBottom: insets.bottom }}>
      {loading ? (
        <View style={{ paddingTop: 16 }}>{renderSkeleton()}</View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16a34a']} tintColor="#16a34a" />
          }
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: '#0f172a' }}>
                Shop by <Text style={{ color: '#16a34a' }}>Category</Text>
              </Text>
              <Text style={{ color: '#64748b', marginTop: 4, fontSize: 13 }}>
                {categories.length} categories — tap to browse
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-slate-400 text-base">No categories found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};
