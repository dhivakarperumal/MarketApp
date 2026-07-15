import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
        tabBarActiveTintColor: '#16a34a', // green-600
        tabBarInactiveTintColor: '#94a3b8', // slate-400
        header: () => <Header title={route.name} />,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Home color={color} size={size} />;
          if (route.name === 'Products') return <Package color={color} size={size} />;
          if (route.name === 'Cart') return <ShoppingCart color={color} size={size} />;
          if (route.name === 'Combo') return <Layers color={color} size={size} />;
          if (route.name === 'More') return <Menu color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Combo" component={ComboScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
};
