import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MessageCircleQuestion, PhoneCall, FileText, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const HelpSupportScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingBottom: insets.bottom }}>
      <View 
        className="flex-row items-center px-4 pb-4 border-b border-slate-200 bg-white"
        style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 16 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900">Help & Support</Text>
      </View>
      
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold text-slate-800 mt-2 mb-1">How can we help you?</Text>
        <Text className="text-slate-500 mb-6">Choose an option below to get assistance with your account or orders.</Text>

        <TouchableOpacity className="flex-row items-center bg-white p-4 mb-3 rounded-2xl shadow-sm border border-slate-100">
          <View className="w-12 h-12 rounded-full bg-green-50 items-center justify-center mr-4">
            <MessageCircleQuestion size={24} color="#16a34a" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-800 mb-1">FAQs</Text>
            <Text className="text-slate-500 text-sm">Find answers to common questions</Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center bg-white p-4 mb-3 rounded-2xl shadow-sm border border-slate-100">
          <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-4">
            <PhoneCall size={24} color="#3b82f6" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-800 mb-1">Contact Us</Text>
            <Text className="text-slate-500 text-sm">Reach out to our customer support</Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center bg-white p-4 mb-3 rounded-2xl shadow-sm border border-slate-100">
          <View className="w-12 h-12 rounded-full bg-purple-50 items-center justify-center mr-4">
            <FileText size={24} color="#a855f7" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-800 mb-1">Terms & Conditions</Text>
            <Text className="text-slate-500 text-sm">Read our policies and guidelines</Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
