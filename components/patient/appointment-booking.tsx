"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Calendar, Clock, Star, MapPin, ArrowLeft, Video, Phone, User, CreditCard, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AppointmentBookingProps {
  doctorId: string
}

interface Doctor {
  id: string
  name: string
  specialty: string
  experience: number
  rating: number
  reviewCount: number
  location: string
  consultationFee: number
  education: string
  hospital: string
}

interface TimeSlot {
  time: string
  available: boolean
}

const mockDoctor: Doctor = {
  id: "D001",
  name: "Dr. Sarah Mitchell",
  specialty: "Cardiology",
  experience: 12,
  rating: 4.9,
  reviewCount: 156,
  location: "Downtown Medical Center",
  consultationFee: 200,
  education: "Harvard Medical School",
  hospital: "City General Hospital",
}

const availableDates = [
  { date: "2024-12-16", day: "Today", slots: 3 },
  { date: "2024-12-17", day: "Tomorrow", slots: 5 },
  { date: "2024-12-18", day: "Wed", slots: 7 },
  { date: "2024-12-19", day: "Thu", slots: 4 },
  { date: "2024-12-20", day: "Fri", slots: 6 },
]

const timeSlots: TimeSlot[] = [
  { time: "09:00 AM", available: true },
  { time: "09:30 AM", available: false },
  { time: "10:00 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "11:30 AM", available: true },
  { time: "02:00 PM", available: true },
  { time: "02:30 PM", available: true },
  { time: "03:00 PM", available: false },
  { time: "03:30 PM", available: true },
  { time: "04:00 PM", available: true },
  { time: "04:30 PM", available: true },
]

export function AppointmentBooking({ doctorId }: AppointmentBookingProps) {
  const [user, setUser] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("in-person")
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !reason) return

    setIsBooking(true)

    try {
      // Simulate booking API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setBookingComplete(true)
    } catch (error) {
      console.error("Booking failed:", error)
    } finally {
      setIsBooking(false)
    }
  }

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />
      case "phone":
        return <Phone className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getAppointmentTypeFee = (type: string) => {
    switch (type) {
      case "video":
        return mockDoctor.consultationFee * 0.9 // 10% discount for video
      case "phone":
        return mockDoctor.consultationFee * 0.8 // 20% discount for phone
      default:
        return mockDoctor.consultationFee
    }
  }

  if (!user) return null

  if (bookingComplete) {
    return (
      <DashboardLayout user={user}>
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Appointment Booked Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                Your appointment with {mockDoctor.name} has been confirmed for {selectedDate} at {selectedTime}.
              </p>
              <div className="space-y-3">
                <Button onClick={() => router.push("/patient/appointments")} className="w-full">
                  View My Appointments
                </Button>
                <Button variant="outline" onClick={() => router.push("/patient/doctors")} className="w-full">
                  Book Another Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Book Appointment</h1>
            <p className="text-muted-foreground">Schedule your consultation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Doctor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {mockDoctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{mockDoctor.name}</h3>
                  <p className="text-sm text-primary">{mockDoctor.specialty}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>
                    {mockDoctor.rating} ({mockDoctor.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{mockDoctor.location}</span>
                </div>
                <p>
                  <span className="font-medium">Experience:</span> {mockDoctor.experience} years
                </p>
                <p>
                  <span className="font-medium">Education:</span> {mockDoctor.education}
                </p>
                <p>
                  <span className="font-medium">Hospital:</span> {mockDoctor.hospital}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Schedule Your Appointment</CardTitle>
              <CardDescription>Select your preferred date, time, and appointment type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Appointment Type */}
              <div className="space-y-3">
                <Label>Appointment Type</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "in-person", label: "In-Person", icon: User },
                    { value: "video", label: "Video Call", icon: Video },
                    { value: "phone", label: "Phone Call", icon: Phone },
                  ].map((type) => (
                    <Button
                      key={type.value}
                      variant={appointmentType === type.value ? "default" : "outline"}
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => setAppointmentType(type.value)}
                    >
                      <type.icon className="w-5 h-5" />
                      <span className="text-sm">{type.label}</span>
                      <span className="text-xs text-muted-foreground">${getAppointmentTypeFee(type.value)}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-3">
                <Label>Select Date</Label>
                <div className="grid grid-cols-5 gap-2">
                  {availableDates.map((dateOption) => (
                    <Button
                      key={dateOption.date}
                      variant={selectedDate === dateOption.date ? "default" : "outline"}
                      className="h-auto p-3 flex-col gap-1"
                      onClick={() => setSelectedDate(dateOption.date)}
                    >
                      <span className="text-sm font-medium">{dateOption.day}</span>
                      <span className="text-xs text-muted-foreground">{new Date(dateOption.date).getDate()}</span>
                      <Badge variant="secondary" className="text-xs">
                        {dateOption.slots} slots
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="space-y-3">
                  <Label>Select Time</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        className="h-auto p-3"
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{slot.time}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reason for Visit */}
              <div className="space-y-3">
                <Label htmlFor="reason">Reason for Visit *</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason for your visit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine-checkup">Routine Checkup</SelectItem>
                    <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="symptoms">Specific Symptoms</SelectItem>
                    <SelectItem value="second-opinion">Second Opinion</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Notes */}
              <div className="space-y-3">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information or specific concerns you'd like to discuss..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Booking Summary */}
              {selectedDate && selectedTime && reason && (
                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>
                        <strong>Appointment Summary:</strong>
                      </p>
                      <p>Date: {new Date(selectedDate).toLocaleDateString()}</p>
                      <p>Time: {selectedTime}</p>
                      <p>Type: {appointmentType.charAt(0).toUpperCase() + appointmentType.slice(1)}</p>
                      <p>Fee: ${getAppointmentTypeFee(appointmentType)}</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Book Button */}
              <Button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || !reason || isBooking}
                className="w-full"
                size="lg"
              >
                {isBooking ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Booking Appointment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Book Appointment - ${getAppointmentTypeFee(appointmentType)}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
