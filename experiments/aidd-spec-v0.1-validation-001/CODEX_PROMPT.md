# Codex Prompt: AIDD-Spec v0.1 Validation 001

You are validating AIDD-Spec v0.1.

Read these files first:

- `standards/aidd-spec-v0.1.md`
- `standards/templates/ai-task-packet-template-v0.1.md`
- `standards/templates/verification-evidence-template-v0.1.md`
- `experiments/aidd-spec-v0.1-validation-001/AI_TASK_PACKET.md`

Create the requested static Web app under:

`experiments/aidd-spec-v0.1-validation-001/generated-repo/`

Follow the AI Task Packet exactly.

Important constraints:

- No external network calls.
- No framework.
- No build step.
- Use Japanese UI copy.
- Implement empty/loading/success/error/offline/timeout states.
- Implement accessible labels, aria-live status, and ul/li shortage list.
- Add scripts:
  - `npm run lint:static`
  - `npm run test:contract`
- Add `docs/product-brief.md`, `docs/review-record.md`, `docs/learning-log.md`.
- Add a static contract checker script that fails if required elements are missing.

Do not commit.
When done, summarize created files and commands to run.
