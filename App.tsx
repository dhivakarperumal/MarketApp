import "./global.css";
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TabNavigator } from './src/navigation/TabNavigator';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';

import { ProfileScreen } from './src/screens/ProfileScreen';
import { OrdersScreen } from './src/screens/OrdersScreen';
import { WishlistScreen } from './src/screens/WishlistScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { HelpSupportScreen } from './src/screens/HelpSupportScreen';
import { Wishlist } from './src/pages/Wishlist';
import { StoreProvider } from './src/context/StoreContext';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    // Return null or a splash screen while checking async storage
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
              name="Wishlist"
              component={Wishlist}
            />
          </>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
            <Stack.Screen name="Wishlist" component={WishlistScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StoreProvider>
          <RootNavigator />
        </StoreProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
