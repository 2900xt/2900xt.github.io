"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Tag } from "lucide-react"
import { blogPosts, getAllTags, searchPosts, getPostsByTag } from "../data"

interface SearchBarProps {
  onSearchResults: (results: typeof blogPosts) => void
  onTagFilter: (tag: string | null) => void
}

export default function SearchBar({ onSearchResults, onTagFilter }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showTagDropdown, setShowTagDropdown] = useState(false)

  const allTags = getAllTags()

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
    setSelectedTag(tag)
    setSearchQuery("")
    setShowTagDropdown(false)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTag(null)
    setShowTagDropdown(false)
  }

  return (
    <div className="relative">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tag Filter */}
        <div className="relative">
          <button
            onClick={() => setShowTagDropdown(!showTagDropdown)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
              selectedTag
                ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>{selectedTag || "Filter by tag"}</span>
          </button>

          <AnimatePresence>
            {showTagDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-gray-800/90 backdrop-blur-sm border border-white/20 rounded-xl p-2 z-50 max-h-60 overflow-y-auto"
              >
                <div className="space-y-1">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagSelect(tag)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedTag === tag
                          ? "bg-blue-500/30 text-blue-300"
                          : "text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clear Filters */}
        {(searchQuery || selectedTag) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={clearFilters}
            className="px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-200"
          >
            Clear
          </motion.button>
        )}
      </div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {(searchQuery || selectedTag) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
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
                  Tag: {selectedTag}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 