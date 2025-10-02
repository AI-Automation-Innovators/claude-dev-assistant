# CLAUDE.md

## IMPORTANT
- Only create/edit files explicitly listed below.
- Keep diffs small and explain changes in bullets.
- If uncertain, write drafts to `sandbox/` first.

## MUST
- Run tests after edits: `npm test`
- Branch naming: `feat/*`, `fix/*`, `chore/*`
- Commit style: `type(scope): message`
- Never touch secrets; use GitHub Actions secrets only.

## Allowed edit paths
- `README.md` (append new sections; don’t delete existing content)
- `CLAUDE.md`
- `.claude/settings.json`
- `.claude/agents/*`
- `.github/workflows/*.yml`
- `sandbox/*` (scratch area for drafts)

## Common commands
- Install: `npm ci`
- Lint: `npm run lint`
- Review: `npm run dev:review`
- Chat tools: `npm run dev:chat`

## Working agreement
1) Propose a plan, 2) show diffs, 3) write files, 4) list all changes with paths.
