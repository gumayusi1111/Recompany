/**
 * 全局SEO核心工具
 * 提供统一的SEO配置和工具函数
 * 
 * @author AI Assistant
 * @version 2.0.0
 */

import { Metadata } from 'next'

/**
 * 基础页面数据接口
 */
export interface BasePageData {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
  type?: string
}

/**
 * 静态SEO配置
 */
export const staticSEOConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || '企业官网',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@company',
  locale: 'zh_CN',
  type: 'website',
  
  // 默认SEO配置
  defaults: {
    title: '企业官网 - 专业解决方案提供商',
    description: '我们是一家专业的解决方案提供商，致力于为客户提供优质的产品和服务。',
    keywords: '企业官网,解决方案,专业服务,产品,案例',
    image: '/images/og-default.jpg'
  }
} as const

/**
 * 生成完整的页面metadata
 */
export function generatePageMetadata(data: BasePageData): Metadata {
  const fullTitle = data.title.includes(staticSEOConfig.siteName) 
    ? data.title 
    : `${data.title} - ${staticSEOConfig.siteName}`
    
  const fullUrl = data.url 
    ? `${staticSEOConfig.siteUrl}${data.url}`
    : staticSEOConfig.siteUrl
    
  const imageUrl = data.image || staticSEOConfig.defaultImage
  const fullImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${staticSEOConfig.siteUrl}${imageUrl}`

  return {
    title: fullTitle,
    description: data.description,
    keywords: data.keywords?.split(',').map(k => k.trim()),
    
    openGraph: {
      type: 'website',
      locale: staticSEOConfig.locale,
      url: fullUrl,
      siteName: staticSEOConfig.siteName,
      title: fullTitle,
      description: data.description,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      site: staticSEOConfig.twitterHandle,
      title: fullTitle,
      description: data.description,
      images: [fullImageUrl],
    },
    
    alternates: {
      canonical: fullUrl,
    },
    
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
  }
}

/**
 * 生成结构化数据 (JSON-LD)
 */
export function generateStructuredData(data: BasePageData & { 
  type?: 'WebPage' | 'Organization' | 'Product' | 'Article'
}) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': data.type || 'WebPage',
    name: data.title,
    description: data.description,
    url: data.url ? `${staticSEOConfig.siteUrl}${data.url}` : staticSEOConfig.siteUrl,
  }

  // 根据类型添加特定字段
  switch (data.type) {
    case 'Organization':
      return {
        ...baseStructuredData,
        '@type': 'Organization',
        name: '亚豪膜结构工程有限公司',
        alternateName: '亚豪膜结构',
        logo: `${staticSEOConfig.siteUrl}/images/logo.svg`,
        image: `${staticSEOConfig.siteUrl}/images/logo.svg`,
        foundingDate: '1994',
        foundingLocation: {
          '@type': 'Place',
          name: '宁波市',
          address: {
            '@type': 'PostalAddress',
            addressLocality: '宁波市',
            addressRegion: '浙江省',
            addressCountry: 'CN'
          }
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: '海曙区镇明路108号',
          addressLocality: '宁波市',
          addressRegion: '浙江省',
          postalCode: '315000',
          addressCountry: 'CN'
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+86-13957862987',
            contactType: 'customer service',
            areaServed: 'CN',
            availableLanguage: 'Chinese'
          },
          {
            '@type': 'ContactPoint',
            email: 'zhaojunxi222@gmail.com',
            contactType: 'customer service',
            areaServed: 'CN',
            availableLanguage: 'Chinese'
          }
        ],
        sameAs: [
          // 可以添加社交媒体链接
        ],
        knowsAbout: [
          '膜结构设计',
          '膜结构施工',
          '张拉膜工程',
          '膜结构建筑',
          '空间膜结构'
        ],
        areaServed: {
          '@type': 'Country',
          name: '中国'
        },
        serviceArea: {
          '@type': 'GeoCircle',
          geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: 29.8683,
            longitude: 121.5440
          },
          geoRadius: '1000000'
        }
      }
      
    case 'Product':
      return {
        ...baseStructuredData,
        '@type': 'Product',
        image: data.image ? `${staticSEOConfig.siteUrl}${data.image}` : staticSEOConfig.defaultImage,
        brand: {
          '@type': 'Brand',
          name: staticSEOConfig.siteName
        }
      }
      
    case 'Article':
      return {
        ...baseStructuredData,
        '@type': 'Article',
        author: {
          '@type': 'Organization',
          name: staticSEOConfig.siteName
        },
        publisher: {
          '@type': 'Organization',
          name: staticSEOConfig.siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${staticSEOConfig.siteUrl}/images/logo.png`
          }
        }
      }
      
    default:
      return baseStructuredData
  }
}

/**
 * SEO数据验证工具
 */
export const seoValidator = {
  /**
   * 验证SEO数据完整性
   */
  validateSEOData: (data: BasePageData): { isValid: boolean; issues: string[] } => {
    const issues: string[] = []

    if (!data.title || data.title.length < 10) {
      issues.push('SEO标题过短或缺失（建议至少10个字符）')
    }
    if (data.title && data.title.length > 60) {
      issues.push('SEO标题过长（建议不超过60个字符）')
    }
    
    if (!data.description || data.description.length < 50) {
      issues.push('SEO描述过短或缺失（建议至少50个字符）')
    }
    if (data.description && data.description.length > 160) {
      issues.push('SEO描述过长（建议不超过160个字符）')
    }
    
    if (!data.keywords || data.keywords.length < 5) {
      issues.push('SEO关键词缺失或过少')
    }

    return {
      isValid: issues.length === 0,
      issues
    }
  },

  /**
   * 生成SEO建议
   */
  generateSEORecommendations: (data: BasePageData): string[] => {
    const recommendations: string[] = []
    const validation = seoValidator.validateSEOData(data)
    
    if (!validation.isValid) {
      recommendations.push(...validation.issues)
    }
    
    // 额外建议
    if (data.title && !data.title.includes('|') && !data.title.includes('-')) {
      recommendations.push('建议在标题中使用分隔符来提高可读性')
    }
    
    if (data.keywords && data.keywords.split(',').length < 3) {
      recommendations.push('建议增加更多相关关键词')
    }
    
    if (!data.image) {
      recommendations.push('建议添加页面特色图片以提升社交媒体分享效果')
    }
    
    return recommendations
  }
}

/**
 * 默认metadata生成器
 */
export function createDefaultMetadata(pageName: string, customData?: Partial<BasePageData>): Metadata {
  const defaultData: BasePageData = {
    title: `${pageName} - ${staticSEOConfig.siteName}`,
    description: staticSEOConfig.defaults.description,
    keywords: staticSEOConfig.defaults.keywords,
    image: staticSEOConfig.defaults.image,
    url: `/${pageName.toLowerCase()}`
  }
  
  const mergedData = { ...defaultData, ...customData }
  return generatePageMetadata(mergedData)
}

/**
 * 面包屑结构化数据生成器
 */
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${staticSEOConfig.siteUrl}${item.url}`
    }))
  }
}
