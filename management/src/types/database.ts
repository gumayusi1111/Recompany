/**
 * 数据库类型定义 - 管理系统扩展版本
 * 基于Prisma schema生成的类型，包含管理系统特有的类型
 */

// ===== 基础数据类型（与前端共享） =====

// 轮播图/Hero Section
export interface HeroSlide {
  id: string
  title: string           // 主标题 (H1)
  subtitle: string        // 副标题
  backgroundImage: string // 背景图片URL
  order: number          // 显示顺序
  isActive: boolean      // 是否启用
  createdAt: Date
  updatedAt: Date
}

// SEO H1标题区域
export interface SeoTitleSection {
  id: string
  mainTitle: string      // 主标题
  subtitle: string       // 副标题
  isActive: boolean      // 是否启用
  createdAt: Date
  updatedAt: Date
}

// 公司介绍部分
export interface CompanyIntroSection {
  id: string
  title: string          // 标题
  content: string        // 左侧文字内容 (支持富文本)
  image: string          // 右侧图片URL
  imageAlt: string       // 图片alt文本
  isActive: boolean      // 是否启用
  createdAt: Date
  updatedAt: Date
}

// 产品中心
export interface Product {
  id: string
  name: string           // 产品名称 (会成为案例中的type字段)
  description: string    // 产品描述
  briefDescription: string // 简短描述 (用于首页预览)
  image: string          // 产品图片
  imageAlt: string       // 图片alt文本
  category: string       // 产品分类
  specifications?: string // 产品规格 (可选，详情页使用)
  features?: string[]    // 产品特点 (可选，详情页使用)
  applications?: string  // 应用场景 (可选，详情页使用)
  isActive: boolean      // 是否启用
  isFeatured: boolean    // 是否在首页展示
  order: number          // 显示顺序
  createdAt: Date
  updatedAt: Date
  // 关联数据
  cases?: EngineeringCase[]
}

// 工程案例
export interface EngineeringCase {
  id: string
  title: string          // 案例标题
  clientName: string     // 客户名称
  type: string           // 案例类型 (对应产品名称)
  area: number           // 面积 (平方米)
  location?: string      // 项目地点 (可选)
  description: string    // 案例描述
  briefDescription: string // 简短描述 (用于首页预览)
  image: string          // 主图片
  imageAlt: string       // 图片alt文本
  gallery?: string[]     // 图片集 (可选，详情页使用)
  completionDate?: Date  // 完工日期 (可选)
  projectDuration?: number // 项目周期 (天数，可选)
  challenges?: string    // 项目挑战 (可选，详情页使用)
  solutions?: string     // 解决方案 (可选，详情页使用)
  isActive: boolean      // 是否启用
  isFeatured: boolean    // 是否在首页展示
  order: number          // 显示顺序
  createdAt: Date
  updatedAt: Date
  // 关联数据
  product?: Product
  productId?: string
}

// 首页配置
export interface HomepageConfig {
  id: string
  // Hero Section配置
  heroSectionTitle?: string
  heroSectionSubtitle?: string
  // 产品预览配置
  productsPreviewTitle: string
  productsPreviewSubtitle?: string
  productsPreviewCount: number // 显示多少个产品
  // 案例预览配置
  casesPreviewTitle: string
  casesPreviewSubtitle?: string
  casesPreviewCount: number // 显示多少个案例
  // 其他配置
  isActive: boolean
  updatedAt: Date
}

// ===== 管理系统特有类型 =====

// 管理员用户
export interface AdminUser {
  id: string
  username: string
  email: string
  passwordHash: string
  role: AdminRole
  lastLoginAt?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  // 关联数据
  assignedRequests?: UserRequest[]
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN'
}

// 用户请求
export interface UserRequest {
  id: string
  type: RequestType
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  productInterest?: string // 关联Product.name
  status: RequestStatus
  adminNotes?: string
  assignedTo?: string // 关联AdminUser.id
  priority: Priority
  createdAt: Date
  updatedAt: Date
  // 关联数据
  assignedAdmin?: AdminUser
}

export enum RequestType {
  CONTACT = 'CONTACT',
  QUOTE = 'QUOTE',
  CONSULTATION = 'CONSULTATION'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

// 访问日志
export interface AccessLog {
  id: string
  ipAddress: string
  userAgent: string
  referer?: string
  path: string
  method: string
  statusCode: number
  responseTime: number // 响应时间(ms)
  sessionId?: string
  createdAt: Date
}

// 系统设置
export interface SystemSetting {
  id: string
  key: string
  value: string
  type: string // string, number, boolean, json
  category: string
  createdAt: Date
  updatedAt: Date
}

// ===== API响应类型 =====

// 通用API响应
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 分页响应
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// 首页数据响应
export interface HomepageData {
  heroSlides: HeroSlide[]
  seoTitle: SeoTitleSection | null
  companyIntro: CompanyIntroSection | null
  featuredProducts: Product[]
  featuredCases: EngineeringCase[]
  config: HomepageConfig | null
}

// 仪表盘统计数据
export interface DashboardStats {
  // 访问统计
  visitors: {
    today: number
    thisWeek: number
    thisMonth: number
    trend: number // 相比上期的变化百分比
  }
  // 请求统计
  requests: {
    pending: number
    processing: number
    completed: number
    total: number
    urgent: number // 高优先级请求数
  }
  // 内容统计
  content: {
    products: {
      total: number
      active: number
      featured: number
    }
    cases: {
      total: number
      active: number
      featured: number
    }
    heroSlides: {
      total: number
      active: number
    }
  }
  // 系统健康
  system: {
    uptime: number
    responseTime: number
    errorRate: number
  }
}

// 表单数据类型
export interface CreateHeroSlideData {
  title: string
  subtitle: string
  backgroundImage: string
  order: number
  isActive: boolean
}

export interface UpdateHeroSlideData extends Partial<CreateHeroSlideData> {
  id: string
}

export interface CreateProductData {
  name: string
  description: string
  briefDescription: string
  image: string
  imageAlt: string
  category: string
  specifications?: string
  features?: string[]
  applications?: string
  isActive: boolean
  isFeatured: boolean
  order: number
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string
}

export interface CreateCaseData {
  title: string
  clientName: string
  type: string
  area: number
  location?: string
  description: string
  briefDescription: string
  image: string
  imageAlt: string
  gallery?: string[]
  completionDate?: Date
  projectDuration?: number
  challenges?: string
  solutions?: string
  isActive: boolean
  isFeatured: boolean
  order: number
  productId?: string
}

export interface UpdateCaseData extends Partial<CreateCaseData> {
  id: string
}
