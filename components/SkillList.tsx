// components/SkillList.tsx
'use client';

import React from 'react';
import { SkillNode } from '@/lib/types';
import SkillListItem from './SkillListItem';


interface SkillListProps {
  skills: SkillNode[];
  loading: boolean;
  deletingId: string | null;
  onDelete: (skill: SkillNode) => void;
}

export default function SkillList({
  skills,
  loading,
  deletingId,
  onDelete,
}: SkillListProps) {
  if (loading && skills.length === 0) {
    return <p className="text-sm text-slate-400">Loading skills…</p>;
  }

  if (!loading && skills.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No skills yet.{' '}
        <a href="/record" className="text-sky-300 hover:text-sky-200">
          Record your first one.
        </a>
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {skills.map((skill) => (
        <SkillListItem
          key={skill.id}
          skill={skill}
          disabled={deletingId === skill.id}
          onDelete={() => onDelete(skill)}
        />
      ))}
    </div>
  );
}
