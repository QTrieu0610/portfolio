import { useEffect } from 'react'

/** Adds .is-visible to [data-reveal] elements as they scroll in. No-op without IntersectionObserver. */
export function useReveal(deps: unknown[]) {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    document.documentElement.classList.add('reveal-ready')
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -8% 0px' },
    )
    document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-scan when content changes
  }, deps)
}
