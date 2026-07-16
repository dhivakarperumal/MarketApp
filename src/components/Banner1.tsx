import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");

const CARD_WIDTH = (width - 48) / 2;

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  button: string;
  image: any;
  colors: string[];
}

const banners: Banner[] = [
  {
    id: 1,
    title: "100% ORGANIC",
    subtitle: "Fresh & Healthy",
    desc: "Farm Fresh Vegetables",
    button: "Shop",
    image: require("../assets/bannersm1.png"),
    colors: ["#ECFDF5", "#BBF7D0"],
  },
  {
    id: 2,
    title: "COMBO",
    subtitle: "More Savings",
    desc: "Best Offers",
    button: "Shop",
    image: require("../assets/banner2.png"),
    colors: ["#FEFCE8", "#FDE68A"],
  },
  {
    id: 3,
    title: "SUPER",
    subtitle: "Top Brands",
    desc: "Best Prices",
    button: "Shop",
    image: require("../assets/bannersm4.png"),
    colors: ["#FFF7ED", "#FED7AA"],
  },
  {
    id: 4,
    title: "FREE",
    subtitle: "Delivery",
    desc: "Above ₹499",
    button: "Order",
    image: require("../assets/withoubgbanner3.png"),
    colors: ["#EFF6FF", "#BFDBFE"],
  },
];

export const Banner1 = () => {
  return (
    <FlatList
      data={banners}
      numColumns={2}
      scrollEnabled={false}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}
      columnWrapperStyle={{
        justifyContent: "space-between",
        marginBottom: 14,
      }}
      renderItem={({ item }) => (
        <LinearGradient
          colors={item.colors}
          style={{
            width: CARD_WIDTH,
            height: 180,
            borderRadius: 22,
            overflow: "hidden",
          }}
        >
          {/* Content */}
          <View className="flex-1 p-4 justify-between">

            <View style={{ width: "58%" }}>
              <Text className="text-sm font-extrabold text-gray-900">
                {item.title}
              </Text>

              <Text className="text-xs font-semibold text-gray-700 mt-1">
                {item.subtitle}
              </Text>

              <Text className="text-[11px] text-gray-500 mt-1">
                {item.desc}
              </Text>

              <TouchableOpacity className="bg-green-600 rounded-full px-3 py-2 mt-3 self-start">
                <Text className="text-white text-xs font-bold">
                  {item.button}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Image */}
            <Image
              source={item.image}
              resizeMode="contain"
              style={{
                position: "absolute",
                right: -8,
                bottom: 0,
                width: CARD_WIDTH * 0.72,
                height: 140,
              }}
            />

            {/* Decorative Circle */}
            <View
              style={{
                position: "absolute",
                right: -30,
                bottom: -30,
                width: 90,
                height: 90,
                borderRadius: 45,
                backgroundColor: "rgba(255,255,255,0.25)",
              }}
            />
          </View>
        </LinearGradient>
      )}
    />
  );
};