"use client"

import { Code, Database, Server, Globe, Zap, Cpu } from "lucide-react"
import { useEffect, useState } from "react"

export function FloatingElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const icons = [Code, Database, Server, Globe, Zap, Cpu]

  return (
    <div className="fixed inset-0 pointer-events-none -z-5 overflow-hidden">
      {icons.map((Icon, index) => (
        <div
          key={index}
          className="absolute animate-float opacity-20 dark:opacity-30 hover:opacity-40 dark:hover:opacity-50 transition-opacity"
          style={{
            left: `${10 + index * 15}%`,
            top: `${20 + index * 10}%`,
            animationDelay: `${index * 2}s`,
            animationDuration: `${8 + index}s`,
          }}
        >
          <Icon className="w-8 h-8 text-primary" />
        </div>
      ))}
    </div>
  )
}
