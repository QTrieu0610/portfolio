import { useMemo } from 'react'
import { Hero } from './components/Hero'
import { Nav, type NavItem } from './components/Nav'
import { Projects } from './components/Projects'
import { About, Contact, Footer, Journey, Skills } from './components/Sections'
import { Section } from './components/ui'
import { profile } from './config/profile'
import { languageShare, selectFeatured } from './lib/github'
import { useGitHubData } from './lib/useGitHubData'
import { useReveal } from './lib/useReveal'

const NAV: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

export default function App() {
  const { data, status, retry } = useGitHubData(profile.githubUsername)
  const { featured, hidden, limit, descriptions } = profile.projects
  const repos = useMemo(() => data?.repos ?? [], [data])
  const share = useMemo(() => languageShare(repos, hidden), [repos, hidden])
  const picked = useMemo(() => selectFeatured(repos, featured, hidden, limit), [repos, featured, hidden, limit])
  const visible = useMemo(() => repos.filter((r) => !r.fork && !hidden.includes(r.name)), [repos, hidden])
  const name = data?.user.name ?? profile.githubUsername
  const githubUrl = data?.user.htmlUrl ?? `https://github.com/${profile.githubUsername}`
  useReveal([data])

  return (
    <>
      <a href="#main" className="sr-only z-50 rounded-md bg-accent px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Nav items={NAV} brand={name.split(' ').at(-1) ?? name} />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero profile={profile} data={data} status={status} topLanguage={share[0]?.name ?? null} />
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Section id="about" index="01" title="About">
            <About profile={profile} data={data} languages={share.map((l) => l.name)} />
          </Section>
          <Section id="skills" index="02" title="Technical skills">
            <Skills profile={profile} share={share} />
          </Section>
          <Section id="projects" index="03" title="Featured projects">
            <Projects repos={picked} status={status} descriptions={descriptions} githubUrl={githubUrl} onRetry={retry} hasData={Boolean(data)} />
          </Section>
          <Section id="journey" index="04" title="Learning journey">
            <Journey profile={profile} data={data} repos={visible} />
          </Section>
          <Section id="contact" index="05" title="Contact">
            <Contact profile={profile} githubUrl={githubUrl} />
          </Section>
        </div>
      </main>
      <Footer name={name} githubUrl={githubUrl} repos={picked} />
    </>
  )
}
