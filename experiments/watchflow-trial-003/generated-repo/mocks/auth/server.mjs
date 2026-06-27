import { createServer } from "node:http";

const states = new Set(["anonymous", "logged_in", "premium", "session_expired"]);

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
  if (url.pathname === "/health") return json(res, 200, { ok: true, service: "mock-auth" });
  if (url.pathname === "/auth") {
    const requested = url.searchParams.get("state");
    const state = states.has(requested) ? requested : "anonymous";
    return json(res, state === "session_expired" ? 401 : 200, { state });
  }
  return json(res, 404, { message: "認証エンドポイントが見つかりません" });
}).listen(Number(process.env.PORT ?? 4030), "0.0.0.0", () => {
  console.log(`mock-auth listening on ${process.env.PORT ?? 4030}`);
});
