import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Moon, Globe, Shield, ChevronRight, Settings2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingBottom: insets.bottom }}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />

      {/* ── Green Curved Header (same as Profile) ── */}
      <View
        className="bg-green-600 pb-20 px-4 rounded-b-[40px]"
        style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 24 }}>
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <ArrowLeft size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">App Settings</Text>
          <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <Settings2 size={20} color="#ffffff" />
          </View>
        </View>
      </View>

      {/* ── Content ── */}
      <ScrollView
        className="flex-1 px-4 -mt-16"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Preferences Card */}
        <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200/50 items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-green-50 border-4 border-white shadow-sm items-center justify-center mb-3">
            <Settings2 size={36} color="#16a34a" />
          </View>
          <Text className="text-2xl font-bold text-slate-900 mb-1">Preferences</Text>
          <Text className="text-slate-500 text-center text-sm leading-5">
            Manage your app preferences, notifications, and privacy settings.
          </Text>
        </View>

        {/* ── Preferences Section ── */}
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
          Preferences
        </Text>
        <View className="bg-white rounded-3xl p-2 shadow-sm shadow-slate-200/50 mb-6">

          <View className="flex-row items-center justify-between p-4 border-b border-slate-100">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-4">
                <Bell size={20} color="#3b82f6" />
              </View>
              <View>
                <Text className="text-base font-semibold text-slate-800">Push Notifications</Text>
                <Text className="text-xs text-slate-400">Order updates & offers</Text>
              </View>
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
              <View className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center mr-4">
                <Moon size={20} color="#6366f1" />
              </View>
              <View>
                <Text className="text-base font-semibold text-slate-800">Dark Mode</Text>
                <Text className="text-xs text-slate-400">Switch to dark theme</Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#cbd5e1', true: '#22c55e' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* ── General Section ── */}
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
          General
        </Text>
        <View className="bg-white rounded-3xl p-2 shadow-sm shadow-slate-200/50">

          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-slate-100">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center mr-4">
                <Globe size={20} color="#f97316" />
              </View>
              <View>
                <Text className="text-base font-semibold text-slate-800">Language</Text>
                <Text className="text-xs text-slate-400">App display language</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="text-slate-500 mr-2 text-sm font-medium">English</Text>
              <ChevronRight size={18} color="#94a3b8" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-purple-50 items-center justify-center mr-4">
                <Shield size={20} color="#a855f7" />
              </View>
              <View>
                <Text className="text-base font-semibold text-slate-800">Privacy & Security</Text>
                <Text className="text-xs text-slate-400">Manage your data & privacy</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};
