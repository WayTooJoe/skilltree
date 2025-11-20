// components/RecordingGuide.tsx
'use client';

export default function RecordingGuide() {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300 space-y-2">
      <h3 className="text-sm font-semibold text-slate-100">Recording tips</h3>
      <ul className="list-disc list-inside space-y-1">
        <li>Keep each demo short (30–90 seconds).</li>
        <li>State the skill name and context at the start of the video.</li>
        <li>Use your normal speaking voice and focus on clarity.</li>
        <li>
          Show something concrete: a workflow, a technique, or walking through a
          finished result.
        </li>
      </ul>
    </div>
  );
}
