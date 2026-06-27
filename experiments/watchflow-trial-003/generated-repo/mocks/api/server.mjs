import { createServer } from "node:http";

const channels = [
  { id: "ch-design", name: "Flow Design Lab", handle: "@flow-design" },
  { id: "ch-craft", name: "暮らしのクラフト便", handle: "@craft-note" },
  { id: "ch-tech", name: "Tokyo Dev Journal", handle: "@tokyo-dev" }
];

const videos = [
  { id: "vf-001", title: "小さな動画サービスを設計する", category: "設計", channelId: "ch-design" },
  { id: "vf-002", title: "週末の作業机リセットと道具の手入れ", category: "暮らし", channelId: "ch-craft" },
  { id: "vf-003", title: "TypeScript strictで守るフロントエンドの境界", category: "開発", channelId: "ch-tech" },
  { id: "vf-004", title: "プレミアム向け: 高画質ワークフローの考え方", category: "開発", channelId: "ch-tech" }
];

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload)
  });
  res.end(payload);
}

function withChannel(video) {
  return { ...video, channel: channels.find((channel) => channel.id === video.channelId) };
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname === "/health") return json(res, 200, { ok: true, service: "mock-api" });
  if (url.pathname === "/videos") {
    const id = url.searchParams.get("id");
    if (id) {
      const video = videos.find((item) => item.id === id);
      return video ? json(res, 200, { video: withChannel(video) }) : json(res, 404, { message: "動画が見つかりません" });
    }
    return json(res, 200, { videos: videos.map(withChannel) });
  }
  if (url.pathname === "/search") {
    const query = (url.searchParams.get("q") ?? "").toLowerCase();
    const matched = videos.filter((video) => [video.title, video.category].join(" ").toLowerCase().includes(query));
    return json(res, 200, { query, videos: matched.map(withChannel) });
  }
  return json(res, 404, { message: "APIエンドポイントが見つかりません" });
}).listen(Number(process.env.PORT ?? 4010), "0.0.0.0", () => {
  console.log(`mock-api listening on ${process.env.PORT ?? 4010}`);
});
