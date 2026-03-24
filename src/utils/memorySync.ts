import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { uploadToStorage } from '../lib/uploadToStorage';
import { Memory } from '../types/Memory';

export const STORAGE_KEY = 'memorySky_memories';
const BUCKET = 'memory-photos';

export function isLocalUri(uri?: string): boolean {
  return !!uri && (uri.startsWith('file://') || uri.startsWith('/'));
}

export function isRemoteUri(uri?: string): boolean {
  return !!uri && uri.startsWith('http');
}

export async function uploadPhoto(userId: string, memoryId: string, localUri: string): Promise<string | null> {
  const ext = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${userId}/${memoryId}.${ext}`;
  return uploadToStorage(BUCKET, path, localUri);
}

export async function deletePhoto(userId: string, memoryId: string) {
  try {
    const paths = [`${userId}/${memoryId}.jpg`, `${userId}/${memoryId}.png`];
    await supabase.storage.from(BUCKET).remove(paths);
  } catch (err) {
    console.warn('Photo delete failed:', err);
  }
}

export function parseLocalMemories(data: string): Memory[] {
  return JSON.parse(data).map(
    (m: Omit<Memory, 'date'> & { date: string }) => ({
      ...m,
      date: new Date(m.date),
    })
  );
}

export function rowToMemory(row: any): Memory {
  return {
    id: row.id,
    title: row.title,
    date: new Date(row.date),
    description: row.description ?? '',
    emotion: row.emotion,
    category: row.category,
    importance: row.importance,
    photoUri: row.photo_uri ?? undefined,
    location: row.location ?? undefined,
    hidden: row.hidden ?? false,
  };
}

export function memoryToRow(m: Memory, userId: string) {
  return {
    id: m.id,
    user_id: userId,
    title: m.title,
    date: m.date.toISOString(),
    description: m.description,
    emotion: m.emotion,
    category: m.category,
    importance: m.importance,
    photo_uri: m.photoUri ?? null,
    location: m.location ?? null,
    hidden: m.hidden ?? false,
    updated_at: new Date().toISOString(),
  };
}

export async function cacheLocally(mems: Memory[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mems));
  } catch (err) {
    console.warn('Failed to cache memories locally:', err);
  }
}
