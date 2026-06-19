import Link from 'next/link'
import {
  Database,
  Download,
  FileCheck2,
  FlaskConical,
  Network,
  Search,
} from 'lucide-react'

const actions = [
  {
    label: 'Getting Started',
    href: '/getting-started',
    description: 'Read the database guide',
    icon: FlaskConical,
  },
  {
    label: 'Verify',
    href: '/verify',
    description: 'Review and submit BBB evidence',
    icon: FileCheck2,
  },
  {
    label: 'Search',
    href: '/search',
    description: 'Query molecules and tags',
    icon: Search,
  },
  {
    label: 'Visualize',
    href: '/visualize',
    description: 'Review distributions',
    icon: Network,
  },
  {
    label: 'Download',
    href: '/downloads',
    description: 'Export curated data',
    icon: Download,
  },
]

export function PortalActionMenu() {
  return (
    <aside className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase text-slate-600">
          <Database className="h-4 w-4 text-blue-700" />
          Actions
        </div>
      </div>
      <nav className="divide-y divide-slate-200">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-4 px-5 py-4 transition hover:bg-blue-50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-slate-200 bg-white text-blue-700 transition group-hover:border-blue-200">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-950">{action.label}</span>
                <span className="block text-xs text-slate-600">{action.description}</span>
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
