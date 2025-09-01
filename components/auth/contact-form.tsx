"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Phone, MessageSquare, User, MapPin, ArrowRight, Brain, Shield, Zap, Sparkles, Globe, Users, Rocket } from "lucide-react"
import Image from "next/image"

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    message: "",
    requestAccess: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Using EmailJS or similar service would be better here
      // For now, we'll use a simple approach that can be easily replaced
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Thank you! Your message has been sent successfully. We'll get back to you soon.")
        setFormData({ 
          fullName: "", 
          email: "", 
          phone: "", 
          location: "", 
          message: "", 
          requestAccess: false 
        })
      } else {
        alert("Failed to send message. Please try again or contact us directly.")
      }
    } catch (error) {
      alert("Something went wrong. Please try again or contact us directly.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
      {/* Left Column - Hero & Information */}
      <div className="space-y-10">
        {/* Hero Section */}
        <div className="space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            <span className="text-slate-800">Contact Us</span>
          </h2>
          
          <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
            NeuroFusion is an innovative medical AI project. We're looking for passionate individuals, potential clients, and partners who want to be part of this revolutionary healthcare technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">AI-Powered</h3>
            <p className="text-sm text-slate-600">Advanced machine learning algorithms</p>
          </div>
          
          <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Enterprise Secure</h3>
            <p className="text-sm text-slate-600">HIPAA compliant & SOC 2 certified</p>
          </div>
          
          <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Lightning Fast</h3>
            <p className="text-sm text-slate-600">Real-time processing & analysis</p>
          </div>
        </div>

        {/* Animated GIFs with Modern Layout */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/30 shadow-lg group hover:shadow-xl transition-all duration-300">
            <Image
              src="/images/1.gif"
              alt="AI Medical Technology"
              fill
              className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="relative h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/30 shadow-lg group hover:shadow-xl transition-all duration-300">
            <Image
              src="/images/2.gif"
              alt="Medical Innovation"
              fill
              className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="relative h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/30 shadow-lg group hover:shadow-xl transition-all duration-300 col-span-2">
            <Image
              src="/images/3.gif"
              alt="Healthcare Technology"
              fill
              className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Right Column - Contact Form */}
      <div className="relative">
        <div className="sticky top-8">
          <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-white/40 shadow-2xl">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Interested in NeuroFusion?</h3>
                <p className="text-slate-600">Tell us about yourself and how you'd like to get involved with our project.</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-700 font-medium">Full Name *</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="pl-12 h-14 bg-white/60 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-slate-800 placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email Address *</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-12 h-14 bg-white/60 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-slate-800 placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number</Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="pl-12 h-14 bg-white/60 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-slate-700 font-medium">Location</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        id="location"
                        placeholder="Enter your location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="pl-12 h-14 bg-white/60 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-700 font-medium">
                    Tell Us About Yourself *
                  </Label>
                  <div className="relative group">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Textarea
                      id="message"
                      placeholder="What interests you about NeuroFusion? Are you looking to collaborate, invest, or learn more? Tell us about your background and interests..."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="pl-12 min-h-[140px] bg-white/60 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-slate-800 placeholder:text-slate-400 resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-xl bg-blue-50/50 border border-blue-200/30">
                  <Checkbox
                    id="requestAccess"
                    checked={formData.requestAccess}
                    onCheckedChange={(checked) => 
                      handleInputChange("requestAccess", checked as boolean)
                    }
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="requestAccess" className="text-sm font-medium text-slate-700 cursor-pointer">
                    I'm interested in getting early access to the NeuroFusion platform
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-3 w-6 h-6 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <span>SUBMIT INTEREST</span>
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
