"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GitCommit, BookOpen, ExternalLink, Calendar, User, GitBranch } from "lucide-react"
import Link from "next/link"
import { blogPosts } from "../../blog/data"

interface GitHubCommit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
  repository?: {
    name: string
    html_url: string
  }
  html_url: string
}

interface GitHubRepo {
  name: string
  html_url: string
  description: string
  language: string
  updated_at: string
}

export function Activity() {
  const [commits, setCommits] = useState<GitHubCommit[]>([])
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGitHubActivity = async () => {
      try {
        // Fetch recent commits from multiple repos
        const repoResponse = await fetch('https://api.github.com/users/2900xt/repos?sort=updated&per_page=10')
        const reposData = await repoResponse.json()
        setRepos(reposData.slice(0, 5))

        // Fetch commits from the most recently updated repos
        const commitPromises = reposData.slice(0, 3).map(async (repo: GitHubRepo) => {
          try {
            const response = await fetch(`https://api.github.com/repos/2900xt/${repo.name}/commits?per_page=3`)
            const commits = await response.json()
            return commits.map((commit: GitHubCommit) => ({
              ...commit,
              repository: {
                name: repo.name,
                html_url: repo.html_url
              }
            }))
          } catch (error) {
            console.error(`Error fetching commits for ${repo.name}:`, error)
            return []
          }
        })

        const allCommits = await Promise.all(commitPromises)
        const flatCommits = allCommits.flat()
        
        // Sort by date and take the most recent 6
        flatCommits.sort((a, b) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime())
        setCommits(flatCommits.slice(0, 6))
        
      } catch (error) {
        console.error('Error fetching GitHub activity:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubActivity()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const truncateMessage = (message: string, maxLength: number = 60) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message
  }

  // Get the 3 most recent blog posts
  const recentBlogs = blogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <section id="activity" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-4">Recent Activity</h2>
          <p className="text-xl text-slate-600 text-center mb-12">
            Latest commits from GitHub and recent blog posts
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* GitHub Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 border-slate-200 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-2xl text-slate-900">
                  <GitCommit className="mr-3 h-6 w-6 text-blue-500" />
                  GitHub Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  commits.map((commit) => (
                    <motion.div
                      key={commit.sha}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-slate-50 rounded-r-lg transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 mb-1">
                            {truncateMessage(commit.commit.message)}
                          </p>
                          <div className="flex items-center text-xs text-slate-600 space-x-2">
                            <GitBranch className="h-3 w-3" />
                            <span className="font-medium">{commit.repository?.name}</span>
                            <Calendar className="h-3 w-3 ml-2" />
                            <span>{formatDate(commit.commit.author.date)}</span>
                          </div>
                        </div>
                        <a
                          href={commit.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </motion.div>
                  ))
                )}
                
                <div className="pt-4 border-t border-slate-200">
                  <a
                    href="https://github.com/2900xt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  >
                    <User className="mr-2 h-4 w-4" />
                    View full profile on GitHub
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Blog Posts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 border-slate-200 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-2xl text-slate-900">
                  <BookOpen className="mr-3 h-6 w-6 text-purple-500" />
                  Latest Blog Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentBlogs.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/blog/${post.id}`}>
                      <div className="border-l-4 border-purple-500 pl-4 py-3 hover:bg-slate-50 rounded-r-lg transition-colors cursor-pointer group">
                        <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                
                <div className="pt-4 border-t border-slate-200">
                  <Link
                    href="/blog"
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors font-medium"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    View all blog posts
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 