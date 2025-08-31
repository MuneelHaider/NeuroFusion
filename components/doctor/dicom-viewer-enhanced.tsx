"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Download,
  Share,
  Settings,
  RotateCcw,
  ZoomIn,
  Move,
  Ruler,
  Circle,
  Brush,
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  FileImage,
  Brain,
  FolderOpen,
  FileArchive,
  Grid3X3,
  List,
  Calendar,
  User,
  Activity,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock Cornerstone tools - in real implementation, you'd import from cornerstone-tools
const mockCornerstoneTools = {
  setToolActive: (toolId: string, options: any) => console.log(`Activating tool: ${toolId}`, options),
  setToolDisabled: (toolId: string) => console.log(`Disabling tool: ${toolId}`),
  clearToolState: (element: any, toolId: string) => console.log(`Clearing tool: ${toolId}`),
  getToolState: (element: any, toolId: string) => ({ data: [] }),
  addToolState: (element: any, toolId: string, data: any) => console.log(`Adding tool state: ${toolId}`),
}

const annotationTools = [
  { id: "StackScrollMouseWheel", name: "Scroll", icon: "🖱️" },
  { id: "Pan", name: "Pan", icon: "✋" },
  { id: "Zoom", name: "Zoom", icon: "🔍" },
  { id: "Length", name: "Measure", icon: "📏" },
  { id: "EllipticalRoi", name: "ROI", icon: "⭕" },
  { id: "FreehandRoi", name: "Freehand", icon: "✏️" },
  { id: "Angle", name: "Angle", icon: "📐" },
  { id: "CobbAngle", name: "Cobb", icon: "📐" },
  { id: "Probe", name: "Probe", icon: "🔍" },
  { id: "RectangleRoi", name: "Rectangle", icon: "⬜" },
]

interface DicomSeries {
  id: string
  seriesNumber: number
  seriesDescription: string
  modality: string
  bodyPart: string
  studyDate: string
  studyTime: string
  manufacturer: string
  modelName: string
  instanceCount: number
  images: DicomImage[]
  isSelected: boolean
}

interface DicomImage {
  id: string
  instanceNumber: number
  sopInstanceUID: string
  imageType: string[]
  rows: number
  columns: number
  pixelSpacing: number[]
  sliceLocation: number
  windowCenter: number
  windowWidth: number
  rescaleSlope: number
  rescaleIntercept: number
  file: File
}

interface DicomStudy {
  id: string
  studyInstanceUID: string
  studyDate: string
  studyTime: string
  studyDescription: string
  patientName: string
  patientID: string
  patientBirthDate: string
  patientSex: string
  series: DicomSeries[]
}

interface DicomViewerProps {
  patientId?: string
  patientName?: string
  onClose?: () => void
}

