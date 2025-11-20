"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function VideoUploadTestPage() {
  const [nodeId, setNodeId] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!nodeId) {
      setMessage("Please enter a skill_node id.");
      return;
    }
    if (!videoFile) {
      setMessage("Please choose a video file.");
      return;
    }

    try {
      setUploading(true);

      const ext = videoFile.name.split(".").pop();
      const fileName = `${nodeId}-${Date.now()}.${ext}`;
      const filePath = `skill-videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(filePath, videoFile, {
          contentType: videoFile.type,
        });

      if (uploadError) throw uploadError;

      const { data: signedData, error: signedError } =
        await supabase.storage
          .from("videos")
          .createSignedUrl(filePath, 60 * 60 * 24);

      if (signedError) throw signedError;

      const videoUrl = signedData.signedUrl;

      const { error: updateError } = await supabase
        .from("skill_nodes")
        .update({ video_url: videoUrl })
        .eq("id", nodeId);

      if (updateError) throw updateError;

      setMessage("✅ Video uploaded and skill_node.video_url updated.");
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ Error: ${err.message ?? "Something went wrong"}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-2">SkillTree Video Upload Test</h1>

      <form onSubmit={handleUpload} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            skill_nodes.id
          </label>
          <input
            className="w-full border rounded px-2 py-1"
            value={nodeId}
            onChange={(e) => setNodeId(e.target.value)}
            placeholder="copy an id from Supabase"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Video file
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) =>
              setVideoFile(e.target.files?.[0] ?? null)
            }
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload & Link"}
        </button>
      </form>

      {message && <p className="text-sm mt-2">{message}</p>}
    </main>
  );
}
