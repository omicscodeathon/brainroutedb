'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  FlaskConical,
  Loader2,
  PieChart as PieChartIcon,
  SlidersHorizontal,
} from 'lucide-react'
import { Header } from '@/src/components/Header'
import { FilterPanel } from '@/src/components/filters/FilterPanel'
import { ChartBuilder } from '@/src/components/visualize/ChartBuilder'
import type { FilterState, Molecule } from '@/lib/types'
import { createFilteredHref, parseSerializedFilters } from '@/lib/utils/filter-url'
import { getFilteredMoleculesForVisualization } from '@/lib/queries/brainroute'
import {
  classifyBbbTag,
  computeDatasetSummary,
  createHistogramData,
  formatMetric,
  getNumericValue,
  numericPropertyOptions,
} from '@/lib/utils/molecule-analysis'

type ChartId =
  | 'summary'
  | 'bbb-composition'
  | 'logp-tpsa'
  | 'logd-tpsa'
  | 'cns-mpo'
  | 'property-distribution'
  | 'rule-summary'
  | 'chart-builder'
  | 'chemical-space'

interface GeneratedChartData {
  molecules: Molecule[]
  total: number
  limit: number
}

const DATA_LIMIT = 50000

const classColors: Record<string, string> = {
  'BBB+': '#0891b2',
  'BBB-': '#475569',
  Unknown: '#94a3b8',
}

const chartOptions: Array<{
  id: ChartId
  title: string
  description: string
  icon: typeof BarChart3
  requiresData: boolean
}> = [
  {
    id: 'summary',
    title: 'Dataset Summary Cards',
    description: 'Counts, averages, confidence, CNS MPO, and rule percentages for selected data.',
    icon: SlidersHorizontal,
    requiresData: true,
  },
  {
    id: 'bbb-composition',
    title: 'BBB Class Composition',
    description: 'Donut chart of BBB positive, BBB negative, and unknown molecules.',
    icon: PieChartIcon,
    requiresData: true,
  },
  {
    id: 'logp-tpsa',
    title: 'LogP vs TPSA Scatter',
    description: 'Chemical property scatter plot colored by BBB class.',
    icon: BarChart3,
    requiresData: true,
  },
  {
    id: 'logd-tpsa',
    title: 'LogD vs TPSA Scatter',
    description: 'LogD/TPSA scatter plot with a warning when LogD coverage is sparse.',
    icon: BarChart3,
    requiresData: true,
  },
  {
    id: 'cns-mpo',
    title: 'CNS MPO Distribution',
    description: 'Histogram of CNS MPO scores for the selected molecule set.',
    icon: BarChart3,
    requiresData: true,
  },
  {
    id: 'property-distribution',
    title: 'Property Distribution',
    description: 'Choose MW, TPSA, LogP, LogD, HBD, HBA, rotatable bonds, CNS MPO, or confidence.',
    icon: BarChart3,
    requiresData: true,
  },
  {
    id: 'rule-summary',
    title: 'Rule Compliance Summary',
    description: 'Bar chart of Lipinski, Veber, Egan, Ghose, and PAINS-clear percentages.',
    icon: BarChart3,
    requiresData: true,
  },
  {
    id: 'chart-builder',
    title: 'Custom Chart Builder',
    description: 'Generate a selected molecule set, then choose chart type, axes, and grouping.',
    icon: SlidersHorizontal,
    requiresData: true,
  },
  {
    id: 'chemical-space',
    title: 'Chemical Space Preview',
    description: 'Placeholder for future PCA or UMAP descriptor-space projections.',
    icon: FlaskConical,
    requiresData: false,
  },
]

function countComposition(molecules: Molecule[]) {
  const counts = molecules.reduce<Record<string, number>>((acc, molecule) => {
    const label = classifyBbbTag(molecule.bbb_tag)
    acc[label] = (acc[label] || 0) + 1
    return acc
  }, {})

  return ['BBB+', 'BBB-', 'Unknown'].map((name) => ({
    name,
    value: counts[name] || 0,
  }))
}

