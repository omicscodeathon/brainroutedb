import Link from 'next/link'

const actions = [
  {
    label: 'Getting Started',
    href: '/getting-started',
    description: 'Read the database guide',
  },
  {
    label: 'Verify',
    href: '/verify',
    description: 'Review and submit BBB evidence',
  },
  {
    label: 'Search',
    href: '/search',
    description: 'Query molecules and tags',
  },
  {
    label: 'Visualize',
    href: '/visualize',
    description: 'Review distributions',
  },
  {
    label: 'Download',
    href: '/downloads',
    description: 'Export curated data',
  },
]

export function PortalActionMenu() {
  return (
    <aside className="border border-slate-200 bg-white/75 shadow-sm shadow-blue-900/5">
      <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4">
        <div className="text-sm font-bold uppercase text-slate-600">
          Actions
        </div>
      </div>
      <nav className="divide-y divide-slate-200">
        {actions.map((action) => {
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group block px-5 py-4 transition hover:bg-blue-50/80"
            >
              <span>
                <span className="block text-base font-bold text-slate-950">{action.label}</span>
                <span className="block text-sm text-slate-600">{action.description}</span>
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
