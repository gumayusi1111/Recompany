/**
 * API端点配置文件
 * 统一管理所有API端点，确保前后端一致性
 */

// API基础配置
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const

// 管理系统API端点
export const ADMIN_API = {
  // 认证相关
  AUTH: {
    LOGIN: '/api/admin/auth/login',
    LOGOUT: '/api/admin/auth/logout',
    ME: '/api/admin/auth/me',
    REFRESH: '/api/admin/auth/refresh',
    CHANGE_PASSWORD: '/api/admin/auth/change-password',
  },
  
  // 仪表盘
  DASHBOARD: {
    STATS: '/api/admin/dashboard/stats',
    RECENT_ACTIVITIES: '/api/admin/dashboard/activities',
    SYSTEM_INFO: '/api/admin/dashboard/system',
  },
  
  // 首页管理
  HOME: {
    HERO_SLIDES: '/api/admin/home/hero-slides',
    SEO_TITLE: '/api/admin/home/seo-title',
    COMPANY_INTRO: '/api/admin/home/company-intro',
    CONFIG: '/api/admin/home/config',
  },
  
  // 产品管理
  PRODUCTS: {
    LIST: '/api/admin/products',
    CREATE: '/api/admin/products',
    UPDATE: (id: string) => `/api/admin/products/${id}`,
    DELETE: (id: string) => `/api/admin/products/${id}`,
    BULK: '/api/admin/products/bulk',
    CATEGORIES: '/api/admin/products/categories',
  },
  
  // 案例管理
  CASES: {
    LIST: '/api/admin/cases',
    CREATE: '/api/admin/cases',
    UPDATE: (id: string) => `/api/admin/cases/${id}`,
    DELETE: (id: string) => `/api/admin/cases/${id}`,
    BULK: '/api/admin/cases/bulk',
  },
  
  // 材料管理
  MATERIALS: {
    LIST: '/api/admin/materials',
    CREATE: '/api/admin/materials',
    UPDATE: (id: string) => `/api/admin/materials/${id}`,
    DELETE: (id: string) => `/api/admin/materials/${id}`,
    BULK: '/api/admin/materials/bulk',
    CATEGORIES: '/api/admin/materials/categories',
  },
  
  // 评价管理
  REVIEWS: {
    LIST: '/api/admin/reviews',
    CREATE: '/api/admin/reviews',
    UPDATE: (id: string) => `/api/admin/reviews/${id}`,
    DELETE: (id: string) => `/api/admin/reviews/${id}`,
    BULK: '/api/admin/reviews/bulk',
    APPROVE: (id: string) => `/api/admin/reviews/${id}/approve`,
  },
  
  // 新闻管理
  NEWS: {
    LIST: '/api/admin/news',
    CREATE: '/api/admin/news',
    UPDATE: (id: string) => `/api/admin/news/${id}`,
    DELETE: (id: string) => `/api/admin/news/${id}`,
    BULK: '/api/admin/news/bulk',
    PUBLISH: (id: string) => `/api/admin/news/${id}/publish`,
  },
  
  // 联系管理
  CONTACT: {
    INFO: '/api/admin/contact/info',
    UPDATE: '/api/admin/contact/info',
    LOCATIONS: '/api/admin/contact/locations',
  },
  
  // 关于管理
  ABOUT: {
    SECTIONS: '/api/admin/about/sections',
    UPDATE: '/api/admin/about/sections',
    HISTORY: '/api/admin/about/history',
    TEAM: '/api/admin/about/team',
  },
  
  // 用户请求
  REQUESTS: {
    LIST: '/api/admin/requests',
    UPDATE: (id: string) => `/api/admin/requests/${id}`,
    DELETE: (id: string) => `/api/admin/requests/${id}`,
    BULK: '/api/admin/requests/bulk',
    ASSIGN: (id: string) => `/api/admin/requests/${id}/assign`,
    REPLY: (id: string) => `/api/admin/requests/${id}/reply`,
  },
  
  // 系统设置
  SETTINGS: {
    GENERAL: '/api/admin/settings/general',
    USERS: '/api/admin/settings/users',
    LOGS: '/api/admin/settings/logs',
    BACKUP: '/api/admin/settings/backup',
  },
  
  // 文件上传
  UPLOAD: {
    IMAGE: '/api/admin/upload/image',
    FILE: '/api/admin/upload/file',
    BULK: '/api/admin/upload/bulk',
  },
} as const

// 公开API端点
export const PUBLIC_API = {
  // 用户请求
  REQUEST: {
    SUBMIT: '/api/public/request/submit',
    CONTACT: '/api/public/request/contact',
  },
  
  // 公开数据
  DATA: {
    PRODUCTS: '/api/public/data/products',
    CASES: '/api/public/data/cases',
    NEWS: '/api/public/data/news',
    CONTACT: '/api/public/data/contact',
  },
} as const

// HTTP方法枚举
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
}

// 分页响应类型
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// 批量操作响应类型
export interface BulkResponse extends ApiResponse {
  affected: number
  failed: number
  errors?: string[]
}

// 上传响应类型
export interface UploadResponse extends ApiResponse {
  data: {
    url: string
    filename: string
    size: number
    type: string
  }
}

// API错误类型
export interface ApiError {
  code: string
  message: string
  details?: any
  timestamp: string
}

// 请求配置类型
export interface RequestConfig {
  method: HttpMethod
  headers?: Record<string, string>
  body?: any
  timeout?: number
  retries?: number
}

// 分页参数类型
export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
  filter?: Record<string, any>
}

// 工具函数
export function buildApiUrl(endpoint: string, params?: Record<string, any>): string {
  const url = new URL(endpoint, API_CONFIG.BASE_URL || window.location.origin)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  
  return url.toString()
}

export function getApiEndpoint(path: string): string {
  return `${API_CONFIG.BASE_URL}${path}`
}

export function isApiError(response: any): response is ApiError {
  return response && typeof response.code === 'string' && typeof response.message === 'string'
}

export function createPaginationParams(params: PaginationParams): URLSearchParams {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'filter' && typeof value === 'object') {
        Object.entries(value).forEach(([filterKey, filterValue]) => {
          if (filterValue !== undefined && filterValue !== null) {
            searchParams.append(`filter[${filterKey}]`, String(filterValue))
          }
        })
      } else {
        searchParams.append(key, String(value))
      }
    }
  })
  
  return searchParams
}
