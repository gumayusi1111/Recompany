/**
 * 管理系统布局组件
 */

'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AdminSidebar } from '../AdminSidebar'
import { AdminHeader } from '../AdminHeader'
import { ADMIN_NAVIGATION, getPageTitle } from '@/config/routes'
import './AdminLayout.css'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  // 在大屏幕上自动关闭移动端侧边栏
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 路由变化时关闭移动端侧边栏
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="admin-layout">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div 
          className="admin-layout__overlay lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={ADMIN_NAVIGATION}
        currentPath={pathname}
      />

      {/* 主内容区域 */}
      <div className="admin-layout__main">
        {/* 头部 */}
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle={pageTitle}
        />

        {/* 页面内容 */}
        <main className="admin-layout__content">
          <div className="admin-layout__container">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
