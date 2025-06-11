import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface ContactCardProps {
  title: string
  content: string
  icon: React.ReactNode
  gradient: string
  href: string
}

export function ContactCard({
  title,
  content,
  icon,
  gradient,
  href,
}: ContactCardProps) {
  return (
    <Link href={href} target="_blank" rel="noreferrer">
      <Card className={`bg-gradient-to-br ${gradient} text-white border-0 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105`}>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {content}
        </CardContent>
      </Card>
    </Link>
  )
} 