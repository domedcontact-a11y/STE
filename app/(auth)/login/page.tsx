'use client'

import { useActionState } from 'react'
import { login, signup } from '../actions'

const initialState = {
  error: null,
  success: null
}

export default function LoginPage({ searchParams }: { searchParams: { error?: string, success?: string } }) {
  // Simple state management for the form actions (Next 14 style)
  // We'll wrap our server actions in a standard arrow function to handle client side state
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Welcome to CM App</h1>
        
        {searchParams?.error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
              {searchParams.error}
            </div>
        )}
        {searchParams?.success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm text-center">
              {searchParams.success}
            </div>
        )}

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" 
              id="email" 
              name="email" 
              type="email" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" 
              id="password" 
              name="password" 
              type="password" 
              required 
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button 
              formAction={login} 
              className="flex-1 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition"
            >
              Sign In
            </button>
            <button 
              formAction={signup} 
              className="flex-1 bg-white text-blue-600 border border-blue-600 rounded-md px-4 py-2 hover:bg-blue-50 transition"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
