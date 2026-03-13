import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Memory } from '../types/Memory';

const STORAGE_KEY = 'memorySky_memories';

function parseMemories(data: string): Memory[] {
  return JSON.parse(data).map(
    (m: Omit<Memory, 'date'> & { date: string }) => ({
      ...m,
      date: new Date(m.date),
    })
  );
}

export default function useMemoryStorage() {
  const [memories, setMemories] = useState<Memory[]>([]);

  const reload = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setMemories(parseMemories(data));
      }
    } catch (err) {
      console.warn('Failed to load memories:', err);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = useCallback(async (mems: Memory[]) => {
    setMemories(mems);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mems));
    } catch (err) {
      console.warn('Failed to save memories:', err);
    }
  }, []);

  return { memories, save, reload };
}
