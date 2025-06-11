import { ContactCard } from "../cards/ContactCard"
import { Mail, Linkedin, Github } from "lucide-react"
import { motion } from "framer-motion"
import { AnimateOnScroll } from "../ui/AnimateOnScroll"

export function Contact() {
  const contacts = [
    {
      title: "Email",
      content: "tahakrawjani@gmail.com",
      icon: <Mail className="h-8 w-8" />,
      gradient: "from-blue-600 to-blue-700",
      href: "mailto:tahakrawjani@gmail.com"
    },
    {
      title: "LinkedIn",
      content: "Taha Rawjani",
      icon: <Linkedin className="h-8 w-8" />,
      gradient: "from-green-600 to-green-700",
      href: "https://www.linkedin.com/in/taha-rawjani-08959a2a0/"
    },
    {
      title: "GitHub",
      content: "2900xt",
      icon: <Github className="h-8 w-8" />,
      gradient: "from-purple-600 to-purple-700",
      href: "https://github.com/2900xt"
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

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto text-center">
        <AnimateOnScroll>
          <h2 className="text-4xl font-bold text-white mb-4">Contact</h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Feel free to reach out for opportunities, collaborations, or questions about my work.
          </p>
        </AnimateOnScroll>
        
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {contacts.map((contact, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ContactCard {...contact} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 