'use client'

import React from 'react'
import { Action, hasPermission } from '@/lib/rbac'

interface RBACButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  userRole: string | undefined | null
  requiredAction: Action
  children: React.ReactNode
}

/**
 * Example RBAC Usage Component
 * This button evaluates the user's role against the required action.
 * If the user lacks permission, it implicitly renders disabled with an opacity shift,
 * preventing unprivileged users from interacting natively at the UI level.
 */
export default function RBACButton({ userRole, requiredAction, children, className, ...props }: RBACButtonProps) {
  const assignedRole = userRole || 'viewer'
  const isAllowed = hasPermission(assignedRole, requiredAction)

  return (
    <button
      disabled={!isAllowed || props.disabled}
      title={!isAllowed ? `Requires permission string: ${requiredAction}` : undefined}
      className={`${className} ${!isAllowed ? 'opacity-50 cursor-not-allowed bg-gray-300 pointer-events-none' : ''}`}
      {...props}
    >
      {children}
    </button>
  )
}
