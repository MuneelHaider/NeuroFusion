"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {
  Upload,
  ZoomIn,
  Move,
  Ruler,
  Circle,
  Download,
  Share,
  Eye,
  Brain,
  FileImage,
  Maximize,
  Grid,
  Settings,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

interface MedicalImage {
  id: string
  filename: string
  type: "X-Ray" | "CT" | "MRI" | "Ultrasound" | "Mammography"
  patientName: string
  patientId: string
  studyDate: string
  bodyPart: string
  modality: string
  series: number
  instances: number
  url: string
  aiAnalysis?: {
    findings: string[]
    confidence: number
    abnormalities: Array<{
      type: string
      location: string
      severity: "low" | "medium" | "high"
      confidence: number
    }>
  }
}

interface ViewerSettings {
  brightness: number
  contrast: number
  zoom: number
  rotation: number
  windowLevel: number
  windowWidth: number
}

const mockImages: MedicalImage[] = [
  {
    id: "IMG001",
    filename: "chest_xray_001.dcm",
    type: "X-Ray",
    patientName: "Sarah Johnson",
    patientId: "P001",
    studyDate: "2024-12-15",
    bodyPart: "Chest",
    modality: "CR",
    series: 1,
    instances: 1,
    url: "/chest-xray.png",
    aiAnalysis: {
      findings: ["Normal heart size", "Clear lung fields", "No acute abnormalities"],
      confidence: 92,
      abnormalities: [],
    },
  },
  {
    id: "IMG002",
    filename: "brain_mri_001.dcm",
    type: "MRI",
    patientName: "Michael Chen",
    patientId: "P002",
    studyDate: "2024-12-14",
    bodyPart: "Brain",
    modality: "MR",
    series: 3,
    instances: 24,
    url: "/images/mri-scan.png",
    aiAnalysis: {
      findings: ["Normal brain anatomy", "No mass lesions", "Adequate gray-white differentiation"],
      confidence: 88,
      abnormalities: [
        {
          type: "Small vessel disease",
          location: "Periventricular white matter",
          severity: "low",
          confidence: 76,
        },
      ],
    },
  },
  {
    id: "IMG003",
    filename: "abdomen_ct_001.dcm",
    type: "CT",
    patientName: "Emily Rodriguez",
    patientId: "P003",
    studyDate: "2024-12-13",
    bodyPart: "Abdomen",
    modality: "CT",
    series: 2,
    instances: 156,
    url: "/abdominal-ct-scan-medical-image.png",
    aiAnalysis: {
      findings: ["Normal liver enhancement", "No focal lesions", "Normal pancreas"],
      confidence: 85,
      abnormalities: [],
    },
  },
]

