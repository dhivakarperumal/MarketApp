import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, User as UserIcon, Phone, Mail, Hash, Wallet, Edit3, Shield } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingBottom: insets.bottom }}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      {/* Header Background */}
      <View 
        className="bg-green-600 pb-20 px-4 rounded-b-[40px]"
        style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 24 }}
      >
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <ArrowLeft size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">My Profile</Text>
          <TouchableOpacity 
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            onPress={() => (navigation as any).navigate('EditProfile')}
          >
            <Edit3 size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 -mt-16" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Profile Card */}
        <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200/50 items-center mb-6">
          <View className="relative mb-4">
            <View className="w-28 h-28 rounded-full bg-green-50 border-4 border-white shadow-sm items-center justify-center">
              <UserIcon size={50} color="#16a34a" />
            </View>
            <TouchableOpacity 
              className="absolute bottom-0 right-0 bg-green-500 w-8 h-8 rounded-full items-center justify-center border-2 border-white"
              onPress={() => (navigation as any).navigate('EditProfile')}
            >
              <Edit3 size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-2xl font-bold text-slate-900 mb-1">{user?.username || 'Guest User'}</Text>
          <Text className="text-slate-500 font-medium mb-4">{user?.email || 'guest@market.com'}</Text>
          
          <View className="flex-row items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
            <Shield size={16} color="#16a34a" />
            <Text className="text-green-700 font-medium ml-1">Verified Member</Text>
          </View>
        </View>

        {/* Info Section */}
        <Text className="text-lg font-bold text-slate-900 mb-3 ml-2">Personal Information</Text>
        
        <View className="bg-white rounded-3xl p-2 shadow-sm shadow-slate-200/50 mb-8">
          
          <View className="flex-row items-center p-4 border-b border-slate-100">
            <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-4">
              <Phone size={20} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-500 mb-1">Phone Number</Text>
              <Text className="text-slate-800 font-semibold">{user?.phone || 'Not provided'}</Text>
            </View>
          </View>

          <View className="flex-row items-center p-4 border-b border-slate-100">
            <View className="w-10 h-10 rounded-full bg-purple-50 items-center justify-center mr-4">
              <Mail size={20} color="#a855f7" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-500 mb-1">Email Address</Text>
              <Text className="text-slate-800 font-semibold">{user?.email || 'Not provided'}</Text>
            </View>
          </View>

          <View className="flex-row items-center p-4 border-b border-slate-100">
            <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center mr-4">
              <Hash size={20} color="#f97316" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-500 mb-1">User ID</Text>
              <Text className="text-slate-800 font-semibold">{user?.user_id || 'N/A'}</Text>
            </View>
          </View>

          <View className="flex-row items-center p-4">
            <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center mr-4">
              <Wallet size={20} color="#16a34a" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-500 mb-1">Budget Limit</Text>
              <Text className="text-slate-800 font-semibold">
                {user?.budget_mode ? `₹${user?.budget_amount}` : 'Off'}
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};
