'use client'

import React, { useState } from 'react'
import Sidebar from './Sidebar'
import MainContent from './MainContent'

export default function DesktopContainer() {
  const [activeWindow, setActiveWindow] = useState('about')

  return (
    <div className="desktop-container">
      <Sidebar 
        side="left" 
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
      />
      <MainContent activeWindow={activeWindow} />
      <Sidebar 
        side="right" 
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
      />
    </div>
  )
}