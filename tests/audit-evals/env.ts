/**
 * Env loading for the eval runners.
 *
 * `import 'dotenv/config'` only reads `.env`. This repo keeps secrets in
 * `.env.local` (the Next.js convention), so the runners were relying on the
 * variable already being exported in the caller's shell — and printed
 * "ANTHROPIC_API_KEY not set" on any machine where it wasn't, despite the
 * README saying `.env.local` was loaded.
 *
 * Load `.env.local` first, then `.env` as a fallback. dotenv never overwrites
 * an already-set variable, so a real shell export still wins over both.
 */
import path from 'path';
import dotenv from 'dotenv';

const ROOT = path.join(__dirname, '..', '..');

dotenv.config({ path: path.join(ROOT, '.env.local') });
dotenv.config({ path: path.join(ROOT, '.env') });
