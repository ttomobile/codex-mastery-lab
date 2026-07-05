# Codex Usage KPI

| KPI | Value |
| --- | --- |
| `generated_at` | 2026-07-06 07:26:42 JST |
| `latest_event_at` | 2026-07-06 02:56:07 JST |
| `idle_minutes` | 270.6 |
| `plan_type` | prolite |
| `primary_used_percent` | 17.0 |
| `primary_band` | under_used |
| `primary_resets_at` | 2026-07-06 05:15 JST |
| `secondary_used_percent` | 96.0 |
| `secondary_band` | brake |
| `secondary_resets_at` | 2026-07-07 11:00 JST |
| `sessions_24h` | 10 |
| `events_24h` | 401 |
| `tokens_24h_last_event_sum` | 25804272 |
| `recommendation` | BRAKE |

## Recommendation

新規Codex起動を止め、短い検証・ブログ・メディア圧縮へ寄せる。

## Control policy

- primary 5h枠: 65〜85%を狙い、90%超でブレーキ、96%超で停止。
- secondary 7日枠: 70〜88%を狙い、92%超でブレーキ、97%超で停止。
- idle 45分超かつusage低めならCodexタスクを追加投入。
