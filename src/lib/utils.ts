import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const LOGIN_PATH = '/login'

function normalizePathname(pathname: string): string {
  if (!pathname) return '/'
  return pathname.startsWith('/') ? pathname : `/${pathname}`
}

export function sanitizeAuthRedirectPath(redirect?: string | null): string | null {
  if (!redirect) return null

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost'

  try {
    const url = new URL(redirect, currentOrigin)

    if (url.origin !== currentOrigin) return null
    if (url.searchParams.has('redirect')) return null

    const pathname = normalizePathname(url.pathname)
    if (pathname === LOGIN_PATH) return null

    return pathname
  } catch {
    return null
  }
}

export function buildLoginRedirectPath(currentHref: string): string {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost'

  try {
    const url = new URL(currentHref, currentOrigin)
    const pathname = normalizePathname(url.pathname)

    if (pathname === LOGIN_PATH) return '/'

    return pathname
  } catch {
    return '/'
  }
}
