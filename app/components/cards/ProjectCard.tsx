import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface Technology {
  name: string
  color: string
}

interface ProjectCardProps {
  title: string
  description: string
  longDescription: string
  image: string
  icon: React.ReactNode
  iconColor: string
  link?: string
  features?: string[]
  technologies: Technology[]
}

export function ProjectCard({
  title,
  description,
  longDescription,
  image,
  icon,
  iconColor,
  link,
  features,
  technologies,
}: ProjectCardProps) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (link) {
      return (
        <Link href={link} target="_blank" className="block">
          {children}
        </Link>
      )
    }
    return <>{children}</>
  }

  return (
    <CardWrapper>
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 group">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {link && (
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" className="bg-black/50 hover:bg-black/70">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="flex items-center text-white text-xl">
            <span className={`mr-3 h-6 w-6 ${iconColor}`}>{icon}</span>
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
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <Badge
                key={index}
                className={`bg-${tech.color}-500/20 text-${tech.color}-300 border-${tech.color}-500/30`}
              >
                {tech.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  )
} 