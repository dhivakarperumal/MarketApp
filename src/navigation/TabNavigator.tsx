import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen }      from '../screens/HomeScreen';
import { ProductsScreen }  from '../screens/ProductsScreen';
import { SearchScreen }    from '../screens/SearchScreen';
import { CartScreen }      from '../screens/CartScreen';
import { MoreScreen }      from '../screens/MoreScreen';
import { Header }          from '../components/Header';
import CustomTabBar        from './CustomTabBar';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        header: () => <Header title={route.name} />,
      })}>

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: '' }}
      />

      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{ tabBarLabel: '' }}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: '' }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarLabel: '' }}
      />

      <Tab.Screen
        name="Profile"
        component={MoreScreen}
        options={{ tabBarLabel: '' }}
      />

    </Tab.Navigator>
  );
};
