import { Card } from '@/components/ui/Card'
import { ReactNode } from 'react'

interface DemoCardProps {
  id?: string
  title?: string
  children: ReactNode
  className?: string
}

export function DemoCard({ id, title, children, className }: DemoCardProps) {
  return (
    <Card id={id} className={className || 'p-6'} style={{ scrollMarginTop: '2rem' }}>
      {title && <h3 className="font-semibold mb-4">{title}</h3>}
      {children}
    </Card>
  )
}

