import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from './src/types/Navigation';
import useUserProfile from './src/hooks/useUserProfile';
import useDailyCapture from './src/hooks/useDailyCapture';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import GalaxyScreen from './src/screens/GalaxyScreen';
import CaptureScreen from './src/screens/CaptureScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function App() {
  const { profile, loading, createProfile, updateDailyCapture, logout } = useUserProfile();
  useDailyCapture(navigationRef);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#050510', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#c060d0" size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <LoginScreen onLogin={createProfile} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }} initialRouteName="Galaxy">
            <Stack.Screen name="Home">
              {(props) => <HomeScreen {...props} userName={profile.name} />}
            </Stack.Screen>
            <Stack.Screen name="Galaxy" component={GalaxyScreen} />
            <Stack.Screen name="Capture" component={CaptureScreen} />
            <Stack.Screen name="Profile">
              {(props) => (
                <ProfileScreen
                  {...props}
                  profile={profile}
                  onUpdateDailyCapture={updateDailyCapture}
                  onLogout={logout}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
