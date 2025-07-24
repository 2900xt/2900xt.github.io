"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full bg-black/20 backdrop-blur-xl border-b border-white/10 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              className="text-xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Taha Rawjani
            </motion.div>
            
            {/* Right-aligned Navigation Items */}
            <div className="hidden md:flex space-x-8">
              <Link 
                href="/#projects"
                className="text-gray-300 hover:text-white transition-colors relative"
              >
                Projects
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
              <span className="text-white font-semibold">
                Blog
              </span>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <Link 
              href="/"
              className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>
          </motion.div>

          {/* Blog Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Thoughts on systems programming, AI, and software development
            </p>
          </motion.div>

          {/* Coming Soon Section */}
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-4">
                Coming Soon
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                I'm working on some interesting content about operating systems, AI development, and my experiences in competitive programming.
              </p>
              <div className="flex justify-center space-x-4">
                <div className="bg-blue-500/20 rounded-lg px-4 py-2">
                  <span className="text-blue-300 text-sm">Systems Programming</span>
                </div>
                <div className="bg-green-500/20 rounded-lg px-4 py-2">
                  <span className="text-green-300 text-sm">AI/ML</span>
                </div>
                <div className="bg-purple-500/20 rounded-lg px-4 py-2">
                  <span className="text-purple-300 text-sm">Competitive Programming</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </div>
  )
} 