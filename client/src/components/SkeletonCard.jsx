import Card from './Card'

export default function SkeletonCard({ padding = 'sm' }) {
  return (
    <Card padding={padding}>
      <div className="flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-surface" />
          <div className="space-y-2">
            <div className="h-4 w-32 md:w-48 bg-surface rounded" />
            <div className="h-3 w-24 md:w-32 bg-surface/70 rounded" />
          </div>
        </div>
        <div>
          <div className="h-3 w-16 md:w-20 bg-surface rounded" />
        </div>
      </div>
    </Card>
  )
}
