/**
 * 全局配置管理
 * 统一管理应用级别的配置
 * 
 * @author AI Assistant
 * @version 2.0.0
 */

/**
 * API配置
 */
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  retryAttempts: 2,
  retryDelay: 1500,
  
  endpoints: {
    home: '/api/home',
    about: '/api/about',
    products: '/api/products',
    cases: '/api/cases',
    news: '/api/news',
    contact: '/api/contact'
  }
} as const

/**
 * UI文本配置
 */
export const uiTextConfig = {
  // 通用文本
  loading: '正在加载数据，请稍候... 🚀',
  loadingFailed: '加载失败',
  noData: '暂无数据',
  reload: '重新加载',
  retry: '重试',
  cancel: '取消',
  confirm: '确认',
  
  // 状态文本
  statusNormal: '✅ 正常',
  statusActive: '激活',
  statusInactive: '未激活',
  statusOnline: '在线',
  statusOffline: '离线',
  
  // 导航文本
  home: '首页',
  about: '关于我们',
  products: '产品中心',
  cases: '成功案例',
  news: '新闻资讯',
  contact: '联系我们',
  
  // 数据标签
  sortOrder: '排序',
  image: '图片',
  client: '客户',
  dataSource: '数据来源',
  apiEndpoint: 'API端点',
  dataTable: '数据表',
  connectionStatus: '连接状态',
  
  // 错误信息
  networkError: '网络连接错误',
  serverError: '服务器错误',
  dataError: '数据格式错误',
  permissionError: '权限不足'
} as const

/**
 * 样式配置
 */
export const styleConfig = {
  // 颜色配置
  colors: {
    primary: '#2563eb',
    secondary: '#9333ea',
    success: '#059669',
    error: '#dc2626',
    warning: '#d97706',
    info: '#0891b2',
    
    // 语义化颜色
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb'
  },
  
  // 尺寸配置
  sizes: {
    borderRadius: '0.5rem',
    borderRadiusLg: '0.75rem',
    shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    containerMaxWidth: '1200px',
    headerHeight: '64px',
    footerHeight: '200px'
  },
  
  // 动画配置
  animations: {
    transitionDuration: '300ms',
    transitionEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    hoverScale: '1.05',
    fadeIn: 'fadeIn 0.3s ease-in-out',
    slideIn: 'slideIn 0.3s ease-in-out'
  },
  
  // 响应式断点
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
} as const

/**
 * 环境配置
 */
export const envConfig = {
  // 基础URL配置
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || '企业官网',
  
  // 图片配置
  imageBaseUrl: process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '/images',
  defaultImages: {
    companyIntro: '/images/company-intro.svg',
    ogDefault: '/images/og-default.jpg',
    logo: '/images/logo.png',
    logoSvg: '/images/logo.svg',
    avatar: '/images/avatar-default.png',
    placeholder: '/images/placeholder.jpg'
  },
  
  // 社交媒体配置
  social: {
    twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@company',
    facebookPage: process.env.NEXT_PUBLIC_FACEBOOK_PAGE || '',
    linkedinPage: process.env.NEXT_PUBLIC_LINKEDIN_PAGE || '',
    wechat: process.env.NEXT_PUBLIC_WECHAT || '',
    weibo: process.env.NEXT_PUBLIC_WEIBO || ''
  },
  
  // 联系信息
  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE || '13957862987',
    email: process.env.NEXT_PUBLIC_EMAIL || 'zhaojunxi222@gmail.com',
    address: process.env.NEXT_PUBLIC_ADDRESS || '宁波市海曙区镇明路108号',
    workingHours: '周一至周六 8:00-18:00'
  },

  // 公司信息
  company: {
    name: '亚豪膜结构',
    slogan: '30年专业经验 · 膜结构领域专家',
    establishedYear: 1994,
    description: '亚豪膜结构成立于1994年，拥有30年专业经验，专注于膜结构设计与施工，提供全方位的膜结构解决方案。'
  }
} as const

/**
 * 性能配置
 */
export const performanceConfig = {
  enableLazyLoading: true,
  imageOptimization: true,
  enableCaching: true,
  cacheTimeout: 5 * 60 * 1000, // 5分钟
  
  // 性能预算
  budget: {
    fcp: 2500,  // First Contentful Paint
    lcp: 4000,  // Largest Contentful Paint
    cls: 0.25,  // Cumulative Layout Shift
    fid: 300    // First Input Delay
  },
  
  // 监控配置
  monitoring: {
    enabled: process.env.NODE_ENV === 'production',
    sampleRate: 0.1, // 10%采样率
    enableWebVitals: true,
    enableResourceTiming: true
  }
} as const

/**
 * 开发配置
 */
export const devConfig = {
  enableDebugLogs: process.env.NODE_ENV === 'development',
  enableDataValidation: true,
  showDataVerification: process.env.NODE_ENV === 'development',
  enablePerformanceMonitoring: true,
  enableDevtools: process.env.NODE_ENV === 'development'
} as const

/**
 * 统一配置对象
 */
export const globalConfig = {
  api: apiConfig,
  uiText: uiTextConfig,
  style: styleConfig,
  env: envConfig,
  performance: performanceConfig,
  dev: devConfig
} as const

/**
 * 配置验证函数
 */
export function validateConfig() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_SITE_URL'
  ]
  
  const missing = requiredEnvVars.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing)
  }
  
  return missing.length === 0
}

/**
 * 获取配置值的工具函数
 */
export function getConfigValue(path: string, defaultValue?: unknown) {
  const keys = path.split('.')
  let current: any = globalConfig

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      return defaultValue
    }
  }

  return current
}
