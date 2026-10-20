/** Public GitHub REST data, normalized to the few fields the site uses. No token is ever sent from the browser. */

export interface GitHubUser {
  login: string
  name: string | null
  avatarUrl: string
  htmlUrl: string
  bio: string | null
  location: string | null
  blog: string | null
  publicRepos: number
  createdAt: string
}

export interface GitHubRepo {
  name: string
  description: string | null
  htmlUrl: string
  homepage: string | null
  language: string | null
  /** Bytes per language; only available from the build-time snapshot. */
  languages: Record<string, number> | null
  stars: number
  forks: number
  topics: string[]
  createdAt: string
  pushedAt: string
  fork: boolean
  archived: boolean
}

export interface GitHubData {
  fetchedAt: string
  user: GitHubUser
  repos: GitHubRepo[]
}

export class GitHubError extends Error {
  readonly rateLimited: boolean
  readonly resetAt: Date | null
  constructor(message: string, rateLimited = false, resetAt: Date | null = null) {
    super(message)
    this.rateLimited = rateLimited
    this.resetAt = resetAt
  }
}

const API = 'https://api.github.com'

async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, headers: { Accept: 'application/vnd.github+json' } })
  if (res.ok) return res.json() as Promise<T>
  const remaining = res.headers.get('x-ratelimit-remaining')
  const reset = res.headers.get('x-ratelimit-reset')
  if ((res.status === 403 || res.status === 429) && remaining === '0') {
    throw new GitHubError('GitHub API rate limit reached', true, reset ? new Date(Number(reset) * 1000) : null)
  }
  throw new GitHubError(res.status === 404 ? 'GitHub user not found' : `GitHub API responded ${res.status}`)
}

/* eslint-disable @typescript-eslint/no-explicit-any -- raw API payloads are narrowed right here */
export function normalizeUser(u: any): GitHubUser {
  return {
    login: u.login,
    name: u.name || null,
    avatarUrl: u.avatar_url,
    htmlUrl: u.html_url,
    bio: u.bio || null,
    location: u.location || null,
    blog: u.blog || null,
    publicRepos: u.public_repos ?? 0,
    createdAt: u.created_at,
  }
}

export function normalizeRepo(r: any, languages: Record<string, number> | null = null): GitHubRepo {
  return {
    name: r.name,
    description: r.description || null,
    htmlUrl: r.html_url,
    homepage: r.homepage || null,
    language: r.language || null,
    languages,
    stars: r.stargazers_count ?? 0,
    forks: r.forks_count ?? 0,
    topics: Array.isArray(r.topics) ? r.topics : [],
    createdAt: r.created_at,
    pushedAt: r.pushed_at,
    fork: Boolean(r.fork),
    archived: Boolean(r.archived),
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Live refresh: 2 unauthenticated requests. Per-repo language bytes are reused from the snapshot. */
export async function fetchGitHub(username: string, snapshot: GitHubData | null, signal: AbortSignal): Promise<GitHubData> {
  const user = encodeURIComponent(username)
  const [u, repos] = await Promise.all([
    getJson<unknown>(`${API}/users/${user}`, signal),
    getJson<unknown[]>(`${API}/users/${user}/repos?per_page=100&sort=pushed`, signal),
  ])
  const known = new Map(snapshot?.repos.map((r) => [r.name, r.languages]))
  return {
    fetchedAt: new Date().toISOString(),
    user: normalizeUser(u),
    repos: repos.map((r) => normalizeRepo(r, known.get((r as { name: string }).name) ?? null)),
  }
}

/** Featured order: config list first (in its order), then the rest by stars, then most recent push. */
export function selectFeatured(repos: GitHubRepo[], featured: string[], hidden: string[], limit: number): GitHubRepo[] {
  const visible = repos.filter((r) => !hidden.includes(r.name) && !r.fork)
  const pinned = featured.map((n) => visible.find((r) => r.name === n)).filter((r): r is GitHubRepo => Boolean(r))
  const rest = visible
    .filter((r) => !featured.includes(r.name))
    .sort((a, b) => b.stars - a.stars || b.pushedAt.localeCompare(a.pushedAt))
  return [...pinned, ...rest].slice(0, limit)
}

/** Language share across non-fork repos: byte counts when known, otherwise one vote per primary language. */
export function languageShare(repos: GitHubRepo[], hidden: string[]): { name: string; share: number }[] {
  const totals = new Map<string, number>()
  for (const r of repos) {
    if (r.fork || hidden.includes(r.name)) continue
    const bytes = r.languages && Object.keys(r.languages).length ? r.languages : r.language ? { [r.language]: 1 } : {}
    const sum = Object.values(bytes).reduce((a, b) => a + b, 0)
    // Normalize per repo so one huge repo cannot drown out the rest.
    for (const [lang, n] of Object.entries(bytes)) totals.set(lang, (totals.get(lang) ?? 0) + n / sum)
  }
  const all = [...totals.values()].reduce((a, b) => a + b, 0)
  return [...totals.entries()]
    .map(([name, v]) => ({ name, share: v / all }))
    .sort((a, b) => b.share - a.share)
}
