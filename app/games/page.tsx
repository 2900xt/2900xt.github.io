"use client"

import { Navigation } from "../components/sections/Navigation"
import { Games } from "../components/sections/Games"
import { Footer } from "../components/sections/Footer"
import { motion, useScroll, useSpring } from "framer-motion"
import { useEffect } from "react"

export default function GamesPage() {
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
      
      {/* Page Header */}
      <motion.div 
        className="pt-24 pb-8 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            My <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Games</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            They're pretty fun icl!
          </p>
        </div>
      </motion.div>
      
      <Games />
      <Footer />
    </div>
  )
}