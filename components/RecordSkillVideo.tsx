// components/RecordSkillVideo.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { uploadSkillVideoFile } from '@/lib/storage';
import { SkillNode, SkillCategory } from '@/lib/types';
import { upsertLocalSkill } from '@/lib/localStorage';

interface Props {
  onCreated?: (skill: SkillNode) => void;
}

type RecordingState = 'idle' | 'recording' | 'preview';

export default function RecordSkillVideo({ onCreated }: Props) {
  const [supported, setSupported] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Technical');
  const [description, setDescription] = useState('');

  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // Check if recording is supported
  useEffect(() => {
    const hasMedia =
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices &&
      'getUserMedia' in navigator.mediaDevices;
    setSupported(hasMedia);
  }, []);

  useEffect(() => {
    return () => {
      // cleanup stream on unmount
      stopStream();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopStream() {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
  }

  async function startRecording() {
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const recordedBlob = new Blob(chunksRef.current, {
          type: 'video/webm',
        });
        const url = URL.createObjectURL(recordedBlob);
        setBlob(recordedBlob);
        setPreviewUrl(url);
        setRecordingState('preview');
        stopStream();
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecordingState('recording');
    } catch (err: any) {
      console.error('Error starting recording:', err);
      setError('Could not access your camera and microphone.');
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecordingState('preview');
  }

  function resetRecording() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setBlob(null);
    setRecordingState('idle');
    setError(null);
  }

  async function handleUpload() {
    if (!blob) {
      setError('No video recorded yet.');
      return;
    }
    if (!title.trim()) {
      setError('Please give this skill a title.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const skillId = crypto.randomUUID();
      const file = new File([blob], `${skillId}.webm`, { type: 'video/webm' });

      // 1) upload to storage
      const { path } = await uploadSkillVideoFile(file, skillId);

      // 2) insert into DB (align with your columns)
      const { data, error } = await supabase
        .from('skill_nodes')
        .insert({
          id: skillId,
          title: title.trim(),
          category,
          device_id: 'web',              // NEW: satisfy NOT NULL constraint
          video_url: path,               // NEW: matches your column name
          description: description.trim() || null,
        })
        .select('*')
        .single();

      if (error || !data) throw error;

      const created: SkillNode = {
        id: data.id,
        title: data.title,
        category: data.category ?? category,
        videoPath: data.video_url,       // map DB column to our field
        createdAt: data.created_at,
        description: data.description ?? undefined,
      };

      // 3) sync localStorage
      upsertLocalSkill(created);

      // 4) notify parent
      onCreated?.(created);

      // 5) reset recording state
      resetRecording();
    } catch (err: any) {
      console.error('Error uploading skill video:', err);
      try {
        console.error('Error as JSON:', JSON.stringify(err));
      } catch {
        // ignore
      }
      setError('Upload failed. Please check console for details.');
    } finally {
      setUploading(false);
    }
  }

  if (!supported) {
    return (
      <p className="text-sm text-rose-300">
        Video recording is not supported in this browser.
      </p>
    );
  }

  const isRecording = recordingState === 'recording';

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 space-y-4">
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-[2fr,1fr] sm:items-end">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Skill title
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
              placeholder="Example: Explaining NIST CSF to non-technical leaders"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Category
            </label>
            <select
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Technical">Technical</option>
              <option value="Soft">Soft</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Description field */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Description (optional)
          </label>
          <textarea
            className="w-full min-h-[70px] rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
            placeholder="Example: Quick overview of how I explain the NIST CSF functions to non-technical stakeholders using analogies."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="text-[11px] text-slate-500">
            Use this to capture context, scenario, or key talking points for this
            demo.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {recordingState === 'idle' && (
            <button
              type="button"
              onClick={startRecording}
              className="inline-flex items-center rounded-md border border-emerald-500/70 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-200 hover:bg-emerald-500/20"
            >
              Start recording
            </button>
          )}

          {recordingState === 'recording' && (
            <button
              type="button"
              onClick={stopRecording}
              className="inline-flex items-center rounded-md border border-amber-500/70 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-200 hover:bg-amber-500/20"
            >
              Stop recording
            </button>
          )}

          {recordingState === 'preview' && (
            <>
              <button
                type="button"
                onClick={resetRecording}
                className="inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm"
                disabled={uploading}
              >
                Re-record
              </button>
              <button
                type="button"
                onClick={handleUpload}
                className="inline-flex items-center rounded-md border border-sky-500/70 bg-sky-500/10 px-3 py-1.5 text-sm font-medium text-sky-200 hover:bg-sky-500/20 disabled:opacity-60"
                disabled={uploading}
              >
                {uploading ? 'Uploading…' : 'Save to SkillTree'}
              </button>
            </>
          )}
        </div>

        {isRecording && (
          <p className="text-xs text-amber-300">
            Recording… stop when you&apos;re happy with the demo.
          </p>
        )}

        {previewUrl && (
          <div className="mt-2">
            <p className="text-xs text-slate-400 mb-1">Preview</p>
            <video
              src={previewUrl}
              controls
              className="w-full max-h-[320px] rounded-md bg-black"
            />
          </div>
        )}

        {error && (
          <p className="text-xs text-rose-300 bg-rose-950/30 border border-rose-900/70 rounded-md px-3 py-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
