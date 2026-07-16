import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from "react-native";
import { HomeScreen } from '../screens/HomeScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { CartScreen } from '../screens/CartScreen';
import { ComboScreen } from '../screens/ComboScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { Header } from '../components/Header';
import { Home, Package, ShoppingCart, Layers, Menu } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Header title={route.name} />,

        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,

        tabBarActiveTintColor: "#16A34A",
        tabBarInactiveTintColor: "#94A3B8",

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 4,
        },

        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 16,
          height: 72,
          borderRadius: 22,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: {
            width: 0,
            height: 8,
          },
        },

        tabBarItemStyle: {
          paddingVertical: 6,
        },

        tabBarIcon: ({ color, focused }) => {
          const size = focused ? 24 : 22;

          let Icon = Home;

          switch (route.name) {
            case "Home":
              Icon = Home;
              break;
            case "Products":
              Icon = Package;
              break;
            case "Cart":
              Icon = ShoppingCart;
              break;
            case "Combo":
              Icon = Layers;
              break;
            case "More":
              Icon = Menu;
              break;
          }

          return (
            <View
              style={{
                width: focused ? 44 : 40,
                height: focused ? 44 : 40,
                borderRadius: 22,
                backgroundColor: focused ? "#DCFCE7" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                size={size}
                color={focused ? "#16A34A" : "#94A3B8"}
                strokeWidth={2.4}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />

      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{ tabBarLabel: "Products" }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarLabel: "Cart" }}
      />

      <Tab.Screen
        name="Combo"
        component={ComboScreen}
        options={{ tabBarLabel: "Combo" }}
      />

      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{ tabBarLabel: "More" }}
      />
    </Tab.Navigator>
  );
};