export function MedicalImagingViewer() {
  const [user, setUser] = useState<any>(null)
  const [images, setImages] = useState<MedicalImage[]>(mockImages)
  const [selectedImage, setSelectedImage] = useState<MedicalImage | null>(mockImages[0])
  const [viewerSettings, setViewerSettings] = useState<ViewerSettings>({
    brightness: 50,
    contrast: 50,
    zoom: 100,
    rotation: 0,
    windowLevel: 50,
    windowWidth: 50,
  })
  const [activeTool, setActiveTool] = useState<string>("move")
  const [annotations, setAnnotations] = useState<any[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSlice, setCurrentSlice] = useState(1)
  const [showAIAnalysis, setShowAIAnalysis] = useState(true)
  const [report, setReport] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleImageSelect = (image: MedicalImage) => {
    setSelectedImage(image)
    setCurrentSlice(1)
    setViewerSettings({
      brightness: 50,
      contrast: 50,
      zoom: 100,
      rotation: 0,
      windowLevel: 50,
      windowWidth: 50,
    })
  }

  const handleSettingChange = (setting: keyof ViewerSettings, value: number) => {
    setViewerSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const resetSettings = () => {
    setViewerSettings({
      brightness: 50,
      contrast: 50,
      zoom: 100,
      rotation: 0,
      windowLevel: 50,
      windowWidth: 50,
    })
  }

  const getImageTypeColor = (type: string) => {
    switch (type) {
      case "X-Ray":
        return "bg-blue-100 text-blue-800"
      case "CT":
        return "bg-green-100 text-green-800"
      case "MRI":
        return "bg-purple-100 text-purple-800"
      case "Ultrasound":
        return "bg-yellow-100 text-yellow-800"
      case "Mammography":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  if (!user) return null

  return (
    <DashboardLayout 
      headerContent={{
        title: "Medical Imaging Viewer",
        description: "Advanced medical image viewing and analysis",
        actions: (
          <>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
            <Button variant="outline">
              <Share className="w-4 h-4 mr-2" />
              Share Study
            </Button>
          </>
        )
      }}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Image Library */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Image Library</CardTitle>
              <CardDescription>Recent medical images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedImage?.id === image.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => handleImageSelect(image)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <FileImage className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getImageTypeColor(image.type)}>{image.type}</Badge>
                      </div>
                      <p className="font-medium text-sm truncate">{image.patientName}</p>
                      <p className="text-xs text-muted-foreground">{image.bodyPart}</p>
                      <p className="text-xs text-muted-foreground">{image.studyDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Main Viewer */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Image Viewer
                  </CardTitle>
                  {selectedImage && (
                    <CardDescription>
                      {selectedImage.patientName} - {selectedImage.bodyPart} {selectedImage.type}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setActiveTool("move")}>
                    <Move className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveTool("zoom")}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveTool("ruler")}>
                    <Ruler className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveTool("circle")}>
                    <Circle className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedImage ? (
                <div className="space-y-4">
                  {/* Image Display */}
                  <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "1" }}>
                    <img
                      src={selectedImage.url || "/placeholder.svg"}
                      alt={`${selectedImage.type} of ${selectedImage.bodyPart}`}
                      className="w-full h-full object-contain"
                      style={{
                        filter: `brightness(${viewerSettings.brightness}%) contrast(${viewerSettings.contrast}%)`,
                        transform: `scale(${viewerSettings.zoom / 100}) rotate(${viewerSettings.rotation}deg)`,
                      }}
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{ zIndex: 10 }}
                    />
                  </div>

                  {/* Series Navigation (for multi-slice images) */}
                  {selectedImage.instances > 1 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Series Navigation</Label>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <SkipBack className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button variant="outline" size="sm">
                            <SkipForward className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {currentSlice} / {selectedImage.instances}
                        </span>
                        <Slider
                          value={[currentSlice]}
                          onValueChange={(value) => setCurrentSlice(value[0])}
                          max={selectedImage.instances}
                          min={1}
                          step={1}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )}

                  {/* Image Controls */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Brightness: {viewerSettings.brightness}%</Label>
                      <Slider
                        value={[viewerSettings.brightness]}
                        onValueChange={(value) => handleSettingChange("brightness", value[0])}
                        max={200}
                        min={0}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contrast: {viewerSettings.contrast}%</Label>
                      <Slider
                        value={[viewerSettings.contrast]}
                        onValueChange={(value) => handleSettingChange("contrast", value[0])}
                        max={200}
                        min={0}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Zoom: {viewerSettings.zoom}%</Label>
                      <Slider
                        value={[viewerSettings.zoom]}
                        onValueChange={(value) => handleSettingChange("zoom", value[0])}
                        max={500}
                        min={25}
                        step={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Window Level: {viewerSettings.windowLevel}</Label>
                      <Slider
                        value={[viewerSettings.windowLevel]}
                        onValueChange={(value) => handleSettingChange("windowLevel", value[0])}
                        max={100}
                        min={0}
                        step={1}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={resetSettings}>
                      <Settings className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Grid className="w-4 h-4 mr-2" />
                      Compare
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <FileImage className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select an image to view</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedImage?.aiAnalysis ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Confidence Score</span>
                    <Badge variant="secondary">{selectedImage.aiAnalysis.confidence}%</Badge>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Key Findings:</h4>
                    <ul className="space-y-2">
                      {selectedImage.aiAnalysis.findings.map((finding, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-success">•</span>
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedImage.aiAnalysis.abnormalities.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Detected Abnormalities:</h4>
                      <div className="space-y-2">
                        {selectedImage.aiAnalysis.abnormalities.map((abnormality, index) => (
                          <div key={index} className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{abnormality.type}</span>
                              <Badge className={getSeverityColor(abnormality.severity)}>{abnormality.severity}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">Location: {abnormality.location}</p>
                            <p className="text-xs text-muted-foreground">Confidence: {abnormality.confidence}%</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Alert>
                    <Brain className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      AI analysis is for reference only. Always use clinical judgment for diagnosis.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No AI analysis available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Report Section */}
        {selectedImage && (
          <Card>
            <CardHeader>
              <CardTitle>Radiology Report</CardTitle>
              <CardDescription>
                {selectedImage.patientName} - {selectedImage.bodyPart} {selectedImage.type} - {selectedImage.studyDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Patient:</span> {selectedImage.patientName}
                </div>
                <div>
                  <span className="font-medium">Study Date:</span> {selectedImage.studyDate}
                </div>
                <div>
                  <span className="font-medium">Modality:</span> {selectedImage.modality}
                </div>
                <div>
                  <span className="font-medium">Body Part:</span> {selectedImage.bodyPart}
                </div>
                <div>
                  <span className="font-medium">Series:</span> {selectedImage.series}
                </div>
                <div>
                  <span className="font-medium">Images:</span> {selectedImage.instances}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label htmlFor="report">Clinical Report</Label>
                <Textarea
                  id="report"
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  placeholder="Enter your radiological findings and interpretation..."
                  rows={6}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button>Save Report</Button>
                <Button variant="outline">Generate Template</Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
