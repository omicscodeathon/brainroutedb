'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { getBrainRoutePortalStats } from '@/lib/queries/brainroute'
import {
  createPortalStatItems,
  fallbackPortalStats,
  type PortalStatItem,
} from '@/src/data/portalStats'

const numberFormatter = new Intl.NumberFormat('en-US')

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: PortalStatItem }>
}) {
  if (!active || !payload?.length) return null

  const item = payload[0].payload

  return (
    <div className="max-w-xs border border-slate-200 bg-white p-3 shadow-lg">
      <div className="text-sm font-bold text-slate-950">{item.label}</div>
      <div className="mt-1 text-2xl font-bold" style={{ color: item.color }}>
        {numberFormatter.format(item.value)}
      </div>
      <p className="mt-1 text-xs leading-5 text-slate-600">{item.description}</p>
    </div>
  )
}

export function ExploreBrainRouteChart() {
  const router = useRouter()
  const [items, setItems] = useState<PortalStatItem[]>(() =>
    createPortalStatItems(fallbackPortalStats)
  )
  const [status, setStatus] = useState<'fallback' | 'live'>('fallback')

  useEffect(() => {
    let isMounted = true

    async function loadStats() {
      try {
        const stats = await getBrainRoutePortalStats()
        if (!isMounted) return

        setItems(createPortalStatItems(stats))
        setStatus('live')
      } catch (error) {
        console.error('Failed to load portal stats:', error)
        if (isMounted) {
          setItems(createPortalStatItems(fallbackPortalStats))
          setStatus('fallback')
        }
      }
    }

    loadStats()

    return () => {
      isMounted = false
    }
  }, [])

  const chartData = useMemo(() => {
    const max = Math.max(...items.map((item) => item.value), 1)

    return items.map((item, index) => ({
      ...item,
      fill: item.color,
      percent: Math.max((item.value / max) * 100, 12),
      angle: 90 - index * 18,
    }))
  }, [items])

  return (
    <section className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-950">Explore BrainRoute</h2>
          <span className="text-xs font-semibold uppercase text-slate-500">
            {status === 'live' ? 'Live database counts' : 'Representative portal counts'}
          </span>
        </div>
      </div>
      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.8fr)]">
        <div className="h-96 min-h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="98%"
              barSize={18}
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                background={{ fill: '#dbeafe' }}
                dataKey="percent"
                cornerRadius={6}
                onClick={(entry: any) => {
                  if (entry?.href) router.push(entry.href)
                }}
                className="cursor-pointer"
              />
              <Tooltip content={<ChartTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-4 border border-slate-200 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50"
              title={item.description}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate text-sm font-semibold text-slate-800">
                  {item.label}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
