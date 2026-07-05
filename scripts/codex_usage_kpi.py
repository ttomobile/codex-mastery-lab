#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import shutil
from dataclasses import dataclass
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
CODEX_SESSIONS = Path.home() / ".codex" / "sessions"
OUT_DIR = ROOT / "metrics"
PREVIEW_DIR = ROOT / "preview" / "metrics"

TARGETS = {
    "primary_min": 65,
    "primary_target": 78,
    "primary_brake": 90,
    "primary_hard_stop": 96,
    "secondary_min": 70,
    "secondary_target": 84,
    "secondary_brake": 92,
    "secondary_hard_stop": 97,
    "idle_warn_minutes": 45,
    "idle_high_minutes": 90,
}

@dataclass
class CodexEvent:
    ts: datetime
    session_file: str
    total_tokens: int
    input_tokens: int
    cached_input_tokens: int
    output_tokens: int
    reasoning_output_tokens: int
    primary_used: float | None
    primary_window_minutes: int | None
    primary_resets_at: int | None
    secondary_used: float | None
    secondary_window_minutes: int | None
    secondary_resets_at: int | None
    plan_type: str | None
    reached_type: str | None


def parse_ts(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def latest_events() -> list[CodexEvent]:
    events: list[CodexEvent] = []
    if not CODEX_SESSIONS.exists():
        return events
    for file in CODEX_SESSIONS.glob("20*/*/*/*.jsonl"):
        try:
            lines = file.read_text(errors="ignore").splitlines()
        except Exception:
            continue
        for line in lines:
            try:
                obj = json.loads(line)
            except Exception:
                continue
            if obj.get("type") != "event_msg":
                continue
            payload = obj.get("payload") or {}
            if payload.get("type") != "token_count":
                continue
            info = payload.get("info") or {}
            usage = info.get("total_token_usage") or {}
            limits = payload.get("rate_limits") or {}
            primary = limits.get("primary") or {}
            secondary = limits.get("secondary") or {}
            try:
                ts = parse_ts(obj["timestamp"])
            except Exception:
                continue
            events.append(CodexEvent(
                ts=ts,
                session_file=str(file),
                total_tokens=int(usage.get("total_tokens") or 0),
                input_tokens=int(usage.get("input_tokens") or 0),
                cached_input_tokens=int(usage.get("cached_input_tokens") or 0),
                output_tokens=int(usage.get("output_tokens") or 0),
                reasoning_output_tokens=int(usage.get("reasoning_output_tokens") or 0),
                primary_used=primary.get("used_percent"),
                primary_window_minutes=primary.get("window_minutes"),
                primary_resets_at=primary.get("resets_at"),
                secondary_used=secondary.get("used_percent"),
                secondary_window_minutes=secondary.get("window_minutes"),
                secondary_resets_at=secondary.get("resets_at"),
                plan_type=limits.get("plan_type"),
                reached_type=limits.get("rate_limit_reached_type"),
            ))
    return sorted(events, key=lambda e: e.ts)


def fmt_dt(ts: datetime | None) -> str:
    if not ts:
        return "n/a"
    return ts.astimezone().strftime("%Y-%m-%d %H:%M:%S %Z")


def fmt_reset(epoch: int | None) -> str:
    if not epoch:
        return "n/a"
    return datetime.fromtimestamp(epoch, tz=timezone.utc).astimezone().strftime("%Y-%m-%d %H:%M %Z")


def band(value: float | None, min_v: int, target_v: int, brake_v: int, hard_v: int) -> str:
    if value is None:
        return "unknown"
    if value >= hard_v:
        return "hard_stop"
    if value >= brake_v:
        return "brake"
    if value >= min_v:
        return "target_band"
    return "under_used"


def recommendation(primary: float | None, secondary: float | None, idle_min: float | None) -> tuple[str, str]:
    p = primary or 0
    s = secondary or 0
    idle = idle_min if idle_min is not None else 10_000
    if p >= TARGETS["primary_hard_stop"] or s >= TARGETS["secondary_hard_stop"]:
        return "STOP", "Codex実行を停止。記事QA・非Codex作業・素材変換だけに切替。"
    if p >= TARGETS["primary_brake"] or s >= TARGETS["secondary_brake"]:
        return "BRAKE", "新規Codex起動を止め、短い検証・ブログ・メディア圧縮へ寄せる。"
    if p < 35 and s < TARGETS["secondary_target"] and idle >= TARGETS["idle_warn_minutes"]:
        return "ACCELERATE", "Codexタスクを追加投入。RPG playable改善を優先。"
    if p < TARGETS["primary_min"] and s < TARGETS["secondary_brake"]:
        return "STEADY_PLUS", "通常より短い間隔でCodex実装サイクルを回せる。"
    return "STEADY", "現在のペースを維持。上限接近時だけブレーキ。"


def main() -> int:
    now = datetime.now(timezone.utc)
    events = latest_events()
    latest = events[-1] if events else None
    recent_24 = [e for e in events if e.ts >= now - timedelta(hours=24)]
    recent_5h = [e for e in events if e.ts >= now - timedelta(hours=5)]
    recent_7d = [e for e in events if e.ts >= now - timedelta(days=7)]
    idle_min = None if not latest else max(0, (now - latest.ts).total_seconds() / 60)
    action, rec = recommendation(latest.primary_used if latest else None, latest.secondary_used if latest else None, idle_min)

    by_session: dict[str, CodexEvent] = {}
    for e in recent_24:
        by_session[e.session_file] = e

    summary: dict[str, Any] = {
        "generated_at": fmt_dt(now),
        "latest_event_at": fmt_dt(latest.ts if latest else None),
        "idle_minutes": round(idle_min, 1) if idle_min is not None else None,
        "plan_type": latest.plan_type if latest else None,
        "primary_used_percent": latest.primary_used if latest else None,
        "primary_band": band(latest.primary_used if latest else None, TARGETS["primary_min"], TARGETS["primary_target"], TARGETS["primary_brake"], TARGETS["primary_hard_stop"]),
        "primary_resets_at": fmt_reset(latest.primary_resets_at if latest else None),
        "secondary_used_percent": latest.secondary_used if latest else None,
        "secondary_band": band(latest.secondary_used if latest else None, TARGETS["secondary_min"], TARGETS["secondary_target"], TARGETS["secondary_brake"], TARGETS["secondary_hard_stop"]),
        "secondary_resets_at": fmt_reset(latest.secondary_resets_at if latest else None),
        "rate_limit_reached_type": latest.reached_type if latest else None,
        "recommendation": action,
        "recommendation_detail": rec,
        "events_5h": len(recent_5h),
        "events_24h": len(recent_24),
        "sessions_24h": len(by_session),
        "tokens_24h_last_event_sum": sum(e.total_tokens for e in by_session.values()),
        "targets": TARGETS,
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "codex-usage-kpi.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

    rows = [
        ("generated_at", summary["generated_at"]),
        ("latest_event_at", summary["latest_event_at"]),
        ("idle_minutes", summary["idle_minutes"]),
        ("plan_type", summary["plan_type"]),
        ("primary_used_percent", summary["primary_used_percent"]),
        ("primary_band", summary["primary_band"]),
        ("primary_resets_at", summary["primary_resets_at"]),
        ("secondary_used_percent", summary["secondary_used_percent"]),
        ("secondary_band", summary["secondary_band"]),
        ("secondary_resets_at", summary["secondary_resets_at"]),
        ("sessions_24h", summary["sessions_24h"]),
        ("events_24h", summary["events_24h"]),
        ("tokens_24h_last_event_sum", summary["tokens_24h_last_event_sum"]),
        ("recommendation", summary["recommendation"]),
    ]
    md = ["# Codex Usage KPI", "", "| KPI | Value |", "| --- | --- |"]
    md += [f"| `{k}` | {v} |" for k, v in rows]
    md += ["", "## Recommendation", "", str(rec), "", "## Control policy", "", "- primary 5h枠: 65〜85%を狙い、90%超でブレーキ、96%超で停止。", "- secondary 7日枠: 70〜88%を狙い、92%超でブレーキ、97%超で停止。", "- idle 45分超かつusage低めならCodexタスクを追加投入。"]
    (OUT_DIR / "codex-usage-kpi.md").write_text("\n".join(md) + "\n", encoding="utf-8")

    def meter(label: str, value: float | None, target: int, brake: int) -> str:
        v = 0 if value is None else max(0, min(100, float(value)))
        return f"""
        <section class='card'><h2>{label}</h2><div class='meter'><span style='width:{v}%'></span></div><p><strong>{v:.1f}%</strong> / target {target}% / brake {brake}%</p></section>
        """

    html = f"""<!doctype html><html lang='ja'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>
<title>Codex Usage KPI</title><style>body{{margin:0;background:#07111f;color:#eef6ff;font-family:system-ui,sans-serif}}main{{max-width:980px;margin:auto;padding:24px}}.card{{border:1px solid #284767;background:#101b2d;border-radius:18px;padding:18px;margin:14px 0}}.meter{{height:22px;background:#20324a;border-radius:999px;overflow:hidden}}.meter span{{display:block;height:100%;background:linear-gradient(90deg,#43e0c0,#f2c14f,#ff6b6b)}}table{{width:100%;border-collapse:collapse}}td,th{{border-bottom:1px solid #243b58;padding:8px;text-align:left}}code{{color:#9ff1df}}.rec{{font-size:22px;color:#f2c14f}}</style></head><body><main>
<h1>Codex Usage KPI</h1><p>CodexセッションJSONLの <code>token_count.rate_limits</code> から生成。上限ギリギリを狙いつつ到達は避けるための制御盤。</p>
<p class='rec'>Recommendation: {summary['recommendation']} — {rec}</p>
{meter('Primary / 5h window', summary['primary_used_percent'], TARGETS['primary_target'], TARGETS['primary_brake'])}
{meter('Secondary / 7d window', summary['secondary_used_percent'], TARGETS['secondary_target'], TARGETS['secondary_brake'])}
<section class='card'><h2>Snapshot</h2><table><tbody>{''.join(f'<tr><th>{k}</th><td>{v}</td></tr>' for k,v in rows)}</tbody></table></section>
<section class='card'><h2>Policy</h2><ul><li>Primary 65〜85%を維持。90%超で新規Codex起動を抑制。</li><li>Secondary 70〜88%を維持。92%超で強ブレーキ。</li><li>Idle 45分超かつusage低めならRPG playable改善タスクを追加。</li></ul></section>
</main></body></html>"""
    (PREVIEW_DIR / "codex-usage-kpi.html").write_text(html, encoding="utf-8")
    shutil.copy2(OUT_DIR / "codex-usage-kpi.json", PREVIEW_DIR / "codex-usage-kpi.json")
    shutil.copy2(OUT_DIR / "codex-usage-kpi.md", PREVIEW_DIR / "codex-usage-kpi.md")
    print(json.dumps(summary, ensure_ascii=False))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
