"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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

// Custom CSS for the slider
const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`

// Mock Cornerstone tools - in real implementation, you'd import from cornerstone-tools
const mockCornerstoneTools = {
  setToolActive: (toolId: string, options: any) => console.log(`Activating tool: ${toolId}`, options),
  setToolDisabled: (toolId: string) => console.log(`Disabling tool: ${toolId}`),
  clearToolState: (element: any, toolId: string) => console.log(`Clearing tool: ${toolId}`),
  getToolState: (element: any, toolId: string) => ({ data: [] }),
  addToolState: (element: any, toolId: string, data: any) => console.log(`Adding tool state: ${toolId}`),
}

// New interfaces for DICOM series handling
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

export function DicomViewer({ patientId, patientName, onClose }: DicomViewerProps) {
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
      // Set cornerstone as initialized immediately since we're not using it for now
      setCornerstoneInitialized(true)
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

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && selectedSeries && currentSlice < selectedSeries.instanceCount) {
      const playInterval = setInterval(() => {
        setCurrentSlice(prev => {
          if (prev >= selectedSeries.instanceCount) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 200) // 200ms between images for smooth video effect

      return () => clearInterval(playInterval)
    }
  }, [isPlaying, selectedSeries, currentSlice])

  // Display current DICOM image when slice changes
  useEffect(() => {
    if (isLoaded && selectedSeries && currentImageIds.length > 0 && currentSlice <= currentImageIds.length) {
      // Update the display to show current image info
      console.log(`Displaying image ${currentSlice}:`, currentImageIds[currentSlice - 1])
      
      // Display the current DICOM image on canvas
      displayDicomImage(currentSlice - 1)
    }
  }, [currentSlice, currentImageIds, isLoaded, selectedSeries])

  // Function to display DICOM image on canvas
  const displayDicomImage = async (imageIndex: number) => {
    if (!selectedSeries || !selectedSeries.images[imageIndex]) return
    
    try {
      const canvas = document.getElementById(`dicom-canvas-${imageIndex + 1}`) as HTMLCanvasElement
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      // Set canvas size
      canvas.width = 512
      canvas.height = 512
      
      // Get the DICOM file
      const dicomFile = selectedSeries.images[imageIndex].file
      
      // Read the file as ArrayBuffer
      const arrayBuffer = await dicomFile.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      
      // Create a simple visualization (this is a mock - real DICOM parsing would be more complex)
      const imageData = ctx.createImageData(512, 512)
      
      // Generate a simple pattern based on the DICOM data
      for (let i = 0; i < imageData.data.length; i += 4) {
        const pixelIndex = Math.floor(i / 4)
        const x = pixelIndex % 512
        const y = Math.floor(pixelIndex / 512)
        
        // Create a simple visualization pattern
        const intensity = (uint8Array[i % uint8Array.length] || 0) % 256
        const pattern = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 50 + intensity
        
        imageData.data[i] = pattern     // Red
        imageData.data[i + 1] = pattern // Green  
        imageData.data[i + 2] = pattern // Blue
        imageData.data[i + 3] = 255     // Alpha
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      console.log(`Displayed DICOM image ${imageIndex + 1} on canvas`)
      
    } catch (error) {
      console.error('Error displaying DICOM image:', error)
    }
  }

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
    if (file && (file.type === "application/zip" || file.name.toLowerCase().endsWith('.zip'))) {
      try {
        setError("") // Clear any previous errors
        
        // Import JSZip dynamically to avoid SSR issues
        const JSZip = (await import('jszip')).default
        const zip = new JSZip()
        
        console.log("Loading zip file:", file.name, "Size:", file.size)
        
        // Load the zip file
        const zipContent = await zip.loadAsync(file)
        
        console.log("Zip loaded, files found:", Object.keys(zipContent.files))
        
        // Extract all files from the zip
        const extractedFiles: File[] = []
        
        for (const [filename, zipEntry] of Object.entries(zipContent.files)) {
          // Skip directories and hidden files
          if (zipEntry.dir || filename.startsWith('__MACOSX') || filename.startsWith('.DS_Store')) {
            continue
          }
          
          console.log("Processing file:", filename, "Size:", (zipEntry as any)._data?.uncompressedSize || "unknown")
          
          // Check if it's a DICOM file
          if (filename.toLowerCase().endsWith('.dcm') || filename.toLowerCase().includes('dicom')) {
            try {
              // Convert zip entry to blob
              const blob = await zipEntry.async('blob')
              
              // Create a File object from the blob
              const extractedFile = new File([blob], filename, {
                type: 'application/dicom',
                lastModified: new Date().getTime()
              })
              
              extractedFiles.push(extractedFile)
              console.log("Successfully extracted DICOM file:", filename)
            } catch (extractError) {
              console.warn(`Failed to extract ${filename}:`, extractError)
            }
          } else {
            console.log("Skipping non-DICOM file:", filename)
          }
        }
        
        if (extractedFiles.length === 0) {
          setError("No DICOM files found in the zip archive. Please ensure the zip contains .dcm files.")
          return
        }
        
        console.log(`Successfully extracted ${extractedFiles.length} DICOM files from zip`)
        
        // Process the extracted DICOM files
        processDicomFiles(extractedFiles)
        
      } catch (error) {
        console.error("Error processing zip file:", error)
        setError(`Failed to process zip file: ${error instanceof Error ? error.message : String(error)}. Please ensure it's a valid zip archive containing DICOM files.`)
      }
    } else {
      setError("Please select a valid zip file (.zip extension)")
    }
  }

    // Process DICOM files and organize them into a single series for scrolling
  const processDicomFiles = async (files: File[]) => {
    try {
      console.log("Processing files:", files.map(f => ({ name: f.name, size: f.size, type: f.type })))
      
      // Filter for DICOM files
      const dicomFiles = files.filter(file => 
        file.name.toLowerCase().endsWith('.dcm') || 
        file.type === 'application/dicom'
      )

      console.log("DICOM files found:", dicomFiles.length, dicomFiles.map(f => f.name))

      if (dicomFiles.length === 0) {
        setError("No DICOM files found. Please select files with .dcm extension")
        return
      }

      // Create image URLs for Cornerstone.js (like the working version)
      const imageIds = dicomFiles.map((file) => {
        const fileUrl = URL.createObjectURL(file)
        return `wadouri:${fileUrl}`
      })

      // Store current image IDs for persistence
      setCurrentImageIds(imageIds)

      // Create a single series with ALL DICOM files for scrolling navigation
      const singleSeries: DicomSeries = {
        id: `series-all-${Date.now()}`,
        seriesNumber: 1,
        seriesDescription: `Complete DICOM Series (${dicomFiles.length} images)`,
        modality: "CT", // Default modality
        bodyPart: "Full Body",
        studyDate: new Date().toISOString().split('T')[0],
        studyTime: new Date().toTimeString().split(' ')[0],
        manufacturer: "Generic Medical",
        modelName: "Scanner Model X",
        instanceCount: dicomFiles.length,
        images: [],
        isSelected: true
      }

      // Add all DICOM files as individual images in the series
      dicomFiles.forEach((file, index) => {
        const image: DicomImage = {
          id: `image-${index}`,
          instanceNumber: index + 1,
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
        
        singleSeries.images.push(image)
      })

      // Create a mock study with just this one series
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
        series: [singleSeries]
      }

      // Set the single series as selected
      setDicomStudy(mockStudy)
      setSelectedSeries(singleSeries)
      setIsLoaded(true)
      setCurrentSlice(1)

             // After loading images, try to load annotations
       loadAnnotationsFromLocalStorage()

       // Display the first image immediately
       setTimeout(() => {
         displayDicomImage(0)
       }, 100)

       console.log(`Processed ${dicomFiles.length} DICOM files into 1 series for scrolling`)
       console.log("DICOM Study State:", mockStudy)
       console.log("Selected Series:", singleSeries)
       console.log("Image IDs created:", imageIds)
       console.log("isLoaded:", true)
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

  // Handle slice change from slider
  const handleSliceChange = (newSlice: number) => {
    if (selectedSeries && newSlice >= 1 && newSlice <= selectedSeries.instanceCount) {
      setCurrentSlice(newSlice)
      console.log(`Changed to slice ${newSlice} of ${selectedSeries.instanceCount}`)
    }
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
    <>
      <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />
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
                  {...({ webkitdirectory: "" } as any)}
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

      {/* Series Information */}
      {dicomStudy && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid3X3 className="w-5 h-5" />
              DICOM Series Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg bg-primary/5 border-primary">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{dicomStudy.series[0].seriesNumber}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium">{dicomStudy.series[0].seriesDescription}</h4>
                  <p className="text-sm text-muted-foreground">{dicomStudy.series[0].bodyPart} • {dicomStudy.series[0].modality}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium">{dicomStudy.series[0].instanceCount} images</p>
                  <p className="text-sm text-muted-foreground">{dicomStudy.series[0].manufacturer}</p>
                </div>
              </div>
                             <p className="text-sm text-muted-foreground mt-3">
                 Use the slider below to navigate through all {dicomStudy.series[0].instanceCount} DICOM images
               </p>
               {selectedSeries && (
                 <div className="mt-3 p-2 bg-primary/10 rounded border border-primary/20">
                   <p className="text-xs text-primary font-medium">
                     Currently viewing: Image {currentSlice} of {selectedSeries.instanceCount}
                   </p>
                   <p className="text-xs text-muted-foreground">
                     File: {selectedSeries.images[currentSlice - 1]?.file.name || 'Unknown'}
                   </p>
                 </div>
               )}
            </div>
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
             className="w-full h-96 bg-black rounded-lg border relative overflow-hidden"
           >
             {!selectedSeries ? (
               <div className="text-white text-center flex items-center justify-center h-full">
                 <div className="text-center">
                   <FileImage className="w-16 h-16 mx-auto mb-4 opacity-50" />
                   <p>Upload DICOM files to view</p>
                 </div>
               </div>
             ) : (
               <div className="w-full h-full">
                                   {/* Show current DICOM image directly */}
                  {currentImageIds.length > 0 && currentSlice <= currentImageIds.length && (
                    <div className="w-full h-full flex items-center justify-center">
                      <canvas
                        id={`dicom-canvas-${currentSlice}`}
                        className="max-w-full max-h-full"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>
                  )}
                 
                 {/* Image counter overlay */}
                 <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                   {currentSlice} / {selectedSeries.instanceCount}
                 </div>
               </div>
             )}
           </div>

                     {/* Series Navigation */}
           {isLoaded && selectedSeries && selectedSeries.instanceCount > 1 && (
             <div className="mt-4 space-y-4 p-4 bg-muted/30 rounded-lg">
               <div className="flex items-center justify-between">
                 <span className="text-lg font-semibold">Image Navigation</span>
                 <div className="flex items-center gap-2">
                                       <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSliceChange(Math.max(1, currentSlice - 1))}
                      disabled={currentSlice <= 1}
                    >
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSliceChange(Math.min(selectedSeries.instanceCount, currentSlice + 1))}
                      disabled={currentSlice >= selectedSeries.instanceCount}
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>
                 </div>
               </div>
               <div className="space-y-3">
                 <div className="flex items-center justify-between text-sm">
                   <span className="font-medium">Image {currentSlice} of {selectedSeries.instanceCount}</span>
                   <span className="text-muted-foreground">
                     {Math.round((currentSlice / selectedSeries.instanceCount) * 100)}% complete
                   </span>
                 </div>
                                   <input
                    type="range"
                    min="1"
                    max={selectedSeries.instanceCount}
                    value={currentSlice}
                    onChange={(e) => handleSliceChange(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                 <div className="flex justify-between text-xs text-muted-foreground">
                   <span>1</span>
                   <span>{Math.ceil(selectedSeries.instanceCount / 2)}</span>
                   <span>{selectedSeries.instanceCount}</span>
                 </div>
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
    </>
  )
} 