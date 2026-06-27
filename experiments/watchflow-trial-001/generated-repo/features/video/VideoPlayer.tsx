"use client";

import { Button } from "@/components/ui/Button";
import { ja } from "@/lib/i18n/ja";
import type { MediaMode, Video } from "@/lib/mocks/types";
import { formatDuration } from "@/lib/utils/format";
import { Captions, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { KeyboardEvent, useCallback, useRef, useState } from "react";

type VideoPlayerProps = {
  video: Video;
  mediaMode?: MediaMode;
};

export function VideoPlayer({ video, mediaMode = "normal" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(video.durationSeconds);
  const [buffering, setBuffering] = useState(mediaMode === "slow");
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const sourceUrl = `/api/media/video?mode=${mediaMode}&retry=${retryKey}`;

  const togglePlay = useCallback(async () => {
    const element = videoRef.current;
    if (!element || error) return;
    if (element.paused) {
      await element.play();
      setIsPlaying(true);
    } else {
      element.pause();
      setIsPlaying(false);
    }
  }, [error]);

  const retry = () => {
    setError(null);
    setBuffering(mediaMode === "slow");
    setProgress(0);
    setIsPlaying(false);
    setRetryKey((value) => value + 1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const element = videoRef.current;
    if (!element) return;
    if (event.key === " " || event.key === "k") {
      event.preventDefault();
      void togglePlay();
    }
    if (event.key === "ArrowRight") element.currentTime = Math.min(element.duration || 0, element.currentTime + 5);
    if (event.key === "ArrowLeft") element.currentTime = Math.max(0, element.currentTime - 5);
    if (event.key === "m") {
      element.muted = !element.muted;
      setIsMuted(element.muted);
    }
  };

  if (error) {
    return (
      <div className="player-stage">
        <div className="player-message" role="alert">
          <div>
            <h2>{ja.mediaFailure}</h2>
            <p>{error}</p>
            <Button onClick={retry}>
              <RotateCcw size={18} aria-hidden /> {ja.retry}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="player-stage" onKeyDown={handleKeyDown}>
      <video
        key={sourceUrl}
        ref={videoRef}
        className="player-video"
        poster={video.poster}
        preload="metadata"
        onClick={() => void togglePlay()}
        onWaiting={() => setBuffering(true)}
        onCanPlay={() => setBuffering(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || video.durationSeconds)}
        onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onVolumeChange={(event) => {
          setVolume(event.currentTarget.volume);
          setIsMuted(event.currentTarget.muted);
        }}
        onError={() => setError("メディアAPIが正常な動画を返しませんでした。モードを変えるか再試行してください。")}
      >
        <source src={sourceUrl} type="video/mp4" />
        {video.captions.map((caption) => (
          <track key={caption.lang} kind="captions" srcLang={caption.lang} label={caption.label} src={caption.src} />
        ))}
      </video>
      <div className="player-controls">
        {buffering ? <span aria-live="polite">{ja.buffering}</span> : null}
        <label>
          <span className="muted">{ja.seek}</span>
          <input
            aria-label={ja.seek}
            type="range"
            min="0"
            max={duration}
            value={progress}
            suppressHydrationWarning
            onChange={(event) => {
              const next = Number(event.target.value);
              setProgress(next);
              if (videoRef.current) videoRef.current.currentTime = next;
            }}
          />
        </label>
        <div className="control-row">
          <Button variant="icon" aria-label={isPlaying ? ja.pause : ja.play} onClick={() => void togglePlay()}>
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          <span>
            {formatDuration(Math.floor(progress))} / {formatDuration(Math.floor(duration))}
          </span>
          <Button
            variant="icon"
            aria-label={isMuted ? ja.unmute : ja.mute}
            onClick={() => {
              const nextMuted = !isMuted;
              if (videoRef.current) videoRef.current.muted = nextMuted;
              setIsMuted(nextMuted);
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
          <label className="control-row" style={{ flex: 1 }}>
            <span className="muted">{ja.volume}</span>
            <input
              aria-label={ja.volume}
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              suppressHydrationWarning
              onChange={(event) => {
                const next = Number(event.target.value);
                if (videoRef.current) videoRef.current.volume = next;
                setVolume(next);
              }}
            />
          </label>
          <Button variant="icon" aria-label={ja.captions} title={ja.captionsUnavailable}>
            <Captions size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
