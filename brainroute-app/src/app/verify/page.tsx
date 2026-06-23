import Link from 'next/link'
import {
  ArrowRight,
  ClipboardCheck,
  Database,
  FileArchive,
  FlaskConical,
  Globe2,
  LockKeyhole,
  SearchCheck,
  ShieldCheck,
} from 'lucide-react'
import { Header } from '@/src/components/Header'

const workflowSteps = [
  {
    title: 'Prepare experimental evidence',
    description:
      'Collect molecule identity, permeability result, experimental technique, methodology notes, source paper DOI, and supporting files.',
    icon: FlaskConical,
  },
  {
    title: 'Submit a verification record',
    description:
      'Use the verification form to provide researcher, lab, institution, molecule, technique, result, and evidence details.',
    icon: ClipboardCheck,
  },
  {
    title: 'Attach supporting files',
    description:
      'Upload papers, CSV tables, images, or result summaries so reviewers can inspect the source evidence.',
    icon: FileArchive,
  },
  {
    title: 'Review and connect to BrainRoute',
    description:
      'Pending submissions can be reviewed, downloaded, and later linked to molecule records as verified evidence.',
    icon: SearchCheck,
  },
]

const acceptedEvidence = [
  'In vitro BBB permeability assays such as MDCK, Caco-2, PAMPA-BBB, or related monolayer systems',
  'In vivo or ex vivo measurements when methodology and units are documented',
  'Published paper DOI, source table, supplementary data, or lab-generated result file',
  'Clear permeability outcome: permeable, moderate, or nonpermeable',
  'Molecule identifier such as name, SMILES, CASRN, or existing BrainRoute molecule ID',
]

const submissionFields = [
  'Molecule name, SMILES, or database ID',
  'Researcher, lab, and institution',
  'Technique used and experimental description',
  'Observed permeability result and raw result details',
  'Optional paper DOI and verification notes',
  'Supporting PDF, CSV, PNG, or JPEG files',
]

const visibilityChoices = [
  {
    title: 'Public submission',
    description:
      'The submission can appear in the past submissions list for all visitors, including users who are not signed in. Supporting files attached to a public submission can be opened from that public record.',
    icon: Globe2,
  },
  {
    title: 'Private submission',
    description:
      'The submission is linked to your signed-in account and is only shown to you in your profile and authenticated submission views.',
    icon: LockKeyhole,
  },
]

const savedInformation = [
  'Your account ID is saved with the submission so the record can appear in your profile.',
  'The molecule, experimental method, result details, notes, DOI, and uploaded supporting files are saved as part of the verification record.',
  'BrainRoute does not publish private submissions in the public past submissions list.',
  'Do not upload confidential or restricted data unless you are comfortable storing it in BrainRoute.',
]

export default function VerifyIntroPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase text-blue-700">Verification</p>
              <h1 className="mt-2 text-4xl font-bold text-slate-950">
                Verify BBB Permeability Evidence
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
                BrainRoute verification is designed for researchers who want to submit,
                document, and review experimental BBB permeability evidence before it is used
                as trusted context in the database.
              </p>
            </div>

            <aside className="border border-blue-200 bg-blue-50 p-5">
              <h2 className="text-sm font-bold uppercase text-blue-800">Ready to submit?</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Continue to the active verification workspace to submit a new record or review
                existing submissions.
              </p>
              <Link
                href="/verify-data"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-blue-700 bg-blue-700 px-5 py-4 text-base font-bold text-white transition hover:bg-blue-800"
              >
                Open verification workspace
                <ArrowRight className="h-5 w-5" />
              </Link>
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <section className="border border-blue-200 bg-white">
                <div className="border-b border-blue-100 bg-blue-50 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-blue-700" />
                    <h2 className="text-xl font-bold text-slate-950">
                      Before You Submit
                    </h2>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Verification submissions require sign-in so BrainRoute can connect each
                    record to the submitting account. At the end of the form, you choose whether
                    the submission is public or private.
                  </p>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2">
                  {visibilityChoices.map((choice) => {
                    const Icon = choice.icon
                    return (
                      <article key={choice.title} className="border border-slate-200 p-5">
                        <Icon className="h-6 w-6 text-blue-700" />
                        <h3 className="mt-4 text-lg font-bold text-slate-950">
                          {choice.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {choice.description}
                        </p>
                      </article>
                    )
                  })}
                </div>

                <div className="border-t border-slate-200 px-6 py-5">
                  <h3 className="text-sm font-bold uppercase text-slate-600">
                    What is saved
                  </h3>
                  <ul className="mt-3 grid gap-3 md:grid-cols-2">
                    {savedInformation.map((item) => (
                      <li key={item} className="text-sm leading-6 text-slate-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                  <h2 className="text-xl font-bold text-slate-950">Verification Workflow</h2>
                </div>
                <div className="grid gap-4 p-6 md:grid-cols-2">
                  {workflowSteps.map((step) => {
                    const Icon = step.icon
                    return (
                      <article key={step.title} className="border border-slate-200 p-5">
                        <Icon className="h-6 w-6 text-blue-700" />
                        <h3 className="mt-4 text-lg font-bold text-slate-950">{step.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {step.description}
                        </p>
                      </article>
                    )
                  })}
                </div>
              </section>

              <section className="border border-slate-200 bg-white p-6">
                <div className="flex items-start gap-4">
                  <Database className="h-7 w-7 shrink-0 text-blue-700" />
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">
                      How Verified Data Enters BrainRoute
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      New submissions are stored as verification records with pending status.
                      Supporting files are stored separately so reviewers can inspect methodology
                      and source evidence. After review, accepted records can be linked to an
                      existing molecule or used to support adding a new molecule, then marked as
                      user-verified in the database.
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      Verification does not make a prediction automatically. It records external
                      experimental evidence so BrainRoute can compare model output, curated
                      labels, and submitted measurements more transparently.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-bold text-slate-950">Accepted Evidence</h2>
                <ul className="mt-4 space-y-3">
                  {acceptedEvidence.map((item) => (
                    <li key={item} className="border-l-4 border-blue-600 pl-3 text-sm leading-6 text-slate-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-bold text-slate-950">What the Form Collects</h2>
                <ul className="mt-4 space-y-3">
                  {submissionFields.map((item) => (
                    <li key={item} className="text-sm leading-6 text-slate-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </div>
  )
}
