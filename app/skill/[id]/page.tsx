// app/skill/[id]/page.tsx

import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { getPublicVideoUrl } from '@/lib/storage';
import { SkillNode } from '@/lib/types';

interface PageProps {
  params: { id: string };
}

async function fetchSkill(id: string): Promise<SkillNode | null> {
  try {
    const { data, error } = await supabase
      .from('skill_nodes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.warn('Error loading skill detail or no row found:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      category: data.category ?? 'Other',
      videoPath: data.video_url, // matches your column
      createdAt: data.created_at,
      description: data.description ?? undefined,
    };
  } catch (err) {
    console.warn('Unexpected error loading skill detail:', err);
    return null;
  }
}

export default async function SkillDetailPage({ params }: PageProps) {
  const skill = await fetchSkill(params.id);

  if (!skill) {
    return (
      <div className="space-y-3">
        <Link href="/" className="text-sm text-sky-300 hover:text-sky-200">
          ← Back to skills
        </Link>
        <p className="text-sm text-slate-400">
          Skill not found or has been deleted.
        </p>
      </div>
    );
  }

  const videoUrl = getPublicVideoUrl(skill.videoPath);

  return (
    <div className="space-y-4">
      <Link href="/" className="text-sm text-sky-300 hover:text-sky-200">
        ← Back to skills
      </Link>

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

        {skill.description && (
          <p className="text-sm text-slate-300 mt-2 whitespace-pre-line">
            {skill.description}
          </p>
        )}
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
