import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import LinearGradient from "react-native-linear-gradient";
import { ArrowRight } from "lucide-react-native";

const { width } = Dimensions.get("window");

const banners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    title: "Fresh Vegetables",
    subtitle: "Delivered to your doorstep",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=1200&q=80",
    title: "Organic Fruits",
    subtitle: "Healthy & Naturally Fresh",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1200&q=80",
    title: "Daily Grocery",
    subtitle: "Best Price Every Day",
  },
];

export const Hero = () => {
  return (
    <View
      style={{
        height: 300,
        zIndex: 10,
        elevation: 10,
      }}
    >
      <Swiper
        autoplay
        autoplayTimeout={4}
        loop
        showsButtons={false}
        dotColor="#ffffff88"
        activeDotColor="#22c55e"
      >
        {banners.map((item) => (
          <ImageBackground
            key={item.id}
            source={{ uri: item.image }}
            style={{
              width,
              height: 300,
              justifyContent: "center",
            }}
          >
            <LinearGradient
              colors={[
                "rgba(0,0,0,0.55)",
                "rgba(0,0,0,0.35)",
                "rgba(0,0,0,0.65)",
              ]}
              style={{
                flex: 1,
                justifyContent: "center",
                paddingHorizontal: 25,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 34,
                  fontWeight: "800",
                }}
              >
                {item.title}
              </Text>

              <Text
                style={{
                  color: "#fff",
                  fontSize: 17,
                  marginTop: 10,
                }}
              >
                {item.subtitle}
              </Text>

              <TouchableOpacity
                style={{
                  marginTop: 25,
                  backgroundColor: "#16a34a",
                  paddingHorizontal: 22,
                  paddingVertical: 14,
                  borderRadius: 30,
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    marginRight: 8,
                  }}
                >
                  Shop Now
                </Text>

                <ArrowRight color="white" size={18} />
              </TouchableOpacity>
            </LinearGradient>
          </ImageBackground>
        ))}
      </Swiper>
    </View>
  );
};