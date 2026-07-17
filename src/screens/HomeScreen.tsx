import React from 'react';
import { View, ScrollView } from 'react-native';
import { CategorySection } from '../components/CategorySection';
import { AboutSection } from '../components/AboutSection';
import { Features } from '../components/Feature';
import { Banner1 } from '../components/Banner1';
import { Hero } from '../components/Hero';
import { ProductSwiper } from '../components/ProductsSwiper';

export const HomeScreen = () => {
  return (
    <ScrollView className="flex-1">
      <View className="pb-4">
        <Hero />

        {/* lift the category card up so it overlaps the hero image */}
        <View style={{ marginTop: -60 }}>
          <CategorySection />
        </View>

        <ProductSwiper />
        <AboutSection />
        <Banner1 />
        <Features />

      </View>
    </ScrollView>
  );
};
