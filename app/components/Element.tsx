import React from 'react'

interface ElementProps {
  id: number
  symbol: string
  name: string
  atomicNumber: number
  atomicMass: number
  group: number
  period: number
  category: string
  phase: string
  discoveredBy?: string
  appearance?: string
  density?: number
  meltingPoint?: number
  boilingPoint?: number
}

const Element: React.FC<ElementProps> = ({
  symbol,
  name,
  atomicNumber,
  atomicMass,
  category,
  phase,
  discoveredBy,
  appearance,
  density,
  meltingPoint,
  boilingPoint,
}) => {
  // Tooltip text with line breaks
  const tooltip = `
Name: ${name}
Atomic Mass: ${atomicMass}
Category: ${category}
Phase: ${phase}
Density: ${density ?? 'N/A'} g/cm³
Melting Point: ${meltingPoint ?? 'N/A'} K
Boiling Point: ${boilingPoint ?? 'N/A'} K
Discovered by: ${discoveredBy ?? 'Unknown'}
Appearance: ${appearance ?? 'N/A'}
  `.trim()

  return (
    <svg
      width="120"
      height="140"
      viewBox="0 0 120 140"
      xmlns="http://www.w3.org/2000/svg"
      className="shadow-md rounded-xl cursor-pointer"
    >
      <title>{tooltip}</title>
      <rect
        width="120"
        height="140"
        rx="10"
        fill="#e5e7eb"
        stroke="#000"
        strokeWidth="2"
      />

      {/* Atomic Number */}
      <text x="10" y="20" fontSize="14" fontWeight="bold" fill="#000">
        {atomicNumber}
      </text>

      {/* Symbol */}
      <text
        x="60"
        y="70"
        fontSize="36"
        fontWeight="bold"
        fill="#000"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {symbol}
      </text>

      {/* Name */}
      <text x="60" y="115" fontSize="14" fill="#000" textAnchor="middle">
        {name}
      </text>
    </svg>
  )
}

export default Element
