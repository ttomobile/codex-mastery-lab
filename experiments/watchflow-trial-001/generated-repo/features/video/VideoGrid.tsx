import type { VideoWithChannel } from "@/lib/api/client";
import { VideoCard } from "./VideoCard";

export function VideoGrid({ videos }: { videos: VideoWithChannel[] }) {
  return (
    <div className="video-grid">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
