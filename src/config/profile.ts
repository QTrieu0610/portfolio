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
  role: 'AI Engineer at FPT Software',
  tagline: 'Building computer vision, video analysis, and LLM-powered applications.',
  about: [
    'I am Vo Quang Trieu, an AI Engineer at FPT Software since March 2026 and an Artificial Intelligence graduate of FPT University, Quy Nhon AI Campus. I build Python applications focused on computer vision, video understanding, and LLM workflows.',
    'My projects include sensitive-content masking with YOLOv11 and CUDA, automatic football highlight generation with temporal and Transformer models, and badminton match analysis with PyTorch and OpenCV. I also work with FastAPI, LangChain, LangGraph, and browser automation.',
  ],
  skills: [
    { label: 'Languages & backend', items: ['Python', 'JavaScript', 'HTML', 'CSS', 'FastAPI'] },
    { label: 'AI & computer vision', items: ['PyTorch', 'OpenCV', 'Ultralytics', 'CNN', 'Transformers', 'CLIP', 'OCR'] },
    { label: 'LLM applications & automation', items: ['RAG', 'LangChain', 'LangGraph', 'LLM APIs', 'Playwright'] },
    { label: 'Data & infrastructure', items: ['Pandas', 'Matplotlib', 'FFmpeg', 'Docker', 'Git', 'AWS', 'MySQL', 'SQL Server', 'PostgreSQL', 'Linux'] },
  ],
  journey: [
    { period: '2026', title: 'AI Engineer for Data Scientists Associate certificate' },
    { period: '2026', title: 'AI-Driven Infrastructure as Code (IaC) and Cloud Automation' },
    { period: 'Mar 2026 - Present', title: 'AI Engineer', place: 'FPT Software' },
    { period: 'Credential', title: 'Claude Certified Architect - Foundations', place: 'Anthropic', url: 'https://www.credly.com/badges/3fc9ba71-b9f4-4ae1-bcf9-e5a31d5f2172' },
    { period: 'Jun 2026 — Present', title: 'Adaptive AI Crawler (Mock Project)', description: 'Developing browser-based data extraction with session persistence in a three-person team.' },
    { period: 'May — Aug 2025', title: 'AI-based Sensitive Content Masking System', description: 'Optimized a real-time video detection and blurring pipeline with YOLOv11, CUDA, and Python multiprocessing/threading in a three-person team.' },
    { period: 'May — Aug 2025', title: 'AI Video Highlight Generation System', description: 'Developed an automatic highlight pipeline inspired by SoccerNetv2, using TPN and Transformer models for action spotting, ResNet-152 and CLIP for feature extraction, and inference caching.' },
    { period: 'Jan — Mar 2025', title: 'Badminton Match Analysis System', description: 'Built court keypoint detection, shuttlecock tracking, and mini-court visualization with YOLOv11, ResNet50, PyTorch, and OpenCV.' },
    { period: 'Sep 2022 — 2026', title: 'Bachelor of Artificial Intelligence (Graduated)', place: 'FPT University — Quy Nhon AI Campus' },
  ],
  contact: {
    email: 'TrieuVQ2@fpt.com',
    linkedin: 'https://www.linkedin.com/in/trieuvoquang0610/',
    links: [],
  },
  projects: {
    featured: ['tieru-agent', 'testing', 'abc'],
    hidden: [],
    limit: 6,
    descriptions: {},
  },
}
