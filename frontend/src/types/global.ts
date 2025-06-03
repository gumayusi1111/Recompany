/**
 * 全局类型定义
 * 统一管理应用级别的类型
 * 
 * @author AI Assistant
 * @version 2.0.0
 */

/**
 * 基础数据类型
 */
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

/**
 * API响应基础类型
 */
export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
  timestamp?: number
}

/**
 * 分页数据类型
 */
export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 分页API响应类型
 */
export type PaginatedApiResponse<T> = ApiResponse<PaginatedData<T>>

/**
 * 页面配置类型
 */
export interface PageConfig {
  theme: string
  layout: string
  showBanner: boolean
  showProducts: boolean
  showCases: boolean
  [key: string]: any
}

/**
 * SEO数据类型
 */
export interface SEOData {
  title: string
  description: string
  keywords: string
  image?: string
  url?: string
  type?: string
}

/**
 * 图片数据类型
 */
export interface ImageData {
  id: number
  url: string
  alt: string
  width?: number
  height?: number
  placeholder?: string
}

/**
 * 轮播图数据类型
 */
export interface BannerSlide {
  id: number
  mainTitle: string
  subTitle: string
  imagePath: string
  sortOrder: number
  linkUrl?: string
  isActive?: boolean
}

/**
 * 产品数据类型
 */
export interface Product extends BaseEntity {
  name: string
  description: string
  imagePath: string
  sortOrder: number
  category?: string
  price?: number
  features?: string[]
  specifications?: Record<string, any>
}

/**
 * 案例数据类型
 */
export interface Case extends BaseEntity {
  name: string
  description: string
  imagePath: string
  clientName: string
  sortOrder: number
  category?: string
  tags?: string[]
  projectDate?: string
  projectUrl?: string
}

/**
 * 新闻文章数据类型
 */
export interface Article extends BaseEntity {
  title: string
  summary: string
  content: string
  imagePath: string
  author: string
  publishDate: string
  category: string
  tags: string[]
  viewCount: number
  isPublished: boolean
}

/**
 * 联系信息类型
 */
export interface ContactInfo {
  name: string
  email: string
  phone: string
  company?: string
  message: string
  subject?: string
}

/**
 * 用户数据类型
 */
export interface User extends BaseEntity {
  username: string
  email: string
  avatar?: string
  role: 'admin' | 'editor' | 'viewer'
  permissions: string[]
  lastLoginAt?: string
}

/**
 * 错误类型
 */
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: number
}

/**
 * 加载状态类型
 */
export interface LoadingState {
  loading: boolean
  error: string | null
}

/**
 * 页面加载状态类型
 */
export interface PageLoadingState<T = unknown> extends LoadingState {
  data: T | null
}

/**
 * 表单字段类型
 */
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio'
  required?: boolean
  placeholder?: string
  options?: Array<{ label: string; value: string }>
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
  }
}

/**
 * 表单配置类型
 */
export interface FormConfig {
  fields: FormField[]
  submitText?: string
  resetText?: string
  layout?: 'vertical' | 'horizontal'
  validation?: boolean
}

/**
 * 导航菜单项类型
 */
export interface MenuItem {
  id: string
  label: string
  url: string
  icon?: string
  children?: MenuItem[]
  isActive?: boolean
  isExternal?: boolean
}

/**
 * 面包屑项类型
 */
export interface BreadcrumbItem {
  name: string
  url: string
  isActive?: boolean
}

/**
 * 主题配置类型
 */
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  fontSize: 'small' | 'medium' | 'large'
}

/**
 * 语言配置类型
 */
export interface LanguageConfig {
  code: string
  name: string
  flag: string
  isRTL?: boolean
}

/**
 * 通用组件Props基础类型
 */
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  'data-testid'?: string
}

/**
 * 配置化组件Props类型
 */
export interface ConfigurableComponentProps extends BaseComponentProps {
  config: PageConfig
}

/**
 * 响应式配置类型
 */
export interface ResponsiveConfig {
  mobile: any
  tablet: any
  desktop: any
}

/**
 * 性能指标类型
 */
export interface PerformanceMetrics {
  fcp?: number
  lcp?: number
  fid?: number
  cls?: number
  ttfb?: number
  loadTime?: number
  bundleSize?: number
}

/**
 * 分析数据类型
 */
export interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  averageSessionDuration: number
  topPages: Array<{ url: string; views: number }>
  topReferrers: Array<{ source: string; visits: number }>
}
