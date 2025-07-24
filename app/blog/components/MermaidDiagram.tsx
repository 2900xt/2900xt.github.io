"use client"

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  chart: string
  id?: string
}

let mermaidInitialized = false

export default function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !containerRef.current) return

    const initializeMermaid = async () => {
      if (!mermaidInitialized) {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#3b82f6',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#1e40af',
            lineColor: '#9ca3af',
            secondaryColor: '#8b5cf6',
            tertiaryColor: '#f3f4f6',
            background: '#1e293b',
            mainBkg: '#374151',
            secondBkg: '#4b5563',
            tertiaryBkg: '#6b7280',
            // Text colors - make sure all text is white
            textColor: '#ffffff',
            secondaryTextColor: '#ffffff',
            tertiaryTextColor: '#ffffff',
            // Node colors
            nodeBkg: '#374151',
            nodeTextColor: '#ffffff',
            // Edge colors
            edgeLabelBackground: '#374151',
            // Flowchart specific
            clusterBkg: '#374151',
            clusterTextColor: '#ffffff',
            // Section colors for better contrast
            sectionBkgColor: '#374151',
            altSectionBkgColor: '#4b5563',
            // Additional text color overrides
            labelTextColor: '#ffffff',
            loopTextColor: '#ffffff',
            noteTextColor: '#ffffff',
            activationTextColor: '#ffffff',
          },
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            useMaxWidth: true,
            // Make charts more compact
            nodeSpacing: 30,
            rankSpacing: 40,
          },
          // Global font settings
          fontFamily: 'Inter, system-ui, sans-serif',
        })
        mermaidInitialized = true
      }

      try {
        const element = containerRef.current
        if (!element) return

        // Clear previous content
        element.innerHTML = ''

        // Generate unique ID
        const uniqueId = id || `mermaid-${Math.random().toString(36).substr(2, 9)}`

        // Render the diagram
        const { svg } = await mermaid.render(uniqueId, chart)
        element.innerHTML = svg

        // Style the SVG
        const svgElement = element.querySelector('svg')
        if (svgElement) {
          svgElement.style.width = '100%'
          svgElement.style.height = 'auto'
          svgElement.style.maxWidth = '100%'
          
          // Force ALL text elements to be white and properly sized
          const allTextElements = svgElement.querySelectorAll('text, tspan, .label, .edgeLabel, .nodeLabel, .cluster text')
          allTextElements.forEach((textEl: any) => {
            textEl.style.fill = '#ffffff'
            textEl.style.color = '#ffffff'
            textEl.style.fontFamily = 'Inter, system-ui, sans-serif'
            textEl.style.fontSize = '12px'
            textEl.style.fontWeight = '400'
          })
          
          // Make sure nested text in labels is also white
          const nestedTextElements = svgElement.querySelectorAll('.label text, .edgeLabel text, .nodeLabel text, foreignObject div')
          nestedTextElements.forEach((textEl: any) => {
            textEl.style.color = '#ffffff'
            textEl.style.fill = '#ffffff'
          })
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error)
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300">
              <p class="font-semibold">Diagram Rendering Error</p>
              <p class="text-sm mt-1">Failed to render mermaid diagram</p>
            </div>
          `
        }
      }
    }

    initializeMermaid()
  }, [chart, id, isClient])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-800/30 rounded-lg border border-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="my-6 overflow-x-auto">
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
        <div 
          ref={containerRef} 
          className="mermaid-container"
          style={{
            // Use CSS variables to ensure text visibility
            '--mermaid-text-color': '#ffffff',
            '--mermaid-bg-color': '#374151',
            '--mermaid-border-color': '#6b7280'
          } as any}
        />
      </div>
    </div>
  )
} 