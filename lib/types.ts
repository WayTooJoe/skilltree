// lib/types.ts

export type SkillCategory = 'Technical' | 'Soft' | 'Other' | string;

export interface SkillNode {
  id: string;
  title: string;
  category: SkillCategory;
  videoPath: string;        // Supabase storage path
  createdAt: string;        // ISO string from DB
  description?: string;     // <-- NEW optional field
}

// Shape of the skill_nodes table coming back from Supabase queries.
export interface SkillNodeRow {
  id: string;
  title: string;
  category: string | null;
  video_url: string;
  created_at: string;
  description: string | null;
  device_id?: string | null;
}
