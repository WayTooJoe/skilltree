// app/record/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import RecordingGuide from '@/components/RecordingGuide';
import RecordSkillVideo from '@/components/RecordSkillVideo';
import { SkillNode } from '@/lib/types';

export default function RecordPage() {
  const router = useRouter();

  function handleCreated(skill: SkillNode) {
    // After upload, go to detail page
    router.push(`/skill/${skill.id}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Record a New Skill
        </h2>
        <p className="text-sm text-slate-400">
          Capture a quick demo, tag it, and it will be stored in the cloud.
        </p>
      </div>

      <RecordingGuide />

      <RecordSkillVideo onCreated={handleCreated} />
    </div>
  );
}
