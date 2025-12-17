"use client"

import { useState, useEffect, useRef } from "react"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

function getGrade(marks: number): Grade {
  if (marks >= 90)
    return { letter: "O", points: 10, color: "bg-chart-4 text-background" }
  if (marks >= 80)
    return { letter: "A+", points: 9, color: "bg-chart-2 text-background" }
  if (marks >= 70)
    return { letter: "A", points: 8, color: "bg-chart-1 text-background" }
  if (marks >= 60)
    return { letter: "B+", points: 7, color: "bg-chart-3 text-background" }
  if (marks >= 50)
    return { letter: "B", points: 6, color: "bg-chart-5 text-background" }
  if (marks >= 40)
    return { letter: "C", points: 5, color: "bg-destructive text-destructive-foreground" }
  if (marks >= 35)
    return { letter: "P", points: 4, color: "bg-muted text-muted-foreground" }
  return { letter: "F", points: 0, color: "bg-destructive text-destructive-foreground" }
}

export default function GradeCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [mounted, setMounted] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem("grade-calculator-data")
      if (stored) {
        const parsedSubjects = JSON.parse(stored)
        setSubjects(parsedSubjects)
        inputRefs.current = inputRefs.current.slice(0, parsedSubjects.length * 3)
      } else {
        setSubjects([
          { id: crypto.randomUUID(), name: "", credits: 4, marks: "" },
        ])
      }
    } catch (error) {
      console.error("Failed to parse grades from localStorage", error)
      setSubjects([
        { id: crypto.randomUUID(), name: "", credits: 4, marks: "" },
      ])
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("grade-calculator-data", JSON.stringify(subjects))
    }
  }, [subjects, mounted])

  const { sgpa, percentage, totalCredits } = (() => {
    let totalCredits = 0
    let totalCreditPoints = 0

    subjects.forEach((subject) => {
      if (typeof subject.marks === "number") {
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
  })()

  const addSubject = () => {
    const newSubject = { id: crypto.randomUUID(), name: "", credits: 4, marks: "" }
    setSubjects([...subjects, newSubject])
    setTimeout(() => {
      const nextInput = inputRefs.current[subjects.length * 3]
      if (nextInput) {
        nextInput.focus()
      }
    }, 0)
  }

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id))
    }
  }

  const updateSubject = (
    id: string,
    field: keyof Subject,
    value: string | number,
  ) => {
    setSubjects(
      subjects.map((s) => {
        if (s.id === id) {
          if (field === "marks" || field === "credits") {
            const numValue = value === "" ? "" : Number(value)
            if (
              typeof numValue === "number" &&
              (numValue < 0 || (field === "marks" && numValue > 100))
            ) {
              return s
            }
            return { ...s, [field]: numValue }
          }
          return { ...s, [field]: value }
        }
        return s
      }),
    )
  }

  const clearSubject = (id: string) => {

      setSubjects(

        subjects.map((s) => {

          if (s.id === id) {

            return { ...s, name: "", marks: "" }

          }

          return s

        }),

      )

    }

  

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {

      if (e.key === 'Enter') {

        e.preventDefault()

        if(index === subjects.length - 1){

          addSubject()

        } else {

          const nextInput = inputRefs.current[(index + 1) * 3]

          if (nextInput) {

            nextInput.focus()

          }

        }

      }

    }

  

    

  

    if (!mounted) {

      return (

        <div className="min-h-screen bg-background flex items-center justify-center">

        </div>

      )

    }

  

    return (

      <div className="min-h-screen bg-background text-foreground">

        <div className="container mx-auto p-4 sm:p-6 lg:p-8">

          <header className="text-center mb-8">

            <div className="flex items-center justify-center gap-3">

              <h1 className="text-4xl font-bold">Grade Calculator</h1>

            </div>

            <p className="text-muted-foreground mt-2">

              Calculate your Semester Grade Point Average (SGPA) with ease.

            </p>

          </header>

  

          <section className="mb-8">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <Card className="shadow-soft">

                <CardHeader className="flex flex-row items-center justify-between pb-2">

                  <CardTitle className="text-sm font-medium">SGPA</CardTitle>

                </CardHeader>

                <CardContent>

                                  <div className="text-2xl font-bold">{sgpa}</div>

                                  <Progress value={Number(sgpa) * 10} className="mt-2" />

                                </CardContent>

              </Card>

              <Card className="shadow-soft">

                <CardHeader className="flex flex-row items-center justify-between pb-2">

                                <CardTitle className="text-sm font-medium">Percentage</CardTitle>

                              </CardHeader>

                <CardContent>

                  <div className="text-2xl font-bold">{percentage}%</div>

                </CardContent>

              </Card>

              <Card className="shadow-soft">

                <CardHeader className="flex flex-row items-center justify-between pb-2">

                  <CardTitle className="text-sm font-medium">

                    Total Credits

                  </CardTitle>

                </CardHeader>

                <CardContent>

                  <div className="text-2xl font-bold">{totalCredits}</div>

                </CardContent>

              </Card>

            </div>

          </section>

  

          <section className="my-8">

            <Card className="shadow-soft">

              <CardHeader>

                <CardTitle>Subjects</CardTitle>

                                <CardDescription>

                                  Calculate your grades with precision.

                                </CardDescription>

                              </CardHeader>

              <CardContent>

                <div className="overflow-x-auto">

                  <Table>

                    <TableHeader>

                      <TableRow>

                        <TableHead className="w-[40%]">Subject Name</TableHead>

                        <TableHead>Credits</TableHead>

                        <TableHead>Marks (0-100)</TableHead>

                        <TableHead>Grade</TableHead>

                        <TableHead className="text-right">Action</TableHead>

                      </TableRow>

                    </TableHeader>

                    <TableBody>

                      {subjects.map((subject, index) => {

                        const grade =

                          typeof subject.marks === "number"

                            ? getGrade(subject.marks)

                            : null

                        return (

                          <TableRow key={subject.id}>

                            <TableCell>

                              <Input

                                ref={(el) => (inputRefs.current[index * 3] = el)}

                                type="text"

                                placeholder="e.g., Artificial Intelligence"

                                value={subject.name}

                                onChange={(e) =>

                                  updateSubject(subject.id, "name", e.target.value)

                                }

                              />

                            </TableCell>

                            <TableCell>

                              <Input

                                ref={(el) => (inputRefs.current[index * 3 + 1] = el)}

                                type="number"

                                min="0"

                                value={subject.credits}

                                onChange={(e) =>

                                  updateSubject(

                                    subject.id,

                                    "credits",

                                    e.target.value,

                                  )

                                }

                              />

                            </TableCell>

                            <TableCell>

                              <Input

                                ref={(el) => (inputRefs.current[index * 3 + 2] = el)}

                                type="number"

                                min="0"

                                max="100"

                                placeholder="0-100"

                                value={subject.marks}

                                onChange={(e) =>

                                  updateSubject(subject.id, "marks", e.target.value)

                                }

                                onKeyDown={(e) => handleKeyDown(e, index)}

                              />

                            </TableCell>

                            <TableCell>

                              {grade ? (

                                <Badge className={grade.color}>

                                  {grade.letter}

                                </Badge>

                              ) : (

                                "-"

                              )}

                            </TableCell>

                            <TableCell className="text-right">

                              <Button

                                variant="ghost"

                                size="icon"

                                onClick={() => clearSubject(subject.id)}

                              >

                                <X className="w-4 h-4" />

                              </Button>

                              <Button

                                variant="ghost"

                                size="icon"

                                onClick={() => removeSubject(subject.id)}

                                disabled={subjects.length <= 1}

                              >

                                <Trash2 className="w-4 h-4" />

                              </Button>

                            </TableCell>

                          </TableRow>

                        )

                      })}

                    </TableBody>

                  </Table>

                </div>

                <div className="flex items-center justify-end mt-4 gap-2">

                  <Button onClick={addSubject} variant="outline">

                    Add Subject

                  </Button>

                  <AlertDialog>

                                    <AlertDialogTrigger asChild>

                                      <Button

                                        variant="destructive"

                                        disabled={subjects.length === 1 && subjects[0].name === "" && subjects[0].marks === ""}

                                      >

                                        Reset All

                                      </Button>

                                    </AlertDialogTrigger>

                                    <AlertDialogContent>

                                      <AlertDialogHeader>

                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

                                        <AlertDialogDescription>

                                          This action cannot be undone. This will permanently delete all your data.

                                        </AlertDialogDescription>

                                      </AlertDialogHeader>

                                      <AlertDialogFooter>

                                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                                        <AlertDialogAction onClick={() => {

                                          setSubjects([{ id: crypto.randomUUID(), name: "", credits: 4, marks: "" }])

                                          localStorage.removeItem("grade-calculator-data")

                                        }}>Continue</AlertDialogAction>

                                      </AlertDialogFooter>

                                    </AlertDialogContent>

                                  </AlertDialog>

                </div>

              </CardContent>

            </Card>

          </section>

  

          <footer className="text-center mt-8 text-sm text-muted-foreground">

            <Card className="shadow-soft">

              <CardHeader>

                <CardTitle className="text-lg">Grading Scale</CardTitle>

              </CardHeader>

              <CardContent>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                  <div className="flex items-center gap-2">

                    <Badge className="bg-chart-4 text-background">O</Badge>

                    <span>90-100</span>

                  </div>

                  <div className="flex items-center gap-2">

                    <Badge className="bg-chart-2 text-background">A+</Badge>

                    <span>80-89</span>

                  </div>

                  <div className="flex items-center gap-2">

                    <Badge className="bg-chart-1 text-background">A</Badge>

                    <span>70-79</span>

                  </div>

                  <div className="flex items-center gap-2">

                    <Badge className="bg-chart-3 text-background">B+</Badge>

                    <span>60-69</span>

                  </div>

                  <div className="flex items-center gap-2">

                    <Badge className="bg-chart-5 text-background">B</Badge>

                    <span>50-59</span>

                  </div>

                  <div className="flex items-center gap-2">

                    <Badge className="bg-destructive text-destructive-foreground">C</Badge>

                    <span>40-49</span>

                  </div>

                  <div className="flex items-center gap-2">

                    <Badge className="bg-muted text-muted-foreground">P</Badge>

                    <span>35-39</span>

                  </div>

                  <div className="flex items-center gap-2">

                    <Badge className="bg-destructive text-destructive-foreground">F</Badge>

                    <span>Below 35</span>

                  </div>

                </div>

              </CardContent>

            </Card>

          </footer>

        </div>

      </div>

    )

  }

  