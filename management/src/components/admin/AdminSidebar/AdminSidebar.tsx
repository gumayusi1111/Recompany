/**
 * 管理系统侧边栏组件
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, LogOut, ChevronDown, ChevronRight } from 'lucide-react'
import * as Icons from 'lucide-react'
import { NavItem } from '@/config/routes'
import { cn } from '@/lib/utils'
import './AdminSidebar.css'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  navigation: NavItem[]
  currentPath: string
}

// 动态图标组件
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (Icons as any)[name] || Icons.Circle
  return <IconComponent className={className} />
}

export function AdminSidebar({ isOpen, onClose, navigation, currentPath }: AdminSidebarProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/admin/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return currentPath === href
    }
    return currentPath.startsWith(href)
  }

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const handleNavigation = (href: string) => {
    if (href !== '#') {
      router.push(href)
      onClose()
    }
  }

  return (
    <div className={cn(
      'admin-sidebar',
      isOpen && 'admin-sidebar--open'
    )}>
      {/* 侧边栏头部 */}
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo">
            <span className="admin-sidebar__logo-text">亚</span>
          </div>
          <span className="admin-sidebar__title">管理系统</span>
        </div>
        <button
          onClick={onClose}
          className="admin-sidebar__close lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 导航菜单 */}
      <nav className="admin-sidebar__nav">
        <div className="admin-sidebar__nav-list">
          {navigation.map((item) => {
            const active = isActive(item.href)
            const hasChildren = item.children && item.children.length > 0
            const isExpanded = expandedItems.includes(item.name)
            
            return (
              <div key={item.name} className="admin-sidebar__nav-item">
                <button
                  className={cn(
                    'admin-sidebar__nav-link',
                    active && 'admin-sidebar__nav-link--active',
                    hasChildren && 'admin-sidebar__nav-link--expandable'
                  )}
                  onClick={() => {
                    if (hasChildren) {
                      toggleExpanded(item.name)
                    } else {
                      handleNavigation(item.href)
                    }
                  }}
                >
                  <DynamicIcon name={item.icon} className="admin-sidebar__nav-icon" />
                  <span className="admin-sidebar__nav-text">{item.name}</span>
                  {item.badge && (
                    <span className="admin-sidebar__nav-badge">
                      {item.badge}
                    </span>
                  )}
                  {hasChildren && (
                    <div className="admin-sidebar__nav-arrow">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </button>

                {/* 子菜单 */}
                {hasChildren && (
                  <div className={cn(
                    'admin-sidebar__submenu',
                    isExpanded && 'admin-sidebar__submenu--expanded'
                  )}>
                    {item.children?.map((child) => {
                      const childActive = isActive(child.href)
                      
                      return (
                        <button
                          key={child.name}
                          className={cn(
                            'admin-sidebar__submenu-link',
                            childActive && 'admin-sidebar__submenu-link--active'
                          )}
                          onClick={() => handleNavigation(child.href)}
                        >
                          <DynamicIcon name={child.icon} className="admin-sidebar__submenu-icon" />
                          <span className="admin-sidebar__submenu-text">{child.name}</span>
                          {child.badge && (
                            <span className="admin-sidebar__submenu-badge">
                              {child.badge}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* 用户信息和登出 */}
      <div className="admin-sidebar__footer">
        {user && (
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__user-avatar">
              <span className="admin-sidebar__user-initial">
                {user.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="admin-sidebar__user-info">
              <p className="admin-sidebar__user-name">
                {user.username}
              </p>
              <p className="admin-sidebar__user-role">
                {user.role === 'SUPER_ADMIN' ? '超级管理员' : '管理员'}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="admin-sidebar__logout"
        >
          <LogOut className="w-5 h-5 mr-3" />
          退出登录
        </button>
      </div>
    </div>
  )
}
