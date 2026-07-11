'use client'

import dynamic from 'next/dynamic'

// Three.js must not be SSR'd
const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700" />
    </div>
  ),
})

export default function SceneLoader() {
  return <Scene />
}
