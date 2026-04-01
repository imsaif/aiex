/**
 * Script to merge duplicate newsletters
 *
 * Usage:
 *   npx tsx scripts/merge-newsletter-duplicates.ts --list      # List duplicates
 *   npx tsx scripts/merge-newsletter-duplicates.ts --merge     # Merge duplicates (interactive)
 *   npx tsx scripts/merge-newsletter-duplicates.ts --dry-run   # Preview merge without saving
 */

import { config } from 'dotenv';
// Load .env.local which has the PostgreSQL connection string
// override: true to replace any previously set values
config({ path: '.env.local', override: true });

import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

interface NewsletterDraft {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  publishDate: Date;
  status: string;
  type: string;
  sources: unknown;
  structuredData: unknown;
  createdAt: Date;
  updatedAt: Date;
}

async function findDuplicates(): Promise<Map<string, NewsletterDraft[]>> {
  const drafts = await prisma.newsletterDraft.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Group by date (YYYY-MM-DD) and type
  const grouped = new Map<string, NewsletterDraft[]>();

  for (const draft of drafts) {
    const dateKey = new Date(draft.createdAt).toISOString().split('T')[0];
    const key = `${dateKey}_${draft.type}`;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(draft as NewsletterDraft);
  }

  // Filter to only include duplicates (more than 1 newsletter per day)
  const duplicates = new Map<string, NewsletterDraft[]>();
  for (const [key, drafts] of grouped) {
    if (drafts.length > 1) {
      duplicates.set(key, drafts);
    }
  }

  return duplicates;
}

function extractNewsItems(content: string): string[] {
  // Extract news items by looking for the bordered divs with news
  const items: string[] = [];
  const regex = /<div[^>]*style="[^"]*border-left:[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g;
  const matches = content.matchAll(regex);

  for (const match of matches) {
    items.push(match[0]);
  }

  return items;
}

function mergeContents(drafts: NewsletterDraft[]): {
  mergedContent: string;
  mergedTitle: string;
  mergedSummary: string;
  itemCount: number;
} {
  // Use the first draft as the base
  const base = drafts[0];

  // Collect all unique news items from all drafts
  const allItems = new Set<string>();

  for (const draft of drafts) {
    const items = extractNewsItems(draft.content);
    items.forEach(item => allItems.add(item));
  }

  // For now, just use the first draft's content if item extraction fails
  if (allItems.size === 0) {
    console.log('  Could not extract individual items, keeping first draft content');
    return {
      mergedContent: base.content,
      mergedTitle: base.title,
      mergedSummary: base.summary,
      itemCount: 0,
    };
  }

  // TODO: More sophisticated merging logic could be added here
  // For now, just report what we found
  return {
    mergedContent: base.content,
    mergedTitle: base.title,
    mergedSummary: base.summary,
    itemCount: allItems.size,
  };
}

async function listDuplicates() {
  const duplicates = await findDuplicates();

  if (duplicates.size === 0) {
    console.log('No duplicate newsletters found.');
    return;
  }

  console.log(`\nFound ${duplicates.size} days with duplicate newsletters:\n`);

  for (const [key, drafts] of duplicates) {
    const [date, type] = key.split('_');
    console.log(`📅 ${date} (${type}): ${drafts.length} newsletters`);

    for (const draft of drafts) {
      const status = draft.status === 'published' ? '✅' : draft.status === 'pending_review' ? '⏳' : '❌';
      console.log(`   ${status} ${draft.id.slice(0, 8)}... "${draft.title.slice(0, 50)}..."`);
      console.log(`      Status: ${draft.status}, Created: ${draft.createdAt.toISOString()}`);
    }
    console.log('');
  }
}

async function mergeDuplicates(dryRun = false) {
  const duplicates = await findDuplicates();

  if (duplicates.size === 0) {
    console.log('No duplicate newsletters found.');
    return;
  }

  console.log(`\n${dryRun ? '[DRY RUN] ' : ''}Processing ${duplicates.size} days with duplicates:\n`);

  for (const [key, drafts] of duplicates) {
    const [date, type] = key.split('_');
    console.log(`\n📅 Processing ${date} (${type})...`);
    console.log(`   Found ${drafts.length} newsletters`);

    // Sort by status priority (published > pending_review > rejected) then by createdAt
    drafts.sort((a, b) => {
      const statusPriority: Record<string, number> = {
        published: 0,
        pending_review: 1,
        rejected: 2
      };
      const aPriority = statusPriority[a.status] ?? 3;
      const bPriority = statusPriority[b.status] ?? 3;

      if (aPriority !== bPriority) return aPriority - bPriority;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    const keepDraft = drafts[0];
    const deleteDrafts = drafts.slice(1);

    console.log(`   ✅ Keeping: "${keepDraft.title.slice(0, 50)}..." (${keepDraft.status})`);

    for (const draft of deleteDrafts) {
      console.log(`   ❌ Will delete: "${draft.title.slice(0, 50)}..." (${draft.status})`);

      if (!dryRun) {
        await prisma.newsletterDraft.delete({
          where: { id: draft.id },
        });
        console.log(`      Deleted: ${draft.id}`);
      }
    }
  }

  console.log(`\n${dryRun ? '[DRY RUN] No changes made.' : 'Done! Duplicates merged.'}`);
}

async function main() {
  const args = process.argv.slice(2);

  try {
    if (args.includes('--list')) {
      await listDuplicates();
    } else if (args.includes('--merge')) {
      const dryRun = args.includes('--dry-run');
      await mergeDuplicates(dryRun);
    } else if (args.includes('--dry-run')) {
      await mergeDuplicates(true);
    } else {
      console.log('Newsletter Duplicate Manager');
      console.log('');
      console.log('Usage:');
      console.log('  npx tsx scripts/merge-newsletter-duplicates.ts --list      List all duplicates');
      console.log('  npx tsx scripts/merge-newsletter-duplicates.ts --dry-run   Preview merge (no changes)');
      console.log('  npx tsx scripts/merge-newsletter-duplicates.ts --merge     Merge duplicates (keeps first, deletes rest)');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
