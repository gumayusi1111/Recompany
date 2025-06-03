'use client'

import Head from 'next/head'
import { HomePageData } from '../types'
import { generateStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo/core'

interface SEOHeadProps {
  data: HomePageData
}

/**
 * SEO Head组件
 * 用于在客户端动态注入SEO相关的head标签
 */
export function SEOHead({ data }: SEOHeadProps) {
  // 适配全局SEO函数
  const organizationData = generateStructuredData({
    title: data.seoMainTitle,
    description: data.seoDescription,
    keywords: data.seoKeywords,
    type: 'Organization'
  })

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: '首页', url: '/' }
  ])

  // 生成产品结构化数据
  const productsData = data.featuredProducts.length > 0 ? {
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

  return (
    <Head>
      {/* 结构化数据 - 组织信息 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />

      {/* 结构化数据 - 产品信息 */}
      {productsData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productsData)
          }}
        />
      )}
      
      {/* 结构化数据 - 面包屑导航 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />

      {/* 额外的meta标签 */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* 预加载关键资源 */}
      <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossOrigin="" />
      
      {/* DNS预解析 */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
    </Head>
  )
}
