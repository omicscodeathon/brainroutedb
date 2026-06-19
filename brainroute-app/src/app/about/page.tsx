import Link from 'next/link'
import { ArrowRight, Github, Mail, ShieldCheck, Users } from 'lucide-react'
import { Header } from '@/src/components/Header'

const teamMembers = [
  {
    name: 'Soham Shirolkar',
    role: 'Project Lead, Lead Developer',
    email: 'sohamshirolkar24@gmail.com',
    affiliation: 'University of South Florida',
  },
  {
    name: 'Lewis Tem',
    role: 'Lead Developer',
    email: 'lewistem8@gmail.com',
    affiliation: 'Developer',
  },
  {
    name: 'Leah W. Cerere',
    role: 'Visualization & Documentation',
    email: 'leahcerere@gmail.com',
    affiliation: 'Designer',
  },
  {
    name: 'Noura E. Ahmed',
    role: 'Visualization & Documentation',
    email: 'nemase00@gmail.com',
    affiliation: 'Designer',
  },
  {
    name: 'Olaitan I. Awe',
    role: 'Project Supervision & Co-Lead',
    email: 'laitanawe@gmail.com',
    affiliation: 'Institute for Genomic Medicine Research',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase text-blue-700">About</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">About BrainRoute</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              BrainRoute is a public research database portal for blood-brain barrier
              permeability data. The project combines curated molecule records, computed
              descriptors, prediction outputs, and community verification workflows for CNS
              drug discovery research.
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
          <div className="space-y-6">
            <section className="border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-blue-700" />
                <h2 className="text-2xl font-bold text-slate-950">Project Focus</h2>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="border border-slate-200 p-4">
                  <h3 className="text-sm font-bold text-slate-950">Explore</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Query BBB labels, physicochemical descriptors, and drug candidacy filters.
                  </p>
                </div>
                <div className="border border-slate-200 p-4">
                  <h3 className="text-sm font-bold text-slate-950">Verify</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Accept experimental evidence from researchers to improve data confidence.
                  </p>
                </div>
                <div className="border border-slate-200 p-4">
                  <h3 className="text-sm font-bold text-slate-950">Predict</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Connect users to an external BBB permeability prediction workflow.
                  </p>
                </div>
              </div>
            </section>

            <section className="border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-700" />
                <h2 className="text-2xl font-bold text-slate-950">Project Team</h2>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {teamMembers.map((member) => (
                  <article key={member.email} className="border border-slate-200 p-5">
                    <h3 className="text-lg font-bold text-slate-950">{member.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-blue-700">{member.role}</p>
                    <p className="mt-1 text-sm text-slate-600">{member.affiliation}</p>
                    <a
                      href={`mailto:${member.email}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-blue-700"
                    >
                      <Mail className="h-4 w-4" />
                      {member.email}
                    </a>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-bold text-slate-950">Contact</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Questions, collaborations, and dataset feedback can be sent to the project leads.
              </p>
              <div className="mt-5 space-y-3">
                <a
                  href="mailto:sohamshirolkar24@gmail.com"
                  className="block border border-slate-200 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  sohamshirolkar24@gmail.com
                </a>
                <a
                  href="mailto:laitanawe@gmail.com"
                  className="block border border-slate-200 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  laitanawe@gmail.com
                </a>
              </div>
            </section>

            <section className="border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-bold text-slate-950">Source Code</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                BrainRoute is developed in the public repository for the Codeathon project.
              </p>
              <a
                href="https://github.com/omicscodeathon/brainroutedb"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                <Github className="h-4 w-4" />
                Open GitHub
              </a>
            </section>

            <section className="border border-blue-200 bg-blue-50 p-6">
              <h2 className="text-xl font-bold text-slate-950">Need the Data Guide?</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Definitions for BBB tags, CNS MPO, descriptors, and rule filters are now in
                Getting Started.
              </p>
              <Link
                href="/getting-started"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
              >
                Read Getting Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
