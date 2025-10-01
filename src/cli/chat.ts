// src/cli/chat.ts
import { client, MODEL } from '../lib/anthropic.js'; // note the .js for ESM pathing with tsx

const prompt = process.argv.slice(2).join(' ').trim() || 'Hello from Claude dev assistant';

const system =
  'You are a helpful, repo-aware coding assistant. Answer concisely and provide code blocks when relevant.';

const res = await client.messages.create({
  model: MODEL,
  max_tokens: 800,
  system,
  messages: [{ role: 'user', content: prompt }],
});

const out = res.content
  .map((c) => (c.type === 'text' ? c.text : ''))
  .join('\n');

console.log(out);
