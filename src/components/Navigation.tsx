import { Link } from '@tanstack/react-router'
import { Users, GraduationCap, UserCircle, BookOpen, School, CalendarDays } from 'lucide-react'

export default function Navigation() {
  const navItems = [
    { to: '/staff', label: 'Staff', icon: Users },
    { to: '/teachers', label: 'Teachers', icon: GraduationCap },
    { to: '/students', label: 'Students', icon: BookOpen },
    { to: '/parents', label: 'Parents', icon: UserCircle },
    { to: '/classes', label: 'Classes', icon: School },
    { to: '/lessons', label: 'Lessons', icon: CalendarDays },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-900">
            HEC Admin Portal
          </Link>
          
          <div className="flex space-x-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                activeProps={{
                  className: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
