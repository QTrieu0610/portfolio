import type { ProfileConfig } from '../config/profile'
import type { GitHubData } from '../lib/github'
import type { GitHubStatus } from '../lib/useGitHubData'
import { formatDate } from '../lib/format'
import { Arrow, ExternalLink, GitHubIcon } from './ui'

const statusLabel: Record<GitHubStatus['kind'], string> = {
  loading: 'syncing',
  live: 'live',
  snapshot: 'cached',
  error: 'offline',
}

export function Hero({ profile, data, status, topLanguage }: {
  profile: ProfileConfig
  data: GitHubData | null
  status: GitHubStatus
  topLanguage: string | null
}) {
  const user = data?.user
  const name = user?.name ?? profile.githubUsername
  const repos = data?.repos.filter((r) => !r.fork && !profile.projects.hidden.includes(r.name)) ?? []
  const stars = repos.reduce((n, r) => n + r.stars, 0)
  const githubUrl = user?.htmlUrl ?? `https://github.com/${profile.githubUsername}`
  // Fallback tagline is built only from verified GitHub facts.
  const tagline =
    profile.tagline ??
    (repos.length
      ? `Building in public on GitHub — ${repos.length} public ${repos.length === 1 ? 'repository' : 'repositories'}${topLanguage ? `, mostly ${topLanguage}` : ''}.`
      : 'Building in public on GitHub.')

  const facts: [string, string][] = [
    ['handle', `@${user?.login ?? profile.githubUsername}`],
    ...(user?.location ? [['location', user.location] as [string, string]] : []),
    ...(user ? [['on github since', formatDate(user.createdAt)] as [string, string]] : []),
    ['public repos', String(repos.length || user?.publicRepos || 0)],
    ['stars earned', String(stars)],
  ]

  return (
    <div id="top" className="relative isolate overflow-hidden">
      <div className="hero-grid pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24 lg:grid-cols-[1.35fr_1fr] lg:items-end">
        <div data-reveal>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-faint">
            Portfolio · {user?.location ?? 'GitHub'}
          </p>
          <h1 className="font-display text-[clamp(2.75rem,8vw,5.75rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            {name}
          </h1>
          {profile.role && <p className="mt-5 font-display text-xl text-muted md:text-2xl">{profile.role}</p>}
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{tagline}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
            >
              View projects
              <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">↓</span>
            </a>
            <ExternalLink
              href={githubUrl}
              className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-ink transition-colors hover:border-faint"
            >
              <GitHubIcon className="h-4 w-4" />
              GitHub profile
              <Arrow className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </ExternalLink>
          </div>
        </div>

        <aside data-reveal aria-label="Verified GitHub facts" className="w-full max-w-lg rounded-2xl border border-line bg-surface/80 p-6 backdrop-blur-sm lg:max-w-none">
          <div className="flex items-center gap-4">
            {user ? (
              <img
                src={`${user.avatarUrl}${user.avatarUrl.includes('?') ? '&' : '?'}s=160`}
                alt={`Avatar of ${name}`}
                width={64}
                height={64}
                fetchPriority="high"
                className="h-16 w-16 rounded-full border border-line bg-raised"
              />
            ) : (
              <div className="h-16 w-16 rounded-full border border-line bg-raised" aria-hidden="true" />
            )}
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-medium">{name}</p>
              <p className="font-mono text-xs text-faint">github.com/{user?.login ?? profile.githubUsername}</p>
            </div>
          </div>
          <dl className="mt-6 divide-y divide-line border-y border-line font-mono text-[0.8rem]">
            {facts.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2.5">
                <dt className="text-faint">{k}</dt>
                <dd className="truncate text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 flex items-center gap-2 font-mono text-[0.7rem] text-faint" role="status">
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${status.kind === 'live' ? 'bg-accent' : status.kind === 'loading' ? 'animate-pulse bg-muted' : 'bg-amber-400'}`}
            />
            source: GitHub REST API · {statusLabel[status.kind]}
            {data && status.kind !== 'live' && ` · ${formatDate(data.fetchedAt)}`}
          </p>
        </aside>
      </div>
    </div>
  )
}
