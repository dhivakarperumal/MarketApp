import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { ShoppingCart, ShieldCheck, Leaf, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const { login } = useContext(AuthContext);
  
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.identifier || !form.password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      const userData = res.data.user || res.data;
      await login(res.data.token, userData);
    } catch (error: any) {
      console.error("Login Error:", error);
      Alert.alert("Login Failed", error.response?.data?.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-slate-50"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
        
        {/* Top Image Section */}
        <View className="h-64 relative bg-green-900">
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop" }} 
            className="absolute inset-0 w-full h-full opacity-60"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30 justify-center items-center">
            <View className="flex-row items-center gap-2 mb-2">
              <ShoppingCart color="white" size={40} />
              <Text className="text-4xl font-bold text-white">Priyam</Text>
            </View>
            <Text className="text-white/90 tracking-[0.3em] text-xs font-semibold uppercase">Supermarket</Text>
          </View>
        </View>

        {/* Form Container */}
        <View className="flex-1 bg-white -mt-6 rounded-t-3xl px-6 pt-8 pb-10 shadow-lg">
          
          <View className="flex-row justify-between items-center mb-8">
            <View>
              <Text className="text-3xl font-bold text-slate-900 flex-row items-center">
                Welcome! <Leaf color="#22c55e" size={24} />
              </Text>
              <Text className="text-slate-500 text-sm mt-1">Sign in to continue to Priyam</Text>
            </View>
            
            <View className="flex-row items-center gap-1 bg-green-50 px-2 py-1.5 rounded-lg border border-green-100">
              <ShieldCheck color="#16a34a" size={16} />
              <View>
                <Text className="text-[10px] font-bold text-slate-800 leading-none">Secure</Text>
              </View>
            </View>
          </View>

          {/* Inputs */}
          <View className="space-y-3 mb-8">
            
            <View>
              <Text className="text-slate-700 font-bold mt-3 mb-2 ml-1 text-sm">Email or Phone</Text>
              <View className="relative justify-center">
                <View className="absolute left-4 z-10">
                  <Mail color="#94a3b8" size={20} />
                </View>
                <TextInput
                  placeholder="Enter your email or phone number"
                  placeholderTextColor="#94a3b8"
                  value={form.identifier}
                  onChangeText={(text) => handleChange("identifier", text)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-base"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View>
              <Text className="text-slate-700 font-bold mt-3 mb-2 ml-1 text-sm">Password</Text>
              <View className="relative justify-center">
                <View className="absolute left-4 z-10">
                  <Lock color="#94a3b8" size={20} />
                </View>
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                  value={form.password}
                  onChangeText={(text) => handleChange("password", text)}
                  secureTextEntry={!showPassword}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-base"
                />
                <TouchableOpacity 
                  className="absolute right-4 z-10 p-2"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff color="#94a3b8" size={20} /> : <Eye color="#94a3b8" size={20} />}
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity className="items-end mt-2">
              <Text className="text-green-600 font-bold text-sm">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            onPress={handleSubmit}
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm ${isLoading ? 'bg-green-400' : 'bg-green-600'}`}
          >
            <Lock color="white" size={20} />
            <Text className="text-white font-bold text-lg">{isLoading ? "Signing In..." : "Sign In"}</Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View className="flex-row justify-center items-center mt-10 pb-4">
            <Text className="text-slate-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text className="text-green-600 font-bold">Register Now</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
