# Agent Shutdown / Handoff Prompt

Prepare a clean handoff before ending this session.

Update these files as needed:

1. The active task file in `tasks/active/`, `tasks/blocked/`, `tasks/review/`, or `tasks/done/`.
2. `agents/status.md`.
3. `context/CURRENT.md` if project-level state changed.
4. `context/DECISIONS.md` if any durable decisions were made.
5. A new handoff file under `handoffs/` using `handoffs/TEMPLATE.md`.

The handoff must include:

- Goal
- Summary
- Files changed
- Decisions made
- Commands/tests/checks run
- Known issues
- Open questions
- Recommended next step
- Whether the branch is ready for review

Do not dump raw chat history. Distill only the information another human or agent needs to resume from repo state.
