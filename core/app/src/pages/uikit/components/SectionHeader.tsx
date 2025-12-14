interface SectionHeaderProps {
  title: string
  description?: string
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  )
}

