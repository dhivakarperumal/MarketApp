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
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomTabBar({
    state,
    navigation,
}: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

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
                left: 0,
                right: 0,
                bottom: 0,
                paddingBottom: insets.bottom,

                height: 82 + insets.bottom,

                backgroundColor: "rgba(255,255,255,0.92)",
                borderTopWidth: 1,
                borderColor: "rgba(255,255,255,0.5)",

                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",

                paddingHorizontal: 12,

                elevation: 18,
                shadowColor: "#000",
                shadowOpacity: 0.14,
                shadowRadius: 16,
                shadowOffset: {
                    width: 0,
                    height: 8,
                },
            }}
        >
            {state.routes.map((route, index) => {
                const focused = state.index === index;

                const Icon = getIcon(route.name);

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
                        activeOpacity={0.85}
                        onPress={onPress}
                        style={{
                            flex: focused ? 1.8 : 1,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {focused ? (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    backgroundColor: "#16A34A",

                                    height: 52,

                                    borderRadius: 26,

                                    paddingHorizontal: 18,

                                    minWidth: 110,
                                }}
                            >
                                <Icon
                                    color="#FFFFFF"
                                    size={22}
                                    strokeWidth={2.5}
                                />

                                <Text
                                    style={{
                                        color: "#FFFFFF",
                                        fontSize: 15,
                                        fontWeight: "700",
                                        marginLeft: 8,
                                    }}
                                >
                                    {route.name}
                                </Text>
                            </View>
                        ) : (
                            <Icon
                                color="#94A3B8"
                                size={27}
                                strokeWidth={2.4}
                            />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}