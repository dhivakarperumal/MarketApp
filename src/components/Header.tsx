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
import { Heart, Sun } from "lucide-react-native";
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

  return (
    <>
      <SafeAreaView edges={["top"]} className="bg-green-600" />

      <LinearGradient
        colors={["#16A34A", "#22C55E", "#34D399"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-b-[30px] overflow-hidden"
      >
        {/* Decorative Background */}
        <View className="absolute -top-16 -right-12 w-44 h-44 rounded-full bg-white/10" />
        <View className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/10" />
        <View className="absolute top-8 right-28 w-3 h-3 rounded-full bg-white/30" />
        <View className="absolute top-14 right-36 w-2 h-2 rounded-full bg-white/20" />
        <View className="absolute bottom-6 left-24 w-2 h-2 rounded-full bg-white/25" />

        <View className="px-5 pt-4 pb-6 flex-row justify-between items-center">
          {/* Left */}
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
                <Sun size={14} color="#FDE047" />
                <Text className="text-white/90 text-xs ml-2 font-medium">
                  Good Morning 👋
                </Text>
              </View>

              <Text className="text-white text-[20px] font-extrabold">
                {title}
              </Text>

              <Text className="text-white/80 text-xs mt-1">
                Fresh • Healthy • Affordable
              </Text>
            </View>

          </View>

          {/* Right */}
          <View className="flex-row items-center">
            {/* Wishlist */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Wishlist")}
              activeOpacity={0.8}
              className="w-11 h-11 rounded-full bg-white/20 border border-white/30 items-center justify-center mr-3"
            >
              <Heart size={22} color="white" />
            </TouchableOpacity>

            {/* Profile */}
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              activeOpacity={0.8}
              className="w-12 h-12 rounded-full bg-white/25 border border-white/40 items-center justify-center"
            >
              <Text className="text-white text-lg font-bold">
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
          <View className="flex-1">
            <TouchableWithoutFeedback>
              <View className="absolute top-20 right-4 bg-white rounded-2xl w-44 overflow-hidden shadow-xl">

                <TouchableOpacity
                  className="px-5 py-4 border-b border-gray-100"
                  onPress={() => {
                    setMenuVisible(false);
                    console.log("Profile");
                  }}
                >
                  <Text className="text-gray-700 text-base font-semibold">
                    👤 Profile
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="px-5 py-4"
                  onPress={async () => {
                    setMenuVisible(false);
                    await logout();
                  }}
                >
                  <Text className="text-red-500 text-base font-bold">
                    🚪 Logout
                  </Text>
                </TouchableOpacity>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};