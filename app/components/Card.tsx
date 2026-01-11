'use client'

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export default function Card({ children, className = '', onClick, hover = false }: CardProps) {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 p-4'
  const hoverClasses = hover || onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
  
  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
