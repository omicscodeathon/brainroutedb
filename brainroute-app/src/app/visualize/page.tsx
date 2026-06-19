import { Suspense } from 'react'
import { VisualizeClient } from './VisualizeClient'

export default function VisualizePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 p-8 text-slate-700">
          Loading BrainRoute visualizations...
        </div>
      }
    >
      <VisualizeClient />
    </Suspense>
  )
}
