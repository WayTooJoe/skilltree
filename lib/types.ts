// lib/types.ts

export type SkillCategory = 'Technical' | 'Soft' | 'Other' | string;

export interface SkillNode {
  id: string;
  title: string;
  category: SkillCategory;
  videoPath: string;        // Supabase storage path (bucket key)
  createdAt: string;        // ISO string
}
