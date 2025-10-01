// src/lib/anthropic.ts
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY in .env');
  process.exit(1);
}

export const MODEL =
  process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest';

export const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});
