/**
 * Filter Components
 * Reusable filter UI elements
 */

'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'

interface TextFilterProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TextFilter({ label, value, onChange, placeholder }: TextFilterProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  )
}

interface SelectFilterProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ label: string; value: string }>
  placeholder?: string
}

export function SelectFilter({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
}: SelectFilterProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}

interface CheckboxFilterProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function CheckboxFilter({ label, checked, onChange }: CheckboxFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
      />
      <label className="text-sm font-medium text-gray-700">{label}</label>
    </div>
  )
}

interface RangeFilterProps {
  label: string
  minValue: number | ''
  maxValue: number | ''
  onMinChange: (value: number | '') => void
  onMaxChange: (value: number | '') => void
  min?: number
  max?: number
  step?: number
}

export function RangeFilter({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  min = 0,
  max = 1000,
  step = 1,
}: RangeFilterProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        <input
          type="number"
          value={minValue}
          onChange={(e) => onMinChange(e.target.value ? Number(e.target.value) : '')}
          placeholder="Min"
          min={min}
          step={step}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="number"
          value={maxValue}
          onChange={(e) => onMaxChange(e.target.value ? Number(e.target.value) : '')}
          placeholder="Max"
          max={max}
          step={step}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  )
}

interface MultiSelectFilterProps {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  options: Array<{ label: string; value: string }>
}

export function MultiSelectFilter({
  label,
  values,
  onChange,
  options,
}: MultiSelectFilterProps) {
  const handleChange = (optionValue: string) => {
    if (values.includes(optionValue)) {
      onChange(values.filter((v) => v !== optionValue))
    } else {
      onChange([...values, optionValue])
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={values.includes(option.value)}
              onChange={() => handleChange(option.value)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">{option.label}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
