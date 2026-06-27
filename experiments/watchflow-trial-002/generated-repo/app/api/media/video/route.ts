import { getMediaMode } from "@/lib/mocks/adapter";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const mode = getMediaMode(searchParams.get("mode"));

  if (mode === "not_found") {
    return Response.json({ message: "動画ファイルが見つかりません" }, { status: 404 });
  }

  if (mode === "failure") {
    return Response.json({ message: "動画取得に失敗しました" }, { status: 503 });
  }

  if (mode === "slow") {
    await new Promise((resolve) => setTimeout(resolve, 1800));
  }

  const file = await readFile(join(process.cwd(), "public", "mock-media", "sample.mp4"));
  return new Response(file, {
    headers: {
      "content-type": "video/mp4",
      "cache-control": "public, max-age=3600"
    }
  });
}
