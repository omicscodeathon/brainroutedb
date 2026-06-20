'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'

function getPredictionToolUrl() {
  return process.env.NEXT_PUBLIC_STREAMLIT_APP_URL || 'https://brainroute.streamlit.app/'
}

export function OpenPredictionToolButton({
  className,
  label = 'Prediction Tool',
}: {
  className?: string
  label?: string
}) {
  const { user, isAuthReady, isLoggedIn, createPredictionHandoff } = useAuth()
  const [isOpening, setIsOpening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpen = async () => {
    setError(null)

    if (!isAuthReady) {
      setError('Account is still loading. Try again in a moment.')
      return
    }

    setIsOpening(true)

    try {
      const url = new URL(getPredictionToolUrl())

      if (isLoggedIn && user?.id) {
        const code = await createPredictionHandoff(user.id)
        url.searchParams.set('handoff', code)
      }

      window.open(url.toString(), '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Failed to create prediction handoff:', error)
      setError(
        isLoggedIn
          ? 'Could not connect your BrainRoute account to the prediction tool.'
          : 'Could not open the prediction tool.'
      )
    } finally {
      setIsOpening(false)
    }
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={handleOpen}
        disabled={isOpening || !isAuthReady}
        className={
          className ||
          'inline-flex items-center gap-1.5 rounded border border-blue-200 bg-blue-50 px-3 py-2 text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60'
        }
      >
        {isOpening ? 'Opening...' : label}
      </button>
      {error && (
        <span className="max-w-56 text-xs font-semibold text-red-700">
          {error}
        </span>
      )}
    </span>
  )
}