function scatterData(molecules: Molecule[], xKey: keyof Molecule, yKey: keyof Molecule) {
  return molecules
    .map((molecule) => {
      const x = getNumericValue(molecule, xKey)
      const y = getNumericValue(molecule, yKey)
      if (x === null || y === null) return null
      return {
        id: molecule.id,
        name: molecule.name,
        x,
        y,
        group: classifyBbbTag(molecule.bbb_tag),
        cnsMpo: molecule.cns_mpo,
      }
    })
    .filter(Boolean) as Array<{
    id: number
    name: string
    x: number
    y: number
    group: string
    cnsMpo: number | null
  }>
}

function groupScatter(data: ReturnType<typeof scatterData>) {
  return data.reduce<Record<string, typeof data>>((acc, point) => {
    acc[point.group] = acc[point.group] || []
    acc[point.group].push(point)
    return acc
  }, {})
}

function ScatterTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload

  return (
    <div className="border border-slate-200 bg-white p-3 text-sm shadow-lg">
      <div className="font-bold text-slate-950">{item.name}</div>
      <div className="mt-1 text-slate-600">BBB: {item.group}</div>
      <div className="text-slate-600">X: {item.x}</div>
      <div className="text-slate-600">Y: {item.y}</div>
      <div className="text-slate-600">CNS MPO: {item.cnsMpo ?? 'N/A'}</div>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  )
}

function LoadingPanel() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center border border-blue-100 bg-blue-50 p-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
      <p className="mt-4 text-sm font-semibold text-slate-800">Loading selected molecules...</p>
    </div>
  )
}

function LoadedDataNotice({ data }: { data: GeneratedChartData }) {
  if (data.total <= data.molecules.length) return null

  return (
    <div className="mb-4 flex gap-3 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <AlertTriangle className="h-5 w-5 shrink-0" />
      <p>
        Loaded {data.molecules.length.toLocaleString()} of {data.total.toLocaleString()} matching
        molecules. This chart hit the client-side safety ceiling; narrow filters for a complete
        chart.
      </p>
    </div>
  )
}

