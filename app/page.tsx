"use client"

import { Navigation } from "./components/sections/Navigation"
import { Hero } from "./components/sections/Hero"
import { Projects } from "./components/sections/Projects"
import { Footer } from "./components/sections/Footer"
import { motion, useScroll, useSpring } from "framer-motion"
import { useEffect } from "react"

export default function Portfolio() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Enable smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
    return () => {
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50 origin-left"
        style={{ scaleX }}
      />
      
      <Navigation />
      <Hero />
      <Projects />
      <Footer />
    </div>
  )
}
