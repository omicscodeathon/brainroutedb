'use client'

import React, { useMemo, useState } from 'react'
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
import type { Molecule } from '@/lib/types'
import {
  classifyBbbTag,
  createHistogramData,
  getNumericValue,
  numericPropertyOptions,
} from '@/lib/utils/molecule-analysis'

type ChartType = 'scatter' | 'histogram' | 'bar' | 'pie' | 'grouped-bar' | 'matrix'
type GroupKey = 'bbb_tag' | 'lipinski_pass' | 'veber_pass' | 'egan_pass' | 'ghose_pass' | 'pains_flag'
type DataScope = 'filtered' | 'all'

interface ChartBuilderProps {
  filteredMolecules: Molecule[]
  allMolecules: Molecule[]
}

const classColors: Record<string, string> = {
  'BBB+': '#059669',
  'BBB-': '#dc2626',
  Unknown: '#64748b',
}

const groupOptions: Array<{ label: string; value: GroupKey }> = [
  { label: 'BBB tag', value: 'bbb_tag' },
  { label: 'Lipinski pass', value: 'lipinski_pass' },
  { label: 'Veber pass', value: 'veber_pass' },
  { label: 'Egan pass', value: 'egan_pass' },
  { label: 'Ghose pass', value: 'ghose_pass' },
  { label: 'PAINS flag', value: 'pains_flag' },
]

function groupLabel(molecule: Molecule, groupKey: GroupKey): string {
  if (groupKey === 'bbb_tag') return classifyBbbTag(molecule.bbb_tag)
  const value = molecule[groupKey]
  if (value === null || value === undefined) return 'Unknown'
  return value ? 'Yes' : 'No'
}

function countByGroup(molecules: Molecule[], groupKey: GroupKey) {
  const counts = molecules.reduce<Record<string, number>>((acc, molecule) => {
    const label = groupLabel(molecule, groupKey)
    acc[label] = (acc[label] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts).map(([name, value]) => ({ name, value }))
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

export function ChartBuilder({ filteredMolecules, allMolecules }: ChartBuilderProps) {
  const [chartType, setChartType] = useState<ChartType>('scatter')
  const [xAxis, setXAxis] = useState<keyof Molecule>('logp')
  const [yAxis, setYAxis] = useState<keyof Molecule>('tpsa')
  const [groupKey, setGroupKey] = useState<GroupKey>('bbb_tag')
  const [scope, setScope] = useState<DataScope>('filtered')

  const molecules = scope === 'filtered' ? filteredMolecules : allMolecules
  const selectedX = numericPropertyOptions.find((option) => option.key === xAxis)
  const selectedY = numericPropertyOptions.find((option) => option.key === yAxis)

  const scatterData = useMemo(
    () =>
      molecules
        .map((molecule) => {
          const x = getNumericValue(molecule, xAxis)
          const y = getNumericValue(molecule, yAxis)
          if (x === null || y === null) return null

          return {
            name: molecule.name,
            x,
            y,
            group: groupLabel(molecule, groupKey),
            cnsMpo: molecule.cns_mpo,
          }
        })
        .filter(Boolean) as Array<{
        name: string
        x: number
        y: number
        group: string
        cnsMpo: number | null
      }>,
    [molecules, xAxis, yAxis, groupKey]
  )

  const groupedScatter = useMemo(() => {
    return scatterData.reduce<Record<string, typeof scatterData>>((acc, item) => {
      acc[item.group] = acc[item.group] || []
      acc[item.group].push(item)
      return acc
    }, {})
  }, [scatterData])

  const histogramData = useMemo(() => createHistogramData(molecules, xAxis), [molecules, xAxis])
  const groupData = useMemo(() => countByGroup(molecules, groupKey), [molecules, groupKey])
  const matrixRows = useMemo(
    () =>
      groupOptions.map((group) => ({
        metric: group.label,
        pass: countByGroup(molecules, group.value).find((item) => item.name === 'Yes')?.value || 0,
        fail: countByGroup(molecules, group.value).find((item) => item.name === 'No')?.value || 0,
        unknown:
          countByGroup(molecules, group.value).find((item) => item.name === 'Unknown')?.value || 0,
      })),
    [molecules]
  )

  const renderChart = () => {
    if (molecules.length === 0) {
      return <div className="p-8 text-center text-sm text-slate-500">No molecules to chart.</div>
    }

    if (chartType === 'scatter') {
      return (
        <ResponsiveContainer width="100%" height={360}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" name={selectedX?.label || String(xAxis)} type="number" />
            <YAxis dataKey="y" name={selectedY?.label || String(yAxis)} type="number" />
            <Tooltip content={<ScatterTooltip />} />
            <Legend />
            {Object.entries(groupedScatter).map(([group, data]) => (
              <Scatter
                key={group}
                name={group}
                data={data}
                fill={classColors[group] || '#2563eb'}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === 'histogram') {
      return (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie data={groupData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={110}>
              {groupData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={classColors[entry.name] || ['#2563eb', '#0891b2', '#f59e0b'][index % 3]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === 'matrix') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-4 py-3 font-bold text-slate-800">Metric</th>
                <th className="px-4 py-3 font-bold text-slate-800">Pass / Yes</th>
                <th className="px-4 py-3 font-bold text-slate-800">Fail / No</th>
                <th className="px-4 py-3 font-bold text-slate-800">Unknown</th>
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row) => (
                <tr key={row.metric} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-900">{row.metric}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-emerald-100 px-2 py-1 font-bold text-emerald-800">
                      {row.pass}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-red-100 px-2 py-1 font-bold text-red-800">
                      {row.fail}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-slate-100 px-2 py-1 font-bold text-slate-700">
                      {row.unknown}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={groupData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <section className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <h2 className="text-xl font-bold text-slate-950">Chart Builder</h2>
      </div>
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-5">
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Chart type
            <select
              value={chartType}
              onChange={(event) => setChartType(event.target.value as ChartType)}
              className="w-full border border-slate-300 bg-white px-3 py-2"
            >
              <option value="scatter">Scatter plot</option>
              <option value="histogram">Histogram</option>
              <option value="grouped-bar">Grouped bar summaries</option>
              <option value="bar">Bar chart</option>
              <option value="pie">Donut / pie chart</option>
              <option value="matrix">Matrix table</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            X axis / property
            <select
              value={String(xAxis)}
              onChange={(event) => setXAxis(event.target.value as keyof Molecule)}
              className="w-full border border-slate-300 bg-white px-3 py-2"
            >
              {numericPropertyOptions.map((option) => (
                <option key={String(option.key)} value={String(option.key)}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Y axis
            <select
              value={String(yAxis)}
              onChange={(event) => setYAxis(event.target.value as keyof Molecule)}
              className="w-full border border-slate-300 bg-white px-3 py-2"
            >
              {numericPropertyOptions.map((option) => (
                <option key={String(option.key)} value={String(option.key)}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Group / color
            <select
              value={groupKey}
              onChange={(event) => setGroupKey(event.target.value as GroupKey)}
              className="w-full border border-slate-300 bg-white px-3 py-2"
            >
              {groupOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Data scope
            <select
              value={scope}
              onChange={(event) => setScope(event.target.value as DataScope)}
              className="w-full border border-slate-300 bg-white px-3 py-2"
            >
              <option value="filtered">Filtered data</option>
              <option value="all">All loaded data</option>
            </select>
          </label>
        </div>

        <div className="border border-slate-200 p-4">{renderChart()}</div>
      </div>
    </section>
  )
}
