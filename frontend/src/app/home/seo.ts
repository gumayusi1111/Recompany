import { Metadata } from 'next'
import { HomePageData } from './types'

/**
 * SEO配置模块
 * 统一管理首页SEO相关配置和动态生成
 * 
 * @author AI Assistant
 * @version 1.0.0
 */

/**
 * 静态SEO配置
 */
export const staticSEOConfig = {
  siteName: '公司官网',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@company',
  locale: 'zh_CN',
  type: 'website'
} as const

/**
 * 默认SEO配置
 */
export const defaultHomeMetadata: Metadata = {
  title: '欢迎来到我们的网站 - 专业解决方案提供商',
  description: '我们是一家专业的解决方案提供商，致力于为客户提供优质的产品和服务。',
  keywords: ['解决方案', '专业服务', '产品', '案例'],
  authors: [{ name: '公司名称' }],
  creator: '公司名称',
  publisher: '公司名称',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: staticSEOConfig.locale,
    url: staticSEOConfig.siteUrl,
    siteName: staticSEOConfig.siteName,
    title: '欢迎来到我们的网站',
    description: '专业的解决方案提供商',
    images: [
      {
        url: staticSEOConfig.defaultImage,
        width: 1200,
        height: 630,
        alt: '公司官网首页',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: staticSEOConfig.twitterHandle,
    creator: staticSEOConfig.twitterHandle,
    title: '欢迎来到我们的网站',
    description: '专业的解决方案提供商',
    images: [staticSEOConfig.defaultImage],
  },
  alternates: {
    canonical: staticSEOConfig.siteUrl,
  },
}

/**
 * 根据动态数据生成SEO配置
 * @param data 首页数据
 * @returns 动态SEO配置
 */
export function generateDynamicMetadata(data: HomePageData): Metadata {
  const title = `${data.seoMainTitle} - ${staticSEOConfig.siteName}`
  const description = data.seoDescription || data.seoSubTitle
  const keywords = data.seoKeywords ? data.seoKeywords.split(',').map(k => k.trim()) : []
  
  return {
    title,
    description,
    keywords: [...keywords, '解决方案', '专业服务'],
    openGraph: {
      ...defaultHomeMetadata.openGraph,
      title: data.seoMainTitle,
      description,
      url: `${staticSEOConfig.siteUrl}/home`,
    },
    twitter: {
      ...defaultHomeMetadata.twitter,
      title: data.seoMainTitle,
      description,
    },
    alternates: {
      canonical: `${staticSEOConfig.siteUrl}/home`,
    },
  }
}

/**
 * 生成结构化数据 (JSON-LD)
 * @param data 首页数据
 * @returns 结构化数据对象
 */
export function generateStructuredData(data: HomePageData) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: staticSEOConfig.siteName,
    url: staticSEOConfig.siteUrl,
    logo: `${staticSEOConfig.siteUrl}/images/logo.png`,
    description: data.seoDescription || data.companyIntroText,
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CN',
      addressLocality: '北京',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+86-xxx-xxxx',
      contactType: 'customer service',
    },
    sameAs: [
      // 社交媒体链接
    ],
  }

  // 如果有产品数据，添加产品结构化数据
  const productsStructuredData = data.featuredProducts.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data.productSectionTitle || '我们的产品',
    numberOfItems: data.featuredProducts.length,
    itemListElement: data.featuredProducts.map((product, index) => ({
      '@type': 'Product',
      position: index + 1,
      name: product.name,
      description: product.description,
      image: product.imagePath,
    })),
  } : null

  return {
    organization: baseStructuredData,
    products: productsStructuredData,
  }
}

/**
 * 生成面包屑导航结构化数据
 * @returns 面包屑结构化数据
 */
export function generateBreadcrumbStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: staticSEOConfig.siteUrl,
      },
    ],
  }
}

/**
 * SEO优化工具函数
 */
export const seoUtils = {
  /**
   * 截断描述到指定长度
   */
  truncateDescription: (text: string, maxLength: number = 160): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
  },

  /**
   * 清理和格式化关键词
   */
  formatKeywords: (keywords: string): string[] => {
    return keywords
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0)
      .slice(0, 10) // 限制关键词数量
  },

  /**
   * 生成页面URL
   */
  generatePageUrl: (path: string): string => {
    return `${staticSEOConfig.siteUrl}${path.startsWith('/') ? path : `/${path}`}`
  },

  /**
   * 验证SEO数据完整性
   */
  validateSEOData: (data: HomePageData): { isValid: boolean; issues: string[] } => {
    const issues: string[] = []

    if (!data.seoMainTitle || data.seoMainTitle.length < 10) {
      issues.push('SEO主标题过短或缺失')
    }
    if (!data.seoDescription || data.seoDescription.length < 50) {
      issues.push('SEO描述过短或缺失')
    }
    if (!data.seoKeywords || data.seoKeywords.length < 5) {
      issues.push('SEO关键词缺失或过少')
    }

    return {
      isValid: issues.length === 0,
      issues
    }
  }
}
