# Agent Operating Instructions

This repository is designed for collaboration between humans and AI agents across multiple devices. The repo context is the source of truth; raw chat/session history is local working memory only.

## Core Principles

1. **Repo context beats hidden session memory.** If another person or agent needs to know it, write it down in this repo.
2. **One agent session = one focused task = one branch/worktree.** Avoid multiple agents editing the same files concurrently.
3. **Distill often.** Agents should regularly summarize progress into task files, handoffs, and decision logs.
4. **Keep durable context clean.** Do not dump raw chat transcripts into project context files.
5. **Make handoffs portable.** Another agent on another machine should be able to resume from repo state without your local chat history.

## Startup Protocol

Before making changes, every agent should:

1. Read this file.
2. Read `context/PROJECT.md`.
3. Read `context/CURRENT.md`.
4. Read `context/DECISIONS.md`.
5. Read `context/CONVENTIONS.md`.
6. For design/frontend work, read `context/DESIGN.md` and `design/components.md`.
7. Check `agents/status.md`.
8. Check your inbox under `agents/inbox/`.
9. Review `tasks/active/`, `tasks/blocked/`, and `tasks/review/`.
10. Claim exactly one unblocked task before starting implementation.

## Task Claim Protocol

When claiming a task:

1. Move or copy the task brief into `tasks/active/`.
2. Set `Status`, `Owner`, `Branch`, `Claimed at`, and `Claim expires`.
3. Update `agents/status.md`.
4. Create or switch to the branch named in the task.

A stale claim may be reclaimed if the task has not been updated by its claim expiry.

## While Working

- Work on one task at a time.
- Prefer small, coherent commits.
- Update the task file after meaningful progress.
- Record durable decisions in `context/DECISIONS.md`.
- Record conventions in `context/CONVENTIONS.md`.
- Ask cross-agent questions via `agents/inbox/` or the task file.
- If blocked, move/update the task under `tasks/blocked/` and state the blocker clearly.
- Do not modify files owned by another active task unless explicitly coordinated.

## Shutdown / Handoff Protocol

Before ending a session, every agent should update:

1. The active task file.
2. `agents/status.md`.
3. `context/CURRENT.md` if project-level state changed.
4. `context/DECISIONS.md` if a durable decision was made.
5. A new handoff file under `handoffs/` using `handoffs/TEMPLATE.md`.

The handoff should include:

- Goal
- Summary
- Files changed
- Decisions made
- Commands/tests/checks run
- Known issues
- Open questions
- Recommended next step
- Whether the branch is ready for review

## Mobile Device Protocol

Mobile devices are best used for:

- Reviewing `context/CURRENT.md`
- Reviewing handoffs
- Answering open questions
- Creating or prioritizing task briefs
- Approving design/product decisions

Avoid using mobile devices as the only place where critical project state exists.

## Source-of-Truth Hierarchy

1. Code, tests, design tokens, schemas, and committed artifacts
2. `context/DECISIONS.md`, `context/CONVENTIONS.md`, `context/ARCHITECTURE.md`, `context/DESIGN.md`
3. Task files in `tasks/`
4. Handoffs in `handoffs/`
5. Local agent session history

If these conflict, update the higher source of truth and note the correction.
