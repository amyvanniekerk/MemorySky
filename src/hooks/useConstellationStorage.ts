import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { Constellation } from '../types/Constellation';

const STORAGE_KEY = 'memorySky_constellations';

function rowToConstellation(row: any): Constellation {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    memoryIds: row.memory_ids ?? [],
  };
}

function constellationToRow(c: Constellation, userId: string) {
  return {
    id: c.id,
    user_id: userId,
    name: c.name,
    color: c.color,
    memory_ids: c.memoryIds,
    updated_at: new Date().toISOString(),
  };
}

async function cacheLocally(items: Constellation[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('Failed to cache constellations locally:', err);
  }
}

export default function useConstellationStorage() {
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [userId, setUserId] = useState<string | undefined>();
  const prevRef = useRef<Constellation[]>([]);

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
        const parsed = JSON.parse(data) as Constellation[];
        setConstellations(parsed);
        prevRef.current = parsed;
      }
    } catch (err) {
      console.warn('Failed to load local constellations:', err);
    }
  }, []);

  const loadFromSupabase = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('constellations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Supabase constellation load failed:', error.message);
        await loadFromLocal();
        return;
      }

      const items = (data ?? []).map(rowToConstellation);
      setConstellations(items);
      prevRef.current = items;
      await cacheLocally(items);
    } catch (err) {
      console.warn('Supabase constellation load failed:', err);
      await loadFromLocal();
    }
  }, [userId, loadFromLocal]);

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
    async (items: Constellation[]) => {
      setConstellations(items);
      await cacheLocally(items);

      if (!userId) return;

      const prev = prevRef.current;
      prevRef.current = items;

      const prevIds = new Set(prev.map((c) => c.id));
      const newIds = new Set(items.map((c) => c.id));

      const deleted = prev.filter((c) => !newIds.has(c.id));
      const upserted = items.filter((c) => {
        if (!prevIds.has(c.id)) return true;
        const old = prev.find((p) => p.id === c.id);
        if (!old) return true;
        return JSON.stringify(old) !== JSON.stringify(c);
      });

      try {
        if (deleted.length > 0) {
          const { error } = await supabase
            .from('constellations')
            .delete()
            .in('id', deleted.map((c) => c.id));
          if (error) console.warn('Supabase constellation delete failed:', error.message);
        }

        if (upserted.length > 0) {
          const rows = upserted.map((c) => constellationToRow(c, userId));
          const { error } = await supabase
            .from('constellations')
            .upsert(rows, { onConflict: 'id' });
          if (error) console.warn('Supabase constellation upsert failed:', error.message);
        }
      } catch (err) {
        console.warn('Supabase constellation sync failed:', err);
      }
    },
    [userId]
  );

  return { constellations, save, reload };
}
