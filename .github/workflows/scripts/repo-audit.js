// Repo-wide health check with Claude
import fs from "node:fs";
import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("Missing ANTHROPIC_API_KEY");
  process.exit(1);
}

const MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";
const client = new Anthropic({ apiKey });

const context = fs.existsSync("audit_context.txt") ? fs.readFileSync("audit_context.txt","utf8").slice(0, 180_000) : "";

const system = `
You are a senior repo auditor. Produce a short, actionable report.
Sections: Summary, Errors, Risks, Suggested Fixes, Ready-to-Apply Patches.
Use small unified diff hunks when appropriate. Respect CLAUDE.md rules.
If fixes are non-trivial, propose a plan and say: "Reply /claude fix to apply."`;

const user = `
Audit this repository holistically.
Consider: build/test state, scripts, workflows, TypeScript config, README clarity, security basics (secrets usage), and DX.

Context (trimmed):
${context}
`;

const res = await client.messages.create({
  model: MODEL,
  max_tokens: 1800,
  temperature: 0,
  system,
  messages: [{ role: "user", content: user }],
});

const out = res.content.map(c => c.type === "text" ? c.text : "").join("\n");
console.log(out || "No output.");
