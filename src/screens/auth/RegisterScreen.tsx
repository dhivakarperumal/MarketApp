import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { User, Phone, Mail, Lock, Leaf, CheckSquare, ShoppingCart, ShieldCheck, Eye, EyeOff } from 'lucide-react-native';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      className="flex-1 bg-slate-50"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
        
        {/* Top Image Section */}
        <View className="h-48 relative bg-green-900">
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop" }} 
            className="absolute inset-0 w-full h-full opacity-50"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/40 justify-center items-center">
            <View className="flex-row items-center gap-2 mb-1">
              <ShoppingCart color="white" size={32} />
              <Text className="text-3xl font-bold text-white">Priyam</Text>
            </View>
            <Text className="text-white/90 tracking-[0.3em] text-[10px] font-semibold uppercase">Supermarket</Text>
          </View>
        </View>

        {/* Form Container */}
        <View className="flex-1 bg-white -mt-6 rounded-t-3xl px-6 pt-8 pb-10 shadow-lg">
          
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-bold text-slate-900 flex-row items-center">
                Create Account <Leaf color="#22c55e" size={20} />
              </Text>
              <Text className="text-slate-500 text-xs mt-1">Join Priyam for the best experience</Text>
            </View>
            <View className="flex-row items-center gap-1 bg-green-50 px-2 py-1.5 rounded-lg border border-green-100">
              <ShieldCheck color="#16a34a" size={14} />
              <Text className="text-[10px] font-bold text-slate-800 leading-none">Fast & Easy</Text>
            </View>
          </View>

          <View className="space-y-3 mb-8">
            
            <View>
              <Text className="text-slate-700 font-bold mt-3 mb-2 ml-1 text-sm">Full Name</Text>
              <View className="relative justify-center">
                <View className="absolute left-4 z-10"><User color="#94a3b8" size={18} /></View>
                <TextInput
                  placeholder="Enter your full name"
                  placeholderTextColor="#94a3b8"
                  value={form.username}
                  onChangeText={(text) => handleChange("username", text)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm"
                />
              </View>
            </View>

            <View>
              <Text className="text-slate-700 font-bold mt-3 mb-2 ml-1 text-sm">Phone Number</Text>
              <View className="relative justify-center">
                <View className="absolute left-4 z-10"><Phone color="#94a3b8" size={18} /></View>
                <TextInput
                  placeholder="Enter your phone number"
                  placeholderTextColor="#94a3b8"
                  value={form.phone}
                  keyboardType="phone-pad"
                  onChangeText={(text) => handleChange("phone", text)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm"
                />
              </View>
            </View>

            <View>
              <Text className="text-slate-700 font-bold mt-3 mb-2 ml-1 text-sm">Email Address</Text>
              <View className="relative justify-center">
                <View className="absolute left-4 z-10"><Mail color="#94a3b8" size={18} /></View>
                <TextInput
                  placeholder="Enter your email address"
                  placeholderTextColor="#94a3b8"
                  value={form.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={(text) => handleChange("email", text)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm"
                />
              </View>
            </View>

            <View>
              <Text className="text-slate-700 font-bold mt-3 mb-2 ml-1 text-sm">Password</Text>
              <View className="relative justify-center">
                <View className="absolute left-4 z-10"><Lock color="#94a3b8" size={18} /></View>
                <TextInput
                  placeholder="Create password"
                  placeholderTextColor="#94a3b8"
                  value={form.password}
                  secureTextEntry={!showPassword}
                  onChangeText={(text) => handleChange("password", text)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm"
                />
                <TouchableOpacity 
                  className="absolute right-4 z-10 p-2"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff color="#94a3b8" size={20} /> : <Eye color="#94a3b8" size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-slate-700 font-bold mt-3 mb-2 ml-1 text-sm">Confirm Password</Text>
              <View className="relative justify-center">
                <View className="absolute left-4 z-10"><Lock color="#94a3b8" size={18} /></View>
                <TextInput
                  placeholder="Repeat password"
                  placeholderTextColor="#94a3b8"
                  value={form.confirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={(text) => handleChange("confirmPassword", text)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm"
                />
                <TouchableOpacity 
                  className="absolute right-4 z-10 p-2"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff color="#94a3b8" size={20} /> : <Eye color="#94a3b8" size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              className="flex-row items-center mt-5"
              onPress={() => handleChange("agreed", !form.agreed)}
              activeOpacity={0.7}
            >
              <View className={`w-5 h-5 rounded border items-center justify-center mr-3 ${form.agreed ? 'bg-green-600 border-green-600' : 'bg-white border-slate-300'}`}>
                {form.agreed && <CheckSquare color="white" size={14} />}
              </View>
              <Text className="text-slate-600 text-sm">I agree to the <Text className="text-green-600 font-bold">Terms & Conditions</Text></Text>
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

          <View className="flex-row justify-center items-center mt-8 pb-4">
            <Text className="text-slate-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-green-600 font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
