'use client'

import { createOrganization } from './actions'

export default function SetupOrganizationPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Setup Organization</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create your company namespace to begin managing construction projects.
          </p>
        </div>

        {searchParams?.error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
              {searchParams.error}
            </div>
        )}

        <form className="space-y-6" action={createOrganization}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              placeholder="e.g. Acme Steel Construction"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            Create Organization & Continue
          </button>
        </form>
      </div>
    </div>
  )
}
