import type { GitHubRepo } from '../lib/github'
import type { GitHubStatus } from '../lib/useGitHubData'
import { colorFor, formatDate } from '../lib/format'
import { Arrow, ExternalLink } from './ui'


function LanguageBar({ repo }: { repo: GitHubRepo }) {
  const bytes = repo.languages && Object.keys(repo.languages).length ? repo.languages : repo.language ? { [repo.language]: 1 } : null
  if (!bytes) return null
  const total = Object.values(bytes).reduce((a, b) => a + b, 0)
  const parts = Object.entries(bytes).sort((a, b) => b[1] - a[1])
  const shown = parts.slice(0, 3).map(([l, n]) => `${l} ${Math.round((n / total) * 100)}%`)
  return (
    <div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-raised" aria-hidden="true">
        {parts.map(([l, n]) => (
          <span key={l} style={{ width: `${(n / total) * 100}%`, background: colorFor(l) }} />
        ))}
      </div>
      <p className="mt-2 font-mono text-[0.7rem] text-faint">
        <span className="sr-only">Languages: </span>
        {shown.join(' · ')}
      </p>
    </div>
  )
}

function ProjectCard({ repo, override, lead }: { repo: GitHubRepo; override?: string; lead: boolean }) {
  const description = override ?? repo.description
  return (
    <li
      data-reveal
      className={`group relative flex flex-col rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-faint md:p-7 ${lead ? 'md:col-span-2' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
          {/* Stretched link: the whole card is clickable, but only one tab stop per card. */}
          <ExternalLink href={repo.htmlUrl} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none group-has-[:focus-visible]:underline">
            {repo.name}
          </ExternalLink>
        </h3>
        <Arrow className="mt-1.5 shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </div>
      {description ? (
        <p className={`mt-3 leading-relaxed text-muted ${lead ? 'max-w-2xl md:text-lg' : ''}`}>
          {description}
          {override && <span className="ml-2 font-mono text-[0.65rem] uppercase tracking-wider text-faint">· author note</span>}
        </p>
      ) : (
        <p className="mt-3 text-faint italic">No description on GitHub yet.</p>
      )}
      {repo.topics.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Topics">
          {repo.topics.slice(0, 6).map((t) => (
            <li key={t} className="rounded-full bg-accent-dim px-2.5 py-0.5 font-mono text-[0.7rem] text-accent">
              {t}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-6">
        <LanguageBar repo={repo} />
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[0.75rem] text-faint">
          <span>★ {repo.stars}<span className="sr-only"> stars</span></span>
          {repo.forks > 0 && <span>⑂ {repo.forks}<span className="sr-only"> forks</span></span>}
          <span>updated {formatDate(repo.pushedAt)}</span>
          {repo.archived && <span className="text-amber-300">archived</span>}
          {repo.homepage && (
            // Sits above the stretched link so it stays independently clickable.
            <ExternalLink href={repo.homepage} className="relative z-10 text-accent underline-offset-4 hover:underline">
              live site
            </ExternalLink>
          )}
        </div>
      </div>
    </li>
  )
}

export function Projects({ repos, status, descriptions, githubUrl, onRetry, hasData }: {
  repos: GitHubRepo[]
  status: GitHubStatus
  descriptions: Record<string, string>
  githubUrl: string
  onRetry: () => void
  hasData: boolean
}) {
  if (!hasData && status.kind === 'loading') {
    return (
      <ul className="grid gap-5 md:grid-cols-2" aria-busy="true" aria-label="Loading projects">
        {[0, 1, 2].map((i) => (
          <li key={i} className={`h-56 animate-pulse rounded-2xl border border-line bg-surface ${i === 0 ? 'md:col-span-2' : ''}`} />
        ))}
      </ul>
    )
  }
  if (!hasData) {
    return (
      <div role="alert" className="rounded-2xl border border-line bg-surface p-8">
        <p className="font-display text-xl">Projects couldn't be loaded.</p>
        <p className="mt-2 text-muted">{status.kind === 'error' ? status.reason : ''}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={onRetry} className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-bg">
            Try again
          </button>
          <ExternalLink href={githubUrl} className="rounded-full border border-line px-5 py-2 text-sm">
            Browse on GitHub
          </ExternalLink>
        </div>
      </div>
    )
  }
  if (repos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-8 text-muted">
        No public repositories to show yet. <ExternalLink href={githubUrl} className="text-accent underline underline-offset-4">Visit the GitHub profile</ExternalLink>.
      </div>
    )
  }
  return (
    <>
      {status.kind === 'snapshot' && (
        <p className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted" role="status">
          Showing saved GitHub data. {status.reason}
          <button type="button" onClick={onRetry} className="text-accent underline underline-offset-4">
            Retry
          </button>
        </p>
      )}
      <ul className="grid gap-5 md:grid-cols-2">
        {repos.map((r, i) => (
          <ProjectCard key={r.name} repo={r} override={descriptions[r.name]} lead={i === 0 && repos.length % 2 === 1} />
        ))}
      </ul>
      <p className="mt-10">
        <ExternalLink href={`${githubUrl}?tab=repositories`} className="group inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-ink">
          All repositories on GitHub <Arrow className="transition-transform group-hover:translate-x-0.5" />
        </ExternalLink>
      </p>
    </>
  )
}
