import { StateView } from "@/components/ui/StateView";
import { VideoGrid } from "@/features/video/VideoGrid";
import { ja } from "@/lib/i18n/ja";
import { listVideos } from "@/lib/mocks/adapter";

export default async function HomePage() {
  const videos = await listVideos();

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{ja.homeTitle}</h1>
          <p className="muted">独自モックデータで構成した WatchFlow のホームです。</p>
        </div>
      </div>
      {videos.length > 0 ? <VideoGrid videos={videos} /> : <StateView title={ja.empty} message="表示できる動画がありません。" />}
    </main>
  );
}
