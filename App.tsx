import 'react-native-get-random-values';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from './src/types/Navigation';
import useAuth from './src/hooks/useAuth';
import useUserProfile from './src/hooks/useUserProfile';
import useDailyCapture from './src/hooks/useDailyCapture';
import LoadingScreen from './src/components/shared/LoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import GalaxyScreen from './src/screens/GalaxyScreen';
import CaptureScreen from './src/screens/CaptureScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

const navTheme = {
  dark: true,
  colors: {
    primary: '#c060d0',
    background: '#050510',
    card: '#050510',
    text: '#fff',
    border: '#050510',
    notification: '#c060d0',
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '800' as const },
  },
};

type AuthView = 'login' | 'signup';

export default function App() {
  const { session, loading: authLoading, signUp, signIn, signOut, resetPassword } = useAuth();
  const { profile, loading: profileLoading, createProfile, updateDailyCapture, updateAvatar, logout } = useUserProfile(session);
  useDailyCapture(navigationRef);

  const [authView, setAuthView] = useState<AuthView>('signup');

  const loading = authLoading || profileLoading;

  const handleLogout = async () => {
    await signOut();
    await logout();
  };

  // Determine what to show
  const showLoading = loading;
  const showAuth = !loading && !session;
  const showOnboarding = !loading && session && !profile;
  const showApp = !loading && session && !!profile;

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" />

      {showLoading && <LoadingScreen />}

      {showAuth && (
        authView === 'login' ? (
          <LoginScreen
            onSignIn={signIn}
            onResetPassword={resetPassword}
            onSwitchToSignup={() => setAuthView('signup')}
          />
        ) : (
          <SignupScreen
            onSignUp={signUp}
            onComplete={createProfile}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )
      )}

      {showOnboarding && (
        <SignupScreen
          onSignUp={signUp}
          onComplete={createProfile}
          onSwitchToLogin={() => setAuthView('login')}
          startStep="name"
        />
      )}

      {showApp && (
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef} theme={navTheme as any}>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: styles.root,
              }}
              initialRouteName="Galaxy"
            >
              <Stack.Screen name="Home">
                {(props) => <HomeScreen {...props} userName={profile.name} avatarUrl={profile.avatarUrl} />}
              </Stack.Screen>
              <Stack.Screen name="Galaxy" component={GalaxyScreen} />
              <Stack.Screen name="Capture" component={CaptureScreen} />
              <Stack.Screen name="Profile">
                {(props) => (
                  <ProfileScreen
                    {...props}
                    profile={profile}
                    onUpdateDailyCapture={updateDailyCapture}
                    onUpdateAvatar={updateAvatar}
                    onLogout={handleLogout}
                  />
                )}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050510',
  },
});
