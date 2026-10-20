import type { ProfileConfig } from '../config/profile'
import type { GitHubData, GitHubRepo } from '../lib/github'
import { colorFor, currentYear, formatDate } from '../lib/format'
import { Arrow, ExternalLink, GitHubIcon } from './ui'

const listFmt = new Intl.ListFormat('en', { type: 'conjunction' })

export function About({ profile, data, languages }: { profile: ProfileConfig; data: GitHubData | null; languages: string[] }) {
  const user = data?.user
  const name = user?.name ?? profile.githubUsername
  // Precedence: author-written copy > GitHub bio > sentences built only from verified data.
  const paragraphs = profile.about.length
    ? profile.about
    : user?.bio
      ? [user.bio]
      : [
          `${name} publishes code on GitHub${user?.location ? ` from ${user.location}` : ''}.`,
          ...(languages.length ? [`Public repositories are written mostly in ${listFmt.format(languages.slice(0, 3))}.`] : []),
        ]
  return (
    <div className="grid gap-10 md:grid-cols-[1fr_16rem]">
      <div data-reveal className="max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {!profile.about.length && (
        <p data-reveal className="self-start border-l border-line pl-4 font-mono text-xs leading-relaxed text-faint">
          {user?.bio ? 'From the public GitHub bio.' : 'Generated only from public GitHub data; no claims beyond it.'}
        </p>
      )}
    </div>
  )
}

export function Skills({ profile, share }: { profile: ProfileConfig; share: { name: string; share: number }[] }) {
  const top = share.slice(0, 8)
  const alone = profile.skills.length === 0
  return (
    <div className={alone ? '' : 'grid gap-12 lg:grid-cols-2'}>
      <div data-reveal>
        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">Languages in public repositories</h3>
        {top.length ? (
          <ul className={`mt-6 grid gap-x-14 gap-y-4 ${alone ? 'md:grid-cols-2' : ''}`}>
            {top.map((l) => (
              <li key={l.name}>
                <div className="flex justify-between text-sm">
                  <span>{l.name}</span>
                  <span className="font-mono text-faint">{Math.max(1, Math.round(l.share * 100))}%</span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-raised" aria-hidden="true">
                  <div className="h-full rounded-full" style={{ width: `${Math.max(2, l.share * 100)}%`, background: colorFor(l.name) }} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-muted">No language data available yet.</p>
        )}
        <p className="mt-6 font-mono text-[0.7rem] leading-relaxed text-faint">
          Share of code per repository, averaged across public non-fork repositories (GitHub linguist data).
        </p>
      </div>
      {profile.skills.length > 0 && (
        <div data-reveal className="space-y-8">
          {profile.skills.map((g) => (
            <div key={g.label}>
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">{g.label}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li key={s} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface TimelineItem {
  key: string
  period: string
  sort: string
  title: string
  place?: string
  description?: string
  url?: string
  source: 'github' | 'author'
}

export function Journey({ profile, data, repos }: { profile: ProfileConfig; data: GitHubData | null; repos: GitHubRepo[] }) {
  const authored: TimelineItem[] = profile.journey.map((j, i) => ({ ...j, key: `a${i}`, sort: '', source: 'author' }))
  const fromGitHub: TimelineItem[] = [
    ...repos.map((r) => ({
      key: r.name,
      period: formatDate(r.createdAt),
      sort: r.createdAt,
      title: `Started ${r.name}`,
      description: r.description ?? undefined,
      url: r.htmlUrl,
      source: 'github' as const,
    })),
    ...(data ? [{ key: 'joined', period: formatDate(data.user.createdAt), sort: data.user.createdAt, title: 'Joined GitHub', url: data.user.htmlUrl, source: 'github' as const }] : []),
  ].sort((a, b) => b.sort.localeCompare(a.sort))
  const items = [...authored, ...fromGitHub]
  if (!items.length) return <p className="text-muted">Nothing to show yet.</p>
  return (
    <ol className="relative max-w-3xl border-l border-line">
      {items.map((it) => (
        <li key={it.key} data-reveal className="relative pb-10 pl-8 last:pb-0">
          <span
            aria-hidden="true"
            className={`absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border-2 border-bg ${it.source === 'author' ? 'bg-accent' : 'bg-faint'}`}
          />
          <p className="font-mono text-xs uppercase tracking-wider text-faint">
            {it.period}
            <span className="ml-3 normal-case tracking-normal">· {it.source === 'github' ? 'from GitHub' : 'self-reported'}</span>
          </p>
          <h3 className="mt-1.5 font-display text-lg font-medium">
            {it.url ? (
              <ExternalLink href={it.url} className="underline-offset-4 hover:text-accent hover:underline">
                {it.title}
              </ExternalLink>
            ) : (
              it.title
            )}
            {it.place && <span className="text-muted"> · {it.place}</span>}
          </h3>
          {it.description && <p className="mt-1.5 max-w-2xl text-muted">{it.description}</p>}
        </li>
      ))}
    </ol>
  )
}

export function Contact({ profile, githubUrl }: { profile: ProfileConfig; githubUrl: string }) {
  const { email, linkedin, links } = profile.contact
  const channels = [
    ...(email ? [{ label: 'Email', value: email, href: `mailto:${email}`, external: false }] : []),
    { label: 'GitHub', value: githubUrl.replace('https://', ''), href: githubUrl, external: true },
    ...(linkedin ? [{ label: 'LinkedIn', value: linkedin.replace(/^https?:\/\/(www\.)?/, ''), href: linkedin, external: true }] : []),
    ...links.map((l) => ({ label: l.label, value: l.url.replace(/^https?:\/\//, ''), href: l.url, external: true })),
  ]
  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
      <p data-reveal className="max-w-md font-display text-2xl leading-snug md:text-3xl">
        {email ? 'Have a project or question? My inbox is open.' : 'The best way to reach me right now is through GitHub.'}
      </p>
      <ul data-reveal className="divide-y divide-line border-y border-line">
        {channels.map((c) => {
          const inner = (
            <>
              <span className="font-mono text-xs uppercase tracking-wider text-faint">{c.label}</span>
              <span className="flex min-w-0 items-center gap-2 truncate text-ink group-hover:text-accent">
                <span className="truncate">{c.value}</span>
                <Arrow className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </>
          )
          const cls = 'group flex items-center justify-between gap-6 py-5'
          return (
            <li key={c.label}>
              {c.external ? <ExternalLink href={c.href} className={cls}>{inner}</ExternalLink> : <a href={c.href} className={cls}>{inner}</a>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function Footer({ name, githubUrl, repos }: { name: string; githubUrl: string; repos: GitHubRepo[] }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <ExternalLink href={githubUrl} className="inline-flex items-center gap-2 font-display text-lg hover:text-accent">
            <GitHubIcon /> {name}
          </ExternalLink>
          <p className="mt-3 max-w-sm text-sm text-faint">
            Built with React, Vite and Tailwind CSS. Project data from the public GitHub REST API.
          </p>
        </div>
        {repos.length > 0 && (
          <nav aria-label="Repositories">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-muted">
              {repos.map((r) => (
                <li key={r.name}>
                  <ExternalLink href={r.htmlUrl} className="hover:text-ink">{r.name}</ExternalLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <p className="mx-auto max-w-6xl px-5 pb-10 font-mono text-xs text-faint md:px-8">© {currentYear} {name}</p>
    </footer>
  )
}
