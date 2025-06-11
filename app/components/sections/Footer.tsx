import { Github, Mail } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  const socialLinks = [
    {
      href: "https://github.com/2900xt",
      icon: <Github className="h-6 w-6" />,
      label: "GitHub"
    },
    {
      href: "mailto:tahakrawjani@gmail.com",
      icon: <Mail className="h-6 w-6" />,
      label: "Email"
    }
  ]

  return (
    <footer className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-2">Taha Rawjani</h3>
            <p className="text-gray-400">Systems Developer & Competitive Programmer</p>
          </motion.div>
          <motion.div
            className="flex justify-center space-x-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
                rel="noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.4 + index * 0.1
                }}
              >
                {link.icon}
              </motion.a>
            ))}
          </motion.div>
          <motion.p
            className="text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            © 2025 Taha Rawjani. Built with Next.js and Tailwind CSS.
          </motion.p>
        </div>
      </motion.div>
    </footer>
  )
} 