function ChartOptionTile({
  option,
  isLoading,
  error,
  children,
  onGenerate,
}: {
  option: (typeof chartOptions)[number]
  isLoading: boolean
  error?: string
  children?: React.ReactNode
  onGenerate: () => void
}) {
  const Icon = option.icon

  return (
    <section className="border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-blue-200 bg-blue-50 text-blue-700">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-950">{option.title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">{option.description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className="inline-flex shrink-0 items-center justify-center gap-2 border border-blue-700 bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      <div className="p-5">
        {error && <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {isLoading ? <LoadingPanel /> : children || (
          <div className="border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
            Select filters if needed, then generate this visualization.
          </div>
        )}
      </div>
    </section>
  )
}

function GeneratedChart({
  chartId,
  data,
  selectedProperty,
  onSelectedPropertyChange,
}: {
  chartId: ChartId
  data: GeneratedChartData
  selectedProperty: keyof Molecule
  onSelectedPropertyChange: (property: keyof Molecule) => void
}) {
  const molecules = data.molecules
  const summary = computeDatasetSummary(molecules)

  if (chartId === 'summary') {
    return (
      <>
        <LoadedDataNotice data={data} />
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          <SummaryCard label="Total molecules" value={summary.total.toLocaleString()} />
          <SummaryCard label="BBB+" value={summary.bbbPositive.toLocaleString()} />
          <SummaryCard label="BBB-" value={summary.bbbNegative.toLocaleString()} />
          <SummaryCard label="Unknown" value={summary.unknown.toLocaleString()} />
          <SummaryCard label="Avg TPSA" value={formatMetric(summary.averageTpsa)} />
          <SummaryCard label="Avg LogP" value={formatMetric(summary.averageLogp, 2)} />
          <SummaryCard label="Avg LogD" value={formatMetric(summary.averageLogd, 2)} />
          <SummaryCard label="Avg MW" value={formatMetric(summary.averageMw, 1)} />
          <SummaryCard label="Avg CNS MPO" value={formatMetric(summary.averageCnsMpo)} />
          <SummaryCard label="Avg confidence" value={formatMetric(summary.averagePredictionConfidence)} />
          <SummaryCard label="Lipinski pass" value={`${formatMetric(summary.lipinskiPercent)}%`} />
          <SummaryCard label="Veber pass" value={`${formatMetric(summary.veberPercent)}%`} />
          <SummaryCard label="Egan pass" value={`${formatMetric(summary.eganPercent)}%`} />
          <SummaryCard label="Ghose pass" value={`${formatMetric(summary.ghosePercent)}%`} />
          <SummaryCard label="PAINS flagged" value={`${formatMetric(summary.painsFlaggedPercent)}%`} />
        </div>
      </>
    )
  }

  if (chartId === 'bbb-composition') {
    const composition = countComposition(molecules)
    return (
      <>
        <LoadedDataNotice data={data} />
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie data={composition} dataKey="value" nameKey="name" innerRadius={60} outerRadius={115}>
              {composition.map((entry) => (
                <Cell key={entry.name} fill={classColors[entry.name]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </>
    )
  }

  if (chartId === 'logp-tpsa' || chartId === 'logd-tpsa') {
    const xKey = chartId === 'logp-tpsa' ? 'logp' : 'logd'
    const xLabel = chartId === 'logp-tpsa' ? 'LogP' : 'LogD'
    const grouped = groupScatter(scatterData(molecules, xKey, 'tpsa'))
    const missingLogd = molecules.filter((molecule) => molecule.logd === null || molecule.logd === undefined).length

    return (
      <>
        <LoadedDataNotice data={data} />
        {chartId === 'logd-tpsa' && missingLogd > molecules.length * 0.4 && (
          <div className="mb-4 border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            LogD is missing for many selected molecules, so this chart may be sparse.
          </div>
        )}
        <ResponsiveContainer width="100%" height={360}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" name={xLabel} type="number" />
            <YAxis dataKey="y" name="TPSA" type="number" />
            <Tooltip content={<ScatterTooltip />} />
            <Legend />
            {Object.entries(grouped).map(([group, chartData]) => (
              <Scatter key={group} name={group} data={chartData} fill={classColors[group]} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </>
    )
  }

  if (chartId === 'cns-mpo') {
    return (
      <>
        <LoadedDataNotice data={data} />
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={createHistogramData(molecules, 'cns_mpo')}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </>
    )
  }

  if (chartId === 'property-distribution') {
    return (
      <>
        <LoadedDataNotice data={data} />
        <label className="mb-4 block text-sm font-semibold text-slate-700">
          Property
          <select
            value={String(selectedProperty)}
            onChange={(event) => onSelectedPropertyChange(event.target.value as keyof Molecule)}
            className="mt-2 w-full border border-slate-300 bg-white px-3 py-2"
          >
            {numericPropertyOptions.map((option) => (
              <option key={String(option.key)} value={String(option.key)}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={createHistogramData(molecules, selectedProperty)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0891b2" />
          </BarChart>
        </ResponsiveContainer>
      </>
    )
  }

  if (chartId === 'rule-summary') {
    const ruleData = [
      { name: 'Lipinski', value: Number(summary.lipinskiPercent.toFixed(1)) },
      { name: 'Veber', value: Number(summary.veberPercent.toFixed(1)) },
      { name: 'Egan', value: Number(summary.eganPercent.toFixed(1)) },
      { name: 'Ghose', value: Number(summary.ghosePercent.toFixed(1)) },
      { name: 'PAINS clear', value: Number(summary.painsClearPercent.toFixed(1)) },
    ]

    return (
      <>
        <LoadedDataNotice data={data} />
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={ruleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="value" fill="#0f766e" />
          </BarChart>
        </ResponsiveContainer>
      </>
    )
  }

  if (chartId === 'chart-builder') {
    return (
      <>
        <LoadedDataNotice data={data} />
        <ChartBuilder filteredMolecules={molecules} allMolecules={molecules} />
      </>
    )
  }

  return (
    <div className="flex items-start gap-4 border border-slate-200 bg-slate-50 p-6">
      <FlaskConical className="h-7 w-7 shrink-0 text-blue-700" />
      <div>
        <h3 className="text-lg font-bold text-slate-950">Chemical space projection pending</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          PCA or UMAP coordinates are not currently exposed in the frontend molecule schema. This
          tile is ready for a future descriptor or fingerprint projection using molecular
          descriptors, Morgan fingerprints, PCA, or UMAP.
        </p>
      </div>
    </div>
  )
}

export function VisualizeClient() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>(() =>
    parseSerializedFilters(searchParams.get('filters'))
  )
  const [selectedProperty, setSelectedProperty] = useState<keyof Molecule>('mw')
  const [generatedData, setGeneratedData] = useState<Partial<Record<ChartId, GeneratedChartData>>>({})
  const [loadingCharts, setLoadingCharts] = useState<Partial<Record<ChartId, boolean>>>({})
  const [chartErrors, setChartErrors] = useState<Partial<Record<ChartId, string>>>({})

  useEffect(() => {
    setFilters(parseSerializedFilters(searchParams.get('filters')))
  }, [searchParams])

  useEffect(() => {
    setGeneratedData({})
    setChartErrors({})
  }, [filters])

  const anyLoading = Object.values(loadingCharts).some(Boolean)

  async function generateChart(chartId: ChartId, requiresData: boolean) {
    setChartErrors((current) => ({ ...current, [chartId]: undefined }))

    if (!requiresData) {
      setGeneratedData((current) => ({
        ...current,
        [chartId]: { molecules: [], total: 0, limit: 0 },
      }))
      return
    }

    setLoadingCharts((current) => ({ ...current, [chartId]: true }))

    try {
      const result = await getFilteredMoleculesForVisualization(filters, DATA_LIMIT)
      setGeneratedData((current) => ({
        ...current,
        [chartId]: {
          molecules: result.data,
          total: result.total,
          limit: DATA_LIMIT,
        },
      }))
    } catch (error) {
      console.error('Failed to generate chart:', error)
      setChartErrors((current) => ({
        ...current,
        [chartId]: 'Failed to generate this chart. Try narrowing filters or refreshing the page.',
      }))
    } finally {
      setLoadingCharts((current) => ({ ...current, [chartId]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase text-blue-700">Visualize</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">Visualize BrainRoute Data</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              Start with all molecules, adjust filters if needed, then generate only the charts
              you want to see. No chart data is fetched until you press Generate.
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFiltersChange={setFilters} isLoading={anyLoading} />
            <Link
              href={createFilteredHref('/downloads', filters)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              Download selected data
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-6 lg:col-span-3">
            <section className="border border-blue-200 bg-blue-50 p-5">
              <h2 className="text-lg font-bold text-slate-950">Choose a visualization</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Each tile below is generated independently. If no filters are set, the generated
                chart fetches all matching rows for the current database; larger selections may
                take a moment.
              </p>
            </section>

            <div className="space-y-6">
              {chartOptions.map((option) => (
                <ChartOptionTile
                  key={option.id}
                  option={option}
                  isLoading={Boolean(loadingCharts[option.id])}
                  error={chartErrors[option.id]}
                  onGenerate={() => generateChart(option.id, option.requiresData)}
                >
                  {generatedData[option.id] && (
                    <GeneratedChart
                      chartId={option.id}
                      data={generatedData[option.id] as GeneratedChartData}
                      selectedProperty={selectedProperty}
                      onSelectedPropertyChange={setSelectedProperty}
                    />
                  )}
                </ChartOptionTile>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
