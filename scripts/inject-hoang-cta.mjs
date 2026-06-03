#!/usr/bin/env node
import { PrismaClient } from '../src/generated/prisma/index.js';

const COMMIT = process.argv.includes('--commit');

const OLD_MARGIN = 'margin: 0 0 8px; padding: 28px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #f8fafc;';
const NEW_MARGIN = 'margin: 32px 0 8px; padding: 28px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #f8fafc;';

const prisma = new PrismaClient();

const draft = await prisma.newsletterDraft.findFirst({
  where: { type: 'daily' },
  orderBy: { createdAt: 'desc' },
});

if (!draft) {
  console.error('No daily draft found.');
  process.exit(1);
}

if (!draft.content.includes(OLD_MARGIN)) {
  console.error('Old margin string not found. Has the CTA already been adjusted?');
  process.exit(1);
}

const newContent = draft.content.replace(OLD_MARGIN, NEW_MARGIN);
console.log(`Draft: ${draft.id}, content ${draft.content.length} -> ${newContent.length}`);

if (!COMMIT) {
  console.log('Dry run. Re-run with --commit.');
  await prisma.$disconnect();
  process.exit(0);
}

await prisma.newsletterDraft.update({
  where: { id: draft.id },
  data: { content: newContent },
});
console.log('✓ Updated CTA top margin to 32px.');
await prisma.$disconnect();
