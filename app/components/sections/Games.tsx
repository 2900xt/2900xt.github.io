"use client"

import { Gamepad2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface GameProps {
  title: string
  image: string
  genre: string
  onPlay: () => void
}

function GameCard({ title, image, genre, onPlay }: GameProps) {
  return (
    <motion.div 
      className="relative group cursor-pointer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onPlay}
    >
      <div className="relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300">
        {/* Game Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Genre Tag */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-purple-500/80 text-white border-purple-400/50 backdrop-blur-sm">
              {genre}
            </Badge>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              size="lg"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white shadow-2xl"
            >
              <Gamepad2 className="h-6 w-6 mr-3" />
              Play Game
            </Button>
          </div>

          {/* Game Title */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function Games() {
  const games = [
    {
      title: "EcoSpark",
      image: "/ecoSparkPreview.png",
      genre: "Simulation"
    },
    {
      title: "plundr.io",
      image: "/plundrIOPreview.png",
      genre: "Strategy"
    },
    {
      title: "Bread to Dough",
      image: "/bread2DoughPreview.png",
      genre: "Tycoon"
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
    <section id="games" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
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
                title={game.title}
                image={game.image}
                genre={game.genre}
                onPlay={() => handlePlay(game.title)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}