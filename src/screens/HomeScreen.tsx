import React from 'react';
import { View, ScrollView } from 'react-native';
import { CategorySection } from '../components/CategorySection';

export const HomeScreen = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="py-4">
        <CategorySection />
      </View>
    </ScrollView>
  );
};
