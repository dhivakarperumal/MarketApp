import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, User as UserIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-slate-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900">Profile Details</Text>
      </View>
      <ScrollView className="p-6">
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center mb-4">
            <UserIcon size={40} color="#16a34a" />
          </View>
          <Text className="text-2xl font-bold text-slate-800">{user?.username || 'Guest'}</Text>
          <Text className="text-base text-slate-500 mb-6">{user?.email || 'No email provided'}</Text>
          
          <View className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
            <View className="flex-row justify-between py-3 border-b border-slate-200">
              <Text className="text-slate-500">Phone</Text>
              <Text className="text-slate-800 font-medium">{user?.phone || 'Not provided'}</Text>
            </View>
            <View className="flex-row justify-between py-3 border-b border-slate-200">
              <Text className="text-slate-500">User ID</Text>
              <Text className="text-slate-800 font-medium">{user?.user_id || 'N/A'}</Text>
            </View>
            <View className="flex-row justify-between py-3">
              <Text className="text-slate-500">Budget Limit</Text>
              <Text className="text-slate-800 font-medium">
                {user?.budget_mode ? `₹${user?.budget_amount}` : 'Off'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
