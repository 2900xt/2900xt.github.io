import { ProjectCard } from "../cards/ProjectCard"
import { Terminal, Brain, Gamepad2, Cpu } from "lucide-react"

export function Projects() {
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

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-4">Featured Projects</h2>
        <p className="text-center text-gray-300 mb-12 text-lg">
          Recent work in systems programming and AI applications
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  )
} 