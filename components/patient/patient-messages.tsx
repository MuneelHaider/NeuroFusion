"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {
  Search,
  Plus,
  Filter,
  MessageSquare,
  Calendar,
  User,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  Video,
  Phone,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Message {
  id: string
  sender: "doctor" | "patient"
  senderName: string
  senderRole: string
  content: string
  timestamp: string
  type: "text" | "file" | "image" | "voice"
  isRead: boolean
  attachments?: number
}

interface Conversation {
  id: string
  doctorName: string
  doctorSpecialty: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  status: "active" | "archived" | "pending"
  messages: Message[]
}

const mockConversations: Conversation[] = [
  {
    id: "C001",
    doctorName: "Dr. Sarah Mitchell",
    doctorSpecialty: "Cardiology",
    lastMessage: "Your blood pressure readings look much better this week!",
    lastMessageTime: "2 hours ago",
    unreadCount: 0,
    status: "active",
    messages: [
      {
        id: "M001",
        sender: "patient",
        senderName: "You",
        senderRole: "Patient",
        content: "Hi Dr. Mitchell, I've been monitoring my blood pressure as recommended",
        timestamp: "2024-12-15T08:00:00Z",
        type: "text",
        isRead: true,
      },
      {
        id: "M002",
        sender: "doctor",
        senderName: "Dr. Sarah Mitchell",
        senderRole: "Cardiologist",
        content: "Hello! That's great to hear. How have the readings been?",
        timestamp: "2024-12-15T08:15:00Z",
        type: "text",
        isRead: true,
      },
      {
        id: "M003",
        sender: "patient",
        senderName: "You",
        senderRole: "Patient",
        content: "Much more stable! Here are this week's readings",
        timestamp: "2024-12-15T08:30:00Z",
        type: "file",
        isRead: true,
        attachments: 1,
      },
      {
        id: "M004",
        sender: "doctor",
        senderName: "Dr. Sarah Mitchell",
        senderRole: "Cardiologist",
        content: "Your blood pressure readings look much better this week!",
        timestamp: "2024-12-15T10:00:00Z",
        type: "text",
        isRead: false,
      },
    ],
  },
  {
    id: "C002",
    doctorName: "Dr. Michael Chen",
    doctorSpecialty: "Neurology",
    lastMessage: "Can we schedule a follow-up appointment for next week?",
    lastMessageTime: "1 day ago",
    unreadCount: 1,
    status: "active",
    messages: [
      {
        id: "M005",
        sender: "doctor",
        senderName: "Dr. Michael Chen",
        senderRole: "Neurologist",
        content: "Hi there! How are you feeling since our last consultation?",
        timestamp: "2024-12-14T09:00:00Z",
        type: "text",
        isRead: true,
      },
      {
        id: "M006",
        sender: "patient",
        senderName: "You",
        senderRole: "Patient",
        content: "Much better, thank you! The medication seems to be working well",
        timestamp: "2024-12-14T09:30:00Z",
        type: "text",
        isRead: true,
      },
      {
        id: "M007",
        sender: "doctor",
        senderName: "Dr. Michael Chen",
        senderRole: "Neurologist",
        content: "Can we schedule a follow-up appointment for next week?",
        timestamp: "2024-12-14T16:00:00Z",
        type: "text",
        isRead: false,
      },
    ],
  },
  {
    id: "C003",
    doctorName: "Dr. Emily Rodriguez",
    doctorSpecialty: "Dermatology",
    lastMessage: "The skin condition has improved significantly",
    lastMessageTime: "3 days ago",
    unreadCount: 0,
    status: "active",
    messages: [
      {
        id: "M008",
        sender: "patient",
        senderName: "You",
        senderRole: "Patient",
        content: "Hi Dr. Rodriguez, I wanted to update you on my skin condition",
        timestamp: "2024-12-12T11:00:00Z",
        type: "text",
        isRead: true,
      },
      {
        id: "M009",
        sender: "doctor",
        senderName: "Dr. Emily Rodriguez",
        senderRole: "Dermatologist",
        content: "Hello! I'd be happy to hear about your progress",
        timestamp: "2024-12-12T11:15:00Z",
        type: "text",
        isRead: true,
      },
      {
        id: "M010",
        sender: "patient",
        senderName: "You",
        senderRole: "Patient",
        content: "The skin condition has improved significantly",
        timestamp: "2024-12-12T14:00:00Z",
        type: "text",
        isRead: true,
      },
    ],
  },
]

export function PatientMessages() {
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      conversation.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || conversation.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      sender: "patient",
      senderName: "You",
      senderRole: "Patient",
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
      isRead: false,
    }

    const updatedConversation = {
      ...selectedConversation,
      lastMessage: newMessage,
      lastMessageTime: "Just now",
      unreadCount: 0,
      messages: [...selectedConversation.messages, message],
    }

    setConversations(conversations.map(c => 
      c.id === selectedConversation.id ? updatedConversation : c
    ))
    setSelectedConversation(updatedConversation)
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) return null

  return (
    <DashboardLayout 
      headerContent={{
        title: "Messages",
        description: "Communicate with your healthcare providers",
        actions: (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Message
          </Button>
        )
      }}
    >
      <div className="h-[calc(100vh-200px)] flex">
        {/* Left Sidebar - Conversations */}
        <div className="w-80 border-r bg-muted/20">
          {/* Search and Filters */}
          <div className="p-4 border-b">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Conversations</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-primary/5 border-primary/20' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {conversation.doctorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm truncate">{conversation.doctorName}</h3>
                      <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-primary">{conversation.doctorSpecialty}</p>
                    <p className="text-sm text-muted-foreground truncate mt-1">{conversation.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(conversation.status)} variant="outline" className="text-xs">
                        {conversation.status}
                      </Badge>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Messages */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {selectedConversation.doctorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedConversation.doctorName}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge className={getStatusColor(selectedConversation.status)} variant="outline">
                          {selectedConversation.status}
                        </Badge>
                        <span className="text-primary">{selectedConversation.doctorSpecialty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      message.sender === 'patient' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    } rounded-lg p-3`}>
                      {message.type === 'text' && (
                        <p className="text-sm">{message.content}</p>
                      )}
                      {message.type === 'file' && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <div>
                            <p className="text-sm font-medium">Document</p>
                            <p className="text-xs opacity-80">{message.attachments} attachment(s)</p>
                          </div>
                        </div>
                      )}
                      <p className={`text-xs mt-2 ${
                        message.sender === 'patient' ? 'opacity-80' : 'text-muted-foreground'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-card">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={sendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation to start messaging</h3>
                <p>Choose a healthcare provider from the list to begin your conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
} 