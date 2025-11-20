// lib/localStorage.ts

import { SkillNode } from './types';

const STORAGE_KEY = 'skilltree.skills';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function loadLocalSkills(): SkillNode[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SkillNode[];
  } catch (err) {
    console.warn('Failed to parse local skills from localStorage', err);
    return [];
  }
}

export function saveLocalSkills(skills: SkillNode[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
  } catch (err) {
    console.warn('Failed to save skills to localStorage', err);
  }
}

export function upsertLocalSkill(skill: SkillNode): void {
  const current = loadLocalSkills();
  const existingIndex = current.findIndex((s) => s.id === skill.id);
  if (existingIndex >= 0) {
    current[existingIndex] = skill;
  } else {
    current.unshift(skill);
  }
  saveLocalSkills(current);
}

export function removeLocalSkill(id: string): void {
  const current = loadLocalSkills();
  const filtered = current.filter((s) => s.id !== id);
  saveLocalSkills(filtered);
}
