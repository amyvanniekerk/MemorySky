import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation';
import { colors } from '../theme/colors';
import { UserProfile } from '../hooks/useUserProfile';
import {
  requestNotificationPermissions,
  setDailyCaptureEnabled,
} from '../utils/dailyNotification';
import ProfileAvatar from '../components/shared/ProfileAvatar';
import DailyCaptureToggle from '../components/profile/DailyCaptureToggle';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'> & {
  profile: UserProfile;
  onUpdateDailyCapture: (enabled: boolean) => Promise<void>;
  onLogout: () => Promise<void>;
};

export default function ProfileScreen({ navigation, profile, onUpdateDailyCapture, onLogout }: Props) {
  const [dailyCapture, setDailyCapture] = useState(profile.dailyCaptureEnabled);

  const handleToggleDailyCapture = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          'Notifications Disabled',
          'Enable notifications in your device settings to receive daily capture reminders.',
        );
        return;
      }
    }
    setDailyCapture(value);
    await setDailyCaptureEnabled(value);
    await onUpdateDailyCapture(value);
  };

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handleLogout = () => {
    Alert.alert('Sign Out', 'This will remove your profile. Your memories will be kept.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: onLogout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <ProfileAvatar name={profile.name} size={80} />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.memberSince}>Stargazer since {memberSince}</Text>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <DailyCaptureToggle
          enabled={dailyCapture}
          onToggle={handleToggleDailyCapture}
        />
      </View>

      {/* Sign out */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backText: {
    fontSize: 16,
    color: colors.teal,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 50,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: colors.textMuted,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  logoutButton: {
    backgroundColor: 'rgba(230, 57, 70, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(230, 57, 70, 0.25)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E63946',
  },
});
