/**
 * Build-time snapshot of public GitHub data -> src/data/github-snapshot.json.
 * Runs with Node's built-in type stripping (node >= 22.18). GITHUB_TOKEN is optional and only
 * used here, server-side, to raise rate limits in CI; it never reaches the client bundle.
 * On any failure the existing snapshot is kept, so builds never break because GitHub is down.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { normalizeRepo, normalizeUser, type GitHubData } from '../src/lib/github.ts'

const out = new URL('../src/data/github-snapshot.json', import.meta.url)
const config = readFileSync(new URL('../src/config/profile.ts', import.meta.url), 'utf8')
const username = /githubUsername:\s*'([^']+)'/.exec(config)?.[1]
if (!username) throw new Error('githubUsername not found in src/config/profile.ts')

const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-snapshot' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw payloads, narrowed by normalize*
async function get(path: string): Promise<any> {
  const res = await fetch(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(15_000) })
  if (!res.ok) throw new Error(`${path} -> ${res.status} (rate remaining: ${res.headers.get('x-ratelimit-remaining')})`)
  return res.json()
}

try {
  const user = await get(`/users/${username}`)
  const repos: { name: string }[] = await get(`/users/${username}/repos?per_page=100&sort=pushed`)
  const data: GitHubData = {
    fetchedAt: new Date().toISOString(),
    user: normalizeUser(user),
    repos: await Promise.all(repos.map(async (r) => normalizeRepo(r, await get(`/repos/${username}/${r.name}/languages`).catch(() => null)))),
  }
  writeFileSync(out, JSON.stringify(data, null, 2) + '\n')
  console.log(`snapshot: ${data.repos.length} repos for ${username}`)
} catch (err) {
  console.warn(`snapshot: GitHub fetch failed, keeping existing snapshot. ${(err as Error).message}`)
}
