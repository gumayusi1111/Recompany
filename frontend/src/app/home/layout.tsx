import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo/core'

/**
 * 首页Layout - 提供SEO metadata
 * 为首页提供完整的SEO优化
 */

// 生成首页的完整metadata
export const metadata: Metadata = generatePageMetadata({
  title: '亚豪膜结构 - 30年专业经验 · 膜结构领域专家',
  description: '亚豪膜结构成立于1994年，拥有30年专业经验，专注于膜结构设计与施工。提供张拉膜结构、充气膜结构、骨架膜结构等全方位膜结构解决方案。服务热线：13957862987',
  keywords: '膜结构,亚豪膜结构,宁波膜结构,张拉膜,充气膜,骨架膜,膜结构设计,膜结构施工,膜结构工程,体育场馆膜结构,展览中心膜结构,商业建筑膜结构,景观膜结构,膜结构建筑,空间膜结构,膜结构公司',
  url: '/home',
  image: '/images/og-home.jpg'
})

interface HomeLayoutProps {
  children: React.ReactNode
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      {/* 添加额外的meta标签 */}
      <meta name="author" content="亚豪膜结构工程有限公司" />
      <meta name="copyright" content="© 2025 亚豪膜结构. 保留所有权利." />
      <meta name="company" content="亚豪膜结构工程有限公司" />
      <meta name="contact" content="13957862987" />
      <meta name="email" content="zhaojunxi222@gmail.com" />
      <meta name="address" content="宁波市海曙区镇明路108号" />
      <meta name="established" content="1994" />
      <meta name="industry" content="膜结构工程" />
      <meta name="service-area" content="全国" />
      
      {/* 地理位置相关meta标签 */}
      <meta name="geo.region" content="CN-ZJ" />
      <meta name="geo.placename" content="宁波市" />
      <meta name="geo.position" content="29.8683;121.5440" />
      <meta name="ICBM" content="29.8683, 121.5440" />
      
      {/* 业务相关meta标签 */}
      <meta name="business.hours" content="周一至周六 8:00-18:00" />
      <meta name="business.phone" content="13957862987" />
      <meta name="business.email" content="zhaojunxi222@gmail.com" />
      
      {/* 语言和地区 */}
      <meta name="language" content="zh-CN" />
      <meta name="content-language" content="zh-CN" />
      
      {/* 移动端优化 */}
      <meta name="format-detection" content="telephone=yes" />
      <meta name="format-detection" content="email=yes" />
      <meta name="format-detection" content="address=yes" />
      
      {/* 搜索引擎优化 */}
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* 社交媒体优化 */}
      <meta property="og:locale" content="zh_CN" />
      <meta property="og:site_name" content="亚豪膜结构" />
      <meta property="og:type" content="website" />
      <meta property="article:author" content="亚豪膜结构" />
      <meta property="article:publisher" content="亚豪膜结构" />
      
      {/* Twitter Card优化 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@yahao_membrane" />
      <meta name="twitter:creator" content="@yahao_membrane" />
      
      {/* 结构化数据预加载 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "亚豪膜结构工程有限公司",
            "alternateName": "亚豪膜结构",
            "description": "专业膜结构设计与施工，30年行业经验",
            "foundingDate": "1994",
            "url": "https://example.com",
            "logo": "https://example.com/images/logo.svg",
            "image": "https://example.com/images/og-home.jpg",
            "telephone": "+86-13957862987",
            "email": "zhaojunxi222@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "海曙区镇明路108号",
              "addressLocality": "宁波市",
              "addressRegion": "浙江省",
              "postalCode": "315000",
              "addressCountry": "CN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 29.8683,
              "longitude": 121.5440
            },
            "openingHours": "Mo-Sa 08:00-18:00",
            "priceRange": "$$",
            "areaServed": {
              "@type": "Country",
              "name": "中国"
            },
            "serviceType": [
              "膜结构设计",
              "膜结构施工",
              "张拉膜工程",
              "充气膜工程",
              "骨架膜工程"
            ],
            "knowsAbout": [
              "膜结构建筑",
              "空间膜结构",
              "体育场馆膜结构",
              "展览中心膜结构",
              "商业建筑膜结构"
            ]
          })
        }}
      />
      
      {children}
    </>
  )
}
