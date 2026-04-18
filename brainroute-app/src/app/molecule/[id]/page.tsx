/**
 * Individual Molecule Detail Page
 * Shows comprehensive information about a specific molecule
 */

import { Header } from '@/src/components/Header'
import { MoleculeDetail } from './MoleculeDetail'
import { getAllMoleculeIds } from '@/lib/queries/brainroute'

// Generate static pages for all molecules (runs at build time)
export async function generateStaticParams() {
  try {
    const ids = await getAllMoleculeIds()
    return ids.map((id) => ({
      id: String(id),
    }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

interface PageProps {
  params: {
    id: string
  }
}

export default function MoleculeDetailPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MoleculeDetail moleculeId={params.id} />
    </div>
  )
}

