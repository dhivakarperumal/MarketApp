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
const CARD_WIDTH = width - 32;

export default function BannerSection({ banners }) {
  return (
    <FlatList
      data={banners}
      scrollEnabled={false}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}
      renderItem={({ item }) => (
        <LinearGradient
          colors={item.colors}
          style={{
            width: CARD_WIDTH,
            height: 200,
            borderRadius: 24,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          <View className="flex-1 p-5 justify-center">

            <View style={{ width: "55%" }}>
              <Text className="text-xl font-extrabold text-gray-900">
                {item.title}
              </Text>

              <Text className="text-base font-semibold text-gray-700 mt-2">
                {item.subtitle}
              </Text>

              <Text className="text-sm text-gray-600 mt-2">
                {item.desc}
              </Text>

              <TouchableOpacity className="bg-green-600 rounded-full px-5 py-3 mt-5 self-start">
                <Text className="text-white font-bold">
                  {item.button}
                </Text>
              </TouchableOpacity>
            </View>

            <Image
              source={item.image}
              resizeMode="contain"
              style={{
                position: "absolute",
                right: 5,
                bottom: 0,
                width: CARD_WIDTH * 0.48,
                height: 180,
              }}
            />

            <View
              style={{
                position: "absolute",
                right: -40,
                bottom: -40,
                width: 130,
                height: 130,
                borderRadius: 60,
                backgroundColor: "rgba(255,255,255,0.25)",
              }}
            />

          </View>
        </LinearGradient>
      )}
    />
  );
}