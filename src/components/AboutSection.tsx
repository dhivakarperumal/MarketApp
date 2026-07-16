import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  About: undefined;
};

type AboutSectionProps = {
  navigation?: NativeStackNavigationProp<RootStackParamList>;
};

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const features: Feature[] = [
  {
    title: "Best Prices",
    description:
      "Enjoy daily deals, exclusive discounts, and unbeatable grocery prices.",
    icon: "tags",
  },
  {
    title: "Fast Delivery",
    description:
      "Same-day delivery with secure packaging to keep your groceries fresh.",
    icon: "shipping-fast",
  },
  {
    title: "Farm Fresh",
    description:
      "Fresh fruits and vegetables sourced directly from trusted local farms every day.",
    icon: "leaf",
  },
  {
    title: "Quality Assured",
    description:
      "Every product is carefully inspected to ensure premium quality before delivery.",
    icon: "shield-alt",
  },
];

export const AboutSection: React.FC<AboutSectionProps> = ({
  navigation,
}) => {
  return (
    <ScrollView
      className="flex-1 bg-green-50"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-5 py-6">
        {/* Image */}
        <View className="relative">
          <Image
            source={require("../assets/aboutimagesupermarket.png")}
            className="w-full h-72 rounded-3xl"
            resizeMode="cover"
          />

          {/* Floating Badge */}
          <View className="absolute bottom-4 left-4 bg-green-600 px-5 py-3 rounded-2xl">
            <Text className="text-white text-2xl font-bold">10+</Text>
            <Text className="text-white text-xs">
              Years Serving Freshness
            </Text>
          </View>
        </View>

        {/* Badge */}
        <View className="self-start mt-8 bg-green-100 px-4 py-2 rounded-full">
          <Text className="text-green-700 font-semibold text-xs">
            🌿 Fresh • Healthy • Affordable
          </Text>
        </View>

        {/* Heading */}
        <Text className="text-3xl font-extrabold text-gray-900 mt-5 leading-10">
          Where Freshness Meets Convenience
        </Text>

        <Text className="text-gray-500 text-base mt-4 leading-7">
          We deliver fresh groceries, vegetables, fruits, dairy products,
          snacks, and household essentials directly to your doorstep with
          premium quality and affordable prices.
        </Text>

        {/* Features */}
        <View className="mt-8">
          {features.map((item) => (
            <View
              key={item.title}
              className="bg-white rounded-3xl p-5 mb-4 border border-green-100"
              style={{
                elevation: 4,
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 3 },
              }}
            >
              <View className="flex-row">
                <View className="w-14 h-14 rounded-2xl bg-green-600 items-center justify-center">
                  <Icon
                    name={item.icon}
                    size={22}
                    color="#fff"
                  />
                </View>

                <View className="flex-1 ml-4">
                  <Text className="text-lg font-bold text-gray-900">
                    {item.title}
                  </Text>

                  <Text className="text-gray-500 mt-2 leading-6">
                    {item.description}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          className="bg-green-600 rounded-2xl py-4 items-center mt-2 mb-8"
          onPress={() => navigation?.navigate("About")}
        >
          <Text className="text-white text-lg font-bold">
            Explore More
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};