'use client'

import Script from 'next/script'
import { HomePageData } from '../types'
import { generateStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo/core'

interface SEOHeadProps {
  data: HomePageData
}

/**
 * SEO Head组件
 * 用于在客户端动态注入SEO相关的结构化数据
 * 使用Next.js App Router的Script组件
 */
export function SEOHead({ data }: SEOHeadProps) {
  // 生成组织结构化数据
  const organizationData = generateStructuredData({
    title: data.seoMainTitle,
    description: data.seoDescription,
    keywords: data.seoKeywords,
    type: 'Organization'
  })

  // 生成面包屑结构化数据
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: '首页', url: '/home' },
    { name: '亚豪膜结构', url: '/' }
  ])

  // 生成产品结构化数据
  const productsData = data.featuredProducts.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data.productSectionTitle || '我们的产品',
    description: '亚豪膜结构专业产品展示',
    numberOfItems: data.featuredProducts.length,
    itemListElement: data.featuredProducts.map((product, index) => ({
      '@type': 'Product',
      position: index + 1,
      name: product.name,
      description: product.description,
      image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}${product.imagePath}`,
      brand: {
        '@type': 'Brand',
        name: '亚豪膜结构'
      },
      manufacturer: {
        '@type': 'Organization',
        name: '亚豪膜结构',
        foundingDate: '1994',
        address: {
          '@type': 'PostalAddress',
          addressLocality: '宁波市',
          addressRegion: '浙江省',
          addressCountry: 'CN',
          streetAddress: '海曙区镇明路108号'
        }
      }
    })),
  } : null

  // 生成案例结构化数据
  const casesData = data.featuredCases.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data.caseSectionTitle || '成功案例',
    description: '亚豪膜结构成功案例展示',
    numberOfItems: data.featuredCases.length,
    itemListElement: data.featuredCases.map((caseItem, index) => ({
      '@type': 'CreativeWork',
      position: index + 1,
      name: caseItem.name,
      description: caseItem.description,
      image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}${caseItem.imagePath}`,
      creator: {
        '@type': 'Organization',
        name: '亚豪膜结构'
      },
      client: caseItem.clientName,
      dateCreated: new Date().toISOString()
    })),
  } : null

  // 生成网站结构化数据
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '亚豪膜结构',
    alternateName: '亚豪膜结构工程有限公司',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
    description: data.seoDescription,
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <>
      {/* 组织信息结构化数据 */}
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />

      {/* 网站信息结构化数据 */}
      <Script
        id="website-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData)
        }}
      />

      {/* 面包屑导航结构化数据 */}
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />

      {/* 产品信息结构化数据 */}
      {productsData && (
        <Script
          id="products-structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productsData)
          }}
        />
      )}

      {/* 案例信息结构化数据 */}
      {casesData && (
        <Script
          id="cases-structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(casesData)
          }}
        />
      )}
    </>
  )
}
