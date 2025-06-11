import { AchievementCard } from "../cards/AchievementCard"
import { Award, Code } from "lucide-react"
import { AnimateOnScroll } from "../ui/AnimateOnScroll"
import { motion } from "framer-motion"

export function Achievements() {
  const achievements = [
    {
      title: "ISEF Finalist",
      description: "🥇 4th place in Robotics & Intelligent Machines 2025",
      icon: <Award className="h-8 w-8" />,
      gradient: "from-yellow-400 to-orange-500",
      image: "https://www.societyforscience.org/wp-content/uploads/2021/01/2021_ISEF_Logo_960.png" // Robot/tech image
    },
    {
      title: "USACO Gold Division",
      description: "🏆 Promoted to Gold Division Feburary 2025",
      icon: <Code className="h-8 w-8" />,
      gradient: "from-purple-500 to-pink-500",
      image: "https://i0.wp.com/d33wubrfki0l68.cloudfront.net/9cf90c985e48e778dd294ac588eb17c8e73cf7a1/8758b/images/usaco_logo.png?ssl=1" // Code/programming image
    },
    {
      title: "PClassic Fall 2024",
      description: "🥇 1st Place at University of Pennsylvania Classic Division",
      icon: <Award className="h-8 w-8" />,
      gradient: "from-blue-500 to-cyan-500",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UPenn_shield_with_banner.svg/250px-UPenn_shield_with_banner.svg.png" // Coding competition image
    },
    {
      title: "UMD HSPC",
      description: "🥈 2nd place overall 2025 High School Programming Competition",
      icon: <Award className="h-8 w-8" />,
      gradient: "from-green-500 to-emerald-500",
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/University_of_Maryland_seal.svg/640px-University_of_Maryland_seal.svg.png" // Computer/coding image
    },
    {
      title: "Lockheed Martin Codequest",
      description: "🥇 1st place Codequest 2024 Advanced @ Manassas, VA",
      icon: <Award className="h-8 w-8" />,
      gradient: "from-red-500 to-pink-500",
      image: "https://yt3.googleusercontent.com/wkjDtbEI_eJhDeom6GHa0lj1o5Z9kaHk1jZw7Yo7SxhkPlvMnaA-tXFkTWtzfKiNoD8u0x8ksg=s900-c-k-c0x00ffffff-no-rj" // Tech/aerospace image
    },
    {
      title: "ACL Hackathon",
      description: "🥇 1st place overall 2023 Academies of Loudoun",
      icon: <Award className="h-8 w-8" />,
      gradient: "from-indigo-500 to-purple-500",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn7CWFzF7Ib7V8mEAteY1yIB0GNyLtZo9jiw&s" // Hackathon/collaboration image
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <section id="achievements" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-4">Achievements & Recognition</h2>
          <p className="text-center text-slate-600 mb-12 text-lg">Competition results and academic recognition</p>
        </AnimateOnScroll>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AchievementCard {...achievement} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 