import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Memory } from '../types/Memory';

const PROFILE_KEY = 'memorySky_userProfile';
const MEMORIES_KEY = 'memorySky_memories';
const BIRTHDAY_MEMORY_ID = 'birthday-star';

export interface UserProfile {
  name: string;
  birthday: string; // ISO date string
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

  const createBirthdayMemory = useCallback(async (name: string, birthday: Date) => {
    const birthdayMemory: Memory = {
      id: BIRTHDAY_MEMORY_ID,
      title: `${name} was born`,
      date: birthday,
      description: 'The first star in your galaxy — the day it all began.',
      emotion: 'grateful',
      category: 'milestone',
      importance: 5,
    };

    // Load existing memories, prepend birthday if not already there
    const existing = await AsyncStorage.getItem(MEMORIES_KEY);
    const memories: Memory[] = existing ? JSON.parse(existing) : [];
    if (!memories.find((m: Memory) => m.id === BIRTHDAY_MEMORY_ID)) {
      const updated = [birthdayMemory, ...memories];
      await AsyncStorage.setItem(MEMORIES_KEY, JSON.stringify(updated));
    }
  }, []);

  const createProfile = useCallback(async (name: string, birthday: Date) => {
    const newProfile: UserProfile = {
      name,
      birthday: birthday.toISOString(),
      createdAt: new Date().toISOString(),
      dailyCaptureEnabled: false,
    };
    await saveProfile(newProfile);
    await createBirthdayMemory(name, birthday);
    return newProfile;
  }, [saveProfile, createBirthdayMemory]);

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
