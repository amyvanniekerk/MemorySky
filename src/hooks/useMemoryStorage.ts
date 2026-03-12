import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Memory } from '../types/Memory';

const STORAGE_KEY = 'memorySky_memories';

export default function useMemoryStorage() {
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((data) => {
        if (data) {
          const parsed: Memory[] = JSON.parse(data).map(
            (m: Omit<Memory, 'date'> & { date: string }) => ({
              ...m,
              date: new Date(m.date),
            })
          );
          setMemories(parsed);
        }
      })
      .catch((err) => {
        console.warn('Failed to load memories:', err);
      });
  }, []);

  const save = useCallback(async (mems: Memory[]) => {
    setMemories(mems);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mems));
    } catch (err) {
      console.warn('Failed to save memories:', err);
    }
  }, []);

  return { memories, save };
}
