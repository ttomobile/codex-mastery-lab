"use client";

import { Button } from "@/components/ui/Button";
import { BookmarkCheck, BookmarkPlus } from "lucide-react";
import { useState } from "react";

const storageKey = "watchflow.watchLater";

function readWatchLater(): string[] {
  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function WatchLaterButton({ videoId }: { videoId: string }) {
  const [saved, setSaved] = useState(() => (typeof window === "undefined" ? false : readWatchLater().includes(videoId)));

  const toggle = () => {
    const current = new Set(readWatchLater());
    if (current.has(videoId)) {
      current.delete(videoId);
      setSaved(false);
    } else {
      current.add(videoId);
      setSaved(true);
    }
    window.localStorage.setItem(storageKey, JSON.stringify(Array.from(current)));
  };

  return (
    <div className="watch-actions">
      <Button onClick={toggle} aria-pressed={saved}>
        {saved ? <BookmarkCheck size={18} aria-hidden /> : <BookmarkPlus size={18} aria-hidden />}
        {saved ? "後で見るに追加済み" : "後で見るへ追加"}
      </Button>
    </div>
  );
}
