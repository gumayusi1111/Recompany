/**
 * 首页特定配置
 * 继承全局配置，添加页面特定配置
 *
 * @author AI Assistant
 * @version 2.0.0
 */

import { globalConfig } from '@/config/global'

/**
 * 继承全局API配置
 */
export const apiConfig = {
  ...globalConfig.api,
  endpoints: {
    ...globalConfig.api.endpoints,
    home: '/api/home'
  }
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
  companyIntroImage: '/images/company-intro.svg',
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
 * 首页特定UI文本配置
 */
export const uiTextConfig = {
  // 继承全局文本配置
  ...globalConfig.uiText,

  // 首页特定文本
  bannerSectionTitle: '精彩展示',
  dataVerificationTitle: '数据流验证 - 来自数据库的真实数据',

  // 首页数据统计标签
  bannerSlidesCount: '轮播图数量',
  productsCount: '产品数量',
  casesCount: '案例数量',
  pageStatus: '页面状态',
  pageId: '页面ID'
} as const

/**
 * 继承全局样式配置
 */
export const styleConfig = globalConfig.style

/**
 * 继承全局环境配置
 */
export const envConfig = globalConfig.env

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
