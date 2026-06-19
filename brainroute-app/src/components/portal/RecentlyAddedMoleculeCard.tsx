'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { FlaskConical } from 'lucide-react'
import type { Molecule } from '@/lib/types'
import { getRecentlyAddedMolecule } from '@/lib/queries/brainroute'

const representativeMolecule: Molecule = {
  id: 1,
  name: 'Representative BBB molecule',
  smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
  tpsa: 58.4,
  logp: -0.1,
  mw: 194.19,
  hbd: 0,
  hba: 6,
  rotatable_bonds: 0,
  ring_count: 2,
  heterocycle_present: true,
  molar_refractivity: null,
  peptide_like: false,
  lipid_like: false,
  aromatic: true,
  tpsa_bin: null,
  logp_bin: null,
  mw_bin: null,
  logd: null,
  cns_mpo: 4.6,
  bbb_tag: 'BBB positive',
  tags: ['br_training'],
  prediction_confidence: 86,
  lipinski_pass: true,
  veber_pass: true,
  egan_pass: true,
  ghose_pass: true,
  pains_flag: false,
  profile_json: null,
  created_at: new Date().toISOString(),
}

const tagLabels: Record<string, string> = {
  br_training: 'Training',
  br_predicted: 'Predicted',
  br_verified: 'Verified',
}

function formatValue(value: number | null, digits = 1) {
  if (value === null || value === undefined) return 'N/A'
  return Number(value).toFixed(digits)
}

type StructureImageSource = {
  src: string
  label: '3D structure' | '2D structure'
}

function getProfileValue(profile: Record<string, any> | null, keys: string[]) {
  if (!profile) return null

  for (const key of keys) {
    const value = profile[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (typeof value === 'number') return String(value)
  }

  return null
}

function buildStructureImageSources(molecule: Molecule): StructureImageSource[] {
  const profile = molecule.profile_json || {}
  const sources: StructureImageSource[] = []
  const image3dUrl = getProfileValue(profile, [
    'structure_3d_url',
    'image_3d_url',
    'molecule_3d_url',
    'conformer_image_url',
    'pubchem_3d_url',
    'three_d_image_url',
  ])
  const image2dUrl = getProfileValue(profile, [
    'structure_2d_url',
    'image_2d_url',
    'structure_image_url',
    'depiction_url',
    'image_url',
    'png_url',
  ])
  const pubchemCid = getProfileValue(profile, ['pubchem_cid', 'cid', 'pubchem_id'])

  if (image3dUrl) {
    sources.push({ src: image3dUrl, label: '3D structure' })
  }

  if (image2dUrl) {
    sources.push({ src: image2dUrl, label: '2D structure' })
  }

  if (pubchemCid) {
    sources.push({
      src: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${encodeURIComponent(
        pubchemCid
      )}/PNG`,
      label: '2D structure',
    })
  }

  if (molecule.smiles) {
    sources.push({
      src: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/PNG?smiles=${encodeURIComponent(
        molecule.smiles
      )}`,
      label: '2D structure',
    })
  }

  return sources
}

function MoleculeStructurePreview({ molecule }: { molecule: Molecule }) {
  const sources = useMemo(() => buildStructureImageSources(molecule), [molecule])
  const [sourceIndex, setSourceIndex] = useState(0)
  const activeSource = sources[sourceIndex]

  useEffect(() => {
    setSourceIndex(0)
  }, [molecule.id, molecule.smiles])

  if (activeSource) {
    return (
      <div className="min-h-40 border border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase text-slate-500">
            {activeSource.label}
          </span>
          <span className="text-xs text-slate-500">Image preview</span>
        </div>
        <div className="flex min-h-32 items-center justify-center bg-slate-50">
          <img
            src={activeSource.src}
            alt={`${molecule.name} ${activeSource.label}`}
            className="max-h-36 w-full object-contain"
            onError={() => setSourceIndex((index) => index + 1)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-40 items-center justify-center border border-dashed border-slate-300 bg-slate-50 p-4">
      <div className="text-center">
        <FlaskConical className="mx-auto h-7 w-7 text-blue-700" />
        <p className="mt-3 max-w-full break-all font-mono text-xs leading-5 text-slate-600">
          {molecule.smiles}
        </p>
      </div>
    </div>
  )
}

export function RecentlyAddedMoleculeCard() {
  const [molecule, setMolecule] = useState<Molecule>(representativeMolecule)
  const [isFallback, setIsFallback] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadMolecule() {
      try {
        const latest = await getRecentlyAddedMolecule()
        if (latest && isMounted) {
          setMolecule(latest)
          setIsFallback(false)
        }
      } catch (error) {
        console.error('Failed to load recently added molecule:', error)
      }
    }

    loadMolecule()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h2 className="text-sm font-bold uppercase text-slate-600">
          {isFallback ? 'Featured Molecule' : 'Recently Added Molecule'}
        </h2>
      </div>
      <div className="space-y-5 p-5">
        <MoleculeStructurePreview molecule={molecule} />

        <div>
          <h3 className="text-lg font-bold text-slate-950">{molecule.name}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {molecule.bbb_tag && (
              <span className="border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                {molecule.bbb_tag}
              </span>
            )}
            {molecule.tags?.map((tag) => (
              <span
                key={tag}
                className="border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700"
              >
                {tagLabels[tag] || tag}
              </span>
            ))}
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-3 border-y border-slate-200 py-4">
          <div>
            <dt className="text-xs font-semibold text-slate-500">Confidence</dt>
            <dd className="mt-1 text-sm font-bold text-slate-950">
              {molecule.prediction_confidence !== null &&
              molecule.prediction_confidence !== undefined
                ? `${formatValue(molecule.prediction_confidence, 1)}%`
                : 'N/A'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-slate-500">CNS MPO</dt>
            <dd className="mt-1 text-sm font-bold text-slate-950">
              {formatValue(molecule.cns_mpo, 1)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-slate-500">MW</dt>
            <dd className="mt-1 text-sm font-bold text-slate-950">
              {formatValue(molecule.mw, 0)}
            </dd>
          </div>
        </dl>

      </div>
    </section>
  )
}
