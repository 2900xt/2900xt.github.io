"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Code2, Cpu, HardDrive, Zap, Shield, Layers, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { DocumentationContent } from "./components/DocumentationContent"

const documentationSections = [
  {
    id: "overview",
    title: "Architecture Overview",
    description: "High-level system architecture and design principles",
    icon: Layers,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "kernel",
    title: "Kernel Core",
    description: "Memory management, process handling, and core kernel functionality",
    icon: Cpu,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "boot",
    title: "Boot Process",
    description: "System initialization and LIMINE boot sequence",
    icon: Zap,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "drivers",
    title: "Drivers",
    description: "Hardware drivers (PCI, ACPI, AHCI, VGA, Network, etc.)",
    icon: HardDrive,
    color: "from-orange-500 to-red-500"
  },
  {
    id: "filesystem",
    title: "File System",
    description: "Virtual File System (VFS) and FAT implementation",
    icon: HardDrive,
    color: "from-teal-500 to-blue-500"
  },
  {
    id: "memory",
    title: "Memory Management",
    description: "Page allocation, heap management, and virtual memory",
    icon: Cpu,
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: "stdlib",
    title: "Standard Library",
    description: "Built-in string, math, and utility functions",
    icon: Code2,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "build",
    title: "Build System",
    description: "Compilation process and toolchain requirements",
    icon: Code2,
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "applications",
    title: "Applications",
    description: "Built-in programs and shell implementation",
    icon: Shield,
    color: "from-cyan-500 to-blue-500"
  },
  {
    id: "api",
    title: "API Reference",
    description: "Function and structure references",
    icon: Code2,
    color: "from-violet-500 to-purple-500"
  },
  {
    id: "config",
    title: "Configuration",
    description: "Build-time configuration options",
    icon: Shield,
    color: "from-emerald-500 to-teal-500"
  }
]

export default function NEOOSPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  if (selectedSection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <motion.button
            onClick={() => setSelectedSection(null)}
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Overview
          </motion.button>
          <DocumentationContent section={selectedSection} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="container mx-auto px-4 py-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Link>
            <motion.h1
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              NEO-OS
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              An open source, fast, and secure amd64 operating system built on the LIMINE protocol with UEFI booting support
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4 justify-center text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Version 0.001A</span>
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">x86-64</span>
              <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">UEFI</span>
              <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">LIMINE</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Key Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore the technical documentation of a modern operating system designed from the ground up
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentationSections.map((section, index) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setSelectedSection(section.id)}
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full hover:bg-white/10 transition-all duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{section.description}</p>
                  <div className="flex items-center text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                    Read Documentation
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Technical Highlights */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Technical Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Modular page frame allocator",
              "Virtual file system",
              "Simultaneous multiprocessing",
              "Custom icon file format",
              "APIC & ACPI drivers", 
              "Heap management",
              "Timer subsystem",
              "Standard library"
            ].map((feature, index) => (
              <motion.div
                key={feature}
                className="flex items-center gap-3 text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + index * 0.1, duration: 0.6 }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                <span className="text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

 