import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { HomePageData } from './types'
import { fetchHomeData, handleDataError, retryWithDelay } from './data'
import { performanceMonitor } from './performance'

/**
 * 首页状态接口
 */
interface HomePageState {
  // 数据状态
  data: HomePageData | null
  loading: boolean
  error: string | null
  
  // 元数据
  lastFetchTime: number | null
  fetchCount: number
  
  // 操作方法
  fetchData: () => Promise<void>
  clearError: () => void
  reset: () => void
  
  // 数据更新方法
  updateData: (data: Partial<HomePageData>) => void
  
  // 缓存控制
  invalidateCache: () => void
  isCacheValid: () => boolean
}

/**
 * 初始状态
 */
const initialState = {
  data: null,
  loading: false,
  error: null,
  lastFetchTime: null,
  fetchCount: 0
}

/**
 * 缓存配置
 */
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟

/**
 * 创建首页状态管理Store
 * 
 * Zustand是什么？
 * Zustand是一个轻量级的状态管理库，具有以下优势：
 * 1. 简单易用：API简洁，学习成本低
 * 2. TypeScript友好：完整的类型支持
 * 3. 性能优秀：基于订阅模式，只更新相关组件
 * 4. 体积小：压缩后仅2.9kb
 * 5. 无样板代码：不需要providers、reducers等
 * 6. 支持中间件：devtools、persist等
 */
export const useHomePageStore = create<HomePageState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      /**
       * 获取首页数据
       * 支持缓存和重试机制
       */
      fetchData: async () => {
        const state = get()
        
        // 检查缓存是否有效
        if (state.isCacheValid() && state.data) {
          console.log('📦 使用缓存数据')
          return
        }

        set({ loading: true, error: null })

        try {
          console.log('🔄 开始获取首页数据...')

          // 使用性能监控包装数据获取
          const data = await performanceMonitor.measureDataLoad(
            retryWithDelay(() => fetchHomeData(), 2, 1500),
            'home-page-data'
          )

          set({
            data,
            loading: false,
            error: null,
            lastFetchTime: Date.now(),
            fetchCount: state.fetchCount + 1
          })

          console.log('✅ 首页数据获取成功')

          // 输出性能报告
          const report = performanceMonitor.getPerformanceReport()
          if (report) {
            console.log('📊 性能报告:', report)
            const recommendations = performanceMonitor.getPerformanceRecommendations()
            if (recommendations.length > 0) {
              console.log('💡 性能建议:', recommendations)
            }
          }
        } catch (err) {
          const errorMessage = handleDataError(err)
          console.error('❌ 首页数据获取失败:', err)
          
          set({
            loading: false,
            error: errorMessage,
            fetchCount: state.fetchCount + 1
          })
        }
      },

      /**
       * 清除错误状态
       */
      clearError: () => {
        set({ error: null })
      },

      /**
       * 重置状态
       */
      reset: () => {
        set(initialState)
      },

      /**
       * 更新数据（用于乐观更新）
       */
      updateData: (newData: Partial<HomePageData>) => {
        const currentData = get().data
        if (currentData) {
          set({
            data: { ...currentData, ...newData }
          })
        }
      },

      /**
       * 使缓存失效
       */
      invalidateCache: () => {
        set({ lastFetchTime: null })
      },

      /**
       * 检查缓存是否有效
       */
      isCacheValid: () => {
        const { lastFetchTime } = get()
        if (!lastFetchTime) return false
        return Date.now() - lastFetchTime < CACHE_DURATION
      }
    })),
    {
      name: 'home-page-store', // devtools中显示的名称
    }
  )
)

/**
 * 选择器函数 - 用于优化性能
 * 只有相关数据变化时才会重新渲染组件
 */
export const homePageSelectors = {
  // 基础数据选择器
  data: (state: HomePageState) => state.data,
  loading: (state: HomePageState) => state.loading,
  error: (state: HomePageState) => state.error,
  
  // 组合选择器
  isReady: (state: HomePageState) => !state.loading && !state.error && !!state.data,
  hasError: (state: HomePageState) => !!state.error,
  
  // 特定数据选择器
  seoData: (state: HomePageState) => state.data ? {
    seoMainTitle: state.data.seoMainTitle,
    seoSubTitle: state.data.seoSubTitle,
    seoKeywords: state.data.seoKeywords,
    seoDescription: state.data.seoDescription
  } : null,
  
  bannerData: (state: HomePageState) => state.data ? {
    slides: state.data.bannerSlides,
    config: state.data.pageConfig
  } : null,
  
  companyIntroData: (state: HomePageState) => state.data ? {
    title: state.data.companyIntroTitle,
    text: state.data.companyIntroText,
    image: state.data.companyIntroImage
  } : null,
  
  productData: (state: HomePageState) => state.data ? {
    products: state.data.featuredProducts,
    config: state.data.pageConfig,
    sectionTitle: state.data.productSectionTitle
  } : null,
  
  caseData: (state: HomePageState) => state.data ? {
    cases: state.data.featuredCases,
    config: state.data.pageConfig,
    sectionTitle: state.data.caseSectionTitle
  } : null,
  
  // 元数据选择器
  metadata: (state: HomePageState) => ({
    lastFetchTime: state.lastFetchTime,
    fetchCount: state.fetchCount,
    cacheValid: state.isCacheValid()
  })
}

/**
 * Hook工具函数
 */
export const useHomePageData = () => useHomePageStore(homePageSelectors.data)
export const useHomePageLoading = () => useHomePageStore(homePageSelectors.loading)
export const useHomePageError = () => useHomePageStore(homePageSelectors.error)
export const useHomePageReady = () => useHomePageStore(homePageSelectors.isReady)

// 特定数据hooks
export const useHomeSeoData = () => useHomePageStore(homePageSelectors.seoData)
export const useHomeBannerData = () => useHomePageStore(homePageSelectors.bannerData)
export const useHomeCompanyIntroData = () => useHomePageStore(homePageSelectors.companyIntroData)
export const useHomeProductData = () => useHomePageStore(homePageSelectors.productData)
export const useHomeCaseData = () => useHomePageStore(homePageSelectors.caseData)

// 操作hooks
export const useHomePageActions = () => {
  const fetchData = useHomePageStore(state => state.fetchData)
  const clearError = useHomePageStore(state => state.clearError)
  const reset = useHomePageStore(state => state.reset)
  const updateData = useHomePageStore(state => state.updateData)
  const invalidateCache = useHomePageStore(state => state.invalidateCache)
  
  return {
    fetchData,
    clearError,
    reset,
    updateData,
    invalidateCache
  }
}
