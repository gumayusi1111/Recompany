'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ADMIN_NAVIGATION, getPageTitle, getBreadcrumb } from '@/config/routes'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Toaster } from 'react-hot-toast'
import { useAppStore, setPageMeta, initializeTheme } from '@/stores/appStore'
import { useAuthStore, initializeAuth } from '@/stores/authStore'
import NotificationContainer from '@/components/admin/NotificationContainer'
import * as Icons from 'lucide-react'

// 动态图标组件
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (Icons as any)[name] || Icons.Circle
  return <IconComponent className={className} />
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
    sidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    globalLoading
  } = useAppStore()
  const { isAuthenticated, isLoading } = useAuthStore()

  // 初始化应用
  useEffect(() => {
    initializeTheme()
    initializeAuth()
  }, [])

  // 更新页面元信息
  useEffect(() => {
    const title = getPageTitle(pathname)
    const breadcrumbs = getBreadcrumb(pathname).map(label => ({ label }))
    setPageMeta(title, breadcrumbs)
  }, [pathname])

  // 认证检查
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">正在加载...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // 重定向到登录页面将由middleware处理
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* 全局加载遮罩 */}
      {globalLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">处理中...</p>
          </div>
        </div>
      )}

      {/* Toast通知 */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* 移动端侧边栏遮罩 */}
      {(sidebarOpen || mobileSidebarOpen) && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => {
            setSidebarOpen(false)
            setMobileSidebarOpen(false)
          }}
        />
      )}

      {/* 侧边栏 */}
      <AdminSidebar
        isOpen={sidebarOpen || mobileSidebarOpen}
        onClose={() => {
          setSidebarOpen(false)
          setMobileSidebarOpen(false)
        }}
        navigation={ADMIN_NAVIGATION}
        currentPath={pathname}
      />

      {/* 主内容区域 */}
      <div className={`transition-all duration-200 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        {/* 顶部导航栏 */}
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle={getPageTitle(pathname)}
        />

        {/* 页面内容 */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>

      {/* 通知容器 */}
      <NotificationContainer />
    </div>
  )
}
