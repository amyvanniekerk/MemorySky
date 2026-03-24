import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { Memory } from '../types/Memory';
import {
  STORAGE_KEY,
  isLocalUri,
  isRemoteUri,
  uploadPhoto,
  deletePhoto,
  parseLocalMemories,
  rowToMemory,
  memoryToRow,
  cacheLocally,
} from '../utils/memorySync';

export default function useMemoryStorage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [userId, setUserId] = useState<string | undefined>();
  const prevRef = useRef<Memory[]>([]);
  const migrationDoneRef = useRef(false);
  const savingRef = useRef(false);

  // Get current user ID from Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => setUserId(s?.user?.id)
    );
    return () => subscription.unsubscribe();
  }, []);

  const loadFromLocal = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = parseLocalMemories(data);
        setMemories(parsed);
        prevRef.current = parsed;
      }
    } catch (err) {
      console.warn('Failed to load local memories:', err);
    }
  }, []);

  const loadFromSupabase = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.warn('Supabase load failed, using local cache:', error.message);
        await loadFromLocal();
        return;
      }

      const remoteMems = (data ?? []).map(rowToMemory);

      // Migrate local-only memories once per session
      let localOnly: Memory[] = [];
      if (!migrationDoneRef.current) {
        migrationDoneRef.current = true;
        try {
          const localData = await AsyncStorage.getItem(STORAGE_KEY);
          if (localData) {
            const remoteIds = new Set(remoteMems.map((m) => m.id));
            const localMems = parseLocalMemories(localData);
            localOnly = localMems.filter((m) => !remoteIds.has(m.id));
          }
        } catch { /* ignore */ }

        if (localOnly.length > 0 && userId) {
          for (const m of localOnly) {
            if (isLocalUri(m.photoUri)) {
              const remoteUrl = await uploadPhoto(userId, m.id, m.photoUri!);
              if (remoteUrl) m.photoUri = remoteUrl;
            }
          }
          const rows = localOnly.map((m) => memoryToRow(m, userId));
          const { error: upsertErr } = await supabase
            .from('memories')
            .upsert(rows, { onConflict: 'id' });
          if (upsertErr) {
            console.warn('Local migration failed:', upsertErr.message);
          }
        }
      }

      const mems = localOnly.length > 0
        ? [...remoteMems, ...localOnly].sort((a, b) => b.date.getTime() - a.date.getTime())
        : remoteMems;
      setMemories(mems);
      prevRef.current = mems;
      await cacheLocally(mems);
    } catch (err) {
      console.warn('Supabase load failed, using local cache:', err);
      await loadFromLocal();
    }
  }, [userId, loadFromLocal]);

  // Real-time subscription — reload when another device changes memories
  const loadRef = useRef(loadFromSupabase);
  loadRef.current = loadFromSupabase;

  useEffect(() => {
    if (!userId) return;

    let debounceTimer: ReturnType<typeof setTimeout>;
    const channel = supabase
      .channel('memories-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'memories', filter: `user_id=eq.${userId}` },
        () => {
          // Skip reload if we just saved (self-triggered event)
          if (savingRef.current) return;
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => loadRef.current(), 500);
        }
      )
      .subscribe();

    return () => {
      clearTimeout(debounceTimer);
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const reload = useCallback(async () => {
    if (userId) {
      await loadFromSupabase();
    } else {
      await loadFromLocal();
    }
  }, [userId, loadFromSupabase, loadFromLocal]);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = useCallback(
    async (mems: Memory[]) => {
      setMemories(mems);
      await cacheLocally(mems);

      if (!userId) return;
      savingRef.current = true;

      const prev = prevRef.current;
      prevRef.current = mems;

      const prevIds = new Set(prev.map((m) => m.id));
      const newIds = new Set(mems.map((m) => m.id));

      // Find deleted memories
      const deleted = prev.filter((m) => !newIds.has(m.id));
      // Find added or updated memories
      const upserted = mems.filter((m) => {
        if (!prevIds.has(m.id)) return true; // new
        const old = prev.find((p) => p.id === m.id);
        if (!old) return true;
        return JSON.stringify({ ...old, date: old.date.toISOString() }) !==
          JSON.stringify({ ...m, date: m.date.toISOString() });
      });

      try {
        // Delete memories and their photos
        if (deleted.length > 0) {
          for (const m of deleted) {
            await deletePhoto(userId, m.id);
          }
          const { error } = await supabase
            .from('memories')
            .delete()
            .in('id', deleted.map((m) => m.id));
          if (error) console.warn('Supabase delete failed:', error.message);
        }

        // Upload photos for new/updated memories, then upsert
        if (upserted.length > 0) {
          const withUploads = await Promise.all(
            upserted.map(async (m) => {
              if (isLocalUri(m.photoUri)) {
                const remoteUrl = await uploadPhoto(userId, m.id, m.photoUri!);
                if (remoteUrl) return { ...m, photoUri: remoteUrl };
              }
              return m;
            })
          );

          // Update local state with remote URLs
          const urlMap = new Map<string, string>();
          withUploads.forEach((m) => {
            if (isRemoteUri(m.photoUri)) urlMap.set(m.id, m.photoUri!);
          });
          if (urlMap.size > 0) {
            const updated = mems.map((m) =>
              urlMap.has(m.id) ? { ...m, photoUri: urlMap.get(m.id) } : m
            );
            setMemories(updated);
            await cacheLocally(updated);
          }

          const rows = withUploads.map((m) => memoryToRow(m, userId));
          const { error } = await supabase
            .from('memories')
            .upsert(rows, { onConflict: 'id' });
          if (error) console.warn('Supabase upsert failed:', error.message);
        }
      } catch (err) {
        console.warn('Supabase sync failed:', err);
      } finally {
        setTimeout(() => { savingRef.current = false; }, 1000);
      }
    },
    [userId]
  );

  return { memories, save, reload };
}
