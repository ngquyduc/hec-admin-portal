import { createFileRoute, Link } from '@tanstack/react-router'
import { Users, GraduationCap, UserCircle, BookOpen } from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const entities = [
    {
      to: '/staff',
      icon: <Users className="w-16 h-16 text-blue-600" />,
      title: 'Staff',
      description: 'Manage administrators, coordinators, and support staff',
      count: '0',
    },
    {
      to: '/teachers',
      icon: <GraduationCap className="w-16 h-16 text-green-600" />,
      title: 'Teachers',
      description: 'Manage teaching staff and their subjects',
      count: '0',
    },
    {
      to: '/students',
      icon: <BookOpen className="w-16 h-16 text-purple-600" />,
      title: 'Students',
      description: 'Manage student enrollments and progress',
      count: '0',
    },
    {
      to: '/parents',
      icon: <UserCircle className="w-16 h-16 text-orange-600" />,
      title: 'Parents',
      description: 'Manage parent contacts and relationships',
      count: '0',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            HEC Admin Portal
          </h1>
          <p className="text-xl text-gray-600">
            English Tutoring Center Management System
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {entities.map((entity) => (
            <Link
              key={entity.to}
              to={entity.to}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-blue-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{entity.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {entity.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {entity.description}
                </p>
                <div className="mt-auto">
                  <span className="text-3xl font-bold text-gray-800">
                    {entity.count}
                  </span>
                  <p className="text-xs text-gray-500">Total Records</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Quick Start Guide
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Set up your Supabase project following <code className="bg-gray-100 px-2 py-1 rounded">SUPABASE_SETUP.md</code></li>
            <li>Configure your environment variables in <code className="bg-gray-100 px-2 py-1 rounded">.env</code></li>
            <li>Run the database schema from <code className="bg-gray-100 px-2 py-1 rounded">supabase-schema.sql</code></li>
            <li>Start managing your staff, teachers, students, and parents</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
