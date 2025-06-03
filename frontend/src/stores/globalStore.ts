/**
 * 全局状态管理Store
 * 管理应用级别的全局状态
 * 
 * @author AI Assistant
 * @version 2.0.0
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { GlobalState } from './types/storeTypes'

/**
 * 初始状态
 */
const initialState = {
  theme: 'system' as const,
  language: 'zh' as const,
  isOnline: true,
  isLoading: false,
  currentPage: '',
  breadcrumbs: []
}

/**
 * 全局状态Store
 */
export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setTheme: (theme) => {
          set({ theme })

          // 应用主题到DOM
          if (typeof window !== 'undefined') {
            const root = window.document.documentElement
            root.classList.remove('light', 'dark', 'theme-light', 'theme-dark')

            if (theme === 'system') {
              const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
              root.classList.add(systemTheme, `theme-${systemTheme}`)
            } else {
              root.classList.add(theme, `theme-${theme}`)
            }

            // 添加主题切换动画类
            root.classList.add('theme-transitioning')
            setTimeout(() => {
              root.classList.remove('theme-transitioning')
            }, 300)
          }
        },

        setLanguage: (language) => {
          set({ language })
          
          // 更新HTML lang属性
          if (typeof window !== 'undefined') {
            document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
          }
        },

        setOnlineStatus: (isOnline) => {
          set({ isOnline })
        },

        setCurrentPage: (page) => {
          set({ currentPage: page })
        },

        setBreadcrumbs: (breadcrumbs) => {
          set({ breadcrumbs })
        }
      }),
      {
        name: 'global-store',
        partialize: (state) => ({
          theme: state.theme,
          language: state.language
        })
      }
    ),
    {
      name: 'global-store'
    }
  )
)

/**
 * 全局状态选择器
 */
export const globalSelectors = {
  theme: (state: GlobalState) => state.theme,
  language: (state: GlobalState) => state.language,
  isOnline: (state: GlobalState) => state.isOnline,
  isLoading: (state: GlobalState) => state.isLoading,
  currentPage: (state: GlobalState) => state.currentPage,
  breadcrumbs: (state: GlobalState) => state.breadcrumbs,
  
  // 组合选择器
  isDarkMode: (state: GlobalState) => {
    if (state.theme === 'dark') return true
    if (state.theme === 'light') return false
    
    // system主题时检查系统偏好
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  },
  
  isZhLanguage: (state: GlobalState) => state.language === 'zh'
}

/**
 * 全局状态Hooks
 */
export const useTheme = () => useGlobalStore(globalSelectors.theme)
export const useLanguage = () => useGlobalStore(globalSelectors.language)
export const useOnlineStatus = () => useGlobalStore(globalSelectors.isOnline)
export const useCurrentPage = () => useGlobalStore(globalSelectors.currentPage)
export const useBreadcrumbs = () => useGlobalStore(globalSelectors.breadcrumbs)
export const useIsDarkMode = () => useGlobalStore(globalSelectors.isDarkMode)

/**
 * 全局操作Hooks
 */
export const useGlobalActions = () => {
  const setTheme = useGlobalStore(state => state.setTheme)
  const setLanguage = useGlobalStore(state => state.setLanguage)
  const setOnlineStatus = useGlobalStore(state => state.setOnlineStatus)
  const setCurrentPage = useGlobalStore(state => state.setCurrentPage)
  const setBreadcrumbs = useGlobalStore(state => state.setBreadcrumbs)
  
  return {
    setTheme,
    setLanguage,
    setOnlineStatus,
    setCurrentPage,
    setBreadcrumbs
  }
}

/**
 * 初始化全局状态
 */
export function initializeGlobalStore() {
  const store = useGlobalStore.getState()
  
  // 监听在线状态
  if (typeof window !== 'undefined') {
    const updateOnlineStatus = () => {
      store.setOnlineStatus(navigator.onLine)
    }
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    // 初始化在线状态
    updateOnlineStatus()
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = () => {
      if (store.theme === 'system') {
        store.setTheme('system') // 触发重新应用主题
      }
    }
    
    mediaQuery.addEventListener('change', handleThemeChange)
    
    // 初始化主题
    store.setTheme(store.theme)
    
    // 清理函数
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      mediaQuery.removeEventListener('change', handleThemeChange)
    }
  }
}
