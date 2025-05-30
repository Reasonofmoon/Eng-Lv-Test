"use client"

import { Clock, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TestTimerProps {
  timeLeft: number
  isRunning: boolean
  onToggle: () => void
}

export function TestTimer({ timeLeft, isRunning }: TestTimerProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTimerColor = () => {
    if (timeLeft <= 300) return "text-red-600" // Last 5 minutes
    if (timeLeft <= 600) return "text-yellow-600" // Last 10 minutes
    return "text-gray-700"
  }

  const getTimerVariant = () => {
    if (timeLeft <= 300) return "destructive" // Last 5 minutes
    if (timeLeft <= 600) return "secondary" // Last 10 minutes
    return "outline"
  }

  return (
    <Badge variant={getTimerVariant()} className="flex items-center gap-2 px-3 py-1">
      {timeLeft <= 300 ? <AlertTriangle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
      <span className={`font-mono text-sm ${getTimerColor()}`}>{formatTime(timeLeft)}</span>
      {!isRunning && <span className="text-xs opacity-75">(Paused)</span>}
    </Badge>
  )
}
