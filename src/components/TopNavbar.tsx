'use client'

import { UserCircleIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/contexts/ThemeContext'

export default function TopNavbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="fixed top-0 right-0 left-0 lg:left-64 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          AI Insights Dashboard
        </h1>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">User</span>
          </div>
        </div>
      </div>
    </div>
  )
}
