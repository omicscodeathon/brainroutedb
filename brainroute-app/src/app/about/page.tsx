'use client'

import React from 'react'
import { Header } from '@/src/components/Header'
import { CheckCircle2, Beaker, Filter, Database } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b-2 border-gray-200 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">About BrainRoute</h1>
          <p className="text-lg text-gray-700">
            Advancing drug discovery through comprehensive blood-brain barrier permeability predictions
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Platform Overview */}
        <section className="bg-white rounded-lg shadow p-8">
          <div className="flex gap-4 mb-4">
            <Database className="h-8 w-8 text-blue-600 flex-shrink-0" />
            <h2 className="text-2xl font-bold text-gray-900">What is BrainRoute?</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            BrainRoute is a comprehensive platform for predicting and analyzing blood-brain barrier (BBB) permeability of small molecules. Our platform integrates experimental data, computational predictions, and advanced filtering criteria to help researchers identify promising drug candidates for neurological applications.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The platform contains a curated dataset of 3,800+ molecules with computed physicochemical and structural properties, filtered through multiple drug candidacy rules to provide reliable predictions for BBB penetration.
          </p>
        </section>

        {/* How It Works */}
        <section className="bg-white rounded-lg shadow p-8">
          <div className="flex gap-4 mb-6">
            <Beaker className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">1. Data Collection</h3>
              <p className="text-gray-700">
                We aggregate molecular data from existing databases and experimental studies, focusing on compounds with known BBB permeability profiles.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">2. Property Calculation</h3>
              <p className="text-gray-700">
                Physicochemical and structural properties are computed for each molecule using the PADEL tool, including molecular weight, logP, polar surface area, and more.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">3. Multi-Filter Classification</h3>
              <p className="text-gray-700">
                Molecules are evaluated against five industry-standard drug candidacy rules (Lipinski, Veber, Egan, Ghose, and PAINS) to ensure data quality and drug-likeness.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">4. Prediction & Verification</h3>
              <p className="text-gray-700">
                BBB permeability is predicted using machine learning models. Researchers can contribute experimental data to verify predictions and improve model accuracy.
              </p>
            </div>
          </div>
        </section>

        {/* Classification & Filters */}
        <section className="bg-white rounded-lg shadow p-8">
          <div className="flex gap-4 mb-8">
            <Filter className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <h2 className="text-2xl font-bold text-gray-900">Classification Filters</h2>
          </div>

          {/* Physicochemical Properties */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-blue-700">
              Physicochemical Properties
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">Polarity (TPSA)</h4>
                <p className="text-sm text-gray-700">
                  Topological Polar Surface Area measures the sum of surfaces of polar atoms in a molecule. Important for BBB permeability as highly polar molecules struggle to cross the BBB.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">Lipophilicity (LogP)</h4>
                <p className="text-sm text-gray-700">
                  Logarithm of the partition coefficient between octanol and water. Determines membrane permeability and is critical for BBB penetration.
                </p>
              </div>
            </div>
          </div>

          {/* Structural Properties */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-blue-700">
              Structural Properties
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900">Molecular Size</h4>
                <p className="text-sm text-gray-700">Larger molecules generally have reduced BBB permeability.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Aromaticity</h4>
                <p className="text-sm text-gray-700">Classification of molecules with aromatic rings vs. non-aromatic, affecting metabolic stability.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Ring Count & Heterocycles</h4>
                <p className="text-sm text-gray-700">Number of rings and presence of heteroatoms influence drug metabolism and BBB crossing.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Special Classes</h4>
                <p className="text-sm text-gray-700">Classification of peptide-like and lipid-like molecules which have distinct permeability profiles.</p>
              </div>
            </div>
          </div>

          {/* Drug Candidacy Rules */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-blue-700">
              Drug Candidacy Rules
            </h3>
            <div className="space-y-4">
              {/* Lipinski */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Lipinski's Rule of Five</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Predicts oral bioavailability by assessing drug-likeness. Compounds violating rules are less likely to be good drugs.
                    </p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• Molecular Weight ≤ 500 Da</div>
                      <div>• LogP ≤ 5</div>
                      <div>• Hydrogen Bond Donors ≤ 5</div>
                      <div>• Hydrogen Bond Acceptors ≤ 10</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Veber */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Veber's Rule</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Pharmacokinetic guideline predicting oral bioavailability based on molecular flexibility and polarity.
                    </p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• TPSA ≤ 140 Ų</div>
                      <div>• Rotatable Bonds ≤ 10</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Egan */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Egan Rule</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Predicts blood-brain barrier and human oral bioavailability using lipophilicity and polarity.
                    </p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• LogP ≤ 5.88</div>
                      <div>• TPSA ≤ 131 Ų</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ghose */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ghose Filter</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Defines "drug-like" chemical space based on molecular properties commonly found in successful drugs.
                    </p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• Molecular Weight: 160–480 Da</div>
                      <div>• LogP: −0.4 to 5.6</div>
                      <div>• Molar Refractivity: 40–130</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAINS */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">PAINS Filters</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Pan-Assay Interference compoundS filters identify molecules that frequently produce false positives in biological assays, reducing experimental noise and improving data quality.
                    </p>
                    <div className="text-xs text-gray-600">
                      Flags structural patterns known to interfere with assay results
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why These Filters */}
        <section className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why These Filters?</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Quality Control:</strong> These filters remove compounds with unfavorable drug-like properties, ensuring the dataset contains molecules with realistic potential for development.
            </p>
            <p>
              <strong>BBB Relevance:</strong> Rules like Egan and Veber directly address BBB permeability, making them ideal for neurological drug discovery.
            </p>
            <p>
              <strong>Industry Standard:</strong> These criteria are widely used in pharmaceutical research and have decades of validation behind them.
            </p>
            <p>
              <strong>Comprehensive Coverage:</strong> Using multiple rules provides complementary perspectives on drug-likeness, reducing bias from any single filter.
            </p>
            <p>
              <strong>Reproducibility:</strong> Transparent, rule-based filtering ensures consistency and allows researchers to understand exactly how the dataset was curated.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Advanced Search & Filtering</h3>
                <p className="text-sm text-gray-700">Filter molecules by physicochemical, structural, and drug-likeness properties.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Detailed Profiles</h3>
                <p className="text-sm text-gray-700">View comprehensive molecular information including all calculated properties.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">BBB Predictions</h3>
                <p className="text-sm text-gray-700">Machine learning-based predictions for blood-brain barrier permeability.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Community Verification</h3>
                <p className="text-sm text-gray-700">Submit experimental data to improve predictions and validate results.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Data Export</h3>
                <p className="text-sm text-gray-700">Download molecular data and predictions for further analysis.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Open Access</h3>
                <p className="text-sm text-gray-700">All data freely available to support neurological drug discovery.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Team */}
        <section className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Team & Contact</h2>
          
          <p className="text-gray-700 mb-8">
            BrainRoute is developed by a dedicated team of researchers and developers passionate about advancing CNS drug discovery. Get in touch with us for collaborations, questions, or feedback.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Team Members */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Project Team</h3>
              <div className="space-y-6">
                {[
                  {
                    name: "Soham Shirolkar",
                    role: "Project Lead, Lead Developer",
                    email: "sohamshirolkar24@gmail.com",
                    affiliation: "University of South Florida",
                  },
                  {
                    name: "Lewis Tem",
                    role: "Lead Developer",
                    email: "lewistem8@gmail.com",
                    affiliation: "Developer",
                  },
                  {
                    name: "Leah W. Cerere",
                    role: "Visualization & Documentation",
                    email: "leahcerere@gmail.com",
                    affiliation: "Designer",
                  },
                  {
                    name: "Noura E. Ahmed",
                    role: "Visualization & Documentation",
                    email: "nemase00@gmail.com",
                    affiliation: "Designer",
                  },
                  {
                    name: "Olaitan I. Awe",
                    role: "Project Supervision & Co-Lead",
                    email: "laitanawe@gmail.com",
                    affiliation: "Institute for Genomic Medicine Research",
                  },
                ].map((member, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4 pb-6 border-b border-gray-200 last:border-b-0">
                    <h4 className="font-semibold text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                    <p className="text-xs text-gray-500 mb-3">{member.affiliation}</p>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
                    >
                      📧 {member.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Get In Touch</h3>
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Email Support</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Have questions or suggestions? Reach out to our team leads:
                  </p>
                  <div className="space-y-2">
                    <a
                      href="mailto:sohamshirolkar24@gmail.com"
                      className="block text-sm text-blue-600 hover:text-blue-700 font-medium transition"
                    >
                      → sohamshirolkar24@gmail.com
                    </a>
                    <a
                      href="mailto:laitanawe@gmail.com"
                      className="block text-sm text-blue-600 hover:text-blue-700 font-medium transition"
                    >
                      → laitanawe@gmail.com
                    </a>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Collaborate</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Interested in collaborating on research or expanding BrainRoute?
                  </p>
                  <a
                    href="mailto:sohamshirolkar24@gmail.com?subject=BrainRoute%20Collaboration"
                    className="inline-block text-sm text-green-600 hover:text-green-700 font-medium transition"
                  >
                    → Propose a collaboration
                  </a>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">GitHub</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    View the source code, report issues, or contribute:
                  </p>
                  <a
                    href="https://github.com/omicscodeathon/brainroutedb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-indigo-600 hover:text-indigo-700 font-medium transition"
                  >
                    → github.com/omicscodeathon/brainroutedb
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Get Started */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started</h2>
          <p className="text-gray-700 mb-6">
            Explore our dataset, submit experimental data, or learn more about how BrainRoute can support your drug discovery research.
          </p>
          <div className="flex gap-4">
            <a
              href="/know-your-data"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Explore Data
            </a>
            <a
              href="/verify-data"
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Contribute Data
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
