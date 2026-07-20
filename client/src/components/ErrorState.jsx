import { AlertTriangle, RefreshCw } from 'lucide-react'
import Card from './Card'
import Button from './Button'

export default function ErrorState({ message, onRetry }) {
  return (
    <Card className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-red-500/10 mx-auto mb-4 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="font-semibold text-text-primary mb-2">Something went wrong</h3>
      <p className="text-text-muted mb-6">{message}</p>
      <Button onClick={onRetry} icon={<RefreshCw className="w-4 h-4" />}>Try Again</Button>
    </Card>
  )
}
