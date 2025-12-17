"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, RotateCcw, GraduationCap } from "lucide-react"

type Subject = {
  id: string
  name: string
  credits: number
  marks: number | ""
}

type Grade = {
  letter: string
  points: number
  color: string
}

// DAVV IIPS Grading System
function getGrade(marks: number): Grade {
  if (marks >= 90) return { letter: "O", points: 10, color: "bg-green-500" }
  if (marks >= 80) return { letter: "A+", points: 9, color: "bg-blue-500" }
  if (marks >= 70) return { letter: "A", points: 8, color: "bg-indigo-500" }
  if (marks >= 60) return { letter: "B+", points: 7, color: "bg-purple-500" }
  if (marks >= 50) return { letter: "B", points: 6, color: "bg-violet-500" }
  if (marks >= 40) return { letter: "C", points: 5, color: "bg-orange-500" }
  if (marks >= 35) return { letter: "P", points: 4, color: "bg-yellow-500" }
  return { letter: "F", points: 0, color: "bg-red-500" }
}

export default function GradeCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("iips-grades")
    if (stored) {
      try {
        setSubjects(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to load saved data:", e)
      }
    } else {
      // Initialize with one empty subject
      setSubjects([{ id: crypto.randomUUID(), name: "", credits: 4, marks: "" }])
    }
  }, [])

  // Save to localStorage whenever subjects change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("iips-grades", JSON.stringify(subjects))
    }
  }, [subjects, mounted])

  // Calculate SGPA and Percentage
  const calculations = () => {
    let totalCredits = 0
    let totalCreditPoints = 0

    subjects.forEach((subject) => {
      if (typeof subject.marks === "number" && subject.marks >= 0) {
        const grade = getGrade(subject.marks)
        totalCredits += subject.credits
        totalCreditPoints += subject.credits * grade.points
      }
    })

    const sgpa = totalCredits > 0 ? totalCreditPoints / totalCredits : 0
    const percentage = sgpa * 10

    return {
      sgpa: sgpa.toFixed(2),
      percentage: percentage.toFixed(2),
      totalCredits,
    }
  }

  const addSubject = () => {
    setSubjects([...subjects, { id: crypto.randomUUID(), name: "", credits: 4, marks: "" }])
  }

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id))
    }
  }

  const updateSubject = (id: string, field: keyof Subject, value: string | number) => {
    setSubjects(
      subjects.map((s) => {
        if (s.id === id) {
          if (field === "marks") {
            const numValue = value === "" ? "" : Number(value)
            // Validate marks between 0-100
            if (typeof numValue === "number" && (numValue < 0 || numValue > 100)) {
              return s
            }
            return { ...s, [field]: numValue }
          }
          if (field === "credits") {
            const numValue = Number(value)
            // Validate positive credits
            if (numValue < 0) return s
            return { ...s, [field]: numValue }
          }
          return { ...s, [field]: value }
        }
        return s
      }),
    )
  }

  const resetAll = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      setSubjects([{ id: crypto.randomUUID(), name: "", credits: 4, marks: "" }])
      localStorage.removeItem("iips-grades")
    }
  }

  const { sgpa, percentage, totalCredits } = calculations()

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <GraduationCap className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-indigo-900">IIPS DAVV Grade Calculator</h1>
          </div>
          <p className="text-muted-foreground">Semester Grade Point Average (SGPA)</p>
        </div>

        {/* Scoreboard */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <p className="text-indigo-100 text-sm font-medium">SGPA</p>
                <p className="text-5xl font-bold">{sgpa}</p>
              </div>
              <div className="space-y-2">
                <p className="text-indigo-100 text-sm font-medium">Percentage</p>
                <p className="text-5xl font-bold">{percentage}%</p>
              </div>
              <div className="space-y-2">
                <p className="text-indigo-100 text-sm font-medium">Total Credits</p>
                <p className="text-5xl font-bold">{totalCredits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Area */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Details</CardTitle>
            <CardDescription>Enter your subject marks to calculate your SGPA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Table Header - Hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground">
              <div className="col-span-4">Subject Name</div>
              <div className="col-span-2">Credits</div>
              <div className="col-span-2">Marks</div>
              <div className="col-span-3">Grade</div>
              <div className="col-span-1">Action</div>
            </div>

            {/* Subject Rows */}
            {subjects.map((subject) => {
              const grade = typeof subject.marks === "number" ? getGrade(subject.marks) : null

              return (
                <div
                  key={subject.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 md:p-0 bg-muted/30 md:bg-transparent rounded-lg md:rounded-none"
                >
                  <div className="md:col-span-4">
                    <label className="md:hidden text-sm font-medium text-muted-foreground mb-1 block">
                      Subject Name
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Data Structures"
                      value={subject.name}
                      onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="md:hidden text-sm font-medium text-muted-foreground mb-1 block">Credits</label>
                    <Input
                      type="number"
                      min="0"
                      value={subject.credits}
                      onChange={(e) => updateSubject(subject.id, "credits", e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="md:hidden text-sm font-medium text-muted-foreground mb-1 block">
                      Marks (0-100)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={subject.marks}
                      onChange={(e) => updateSubject(subject.id, "marks", e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="md:hidden text-sm font-medium text-muted-foreground mb-1 block">Grade</label>
                    {grade ? (
                      <div className="flex items-center gap-2">
                        <span className={`${grade.color} text-white px-3 py-1 rounded-md font-bold text-sm`}>
                          {grade.letter}
                        </span>
                        <span className="text-sm text-muted-foreground">({grade.points} points)</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>

                  <div className="md:col-span-1 flex justify-end md:justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSubject(subject.id)}
                      disabled={subjects.length === 1}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={addSubject}
                variant="outline"
                className="flex-1 border-dashed border-2 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 bg-transparent"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
              <Button onClick={resetAll} variant="outline" className="sm:w-auto bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Grading Scale Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">DAVV Grading Scale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="bg-green-500 text-white px-2 py-1 rounded font-bold text-xs">O</span>
                <span>90-100 (10 pts)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-500 text-white px-2 py-1 rounded font-bold text-xs">A+</span>
                <span>80-89 (9 pts)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-500 text-white px-2 py-1 rounded font-bold text-xs">A</span>
                <span>70-79 (8 pts)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-500 text-white px-2 py-1 rounded font-bold text-xs">B+</span>
                <span>60-69 (7 pts)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-violet-500 text-white px-2 py-1 rounded font-bold text-xs">B</span>
                <span>50-59 (6 pts)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-white px-2 py-1 rounded font-bold text-xs">C</span>
                <span>40-49 (5 pts)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-500 text-white px-2 py-1 rounded font-bold text-xs">P</span>
                <span>35-39 (4 pts)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-red-500 text-white px-2 py-1 rounded font-bold text-xs">F</span>
                <span>Below 35 (0 pts)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
