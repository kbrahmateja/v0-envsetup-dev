"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface PresentationSlideProps {
  title: string
  subtitle?: string
  description?: string
  icon: LucideIcon
  children?: ReactNode
  className?: string
  index: number
}

export default function PresentationSlide({
  title,
  subtitle,
  description,
  icon: Icon,
  children,
  className,
  index,
}: PresentationSlideProps) {
  return (
    <div className={cn("flex-none w-full h-full flex flex-col items-center justify-center px-4 md:px-12 py-8 md:py-12", className)}>
      <div className="max-w-5xl w-full animate-in fade-in slide-in-from-bottom-5 duration-1000 ease-out fill-mode-both">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
          {/* Content Side */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <div className="space-y-4">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium animate-in fade-in slide-in-from-left-5 duration-500 fill-mode-both"
                style={{ animationDelay: '200ms' }}
              >
                <Icon className="w-4 h-4" />
                <span>Section {index + 1}</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                {title}
              </h2>
              
              {subtitle && (
                <h3 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic animate-in fade-in duration-700 delay-300 fill-mode-both">
                  {subtitle}
                </h3>
              )}
            </div>

            {description && (
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl animate-in fade-in duration-1000 delay-500 fill-mode-both">
                {description}
              </p>
            )}

            {children && (
              <div className="pt-4">
                {children}
              </div>
            )}
          </div>

          {/* Visual/Feature Side */}
          <div className="lg:col-span-5 hidden lg:block animate-float">
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-pink-600/30 rounded-3xl blur-3xl animate-pulse" />
              <div className="relative h-full w-full rounded-3xl border border-white/20 bg-white/5 backdrop-blur-2xl flex items-center justify-center p-12 overflow-hidden group animate-glow-pulse">
                <Icon className="w-32 h-32 text-blue-400/30 group-hover:text-blue-400 transition-all duration-700 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                
                {/* Decorative Particles */}
                <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-blue-500/80 shadow-[0_0_8px_white] animate-ping" />
                <div className="absolute bottom-10 right-4 w-2 h-2 rounded-full bg-purple-500/80 shadow-[0_0_8px_white] animate-pulse delay-75" />
                <div className="absolute top-1/2 -right-1 w-3 h-3 rounded-full bg-pink-500/20 blur-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
