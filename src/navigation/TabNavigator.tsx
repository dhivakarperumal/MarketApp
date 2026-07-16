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
import CustomTabBar from "./CustomTabBar";

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        header: () => <Header title={route.name} />,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "" }}
      />

      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{ tabBarLabel: "" }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarLabel: "" }}
      />

      <Tab.Screen
        name="Combo"
        component={ComboScreen}
        options={{ tabBarLabel: "" }}
      />

      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{ tabBarLabel: "" }}
      />
    </Tab.Navigator>
  );
};
