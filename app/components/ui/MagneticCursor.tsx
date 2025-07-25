'use client'

import { useEffect, useState, useRef } from 'react'

interface MousePosition {
  x: number
  y: number
}

export default function MagneticCursor() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [cursorPosition, setCursorPosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Check if hovering over interactive element
      const target = e.target as HTMLElement
      const isInteractive = target.closest('button, a, [role="button"], input, textarea, select')
      
      if (isInteractive && isInteractive !== hoveredElement) {
        setHoveredElement(isInteractive as HTMLElement)
        setIsHovering(true)
      } else if (!isInteractive && isHovering) {
        setHoveredElement(null)
        setIsHovering(false)
      }
    }

    const animateCursor = () => {
      setCursorPosition(prev => {
        let targetX = mousePosition.x
        let targetY = mousePosition.y

        // Magnetic attraction to hovered element
        if (isHovering && hoveredElement) {
          const rect = hoveredElement.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          
          // Calculate attraction strength based on distance
          const distance = Math.sqrt(
            Math.pow(mousePosition.x - centerX, 2) + 
            Math.pow(mousePosition.y - centerY, 2)
          )
          
          if (distance < 100) {
            const strength = Math.max(0, 1 - distance / 100) * 0.3
            targetX = mousePosition.x + (centerX - mousePosition.x) * strength
            targetY = mousePosition.y + (centerY - mousePosition.y) * strength
          }
        }

        // Smooth interpolation
        const ease = 0.15
        return {
          x: prev.x + (targetX - prev.x) * ease,
          y: prev.y + (targetY - prev.y) * ease
        }
      })
      animationRef.current = requestAnimationFrame(animateCursor)
    }

    document.addEventListener('mousemove', handleMouseMove)
    animationRef.current = requestAnimationFrame(animateCursor)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition, isHovering, hoveredElement])

  return (
    <>
      {/* Outer cursor ring */}
      

              {/* Inner cursor dot */}
        <div 
          className="fixed pointer-events-none z-[9999] mix-blend-difference"
          style={{
            left: mousePosition.x - 4,
            top: mousePosition.y - 4,
          }}
        >
        <div 
          className={`w-2 h-2 rounded-full transition-all duration-200 ${
            isHovering 
              ? 'bg-gradient-to-r from-pink-400 to-yellow-400 scale-150' 
              : 'bg-white scale-100'
          }`} 
        />
      </div>

    </>
  )
} 