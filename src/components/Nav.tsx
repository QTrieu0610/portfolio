import { useEffect, useState } from 'react'

export interface NavItem {
  id: string
  label: string
}

export function Nav({ items, brand }: { items: NavItem[]; brand: string }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  // Highlight the section currently crossing the upper third of the viewport.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-30% 0px -65% 0px' },
    )
    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [items])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const link = (item: NavItem, extra = '') => (
    <a
      href={`#${item.id}`}
      onClick={() => setOpen(false)}
      aria-current={active === item.id ? 'location' : undefined}
      className={`font-mono text-[0.8rem] tracking-wide transition-colors hover:text-ink aria-[current]:text-accent ${extra} ${active === item.id ? '' : 'text-muted'}`}
    >
      {item.label}
    </a>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-md">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="font-display text-lg font-semibold tracking-tight" onClick={() => setOpen(false)}>
          {brand}
          <span className="text-accent">.</span>
        </a>
        <ul className="hidden gap-7 md:flex">
          {items.map((item) => (
            <li key={item.id}>{link(item)}</li>
          ))}
        </ul>
        <button
          type="button"
          className="-mr-2 rounded-md p-2 text-muted hover:text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </nav>
      {open && (
        <ul id="mobile-menu" className="border-t border-line px-5 pb-5 pt-2 md:hidden">
          {items.map((item) => (
            <li key={item.id}>{link(item, 'block py-3 text-base')}</li>
          ))}
        </ul>
      )}
    </header>
  )
}
