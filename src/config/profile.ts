/**
 * Everything GitHub cannot verify lives here. Edit freely.
 *
 * Rule of thumb: leave a field empty (null / []) rather than guessing.
 * Empty fields hide their UI; nothing is invented to fill the gap.
 */
export interface JourneyEntry {
  /** Free-form period label, e.g. "2025 — Present". */
  period: string
  title: string
  /** Organisation, school or context. Optional. */
  place?: string
  description?: string
  url?: string
}

export interface SkillGroup {
  label: string
  items: string[]
}

export interface ProfileConfig {
  githubUsername: string
  /** Shown under the name in the hero. Null hides it. */
  role: string | null
  /** One-line statement in the hero. Null falls back to verified GitHub facts. */
  tagline: string | null
  /** About paragraphs. Empty array falls back to the GitHub bio, then to verified facts only. */
  about: string[]
  /** Self-declared skills, shown separately from languages detected on GitHub. */
  skills: SkillGroup[]
  /** Self-declared experience / education / learning milestones. */
  journey: JourneyEntry[]
  contact: {
    email: string | null
    linkedin: string | null
    /** Any extra public links: { label, url }. */
    links: { label: string; url: string }[]
  }
  projects: {
    /** Repo names to feature, in display order. Empty = auto-pick by stars then recent activity. */
    featured: string[]
    /** Repo names never shown anywhere on the site. */
    hidden: string[]
    /** Max cards in the featured grid. */
    limit: number
    /** Optional per-repo copy that replaces the GitHub description (marked as author-written). */
    descriptions: Record<string, string>
  }
}

export const profile: ProfileConfig = {
  githubUsername: 'QTrieu0610',
  role: null,
  tagline: null,
  about: [],
  skills: [],
  journey: [],
  contact: {
    email: null,
    linkedin: null,
    links: [],
  },
  projects: {
    featured: ['tieru-agent', 'testing', 'abc'],
    hidden: [],
    limit: 6,
    descriptions: {},
  },
}
