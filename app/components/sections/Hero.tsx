import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Mail, FileText, Code } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function Hero() {
  const fadeUpAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          className="mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="relative inline-block mb-6"
            variants={fadeUpAnimation}
          >
            <motion.img
              src="/tr.jpg"
              alt="Taha Rawjani"
              className="w-40 h-40 rounded-full mx-auto border-4 border-white/20 shadow-2xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </motion.div>
          <motion.h1
            className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            variants={fadeUpAnimation}
          >
            Taha Rawjani
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed"
            variants={fadeUpAnimation}
          >
            I like to build things. I work on a combo of AI, ML, and low-level systems.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-8"
            variants={fadeUpAnimation}
          >
            {[
              "🏆 Competitive Programmer",
              "💻 Low-Level Developer",
              "🤖 AI/ML Engineer",
              "🔬 ISEF Finalist"
            ].map((text, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              >
                <Badge className={`bg-gradient-to-r 
                  ${index === 0 ? "from-yellow-500 to-orange-500" : ""}
                  ${index === 1 ? "from-purple-500 to-pink-500" : ""}
                  ${index === 2 ? "from-green-500 to-emerald-500" : ""}
                  ${index === 3 ? "from-blue-500 to-cyan-500" : ""}
                  text-white font-semibold px-4 py-2`}
                >
                  {text}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            variants={fadeUpAnimation}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/projects">
                  <Code className="mr-2 h-5 w-5" />
                  Projects
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
              >
                <Link href="/blog">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Blog
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/Taha_Rawjani__Resume.pdf" target="_blank">
                  <FileText className="mr-2 h-5 w-5" />
                  Resume
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </section>
  )
} 