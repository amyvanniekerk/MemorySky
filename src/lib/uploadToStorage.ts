import { supabase } from './supabase';

/**
 * Upload a local file to a Supabase Storage bucket.
 * Returns the public URL on success, or null on failure.
 */
export async function uploadToStorage(
  bucket: string,
  path: string,
  localUri: string
): Promise<string | null> {
  try {
    const ext = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const contentType = `image/${ext === 'png' ? 'png' : 'jpeg'}`;

    const response = await fetch(localUri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, arrayBuffer, { contentType, upsert: true });

    if (error) {
      console.warn(`Upload to ${bucket} failed:`, error.message);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.warn(`Upload to ${bucket} failed:`, err);
    return null;
  }
}
