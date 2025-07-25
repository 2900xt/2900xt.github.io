"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Tag, ChevronDown } from "lucide-react"
import { blogPosts, getAllTags, searchPosts, getPostsByTag } from "../data"

interface SearchBarProps {
  onSearchResults: (results: typeof blogPosts) => void
  onTagFilter: (tag: string | null) => void
}

export default function SearchBar({ onSearchResults, onTagFilter }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showAllTags, setShowAllTags] = useState(false)

  const allTags = getAllTags()

  // Show most popular tags initially
  const popularTags = ["Operating Systems", "Memory Management", "Assembly", "Systems Programming"]
  const displayTags = showAllTags ? allTags : popularTags.filter(tag => allTags.includes(tag))

  useEffect(() => {
    if (selectedTag) {
      const results = getPostsByTag(selectedTag)
      onSearchResults(results)
      onTagFilter(selectedTag)
    } else if (searchQuery.trim()) {
      const results = searchPosts(searchQuery)
      onSearchResults(results)
      onTagFilter(null)
    } else {
      onSearchResults(blogPosts)
      onTagFilter(null)
    }
  }, [searchQuery, selectedTag, onSearchResults, onTagFilter])

  const handleTagSelect = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag)
    setSearchQuery("")
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTag(null)
    setShowAllTags(false)
  }

  return (
    <div className="relative mb-12">
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300 z-10" />
          <input
            type="text"
            placeholder="Search articles by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          
          {/* Search glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isSearchFocused ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Tag Filter Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Tag className="h-5 w-5 text-blue-400" />
            Filter by Topics
          </h3>
          {allTags.length > popularTags.length && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {showAllTags ? "Show Less" : `Show All (${allTags.length})`}
              <ChevronDown className={`h-4 w-4 transition-transform ${showAllTags ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {/* Tags Grid */}
        <motion.div 
          className="flex flex-wrap gap-3"
          layout
        >
          <AnimatePresence>
            {displayTags.map((tag) => (
              <motion.button
                key={tag}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleTagSelect(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  selectedTag === tag
                    ? "bg-blue-500/30 border-blue-400/50 text-blue-200 shadow-lg shadow-blue-500/25"
                    : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 hover:border-white/30 hover:text-white"
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Clear Filters */}
        <AnimatePresence>
          {(searchQuery || selectedTag) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between pt-4 border-t border-white/10"
            >
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <Search className="mr-1 h-3 w-3" />
                    Search: "{searchQuery}"
                  </span>
                )}
                {selectedTag && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    <Tag className="mr-1 h-3 w-3" />
                    {selectedTag}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-200 text-sm font-medium"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 