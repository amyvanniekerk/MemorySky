import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Memory } from '../types/Memory';

const STORAGE_KEY = 'memorySky_memories';

export default function useMemoryStorage() {
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        const parsed = JSON.parse(data).map((m: any) => ({
          ...m,
          date: new Date(m.date),
        }));
        setMemories(parsed);
      }
    });
  }, []);

  const save = useCallback(async (mems: Memory[]) => {
    setMemories(mems);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mems));
  }, []);

  return { memories, save };
}
