import { createServer } from "node:http";

const labels = {
  free: "無料プラン",
  premium: "プレミアム",
  payment_failed: "支払い確認が必要"
};

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload)
  });
  res.end(payload);
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname === "/health") return json(res, 200, { ok: true, service: "mock-billing" });
  if (url.pathname === "/billing") {
    const requested = url.searchParams.get("state");
    const state = requested === "premium" || requested === "payment_failed" ? requested : "free";
    return json(res, state === "payment_failed" ? 402 : 200, { state, label: labels[state] });
  }
  return json(res, 404, { message: "課金エンドポイントが見つかりません" });
}).listen(Number(process.env.PORT ?? 4040), "0.0.0.0", () => {
  console.log(`mock-billing listening on ${process.env.PORT ?? 4040}`);
});
