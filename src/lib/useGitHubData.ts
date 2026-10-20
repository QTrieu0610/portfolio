import { useCallback, useEffect, useState } from 'react'
import snapshotJson from '../data/github-snapshot.json'
import { fetchGitHub, GitHubError, type GitHubData } from './github'

export type GitHubStatus =
  | { kind: 'loading' }
  | { kind: 'live' }
  /** Live refresh failed but the build-time snapshot is shown. */
  | { kind: 'snapshot'; reason: string }
  /** Nothing to show at all. */
  | { kind: 'error'; reason: string }

// Dev-only failure simulation for verification: ?gh=offline | nosnapshot | empty | ratelimit
const sim = import.meta.env.DEV ? new URLSearchParams(location.search).get('gh') : null

function initialSnapshot(): GitHubData | null {
  if (sim === 'nosnapshot') return null
  const s = snapshotJson as unknown as GitHubData
  if (!s?.user?.login) return null
  return sim === 'empty' ? { ...s, repos: [] } : s
}

function describe(err: unknown): string {
  if (err instanceof GitHubError && err.rateLimited) {
    return `GitHub's hourly API limit was reached${err.resetAt ? `; it resets at ${err.resetAt.toLocaleTimeString()}` : ''}.`
  }
  return err instanceof Error ? err.message : 'GitHub could not be reached.'
}

export function useGitHubData(username: string) {
  const [snapshot] = useState(initialSnapshot)
  const [data, setData] = useState<GitHubData | null>(snapshot)
  const [status, setStatus] = useState<GitHubStatus>({ kind: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const ctrl = new AbortController()
    const timeout = setTimeout(() => ctrl.abort(new GitHubError('GitHub took too long to respond.')), 8000)
    const run = sim === 'offline' || sim === 'nosnapshot'
      ? Promise.reject(new GitHubError('Simulated network failure.'))
      : sim === 'ratelimit'
        ? Promise.reject(new GitHubError('rate limited', true, new Date(Date.now() + 30 * 60_000)))
        : fetchGitHub(username, snapshot, ctrl.signal)
    run
      .then((live) => {
        setData(sim === 'empty' ? { ...live, repos: [] } : live)
        setStatus({ kind: 'live' })
      })
      .catch((err: unknown) => {
        if (ctrl.signal.aborted && !(ctrl.signal.reason instanceof GitHubError)) return
        const reason = describe(ctrl.signal.reason instanceof GitHubError ? ctrl.signal.reason : err)
        setStatus(snapshot ? { kind: 'snapshot', reason } : { kind: 'error', reason })
      })
      .finally(() => clearTimeout(timeout))
    return () => {
      clearTimeout(timeout)
      ctrl.abort()
    }
  }, [username, snapshot, attempt])

  const retry = useCallback(() => {
    setStatus({ kind: 'loading' })
    setAttempt((n) => n + 1)
  }, [])

  return { data, status, retry }
}
