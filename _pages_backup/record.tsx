// pages/record.tsx
import type { NextPage } from "next";
import Link from "next/link";
import { RecordingGuide } from "../components/RecordingGuide";
import { RecordSkillVideo } from "../components/RecordSkillVideo";

const RecordPage: NextPage = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
            ST
          </span>
          <span className="font-semibold text-lg">Record a Skill</span>
        </div>
        <Link
          href="/"
          className="text-sm text-slate-300 hover:text-emerald-400"
        >
          Back to home
        </Link>
      </header>

      <section className="px-4 py-6 md:px-8 flex flex-col items-center gap-6">
        <RecordingGuide />
        <RecordSkillVideo />
      </section>
    </main>
  );
};

export default RecordPage;
