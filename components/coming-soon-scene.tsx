"use client"

import type React from "react"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, Float } from "@react-three/drei"
import { Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Sparkles, CheckCircle2, XCircle, Rocket } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import AnimatedLogos from "./animated-logos"
import Computer3D from "./computer-3d"

export default function ComingSoonScene() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const { toast } = useToast()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setStatusMessage({
        type: "error",
        message: "Please enter a valid email address.",
      })
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setStatusMessage({ type: null, message: "" })

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatusMessage({
          type: "success",
          message: data.message || "Successfully subscribed! Check your email for confirmation.",
        })
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Successfully Subscribed!</span>
            </div>
          ) as any,
          description: data.message || "You'll be the first to know when we launch. Check your email!",
          duration: 5000,
        })
        setEmail("")

        setTimeout(() => {
          setStatusMessage({ type: null, message: "" })
        }, 5000)
      } else {
        throw new Error(data.error || "Subscription failed")
      }
    } catch (error: any) {
      setStatusMessage({
        type: "error",
        message: error.message || "Subscription failed. Please try again later.",
      })
      toast({
        title: (
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <span>Subscription Failed</span>
          </div>
        ) as any,
        description: error.message || "Please try again later.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="relative w-full min-h-screen h-screen overflow-auto bg-black">
        {/* 3D Background Scene */}
        <div className="absolute inset-0">
          <Canvas>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 0, 10]} />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />

              {/* Animated Logos */}
              <AnimatedLogos />

              {/* 3D Computer */}
              <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <Computer3D position={[3, -1, 0]} />
              </Float>

              <Environment preset="night" />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Suspense>
          </Canvas>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-8 px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">Powered by Advanced AI</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
              <span className="block text-balance">The Future of</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Environment Setup
              </span>
              <span className="block text-balance">is Coming</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed text-balance px-4">
              Revolutionizing development workflows with AI-powered environment configuration. Instantly deploy perfect
              setups for any stack, any cloud, any server.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto mt-6 md:mt-8">
              <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <h3 className="text-base md:text-lg font-semibold text-white mb-2">AI Assistant</h3>
                <p className="text-xs md:text-sm text-gray-400">
                  Conversational AI finds the perfect tools and versions for your project
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <h3 className="text-base md:text-lg font-semibold text-white mb-2">Auto Deploy</h3>
                <p className="text-xs md:text-sm text-gray-400">
                  One-click deployment to any cloud or dedicated server infrastructure
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <h3 className="text-base md:text-lg font-semibold text-white mb-2">Smart Config</h3>
                <p className="text-xs md:text-sm text-gray-400">
                  Production-ready configurations with Docker, security, and monitoring
                </p>
              </div>
            </div>

            {/* Subscription Form */}
            <form onSubmit={handleSubscribe} className="mt-8 md:mt-12 max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 px-4 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    "Get Early Access"
                  )}
                </Button>
              </div>

              {statusMessage.type && (
                <div
                  className={`mt-4 p-4 rounded-lg backdrop-blur-sm border ${
                    statusMessage.type === "success"
                      ? "bg-green-500/20 border-green-500/30 text-green-300"
                      : "bg-red-500/20 border-red-500/30 text-red-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {statusMessage.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <p className="text-sm font-medium">{statusMessage.message}</p>
                  </div>
                </div>
              )}

              <p className="text-xs md:text-sm text-gray-400 mt-3">
                Be the first to experience the revolution. No spam, just pure innovation.
              </p>
            </form>

            {/* Launch Indicator & Links */}
            <div className="mt-6 md:mt-8 flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-300">Launching Soon</span>
              </div>
              
              <Button asChild variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm gap-2">
                <Link href="/presentation">
                  <Rocket className="w-4 h-4" />
                  View Project Overview
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none" />
      </div>
      <Toaster />
    </>
  )
}
