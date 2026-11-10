'use client'

import { useEffect, useState } from 'react'

/** Background video on larger screens; poster image only on mobile / reduced motion. */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPlay(wide.matches && !calm.matches)
    update()
    wide.addEventListener('change', update)
    calm.addEventListener('change', update)
    return () => {
      wide.removeEventListener('change', update)
      calm.removeEventListener('change', update)
    }
  }, [])

  return (
    <div className="hero-media" aria-hidden="true" style={{ backgroundImage: `url(${poster})` }}>
      {play && <video src={src} poster={poster} autoPlay muted loop playsInline preload="auto" />}
      <div className="hero-shade" />
    </div>
  )
}
