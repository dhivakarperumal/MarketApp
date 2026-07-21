import "./global.css";
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, Image, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
import { AboutScreen } from './src/screens/AboutScreen';
import { Wishlist } from './src/pages/Wishlist';
import { StoreProvider } from './src/context/StoreContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, isLoading, hasSeenOnboarding } = useContext(AuthContext);

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#2F7D5A', '#2B7A57', '#1d503b']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={{ alignItems: 'center', elevation: 12, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } }}>
          <View style={{ width: 110, height: 110, backgroundColor: '#ffffff', borderRadius: 32, justifyContent: 'center', alignItems: 'center' }}>
            <Image 
              source={require('./src/assets/logo.png')} 
              style={{ width: 75, height: 75 }} 
              resizeMode="contain" 
            />
          </View>
        </View>
        <Text style={{ marginTop: 24, fontSize: 32, fontWeight: '900', color: '#ffffff', letterSpacing: 1 }}>MarketApp</Text>
        <Text style={{ marginTop: 6, fontSize: 16, color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>Freshness Delivered</Text>
        <View style={{ position: 'absolute', bottom: 70 }}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </LinearGradient>
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
            <Stack.Screen name="UserProfile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
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
