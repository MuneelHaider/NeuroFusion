import Link from "next/link"
import { ContactForm } from "@/components/auth/contact-form"
import { Brain, Lock, Shield, Zap, ArrowRight, Sparkles } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-indigo-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          {/* Logo with Glow Effect */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl border border-white/20">
                <Brain className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="ml-6 text-left">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                NeuroFusion
              </h1>
              <p className="text-lg text-slate-600 font-medium">Research‑driven Telemedicine & Clinical AI</p>
            </div>
          </div>

          {/* Access Restricted Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200/50 rounded-full px-6 py-3 backdrop-blur-sm">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full blur-sm"></div>
              <Lock className="relative w-5 h-5 text-red-600" />
            </div>
            <span className="text-red-700 font-semibold">Access Restricted</span>
            <span className="text-red-600/70 text-sm">• Research use only • Not available for public access</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <ContactForm />
        </div>

      </div>
      {/* Footer */}
      <div className="mt-10 mb-10 text-center">
        <div className="flex items-center justify-center gap-8 text-slate-600">
          <Link href="/" className="group flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span className="hover:underline">Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
