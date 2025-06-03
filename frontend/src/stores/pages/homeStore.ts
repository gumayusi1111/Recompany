/**
 * 首页状态管理Store
 * 使用全局Store工具函数创建
 * 
 * @author AI Assistant
 * @version 2.0.0
 */

import { createPageStore, createSelectors, createHooks } from '../utils/storeUtils'
import { fetchHomeData } from '../../app/home/data'
import { HomePageData } from '../../app/home/types'

/**
 * 创建首页Store
 */
export const useHomePageStore = createPageStore<HomePageData>(
  'home-page',
  fetchHomeData,
  {
    cache: {
      duration: 5 * 60 * 1000, // 5分钟缓存
      key: 'home-page-cache'
    },
    enableDevtools: true,
    enablePerformanceMonitoring: true
  }
)

/**
 * 首页选择器
 */
export const homePageSelectors = {
  ...createSelectors<HomePageData>(useHomePageStore),
  
  // 特定数据选择器
  seoData: (state: { data: HomePageData | null }) => state.data ? {
    seoMainTitle: state.data.seoMainTitle,
    seoSubTitle: state.data.seoSubTitle,
    seoKeywords: state.data.seoKeywords,
    seoDescription: state.data.seoDescription
  } : null,

  bannerData: (state: { data: HomePageData | null }) => state.data ? {
    slides: state.data.bannerSlides,
    config: state.data.pageConfig
  } : null,

  companyIntroData: (state: { data: HomePageData | null }) => state.data ? {
    title: state.data.companyIntroTitle,
    text: state.data.companyIntroText,
    image: state.data.companyIntroImage
  } : null,

  productData: (state: { data: HomePageData | null }) => state.data ? {
    products: state.data.featuredProducts,
    config: state.data.pageConfig,
    sectionTitle: state.data.productSectionTitle
  } : null,

  caseData: (state: { data: HomePageData | null }) => state.data ? {
    cases: state.data.featuredCases,
    config: state.data.pageConfig,
    sectionTitle: state.data.caseSectionTitle
  } : null
}

/**
 * 首页Hooks
 */
export const {
  useData: useHomePageData,
  useLoading: useHomePageLoading,
  useError: useHomePageError,
  useReady: useHomePageReady,
  useActions: useHomePageActions
} = createHooks<HomePageData>(useHomePageStore, homePageSelectors)

// 特定数据hooks
export const useHomeSeoData = () => useHomePageStore(homePageSelectors.seoData)
export const useHomeBannerData = () => useHomePageStore(homePageSelectors.bannerData)
export const useHomeCompanyIntroData = () => useHomePageStore(homePageSelectors.companyIntroData)
export const useHomeProductData = () => useHomePageStore(homePageSelectors.productData)
export const useHomeCaseData = () => useHomePageStore(homePageSelectors.caseData)
