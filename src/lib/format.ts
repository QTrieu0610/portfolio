const langColor: Record<string, string> = {
  Python: '#6f9fd8', TypeScript: '#5b8fd6', JavaScript: '#e6cf5c', HTML: '#e2734f', CSS: '#8c6bd6',
  Shell: '#8fc46a', PowerShell: '#5aa0c8', Dockerfile: '#4f8fb0', PLpgSQL: '#6c8fa8', Makefile: '#a38a5c',
  Go: '#5ec8d8', Rust: '#d39a72', Java: '#c98a4a', 'C++': '#e0668f', C: '#9a9a9a', Kotlin: '#a77ce6',
}
export const colorFor = (lang: string) => langColor[lang] ?? '#7d7c72'

export const dateFmt = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' })
export const formatDate = (iso: string) => dateFmt.format(new Date(iso))

/** Evaluated once at load, not on every render. */
export const currentYear = new Date().getFullYear()
