/**
 * Store工具函数
 * 提供通用的状态管理工具
 * 
 * @author AI Assistant
 * @version 2.0.0
 */

import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { BasePageState, StoreOptions, CacheConfig } from '../types/storeTypes'
import { performanceMonitor } from '../../lib/performance/monitor'

/**
 * 默认缓存配置
 */
const DEFAULT_CACHE_CONFIG: CacheConfig = {
  duration: 5 * 60 * 1000, // 5分钟
  key: 'default'
}

/**
 * 创建基础页面Store的工厂函数
 */
export function createPageStore<T>(
  storeName: string,
  fetchDataFn: () => Promise<T>,
  options: StoreOptions = {}
) {
  const cacheConfig = { ...DEFAULT_CACHE_CONFIG, ...options.cache }
  const enableDevtools = options.enableDevtools ?? process.env.NODE_ENV === 'development'
  const enablePerformanceMonitoring = options.enablePerformanceMonitoring ?? true

  const initialState = {
    data: null,
    loading: false,
    error: null,
    lastFetchTime: null,
    fetchCount: 0
  }

  const store = create<BasePageState<T>>()(
    devtools(
      subscribeWithSelector((set, get) => ({
        ...initialState,

        fetchData: async () => {
          const state = get()
          
          // 检查缓存是否有效
          if (state.isCacheValid() && state.data) {
            console.log(`📦 [${storeName}] 使用缓存数据`)
            return
          }

          set({ loading: true, error: null })

          try {
            console.log(`🔄 [${storeName}] 开始获取数据...`)
            
            // 使用性能监控包装数据获取
            const data = enablePerformanceMonitoring
              ? await performanceMonitor.measureDataLoad(fetchDataFn(), `${storeName}-data`)
              : await fetchDataFn()
            
            set({
              data,
              loading: false,
              error: null,
              lastFetchTime: Date.now(),
              fetchCount: state.fetchCount + 1
            })
            
            console.log(`✅ [${storeName}] 数据获取成功`)
            
            // 输出性能报告
            if (enablePerformanceMonitoring) {
              const report = performanceMonitor.getPerformanceReport()
              if (report) {
                console.log(`📊 [${storeName}] 性能报告:`, report)
              }
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '数据获取失败'
            console.error(`❌ [${storeName}] 数据获取失败:`, err)
            
            set({
              loading: false,
              error: errorMessage,
              fetchCount: state.fetchCount + 1
            })
          }
        },

        clearError: () => {
          set({ error: null })
        },

        reset: () => {
          set(initialState)
        },

        updateData: (newData: Partial<T>) => {
          const currentData = get().data
          if (currentData) {
            set({
              data: { ...currentData, ...newData }
            })
          }
        },

        invalidateCache: () => {
          set({ lastFetchTime: null })
        },

        isCacheValid: () => {
          const { lastFetchTime } = get()
          if (!lastFetchTime) return false
          return Date.now() - lastFetchTime < cacheConfig.duration
        }
      })),
      {
        name: `${storeName}-store`,
        enabled: enableDevtools
      }
    )
  )

  return store
}

/**
 * 创建选择器工具函数
 */
export function createSelectors<T>(store: any) {
  return {
    // 基础选择器
    data: (state: BasePageState<T>) => state.data,
    loading: (state: BasePageState<T>) => state.loading,
    error: (state: BasePageState<T>) => state.error,
    
    // 组合选择器
    isReady: (state: BasePageState<T>) => !state.loading && !state.error && !!state.data,
    hasError: (state: BasePageState<T>) => !!state.error,
    isEmpty: (state: BasePageState<T>) => !state.loading && !state.error && !state.data,
    
    // 元数据选择器
    metadata: (state: BasePageState<T>) => ({
      lastFetchTime: state.lastFetchTime,
      fetchCount: state.fetchCount,
      cacheValid: state.isCacheValid()
    })
  }
}

/**
 * 创建Hook工具函数
 */
export function createHooks<T>(store: any, selectors: any) {
  return {
    // 基础hooks
    useData: () => store(selectors.data),
    useLoading: () => store(selectors.loading),
    useError: () => store(selectors.error),
    useReady: () => store(selectors.isReady),
    
    // 操作hooks
    useActions: () => {
      const fetchData = store((state: BasePageState<T>) => state.fetchData)
      const clearError = store((state: BasePageState<T>) => state.clearError)
      const reset = store((state: BasePageState<T>) => state.reset)
      const updateData = store((state: BasePageState<T>) => state.updateData)
      const invalidateCache = store((state: BasePageState<T>) => state.invalidateCache)
      
      return {
        fetchData,
        clearError,
        reset,
        updateData,
        invalidateCache
      }
    }
  }
}

/**
 * 批量状态更新工具
 */
export function batchUpdate<T>(
  store: any,
  updates: Array<(state: T) => Partial<T> | void>
) {
  store.setState((state: T) => {
    let newState = { ...state }
    
    updates.forEach(update => {
      const result = update(newState)
      if (result) {
        newState = { ...newState, ...result }
      }
    })
    
    return newState
  })
}

/**
 * 状态持久化工具
 */
export function createPersistConfig(key: string) {
  return {
    name: key,
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    partialize: (state: any) => ({
      // 只持久化必要的状态
      data: state.data,
      lastFetchTime: state.lastFetchTime
    })
  }
}
