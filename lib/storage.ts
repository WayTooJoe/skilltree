// lib/storage.ts

import { supabase } from './supabaseClient';

const SKILL_BUCKET = 'videos'; // make sure this matches your bucket name

// Note: path can be undefined/null for old/bad data, so handle that safely.
export function getPublicVideoUrl(path: string | null | undefined): string {
  if (!path) {
    return ''; // no video available
  }

  const result = supabase.storage.from(SKILL_BUCKET).getPublicUrl(path);

  // result = { data: { publicUrl: string } }
  if (!result || !result.data || !result.data.publicUrl) {
    console.error('Failed to get publicUrl for path:', path);
    return '';
  }

  return result.data.publicUrl;
}


export async function uploadSkillVideoFile(
  file: File,
  skillId: string
): Promise<{ path: string }> {
  const fileExt = file.name.split('.').pop() ?? 'webm';
  const filePath = `${skillId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage.from(SKILL_BUCKET).upload(
    filePath,
    file,
    {
      cacheControl: '3600',
      upsert: false,
    }
  );

  if (error) {
    console.error('Error uploading video:', error);
    throw error;
  }

  return { path: filePath };
}

export async function deleteSkillVideoFile(path: string): Promise<void> {
  const { error } = await supabase.storage.from(SKILL_BUCKET).remove([path]);
  if (error) {
    console.error('Error deleting video from storage:', error);
    throw error;
  }
}
