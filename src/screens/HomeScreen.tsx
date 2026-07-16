import React from 'react';
import { View, ScrollView } from 'react-native';
import { CategorySection } from '../components/CategorySection';
import { AboutSection } from '../components/AboutSection';
import { Features } from '../components/Feature';
import { Banner1 } from '../components/Banner1';

export const HomeScreen = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="py-4">
        <CategorySection />
        <AboutSection />
        <Banner1/>
        <Features />
      </View>
    </ScrollView>
  );
};
