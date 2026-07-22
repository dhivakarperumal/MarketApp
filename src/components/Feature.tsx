import React, { useEffect, useRef, useState } from "react";
import {
  Truck,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Headphones,
} from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  View,
  Text,
  FlatList,
  Dimensions,
} from "react-native";

const features = [
  {
    Icon: Truck,
    title: "Fast Delivery",
    desc: "Delivered within 90 minutes",
    colors: ["#EEFDF4", "#D9FBE7"],
    iconColor: "#16A34A",
  },
  {
    Icon: ShieldCheck,
    title: "Fresh Quality",
    desc: "100% Fresh & Organic Products",
    colors: ["#F0F8FF", "#DCEEFF"],
    iconColor: "#2563EB",
  },
  {
    Icon: CreditCard,
    title: "Secure Payment",
    desc: "Safe Online Payments",
    colors: ["#FFF9E8", "#FFEFC2"],
    iconColor: "#D97706",
  },
  {
    Icon: RotateCcw,
    title: "Easy Returns",
    desc: "7 Days Easy Returns",
    colors: ["#FFF3F8", "#FFDDEB"],
    iconColor: "#DB2777",
  },
  {
    Icon: Headphones,
    title: "24/7 Support",
    desc: "Always Ready to Help",
    colors: ["#F7F3FF", "#E8DEFF"],
    iconColor: "#7C3AED",
  },
];

const { width } = Dimensions.get("window");

interface Feature {
  Icon: any;
  title: string;
  desc: string;
  colors: string[];
  iconColor: string;
}

export const Features = () => {
  const flatListRef = useRef<FlatList<typeof features[0]>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % features.length;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [activeIndex]);

  return (
    <View className="py-6 bg-gray-50">

      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        data={features}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: 0,
        }}
        renderItem={({ item }) => {
          const Icon = item.Icon;

          return (
            <View
              style={{
                width: width, // Full screen width to ensure only one card is shown with paging
                paddingHorizontal: 10,
              }}
            >
              <LinearGradient
                colors={item.colors as [string, string]}
                style={{
                  flex: 1,
                  height: 165,
                  borderRadius: 28,
                  padding: 20,
                  justifyContent: "space-between",
                }}
              >
                <View className="flex-row items-center">
                  <View
                    style={{
                      width: 65,
                      height: 65,
                      borderRadius: 20,
                      backgroundColor: "#fff",
                      justifyContent: "center",
                      alignItems: "center",
                      elevation: 4,
                    }}
                  >
                    <Icon
                      size={32}
                      color={item.iconColor}
                      strokeWidth={2.3}
                    />
                  </View>

                  <View className="ml-4 flex-1">
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#1F2937",
                      }}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={{
                        marginTop: 8,
                        fontSize: 14,
                        color: "#6B7280",
                        lineHeight: 22,
                      }}
                    >
                      {item.desc}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    alignSelf: "flex-end",
                    backgroundColor: "#fff",
                    paddingHorizontal: 15,
                    paddingVertical: 8,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      color: item.iconColor,
                      fontWeight: "700",
                    }}
                  >
                    Learn More →
                  </Text>
                </View>
              </LinearGradient>
            </View>
          );
        }}
      />

    </View>
  );
};