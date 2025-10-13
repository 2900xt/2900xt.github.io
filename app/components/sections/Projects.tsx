"use client"

import { ProjectCard } from "../cards/ProjectCard"
import { Terminal, Brain, Gamepad2, Cpu, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function Projects() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [techSearchQuery, setTechSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 4

  const projects = [
    {
      title: "neo-OS",
      description: "Custom Operating System for AMD64 Architecture",
      longDescription: "A complete operating system written from scratch in C++ and assembly, featuring custom drivers, virtual file system, and multithreading support.",
      image: "/neoOSPreview.png",
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
      image: "/mobyGlobalPoster.png",
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
      title: "CMLIB",
      description: "Custom Machine Learning Library",
      longDescription: "A custom machine learning library written in C++ with support for various machine learning algorithms and data structures.",
      image: "/cmlibPreview.png",
      icon: <Brain />,
      iconColor: "text-green-400",
      link: "https://github.com/2900xt/CMLIB",
      features: [
        "Custom Machine Learning Algorithms",
        "Custom Data Structures and Linear Algebra Library",
        "Custom Plotting Function",
        "Built in Bare-Bones C++"
      ],
      technologies: [
        { name: "C++", color: "blue" },
        { name: "Machine Learning", color: "orange" },
        { name: "Data Structures", color: "purple" },
        { name: "Math", color: "green" }
      ]
    },
    {
      title: "CHIP-8 Emulator",
      description: "Custom CHIP-8 Emulator Implementation",
      longDescription: "A complete CHIP-8 emulator written in C, featuring all 35 original opcodes, memory management, and video output. Includes ROM loading and real-time emulation.",
      image: "/chip8Preview.png",
      icon: <Cpu />,
      iconColor: "text-cyan-400",
      link: "https://github.com/2900xt/chip8-emu",
      features: [
        "Complete implementation of all 35 CHIP-8 opcodes",
        "Memory management and ROM loading",
        "Video output and display system",
        "Test ROM compatibility and debugging tools"
      ],
      technologies: [
        { name: "C", color: "blue" },
        { name: "Emulation", color: "purple" },
        { name: "Low-Level", color: "orange" }
      ]
    },
    {
      title: "EcoSpark",
      description: "Educational Climate Change Management Game",
      longDescription: "Built for the 2024 Congressional App Challenge, Virginia District 10. An educational game that teaches players about climate change through city management and energy resource balancing.",
      image: "/ecoSparkPreview.png",
      icon: <Brain />,
      iconColor: "text-green-400",
      link: "https://github.com/CognicadeStudios/EcoSpark",
      features: [
        "Educational climate change simulation",
        "City management and energy resource balancing",
        "Contract system with AI-powered negotiations",
        "Research upgrades and eco-friendly housing options"
      ],
      technologies: [
        { name: "C#", color: "purple" },
        { name: "Unity", color: "blue" },
        { name: "Game Dev", color: "green" },
        { name: "AI", color: "orange" }
      ]
    },
    {
      title: "WinterWarzone",
      description: "Multiplayer Winter Combat Game",
      longDescription: "A multiplayer combat game set in a winter environment with strategic gameplay and team-based mechanics.",
      image: "/winterWarzonePreview.png",
      icon: <Gamepad2 />,
      iconColor: "text-blue-400",
      link: "https://github.com/2900xt/WinterWarzone",
      features: [
        "Multiplayer combat mechanics",
        "Winter-themed environment and gameplay",
        "Strategic team-based combat",
        "Real-time multiplayer networking"
      ],
      technologies: [
        { name: "Game Dev", color: "green" },
        { name: "Multiplayer", color: "blue" },
        { name: "Networking", color: "purple" }
      ]
    },
    {
      title: "Grading Hat",
      description: "AI-Powered Grading Assistant",
      longDescription: "An intelligent grading system that uses AI to assist educators in evaluating student work efficiently and consistently.",
      image: "/gradingHatPreview.png",
      icon: <Brain />,
      iconColor: "text-yellow-400",
      link: "https://github.com/2900xt/Grading-Hat",
      features: [
        "AI-powered grading assistance",
        "Consistent evaluation standards",
        "Educational workflow integration",
        "Automated feedback generation"
      ],
      technologies: [
        { name: "AI/ML", color: "orange" },
        { name: "Education", color: "blue" },
        { name: "Automation", color: "green" }
      ]
    },
    {
      title: "plundr.io",
      description: "Pirate-Themed Multiplayer Strategy Game",
      longDescription: "A competitive multiplayer game where players take on the role of pirates, competing for treasure and territory in a dynamic ocean environment.",
      image: "/plundrIOPreview.png",
      icon: <Gamepad2 />,
      iconColor: "text-orange-400",
      link: "https://devpost.com/software/plundr-io",
      features: [
        "Pirate-themed multiplayer gameplay",
        "Treasure hunting and territory control",
        "Real-time strategy elements",
        "Competitive multiplayer mechanics"
      ],
      technologies: [
        { name: "Game Dev", color: "green" },
        { name: "Multiplayer", color: "blue" },
        { name: "Strategy", color: "purple" }
      ]
    },
    {
      title: "Bread to Dough",
      description: "Bread Tycoon Game with Prestige System",
      longDescription: "A bread tycoon game where players farm resources and build automated factories to create bread. Features a prestige system with 5 bread tiers and hand-drawn assets.",
      image: "/bread2DoughPreview.png",
      icon: <Gamepad2 />,
      iconColor: "text-yellow-400",
      link: "https://devpost.com/software/bread-to-dough",
      features: [
        "Prestige system with 5 bread tiers",
        "Automated bread factories",
        "Resource farming mechanics",
        "Hand-drawn assets and cutscenes"
      ],
      technologies: [
        { name: "C#", color: "purple" },
        { name: "Unity", color: "blue" },
        { name: "Game Dev", color: "green" },
        { name: "HTML", color: "orange" }
      ]
    },
    {
      title: "The Rookie",
      description: "First-Person Spy Platformer with Simulation Twist",
      longDescription: "A first-person platformer inspired by Karlson and Portal where players use grappling, hacking, and energy blasting mechanics through a BURP device. Features a plot twist where the entire game is revealed to be a spy simulation test that players must escape.",
      image: "/theRookie.png",
      icon: <Gamepad2 />,
      iconColor: "text-red-400",
      link: "https://devpost.com/software/the-rookie",
      features: [
        "Three core mechanics: grappling, hacking, energy blasting",
        "BURP device (Universal Radiocarpal Piece)",
        "Simulation twist and escape storyline",
        "3 levels with hidden escape codes"
      ],
      technologies: [
        { name: "C#", color: "purple" },
        { name: "Unity", color: "blue" },
        { name: "Game Dev", color: "green" }
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

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const startIndex = (currentPage - 1) * projectsPerPage
  const endIndex = startIndex + projectsPerPage
  const currentProjects = filteredProjects.slice(startIndex, endIndex)

  // Reset to first page when filters change
  const resetToFirstPage = () => {
    setCurrentPage(1)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
    resetToFirstPage()
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    resetToFirstPage()
  }

  const handleTechSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTechSearchQuery(e.target.value)
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
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
                onChange={handleSearchChange}
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
                onChange={handleTechSearchChange}
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
                  onClick={() => {
                    setSelectedTags([])
                    resetToFirstPage()
                  }}
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
            Showing {startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} projects
            {selectedTags.length > 0 && (
              <span className="ml-2">
                • Filtered by: {selectedTags.join(", ")}
              </span>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {currentProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={currentProjects.length % 2 === 1 && index === currentProjects.length - 1 ? "lg:col-span-2 lg:max-w-2xl lg:mx-auto" : ""}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center space-x-4"
          >
            <Button
              variant="outline"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="bg-transparent border-white/30 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 p-0 ${
                    page === currentPage
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-transparent border-white/30 text-white hover:bg-white/10"
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="bg-transparent border-white/30 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        )}

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
                resetToFirstPage()
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