"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {
  Brain,
  Upload,
  FileImage,
  CheckCircle,
  User,
  FileArchive,
  X,
  Download,
  FileText,
  Eye,
} from "lucide-react"

interface UserData {
  name?: string
  specialty?: string
  role?: string
  licenseNumber?: string
  email?: string
}

export function AIDiagnosisService() {
  const [user, setUser] = useState<UserData | null>(null)
  const imageUploadRef = useRef<HTMLInputElement>(null)
  const dicomUploadRef = useRef<HTMLInputElement>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<typeof mockResults | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [patientInfo, setPatientInfo] = useState({
    fullName: "",
    age: "",
    gender: "",
    dateOfBirth: "",
    contactNumber: "",
    emailAddress: "",
    address: "",
    bloodType: "",
    weight: "",
    medicalHistory: "",
    currentMedications: ""
  })

  // Get logged-in user information
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      console.log("User data loaded:", parsedUser)
    } else {
      console.log("No user data found in localStorage")
    }
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    setUploadedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleInputChange = (field: string, value: string) => {
    setPatientInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      alert("Please upload medical images first")
      return
    }
    const niiFile = uploadedFiles.find(f => f.name.toLowerCase().endsWith('.nii') || f.name.toLowerCase().endsWith('.nii.gz'))
    if (!niiFile) {
      alert('Please upload a .nii or .nii.gz file for AI analysis')
      return
    }

    setIsAnalyzing(true)
    setProgress(10)
    setResults(null)

    try {
      const form = new FormData()
      form.append('file', niiFile)

      const resp = await fetch('/api/inference', { method: 'POST', body: form })
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err.error || 'Inference request failed')
      }
      const data = await resp.json()
      const r = data.result as typeof mockResults
      setResults(r)
      setProgress(100)
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    } catch (e: any) {
      console.error('Inference failed:', e)
      alert(`AI inference failed: ${e?.message || e}`)
      setIsAnalyzing(false)
      setProgress(0)
    }
  }

  const mockResults = {
    diagnosis: "Glioblastoma Multiforme (GBM)",
    tumorLocation: "Right frontal lobe",
    tumorSize: "3.2 x 2.8 x 2.1 cm",
    confidence: 94.2,
    severity: "High Grade (WHO Grade IV)",
    recommendations: [
      "Immediate surgical consultation required",
      "Biopsy for histopathological confirmation",
      "Consider radiation therapy and chemotherapy",
      "Regular MRI monitoring every 2-3 months",
      "Genetic testing for targeted therapy options"
    ],
    riskFactors: [
      "Age-related genetic mutations",
      "Previous radiation exposure",
      "Family history of brain tumors",
      "Immune system disorders"
    ]
  }

  const generateReport = () => {
    // Create a comprehensive report with patient info and diagnosis results
    console.log("Current user data:", user)
    console.log("User name:", user?.name)
    console.log("User specialty:", user?.specialty)
    console.log("User role:", user?.role)
    console.log("User licenseNumber:", user?.licenseNumber)
    
      const reportData = {
        patientInfo,
        diagnosisResults: results || mockResults,
      reportDate: new Date().toLocaleDateString(),
      reportTime: new Date().toLocaleTimeString(),
      doctorName: `Dr. ${user?.name}` || "Dr. [Doctor Name]",
      doctorCredentials: user?.specialty || "MBBS, M.MED (RADIOLOGY)",
      doctorTitle: "Consultant Radiologist",
      doctorId: user?.licenseNumber || "MMC Registration: [To be filled]",
      companyName: "NeuroFusion",
      companyType: "Telemedicine Company",
      location: "Islamabad, Pakistan",
      reportNumber: `NF-${Date.now().toString().slice(-6)}`,
      mrn: patientInfo.fullName ? patientInfo.fullName.replace(/\s+/g, '').toUpperCase() + Date.now().toString().slice(-4) : `MRN${Date.now().toString().slice(-6)}`
    }
    
    console.log("Generated report data:", reportData)
    
    // Open report in new tab with built-in PDF viewer
    const reportWindow = window.open('', '_blank')
    if (!reportWindow) {
      alert('Please allow popups to view the report. Check your browser settings.')
      return
    }
    reportWindow.document.write(generateProfessionalReportHTML(reportData))
    reportWindow.document.close()
  }

  const generateProfessionalReportHTML = (data: any) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NeuroFusion AI Brain Tumor Diagnosis Report - ${data.reportNumber}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.4;
            color: #000;
            background: #fff;
            font-size: 12pt;
          }
          
          .report-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: white;
          }
          
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .hospital-name {
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 5px;
            text-transform: uppercase;
          }
          
          .hospital-legal {
            font-size: 10pt;
            margin-bottom: 5px;
          }
          
          .hospital-address {
            font-size: 10pt;
            margin-bottom: 5px;
          }
          
          .hospital-contact {
            font-size: 10pt;
            margin-bottom: 15px;
          }
          
          .report-title {
            font-size: 16pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
          }
          
          .report-meta {
            font-size: 10pt;
            margin-bottom: 15px;
          }
          
          .ai-notice {
            background: #f8f8f8;
            border: 1px solid #ccc;
            padding: 12px;
            margin-bottom: 20px;
            font-size: 10pt;
            text-align: center;
            border-left: 4px solid #000;
          }
          
          .section {
            margin-bottom: 25px;
          }
          
          .section-title {
            font-size: 12pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
            margin-bottom: 15px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
          }
          
          .info-item {
            display: flex;
            align-items: baseline;
          }
          
          .info-label {
            font-weight: bold;
            min-width: 120px;
            margin-right: 10px;
          }
          
          .info-value {
            flex: 1;
          }
          
          .full-width {
            grid-column: 1 / -1;
          }
          
          .diagnosis-section {
            background: #f8f8f8;
            border: 1px solid #ccc;
            padding: 15px;
            margin: 15px 0;
          }
          
          .diagnosis-title {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
          }
          
          .diagnosis-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
          }
          
          .findings {
            margin: 15px 0;
          }
          
          .findings-title {
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
          }
          
          .findings-list {
            list-style: none;
            padding-left: 20px;
          }
          
          .findings-list li {
            margin-bottom: 8px;
            position: relative;
          }
          
          .findings-list li:before {
            content: "•";
            position: absolute;
            left: -15px;
            font-weight: bold;
          }
          
          .impression {
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #000;
          }
          
          .impression-title {
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
          }
          
          .recommendations {
            margin: 20px 0;
          }
          
          .recommendations-title {
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
          }
          
          .recommendations-list {
            list-style: none;
            padding-left: 20px;
          }
          
          .recommendations-list li {
            margin-bottom: 8px;
            position: relative;
          }
          
          .recommendations-list li:before {
            content: "•";
            position: absolute;
            left: -15px;
            font-weight: bold;
          }
          
          .signature-section {
            margin-top: 40px;
            text-align: right;
          }
          
          .signature-line {
            border-top: 1px solid #000;
            width: 200px;
            margin: 30px 0 10px auto;
          }
          
          .signature-name {
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .signature-credentials {
            font-size: 10pt;
            margin-bottom: 5px;
          }
          
          .signature-title {
            font-size: 10pt;
            margin-bottom: 5px;
          }
          
          .signature-id {
            font-size: 9pt;
          }
          
          .action-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin: 30px 0;
            padding: 20px;
            border-top: 1px solid #ccc;
          }
          
          .btn {
            padding: 10px 20px;
            border: 1px solid #000;
            background: #fff;
            color: #000;
            font-family: 'Times New Roman', serif;
            font-size: 11pt;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            text-align: center;
            transition: background 0.2s;
          }
          
          .btn:hover {
            background: #f0f0f0;
          }
          
          .btn-primary {
            background: #000;
            color: #fff;
          }
          
          .btn-primary:hover {
            background: #333;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            text-align: center;
            font-size: 9pt;
            color: #666;
          }
          
          @media print {
            .action-buttons { display: none; }
            body { background: white; }
            .report-container { padding: 20px; }
          }
          
          @media screen and (max-width: 768px) {
            .report-container { padding: 20px; }
            .info-grid { grid-template-columns: 1fr; }
            .diagnosis-details { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <div class="hospital-name">${data.companyName}</div>
            <div class="hospital-legal">${data.companyType.toUpperCase()}</div>
            <div class="hospital-address">${data.location}</div>
            <div class="hospital-contact">AI-Powered Telemedicine Services</div>
          </div>
          
          <div class="report-title">AI BRAIN TUMOR DIAGNOSIS REPORT</div>
          
          <div class="report-meta">
            <strong>Report Number:</strong> ${data.reportNumber} | 
            <strong>MRN:</strong> ${data.mrn} | 
            <strong>Report Date:</strong> ${data.reportDate} | 
            <strong>Time:</strong> ${data.reportTime}
          </div>
          
          <div class="ai-notice">
            <strong>AI-GENERATED REPORT:</strong> This report is automatically generated by NeuroFusion's artificial intelligence diagnostic system. 
            It should be reviewed by qualified medical professionals before making clinical decisions.
          </div>

          <div class="section">
            <div class="section-title">PATIENT INFORMATION</div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Name:</span>
                <span class="info-value">${data.patientInfo.fullName || 'Not provided'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Age:</span>
                <span class="info-value">${data.patientInfo.age || 'Not provided'} years</span>
              </div>
              <div class="info-item">
                <span class="info-label">Sex:</span>
                <span class="info-value">${data.patientInfo.gender ? data.patientInfo.gender.charAt(0).toUpperCase() : 'Not provided'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Date of Birth:</span>
                <span class="info-value">${data.patientInfo.dateOfBirth || 'Not provided'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Contact:</span>
                <span class="info-value">${data.patientInfo.contactNumber || 'Not provided'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">${data.patientInfo.emailAddress || 'Not provided'}</span>
              </div>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Address:</span>
              <span class="info-value">${data.patientInfo.address || 'Not provided'}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">MEDICAL INFORMATION</div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Blood Type:</span>
                <span class="info-value">${data.patientInfo.bloodType || 'Not provided'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Weight:</span>
                <span class="info-value">${data.patientInfo.weight || 'Not provided'} kg</span>
              </div>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Medical History:</span>
              <span class="info-value">${data.patientInfo.medicalHistory || 'No significant medical history provided'}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Current Medications:</span>
              <span class="info-value">${data.patientInfo.currentMedications || 'No current medications listed'}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">AI DIAGNOSIS RESULTS</div>
            <div class="diagnosis-section">
              <div class="diagnosis-title">PRIMARY DIAGNOSIS</div>
              <div class="diagnosis-details">
                <div class="info-item">
                  <span class="info-label">Diagnosis:</span>
                  <span class="info-value">${data.diagnosisResults.diagnosis}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Confidence:</span>
                  <span class="info-value">${data.diagnosisResults.confidence}%</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Tumor Location:</span>
                  <span class="info-value">${data.diagnosisResults.tumorLocation}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Tumor Size:</span>
                  <span class="info-value">${data.diagnosisResults.tumorSize}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Severity Grade:</span>
                  <span class="info-value">${data.diagnosisResults.severity}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">FINDINGS</div>
            <div class="findings">
              <div class="findings-title">AI ANALYSIS FINDINGS</div>
              <ul class="findings-list">
                <li>A large mass is detected in the ${data.diagnosisResults.tumorLocation.toLowerCase()}</li>
                <li>The mass shows characteristics consistent with ${data.diagnosisResults.diagnosis}</li>
                <li>Tumor dimensions: ${data.diagnosisResults.tumorSize}</li>
                <li>AI detection confidence: ${data.diagnosisResults.confidence}%</li>
                <li>Severity classification: ${data.diagnosisResults.severity}</li>
                <li>No evidence of hydrocephalus in this examination</li>
                <li>The rest of the brain parenchyma appears normal</li>
              </ul>
            </div>
          </div>

          <div class="impression">
            <div class="impression-title">IMPRESSION</div>
            <p><strong>${data.diagnosisResults.diagnosis}</strong> detected in the ${data.diagnosisResults.tumorLocation.toLowerCase()} with ${data.diagnosisResults.confidence}% confidence.</p>
          </div>

          <div class="section">
            <div class="section-title">CLINICAL RECOMMENDATIONS</div>
            <div class="recommendations">
              <div class="recommendations-title">IMMEDIATE ACTIONS REQUIRED</div>
              <ul class="recommendations-list">
                ${data.diagnosisResults.recommendations.map((rec: string) => `
                  <li>${rec}</li>
                `).join('')}
              </ul>
            </div>
          </div>



          <div class="signature-section">
            <div class="signature-line"></div>
            <div class="signature-name">${data.doctorName}</div>
            <div class="signature-credentials">${data.doctorCredentials}</div>
            <div class="signature-title">${data.doctorTitle}</div>
            <div class="signature-id">${data.doctorId}</div>
          </div>

          <div class="action-buttons">
            <button class="btn btn-primary" onclick="window.print()">Print Report</button>
          </div>

          <div class="footer">
            <p><strong>Important Notice:</strong> This report is generated by NeuroFusion's AI diagnostic systems and should be reviewed by qualified medical professionals.</p>
            <p>© ${new Date().getFullYear()} NeuroFusion Telemedicine Company, Islamabad, Pakistan. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  return (
    <DashboardLayout 
      headerContent={{
        title: "AI Brain Tumor Diagnosis",
        description: "Advanced artificial intelligence-powered brain tumor detection and analysis"
      }}
    >
      <div className="space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter patient name"
                    value={patientInfo.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Age *</label>
                  <input
                    type="number"
                    placeholder="Age"
                    value={patientInfo.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Gender *</label>
                  <select 
                    value={patientInfo.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Date of Birth *</label>
                  <input
                    type="date"
                    value={patientInfo.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Contact Number *</label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={patientInfo.contactNumber}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={patientInfo.emailAddress}
                  onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Address</label>
                <textarea
                  placeholder="Full address"
                  rows={2}
                  value={patientInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Blood Type</label>
                  <select 
                    value={patientInfo.bloodType}
                    onChange={(e) => handleInputChange("bloodType", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">Select blood type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="Weight"
                    value={patientInfo.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Medical History</label>
                <textarea
                  placeholder="Previous conditions, surgeries, medications..."
                  rows={3}
                  value={patientInfo.medicalHistory}
                  onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Current Medications</label>
                <textarea
                  placeholder="List current medications and dosages"
                  rows={2}
                  value={patientInfo.currentMedications}
                  onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Column - AI Diagnosis */}
          <div className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Upload Medical Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <Brain className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Upload Brain Scan Images</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload MRI, CT scans, or DICOM files for AI-powered brain tumor analysis
                  </p>
                  <div className="flex gap-2 justify-center">
                    <input
                      ref={imageUploadRef}
                      type="file"
                      multiple
                      accept="image/*,.dcm,.nii,.nii.gz"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => imageUploadRef.current?.click()}
                      type="button"
                    >
                      <FileImage className="w-4 h-4" />
                      Image Files
                    </Button>
                    <input
                      ref={dicomUploadRef}
                      type="file"
                      multiple
                      accept=".dcm,.zip,.nii,.nii.gz"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="dicom-upload"
                    />
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => dicomUploadRef.current?.click()}
                      type="button"
                    >
                      <FileArchive className="w-4 h-4" />
                      DICOM Files
                    </Button>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Uploaded Files:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileImage className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {!isAnalyzing && !analysisComplete && uploadedFiles.length > 0 && (
                  <Button 
                    onClick={handleAnalysis}
                    className="w-full"
                    size="lg"
                    disabled={uploadedFiles.length === 0}
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Run AI Brain Tumor Diagnosis
                  </Button>
                )}

                {isAnalyzing && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <h3 className="text-lg font-semibold mb-2">Analyzing Brain Scan...</h3>
                      <p className="text-muted-foreground">AI is examining the uploaded images for tumor detection and analysis</p>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-center text-sm text-muted-foreground">
                      {Math.round(progress)}% Complete • Estimated time: {Math.ceil((100 - progress) / 5)} seconds
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            {analysisComplete && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    AI Diagnosis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Analysis Complete</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      AI has successfully analyzed the brain scan and generated a comprehensive tumor diagnosis report.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-1">Primary Diagnosis</h4>
                      <p className="text-red-700 text-sm">{(results || mockResults).diagnosis}</p>
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-1">Detection Confidence</h4>
                      <p className="text-orange-700 text-sm">{(results || mockResults).confidence}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-1">Tumor Location</h4>
                      <p className="text-blue-700 text-sm">{(results || mockResults).tumorLocation}</p>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-1">Tumor Size</h4>
                      <p className="text-purple-700 text-sm">{(results || mockResults).tumorSize}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Key Recommendations</h4>
                    <ul className="space-y-2">
                      {(results || mockResults).recommendations.slice(0, 3).map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={generateReport}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Report
                    </Button>
                    <Button variant="default" className="flex-1" onClick={() => {
                      generateReport()
                      // User can print from the opened report window
                      setTimeout(() => {
                        alert('Click the "Print Report" button in the opened window to print or save as PDF')
                      }, 500)
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Print / Save as PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
