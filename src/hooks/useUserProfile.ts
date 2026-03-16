import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = 'memorySky_userProfile';

export interface UserProfile {
  name: string;
  createdAt: string;
  dailyCaptureEnabled: boolean;
}

export default function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY)
      .then((data) => {
        if (data) setProfile(JSON.parse(data));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = useCallback(async (updated: UserProfile) => {
    setProfile(updated);
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  }, []);

  const createProfile = useCallback(async (name: string) => {
    const newProfile: UserProfile = {
      name,
      createdAt: new Date().toISOString(),
      dailyCaptureEnabled: false,
    };
    await saveProfile(newProfile);
    return newProfile;
  }, [saveProfile]);

  const updateDailyCapture = useCallback(async (enabled: boolean) => {
    if (!profile) return;
    await saveProfile({ ...profile, dailyCaptureEnabled: enabled });
  }, [profile, saveProfile]);

  const logout = useCallback(async () => {
    setProfile(null);
    await AsyncStorage.removeItem(PROFILE_KEY);
  }, []);

  return { profile, loading, createProfile, updateDailyCapture, logout };
}
