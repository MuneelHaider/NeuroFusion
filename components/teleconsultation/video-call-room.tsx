"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, VideoOff, Mic, MicOff, PhoneOff, Share, Settings, Monitor, Users, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VideoCallRoomProps {
  roomId: string
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: string
  type: "text" | "system"
}

interface CallParticipant {
  id: string
  name: string
  role: "doctor" | "patient"
  isVideoOn: boolean
  isAudioOn: boolean
  isConnected: boolean
}

export function VideoCallRoom({ roomId }: VideoCallRoomProps) {
  const [user, setUser] = useState<any>(null)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [callDuration, setCallDuration] = useState(0)
  const [isCallActive, setIsCallActive] = useState(true)
  const [participants, setParticipants] = useState<CallParticipant[]>([])
  const [notes, setNotes] = useState("")
  const [prescription, setPrescription] = useState("")

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Mock participants
      setParticipants([
        {
          id: "1",
          name: parsedUser.name,
          role: parsedUser.role,
          isVideoOn: true,
          isAudioOn: true,
          isConnected: true,
        },
        {
          id: "2",
          name: parsedUser.role === "doctor" ? "Sarah Johnson" : "Dr. Sarah Mitchell",
          role: parsedUser.role === "doctor" ? "patient" : "doctor",
          isVideoOn: true,
          isAudioOn: true,
          isConnected: true,
        },
      ])

      // Mock initial chat messages
      setChatMessages([
        {
          id: "1",
          sender: "System",
          message: "Call started",
          timestamp: new Date().toISOString(),
          type: "system",
        },
      ])
    }

    // Mock call duration timer
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    // Mock video stream (placeholder)
    if (localVideoRef.current) {
      localVideoRef.current.src = "/placeholder.svg?height=200&width=300&text=Your+Video"
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.src = "/placeholder.svg?height=400&width=600&text=Remote+Video"
    }

    return () => clearInterval(interval)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
  }

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn)
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
  }

  const endCall = () => {
    setIsCallActive(false)
    // Redirect based on user role
    if (user?.role === "doctor") {
      router.push("/doctor/teleconsultation")
    } else {
      router.push("/patient/teleconsultation")
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: user?.name || "You",
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
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

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="font-medium">Live Call</span>
            </div>
            <Badge variant="outline" className="bg-transparent">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(callDuration)}
            </Badge>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">{participants.length} participants</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="destructive" onClick={endCall}>
              <PhoneOff className="w-4 h-4 mr-2" />
              End Call
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Video Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Main Video */}
          <Card>
            <CardContent className="p-0">
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <video ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay muted />

                {/* Remote participant info */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/50 text-white">{participants.find((p) => p.id !== "1")?.name}</Badge>
                </div>

                {/* Local video (picture-in-picture) */}
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border-2 border-white">
                  <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay muted />
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-black/50 text-white text-xs">You</Badge>
                  </div>
                </div>

                {/* Video controls overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 bg-black/50 rounded-full p-2">
                    <Button
                      size="sm"
                      variant={isVideoOn ? "secondary" : "destructive"}
                      className="rounded-full w-10 h-10 p-0"
                      onClick={toggleVideo}
                    >
                      {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>

                    <Button
                      size="sm"
                      variant={isAudioOn ? "secondary" : "destructive"}
                      className="rounded-full w-10 h-10 p-0"
                      onClick={toggleAudio}
                    >
                      {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>

                    <Button
                      size="sm"
                      variant={isScreenSharing ? "default" : "secondary"}
                      className="rounded-full w-10 h-10 p-0"
                      onClick={toggleScreenShare}
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>

                    <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Screen sharing indicator */}
          {isScreenSharing && (
            <Alert>
              <Monitor className="h-4 w-4" />
              <AlertDescription>You are sharing your screen with the participant.</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="chat" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              {user.role === "doctor" && <TabsTrigger value="prescription">Rx</TabsTrigger>}
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  {/* Chat messages */}
                  <div className="space-y-3 h-96 overflow-y-auto mb-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`${msg.type === "system" ? "text-center" : ""}`}>
                        {msg.type === "system" ? (
                          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full inline-block">
                            {msg.message}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{msg.sender}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="text-sm bg-muted p-2 rounded-lg">{msg.message}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Chat input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                    <Button size="sm" onClick={sendMessage}>
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Call Notes</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about this consultation..."
                        className="w-full h-96 p-3 border rounded-lg text-sm resize-none"
                      />
                    </div>
                    <Button className="w-full">Save Notes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {user.role === "doctor" && (
              <TabsContent value="prescription" className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Digital Prescription</label>
                        <textarea
                          value={prescription}
                          onChange={(e) => setPrescription(e.target.value)}
                          placeholder="Write prescription details..."
                          className="w-full h-80 p-3 border rounded-lg text-sm resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Button className="w-full">Send Prescription</Button>
                        <Button variant="outline" className="w-full bg-transparent">
                          Save as Draft
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
