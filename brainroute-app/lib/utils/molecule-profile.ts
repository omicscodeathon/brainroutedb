import type { Molecule } from '../types'

export function buildMoleculeProfile(molecule: Molecule): Record<string, any> {
  const profile = molecule.profile_json as Record<string, any> || {}

  return {
    ...profile,
    identifiers: {
      ...(profile.identifiers || {}),
      id: molecule.id,
      name: molecule.name,
      smiles: molecule.smiles,
    },
    tags: molecule.tags || [],
    brainroute: {
      ...(profile.brainroute || {}),
      bbb_tag: molecule.bbb_tag,
      prediction_confidence: molecule.prediction_confidence,
      cns_mpo: molecule.cns_mpo,
      logd: molecule.logd,
    },
  }
}
