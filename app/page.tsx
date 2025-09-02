"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Stethoscope, Search, Star, Play, Phone, MapPin, Instagram, Facebook, MessageCircle, Apple, Brain } from "lucide-react"
import { useState, useEffect } from "react"

export default function HomePage() {
  // Smooth scroll function for navigation
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <header className="bg-white border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-10 lg:px-18 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">NeuroFusion</h1>
                <p className="text-xs text-muted-foreground">Research‑driven Telemedicine</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {/* <button 
                onClick={() => scrollToSection('about')}
                className="text-foreground hover:text-primary transition-colors duration-300 hover:scale-105 cursor-pointer"
              >
                About
              </button> */}
              <button 
                onClick={() => scrollToSection('solutions')}
                className="text-foreground hover:text-primary transition-colors duration-300 hover:scale-105 cursor-pointer"
              >
                Solutions
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-foreground hover:text-primary transition-colors duration-300 hover:scale-105 cursor-pointer"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-foreground hover:text-primary transition-colors duration-300 hover:scale-105 cursor-pointer"
              >
                Contact
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="mr-5 text-xl text-muted-foreground hover:text-primary transition-colors duration-300">
                Login
              </Link>
              <Link href="/auth/register">
                <Button className="text-xl bg-primary hover:bg-primary/90 text-white rounded-full px-10 transition-all duration-300 hover:scale-105">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Split Layout */}
      <section className="relative min-h-[80vh] flex items-center py-10 lg:pt-10">
        <div className="container mx-auto px-10 lg:px-18">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - GIF */}
            <div className="relative animate-fade-in-left">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-[4/3] max-h-[600px]">
                <Image 
                  src="/images/1.gif" 
                  alt="Medical consultation" 
                  fill
                  className="object-contain" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="text-foreground animate-fade-in-right">
              <Badge variant="secondary" className="mb-6 bg-primary/20 text-xl border-primary/30 animate-bounce">
                <Brain className="w-4 h-4 mr-2" />
                Research‑driven Telemedicine & Clinical AI
              </Badge>

              <h1 className="text-4xl lg:text-5xl font-bold text-balance mb-6 leading-tight animate-slide-up">
                Connect with a clinician within <span className="text-primary animate-pulse">60 seconds</span>
              </h1>

              <p className="text-lg text-muted-foreground text-balance mb-8 max-w animate-slide-up-delay animate-float">
                A research‑led project uniting secure telemedicine with the world’s first AI system for brain tumor diagnosis,
                developed with clinicians to support careful, evidence‑based care.
              </p>

              {/* Doctor Search Form */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-lg border border-border/20">
                <div className="space-y-4">
                  <Select>
                    <SelectTrigger className="w-full h-12 bg-white border-border/20 hover:border-primary/50 transition-colors duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-3 h-3 text-primary" />
                        </div>
                        <SelectValue placeholder="Select Problem" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Consultation</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="dermatology">Dermatology</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-full h-12 bg-white border-border/20 hover:border-primary/50 transition-colors duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center">
                          <Search className="w-3 h-3 text-accent" />
                        </div>
                        <SelectValue placeholder="Select Specialist" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiologist">Cardiologist</SelectItem>
                      <SelectItem value="dermatologist">Dermatologist</SelectItem>
                      <SelectItem value="pediatrician">Pediatrician</SelectItem>
                      <SelectItem value="orthopedist">Orthopedist</SelectItem>
                      <SelectItem value="neurologist">Neurologist</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-green">
                    FIND NOW
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Healthcare Features Section */}
      <section id="solutions" className="py-20 bg-muted/30">
        <div className="container mx-auto px-10 lg:px-18">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">Research‑led Telemedicine and Clinical AI</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-delay">
              Experience the future of healthcare with cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-6 animate-slide-up">
              <h3 className="text-3xl font-bold">Telemedicine and research‑grade AI diagnosis</h3>
              <p className="text-muted-foreground text-lg">
                We combine privacy‑preserving telemedicine with research‑grade clinical AI — including the world’s first
                AI system for brain tumor diagnosis — to support clinician‑led decisions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span>Real-time video consultations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-200"></div>
                  <span>AI-powered symptom analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-500"></div>
                  <span>Instant medical reports</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-700"></div>
                  <span>World’s first AI for brain tumor diagnosis</span>
                </div>
              </div>
            </div>

            {/* Right - GIF */}
            <div className="relative animate-slide-up-delay">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-[4/3] max-h-[500px]">
                <Image 
                  src="/images/2.gif" 
                  alt="AI Healthcare" 
                  fill
                  className="object-contain transform hover:scale-105 transition-transform duration-700" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Experience Section */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-10 lg:px-18">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - GIF */}
            <div className="relative animate-slide-up">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-[4/3] max-h-[500px]">
                <Image 
                  src="/images/3.gif" 
                  alt="Patient Experience" 
                  fill
                  className="object-contain transform hover:scale-105 transition-transform duration-700" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-6 animate-slide-up-delay">
              <h3 className="text-3xl font-bold">Seamless Patient Experience</h3>
              <p className="text-muted-foreground text-lg">
                From booking appointments to receiving care, our platform ensures a smooth and 
                comfortable healthcare journey for every patient.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  <span>Easy appointment scheduling</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse delay-200"></div>
                  <span>Secure health records</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse delay-500"></div>
                  <span>24/7 healthcare access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Infinite Carousel */}
      {/* <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container mx-auto px-10 lg:px-18">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">Trusted by Healthcare Professionals</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-delay">
              Join thousands of doctors and patients who have transformed their healthcare experience
            </p>
          </div>

          <InfiniteTestimonialCarousel />
        </div>
      </section> */}

      {/* Professional Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-10 lg:px-18">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary">NeuroFusion</h3>
                  <p className="text-xs text-gray-400">Research‑driven telemedicine • Clinical AI</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                NeuroFusion is a research initiative advancing telemedicine and clinical AI. Our work includes the world’s first
                AI system for brain tumor diagnosis, developed in collaboration with clinicians and guided by open science.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => scrollToSection('about')}
                  className="block text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer text-left"
                >
                  About Us
                </button>
                <button 
                  onClick={() => scrollToSection('solutions')}
                  className="block text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer text-left"
                >
                  Solution
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="block text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer text-left"
                >
                  Blog
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </div>
            </div>

            {/* Address */}
            <div>
              <h4 className="font-semibold mb-4">Address</h4>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                  <p>
                    Office # 401/402, 4th Floor, Plot # 43-C, Lane # 10, Bukhari Commercial Area - DHA 2-
                    Islamabad, Pakistan 44000
                  </p>
                </div>
                <div className="mt-4">
                  <p className="font-medium">For more information email us at:</p>
                  <a href="mailto:support@NeuroFusion.com" className="text-primary hover:underline">
                    support@NeuroFusion.com
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <h5 className="font-medium mb-3">Social Links</h5>
                <div className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors duration-300" />
                  <MessageCircle className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors duration-300" />
                  <Facebook className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors duration-300" />
                </div>
              </div>
            </div>

            {/* Quick Form */}
            <div>
              <h4 className="font-semibold mb-4">Quick Form</h4>
              <div className="space-y-3">
                <Input
                  placeholder="Your Name"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 hover:border-primary/50 transition-colors duration-300"
                />
                <Input
                  placeholder="Your Email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 hover:border-primary/50 transition-colors duration-300"
                />
                <Input
                  placeholder="Your Message"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 hover:border-primary/50 transition-colors duration-300"
                />
                <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full transition-all duration-300 hover:scale-105">
                  SUBMIT
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">© NeuroFusion 2024.</p>

              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">Download Now</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent hover:border-primary/50 transition-all duration-300"
                  >
                    <Image src="/assets/img/icons/googleplay.png" alt="Google Play" width={20} height={20} className="w-5 h-5 mr-2" />
                    Google Play
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent hover:border-primary/50 transition-all duration-300"
                  >
                    <Apple className="w-5 h-5 mr-2" />
                    App Store
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Infinite Testimonial Carousel Component
function InfiniteTestimonialCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const [api, setApi] = useState<any>(null);

  const testimonials = [
    {
      name: "Dr. Ahmed Khan",
      role: "Cardiologist",
      image: "/professional-male-doctor.png",
      text: "NeuroFusion has revolutionized how I practice medicine. The AI diagnosis tools are incredibly accurate and save me hours of analysis time.",
      rating: 5
    },
    {
      name: "Dr. Sarah Wilson",
      role: "Pediatrician",
      image: "/professional-female-doctor-headshot.png",
      text: "The teleconsultation feature has made it so much easier to connect with my patients. The platform is intuitive and secure.",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      role: "Patient",
      image: "/happy-patient-testimonial-headshot.png",
      text: "I was able to consult with a specialist within minutes. The convenience and quality of care exceeded my expectations.",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Neurologist",
      image: "/professional-male-doctor.png",
      text: "The AI-powered imaging analysis is a game-changer. It helps me make more accurate diagnoses faster than ever before.",
      rating: 5
    },
    {
      name: "Dr. Emily Johnson",
      role: "Dermatologist",
      image: "/professional-female-doctor-headshot.png",
      text: "The platform's ease of use and comprehensive features make it my go-to choice for telemedicine consultations.",
      rating: 5
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (!api || isPaused) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api, isPaused]);

  // Pause on hover/click, resume after inactivity
  const handleInteraction = () => {
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
        onMouseEnter={handleInteraction}
        onTouchStart={handleInteraction}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="pl-2 md:-ml-4 md:basis-1/2 lg:basis-1/3">
              <Card className="border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-105 h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="w-15 h-15 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground flex-grow">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}
