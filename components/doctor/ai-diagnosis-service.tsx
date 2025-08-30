"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Brain, Search, Plus, AlertTriangle, CheckCircle, Clock, User, FileText, Lightbulb } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface Symptom {
  id: string
  name: string
  severity: "mild" | "moderate" | "severe"
  duration: string
  description?: string
}

interface DiagnosticResult {
  condition: string
  confidence: number
  category: string
  description: string
  symptoms: string[]
  recommendations: string[]
  urgency: "low" | "medium" | "high"
  additionalTests?: string[]
}

interface DiagnosisCase {
  id: string
  patientName: string
  patientAge: number
  patientGender: string
  symptoms: Symptom[]
  results: DiagnosticResult[]
  timestamp: string
  status: "analyzing" | "completed" | "reviewed"
}

const mockDiagnosticResults: DiagnosticResult[] = [
  {
    condition: "Hypertension (Essential)",
    confidence: 87,
    category: "Cardiovascular",
    description: "Primary hypertension with no identifiable underlying cause",
    symptoms: ["elevated blood pressure", "headaches", "dizziness"],
    recommendations: [
      "Lifestyle modifications (diet, exercise)",
      "Monitor blood pressure regularly",
      "Consider ACE inhibitor therapy",
      "Follow-up in 2-4 weeks",
    ],
    urgency: "medium",
    additionalTests: ["24-hour blood pressure monitoring", "Basic metabolic panel", "Lipid profile"],
  },
  {
    condition: "Migraine without Aura",
    confidence: 73,
    category: "Neurological",
    description: "Recurrent headache disorder characterized by moderate to severe headaches",
    symptoms: ["severe headache", "nausea", "light sensitivity"],
    recommendations: [
      "Identify and avoid triggers",
      "Consider prophylactic medication",
      "Acute treatment with triptans",
      "Maintain headache diary",
    ],
    urgency: "low",
    additionalTests: ["MRI brain (if red flags present)", "Complete blood count"],
  },
  {
    condition: "Anxiety Disorder",
    confidence: 65,
    category: "Mental Health",
    description: "Generalized anxiety disorder with somatic symptoms",
    symptoms: ["palpitations", "sweating", "restlessness"],
    recommendations: [
      "Cognitive behavioral therapy",
      "Consider SSRI if severe",
      "Stress management techniques",
      "Regular follow-up",
    ],
    urgency: "low",
  },
]

const mockRecentCases: DiagnosisCase[] = [
  {
    id: "C001",
    patientName: "Sarah Johnson",
    patientAge: 45,
    patientGender: "Female",
    symptoms: [
      { id: "S1", name: "Chest pain", severity: "moderate", duration: "2 days" },
      { id: "S2", name: "Shortness of breath", severity: "mild", duration: "1 day" },
    ],
    results: mockDiagnosticResults.slice(0, 2),
    timestamp: "2024-12-15T10:30:00Z",
    status: "completed",
  },
  {
    id: "C002",
    patientName: "Michael Chen",
    patientAge: 32,
    patientGender: "Male",
    symptoms: [
      { id: "S3", name: "Severe headache", severity: "severe", duration: "4 hours" },
      { id: "S4", name: "Nausea", severity: "moderate", duration: "3 hours" },
    ],
    results: [mockDiagnosticResults[1]],
    timestamp: "2024-12-14T14:15:00Z",
    status: "reviewed",
  },
]

