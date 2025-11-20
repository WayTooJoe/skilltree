// app/skill/[id]/page.tsx

import { supabase } from '@/lib/supabaseClient';
import { getPublicVideoUrl } from '@/lib/storage';
import { SkillNode } from '@/lib/types';

interface PageProps {
  params: { id: string };
}

async function fetchSkill(id: string): Promise<SkillNode | null> {
  const { data, error } = await supabase
    .from('skill_nodes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error loading skill detail:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    category: data.category ?? 'Other',
    videoPath: data.video_path,
    createdAt: data.created_at,
  };
}

export default async function SkillDetailPage({ params }: PageProps) {
  const skill = await fetchSkill(params.id);

  if (!skill) {
    return (
      <div>
        <p className="text-sm text-slate-400 mb-3">
          Skill not found or has been deleted.
        </p>
        <a href="/" className="text-sm text-sky-300 hover:text-sky-200">
          ← Back to skills
        </a>
      </div>
    );
  }

  const videoUrl = getPublicVideoUrl(skill.videoPath);

  return (
    <div className="space-y-4">
      <a href="/" className="text-sm text-sky-300 hover:text-sky-200">
        ← Back to skills
      </a>

      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {skill.title}
        </h2>
        <p className="text-sm text-slate-400">
          Category:{' '}
          <span className="inline-flex items-center rounded-full border border-slate-700 px-2 py-0.5 text-xs">
            {skill.category}
          </span>
        </p>
        <p className="text-xs text-slate-500">
          Recorded {new Date(skill.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
        <video
          src={videoUrl}
          controls
          className="w-full max-h-[480px] rounded-md bg-black"
        />
      </div>
    </div>
  );
}
