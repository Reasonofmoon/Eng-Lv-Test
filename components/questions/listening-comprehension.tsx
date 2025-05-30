"use client"

import { useState, useRef } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react"
import type { ListeningComprehensionQuestion } from "@/types/enhanced-test"

interface ListeningComprehensionComponentProps {
  question: ListeningComprehensionQuestion
  answer?: number[]
  onChange: (answer: number[]) => void
}

export function ListeningComprehensionComponent({
  question,
  answer = [],
  onChange,
}: ListeningComprehensionComponentProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleAnswerChange = (questionIndex: number, selectedAnswer: number) => {
    const newAnswer = [...answer]
    newAnswer[questionIndex] = selectedAnswer
    onChange(newAnswer)
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      {/* Audio Player */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Listening Exercise
          </CardTitle>
          <div className="text-sm text-gray-500">Duration: {formatTime(question.duration)}</div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <audio
              ref={audioRef}
              src={question.audioUrl}
              onTimeUpdate={(e) => setCurrentTime((e.target as HTMLAudioElement).currentTime)}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            <div className="flex items-center gap-4">
              <Button onClick={togglePlayPause} size="lg">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>

              <Button onClick={resetAudio} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>

              <div className="text-sm text-gray-600">
                {formatTime(currentTime)} / {formatTime(question.duration)}
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / question.duration) * 100}%` }}
              />
            </div>

            <Button variant="outline" size="sm" onClick={() => setShowTranscript(!showTranscript)}>
              {showTranscript ? "Hide" : "Show"} Transcript
            </Button>

            {showTranscript && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">Transcript:</div>
                <div className="text-sm text-gray-600 leading-relaxed">{question.transcript}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Answer the following questions based on the audio:</h3>

        {question.questions.map((q, questionIndex) => (
          <Card key={q.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="font-medium text-gray-900">
                  {questionIndex + 1}. {q.question}
                </div>

                <RadioGroup
                  value={answer[questionIndex]?.toString()}
                  onValueChange={(value) => handleAnswerChange(questionIndex, Number.parseInt(value))}
                  className="space-y-2"
                >
                  {q.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                      <RadioGroupItem value={optionIndex.toString()} id={`q${questionIndex}-option-${optionIndex}`} />
                      <Label htmlFor={`q${questionIndex}-option-${optionIndex}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
