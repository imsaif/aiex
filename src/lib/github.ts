const GITHUB_API = 'https://api.github.com';
const OWNER = 'imsaif';
const REPO = 'aiex';
const BRANCH = 'master';

function headers() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN env var not set');
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

async function getFileSha(path: string): Promise<string | null> {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`, {
    headers: headers(),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub getFileSha failed for ${path}: ${res.status}`);
  const data = await res.json() as { sha: string };
  return data.sha;
}

async function upsertFile(path: string, content: string, message: string): Promise<void> {
  const sha = await getFileSha(path);
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`GitHub upsertFile failed for ${path}: ${res.status} ${detail}`);
  }
}

export async function commitPatternFiles(
  files: Record<string, string>,
  patternTitle: string,
): Promise<void> {
  // Commit all files sequentially — GitHub Contents API doesn't support atomic multi-file commits
  // without the low-level Trees API. Sequential is fine for O(6) files.
  for (const [path, content] of Object.entries(files)) {
    await upsertFile(path, content, `feat(patterns): scaffold ${patternTitle} — ${path.split('/').pop()}`);
  }
}
