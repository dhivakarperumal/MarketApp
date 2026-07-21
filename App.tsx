import "./global.css";
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { TabNavigator } from './src/navigation/TabNavigator';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';
import { OnboardingScreen } from './src/screens/auth/OnboardingScreen';

import { ProfileScreen } from './src/screens/ProfileScreen';
import { EditProfileScreen } from './src/screens/EditProfileScreen';
import { OrdersScreen } from './src/screens/OrdersScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { HelpSupportScreen } from './src/screens/HelpSupportScreen';
import { Wishlist } from './src/pages/Wishlist';
import { StoreProvider } from './src/context/StoreContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, isLoading, hasSeenOnboarding } = useContext(AuthContext);

  if (isLoading) {
    // Show loading spinner while checking async storage
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasSeenOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : user ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="Wishlist" component={Wishlist} />
            <Stack.Screen name="ProductDetails" component={require('./src/screens/ProductDetails').default} />
            <Stack.Screen name="Checkout" component={require('./src/screens/CheckoutScreen').default} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="Addresses" component={require('./src/screens/AddressScreen').AddressScreen} />
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
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <StoreProvider>
            <RootNavigator />
            <Toast />
          </StoreProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;
