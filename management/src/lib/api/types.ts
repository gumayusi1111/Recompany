/**
 * API通用类型定义
 */

// 标准API响应格式
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// 用户相关类型
export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

// JWT载荷类型
export interface JwtPayload {
  id: number
  username: string
  email: string
  role: string
  iat: number
  exp: number
}

// 内容管理相关类型
export interface ContentItem {
  id: number
  title: string
  content: string
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  createdBy: number
}

// 产品类型
export interface Product extends ContentItem {
  category: string
  price?: number
  images: string[]
  specifications?: Record<string, any>
}

// 案例类型
export interface Case extends ContentItem {
  client: string
  location: string
  completedAt: string
  images: string[]
  tags: string[]
}

// 材料类型
export interface Material extends ContentItem {
  category: string
  specifications: Record<string, any>
  supplier?: string
  price?: number
}

// 新闻类型
export interface News extends ContentItem {
  summary: string
  author: string
  publishedAt: string
  tags: string[]
  featuredImage?: string
}

// 评价类型
export interface Testimonial {
  id: number
  clientName: string
  clientCompany?: string
  content: string
  rating: number
  projectId?: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

// 联系信息类型
export interface Contact {
  id: number
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  status: 'new' | 'replied' | 'closed'
  createdAt: string
  updatedAt: string
}

// 系统设置类型
export interface SystemSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  socialLinks: {
    wechat?: string
    weibo?: string
    linkedin?: string
  }
  seoSettings: {
    keywords: string[]
    description: string
  }
}

// 日志类型
export interface AccessLog {
  id: number
  ipAddress: string
  userAgent: string
  referer?: string
  path: string
  method: string
  statusCode: number
  responseTime: number
  sessionId?: string
  userId?: number
  createdAt: string
}

// 分页参数
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

// 过滤参数
export interface FilterParams {
  status?: string
  category?: string
  dateFrom?: string
  dateTo?: string
  [key: string]: any
}
