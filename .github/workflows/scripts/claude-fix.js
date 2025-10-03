// Ask Claude for *patches only* (unified diff), respecting CLAUDE.md allowed paths
import fs from "node:fs";
import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) process.exit(1);
const MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";
const client = new Anthropic({ apiKey });

const rules = fs.existsSync("CLAUDE.md") ? fs.readFileSync("CLAUDE.md","utf8").slice(0, 12000) : "";
const system = `
You return ONLY a single valid unified diff (git apply compatible).
Respect allowed edit paths from CLAUDE.md. Small diffs. No prose, no fences.`;

const user = `
Based on the prior audit, generate minimal patches to fix the highest-impact issues.
If nothing to change, emit an empty diff.

Project rules:
${rules}
`;

const res = await client.messages.create({
  model: MODEL,
  max_tokens: 1200,
  temperature: 0,
  system,
  messages: [{ role: "user", content: user }],
});

const text = res.content.map(c => c.type === "text" ? c.text : "").join("\n").trim();
process.stdout.write(text);
