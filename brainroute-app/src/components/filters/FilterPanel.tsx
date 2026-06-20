/**
 * Filter Panel Component
 * Contains all filters for the Know Your Data page
 */

'use client'

import React, { useState, useEffect } from 'react'
import { RotateCcw } from 'lucide-react'
import {
  TextFilter,
  SelectFilter,
  CheckboxFilter,
  RangeFilter,
  MultiSelectFilter,
} from './FilterComponents'
import type { FilterState } from '@/lib/types'
import { getFilterOptions, getNumericRanges } from '@/lib/queries/brainroute'
import { formatBinName } from '@/lib/utils'

interface FilterPanelProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  isLoading?: boolean
}

export function FilterPanel({
  filters,
  onFiltersChange,
  isLoading = false,
}: FilterPanelProps) {
  const [tpsaOptions, setTpsaOptions] = useState<Array<{ label: string; value: string }>>([])
  const [logpOptions, setLogpOptions] = useState<Array<{ label: string; value: string }>>([])
  const [mwOptions, setMwOptions] = useState<Array<{ label: string; value: string }>>([])
  const [numericRanges, setNumericRanges] = useState<Record<string, { min: number; max: number }>>({})
  const [optionsLoading, setOptionsLoading] = useState(true)

  // Load filter options on mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [options, ranges] = await Promise.all([
          getFilterOptions(),
          getNumericRanges(),
        ])

        if (options.tpsa_bin) {
          setTpsaOptions(
            options.tpsa_bin.map((opt: string) => ({ label: formatBinName(opt), value: opt }))
          )
        }

        if (options.logp_bin) {
          setLogpOptions(
            options.logp_bin.map((opt: string) => ({ label: formatBinName(opt), value: opt }))
          )
        }

        if (options.mw_bin) {
          setMwOptions(
            options.mw_bin.map((opt: string) => ({ label: formatBinName(opt), value: opt }))
          )
        }

        setNumericRanges(ranges)
      } catch (error) {
        console.error('Failed to load filter options:', error)
      } finally {
        setOptionsLoading(false)
      }
    }

    loadOptions()
  }, [])

  const handleReset = () => {
    onFiltersChange({})
  }

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const updateBooleanSelectFilter = (key: string, value: string) => {
    if (!value || value === 'all') {
      updateFilter(key, undefined)
      return
    }

    updateFilter(key, value === 'true')
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={handleReset}
          disabled={isLoading || optionsLoading || Object.keys(filters).length === 0}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      {optionsLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading filters...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Text Search */}
          <TextFilter
            label="Search by name"
            value={filters.search || ''}
            onChange={(value) => updateFilter('search', value || undefined)}
            placeholder="Molecule name..."
          />

          <TextFilter
            label="Search by SMILES"
            value={filters.search_smiles || ''}
            onChange={(value) => updateFilter('search_smiles', value || undefined)}
            placeholder="SMILES string..."
          />

          <SelectFilter
            label="BBB tag"
            value={filters.bbb_tag || ''}
            onChange={(value) => updateFilter('bbb_tag', value || undefined)}
            options={[
              { label: 'All', value: 'all' },
              { label: 'BBB+', value: 'BBB+' },
              { label: 'BBB-', value: 'BBB-' },
            ]}
          />

          {/* Categorical Filters */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Classification</h3>

            <SelectFilter
              label="TPSA"
              value={filters.tpsa_bin || ''}
              onChange={(value) => updateFilter('tpsa_bin', value || undefined)}
              options={[{ label: 'All', value: 'all' }, ...tpsaOptions]}
            />

            <div className="mt-4">
              <SelectFilter
                label="LogP"
                value={filters.logp_bin || ''}
                onChange={(value) => updateFilter('logp_bin', value || undefined)}
                options={[{ label: 'All', value: 'all' }, ...logpOptions]}
              />
            </div>

            <div className="mt-4">
              <SelectFilter
                label="Molecular Weight"
                value={filters.mw_bin || ''}
                onChange={(value) => updateFilter('mw_bin', value || undefined)}
                options={[{ label: 'All', value: 'all' }, ...mwOptions]}
              />
            </div>
          </div>

          {/* Drug Rule Filters */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Drug Rules</h3>

            <div className="space-y-3">
              <CheckboxFilter
                label="Lipinski Pass"
                checked={filters.lipinski_pass === true}
                onChange={(checked) =>
                  updateFilter('lipinski_pass', checked ? true : undefined)
                }
              />

              <CheckboxFilter
                label="Veber Pass"
                checked={filters.veber_pass === true}
                onChange={(checked) =>
                  updateFilter('veber_pass', checked ? true : undefined)
                }
              />

              <CheckboxFilter
                label="Egan Pass"
                checked={filters.egan_pass === true}
                onChange={(checked) =>
                  updateFilter('egan_pass', checked ? true : undefined)
                }
              />

              <CheckboxFilter
                label="Ghose Pass"
                checked={filters.ghose_pass === true}
                onChange={(checked) =>
                  updateFilter('ghose_pass', checked ? true : undefined)
                }
              />

              <SelectFilter
                label="PAINS flag"
                value={
                  filters.pains_flag === true
                    ? 'true'
                    : filters.pains_flag === false
                      ? 'false'
                      : ''
                }
                onChange={(value) => updateBooleanSelectFilter('pains_flag', value)}
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'PAINS clear', value: 'false' },
                  { label: 'PAINS flagged', value: 'true' },
                ]}
              />
            </div>
          </div>

          {/* Molecule Tags */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Molecule Tags</h3>

            <MultiSelectFilter
              label="Source / review tags"
              values={filters.tags || (filters.tag ? [filters.tag] : [])}
              onChange={(values) => {
                onFiltersChange({
                  ...filters,
                  tag: undefined,
                  tags: values.length > 0 ? values : undefined,
                })
              }}
              options={[
                { label: 'Training', value: 'br_training' },
                { label: 'Predicted', value: 'br_predicted' },
                { label: 'Verified', value: 'br_verified' },
              ]}
            />
          </div>

          {/* Structural Properties */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Structure</h3>

            <div className="space-y-3">
              <CheckboxFilter
                label="Aromatic"
                checked={filters.aromatic === true}
                onChange={(checked) =>
                  updateFilter('aromatic', checked ? true : undefined)
                }
              />

              <CheckboxFilter
                label="Contains Heterocycles"
                checked={filters.heterocycle_present === true}
                onChange={(checked) =>
                  updateFilter('heterocycle_present', checked ? true : undefined)
                }
              />
            </div>
          </div>

          {/* Numeric Ranges */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Molecular Properties</h3>

            <RangeFilter
              label="Molecular Weight (MW)"
              minValue={filters.mw_min || ''}
              maxValue={filters.mw_max || ''}
              onMinChange={(value) => updateFilter('mw_min', value || undefined)}
              onMaxChange={(value) => updateFilter('mw_max', value || undefined)}
              min={numericRanges.mw?.min || 0}
              max={numericRanges.mw?.max || 1000}
            />

            <div className="mt-4">
              <RangeFilter
                label="LogP"
                minValue={filters.logp_min || ''}
                maxValue={filters.logp_max || ''}
                onMinChange={(value) => updateFilter('logp_min', value || undefined)}
                onMaxChange={(value) => updateFilter('logp_max', value || undefined)}
                min={Math.floor(numericRanges.logp?.min || -5)}
                max={Math.ceil(numericRanges.logp?.max || 10)}
                step={0.1}
              />
            </div>

            <div className="mt-4">
              <RangeFilter
                label="LogD"
                minValue={filters.logd_min || ''}
                maxValue={filters.logd_max || ''}
                onMinChange={(value) => updateFilter('logd_min', value || undefined)}
                onMaxChange={(value) => updateFilter('logd_max', value || undefined)}
                min={Math.floor(numericRanges.logd?.min || -5)}
                max={Math.ceil(numericRanges.logd?.max || 10)}
                step={0.1}
              />
            </div>

            <div className="mt-4">
              <RangeFilter
                label="TPSA"
                minValue={filters.tpsa_min || ''}
                maxValue={filters.tpsa_max || ''}
                onMinChange={(value) => updateFilter('tpsa_min', value || undefined)}
                onMaxChange={(value) => updateFilter('tpsa_max', value || undefined)}
                min={numericRanges.tpsa?.min || 0}
                max={numericRanges.tpsa?.max || 300}
              />
            </div>

            <div className="mt-4">
              <RangeFilter
                label="CNS MPO"
                minValue={filters.cns_mpo_min || ''}
                maxValue={filters.cns_mpo_max || ''}
                onMinChange={(value) => updateFilter('cns_mpo_min', value || undefined)}
                onMaxChange={(value) => updateFilter('cns_mpo_max', value || undefined)}
                min={Math.floor(numericRanges.cns_mpo?.min || 0)}
                max={Math.ceil(numericRanges.cns_mpo?.max || 6)}
                step={0.1}
              />
            </div>

            <div className="mt-4">
              <RangeFilter
                label="Prediction Confidence"
                minValue={filters.prediction_confidence_min || ''}
                maxValue={filters.prediction_confidence_max || ''}
                onMinChange={(value) =>
                  updateFilter('prediction_confidence_min', value || undefined)
                }
                onMaxChange={(value) =>
                  updateFilter('prediction_confidence_max', value || undefined)
                }
                min={Math.floor(numericRanges.prediction_confidence?.min || 0)}
                max={Math.ceil(numericRanges.prediction_confidence?.max || 100)}
                step={1}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
