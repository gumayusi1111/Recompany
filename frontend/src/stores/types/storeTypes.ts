/**
 * 全局状态管理类型定义
 * 
 * @author AI Assistant
 * @version 2.0.0
 */

/**
 * 基础页面状态接口
 */
export interface BasePageState<T = unknown> {
  // 数据状态
  data: T | null
  loading: boolean
  error: string | null
  
  // 元数据
  lastFetchTime: number | null
  fetchCount: number
  
  // 操作方法
  fetchData: () => Promise<void>
  clearError: () => void
  reset: () => void
  updateData: (data: Partial<T>) => void
  
  // 缓存控制
  invalidateCache: () => void
  isCacheValid: () => boolean
}

/**
 * 全局状态接口
 */
export interface GlobalState {
  // 用户偏好
  theme: 'light' | 'dark' | 'system'
  language: 'zh' | 'en'
  
  // 应用状态
  isOnline: boolean
  isLoading: boolean
  
  // 导航状态
  currentPage: string
  breadcrumbs: Array<{ name: string; url: string }>
  
  // 操作方法
  setTheme: (theme: GlobalState['theme']) => void
  setLanguage: (language: GlobalState['language']) => void
  setOnlineStatus: (isOnline: boolean) => void
  setCurrentPage: (page: string) => void
  setBreadcrumbs: (breadcrumbs: GlobalState['breadcrumbs']) => void
}

/**
 * 缓存配置
 */
export interface CacheConfig {
  duration: number // 缓存持续时间（毫秒）
  key: string     // 缓存键名
}

/**
 * Store配置选项
 */
export interface StoreOptions {
  cache?: CacheConfig
  enableDevtools?: boolean
  enablePerformanceMonitoring?: boolean
}

/**
 * 选择器函数类型
 */
export type Selector<T, R> = (state: T) => R

/**
 * 状态更新函数类型
 */
export type StateUpdater<T> = (state: T) => Partial<T> | void
