import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AchievementCardProps {
  title: string
  description: string
  icon: React.ReactNode
  gradient: string
  image?: string
}

export function AchievementCard({
  title,
  description,
  icon,
  gradient,
  image = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&h=600&fit=crop", // default abstract background
}: AchievementCardProps) {
  return (
    <Card className="relative overflow-hidden group">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover opacity-15 group-hover:opacity-30 transition-opacity duration-300"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80 mix-blend-multiply`}></div>
      </div>

      {/* Content */}
      <div className="relative">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            {icon}
          </div>
          <CardTitle className="text-xl text-white drop-shadow-md">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-white font-medium drop-shadow-md">{description}</p>
        </CardContent>
      </div>
    </Card>
  )
} 