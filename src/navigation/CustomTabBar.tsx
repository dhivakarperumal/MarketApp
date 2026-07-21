import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  Home,
  Package,
  Search,
  ShoppingCart,
  User,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_CONFIG: Record<string, { icon: any; label: string }> = {
  Home:     { icon: Home,         label: "Home"     },
  Products: { icon: Package,      label: "Products" },
  Search:   { icon: Search,       label: "Search"   },
  Cart:     { icon: ShoppingCart, label: "Cart"     },
  Profile:  { icon: User,         label: "Profile"  },
};

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 64 + insets.bottom,
        paddingBottom: insets.bottom,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 4,
        elevation: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -4 },
      }}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const cfg = TAB_CONFIG[route.name] ?? { icon: Home, label: route.name };
        const Icon = cfg.icon;

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

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.8}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 6,
            }}>
            {focused ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#16A34A",
                  height: 48,
                  width: 48,
                  borderRadius: 24,
                }}>
                <Icon color="#FFFFFF" size={24} strokeWidth={2.5} />
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <Icon color="#94A3B8" size={22} strokeWidth={2} style={{ marginBottom: 3 }} />
                <Text
                  style={{
                    color: "#94A3B8",
                    fontSize: 11,
                    fontWeight: "500",
                  }}>
                  {cfg.label}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}