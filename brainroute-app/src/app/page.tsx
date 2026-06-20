import Link from 'next/link'
import { Header } from '@/src/components/Header'
import { PortalActionMenu } from '@/src/components/portal/PortalActionMenu'
import { ExploreBrainRouteChart } from '@/src/components/portal/ExploreBrainRouteChart'
import { RecentlyAddedMoleculeCard } from '@/src/components/portal/RecentlyAddedMoleculeCard'
import { PortalSearchBox } from '@/src/components/portal/PortalSearchBox'
import { OpenPredictionToolButton } from '@/src/components/auth/OpenPredictionToolButton'

const resourceCards = [
  {
    title: 'Know Your Data',
    href: '/know-your-data',
    description:
      'Use interactive filters, table previews, and summary charts to inspect the current BrainRoute dataset.',
  },
  {
    title: 'Verify Data',
    href: '/verify',
    description:
      'Submit experimental BBB permeability evidence and help reconcile predictions with reviewed records.',
  },
  {
    title: 'Getting Started',
    href: '/getting-started',
    description:
      'Review the meaning of BrainRoute labels, calculated metrics, tags, and current development status.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-100">
      <Header />

      <main>
        <section className="border-b border-blue-200/60 bg-blue-100/60">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8">
            <div className="space-y-6">
              <PortalActionMenu />
              <RecentlyAddedMoleculeCard />
            </div>

            <div className="space-y-6">
              <section className="border border-slate-200 bg-white/75 shadow-sm shadow-blue-900/5">
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
                  <aside className="border border-blue-200 bg-blue-50/75 p-5">
                    <div>
                      <h2 className="text-sm font-bold uppercase text-blue-800">
                        Prediction Tool
                      </h2>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      Run a BBB permeability prediction for a new molecule, then return here to
                      compare it with curated BrainRoute records.
                    </p>
                    <OpenPredictionToolButton
                      label="Launch prediction tool"
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-blue-700 bg-blue-700 px-5 py-4 text-base font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                    />
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
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group border border-slate-200 bg-white/75 p-6 shadow-sm shadow-blue-900/5 transition hover:border-blue-200 hover:bg-blue-50/80"
                >
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">{card.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {card.description}
                    </p>
                    <span className="mt-4 inline-flex text-sm font-bold text-blue-700">
                      Open resource
                    </span>
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
