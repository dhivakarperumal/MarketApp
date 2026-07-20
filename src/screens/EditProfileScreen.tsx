import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useContext(AuthContext);

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [budgetMode, setBudgetMode] = useState(user?.budget_mode || false);
  const [budgetAmount, setBudgetAmount] = useState(user?.budget_amount?.toString() || '');

  const handleSave = async () => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        username,
        email,
        phone,
        budget_mode: budgetMode,
        budget_amount: parseFloat(budgetAmount) || 0,
      };
      
      if (updateUser) {
          await updateUser(updatedUser);
      }
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been saved successfully!',
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Could not save profile changes.',
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
    >
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-slate-100 pt-12">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center">
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900">Edit Profile</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl shadow-sm shadow-slate-200/50 mb-6 border border-slate-50">
          
          <Text className="text-sm font-semibold text-slate-500 mb-2">Username</Text>
          <TextInput
            className="bg-slate-50 p-4 rounded-xl text-slate-800 font-medium mb-4 border border-slate-100"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
          />

          <Text className="text-sm font-semibold text-slate-500 mb-2">Email Address</Text>
          <TextInput
            className="bg-slate-50 p-4 rounded-xl text-slate-800 font-medium mb-4 border border-slate-100"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Enter email"
          />

          <Text className="text-sm font-semibold text-slate-500 mb-2">Phone Number</Text>
          <TextInput
            className="bg-slate-50 p-4 rounded-xl text-slate-800 font-medium mb-4 border border-slate-100"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
          />

        </View>

        <View className="bg-white p-5 rounded-2xl shadow-sm shadow-slate-200/50 mb-8 border border-slate-50">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-base font-semibold text-slate-800">Budget Limit</Text>
              <Text className="text-xs text-slate-500 mt-1">Enable to track your spending</Text>
            </View>
            <Switch
              value={budgetMode}
              onValueChange={setBudgetMode}
              trackColor={{ false: '#cbd5e1', true: '#86efac' }}
              thumbColor={budgetMode ? '#16a34a' : '#f8fafc'}
            />
          </View>

          {budgetMode && (
            <View>
              <Text className="text-sm font-semibold text-slate-500 mb-2">Monthly Budget Amount (₹)</Text>
              <TextInput
                className="bg-slate-50 p-4 rounded-xl text-slate-800 font-medium border border-slate-100"
                value={budgetAmount}
                onChangeText={setBudgetAmount}
                keyboardType="numeric"
                placeholder="E.g. 5000"
              />
            </View>
          )}
        </View>

        <TouchableOpacity 
          className="bg-green-600 flex-row items-center justify-center py-4 rounded-2xl shadow-sm shadow-green-200 mb-10"
          onPress={handleSave}
        >
          <Save size={20} color="white" className="mr-2" />
          <Text className="text-white text-lg font-bold">Save Changes</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