export function DicomViewerEnhanced({ patientId, patientName, onClose }: DicomViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const zipInputRef = useRef<HTMLInputElement>(null)
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [cornerstoneInitialized, setCornerstoneInitialized] = useState(false)
  const [activeTool, setActiveTool] = useState("StackScrollMouseWheel")
  const [error, setError] = useState("")
  const [currentImageIds, setCurrentImageIds] = useState<string[]>([])
  const [currentSlice, setCurrentSlice] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedSeries, setSelectedSeries] = useState<DicomSeries | null>(null)
  const [dicomStudy, setDicomStudy] = useState<DicomStudy | null>(null)
  const [viewerSettings, setViewerSettings] = useState({
    brightness: 50,
    contrast: 50,
    zoom: 100,
    rotation: 0,
    windowLevel: 50,
    windowWidth: 50,
  })

  // Generate a unique session ID for this viewing session
  const sessionIdRef = useRef<string>(`dicom-session-${Date.now()}`)

  // Initialize cornerstone libraries only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Mock initialization - in real implementation, you'd call initCornerstone
      setTimeout(() => {
        setCornerstoneInitialized(true)
        console.log("Cornerstone initialized")
      }, 1000)
    }

    return () => {
      // Cleanup
      if (sessionIdRef.current) {
        localStorage.removeItem(sessionIdRef.current)
      }
    }
  }, [])

  const saveAnnotationsToLocalStorage = () => {
    if (!viewerRef.current) return

    const annotationState = {
      activeTool,
      viewerSettings,
      currentSlice,
      selectedSeriesId: selectedSeries?.id,
      timestamp: Date.now(),
    }

    const expirationTime = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    const storageData = {
      annotations: annotationState,
      imageIds: currentImageIds,
      expiration: expirationTime,
    }

    localStorage.setItem(sessionIdRef.current, JSON.stringify(storageData))
  }

  const loadAnnotationsFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(sessionIdRef.current)
      if (stored) {
        const data = JSON.parse(stored)
        if (data.expiration && Date.now() < data.expiration) {
          if (data.annotations) {
            setActiveTool(data.annotations.activeTool || "StackScrollMouseWheel")
            setViewerSettings(data.annotations.viewerSettings || viewerSettings)
            setCurrentSlice(data.annotations.currentSlice || 1)
            
            // Restore selected series if it exists
            if (data.annotations.selectedSeriesId && dicomStudy) {
              const series = dicomStudy.series.find(s => s.id === data.annotations.selectedSeriesId)
              if (series) {
                setSelectedSeries(series)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading annotations:", error)
    }
  }

  // Auto-save annotations periodically
  useEffect(() => {
    if (isLoaded && selectedSeries) {
      const autoSaveInterval = setInterval(() => {
        saveAnnotationsToLocalStorage()
      }, 30000) // 30 seconds

      return () => clearInterval(autoSaveInterval)
    }
  }, [isLoaded, selectedSeries])

  // Handle single file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    if (files.length > 0) {
      processDicomFiles(files)
    }
  }

  // Handle folder upload
  const handleFolderUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    if (files.length > 0) {
      processDicomFiles(files)
    }
  }

  // Handle zip file upload
  const handleZipUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/zip") {
      try {
        // In real implementation, you'd use JSZip to extract files
        // For now, we'll show a message
        setError("Zip file support will be implemented with JSZip library")
      } catch (error) {
        setError("Failed to process zip file")
      }
    }
  }

  // Process DICOM files and organize them into series
  const processDicomFiles = async (files: File[]) => {
    try {
      // Filter for DICOM files
      const dicomFiles = files.filter(file => 
        file.name.toLowerCase().endsWith('.dcm') || 
        file.type === 'application/dicom'
      )

      if (dicomFiles.length === 0) {
        setError("No DICOM files found. Please select files with .dcm extension")
        return
      }

      // Mock DICOM metadata extraction - in real implementation, you'd use dicomParser
      const mockStudy: DicomStudy = {
        id: `study-${Date.now()}`,
        studyInstanceUID: `1.2.3.4.5.${Date.now()}`,
        studyDate: new Date().toISOString().split('T')[0],
        studyTime: new Date().toTimeString().split(' ')[0],
        studyDescription: "Medical Imaging Study",
        patientName: patientName || "Unknown Patient",
        patientID: patientId || "Unknown ID",
        patientBirthDate: "1980-01-01",
        patientSex: "O",
        series: []
      }

      // Group files into series (mock implementation)
      const seriesMap = new Map<string, DicomSeries>()
      
      dicomFiles.forEach((file, index) => {
        // Mock series grouping - in real implementation, you'd extract series number from DICOM metadata
        const seriesKey = `series-${Math.floor(index / 10)}` // Group every 10 files as a series
        
        if (!seriesMap.has(seriesKey)) {
          const series: DicomSeries = {
            id: seriesKey,
            seriesNumber: Math.floor(index / 10) + 1,
            seriesDescription: `Series ${Math.floor(index / 10) + 1}`,
            modality: index < 20 ? "CT" : index < 40 ? "MRI" : "X-Ray",
            bodyPart: index < 20 ? "Chest" : index < 40 ? "Brain" : "Abdomen",
            studyDate: new Date().toISOString().split('T')[0],
            studyTime: new Date().toTimeString().split(' ')[0],
            manufacturer: "Generic Medical",
            modelName: "Scanner Model X",
            instanceCount: 0,
            images: [],
            isSelected: false
          }
          seriesMap.set(seriesKey, series)
        }

        const series = seriesMap.get(seriesKey)!
        const image: DicomImage = {
          id: `image-${index}`,
          instanceNumber: (index % 10) + 1,
          sopInstanceUID: `1.2.3.4.5.6.${index}`,
          imageType: ["ORIGINAL", "PRIMARY"],
          rows: 512,
          columns: 512,
          pixelSpacing: [0.5, 0.5],
          sliceLocation: index * 2.5,
          windowCenter: 40,
          windowWidth: 400,
          rescaleSlope: 1,
          rescaleIntercept: -1024,
          file: file
        }
        
        series.images.push(image)
        series.instanceCount = series.images.length
      })

      mockStudy.series = Array.from(seriesMap.values())
      
      // Select first series by default
      if (mockStudy.series.length > 0) {
        mockStudy.series[0].isSelected = true
        setSelectedSeries(mockStudy.series[0])
      }

      setDicomStudy(mockStudy)
      setIsLoaded(true)
      setCurrentSlice(1)

      // After loading images, try to load annotations
      loadAnnotationsFromLocalStorage()

      console.log(`Processed ${dicomFiles.length} DICOM files into ${mockStudy.series.length} series`)
    } catch (error) {
      console.error("Error processing DICOM files:", error)
      setError("Failed to process DICOM files. Check console for details.")
    }
  }

  // Change the active tool
  const changeTool = (toolId: string) => {
    if (!viewerRef.current) return

    // Save current annotations before changing tools
    saveAnnotationsToLocalStorage()

    // Deactivate all tools
    annotationTools.forEach((tool) => {
      if (tool.id !== "StackScrollMouseWheel") {
        mockCornerstoneTools.setToolDisabled(tool.id)
      }
    })

    // Activate the selected tool
    if (toolId === "StackScrollMouseWheel") {
      mockCornerstoneTools.setToolActive(toolId, {})
    } else {
      mockCornerstoneTools.setToolActive(toolId, { mouseButtonMask: 1 })
    }

    setActiveTool(toolId)
  }

  // Select a series
  const selectSeries = (series: DicomSeries) => {
    if (dicomStudy) {
      // Update selection
      const updatedSeries = dicomStudy.series.map(s => ({
        ...s,
        isSelected: s.id === series.id
      }))
      setDicomStudy({ ...dicomStudy, series: updatedSeries })
      setSelectedSeries(series)
      setCurrentSlice(1)
      
      // Save state
      saveAnnotationsToLocalStorage()
    }
  }

  // Reset image view to original state
  const resetImageView = () => {
    if (!viewerRef.current) return

    try {
      // Ask user if they want to clear annotations
      if (confirm("Do you want to clear all annotations? This cannot be undone.")) {
        // Clear annotations for all tools
        annotationTools.forEach((tool) => {
          if (tool.id !== "StackScrollMouseWheel") {
            mockCornerstoneTools.clearToolState(viewerRef.current, tool.id)
          }
        })

        // Remove saved annotations from local storage
        if (sessionIdRef.current) {
          localStorage.removeItem(sessionIdRef.current)
        }

        // Reset settings
        setViewerSettings({
          brightness: 50,
          contrast: 50,
          zoom: 100,
          rotation: 0,
          windowLevel: 50,
          windowWidth: 50,
        })
        setCurrentSlice(1)
      }
    } catch (resetError) {
      console.error("Error resetting view:", resetError)
    }
  }

  // Clear all annotations
  const clearAllAnnotations = () => {
    if (!viewerRef.current) return

    if (confirm("Do you want to clear all annotations? This cannot be undone.")) {
      // Clear annotations for all tools
      annotationTools.forEach((tool) => {
        if (tool.id !== "StackScrollMouseWheel") {
          mockCornerstoneTools.clearToolState(viewerRef.current, tool.id)
        }
      })

      // Remove saved annotations from local storage
      if (sessionIdRef.current) {
        localStorage.removeItem(sessionIdRef.current)
      }
    }
  }

  const handleSettingChange = (setting: keyof typeof viewerSettings, value: number) => {
    setViewerSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  // Render error state
  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <Alert variant="destructive">
            <X className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => setError("")}
          >
            Dismiss
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {!isLoaded && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Upload DICOM Files
            </CardTitle>
            <CardDescription>
              Upload DICOM files, folders, or zip archives containing medical imaging series
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Single Files */}
              <div className="text-center p-4 border rounded-lg">
                <FileImage className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <h4 className="font-medium mb-2">Individual Files</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Select multiple .dcm files
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!cornerstoneInitialized}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".dcm"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Folder Upload */}
              <div className="text-center p-4 border rounded-lg">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <h4 className="font-medium mb-2">Folder Upload</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload entire folder of DICOM files
                </p>
                <Button
                  onClick={() => folderInputRef.current?.click()}
                  disabled={!cornerstoneInitialized}
                  variant="outline"
                  className="w-full"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Choose Folder
                </Button>
                <input
                  ref={folderInputRef}
                  type="file"
                  multiple
                  webkitdirectory=""
                  onChange={handleFolderUpload}
                  className="hidden"
                />
              </div>

              {/* Zip Archive */}
              <div className="text-center p-4 border rounded-lg">
                <FileArchive className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <h4 className="font-medium mb-2">Zip Archive</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload compressed DICOM archive
                </p>
                <Button
                  onClick={() => zipInputRef.current?.click()}
                  disabled={!cornerstoneInitialized}
                  variant="outline"
                  className="w-full"
                >
                  <FileArchive className="w-4 h-4 mr-2" />
                  Choose Zip
                </Button>
                <input
                  ref={zipInputRef}
                  type="file"
                  accept=".zip"
                  onChange={handleZipUpload}
                  className="hidden"
                />
              </div>
            </div>

            {!cornerstoneInitialized && (
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Initializing DICOM viewer...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Study Information */}
      {dicomStudy && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Study Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Patient:</span>
                <p className="font-medium">{dicomStudy.patientName}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Patient ID:</span>
                <p className="font-medium">{dicomStudy.patientID}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Study Date:</span>
                <p className="font-medium">{dicomStudy.studyDate}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Series Count:</span>
                <p className="font-medium">{dicomStudy.series.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Series Selection */}
      {dicomStudy && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Grid3X3 className="w-5 h-5" />
                DICOM Series
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dicomStudy.series.map((series) => (
                  <div
                    key={series.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      series.isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() => selectSeries(series)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">Series {series.seriesNumber}</Badge>
                      <Badge className="bg-blue-100 text-blue-800">{series.modality}</Badge>
                    </div>
                    <h4 className="font-medium mb-1">{series.seriesDescription}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{series.bodyPart}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{series.instanceCount} images</span>
                      <span>{series.manufacturer}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {dicomStudy.series.map((series) => (
                  <div
                    key={series.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      series.isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() => selectSeries(series)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{series.seriesNumber}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{series.seriesDescription}</h4>
                          <p className="text-sm text-muted-foreground">{series.bodyPart} • {series.modality}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium">{series.instanceCount} images</p>
                        <p className="text-muted-foreground">{series.manufacturer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tool Menu */}
      {isLoaded && selectedSeries && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              DICOM Viewer Tools
            </CardTitle>
            <CardDescription>
              Series {selectedSeries.seriesNumber}: {selectedSeries.seriesDescription} ({selectedSeries.modality})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {annotationTools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => changeTool(tool.id)}
                  className="flex items-center gap-2"
                >
                  <span>{tool.icon}</span>
                  {tool.name}
                </Button>
              ))}
              
              <Separator orientation="vertical" className="h-8" />
              
              <Button variant="outline" size="sm" onClick={resetImageView}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset View
              </Button>
              
              <Button variant="outline" size="sm" onClick={clearAllAnnotations}>
                <X className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DICOM Viewer */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>DICOM Viewer</CardTitle>
              {selectedSeries && (
                <CardDescription>
                  Series {selectedSeries.seriesNumber}: {selectedSeries.seriesDescription} • {selectedSeries.instanceCount} images
                </CardDescription>
              )}
            </div>
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={viewerRef}
            className="w-full h-96 bg-black rounded-lg border flex items-center justify-center relative overflow-hidden"
          >
            {!cornerstoneInitialized ? (
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p>Initializing DICOM viewer...</p>
              </div>
            ) : !selectedSeries ? (
              <div className="text-white text-center">
                <FileImage className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a series to view</p>
              </div>
            ) : (
              <div className="text-white text-center">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">Series Loaded</h3>
                    <p className="text-sm opacity-80 mb-4">
                      {selectedSeries.instanceCount} images in {selectedSeries.modality} series
                    </p>
                    <div className="flex items-center gap-2 justify-center">
                      <Badge variant="secondary">{activeTool}</Badge>
                      <Badge variant="outline">{currentSlice} / {selectedSeries.instanceCount}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Series Navigation */}
          {isLoaded && selectedSeries && selectedSeries.instanceCount > 1 && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Series Navigation</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {currentSlice} / {selectedSeries.instanceCount}
                </span>
                <input
                  type="range"
                  min="1"
                  max={selectedSeries.instanceCount}
                  value={currentSlice}
                  onChange={(e) => setCurrentSlice(parseInt(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Viewer Settings */}
      {isLoaded && selectedSeries && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Viewer Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Brightness</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={viewerSettings.brightness}
                  onChange={(e) => handleSettingChange("brightness", parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{viewerSettings.brightness}%</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Contrast</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={viewerSettings.contrast}
                  onChange={(e) => handleSettingChange("contrast", parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{viewerSettings.contrast}%</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Zoom</label>
                <input
                  type="range"
                  min="25"
                  max="500"
                  value={viewerSettings.zoom}
                  onChange={(e) => handleSettingChange("zoom", parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{viewerSettings.zoom}%</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Rotation</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={viewerSettings.rotation}
                  onChange={(e) => handleSettingChange("rotation", parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{viewerSettings.rotation}°</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Window Level</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={viewerSettings.windowLevel}
                  onChange={(e) => handleSettingChange("windowLevel", parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{viewerSettings.windowLevel}</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Window Width</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={viewerSettings.windowWidth}
                  onChange={(e) => handleSettingChange("windowWidth", parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{viewerSettings.windowWidth}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Info */}
      {isLoaded && selectedSeries && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Series <strong>{selectedSeries.seriesNumber}</strong> loaded with <strong>{selectedSeries.instanceCount}</strong> images. 
                Active tool: <strong className="text-primary">{annotationTools.find(t => t.id === activeTool)?.name}</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Annotations are automatically saved and will be available for 24 hours.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 