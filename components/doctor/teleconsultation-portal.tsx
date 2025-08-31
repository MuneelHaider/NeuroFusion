"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { 
  Video, 
  Phone, 
  Calendar, 
  Clock, 
  FileText, 
  Settings, 
  Play, 
  Users, 
  Send, 
  Paperclip,
  Mic,
  PhoneOff,
  VideoOff,
  MicOff,
  MoreVertical,
  Search,
  MessageCircle,
  FileImage,
  FileVideo,
  FileAudio,
  Download,
  Plus
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TeleconsultationSession {
  id: string
  patientName: string
  patientId: string
  scheduledTime: string
  duration: number
  status: "scheduled" | "waiting" | "in-progress" | "completed" | "missed"
  type: "video" | "phone"
  reason: string
  roomId?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  isOnline?: boolean
}

interface ChatMessage {
  id: string
  sender: "doctor" | "patient"
  message: string
  timestamp: string
  type: "text" | "file" | "image" | "voice"
  fileName?: string
  fileSize?: string
  fileUrl?: string
}

interface SharedFile {
  id: string
  name: string
  size: string
  type: "document" | "image" | "video" | "audio"
  uploadedBy: string
  uploadedAt: string
  url: string
}

const mockSessions: TeleconsultationSession[] = [
  {
    id: "TC001",
    patientName: "Sarah Johnson",
    patientId: "P001",
    scheduledTime: "2024-12-16T10:00:00Z",
    duration: 30,
    status: "waiting",
    type: "video",
    reason: "Follow-up consultation",
    roomId: "room-tc001",
    lastMessage: "I'm ready for our consultation",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
    isOnline: true
  },
  {
    id: "TC002",
    patientName: "Michael Chen",
    patientId: "P002",
    scheduledTime: "2024-12-16T14:30:00Z",
    duration: 45,
    status: "scheduled",
    type: "video",
    reason: "Specialist consultation",
    roomId: "room-tc002",
    lastMessage: "Thank you for the prescription",
    lastMessageTime: "1 hour ago",
    unreadCount: 0,
    isOnline: false
  },
  {
    id: "TC003",
    patientName: "Emily Rodriguez",
    patientId: "P003",
    scheduledTime: "2024-12-16T16:00:00Z",
    duration: 30,
    status: "scheduled",
    type: "phone",
    reason: "Prescription review",
    lastMessage: "Can we reschedule for tomorrow?",
    lastMessageTime: "3 hours ago",
    unreadCount: 1,
    isOnline: true
  },
  {
    id: "TC004",
    patientName: "David Wilson",
    patientId: "P004",
    scheduledTime: "2024-12-17T09:00:00Z",
    duration: 45,
    status: "scheduled",
    type: "video",
    reason: "Cardiac consultation",
    lastMessage: "I've uploaded my latest test results",
    lastMessageTime: "1 day ago",
    unreadCount: 0,
    isOnline: false
  },
  {
    id: "TC005",
    patientName: "Jennifer Lee",
    patientId: "P005",
    scheduledTime: "2024-12-17T11:30:00Z",
    duration: 30,
    status: "scheduled",
    type: "video",
    reason: "Follow-up visit",
    lastMessage: "Looking forward to our session",
    lastMessageTime: "2 days ago",
    unreadCount: 0,
    isOnline: true
  }
]

// Mock chat messages for the selected patient
const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "patient",
    message: "Good morning Dr. Haider, I'm ready for our consultation",
    timestamp: "10:00 AM",
    type: "text"
  },
  {
    id: "2",
    sender: "doctor",
    message: "Good morning Sarah! How are you feeling today?",
    timestamp: "10:01 AM",
    type: "text"
  },
  {
    id: "3",
    sender: "patient",
    message: "Much better than last week. The medication seems to be working well",
    timestamp: "10:02 AM",
    type: "text"
  },
  {
    id: "4",
    sender: "patient",
    message: "I've uploaded my latest blood pressure readings",
    timestamp: "10:03 AM",
    type: "file",
    fileName: "BP_Readings_December.pdf",
    fileSize: "245 KB"
  },
  {
    id: "5",
    sender: "doctor",
    message: "Excellent! I can see the readings are much more stable now",
    timestamp: "10:04 AM",
    type: "text"
  }
]

