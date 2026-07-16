import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { User, ShoppingBag, Heart, ChevronRight, Settings, HelpCircle, LogOut } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const MoreItemCard = ({ icon: Icon, title, onPress }) => (
  <TouchableOpacity
    className="flex-row items-center justify-between bg-white p-4 mb-3 rounded-2xl shadow-sm border border-slate-100"
    onPress={onPress}
  >
    <View className="flex-row items-center">
      <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center mr-4">
        <Icon size={22} color="#16a34a" />
      </View>
      <Text className="text-lg font-medium text-slate-800">{title}</Text>
    </View>
    <ChevronRight size={20} color="#94a3b8" />
  </TouchableOpacity>
);

export const MoreScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="mb-6 mt-2">
        <Text className="text-2xl font-bold text-slate-900 mb-1">Account</Text>
        <Text className="text-slate-500">Manage your profile and settings</Text>
      </View>

      <MoreItemCard
        icon={User}
        title="Profile"
        onPress={() => navigation.navigate('Profile')}
      />
      <MoreItemCard
        icon={ShoppingBag}
        title="My Orders"
        onPress={() => navigation.navigate('Orders')}
      />
      <MoreItemCard
        icon={Heart}
        title="My Wishlist"
        onPress={() => navigation.navigate('Wishlist')}
      />

      <View className="mt-6 mb-4">
        <Text className="text-lg font-bold text-slate-900 mb-1">Other</Text>
      </View>
      
      <MoreItemCard
        icon={Settings}
        title="Settings"
        onPress={() => navigation.navigate('Settings')}
      />
      <MoreItemCard
        icon={HelpCircle}
        title="Help & Support"
        onPress={() => navigation.navigate('HelpSupport')}
      />
      
      <TouchableOpacity
        className="flex-row items-center justify-center bg-red-50 p-4 mt-6 mb-10 rounded-2xl"
        onPress={() => console.log('Logout')}
      >
        <LogOut size={20} color="#ef4444" className="mr-2" />
        <Text className="text-red-500 font-bold text-lg">Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
