import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, FlatList, ActivityIndicator } from 'react-native';
import { CategorySection } from '../components/CategorySection';
import { AboutSection } from '../components/AboutSection';
import { Features } from '../components/Feature';
import { Banner1 } from '../components/Banner1';
import { Hero } from '../components/Hero';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

export const HomeScreen = () => {
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [topOffers, setTopOffers] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await api.get('/products');
        const data = Array.isArray(response.data) ? response.data : (response.data?.products || response.data?.data || []);
        
        const regular = data.filter((p: any) => String(p.type) !== '1');
        const latest = [...regular].sort((a: any, b: any) => b.id - a.id).slice(0, 6);
        setLatestProducts(latest);

        const offers = [...regular].sort((a: any, b: any) => {
          const offerA = parseFloat(a.offer || '0');
          const offerB = parseFloat(b.offer || '0');
          return offerB - offerA;
        }).filter((p: any) => parseFloat(p.offer || '0') > 0).slice(0, 6);
        
        setTopOffers(offers.length > 0 ? offers : latest.slice(0, 6));

        const comboList = data.filter((p: any) => String(p.type) === '1').slice(0, 6);
        setCombos(comboList);
      } catch (error) {
        console.error("Home Data Fetch Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const SectionHeading = ({ title, highlight }: { title: string, highlight: string }) => (
    <View className="px-4 py-4 bg-white mt-2">
      <View className="flex-row justify-between items-end">
        <View>
          <Text className="text-[24px] font-black text-gray-900">
            {title} <Text className="text-green-600">{highlight}</Text>
          </Text>
          <View className="w-16 h-1 bg-green-600 rounded-full mt-2" />
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="pb-4">
        <Hero />

        <View style={{ marginTop: -60 }}>
          <CategorySection />
        </View>

        {loading ? (
           <ActivityIndicator size="large" color="#16a34a" className="my-8" />
        ) : (
          <>
            {/* Latest Products */}
            {latestProducts.length > 0 && (
              <View className="bg-white">
                <SectionHeading title="Latest" highlight="Products" />
                <View className="flex-row flex-wrap justify-between px-2 pt-2">
                  {latestProducts.map(product => (
                    <View key={product.id} style={{ width: '50%' }}>
                      <ProductCard product={product} />
                    </View>
                  ))}
                </View>
              </View>
            )}

            <AboutSection />

            {/* Top Offers */}
            {topOffers.length > 0 && (
              <View className="bg-white mt-4 pb-4">
                <SectionHeading title="Top" highlight="Offers" />
                <FlatList 
                  data={topOffers}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 10 }}
                  renderItem={({ item }) => (
                    <View style={{ width: 170 }}>
                      <ProductCard product={item} />
                    </View>
                  )}
                />
              </View>
            )}

            <Banner1 />

            {/* Combos */}
            {combos.length > 0 && (
              <View className="bg-white mt-4 pb-4">
                <SectionHeading title="Combo" highlight="Products" />
                <FlatList 
                  data={combos}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 10 }}
                  renderItem={({ item }) => (
                    <View style={{ width: 190 }}>
                      <ProductCard product={item} />
                    </View>
                  )}
                />
              </View>
            )}
            
            <Features />
          </>
        )}
      </View>
    </ScrollView>
  );
};
