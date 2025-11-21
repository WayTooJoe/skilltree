// components/SkillListItem.tsx
'use client';

import { useMemo, useState } from 'react';
import { SkillNode } from '@/lib/types';
import { getPublicVideoUrl } from '@/lib/storage';

interface Props {
  skill: SkillNode;
  disabled?: boolean;
  onDelete: () => void;
}

export default function SkillListItem({ skill, disabled, onDelete }: Props) {
  const [showPreview, setShowPreview] = useState(false);

  const videoUrl = useMemo(
    () => getPublicVideoUrl(skill.videoPath),
    [skill.videoPath]
  );

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
           <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">{skill.title}</h3>
          <span className="text-[10px] uppercase tracking-wide text-slate-400 border border-slate-700 rounded-full px-2 py-0.5">
            {skill.category}
          </span>
        </div>

        {skill.description && (
          <p className="text-xs text-slate-300 line-clamp-2">
            {skill.description}
          </p>
        )}

        <p className="text-[11px] text-slate-500">
          {new Date(skill.createdAt).toLocaleString()}
        </p>
      </div>


      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowPreview((s) => !s)}
          className="text-xs rounded-md border border-slate-700 px-2.5 py-1 hover:border-slate-500"
          disabled={disabled}
        >
          {showPreview ? 'Hide preview' : 'Play preview'}
        </button>

        <a
          href={`/skill/${skill.id}`}
          className="text-xs rounded-md border border-sky-500/60 bg-sky-500/10 px-2.5 py-1 text-sky-200 hover:bg-sky-500/20"
        >
          View
        </a>

        <button
          type="button"
          onClick={onDelete}
          className="text-xs rounded-md border border-rose-500/60 bg-rose-500/10 px-2.5 py-1 text-rose-200 hover:bg-rose-500/20 disabled:opacity-60"
          disabled={disabled}
        >
          {disabled ? 'Deleting…' : 'Delete'}
        </button>

        {showPreview && (
          <div className="basis-full mt-2">
            <video
              src={videoUrl}
              controls
              className="w-full max-h-[220px] rounded-md bg-black"
            />
          </div>
        )}
      </div>
    </div>
  );
}
