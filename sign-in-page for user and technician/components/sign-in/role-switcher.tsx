'use client'

import { motion } from 'framer-motion'
import { ROLES, type Role } from './roles'

interface RoleSwitcherProps {
  value: Role
  onChange: (role: Role) => void
}

export function RoleSwitcher({ value, onChange }: RoleSwitcherProps) {
  return (
    <div
      role="tablist"
      aria-label="Sign in as"
      className="grid grid-cols-2 rounded-[6px] border border-[#E4E0D6] p-1"
    >
      {ROLES.map((role) => {
        const active = role.value === value
        return (
          <button
            key={role.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(role.value)}
            className="relative h-9 rounded-[4px] text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C]/40"
          >
            {active && (
              <motion.span
                layoutId="role-indicator"
                className="absolute inset-0 rounded-[4px] bg-[#E8590C]"
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            )}
            <span
              className={`relative transition-colors duration-200 ${
                active ? 'text-[#F7F5F0]' : 'text-[#77756E] hover:text-[#1A1A18]'
              }`}
            >
              {role.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
