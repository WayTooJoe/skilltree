// app/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SkillNode, SkillNodeRow } from '@/lib/types';
import {
  loadLocalSkills,
  saveLocalSkills,
  removeLocalSkill,
} from '@/lib/localStorage';
import { deleteSkillVideoFile } from '@/lib/storage';
import SkillFilters from '@/components/SkillFilters';
import SkillList from '@/components/SkillList';

export default function HomePage() {
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage first (instant display), then refresh from Supabase
  useEffect(() => {
    const local = loadLocalSkills();
    if (local.length > 0) {
      setSkills(local);
      setLoading(false);
    }

    const fetchRemote = async () => {
      const { data, error } = await supabase
        .from('skill_nodes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching skills:', error);
        setError('Failed to load skills from the cloud.');
        return;
      }
     
      const mapped: SkillNode[] =
        (data as SkillNodeRow[] | null)?.map((row) => ({
          id: row.id,
          title: row.title,
          category: row.category ?? 'Other',
          videoPath: row.video_url,
          createdAt: row.created_at,
          description: row.description ?? undefined,
        })) ?? [];

      setSkills(mapped);
      saveLocalSkills(mapped);
      setLoading(false);
    };

    fetchRemote();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ['All', ...Array.from(set).sort()];
  }, [skills]);

  const filteredSkills = useMemo(
    () =>
      selectedCategory === 'All'
        ? skills
        : skills.filter((s) => s.category === selectedCategory),
    [skills, selectedCategory]
  );

  async function handleDelete(skill: SkillNode) {
    const confirmed = window.confirm(
      `Delete "${skill.title}" and its video permanently?`
    );
    if (!confirmed) return;

    setDeletingId(skill.id);
    setError(null);

    try {
      // 1) Delete file from Supabase storage
      await deleteSkillVideoFile(skill.videoPath);

      // 2) Delete DB row
      const { error } = await supabase
        .from('skill_nodes')
        .delete()
        .eq('id', skill.id);

      if (error) throw error;

      // 3) Update UI + localStorage
      setSkills((prev) => prev.filter((s) => s.id !== skill.id));
      removeLocalSkill(skill.id);
    } catch (err: unknown) {
      console.error('Failed to delete skill:', err);
      setError('Failed to delete this skill. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Your Skills</h2>
          <p className="text-sm text-slate-400">
            Browse, filter, and manage your recorded skill demos.
          </p>
        </div>
        <Link
          href="/record"
          className="inline-flex items-center justify-center rounded-md border border-sky-500/60 bg-sky-500/10 px-3 py-1.5 text-sm font-medium text-sky-200 hover:bg-sky-500/20"
        >
          + Record new skill
        </Link>
      </div>

      <SkillFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {error && (
        <p className="text-sm text-rose-400 bg-rose-950/40 border border-rose-900/70 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <SkillList
        skills={filteredSkills}
        loading={loading}
        deletingId={deletingId}
        onDelete={handleDelete}
      />
    </div>
  );
}
