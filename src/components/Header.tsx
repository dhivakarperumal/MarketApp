import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  Heart,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const navigation = useNavigation<any>();
  const { user, logout } = useContext(AuthContext);

  const userInitial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "G";

  const currentHour = new Date().getHours();

  let greeting = "Good Evening 🌙";
  let greetingIcon = "🌙";

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning ";
    greetingIcon = "☀️";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon ";
    greetingIcon = "🌤️";
  } else if (currentHour >= 17 && currentHour < 21) {
    greeting = "Good Evening ";
    greetingIcon = "🌇";
  } else {
    greeting = "Good Night ";
    greetingIcon = "🌙";
  }

  const displayName = user?.username || "Guest";

  return (
    <>
      <SafeAreaView edges={["top"]} className="bg-green-600" />

      <LinearGradient
        colors={["#16A34A", "#22C55E", "#34D399"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="overflow-hidden"
      >
        {/* Decorative Background */}
        <View className="absolute -top-16 -right-12 w-44 h-44 rounded-full bg-white/10" />
        <View className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/10" />
        <View className="absolute top-8 right-28 w-3 h-3 rounded-full bg-white/30" />
        <View className="absolute top-14 right-36 w-2 h-2 rounded-full bg-white/20" />
        <View className="absolute bottom-6 left-24 w-2 h-2 rounded-full bg-white/25" />

        <View className="px-5 pt-4 pb-3 flex-row justify-between items-center">
          {/* Left */}
          <View className="flex-1 flex-row items-center">

            {/* Logo */}
            <Image
              source={require("../assets/logo.png")} // Change to your logo path
              className="w-16 h-16 mr-3"
              resizeMode="contain"
            />

            {/* Title */}
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-base">{greetingIcon}</Text>

                <Text className="text-white/90 text-sm ml-1 font-medium">
                  {greeting}, {displayName}
                </Text>
              </View>

              <Text className="text-white text-[20px] font-extrabold">
                {title}
              </Text>

            </View>

          </View>

          {/* Right */}
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.navigate("Wishlist")}
              className="w-11 h-11 rounded-full bg-white/90 items-center justify-center mr-3"
            >
              <Heart size={22} color="#16A34A" strokeWidth={2.5} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              className="w-12 h-12 rounded-full bg-white items-center justify-center"
            >
              <Text className="text-green-700 text-lg font-bold">
                {userInitial}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Profile Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View
            className="absolute top-28 right-4 w-56 bg-white rounded-3xl overflow-hidden border border-gray-100"
            style={{
              elevation: 12,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 15,
              shadowOffset: {
                width: 0,
                height: 8,
              },
            }}
          >
            {/* User Info */}
            <View className="px-5 py-4 bg-green-50">
              <Text className="text-green-700 text-base font-bold">
                {user?.username || "Guest"}
              </Text>

              <Text className="text-gray-500 text-xs mt-1">
                Welcome back 👋
              </Text>
            </View>

            {/* Profile */}
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100"
              onPress={() => {
                setMenuVisible(false);
                console.log("Profile");
              }}
            >
              <View className="flex-row items-center">
                <User size={20} color="#16A34A" />
                <Text className="ml-3 text-gray-800 text-[15px] font-semibold">
                  Profile
                </Text>
              </View>

              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-row items-center justify-between px-5 py-4"
              onPress={async () => {
                setMenuVisible(false);
                await logout();
              }}
            >
              <View className="flex-row items-center">
                <LogOut size={20} color="#EF4444" />
                <Text className="ml-3 text-red-500 text-[15px] font-semibold">
                  Logout
                </Text>
              </View>

              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};