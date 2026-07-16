import React from "react";
import { View, Text, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Icon from "react-native-vector-icons/Feather";

const { width } = Dimensions.get("window");

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

const features: Feature[] = [
  {
    icon: "truck",
    title: "Fast Delivery",
    desc: "Get your order within 90 mins",
  },
  {
    icon: "shield",
    title: "Fresh & Quality",
    desc: "100% fresh products at best prices",
  },
  {
    icon: "credit-card",
    title: "Secure Payment",
    desc: "100% secure payments",
  },
  {
    icon: "refresh-cw",
    title: "Easy Returns",
    desc: "7 days easy returns",
  },
  {
    icon: "headphones",
    title: "24/7 Support",
    desc: "We are always here to help",
  },
];

export const Features = () => {
  return (
    <View className="py-5 bg-gray-50">
      <Carousel
        loop
        width={width * 0.82}
        height={150}
        autoPlay
        autoPlayInterval={3000}
        data={features}
        pagingEnabled
        snapEnabled
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 60,
        }}
        style={{
          width,
        }}
        renderItem={({ item }) => (
          <View
            className="bg-white rounded-3xl border border-gray-100 mx-2 px-5 py-5 flex-row items-center"
            style={{
              elevation: 5,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <View className="w-16 h-16 rounded-2xl bg-green-100 items-center justify-center">
              <Icon
                name={item.icon}
                size={30}
                color="#15803d"
              />
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-gray-900">
                {item.title}
              </Text>

              <Text className="text-gray-500 text-sm mt-2 leading-5">
                {item.desc}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};