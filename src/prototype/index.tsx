/**
 * Prototype Entry Point
 *
 * This file is the main entry point for the prototype.
 * Core imports this dynamically and renders the Canvas.
 *
 * LLM: Modify this file to add/remove apps, change layout, etc.
 */

import { Canvas, defineApp, ThemeProvider, DevTools, resetStore } from 'protomobilekit'
import { seedData } from './entities'
import { MainApp } from './apps/main'

// Import users config (registers roles and test users)
import './users'

// Initialize data
resetStore()
seedData()

// Prototype configuration
export default function Prototype() {
  return (
    <ThemeProvider defaultPlatform="ios">
      <Canvas
        apps={[
          defineApp({
            id: 'main',
            name: 'Main App',
            device: 'iphone-14',
            component: () => <MainApp />,
          }),
          // LLM: Add more apps here
          // defineApp({
          //   id: 'admin',
          //   name: 'Admin Panel',
          //   device: 'iphone-14',
          //   component: () => <AdminApp />,
          // }),
        ]}
        layout="row"
        gap={24}
        showLabels
      />

      {/* DevTools for quick user switching and state inspection */}
      <DevTools position="right" devOnly={false} />
    </ThemeProvider>
  )
}
