import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
              <Brain className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">NeuroFusion</h1>
              <p className="text-sm text-muted-foreground">Professional Medical Platform</p>
            </div>
          </div>
        </div>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your NeuroFusion account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-primary hover:underline font-medium">
                  Create account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
