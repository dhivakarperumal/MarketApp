import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  Home,
  Package,
  ShoppingCart,
  Layers,
  Menu,
} from "lucide-react-native";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const getIcon = (routeName: string) => {
    switch (routeName) {
      case "Home":
        return Home;
      case "Products":
        return Package;
      case "Cart":
        return ShoppingCart;
      case "Combo":
        return Layers;
      case "More":
        return Menu;
      default:
        return Home;
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 16,
        backgroundColor: "#fff",
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingVertical: 12,
        elevation: 12,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: {
          width: 0,
          height: 8,
        },
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const Icon = getIcon(route.name);

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.85}
            onPress={onPress}
            style={{
              flex: focused ? 1.6 : 1,
              alignItems: "center",
            }}
          >
            {focused ? (
              <View
                style={{
                  backgroundColor: "#16A34A",
                  borderRadius: 25,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon color="#fff" size={20} />

                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    marginLeft: 8,
                    fontSize: 14,
                  }}
                >
                  {route.name}
                </Text>
              </View>
            ) : (
              <Icon
                color="#94A3B8"
                size={24}
                strokeWidth={2.3}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}