// Mock shared files
const mockSharedFiles: SharedFile[] = [
  {
    id: "1",
    name: "BP_Readings_December.pdf",
    size: "245 KB",
    type: "document",
    uploadedBy: "Sarah Johnson",
    uploadedAt: "2 minutes ago",
    url: "#"
  },
  {
    id: "2",
    name: "ECG_Report.jpg",
    size: "1.8 MB",
    type: "image",
    uploadedBy: "Sarah Johnson",
    uploadedAt: "5 minutes ago",
    url: "#"
  },
  {
    id: "3",
    name: "Blood_Test_Results.pdf",
    size: "2.4 MB",
    type: "document",
    uploadedBy: "Dr. Haider",
    uploadedAt: "1 hour ago",
    url: "#"
  }
]

export function TeleconsultationPortal() {
  const [user, setUser] = useState<any>(null)
  const [sessions, setSessions] = useState<TeleconsultationSession[]>(mockSessions)
  const [callHistory, setCallHistory] = useState<any[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedPatient, setSelectedPatient] = useState<TeleconsultationSession | null>(mockSessions[0])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("chat")
  const [notes, setNotes] = useState("")
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>(mockSharedFiles)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-warning/10 text-warning"
      case "in-progress":
        return "bg-success/10 text-success"
      case "scheduled":
        return "bg-primary/10 text-primary"
      case "completed":
        return "bg-muted text-muted-foreground"
      case "missed":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "video" ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />
  }

  const isSessionActive = (session: TeleconsultationSession) => {
    const sessionTime = new Date(session.scheduledTime)
    const timeDiff = Math.abs(currentTime.getTime() - sessionTime.getTime())
    return timeDiff <= 15 * 60 * 1000 // Within 15 minutes
  }

  const filteredSessions = sessions.filter(session =>
    session.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const waitingSessions = sessions.filter((s) => s.status === "waiting")
  const upcomingSessions = sessions.filter((s) => s.status === "scheduled")

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedPatient) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: "doctor",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "text"
    }

    setChatMessages([...chatMessages, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const startVideoCall = () => {
    if (selectedPatient?.roomId) {
      setIsVideoCallActive(true)
      // In a real app, this would navigate to the video call room
      window.open(`/teleconsultation/room/${selectedPatient.roomId}`, '_blank')
    }
  }

  const startVoiceCall = () => {
    setIsVoiceCallActive(true)
    // In a real app, this would initiate a voice call
  }

  const endCall = () => {
    setIsVideoCallActive(false)
    setIsVoiceCallActive(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "doctor",
      message: `Shared file: ${file.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "file",
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      fileUrl: URL.createObjectURL(file)
    }

    setChatMessages([...chatMessages, fileMessage])
    
    // Add to shared files
    const newFile: SharedFile = {
      id: Date.now().toString(),
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 
            file.type.startsWith('audio/') ? 'audio' : 'document',
      uploadedBy: user?.name || "Dr. Haider",
      uploadedAt: "Just now",
      url: URL.createObjectURL(file)
    }

    setSharedFiles([...sharedFiles, newFile])
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <FileImage className="w-5 h-5" />
      case 'video': return <FileVideo className="w-5 h-5" />
      case 'audio': return <FileAudio className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  if (!user) return null

  return (
    <DashboardLayout 
      headerContent={{
        title: "Teleconsultation Portal",
        description: "Chat, call, and manage your patients",
        actions: (
          <>
            <Button variant="outline" size="lg">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Button>
            <Button size="lg">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Session
            </Button>
          </>
        )
      }}
    >
      <div className="h-[calc(100vh-200px)] flex flex-col">
        {/* Main Chat Interface */}
        <div className="flex-1 flex">
          {/* Left Sidebar - Patient List */}
          <div className="w-80 border-r bg-muted/20">
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-base h-12"
                />
              </div>
            </div>

            {/* Patient List */}
            <div className="flex-1 overflow-y-auto">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedPatient?.id === session.id ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                  onClick={() => setSelectedPatient(session)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                          {session.patientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {session.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg truncate">{session.patientName}</h3>
                        <span className="text-sm text-muted-foreground">{session.lastMessageTime}</span>
                      </div>
                      <p className="text-base text-muted-foreground truncate mt-1">{session.lastMessage}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`${getStatusColor(session.status)} text-sm px-3 py-1`} variant="outline">
                          {session.status}
                        </Badge>
                        {session.unreadCount && session.unreadCount > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                            {session.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedPatient ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                          {selectedPatient.patientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-xl">{selectedPatient.patientName}</h3>
                        <div className="flex items-center gap-2 text-base text-muted-foreground mt-1">
                          <Badge className={`${getStatusColor(selectedPatient.status)} text-sm px-3 py-1`} variant="outline">
                            {selectedPatient.status}
                          </Badge>
                          {selectedPatient.isOnline && (
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-success rounded-full"></div>
                              <span className="text-base">Online</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* All Controls */}
                    <div className="flex items-center gap-3">
                      {/* Call Controls */}
                      {isVideoCallActive ? (
                        <Button variant="destructive" size="lg" onClick={endCall}>
                          <PhoneOff className="w-5 h-5 mr-2" />
                          End Call
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" size="lg" onClick={startVoiceCall}>
                            <Phone className="w-5 h-5 mr-2" />
                            Voice
                          </Button>
                          <Button size="lg" onClick={startVideoCall}>
                            <Video className="w-5 h-5 mr-2" />
                            Video
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                  <div className="px-4 pt-4">
                    <TabsList className="grid w-full grid-cols-3 h-12">
                      <TabsTrigger value="chat" className="text-base">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Chat
                      </TabsTrigger>
                      <TabsTrigger value="files" className="text-base">
                        <FileText className="w-5 h-5 mr-2" />
                        Files
                      </TabsTrigger>
                      <TabsTrigger value="notes" className="text-base">
                        <FileText className="w-5 h-5 mr-2" />
                        Notes
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="chat" className="flex-1 flex flex-col p-4">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md ${
                            message.sender === 'doctor' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          } rounded-lg p-4`}>
                            {message.type === 'text' && (
                              <p className="text-base">{message.message}</p>
                            )}
                            {message.type === 'file' && (
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5" />
                                <div>
                                  <p className="text-base font-medium">{message.fileName}</p>
                                  <p className="text-sm opacity-80">{message.fileSize}</p>
                                </div>
                              </div>
                            )}
                            <p className={`text-sm mt-3 ${
                              message.sender === 'doctor' ? 'opacity-80' : 'text-muted-foreground'
                            }`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="flex items-center gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                      />
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" size="lg">
                        <FileImage className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" size="lg">
                        <Mic className="w-5 h-5" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 text-base h-12"
                      />
                      <Button size="lg" onClick={sendMessage}>
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="files" className="flex-1 p-4">
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">Shared Files</CardTitle>
                          <Button 
                            variant="outline" 
                            size="lg"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            Upload
                          </Button>
                        </div>
                        <CardDescription className="text-base">Files shared during this consultation</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {sharedFiles.map((file) => (
                            <div key={file.id} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                {getFileIcon(file.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-base truncate">{file.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {file.size} • {file.uploadedBy} • {file.uploadedAt}
                                </p>
                              </div>
                              <Button variant="outline" size="lg">
                                <Download className="w-5 h-5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notes" className="flex-1 p-4">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-xl">Consultation Notes</CardTitle>
                        <CardDescription className="text-base">Keep track of important information during the consultation</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-base font-medium mb-3 block">Notes</label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes about this consultation..."
                            className="w-full h-96 p-4 border rounded-lg text-base resize-none"
                          />
                        </div>
                        <Button size="lg" className="w-full">Save Notes</Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              /* No Patient Selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="w-20 h-20 mx-auto mb-6 opacity-50" />
                  <h3 className="text-2xl font-semibold mb-3">Select a patient to start chatting</h3>
                  <p className="text-lg">Choose a patient from the list to begin your consultation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
