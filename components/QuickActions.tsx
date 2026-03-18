'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const actions = [
    { name: 'Create Project', href: '/projects/new' },
    { name: 'Upload Drawings', href: '/drawings/upload' },
    { name: 'Add Assemblies', href: '/assemblies/new' },
    { name: 'Upload Elements', href: '/elements/upload' },
    { name: 'Create Activities', href: '/activities/new' },
  ]

  return (
    <div className="relative inline-block text-left z-50">
      <div>
        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          id="quick-actions-menu"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          Quick Actions
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div 
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" 
          role="menu" 
          aria-orientation="vertical" 
          aria-labelledby="quick-actions-menu"
        >
          <div className="py-1" role="none">
            {actions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                {action.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
