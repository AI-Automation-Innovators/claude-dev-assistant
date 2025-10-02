# Claude Dev Assistant

Automated pull request reviews powered by Claude AI.

- ✅ Triggered with GitHub Actions
- ✅ Inline PR comments
- ✅ Configurable with your own model + key

***

## What this repo is

This repo is a ready-to-use GitHub Action + helper scripts for automating PR reviews with Claude.

- **Claude PR Review Action**: Runs when a PR is opened or updated.
- **Configurable**: Bring your own Anthropic API key + model.
- **Reusable**: Fork into your personal account or org, works out-of-the-box.

Goal: **Ship faster. Catch issues earlier. Spend less time on manual reviews.**

***

## Quick Start (fork users)

1. **Fork this repo** → your account or GitHub organization.
2. Go to **Settings → Secrets and variables → Actions → New repository secret**
    - **Name:** `ANTHROPIC_API_KEY`
    - **Value:** your Claude API key (from Anthropic)
3. (Optional) Override the default model:
    - **Settings → Secrets and variables → Variables → New variable**
    - **Name:** `ANTHROPIC_MODEL`
    - **Value:** `claude-3-5-sonnet-latest` (already default)
4. Open a PR (or push a new branch → open PR)
    - Action will run automatically
    - Claude bot leaves a comment with the review 🎉

***

## Repo structure

```text
.github/
  workflows/
    claude-pr-review.yml   # GitHub Action entrypoint
  ISSUE_TEMPLATE/          # Bug/feature templates
  scripts/
    ask-claude-review.js   # Script that calls Claude API
src/
  cli/                     # CLI utilities
  lib/                     # Core integration code
.claude/                   # Config folder (optional)
```


***

## Why use this

Automate reviews → consistent feedback on every PR
Customizable → pick model, tweak prompts
Team-ready → works in org repos via fork
Zero friction → just add API key + fork

***

## Contribute

We welcome small PRs:

- Fix bugs or improve config
- Add new model configs
- Improve docs

**PR checklist:**

- Branch from main
- Clear filenames \& scope
- Add/update README or comments
- Open PR with before/after notes

***

## License

MIT — free to use, fork, and adapt.

***

## About

Maintained by AI Automation Innovators.
Teaching practical agentic solutions + automation patterns.


Test
