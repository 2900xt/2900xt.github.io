import { motion, useInView } from "framer-motion"
import { useRef } from "react"

interface AnimateOnScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimateOnScroll({ children, className, delay = 0 }: AnimateOnScrollProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 20
      }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.21, 0.45, 0.27, 0.99]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
} 