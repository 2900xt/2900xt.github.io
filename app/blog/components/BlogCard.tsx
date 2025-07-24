"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import Image from "next/image"
import { BlogPost } from "../data"

interface BlogCardProps {
  post: BlogPost
  index: number
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy")
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <Link href={`/blog/${post.id}`}>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 group-hover:shadow-2xl group-hover:shadow-purple-500/10 overflow-hidden">
          {/* Blog Image */}
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Featured Badge - overlay on image */}
            {post.featured && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500/80 to-orange-500/80 text-white border border-yellow-500/50 backdrop-blur-sm">
                  ⭐ Featured
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
              {post.title}
            </h2>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-4">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-gray-300 mb-6 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-gray-500/20 text-gray-300 border border-gray-500/30">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>

            {/* Read More */}
            <div className="flex items-center justify-between">
              <span className="text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors duration-300">
                Read article
              </span>
              <motion.div
                className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
} 