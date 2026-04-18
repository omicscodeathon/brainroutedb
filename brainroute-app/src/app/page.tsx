/**
 * Home Landing Page
 * Entry point for the BrainRoute platform
 */

import Link from 'next/link'
import { Header } from '@/src/components/Header'
import { ArrowRight, Database, Zap, Share2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight">
              BrainRoute
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              A blood-brain barrier permeability platform where users can explore, query, and
              access BBB permeability data and insights.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Why BrainRoute?</h2>
            <p className="mt-4 text-xl text-gray-600">
              A comprehensive platform for BBB permeability research
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Database className="h-8 w-8 text-blue-600" />,
                title: 'Comprehensive Dataset',
                description:
                  'Access thousands of molecules with detailed BBB permeability classifications and drug-like property assessments.',
              },
              {
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                title: 'Fast Filtering',
                description:
                  'Query molecules by drug rules (Lipinski, Veber, Egan, Ghose), structural properties, and physicochemical characteristics.',
              },
              {
                icon: <Share2 className="h-8 w-8 text-blue-600" />,
                title: 'Easy Export',
                description:
                  'Download filtered datasets as CSV and integrate with your research workflows seamlessly.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-lg p-8 border border-gray-200 hover:shadow-lg transition"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Cards Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Get Started</h2>
            <p className="mt-4 text-xl text-gray-600">
              Choose how you'd like to interact with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Know Your Data Card */}
            <Link
              href="/know-your-data"
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:scale-105 transition border border-gray-200"
            >
              <div className="mb-4">
                <div className="inline-block p-3 bg-blue-100 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Know Your Data</h3>
              <p className="text-gray-600 mb-6">
                Explore the BBB dataset with interactive filters, visualizations, and insights.
                Filter by drug rules, molecular properties, and structural features.
              </p>
              <div className="flex items-center text-blue-600 font-semibold group">
                Explore Data
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Verify Data Card */}
            <Link
              href="/verify-data"
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:scale-105 transition border border-gray-200"
            >
              <div className="mb-4">
                <div className="inline-block p-3 bg-green-100 rounded-lg">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Verify Data</h3>
              <p className="text-gray-600 mb-6">
                Submit your experimental BBB permeability results and verify molecules in our
                database. Help us improve our models with verified data.
              </p>
              <div className="flex items-center text-green-600 font-semibold group">
                Submit Results
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Prediction Tool Card */}
            <a
              href={process.env.NEXT_PUBLIC_STREAMLIT_APP_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:scale-105 transition border border-gray-200"
            >
              <div className="mb-4">
                <div className="inline-block p-3 bg-indigo-100 rounded-lg">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Prediction Tool
              </h3>
              <p className="text-gray-600 mb-6">
                Use our machine learning model to predict BBB permeability for novel molecules.
                Access the integrated Streamlit application.
              </p>
              <div className="flex items-center text-indigo-600 font-semibold group">
                Launch Tool
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition" />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">BrainRoute</h3>
              <p className="text-sm">
                A comprehensive platform for blood-brain barrier permeability research.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/about" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="/know-your-data" className="hover:text-white transition">
                    Data Explorer
                  </a>
                </li>
                <li>
                  <a
                    href={process.env.NEXT_PUBLIC_STREAMLIT_APP_URL || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                  >
                    Prediction Tool
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Information</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>© 2026 BrainRoute. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
