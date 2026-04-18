import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BrainRoute - BBB Permeability Platform',
  description: 'A blood-brain barrier permeability platform where users can explore, query, and access BBB permeability data and insights.',
  keywords: ['BBB', 'permeability', 'drug discovery', 'molecules', 'database'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
