"use client"

import { Gamepad2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface Technology {
  name: string
  color: string
}

interface GameProps {
  title: string
  description: string
  longDescription: string
  image: string
  iconColor: string
  features: string[]
  technologies: Technology[]
  onPlay: () => void
}

const colorClasses: { [key: string]: string } = {
  blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  red: "bg-red-500/20 text-red-300 border-red-500/30",
  green: "bg-green-500/20 text-green-300 border-green-500/30",
  purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  orange: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  pink: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
}

function GameCard({ title, description, longDescription, image, iconColor, features, technologies, onPlay }: GameProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 group">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="sm" 
            className="bg-black/50 hover:bg-black/70"
            onClick={onPlay}
          >
            <Gamepad2 className="h-4 w-4 mr-2" />
            Play
          </Button>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center text-white text-xl">
          <span className={`mr-3 h-6 w-6 ${iconColor}`}>
            <Gamepad2 />
          </span>
          {title}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4 leading-relaxed">
          {longDescription}
        </p>
        {features && features.length > 0 && (
          <div className="space-y-2 text-sm text-gray-400 mb-4">
            {features.map((feature, index) => (
              <div key={index}>• {feature}</div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, index) => (
            <Badge
              key={index}
              className={colorClasses[tech.color] || colorClasses.blue}
            >
              {tech.name}
            </Badge>
          ))}
        </div>
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={onPlay}
        >
          <Gamepad2 className="h-4 w-4 mr-2" />
          Play Game
        </Button>
      </CardContent>
    </Card>
  )
}

export function Games() {
  const games = [
    {
      title: "EcoSpark",
      description: "Educational Climate Change Management Game",
      longDescription: "Built for the 2024 Congressional App Challenge, Virginia District 10. An educational game that teaches players about climate change through city management and energy resource balancing.",
      image: "/ecoSparkPreview.png",
      iconColor: "text-green-400",
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
      title: "plundr.io",
      description: "Pirate-Themed Multiplayer Strategy Game",
      longDescription: "A competitive multiplayer game where players take on the role of pirates, competing for treasure and territory in a dynamic ocean environment.",
      image: "/plundrIOPreview.png",
      iconColor: "text-orange-400",
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
      iconColor: "text-yellow-400",
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
    }
  ]

  const gameUrls: { [key: string]: string } = {
    "EcoSpark": "https://cognicadestudios.github.io/EcoSparkGame/",
    "plundr.io": "https://ashmithry.github.io/Plundr.io-Game/",
    "Bread to Dough": "https://2900xt.github.io/bread2dough-build/"
  }

  const handlePlay = (gameTitle: string) => {
    const url = gameUrls[gameTitle]
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <section id="games" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">

        <div className="grid lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GameCard
                {...game}
                onPlay={() => handlePlay(game.title)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}