"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Search, Filter, MapPin, Star, Calendar, Clock, Stethoscope, Heart, Brain, Eye, Bone } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Doctor {
  id: string
  name: string
  specialty: string
  experience: number
  rating: number
  reviewCount: number
  location: string
  distance: string
  availableToday: boolean
  nextAvailable: string
  consultationFee: number
  languages: string[]
  education: string
  hospital: string
  avatar?: string
}

const mockDoctors: Doctor[] = [
  {
    id: "D001",
    name: "Dr. Sarah Mitchell",
    specialty: "Cardiology",
    experience: 12,
    rating: 4.9,
    reviewCount: 156,
    location: "Downtown Medical Center",
    distance: "2.3 miles",
    availableToday: true,
    nextAvailable: "Today 3:00 PM",
    consultationFee: 200,
    languages: ["English", "Spanish"],
    education: "Harvard Medical School",
    hospital: "City General Hospital",
  },
  {
    id: "D002",
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    experience: 15,
    rating: 4.8,
    reviewCount: 203,
    location: "Westside Clinic",
    distance: "4.1 miles",
    availableToday: false,
    nextAvailable: "Tomorrow 10:00 AM",
    consultationFee: 250,
    languages: ["English", "Mandarin"],
    education: "Johns Hopkins University",
    hospital: "Metropolitan Hospital",
  },
  {
    id: "D003",
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatology",
    experience: 8,
    rating: 4.7,
    reviewCount: 89,
    location: "Skin Care Specialists",
    distance: "1.8 miles",
    availableToday: true,
    nextAvailable: "Today 4:30 PM",
    consultationFee: 180,
    languages: ["English", "Spanish", "Portuguese"],
    education: "Stanford Medical School",
    hospital: "Regional Medical Center",
  },
  {
    id: "D004",
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    experience: 20,
    rating: 4.9,
    reviewCount: 312,
    location: "Sports Medicine Institute",
    distance: "3.5 miles",
    availableToday: false,
    nextAvailable: "Dec 18, 9:00 AM",
    consultationFee: 220,
    languages: ["English"],
    education: "Mayo Clinic College",
    hospital: "Sports Medicine Hospital",
  },
]

const specialties = [
  { value: "all", label: "All Specialties", icon: Stethoscope },
  { value: "cardiology", label: "Cardiology", icon: Heart },
  { value: "neurology", label: "Neurology", icon: Brain },
  { value: "dermatology", label: "Dermatology", icon: Eye },
  { value: "orthopedics", label: "Orthopedics", icon: Bone },
]

export function DoctorDiscovery() {
  const [user, setUser] = useState<any>(null)
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const filteredDoctors = doctors
    .filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty.toLowerCase() === selectedSpecialty
      const matchesAvailability =
        availabilityFilter === "all" || (availabilityFilter === "today" && doctor.availableToday)
      return matchesSearch && matchesSpecialty && matchesAvailability
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "experience":
          return b.experience - a.experience
        case "price":
          return a.consultationFee - b.consultationFee
        case "distance":
          return Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
        default:
          return 0
      }
    })

  const getSpecialtyIcon = (specialty: string) => {
    const specialtyData = specialties.find((s) => s.value === specialty.toLowerCase())
    return specialtyData?.icon || Stethoscope
  }

  if (!user) return null

  return (
    <DashboardLayout 
      headerContent={{
        title: "Find Doctors",
        description: "Discover and book appointments with qualified healthcare professionals"
      }}
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors, specialties, or hospitals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty.value} value={specialty.value}>
                      <div className="flex items-center gap-2">
                        <specialty.icon className="w-4 h-4" />
                        {specialty.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  <SelectItem value="today">Available Today</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">By Rating</SelectItem>
                  <SelectItem value="experience">By Experience</SelectItem>
                  <SelectItem value="price">By Price</SelectItem>
                  <SelectItem value="distance">By Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Found {filteredDoctors.length} doctors {selectedSpecialty !== "all" && `in ${selectedSpecialty}`}
          </p>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sorted by {sortBy}</span>
          </div>
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDoctors.map((doctor) => {
            const SpecialtyIcon = getSpecialtyIcon(doctor.specialty)
            return (
              <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {doctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold">{doctor.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <SpecialtyIcon className="w-4 h-4 text-primary" />
                          <span className="text-primary font-medium">{doctor.specialty}</span>
                          <span className="text-muted-foreground">• {doctor.experience} years exp.</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{doctor.rating}</span>
                          <span className="text-muted-foreground">({doctor.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{doctor.distance}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Hospital:</span> {doctor.hospital}
                        </p>
                        <p>
                          <span className="font-medium">Education:</span> {doctor.education}
                        </p>
                        <p>
                          <span className="font-medium">Languages:</span> {doctor.languages.join(", ")}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{doctor.nextAvailable}</span>
                            {doctor.availableToday && (
                              <Badge variant="secondary" className="bg-success/10 text-success">
                                Available Today
                              </Badge>
                            )}
                          </div>
                          <p className="text-lg font-semibold">${doctor.consultationFee}</p>
                        </div>

                        <Link href={`/patient/booking/${doctor.id}`}>
                          <Button>
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Appointment
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredDoctors.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
