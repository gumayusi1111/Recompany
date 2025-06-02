// ===== 共享数据类型定义 =====

/**
 * 轮播图数据类型
 */
export interface BannerSlide {
  id: number
  mainTitle: string
  subTitle: string
  imagePath: string
  sortOrder: number
}

/**
 * 产品数据类型
 */
export interface Product {
  id: number
  name: string
  description: string
  imagePath: string
  sortOrder: number
}

/**
 * 案例数据类型
 */
export interface Case {
  id: number
  name: string
  description: string
  imagePath: string
  clientName: string
  sortOrder: number
}

/**
 * 页面配置类型
 */
export interface PageConfig {
  theme: string
  layout: string
  showBanner: boolean
  showProducts: boolean
  showCases: boolean
}

// ===== 核心组件Props类型定义 =====
// 注意：具体组件的Props类型已移至各组件的types.ts文件中
// 这里只保留跨组件共享的核心Props类型

/**
 * 基础组件Props接口
 * 所有组件Props的基础接口
 */
export interface BaseComponentProps {
  className?: string
  'data-testid'?: string
}

/**
 * 配置化组件Props接口
 * 需要页面配置的组件的基础接口
 */
export interface ConfigurableComponentProps extends BaseComponentProps {
  config: PageConfig
}

// ===== 页面数据类型定义 =====

/**
 * 首页完整数据类型
 */
export interface HomePageData {
  id: string
  seoMainTitle: string
  seoSubTitle: string
  seoKeywords: string
  seoDescription: string
  companyIntroTitle: string
  companyIntroText: string
  companyIntroImage: string
  bannerSlides: BannerSlide[]
  productSectionTitle: string
  featuredProducts: Product[]
  caseSectionTitle: string
  featuredCases: Case[]
  pageConfig: PageConfig
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ===== API响应类型定义 =====

/**
 * API响应基础类型
 */
export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

/**
 * 首页API响应类型
 */
export type HomeApiResponse = ApiResponse<HomePageData>

// ===== 状态管理类型定义 =====

/**
 * 页面加载状态类型
 */
export interface PageLoadingState {
  loading: boolean
  error: string | null
  data: HomePageData | null
}
