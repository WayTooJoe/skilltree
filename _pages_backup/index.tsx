// pages/index.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
            ST
          </span>
          <span className="text-xl font-semibold">SkillTree</span>
        </div>
        <nav className="flex gap-4 text-sm">
          <Link href="/record" className="hover:text-emerald-400">
            Record a Skill
          </Link>
        </nav>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Grow your skills.{" "}
          <span className="text-emerald-400">Let companies apply to you.</span>
        </h1>
        <p className="text-slate-300 max-w-xl mb-8">
          Record short videos proving what you can do. Build your SkillTree.
          Employers browse real skills and send offers directly to you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/record"
            className="px-6 py-3 rounded-full bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400"
          >
            Record Your First Skill
          </Link>
        </div>
      </section>
    </main>
  );
}
