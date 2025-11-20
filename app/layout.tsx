// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SkillTree',
  description: 'Record and organize your skill demos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
              <h1 className="text-lg font-semibold tracking-tight">
                SkillTree
              </h1>
              <nav className="flex gap-4 text-sm text-slate-300">
                <a href="/" className="hover:text-white">
                  Skills
                </a>
                <a href="/record" className="hover:text-white">
                  Record
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
