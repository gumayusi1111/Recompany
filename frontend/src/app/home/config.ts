/**
 * 首页配置管理模块
 * 统一管理首页相关配置常量
 *
 * @author AI Assistant
 * @version 1.0.0
 */

/**
 * API配置
 */
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  endpoints: {
    home: '/api/home'
  },
  timeout: 10000,
  retryAttempts: 2,
  retryDelay: 1500
} as const

/**
 * 默认页面配置
 */
export const defaultPageConfig = {
  theme: 'default',
  layout: 'standard',
  showBanner: true,
  showProducts: true,
  showCases: true
} as const

/**
 * 默认数据配置
 */
export const defaultDataConfig = {
  seoMainTitle: '欢迎来到我们的网站',
  seoSubTitle: '专业的解决方案提供商',
  seoKeywords: '解决方案,专业服务,产品,案例',
  seoDescription: '我们是一家专业的解决方案提供商，致力于为客户提供优质的产品和服务。',
  companyIntroTitle: '关于我们',
  companyIntroText: '我们是一家专业的公司，致力于为客户提供最优质的产品和服务。',
  companyIntroImage: '/images/company-intro.jpg',
  productSectionTitle: '我们的产品',
  caseSectionTitle: '成功案例'
} as const

/**
 * 性能配置
 */
export const performanceConfig = {
  enableLazyLoading: true,
  imageOptimization: true,
  enableCaching: true,
  cacheTimeout: 5 * 60 * 1000, // 5分钟
} as const

/**
 * 开发配置
 */
export const devConfig = {
  enableDebugLogs: process.env.NODE_ENV === 'development',
  enableDataValidation: true,
  showDataVerification: process.env.NODE_ENV === 'development'
} as const

/**
 * UI文本配置
 */
export const uiTextConfig = {
  // 通用文本
  loading: '正在加载首页数据，请稍候... 🚀',
  loadingFailed: '加载失败',
  noData: '暂无数据',
  reload: '重新加载',

  // 页面标题
  bannerSectionTitle: '精彩展示',
  dataVerificationTitle: '数据流验证 - 来自数据库的真实数据',

  // 状态文本
  statusNormal: '✅ 正常',
  statusActive: '激活',
  statusInactive: '未激活',

  // 数据标签
  sortOrder: '排序',
  image: '图片',
  client: '客户',
  dataSource: '数据来源',
  apiEndpoint: 'API端点',
  dataTable: '数据表',
  connectionStatus: '连接状态',

  // 数据统计标签
  bannerSlidesCount: '轮播图数量',
  productsCount: '产品数量',
  casesCount: '案例数量',
  pageStatus: '页面状态',
  pageId: '页面ID',
  createdTime: '创建时间',
  updatedTime: '更新时间'
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
    info: '#0891b2'
  },

  // 尺寸配置
  sizes: {
    borderRadius: '0.5rem',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    containerMaxWidth: '1200px'
  },

  // 动画配置
  animations: {
    transitionDuration: '300ms',
    hoverScale: '1.05'
  }
} as const

/**
 * 环境配置
 */
export const envConfig = {
  // 基础URL配置
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',

  // 图片配置
  imageBaseUrl: process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '/images',
  defaultImages: {
    companyIntro: '/images/company-intro.jpg',
    ogDefault: '/images/og-default.jpg',
    logo: '/images/logo.png'
  },

  // 社交媒体配置
  social: {
    twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@company',
    facebookPage: process.env.NEXT_PUBLIC_FACEBOOK_PAGE || '',
    linkedinPage: process.env.NEXT_PUBLIC_LINKEDIN_PAGE || ''
  }
} as const

/**
 * 统一配置对象
 */
export const homeConfig = {
  api: apiConfig,
  defaultPage: defaultPageConfig,
  defaultData: defaultDataConfig,
  performance: performanceConfig,
  dev: devConfig,
  uiText: uiTextConfig,
  style: styleConfig,
  env: envConfig
} as const
