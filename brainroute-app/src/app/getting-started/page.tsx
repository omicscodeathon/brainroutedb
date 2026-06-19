import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock, Database, FileText } from 'lucide-react'
import { Header } from '@/src/components/Header'

const whatsNew = [
  'Current database portal with workflow-oriented navigation',
  'Know Your Data explorer with filters, data preview, insights, and export',
  'Verify Data workflow for researcher-submitted experimental evidence',
  'Molecule detail pages with computed properties and BrainRoute tags',
  'External Streamlit prediction tool for novel molecule screening',
  'Static GitHub Pages deployment for broad public access',
]

const workInProgress = [
  'More detailed visualization page',
  'Batch prediction',
  'Molecule similarity search',
  'Downloadable curated datasets',
  'External validation data expansion',
  'Improved molecule cards',
  'Model confidence and uncertainty display',
  'Better integration between predicted molecules and verified molecules',
]

const metricSections = [
  {
    title: 'BrainRoute Labels',
    items: [
      {
        name: 'BBB permeability label / BBB tag',
        description:
          'Classifies a molecule as BBB permeable, non-permeable, or otherwise tagged by the available source and prediction workflow.',
      },
      {
        name: 'Prediction confidence',
        description:
          'A model confidence value for predicted molecules. Use it as a screening aid alongside experimental evidence.',
      },
      {
        name: 'Tags: training, predicted, verified',
        description:
          'Training molecules support model development, predicted molecules come from the external prediction tool, and verified molecules have user-submitted review evidence.',
      },
      {
        name: 'Profile JSON',
        description:
          'Extended metadata used when a molecule has richer provenance, computed fields, or exportable profile information.',
      },
    ],
  },
  {
    title: 'Physicochemical Metrics',
    items: [
      {
        name: 'CNS MPO score',
        description:
          'A multiparameter score summarizing CNS-like balance across lipophilicity, molecular weight, TPSA, hydrogen-bond donors, and ionization-related behavior. BrainRoute uses an approximate score when true LogD is unavailable.',
      },
      {
        name: 'Molecular weight',
        description:
          'The molecule mass in daltons. Larger molecules generally have reduced BBB permeability.',
      },
      {
        name: 'LogP',
        description:
          'Octanol-water partition coefficient used as a lipophilicity estimate for membrane permeability.',
      },
      {
        name: 'LogD approximation',
        description:
          'Distribution coefficient estimate when present. For some predicted records, LogP may stand in when a dedicated LogD calculation is unavailable.',
      },
      {
        name: 'TPSA',
        description:
          'Topological polar surface area. Highly polar molecules often struggle to cross the blood-brain barrier.',
      },
      {
        name: 'H bond donors and acceptors',
        description:
          'Counts of hydrogen-bonding groups that influence solubility, permeability, and drug-likeness.',
      },
    ],
  },
  {
    title: 'Structure Metrics',
    items: [
      {
        name: 'Rotatable bonds',
        description:
          'A flexibility measure used by Veber-style permeability and bioavailability screens.',
      },
      {
        name: 'Ring count',
        description:
          'Number of ring systems, useful for structural complexity and drug-likeness review.',
      },
      {
        name: 'Heterocycle presence',
        description:
          'Marks molecules containing rings with heteroatoms, a common medicinal chemistry motif.',
      },
      {
        name: 'Aromaticity',
        description:
          'Identifies aromatic molecules, which can affect metabolic stability and binding behavior.',
      },
    ],
  },
  {
    title: 'Drug Candidacy Rules',
    items: [
      {
        name: 'Lipinski rule',
        description:
          'Oral drug-likeness rule using molecular weight, LogP, hydrogen-bond donors, and hydrogen-bond acceptors.',
      },
      {
        name: 'Veber rule',
        description:
          'Bioavailability guideline based on TPSA and rotatable bond count.',
      },
      {
        name: 'Egan rule',
        description:
          'Permeability-oriented guideline using LogP and TPSA, relevant to BBB triage.',
      },
      {
        name: 'Ghose rule',
        description:
          'Defines drug-like chemical space by molecular weight, LogP, and molar refractivity.',
      },
      {
        name: 'PAINS flag',
        description:
          'Marks pan-assay interference patterns that can produce misleading biological assay signals.',
      },
    ],
  },
]

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase text-blue-700">Help</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">Getting Started</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              BrainRoute is a BBB permeability platform for exploring, querying, downloading,
              verifying, and predicting molecule-level blood-brain barrier information.
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
          <aside className="h-fit border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-bold uppercase text-slate-600">Start Here</h2>
            <nav className="mt-4 space-y-2 text-sm font-semibold">
              <Link href="/search" className="block text-blue-700 hover:text-blue-900">
                Search molecules
              </Link>
              <Link href="/know-your-data" className="block text-blue-700 hover:text-blue-900">
                Explore filters
              </Link>
              <Link href="/downloads" className="block text-blue-700 hover:text-blue-900">
                Download data
              </Link>
              <Link href="/verify-data" className="block text-blue-700 hover:text-blue-900">
                Verify records
              </Link>
            </nav>
          </aside>

          <div className="space-y-6">
            <section className="border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-blue-700" />
                <h2 className="text-2xl font-bold text-slate-950">About BrainRoute</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                BrainRoute brings BBB permeability records into a searchable database portal.
                Researchers can filter by molecular descriptors, inspect prediction and
                verification tags, download CSV exports, and move from database records to the
                external prediction workflow when screening new molecules.
              </p>
            </section>

            <section className="border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-700" />
                <h2 className="text-2xl font-bold text-slate-950">What's New</h2>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {whatsNew.map((item) => (
                  <div key={item} className="border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-amber-700" />
                <h2 className="text-2xl font-bold text-slate-950">Work in Progress</h2>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {workInProgress.map((item) => (
                  <div key={item} className="border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-700" />
                <h2 className="text-2xl font-bold text-slate-950">
                  Metrics Calculated in BrainRoute
                </h2>
              </div>
              <div className="mt-6 space-y-6">
                {metricSections.map((section) => (
                  <section key={section.title} className="border-t border-slate-200 pt-5">
                    <h3 className="text-lg font-bold text-slate-950">{section.title}</h3>
                    <dl className="mt-4 grid gap-4 md:grid-cols-2">
                      {section.items.map((item) => (
                        <div key={item.name} className="border border-slate-200 p-4">
                          <dt className="text-sm font-bold text-slate-900">{item.name}</dt>
                          <dd className="mt-2 text-sm leading-6 text-slate-600">
                            {item.description}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ))}
              </div>
            </section>

            <section className="border border-blue-200 bg-blue-50 p-6">
              <h2 className="text-xl font-bold text-slate-950">Ready to explore?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Start with database search, then narrow results with the full filter panel.
              </p>
              <Link
                href="/search"
                className="mt-5 inline-flex items-center gap-2 border border-blue-700 bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Search BrainRoute
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
