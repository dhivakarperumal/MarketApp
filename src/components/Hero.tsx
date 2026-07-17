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
        autoplayTimeout={10}
        showsPagination={false}
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
                "rgba(0,0,0,0.30)",
                "rgba(0,0,0,0.15)",
                "rgba(0,0,0,0.35)",
              ]}
              style={{
                flex: 1,
                justifyContent: "center",
                paddingHorizontal: 25,
              }}
            >
              <View style={{ maxWidth: width * 0.75 }}>
                {/* <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: "rgba(22,163,74,0.95)",
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 20,
                    marginBottom: 14,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: "700",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Fresh & Healthy
                  </Text>
                </View> */}

                <Text
                  style={{
                    color: "#fff",
                    fontSize: 38,
                    fontWeight: "900",
                    lineHeight: 44,
                    letterSpacing: -1,
                    textShadowColor: "rgba(0,0,0,0.35)",
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 8,
                  }}
                >
                  {item.title}
                </Text>

                <Text
                  style={{
                    color: "rgba(255,255,255,0.95)",
                    fontSize: 17,
                    lineHeight: 26,
                    marginTop: 14,
                    textShadowColor: "rgba(0,0,0,0.25)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  {item.subtitle}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={{
                    marginTop: 28,
                    backgroundColor: "#16a34a",
                    paddingHorizontal: 24,
                    paddingVertical: 14,
                    borderRadius: 30,
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#16a34a",
                    shadowOpacity: 0.35,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 6,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "800",
                      fontSize: 16,
                      marginRight: 8,
                    }}
                  >
                    Shop Now
                  </Text>

                  <ArrowRight color="#fff" size={18} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        ))}
      </Swiper>
    </View>
  );
};