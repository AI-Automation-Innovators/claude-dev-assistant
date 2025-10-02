// .github/workflows/scripts/ask-claude-review.js
// Runs inside GitHub Actions to review the PR diff with Claude (Anthropic).

import fs from "node:fs";
import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("❌ Missing ANTHROPIC_API_KEY (Repo → Settings → Secrets and variables → Actions).");
  process.exit(1);
}

const model = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";
const anthropic = new Anthropic({ apiKey });

// Read the unified diff created earlier in the workflow
const diffPath = "pr.diff";
if (!fs.existsSync(diffPath)) {
  console.log("No diff file found (pr.diff). Exiting.");
  process.exit(0);
}

let diff = fs.readFileSync(diffPath, "utf8").trim();
if (!diff) {
  console.log("Empty diff. Exiting.");
  process.exit(0);
}

// Keep prompt size safe for long PRs
if (diff.length > 180_000) {
  diff = diff.slice(0, 180_000) + "\n\n…[truncated]";
}

const SYSTEM = `
You are a pragmatic senior engineer and Claude code reviewer.
Given a unified diff, return:
1) A short summary of what changed
2) Risk level (Low/Med/High) with reasoning
3) Specific, minimal suggested fixes (use unified diff hunks where useful)
4) Any security, performance, or DX concerns
Be concise and actionable.
`.trim();

const USER = `
Review the following unified diff and produce feedback as described.

--- BEGIN DIFF ---
${diff}
--- END DIFF ---

If the diff is very large, focus on the riskiest or central files.
`.trim();

const res = await anthropic.messages.create({
  model,
  max_tokens: 2200,
  system: SYSTEM,
  messages: [{ role: "user", content: USER }]
});

const text = (res.content || [])
  .map(c => (c.type === "text" ? c.text : ""))
  .join("\n")
  .trim();

console.log(text || "No review content returned.");

