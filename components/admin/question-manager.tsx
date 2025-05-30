"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Search, Download, Upload } from "lucide-react"
import { enhancedQuestions } from "@/lib/enhanced-questions"
import type { Question, CEFRLevel, SkillArea, QuestionType } from "@/types/enhanced-test"

export function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>(enhancedQuestions)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState<CEFRLevel | "all">("all")
  const [filterSkill, setFilterSkill] = useState<SkillArea | "all">("all")
  const [filterType, setFilterType] = useState<QuestionType | "all">("all")
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Filter questions based on search and filters
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (question as any).question?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLevel = filterLevel === "all" || question.level === filterLevel
    const matchesSkill = filterSkill === "all" || question.skillArea === filterSkill
    const matchesType = filterType === "all" || question.type === filterType

    return matchesSearch && matchesLevel && matchesSkill && matchesType
  })

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId))
  }

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question)
    setIsEditDialogOpen(true)
  }

  const exportQuestions = () => {
    const dataStr = JSON.stringify(filteredQuestions, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "questions-export.json"
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Question Management</h2>
          <p className="text-gray-600">Manage your test questions and content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportQuestions}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Question</DialogTitle>
                <DialogDescription>Add a new question to your test bank</DialogDescription>
              </DialogHeader>
              <QuestionEditor onSave={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterLevel} onValueChange={(value: CEFRLevel | "all") => setFilterLevel(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="A1">A1</SelectItem>
                <SelectItem value="A2">A2</SelectItem>
                <SelectItem value="B1">B1</SelectItem>
                <SelectItem value="B2">B2</SelectItem>
                <SelectItem value="C1">C1</SelectItem>
                <SelectItem value="C2">C2</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSkill} onValueChange={(value: SkillArea | "all") => setFilterSkill(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="grammar">Grammar</SelectItem>
                <SelectItem value="vocabulary">Vocabulary</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="listening">Listening</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={(value: QuestionType | "all") => setFilterType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                <SelectItem value="fill-blank">Fill Blank</SelectItem>
                <SelectItem value="reading-comprehension">Reading</SelectItem>
                <SelectItem value="listening-comprehension">Listening</SelectItem>
                <SelectItem value="vocabulary-match">Vocabulary Match</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredQuestions.length}</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {filteredQuestions.filter((q) => q.skillArea === "grammar").length}
            </div>
            <div className="text-sm text-gray-600">Grammar</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {filteredQuestions.filter((q) => q.skillArea === "vocabulary").length}
            </div>
            <div className="text-sm text-gray-600">Vocabulary</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {filteredQuestions.filter((q) => q.skillArea === "reading").length}
            </div>
            <div className="text-sm text-gray-600">Reading</div>
          </CardContent>
        </Card>
      </div>

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Questions ({filteredQuestions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Skill</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-mono text-sm">{question.id}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {(question as any).question || `${question.type} question`}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{question.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{question.level}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{question.skillArea}</Badge>
                  </TableCell>
                  <TableCell>{question.points}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditQuestion(question)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>Modify the selected question</DialogDescription>
          </DialogHeader>
          {selectedQuestion && <QuestionEditor question={selectedQuestion} onSave={() => setIsEditDialogOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Question Editor Component
function QuestionEditor({ question, onSave }: { question?: Question; onSave: () => void }) {
  const [formData, setFormData] = useState({
    type: question?.type || ("multiple-choice" as QuestionType),
    level: question?.level || ("B1" as CEFRLevel),
    skillArea: question?.skillArea || ("grammar" as SkillArea),
    points: question?.points || 5,
    timeLimit: question?.timeLimit || 60,
    question: (question as any)?.question || "",
    options: (question as any)?.options || ["", "", "", ""],
    correctAnswer: (question as any)?.correctAnswer || 0,
    explanation: (question as any)?.explanation || "",
  })

  const handleSave = () => {
    // In real app, this would save to database
    console.log("Saving question:", formData)
    onSave()
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Question Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: QuestionType) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
              <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
              <SelectItem value="reading-comprehension">Reading Comprehension</SelectItem>
              <SelectItem value="listening-comprehension">Listening Comprehension</SelectItem>
              <SelectItem value="vocabulary-match">Vocabulary Match</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>CEFR Level</Label>
          <Select
            value={formData.level}
            onValueChange={(value: CEFRLevel) => setFormData({ ...formData, level: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A1">A1 - Beginner</SelectItem>
              <SelectItem value="A2">A2 - Elementary</SelectItem>
              <SelectItem value="B1">B1 - Intermediate</SelectItem>
              <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
              <SelectItem value="C1">C1 - Advanced</SelectItem>
              <SelectItem value="C2">C2 - Proficient</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Skill Area</Label>
          <Select
            value={formData.skillArea}
            onValueChange={(value: SkillArea) => setFormData({ ...formData, skillArea: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grammar">Grammar</SelectItem>
              <SelectItem value="vocabulary">Vocabulary</SelectItem>
              <SelectItem value="reading">Reading</SelectItem>
              <SelectItem value="listening">Listening</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Points</Label>
          <Input
            type="number"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Time Limit (seconds)</Label>
          <Input
            type="number"
            value={formData.timeLimit}
            onChange={(e) => setFormData({ ...formData, timeLimit: Number(e.target.value) })}
          />
        </div>
      </div>

      {formData.type === "multiple-choice" && (
        <>
          <div>
            <Label>Question</Label>
            <Textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label>Options</Label>
            <div className="space-y-2">
              {formData.options.map((option, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...formData.options]
                      newOptions[index] = e.target.value
                      setFormData({ ...formData, options: newOptions })
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Switch
                    checked={formData.correctAnswer === index}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({ ...formData, correctAnswer: index })
                      }
                    }}
                  />
                  <Label className="text-sm">Correct</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Explanation (Optional)</Label>
            <Textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              rows={2}
            />
          </div>
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onSave}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Question</Button>
      </div>
    </div>
  )
}
