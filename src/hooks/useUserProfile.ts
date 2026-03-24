import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Memory } from '../types/Memory';

const PROFILE_KEY = 'memorySky_userProfile';
const MEMORIES_KEY = 'memorySky_memories';
const BIRTHDAY_MEMORY_ID = 'birthday-star';

export interface UserProfile {
  name: string;
  birthday: string; // ISO date string
  createdAt: string;
  dailyCaptureEnabled: boolean;
  avatarUrl?: string;
}

export default function useUserProfile(session: Session | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fetchedForUid, setFetchedForUid] = useState<string | null>(null);

  // Loading is true whenever we haven't fetched for the current session yet
  const loading = session ? fetchedForUid !== session.user.id : false;

  // Load profile from Supabase when session changes
  useEffect(() => {
    if (!session) {
      setProfile(null);
      setFetchedForUid(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from('profiles')
          .select('name, birthday, daily_capture_time, created_at, avatar_url')
          .eq('id', session.user.id)
          .single();

        if (!cancelled && data && !error) {
          const p: UserProfile = {
            name: data.name,
            birthday: data.birthday ? new Date(data.birthday).toISOString() : '',
            createdAt: data.created_at,
            dailyCaptureEnabled: !!data.daily_capture_time,
            avatarUrl: data.avatar_url ?? undefined,
          };
          setProfile(p);
          // Cache locally
          await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));

          // Ensure birthday star exists in Supabase
          if (data.birthday && data.name) {
            const { data: existing } = await supabase
              .from('memories')
              .select('id')
              .eq('id', BIRTHDAY_MEMORY_ID)
              .eq('user_id', session.user.id)
              .single();
            if (!existing) {
              await createBirthdayMemory(data.name, new Date(data.birthday), session.user.id);
            }
          }
        } else if (!cancelled) {
          // Fallback to local cache
          const local = await AsyncStorage.getItem(PROFILE_KEY);
          if (local) setProfile(JSON.parse(local));
        }
      } catch {
        // Fallback to local cache
        if (!cancelled) {
          const local = await AsyncStorage.getItem(PROFILE_KEY);
          if (local) setProfile(JSON.parse(local));
        }
      } finally {
        if (!cancelled) setFetchedForUid(session.user.id);
      }
    })();

    return () => { cancelled = true; };
  }, [session?.user?.id]);

  const createBirthdayMemory = useCallback(async (name: string, birthday: Date, userId: string) => {
    const birthdayMemory: Memory = {
      id: BIRTHDAY_MEMORY_ID,
      title: `${name} was born`,
      date: birthday,
      description: 'The first star in your galaxy — the day it all began.',
      emotion: 'grateful',
      category: 'milestone',
      importance: 5,
    };

    // Save to local cache
    const existing = await AsyncStorage.getItem(MEMORIES_KEY);
    const memories: Memory[] = existing ? JSON.parse(existing) : [];
    if (!memories.find((m: Memory) => m.id === BIRTHDAY_MEMORY_ID)) {
      const updated = [birthdayMemory, ...memories];
      await AsyncStorage.setItem(MEMORIES_KEY, JSON.stringify(updated));
    }

    // Save to Supabase
    const { error } = await supabase.from('memories').upsert({
      id: BIRTHDAY_MEMORY_ID,
      user_id: userId,
      title: birthdayMemory.title,
      date: birthday.toISOString(),
      description: birthdayMemory.description,
      emotion: birthdayMemory.emotion,
      category: birthdayMemory.category,
      importance: birthdayMemory.importance,
      hidden: false,
    }, { onConflict: 'id' });

    if (error) console.warn('Failed to save birthday memory to Supabase:', error.message);
  }, []);

  const createProfile = useCallback(async (name: string, birthday: Date) => {
    if (!session) return;

    const newProfile: UserProfile = {
      name,
      birthday: birthday.toISOString(),
      createdAt: new Date().toISOString(),
      dailyCaptureEnabled: false,
    };

    // Save to Supabase
    await supabase.from('profiles').upsert({
      id: session.user.id,
      name,
      birthday: birthday.toISOString().split('T')[0],
    });

    // Save birthday memory locally and to Supabase
    await createBirthdayMemory(name, birthday, session.user.id);

    // Cache locally and update state
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
    setProfile(newProfile);

    return newProfile;
  }, [session, createBirthdayMemory]);

  const updateDailyCapture = useCallback(async (enabled: boolean) => {
    if (!profile || !session) return;
    const updated = { ...profile, dailyCaptureEnabled: enabled };
    setProfile(updated);
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));

    await supabase.from('profiles').update({
      daily_capture_time: enabled ? '09:00' : null,
    }).eq('id', session.user.id);
  }, [profile, session]);

  const updateAvatar = useCallback(async (localUri: string) => {
    if (!profile || !session) return;

    try {
      const ext = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
      const path = `${session.user.id}/avatar.${ext}`;

      const response = await fetch(localUri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(path, arrayBuffer, {
          contentType: `image/${ext === 'png' ? 'png' : 'jpeg'}`,
          upsert: true,
        });

      if (uploadErr) {
        console.warn('Avatar upload failed:', uploadErr.message);
        return;
      }

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', session.user.id);

      const updated = { ...profile, avatarUrl };
      setProfile(updated);
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Avatar update failed:', err);
    }
  }, [profile, session]);

  const logout = useCallback(async () => {
    setProfile(null);
    await AsyncStorage.removeItem(PROFILE_KEY);
  }, []);

  return { profile, loading, createProfile, updateDailyCapture, updateAvatar, logout };
}
