/**
 * 应用全局状态管理
 * 管理主题、侧边栏、通知等全局状态
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 主题类型
export type Theme = 'light' | 'dark' | 'system'

// 通知类型
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// 应用状态类型
interface AppState {
  // 主题设置
  theme: Theme
  setTheme: (theme: Theme) => void
  
  // 侧边栏状态
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  
  // 移动端侧边栏
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
  toggleMobileSidebar: () => void
  
  // 通知系统
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  // 加载状态
  globalLoading: boolean
  setGlobalLoading: (loading: boolean) => void
  
  // 页面标题
  pageTitle: string
  setPageTitle: (title: string) => void
  
  // 面包屑
  breadcrumbs: Array<{ label: string; href?: string }>
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href?: string }>) => void
  
  // 搜索状态
  globalSearch: string
  setGlobalSearch: (search: string) => void
  
  // 刷新标志
  refreshTrigger: number
  triggerRefresh: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 主题设置
      theme: 'system',
      setTheme: (theme) => {
        set({ theme })
        
        // 应用主题到DOM
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement
          root.classList.remove('light', 'dark')
          
          if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            root.classList.add(systemTheme)
          } else {
            root.classList.add(theme)
          }
        }
      },
      
      // 侧边栏状态
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // 移动端侧边栏
      mobileSidebarOpen: false,
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      toggleMobileSidebar: () => set(state => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
      
      // 通知系统
      notifications: [],
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newNotification: Notification = {
          id,
          duration: 5000,
          ...notification
        }
        
        set(state => ({
          notifications: [...state.notifications, newNotification]
        }))
        
        // 自动移除通知
        if (newNotification.duration && newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id)
          }, newNotification.duration)
        }
      },
      removeNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },
      clearNotifications: () => set({ notifications: [] }),
      
      // 加载状态
      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
      
      // 页面标题
      pageTitle: '管理系统',
      setPageTitle: (title) => {
        set({ pageTitle: title })
        
        // 更新浏览器标题
        if (typeof window !== 'undefined') {
          document.title = `${title} - 亚豪膜结构管理系统`
        }
      },
      
      // 面包屑
      breadcrumbs: [],
      setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
      
      // 搜索状态
      globalSearch: '',
      setGlobalSearch: (search) => set({ globalSearch: search }),
      
      // 刷新标志
      refreshTrigger: 0,
      triggerRefresh: () => set(state => ({ refreshTrigger: state.refreshTrigger + 1 }))
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed
      })
    }
  )
)

// 主题初始化
export const initializeTheme = () => {
  const { theme, setTheme } = useAppStore.getState()
  setTheme(theme) // 触发主题应用
  
  // 监听系统主题变化
  if (typeof window !== 'undefined' && theme === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (useAppStore.getState().theme === 'system') {
        setTheme('system') // 重新应用系统主题
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }
}

// 通知工具函数
export const notify = {
  success: (title: string, message?: string) => {
    useAppStore.getState().addNotification({
      type: 'success',
      title,
      message
    })
  },
  error: (title: string, message?: string) => {
    useAppStore.getState().addNotification({
      type: 'error',
      title,
      message,
      duration: 8000 // 错误通知显示更久
    })
  },
  warning: (title: string, message?: string) => {
    useAppStore.getState().addNotification({
      type: 'warning',
      title,
      message
    })
  },
  info: (title: string, message?: string) => {
    useAppStore.getState().addNotification({
      type: 'info',
      title,
      message
    })
  }
}

// 页面设置工具函数
export const setPageMeta = (title: string, breadcrumbs?: Array<{ label: string; href?: string }>) => {
  const { setPageTitle, setBreadcrumbs } = useAppStore.getState()
  setPageTitle(title)
  if (breadcrumbs) {
    setBreadcrumbs(breadcrumbs)
  }
}

export default useAppStore
