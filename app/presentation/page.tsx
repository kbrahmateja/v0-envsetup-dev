"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, Rocket, Cloud, Terminal, ShieldCheck, TrendingUp, Home, ArrowRight, Sparkles, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import PresentationSlide from "@/components/presentation-slide"
import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"

const slides = [
  {
    title: "Why EnvSetup.dev?",
    subtitle: "The Core Problem & Our Vision",
    description: "Setting up project environments is tedious and inconsistent. We replace manual 'setup.sh' scripts with a powerful global CLI tool that manages your entire project lifecycle.",
    icon: Rocket,
    bullets: [
      "Standardized environments for every project",
      "No more manual dependency conflicts",
      "One tool to rule all your project stacks",
      "Professional-grade security by default"
    ]
  },
  {
    title: "Service Type: Online",
    subtitle: "The AI-Powered Control Center",
    description: "Our web platform serves as your persistent dashboard. Sync your local setups, manage high-level architecture, and let our AI assistant optimize your toolchain.",
    icon: Cloud,
    bullets: [
      "Cloud-based architecture visualizer",
      "AI stack health and version monitoring",
      "Team collaboration and role management",
      "Project templates marketplace"
    ]
  },
  {
    title: "Service Type: Local System",
    subtitle: "The Powerful 'envsetup' CLI",
    description: "Forget manual setup scripts. Install the global CLI and initialize any project in seconds with standardized commands.",
    icon: Terminal,
    bullets: [
      "pnpm install -g envsetup@latest",
      "envsetup init: Interactive wizard mode",
      "envsetup init --ai: AI-powered recommendations",
      "envsetup doctor: System prerequisites verification"
    ]
  },
  {
    title: "Service Type: Environment",
    subtitle: "Unified Infrastructure & Logs",
    description: "The CLI extends into the environment layer, providing a single interface for managing containers and production deployments.",
    icon: ShieldCheck,
    bullets: [
      "envsetup up: Launch all orchestration services",
      "envsetup deploy: Zero-config cloud deployment",
      "envsetup logs: Aggregated logging across services",
      "envsetup sync: Sync .env and config with Cloud"
    ]
  },
  {
    title: "Revenue & Value Prop",
    subtitle: "Focus on ROI, Not Infrastructure",
    description: "By automating the most time-consuming parts of the SDLC, we help companies ship faster and reduce technical debt.",
    icon: TrendingUp,
    bullets: [
      "Zero-friction onboarding (clone -> init -> dev)",
      "Eliminate expensive 'Environment Drift' bugs",
      "Reduce DevOps overhead by 60%+",
      "10x faster project start-to-shipping lifecycle"
    ]
  },
  {
    title: "CLI Command Toolbox",
    subtitle: "A Complete Dev-to-Cloud Suite",
    description: "Beyond just initialization, our CLI provides a suite of managed commands to handle the full application lifecycle.",
    icon: Home,
    bullets: [
      "envsetup doctor: Verify system health",
      "envsetup sync: Sync logs & configs to Cloud",
      "envsetup logs: Aggregated container logs",
      "envsetup add <tool>: Add components on the fly"
    ]
  },
  {
    title: "The MCP Integration",
    subtitle: "Bridging AI and Your Infrastructure",
    description: "Experience the next generation of DevOps with our Model Context Protocol (MCP) server. Let your favorite AI agent manage your architecture directly.",
    icon: Sparkles,
    bullets: [
      "Zero-touch environment management",
      "AI-driven self-healing orchestration",
      "Direct agent-to-CLI communication",
      "Automated architecture brainstorming"
    ]
  },
  {
    title: "Development Phases",
    subtitle: "Our Roadmap to Innovation",
    description: "We are evolving from a simple generation tool to a complete AI-managed infrastructure ecosystem.",
    icon: Rocket,
    bullets: [
      "Phase 1: Core CLI & Standard Templates",
      "Phase 2: AI Assistant & MCP Integration",
      "Phase 3: Cloud Sync & Team Snapshots",
      "Phase 4: Marketplace & Enterprise Guard"
    ]
  }
]

export default function PresentationPage() {
  const [isPlaying, setIsPlaying] = React.useState(true)
  const autoplay = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false, playOnInit: true })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [autoplay.current])
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(true)

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const toggleAutoplay = React.useCallback(() => {
    const autoplayPlugin = autoplay.current
    if (!autoplayPlugin) return

    if (isPlaying) {
      autoplayPlugin.stop()
    } else {
      autoplayPlugin.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  return (
    <div className="relative h-screen bg-black text-white overflow-hidden flex flex-col font-sans">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] animate-mesh-1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-purple-600/10 blur-[150px] animate-mesh-2" />
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] rounded-full bg-pink-600/10 blur-[100px] animate-mesh-3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">envsetup.dev</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            Project Overview
          </div>
        </div>
      </header>

      {/* Carousel */}
      <main className="relative z-10 flex-1 overflow-hidden touch-pan-x">
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide, idx) => (
              <PresentationSlide
                key={idx}
                index={idx}
                title={slide.title}
                subtitle={slide.subtitle}
                description={slide.description}
                icon={slide.icon}
              >
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {slide.bullets.map((bullet, bidx) => (
                    <li 
                      key={bidx} 
                      className="flex items-center gap-3 group animate-in fade-in slide-in-from-left-2 fill-mode-both"
                      style={{ animationDelay: `${(bidx * 100) + 600}ms`, animationDuration: '800ms' }}
                    >
                      <div className="flex-none w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      <span className="text-gray-300 group-hover:text-white transition-colors">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </PresentationSlide>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute bottom-8 right-8 flex items-center gap-4 z-20">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleAutoplay}
            className="rounded-full w-12 h-12 border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-blue-400"
            title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="rounded-full w-12 h-12 border-white/10 bg-white/5 backdrop-blur-md disabled:opacity-20 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="rounded-full w-12 h-12 border-white/10 bg-white/5 backdrop-blur-md disabled:opacity-20 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Page Indicator */}
        <div className="absolute bottom-8 left-8 flex items-center gap-3 z-20">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === selectedIndex ? "w-12 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "w-6 bg-white/20"
              }`}
            />
          ))}
          <span className="ml-4 text-xs font-mono text-gray-500">
            {String(selectedIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
        </div>
      </main>
    </div>
  )
}
