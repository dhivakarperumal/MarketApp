import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Moon, Globe, Shield, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingBottom: insets.bottom }}>
      <View 
        className="flex-row items-center px-4 pb-4 border-b border-slate-200 bg-white"
        style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 16 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900">Settings</Text>
      </View>
      
      <ScrollView className="p-4">
        <View className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
          <View className="flex-row items-center justify-between p-4 border-b border-slate-100">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3">
                <Bell size={18} color="#3b82f6" />
              </View>
              <Text className="text-base font-medium text-slate-800">Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#cbd5e1', true: '#22c55e' }}
              thumbColor="#ffffff"
            />
          </View>
          
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-indigo-50 items-center justify-center mr-3">
                <Moon size={18} color="#6366f1" />
              </View>
              <Text className="text-base font-medium text-slate-800">Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#cbd5e1', true: '#22c55e' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <Text className="text-sm font-bold text-slate-500 uppercase ml-2 mb-2">General</Text>
        <View className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-slate-100">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-orange-50 items-center justify-center mr-3">
                <Globe size={18} color="#f97316" />
              </View>
              <Text className="text-base font-medium text-slate-800">Language</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-slate-500 mr-2">English</Text>
              <ChevronRight size={18} color="#94a3b8" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-purple-50 items-center justify-center mr-3">
                <Shield size={18} color="#a855f7" />
              </View>
              <Text className="text-base font-medium text-slate-800">Privacy & Security</Text>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
