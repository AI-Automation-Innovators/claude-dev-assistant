// src/cli/review.ts
import { client, MODEL } from '../lib/anthropic.js';
import fs from 'node:fs';
import path from 'node:path';

type PickFile = { label: string; path: string };

// small helper to read a file safely and clamp length
function readFileSafe(p: string, max = 12000) {
  try {
    const data = fs.readFileSync(p, 'utf8');
    return data.length > max ? data.slice(0, max) + '\n\n…[truncated]' : data;
  } catch {
    return '';
  }
}

// build a lightweight tree (files only) excluding noisy dirs
function fileTree(root: string, maxFiles = 150): string {
  const out: string[] = [];
  const q: string[] = ['.'];
  while (q.length && out.length < maxFiles) {
    const rel = q.shift()!;
    const abs = path.join(root, rel);
    const entries = fs.readdirSync(abs, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith('.git')) continue;
      if (e.name === 'node_modules') continue;
      const relChild = path.posix.join(rel, e.name);
      if (e.isDirectory()) {
        q.push(relChild);
      } else {
        out.push(relChild);
        if (out.length >= maxFiles) break;
      }
    }
  }
  return out.sort().join('\n');
}

// choose key files to include fully (or truncated)
function pickImportantFiles(root: string): PickFile[] {
  const picks: PickFile[] = [
    { label: 'README.md', path: path.join(root, 'README.md') },
    { label: 'CLAUDE.md', path: path.join(root, 'CLAUDE.md') },
    { label: 'package.json', path: path.join(root, 'package.json') },
    { label: 'tsconfig.json', path: path.join(root, 'tsconfig.json') },
    { label: '.env.example', path: path.join(root, '.env.example') },
    { label: 'GitHub Action: claude-pr-review.yml', path: path.join(root, '.github', 'workflows', 'claude-pr-review.yml') },
    { label: 'Agent: dev-assistant.yml', path: path.join(root, '.claude', 'agents', 'dev-assistant.yml') },
    { label: 'Agent: reviewer.yml', path: path.join(root, '.claude', 'agents', 'reviewer.yml') },
    { label: 'Agent: architect.yml', path: path.join(root, '.claude', 'agents', 'architect.yml') },
    { label: 'Issue: good-first-issue.md', path: path.join(root, '.github', 'ISSUE_TEMPLATE', 'good-first-issue.md') },
    { label: 'Issue: good-first-quickstart-md.md', path: path.join(root, '.github', 'ISSUE_TEMPLATE', 'good-first-quickstart-md.md') },
    { label: 'Script: ask-claude-review.js', path: path.join(root, '.github', 'workflows', 'scripts', 'ask-claude-review.js') },
    { label: 'CLI: chat.ts', path: path.join(root, 'src', 'cli', 'chat.ts') },
    { label: 'Lib: anthropic.ts', path: path.join(root, 'src', 'lib', 'anthropic.ts') },
  ];
  return picks;
}

async function main() {
  const root = process.cwd();
  const userPrompt = process.argv.slice(2).join(' ').trim() ||
    'Review this repository and propose the top 5 improvements for dev + no-code users.';

  const tree = fileTree(root);

  const files = pickImportantFiles(root)
    .map(({ label, path: p }) => {
      const contents = readFileSafe(p);
      return contents
        ? `### ${label}\n\n\`\`\`\n${contents}\n\`\`\`\n`
        : '';
    })
    .filter(Boolean)
    .join('\n');

  const system = [
    'You are a pragmatic repo reviewer and Claude agent architect.',
    'Return a concise, actionable review with minimal fluff.',
    'Prioritize: (1) correctness/security, (2) DX/quick start, (3) agent ergonomics for devs and non-devs, (4) maintainability.',
    'When suggesting code, include unified diff hunks when helpful.',
  ].join(' ');

  const content = [
    `Repository file tree (trimmed):\n\n\`\`\`\n${tree}\n\`\`\`\n`,
    `Key files (trimmed where large):\n\n${files}`,
    `User request: ${userPrompt}`,
  ].join('\n\n');

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 1400,
    system,
    messages: [{ role: 'user', content }],
  });

  const out = res.content.map(c => (c.type === 'text' ? c.text : '')).join('\n');
  console.log(out);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
