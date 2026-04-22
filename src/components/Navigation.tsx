import { Link } from '@tanstack/react-router'
import {
  Users,
  GraduationCap,
  UserCircle,
  BookOpen,
  School,
  CalendarDays,
  MessageSquare,
  FileText,
  House,
} from 'lucide-react'
import { useCurrentUser } from '@/hooks/useAuth'

type NavigationProps = {
  isOpen: boolean
}

export default function Navigation({ isOpen }: NavigationProps) {
  const { data: user } = useCurrentUser()

  if (!user) return null

  const adminNavItems = [
    { to: '/' as const, label: 'Dashboard', icon: House },
    { to: '/staff' as const, label: 'Staff', icon: Users },
    { to: '/teachers' as const, label: 'Teachers', icon: GraduationCap },
    { to: '/students' as const, label: 'Students', icon: BookOpen },
    { to: '/entry-tests' as const, label: 'Entry Tests', icon: FileText },
    { to: '/parents' as const, label: 'Parents', icon: UserCircle },
    { to: '/classes' as const, label: 'Classes', icon: School },
    { to: '/lessons' as const, label: 'Lessons', icon: CalendarDays },
    { to: '/feedback' as const, label: 'Feedback', icon: MessageSquare },
  ]

  const teacherNavItems = [
    { to: '/teacher' as const, label: 'My Classes', icon: School },
    { to: '/feedback' as const, label: 'Feedback', icon: MessageSquare },
  ]

  const navItems = user.role === 'teacher' ? teacherNavItems : adminNavItems

  return (
    <nav className="border-r bg-white">
      <div className="md:hidden border-b px-4 py-3 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center rounded-full pl-4 pr-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              activeProps={{
                className: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
              }}
              title={label}
            >
              <span className="h-9 w-9 flex items-center justify-center shrink-0">
                {Icon && <Icon className="h-4 w-4" />}
              </span>
              <span
                className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-200 ${
                  isOpen ? 'max-w-[12rem] opacity-100 translate-x-0' : 'max-w-0 opacity-0 translate-x-1'
                }`}
              >
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <aside
        className={`hidden md:flex md:flex-col md:min-h-[calc(100vh-4rem)] md:py-4 md:overflow-hidden md:transition-[width] md:duration-200 ${
          isOpen ? 'md:w-64' : 'md:w-20'
        }`}
      >
        <div className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center rounded-full pl-6 pr-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              activeProps={{
                className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
              }}
              title={label}
            >
              <span className="h-9 w-9 flex items-center justify-center shrink-0">
                {Icon && <Icon className="h-4 w-4" />}
              </span>
              <span
                className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-200 ${
                  isOpen ? 'max-w-[12rem] opacity-100 translate-x-0' : 'max-w-0 opacity-0 translate-x-1'
                }`}
              >
                {label}
              </span>
            </Link>
          ))}
        </div>
      </aside>
    </nav>
  )
}
