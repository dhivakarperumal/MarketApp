import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { CategorySection } from '../components/CategorySection';
import { AboutSection } from '../components/AboutSection';
import { Features } from '../components/Feature';
import { Banner1 } from '../components/Banner1';
import { Hero } from '../components/Hero';
import { ProductSection } from '../components/ProductSection';
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
        // Fetch up to 12 latest products
        const latest = [...regular].sort((a: any, b: any) => b.id - a.id).slice(0, 12);
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

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ paddingBottom: 110 }}>
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
            <ProductSection 
              title="Latest" 
              highlight="Products" 
              products={latestProducts} 
              itemWidth={170} 
            />

            <AboutSection />

            {/* Top Offers */}
            <ProductSection 
              title="Top" 
              highlight="Offers" 
              products={topOffers} 
              itemWidth={170} 
            />

            <Banner1 />

            {/* Combos */}
            <ProductSection 
              title="Combo" 
              highlight="Products" 
              products={combos} 
              itemWidth={190} 
            />
            
            <Features />
          </>
        )}
      </View>
    </ScrollView>
  );
};
