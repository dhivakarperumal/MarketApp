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
    <ScrollView className="flex-1 bg-white">
      <View className="-pt-10 pb-4">
        <Hero />
        <CategorySection />
        <ProductSwiper />
        <AboutSection />
        <Banner1/>
        <Features />

      </View>
    </ScrollView>
  );
};
