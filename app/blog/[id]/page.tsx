"use client"

import { motion, useScroll, useSpring } from "framer-motion"
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { blogPosts } from "../data"
import { useEffect, useState, use } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import MermaidDiagram from '../components/MermaidDiagram'
import { Footer } from "../../components/sections/Footer"

interface BlogPostPageProps {
  params: Promise<{
    id: string
  }>
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = use(params)
  const post = blogPosts.find(p => p.id === id)
  const [content, setContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  if (!post) {
    notFound()
  }

  useEffect(() => {
    const loadContent = async () => {
      try {
        if (post.contentFile) {
          // Load content from markdown file
          const response = await fetch(`/${post.contentFile}`)
          if (response.ok) {
            const markdownContent = await response.text()
            setContent(markdownContent)
          } else {
            // Fallback to inline content if file not found
            setContent(post.content || "Content not available")
          }
        } else {
          // Use inline content
          setContent(post.content || "Content not available")
        }
      } catch (error) {
        console.error("Error loading content:", error)
        setContent(post.content || "Content not available")
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [post])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy")
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
              <Link 
                href="/blog"
                className="text-white font-semibold"
              >
                Blog
              </Link>
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
              href="/blog"
              className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-8">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* Excerpt */}
            <div className="text-lg text-gray-300 mb-8 p-4 bg-gray-800/30 rounded-lg border-l-4 border-blue-500">
              {post.excerpt}
            </div>

            {/* Article Content */}
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                  </div>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Headers
                      h1: ({children}) => (
                        <h1 className="text-4xl font-bold text-white mb-8 mt-12 first:mt-0 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          {children}
                        </h1>
                      ),
                      h2: ({children}) => (
                        <h2 className="text-3xl font-bold text-white mb-6 mt-10 border-b border-gray-600 pb-2">
                          {children}
                        </h2>
                      ),
                      h3: ({children}) => (
                        <h3 className="text-2xl font-bold text-white mb-4 mt-8">
                          {children}
                        </h3>
                      ),
                      h4: ({children}) => (
                        <h4 className="text-xl font-bold text-white mb-3 mt-6">
                          {children}
                        </h4>
                      ),
                      // Paragraphs
                      p: ({children}) => (
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {children}
                        </p>
                      ),
                      // Lists
                      ul: ({children}) => (
                        <ul className="mb-6 space-y-2 list-none">
                          {children}
                        </ul>
                      ),
                      ol: ({children}) => (
                        <ol className="mb-6 space-y-2 list-decimal list-inside text-gray-300">
                          {children}
                        </ol>
                      ),
                      li: ({children}) => (
                        <li className="text-gray-300 ml-4 flex items-start">
                          <span className="text-blue-400 mr-3 mt-1">•</span>
                          <span>{children}</span>
                        </li>
                      ),
                      // Code
                      code: ({className, children, ...props}: any) => {
                        const match = /language-(\w+)/.exec(className || '')
                        const language = match ? match[1] : ''
                        const isInline = !className?.includes('language-')
                        
                        if (!isInline && language) {
                          // Handle Mermaid diagrams
                          if (language === 'mermaid') {
                            return (
                              <MermaidDiagram chart={String(children).replace(/\n$/, '')} />
                            )
                          }
                          
                          // Handle regular code blocks
                          return (
                            <div className="my-6">
                              <SyntaxHighlighter
                                style={tomorrow}
                                language={language}
                                PreTag="div"
                                className="rounded-lg border border-gray-600"
                                customStyle={{
                                  margin: '0',
                                  padding: '1.5rem',
                                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                  fontSize: '0.875rem',
                                  lineHeight: '1.5',
                                } as any}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            </div>
                          )
                        }
                        
                        return (
                          <code className="bg-gray-700 text-green-400 px-2 py-1 rounded text-sm font-mono" {...props}>
                            {children}
                          </code>
                        )
                      },
                      // Tables
                      table: ({children}) => (
                        <div className="overflow-x-auto my-6">
                          <table className="min-w-full border border-gray-600 rounded-lg overflow-hidden">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({children}) => (
                        <thead className="bg-gray-800/50">
                          {children}
                        </thead>
                      ),
                      tbody: ({children}) => (
                        <tbody className="divide-y divide-gray-600">
                          {children}
                        </tbody>
                      ),
                      tr: ({children}) => (
                        <tr className="hover:bg-gray-800/30">
                          {children}
                        </tr>
                      ),
                      th: ({children}) => (
                        <th className="px-4 py-3 text-left text-sm font-medium text-white border-b border-gray-600">
                          {children}
                        </th>
                      ),
                      td: ({children}) => (
                        <td className="px-4 py-3 text-sm text-gray-300">
                          {children}
                        </td>
                      ),
                      // Links
                      a: ({href, children}) => (
                        <a
                          href={href}
                          className="text-blue-400 hover:text-blue-300 underline transition-colors"
                          target={href?.startsWith('http') ? '_blank' : undefined}
                          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {children}
                        </a>
                      ),
                      // Blockquotes
                      blockquote: ({children}) => (
                        <blockquote className="bg-blue-500/10 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                          <div className="text-blue-200 italic">
                            {children}
                          </div>
                        </blockquote>
                      ),
                      // Strong/Bold
                      strong: ({children}) => (
                        <strong className="text-white font-semibold">
                          {children}
                        </strong>
                      ),
                      // Emphasis/Italic
                      em: ({children}) => (
                        <em className="italic text-gray-200">
                          {children}
                        </em>
                      ),
                      // Images
                      img: ({src, alt}) => (
                        <div className="my-6">
                          <img
                            src={src}
                            alt={alt}
                            className="rounded-lg border border-gray-600 max-w-full h-auto"
                          />
                        </div>
                      ),
                      // Horizontal rule
                      hr: () => (
                        <hr className="my-8 border-gray-600" />
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          </motion.article>
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