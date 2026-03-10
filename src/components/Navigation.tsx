import { Link } from '@tanstack/react-router'
import { Users, GraduationCap, UserCircle, BookOpen, School, CalendarDays } from 'lucide-react'
import { useCurrentUser, useIsAdmin } from '@/hooks/useAuth'

export default function Navigation() {
  const { data: user } = useCurrentUser()
  const isAdmin = useIsAdmin()

  if (!user) return null

  const adminNavItems = [
    { to: '/' as const, label: 'Dashboard' },
    { to: '/staff' as const, label: 'Staff', icon: Users },
    { to: '/teachers' as const, label: 'Teachers', icon: GraduationCap },
    { to: '/students' as const, label: 'Students', icon: BookOpen },
    { to: '/parents' as const, label: 'Parents', icon: UserCircle },
    { to: '/classes' as const, label: 'Classes', icon: School },
    { to: '/lessons' as const, label: 'Lessons', icon: CalendarDays },
  ]

  const teacherNavItems = [
    { to: '/teacher' as const, label: 'My Classes', icon: School },
  ]

  const navItems = isAdmin ? adminNavItems : teacherNavItems

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-12">
          <div className="flex space-x-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors text-sm"
                activeProps={{
                  className: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
                }}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
