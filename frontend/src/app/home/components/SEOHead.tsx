'use client'

import Head from 'next/head'
import { HomePageData } from '../types'
import { generateStructuredData, generateBreadcrumbStructuredData } from '../seo'

interface SEOHeadProps {
  data: HomePageData
}

/**
 * SEO Head组件
 * 用于在客户端动态注入SEO相关的head标签
 */
export function SEOHead({ data }: SEOHeadProps) {
  const structuredData = generateStructuredData(data)
  const breadcrumbData = generateBreadcrumbStructuredData()

  return (
    <Head>
      {/* 结构化数据 - 组织信息 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.organization)
        }}
      />
      
      {/* 结构化数据 - 产品信息 */}
      {structuredData.products && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.products)
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
