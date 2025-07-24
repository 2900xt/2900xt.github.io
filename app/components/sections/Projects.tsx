"use client"

import { ProjectCard } from "../cards/ProjectCard"
import { Terminal, Brain, Gamepad2, Cpu, Search } from "lucide-react"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export function Projects() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [techSearchQuery, setTechSearchQuery] = useState("")

  const projects = [
    {
      title: "neo-OS",
      description: "Custom Operating System for AMD64 Architecture",
      longDescription: "A complete operating system written from scratch in C++ and assembly, featuring custom drivers, virtual file system, and multithreading support.",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhMrlccHTZ82RdXXFBu3ByXTGOxRW7OIIryatLiskJuUMFZnxJ65pHt9drQePjZaorlvhZzBYfhIGWx-R84pKJ24rPlM8VSlp59v4nOaa7dux9hfu54bJ7q19Zs7oqAzV1swUpodAQLS8Ie/s1600/kernel_3_output_2.png",
      icon: <Terminal />,
      iconColor: "text-blue-400",
      link: "https://github.com/2900xt/neo-OS",
      features: [
        "Custom drivers for VGA, AHCI, APIC, PET, PS/2, PCI",
        "Custom image format (.nic) with 256 color support",
        "UNIX-based virtual file system",
        "Page frame allocator and standard library",
        "Interactive shell with command history and tab completion",
      ],
      technologies: [
        { name: "C++", color: "blue" },
        { name: "Assembly", color: "red" },
        { name: "Kernel Dev", color: "purple" },
        { name: "Driver Dev", color: "orange" }
      ]
    },
    {
      title: "MobyGlobal",
      description: "AI-Powered Whale Population Tracking Network",
      longDescription: "A network of smart buoys using custom AI models to detect and track whale populations in the North Atlantic through acoustic analysis and real-time data processing.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=200&fit=crop",
      icon: <Brain />,
      link: "https://isef.net/project/robo046t-mobyglobal-a-real-time-whale-detection-network",
      iconColor: "text-green-400",
      features: [
        "Custom CNN with Fast Fourier Transforms",
        "Real-time HTTP API and database",
        "Physical buoy prototype with Raspberry Pi",
        "Web dashboard for data visualization"
      ],
      technologies: [
        { name: "Python", color: "green" },
        { name: "TensorFlow", color: "orange" },
        { name: "Android", color: "blue" },
        { name: "IoT", color: "purple" }
      ]
    },
    {
      title: "Braindead-2DS",
      description: "2D Shooter Game",
      longDescription: "A custom 2D shooter game developed in Bare-Bones Java",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=200&fit=crop",
      icon: <Gamepad2 />,
      iconColor: "text-purple-400",
      link: "https://github.com/2900xt/Braindead-2DS",
      features: [
        "Custom Game Engine, Input System, and Camera Engine",
        "A* and Greedy Pathfinding for AI",
        "Custom Level Editor and Creator",
        "CS:GO Inspired Mechanics & Gameplay"
      ],
      technologies: [
        { name: "Java", color: "purple" },
        { name: "Game Dev", color: "green" }
      ]
    },
    {
      title: "TCalculator",
      description: "Sophisticated Graphing Calculator Application",
      longDescription: "A sophisticated graphing calculator application",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=200&fit=crop",
      icon: <Cpu />,
      iconColor: "text-yellow-400",
      link: "https://github.com/2900xt/Calculator",
      features: [
        "Function Parsing & Graphing",
        "Custom Gradient Descent + Regression Library",
        "Supports Complex-Number Functions",
        "Supports Integrals and Derivatives",
      ],
      technologies: [
        { name: "Java", color: "orange" },
        { name: "Mathematics", color: "blue" },
        { name: "GUI", color: "green" }
      ]
    }
  ]

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    projects.forEach(project => {
      project.technologies.forEach(tech => tags.add(tech.name))
    })
    return Array.from(tags)
  }, [])

  // Filter technologies based on search query
  const filteredTags = useMemo(() => {
    if (!techSearchQuery) return allTags
    return allTags.filter(tag => 
      tag.toLowerCase().includes(techSearchQuery.toLowerCase())
    )
  }, [allTags, techSearchQuery])

  // Filter projects based on search query and selected tags
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search by name or description
      const matchesSearch = searchQuery === "" || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.longDescription.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter by tags
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => 
          project.technologies.some(tech => tech.name === tag)
        )

      return matchesSearch && matchesTags
    })
  }, [searchQuery, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Search and Filter Section */}
        <div className="mb-12">
          {/* Search Inputs Row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Main Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search projects by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/15 focus:border-white/30"
              />
            </div>

            {/* Technology Search Input */}
            <div className="relative lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search technologies..."
                value={techSearchQuery}
                onChange={(e) => setTechSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/15 focus:border-white/30"
              />
            </div>
          </div>

          {/* Filter Tags */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Filter by Technology:</h3>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-sm text-blue-400 hover:text-blue-300 underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredTags.map((tag) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-transparent border-white/30 text-white hover:bg-white/10"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </div>
            {filteredTags.length === 0 && techSearchQuery && (
              <p className="text-gray-400 text-sm mt-2">No technologies found matching "{techSearchQuery}"</p>
            )}
          </div>

          {/* Results Count */}
          <div className="text-gray-300 text-sm">
            Showing {filteredProjects.length} of {projects.length} projects
            {selectedTags.length > 0 && (
              <span className="ml-2">
                • Filtered by: {selectedTags.join(", ")}
              </span>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">No projects found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedTags([])
                setTechSearchQuery("")
              }}
              className="mt-4 text-blue-400 hover:text-blue-300 underline"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
} 