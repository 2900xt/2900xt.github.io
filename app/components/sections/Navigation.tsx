import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const navItems = [
  { href: "/games", label: "Games" },
  { href: "/blog", label: "Blog" }
]

export function Navigation() {
  return (
    <motion.nav
      className="fixed top-0 w-full bg-black/20 backdrop-blur-xl border-b border-white/10 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="block">
            <motion.div
              className="flex items-center space-x-3 text-xl font-bold text-white hover:text-gray-200 transition-colors cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/favicon.svg"
                alt="Taha Rawjani Logo"
                width={28}
                height={28}
                className="w-7 h-7"
              />
              <span>Taha Rawjani</span>
            </motion.div>
          </Link>
          
          {/* Right-aligned Navigation Items */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item, index) => (
              <Link key={item.href} href={item.href}>
                <motion.span
                  className="text-gray-300 hover:text-white transition-colors relative inline-block"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  )
} 