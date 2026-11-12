import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_PAT = process.env.GITHUB_PAT;
const OWNER = process.env.GITHUB_OWNER || 'anosistaken';
const REPO = process.env.GITHUB_REPO || 'ResearchingAgent';
const BRANCH = 'main';

if (!GITHUB_PAT) {
  console.error('[Sync Error] Missing GITHUB_PAT in environment.');
  process.exit(1);
}

const headers = {
  Authorization: `token ${GITHUB_PAT}`,
  'User-Agent': 'Greg-Sync-Agent',
  Accept: 'application/vnd.github.v3+json',
};

async function api<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GitHub API error (${res.status} on ${endpoint}): ${errorText}`);
  }
  return res.json() as Promise<T>;
}

function getAllFiles(dir: string, baseDir: string = dir): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    if (['node_modules', '.git', 'dist', '.env', '.env.local'].includes(file)) {
      continue;
    }
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, baseDir));
    } else {
      results.push(path.relative(baseDir, fullPath).replace(/\\/g, '/'));
    }
  }
  return results;
}

export async function commitAndPush(commitMessage: string = 'feat: update greg research agent') {
  console.log(`[Greg Sync] Starting push to https://github.com/${OWNER}/${REPO} on branch '${BRANCH}'...`);

  // 1. Get reference to current branch head
  const refData = await api(`/git/ref/heads/${BRANCH}`);
  const latestCommitSha = refData.object.sha;

  // 2. Get tree SHA of latest commit
  const commitData = await api(`/git/commits/${latestCommitSha}`);
  const baseTreeSha = commitData.tree.sha;

  // 3. Collect local workspace files
  const rootDir = process.cwd();
  const filePaths = getAllFiles(rootDir);
  console.log(`[Greg Sync] Uploading ${filePaths.length} project files...`);

  const treeEntries: Array<{ path: string; mode: string; type: string; sha: string }> = [];

  for (const relPath of filePaths) {
    const fullPath = path.join(rootDir, relPath);
    const content = fs.readFileSync(fullPath);
    const isBinary = /\.(png|jpg|jpeg|gif|ico|pdf|zip|exe)$/i.test(relPath);

    const blobPayload = isBinary
      ? { content: content.toString('base64'), encoding: 'base64' }
      : { content: content.toString('utf-8'), encoding: 'utf-8' };

    const blobRes = await api('/git/blobs', {
      method: 'POST',
      body: JSON.stringify(blobPayload),
    });

    treeEntries.push({
      path: relPath,
      mode: '100644',
      type: 'blob',
      sha: blobRes.sha,
    });
  }

  // 4. Create new Git tree
  console.log(`[Greg Sync] Creating tree object...`);
  const treeRes = await api('/git/trees', {
    method: 'POST',
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: treeEntries,
    }),
  });

  // 5. Create new Commit
  console.log(`[Greg Sync] Creating commit...`);
  const newCommit = await api('/git/commits', {
    method: 'POST',
    body: JSON.stringify({
      message: commitMessage,
      tree: treeRes.sha,
      parents: [latestCommitSha],
    }),
  });

  // 6. Update branch ref
  console.log(`[Greg Sync] Updating branch ref to ${newCommit.sha.slice(0, 7)}...`);
  await api(`/git/refs/heads/${BRANCH}`, {
    method: 'PATCH',
    body: JSON.stringify({
      sha: newCommit.sha,
      force: false,
    }),
  });

  console.log(`[Greg Sync] Successfully committed and pushed to GitHub!`);
  console.log(`Commit URL: https://github.com/${OWNER}/${REPO}/commit/${newCommit.sha}`);
}

const argMessage = process.argv.slice(2).join(' ');
commitAndPush(argMessage || 'feat: add Greg decision agent with multi-LLM engine and minimal dashboard');
