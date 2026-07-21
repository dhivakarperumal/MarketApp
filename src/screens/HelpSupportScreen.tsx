import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MessageCircleQuestion, PhoneCall, FileText, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const HelpSupportScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
          <Text className="text-xl font-bold text-white">Help & Support</Text>
          <View className="w-10" />
        </View>
      </View>

      {/* ── Content ── */}
      <ScrollView
        className="flex-1 px-4 -mt-16"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Intro Card */}
        <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200/50 items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-green-50 border-4 border-white shadow-sm items-center justify-center mb-3">
            <MessageCircleQuestion size={36} color="#16a34a" />
          </View>
          <Text className="text-2xl font-bold text-slate-900 mb-1">How can we help?</Text>
          <Text className="text-slate-500 text-center text-sm leading-5">
            Choose an option below to get assistance with your account or orders.
          </Text>
        </View>

        {/* Support Options */}
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
          Support Options
        </Text>

        <TouchableOpacity className="flex-row items-center bg-white p-4 mb-3 rounded-2xl shadow-sm border border-slate-100">
          <View className="w-12 h-12 rounded-full bg-green-50 items-center justify-center mr-4">
            <MessageCircleQuestion size={24} color="#16a34a" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-slate-800 mb-0.5">FAQs</Text>
            <Text className="text-slate-500 text-xs">Find answers to common questions</Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center bg-white p-4 mb-3 rounded-2xl shadow-sm border border-slate-100">
          <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-4">
            <PhoneCall size={24} color="#3b82f6" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-slate-800 mb-0.5">Contact Us</Text>
            <Text className="text-slate-500 text-xs">Reach out to our customer support</Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center bg-white p-4 mb-3 rounded-2xl shadow-sm border border-slate-100">
          <View className="w-12 h-12 rounded-full bg-purple-50 items-center justify-center mr-4">
            <FileText size={24} color="#a855f7" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-slate-800 mb-0.5">Terms & Conditions</Text>
            <Text className="text-slate-500 text-xs">Read our policies and guidelines</Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};
