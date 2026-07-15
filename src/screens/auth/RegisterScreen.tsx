import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { User, Phone, Mail, Lock, Leaf, CheckSquare } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';

export const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreed: true
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name: string, value: string | boolean) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.agreed) {
      Alert.alert("Error", "Please agree to the Terms & Conditions");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: "user",
        status: "active",
      };

      await api.post("/auth/register", payload);
      Alert.alert("Success", "Registration successful! Please login.");
      navigation.navigate("Login");
    } catch (error: any) {
      console.error("Register Error:", error);
      Alert.alert("Registration Failed", error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }} bounces={false}>
        
        <View className="mt-8 mb-8">
          <Text className="text-3xl font-bold text-slate-900 flex-row items-center mb-2">
            Create Account <Leaf color="#22c55e" size={24} />
          </Text>
          <Text className="text-slate-500 text-sm">
            Join <Text className="font-bold text-green-600">Priyam Supermarket</Text> and get the best shopping experience
          </Text>
        </View>

        <View className="space-y-5 mb-8">
          
          <View>
            <Text className="text-slate-700 font-bold mb-2 ml-1">Full Name</Text>
            <View className="relative justify-center">
              <View className="absolute left-4 z-10"><User color="#94a3b8" size={20} /></View>
              <TextInput
                placeholder="Enter your full name"
                placeholderTextColor="#94a3b8"
                value={form.username}
                onChangeText={(text) => handleChange("username", text)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-base"
              />
            </View>
          </View>

          <View>
            <Text className="text-slate-700 font-bold mb-2 ml-1">Phone Number</Text>
            <View className="relative justify-center">
              <View className="absolute left-4 z-10"><Phone color="#94a3b8" size={20} /></View>
              <TextInput
                placeholder="Enter your phone number"
                placeholderTextColor="#94a3b8"
                value={form.phone}
                keyboardType="phone-pad"
                onChangeText={(text) => handleChange("phone", text)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-base"
              />
            </View>
          </View>

          <View>
            <Text className="text-slate-700 font-bold mb-2 ml-1">Email Address</Text>
            <View className="relative justify-center">
              <View className="absolute left-4 z-10"><Mail color="#94a3b8" size={20} /></View>
              <TextInput
                placeholder="Enter your email address"
                placeholderTextColor="#94a3b8"
                value={form.email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(text) => handleChange("email", text)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-base"
              />
            </View>
          </View>

          <View>
            <Text className="text-slate-700 font-bold mb-2 ml-1">Password</Text>
            <View className="relative justify-center">
              <View className="absolute left-4 z-10"><Lock color="#94a3b8" size={20} /></View>
              <TextInput
                placeholder="Create a strong password"
                placeholderTextColor="#94a3b8"
                value={form.password}
                secureTextEntry
                onChangeText={(text) => handleChange("password", text)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-base"
              />
            </View>
          </View>

          <View>
            <Text className="text-slate-700 font-bold mb-2 ml-1">Confirm Password</Text>
            <View className="relative justify-center">
              <View className="absolute left-4 z-10"><Lock color="#94a3b8" size={20} /></View>
              <TextInput
                placeholder="Confirm your password"
                placeholderTextColor="#94a3b8"
                value={form.confirmPassword}
                secureTextEntry
                onChangeText={(text) => handleChange("confirmPassword", text)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-base"
              />
            </View>
          </View>

          <TouchableOpacity 
            className="flex-row items-center mt-2"
            onPress={() => handleChange("agreed", !form.agreed)}
          >
            <View className={`w-5 h-5 rounded border items-center justify-center mr-3 ${form.agreed ? 'bg-green-600 border-green-600' : 'bg-white border-slate-300'}`}>
              {form.agreed && <CheckSquare color="white" size={14} />}
            </View>
            <Text className="text-slate-600">I agree to the <Text className="text-green-600 font-bold">Terms & Conditions</Text></Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={handleSubmit}
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm ${isLoading ? 'bg-green-400' : 'bg-green-600'}`}
        >
          <User color="white" size={20} />
          <Text className="text-white font-bold text-lg">{isLoading ? "Creating..." : "Create Account"}</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mt-8 pb-8">
          <Text className="text-slate-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-green-600 font-bold">Sign In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};
