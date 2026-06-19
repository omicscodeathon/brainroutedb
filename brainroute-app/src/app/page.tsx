import Link from 'next/link'
import { ArrowRight, Database, FileCheck2, ShieldCheck, Sparkles } from 'lucide-react'
import { Header } from '@/src/components/Header'
import { PortalActionMenu } from '@/src/components/portal/PortalActionMenu'
import { ExploreBrainRouteChart } from '@/src/components/portal/ExploreBrainRouteChart'
import { RecentlyAddedMoleculeCard } from '@/src/components/portal/RecentlyAddedMoleculeCard'
import { PortalSearchBox } from '@/src/components/portal/PortalSearchBox'

const resourceCards = [
  {
    title: 'Know Your Data',
    href: '/know-your-data',
    icon: Database,
    description:
      'Use interactive filters, table previews, and summary charts to inspect the current BrainRoute dataset.',
  },
  {
    title: 'Verify Data',
    href: '/verify',
    icon: FileCheck2,
    description:
      'Submit experimental BBB permeability evidence and help reconcile predictions with reviewed records.',
  },
  {
    title: 'Getting Started',
    href: '/getting-started',
    icon: ShieldCheck,
    description:
      'Review the meaning of BrainRoute labels, calculated metrics, tags, and current development status.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-50">
      <Header />

      <main>
        <section className="border-b border-blue-100 bg-blue-50">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8">
            <div className="space-y-6">
              <PortalActionMenu />
              <RecentlyAddedMoleculeCard />
            </div>

            <div className="space-y-6">
              <section className="border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                  <p className="text-sm font-bold uppercase text-blue-700">
                    BrainRoute Database
                  </p>
                </div>
                <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[minmax(0,1fr)_300px]">
                  <div>
                    <h1 className="text-4xl font-bold text-slate-950 sm:text-5xl">
                      Explore BrainRoute
                    </h1>
                    <p className="mt-4 max-w-4xl text-base leading-7 text-slate-700">
                      Search blood-brain barrier permeability data across molecule properties,
                      predictions, verification tags, and downloadable research-ready records.
                    </p>
                    <div className="mt-6">
                      <PortalSearchBox />
                    </div>
                  </div>
                  <aside className="border border-blue-200 bg-blue-50 p-5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-700" />
                      <h2 className="text-sm font-bold uppercase text-blue-800">
                        Prediction Tool
                      </h2>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      Run a BBB permeability prediction for a new molecule, then return here to
                      compare it with curated BrainRoute records.
                    </p>
                    <a
                      href={
                        process.env.NEXT_PUBLIC_STREAMLIT_APP_URL ||
                        'https://brainroute.streamlit.app/'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-blue-700 bg-blue-700 px-5 py-4 text-base font-bold text-white shadow-sm transition hover:bg-blue-800"
                    >
                      Launch prediction tool
                      <ArrowRight className="h-5 w-5" />
                    </a>
                  </aside>
                </div>
              </section>

              <ExploreBrainRouteChart />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {resourceCards.map((card) => {
              const Icon = card.icon
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-blue-200 bg-blue-50 text-blue-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-slate-950">{card.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {card.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                        Open resource
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
