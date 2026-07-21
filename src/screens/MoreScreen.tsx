import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { User, ShoppingBag, Heart, ChevronRight, Settings, HelpCircle, LogOut, MapPin, Info } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const MoreItemCard = ({ icon: Icon, title, onPress, iconColor = "#16a34a", iconBg = "bg-green-50" }) => (
  <TouchableOpacity
    className="flex-row items-center justify-between bg-white p-4 mb-3 rounded-2xl shadow-sm shadow-slate-100 border border-slate-50"
    onPress={onPress}
  >
    <View className="flex-row items-center">
      <View className={`w-12 h-12 rounded-full ${iconBg} items-center justify-center mr-4`}>
        <Icon size={24} color={iconColor} />
      </View>
      <Text className="text-lg font-semibold text-slate-800">{title}</Text>
    </View>
    <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center">
      <ChevronRight size={18} color="#94a3b8" />
    </View>
  </TouchableOpacity>
);

export const MoreScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  return (
    <View className="flex-1 bg-slate-50">
      {/* Modern Header */}
      <View className="bg-white pt-12 pb-6 px-6 rounded-b-3xl shadow-sm shadow-slate-100 mb-4 items-center">
        <View className="w-24 h-24 rounded-full bg-green-50 items-center justify-center mb-3 border-4 border-green-100">
          <User size={40} color="#16a34a" />
        </View>
        <Text className="text-2xl font-bold text-slate-900">{user?.username || 'Guest User'}</Text>
        <Text className="text-slate-500 font-medium mb-4">{user?.email || 'Welcome to SuperMarket'}</Text>

        <TouchableOpacity
          className="bg-green-600 py-2.5 px-8 rounded-full shadow-sm shadow-green-200"
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Text className="text-white font-semibold text-base">View Full Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{
        paddingBottom: 120, 
      }}>
        <View className="mb-3 mt-2 ml-2">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Activity</Text>
        </View>

        <MoreItemCard
          icon={ShoppingBag}
          title="My Orders"
          iconColor="#3b82f6"
          iconBg="bg-blue-50"
          onPress={() => navigation.navigate('Orders')}
        />
        <MoreItemCard
          icon={Heart}
          title="My Wishlist"
          iconColor="#ec4899"
          iconBg="bg-pink-50"
          onPress={() => navigation.navigate('Wishlist')}
        />
        <MoreItemCard
          icon={MapPin}
          title="Delivery Addresses"
          iconColor="#f97316"
          iconBg="bg-orange-50"
          onPress={() => navigation.navigate('Addresses')}
        />

        <View className="mt-6 mb-3 ml-2">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">Settings & Support</Text>
        </View>

        <MoreItemCard
          icon={Settings}
          title="App Settings"
          iconColor="#64748b"
          iconBg="bg-slate-100"
          onPress={() => navigation.navigate('Settings')}
        />
        <MoreItemCard
          icon={HelpCircle}
          title="Help & Support"
          iconColor="#8b5cf6"
          iconBg="bg-purple-50"
          onPress={() => navigation.navigate('HelpSupport')}
        />
        <MoreItemCard
          icon={Info}
          title="About SuperMarket"
          iconColor="#0ea5e9"
          iconBg="bg-sky-50"
          onPress={() => navigation.navigate('About')}
        />
        
        <TouchableOpacity
          className="flex-row items-center justify-center bg-red-50 p-4 mt-6 mb-10 rounded-2xl border border-red-100"
          onPress={() => console.log('Logout')}
        >
          <LogOut size={22} color="#ef4444" className="mr-2" />
          <Text className="text-red-500 font-bold text-lg">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