export function AIDiagnosisService() {
  const [user, setUser] = useState<any>(null)
  const [currentSymptoms, setCurrentSymptoms] = useState<Symptom[]>([])
  const [newSymptom, setNewSymptom] = useState("")
  const [symptomSeverity, setSymptomSeverity] = useState<"mild" | "moderate" | "severe">("mild")
  const [symptomDuration, setSymptomDuration] = useState("")
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    gender: "",
    medicalHistory: "",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([])
  const [recentCases, setRecentCases] = useState<DiagnosisCase[]>(mockRecentCases)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const addSymptom = () => {
    if (!newSymptom.trim()) return

    const symptom: Symptom = {
      id: Date.now().toString(),
      name: newSymptom,
      severity: symptomSeverity,
      duration: symptomDuration,
    }

    setCurrentSymptoms([...currentSymptoms, symptom])
    setNewSymptom("")
    setSymptomDuration("")
  }

  const removeSymptom = (id: string) => {
    setCurrentSymptoms(currentSymptoms.filter((s) => s.id !== id))
  }

  const runDiagnosis = async () => {
    if (currentSymptoms.length === 0) return

    setIsAnalyzing(true)

    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setDiagnosticResults(mockDiagnosticResults)
    } catch (error) {
      console.error("Diagnosis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-success/10 text-success"
      case "moderate":
        return "bg-warning/10 text-warning"
      case "severe":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "low":
        return "bg-success/10 text-success"
      case "medium":
        return "bg-warning/10 text-warning"
      case "high":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-success"
    if (confidence >= 60) return "text-warning"
    return "text-destructive"
  }

  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              AI Diagnosis Assistant
            </h1>
            <p className="text-muted-foreground">AI-powered diagnostic support for clinical decision making</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cases Today</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Brain className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                  <p className="text-2xl font-bold">84%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Processing Time</p>
                  <p className="text-2xl font-bold">2.3s</p>
                </div>
                <Clock className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="new-diagnosis" className="space-y-6">
          <TabsList>
            <TabsTrigger value="new-diagnosis">New Diagnosis</TabsTrigger>
            <TabsTrigger value="recent-cases">Recent Cases ({recentCases.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="new-diagnosis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-6">
                {/* Patient Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Patient Information
                    </CardTitle>
                    <CardDescription>Enter basic patient details for context</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patientName">Patient Name</Label>
                        <Input
                          id="patientName"
                          value={patientInfo.name}
                          onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                          placeholder="Enter patient name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patientAge">Age</Label>
                        <Input
                          id="patientAge"
                          type="number"
                          value={patientInfo.age}
                          onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                          placeholder="Age"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientGender">Gender</Label>
                      <Select
                        value={patientInfo.gender}
                        onValueChange={(value) => setPatientInfo({ ...patientInfo, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medicalHistory">Relevant Medical History</Label>
                      <Textarea
                        id="medicalHistory"
                        value={patientInfo.medicalHistory}
                        onChange={(e) => setPatientInfo({ ...patientInfo, medicalHistory: e.target.value })}
                        placeholder="Enter relevant medical history, medications, allergies..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Symptoms Input */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Symptoms & Observations
                    </CardTitle>
                    <CardDescription>Add patient symptoms and clinical observations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={newSymptom}
                          onChange={(e) => setNewSymptom(e.target.value)}
                          placeholder="Enter symptom (e.g., chest pain, fever, headache)"
                          onKeyPress={(e) => e.key === "Enter" && addSymptom()}
                        />
                      </div>
                      <Select value={symptomSeverity} onValueChange={(value: any) => setSymptomSeverity(value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        value={symptomDuration}
                        onChange={(e) => setSymptomDuration(e.target.value)}
                        placeholder="Duration (e.g., 2 days, 3 hours)"
                        className="flex-1"
                      />
                      <Button onClick={addSymptom} disabled={!newSymptom.trim()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>

                    {/* Current Symptoms */}
                    {currentSymptoms.length > 0 && (
                      <div className="space-y-2">
                        <Label>Current Symptoms:</Label>
                        <div className="space-y-2">
                          {currentSymptoms.map((symptom) => (
                            <div
                              key={symptom.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{symptom.name}</span>
                                  <Badge className={getSeverityColor(symptom.severity)}>{symptom.severity}</Badge>
                                </div>
                                {symptom.duration && (
                                  <p className="text-sm text-muted-foreground">Duration: {symptom.duration}</p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSymptom(symptom.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={runDiagnosis}
                      disabled={currentSymptoms.length === 0 || isAnalyzing}
                      className="w-full"
                      size="lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Analyzing Symptoms...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Run AI Diagnosis
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                {isAnalyzing && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <Brain className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">AI Analysis in Progress</h3>
                          <p className="text-muted-foreground">Processing symptoms and medical data...</p>
                        </div>
                        <Progress value={75} className="w-full" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {diagnosticResults.length > 0 && !isAnalyzing && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Diagnostic Suggestions
                      </CardTitle>
                      <CardDescription>AI-generated diagnostic possibilities ranked by confidence</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {diagnosticResults.map((result, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold">{result.condition}</h4>
                                <p className="text-sm text-muted-foreground">{result.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-lg font-bold ${getConfidenceColor(result.confidence)}`}>
                                {result.confidence}%
                              </div>
                              <Badge className={getUrgencyColor(result.urgency)}>{result.urgency} priority</Badge>
                            </div>
                          </div>

                          <p className="text-sm">{result.description}</p>

                          <div className="space-y-2">
                            <div>
                              <h5 className="text-sm font-medium">Matching Symptoms:</h5>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {result.symptoms.map((symptom, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {symptom}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium">Recommendations:</h5>
                              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                                {result.recommendations.map((rec, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {result.additionalTests && (
                              <div>
                                <h5 className="text-sm font-medium">Suggested Tests:</h5>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {result.additionalTests.map((test, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {test}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Important:</strong> These are AI-generated suggestions for clinical decision support.
                          Always use your professional judgment and consider additional clinical factors before making
                          diagnostic decisions.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recent-cases" className="space-y-4">
            {recentCases.map((case_) => (
              <Card key={case_.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{case_.patientName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {case_.patientAge} years old, {case_.patientGender} •
                            {new Date(case_.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          className={
                            case_.status === "completed" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                          }
                        >
                          {case_.status}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Symptoms:</h4>
                        <div className="flex flex-wrap gap-2">
                          {case_.symptoms.map((symptom) => (
                            <Badge key={symptom.id} className={getSeverityColor(symptom.severity)}>
                              {symptom.name} ({symptom.severity})
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Top Diagnosis:</h4>
                        <p className="text-sm">
                          {case_.results[0]?.condition} ({case_.results[0]?.confidence}% confidence)
                        </p>
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
