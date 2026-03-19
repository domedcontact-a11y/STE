import { submitProject } from './actions'

export const metadata = {
  title: 'Create Project | CM App'
}

export default function CreateProjectPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Create a New Project
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            A project acts as the highest level container for your drawings, assemblies, and elements.
          </p>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {searchParams?.error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              <span className="font-medium">Error:</span> {searchParams.error}
            </div>
          )}

          <form action={submitProject} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="e.g. Tower 42 Construction"
                  className="block w-full text-black rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end gap-x-3">
                <a
                  href="/dashboard"
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition"
                >
                  Cancel
                </a>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition"
                >
                  Create Project
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
