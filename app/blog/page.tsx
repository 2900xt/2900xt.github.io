"use client"

import { useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { blogPosts, BlogPost } from "./data"
import SearchBar from "./components/SearchBar"
import BlogCard from "./components/BlogCard"
import { Footer } from "../components/sections/Footer"

export default function BlogPage() {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const handleSearchResults = (results: BlogPost[]) => {
    setFilteredPosts(results)
  }

  const handleTagFilter = (tag: string | null) => {
    setActiveTag(tag)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50 origin-left"
        style={{ scaleX }}
      />

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
        <div className="max-w-6xl mx-auto">
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
              My (terrible) thoughts for everyone to see!
            </p>
          </motion.div>

          {/* Search and Filter */}
          <SearchBar 
            onSearchResults={handleSearchResults}
            onTagFilter={handleTagFilter}
          />

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">
                  No articles found
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setFilteredPosts(blogPosts)
                    setActiveTag(null)
                  }}
                  className="px-6 py-3 bg-blue-500/20 border border-blue-500/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all duration-200"
                >
                  Show all articles
                </button>
              </div>
            </motion.div>
          )}

          {/* Results Count */}
          {filteredPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 text-center text-gray-400"
            >
              <p>
                Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                {activeTag && ` tagged with "${activeTag}"`}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />

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