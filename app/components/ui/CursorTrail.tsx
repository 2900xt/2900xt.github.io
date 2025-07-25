'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  opacity: number
  scale: number
  life: number
}

export default function CursorTrail() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let particleId = 0
    let animationFrame: number

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Create new particle
      const newParticle: Particle = {
        id: particleId++,
        x: e.clientX,
        y: e.clientY,
        opacity: 1,
        scale: 1,
        life: 100
      }

      setParticles(prev => [...prev, newParticle])
    }

    const animateParticles = () => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            life: particle.life - 2,
            opacity: particle.life / 100,
            scale: 0.2 + (particle.life / 100) * 0.8
          }))
          .filter(particle => particle.life > 0)
      )
      animationFrame = requestAnimationFrame(animateParticles)
    }

    document.addEventListener('mousemove', handleMouseMove)
    animationFrame = requestAnimationFrame(animateParticles)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <>
      <div 
        className="fixed pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 4,
          top: mousePosition.y - 4,
        }}
      >
        <div 
          className={`w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-screen`} 
        />
      </div>

      {/* Particle trail */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-screen"
            style={{
              left: particle.x - 4,
              top: particle.y - 4,
              opacity: particle.opacity,
              transform: `scale(${particle.scale})`,
              transition: 'all 0.1s ease-out'
            }}
          />
        ))}
      </div>


    </>
  )
} 