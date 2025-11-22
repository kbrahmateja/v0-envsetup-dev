"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Shield, Rocket } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
    }> = []

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(99, 102, 241, 0.5)"
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            AI-Powered Development Environment Automation
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-balance">
            AI That Builds Your Entire{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Development Environment
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-balance">
            Envsetup.dev detects your tech stack, generates your project scaffold, configures infrastructure, and builds
            CI/CD — automatically. No more hours of setup. No more searching docs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-base h-12 px-8" asChild>
              <Link href="/generator">
                Start for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base h-12 px-8 bg-transparent" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            {[
              { icon: Zap, label: "200+ Tech Stacks", color: "text-yellow-500" },
              { icon: Sparkles, label: "AI Detection", color: "text-blue-500" },
              { icon: Rocket, label: "Auto CI/CD", color: "text-purple-500" },
              { icon: Shield, label: "Secure by Default", color: "text-green-500" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm"
              >
                <item.icon className={`h-6 w-6 ${item.color}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
