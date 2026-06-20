'use client'

import React from 'react'
import { AuthProvider } from '@/src/components/auth/AuthProvider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
