'use client'

import { useEffect, lazy, Suspense } from 'react'
import { HeroSection } from './components/HeroSection/HeroSection'
import { MainTitle } from './components/MainTitle/MainTitle'
import { SEOHead } from './components/SEOHead'
import { LoadingComponent } from './components/LoadingComponent'
import { ErrorComponent } from './components/ErrorComponent'
import { NoDataComponent } from './components/NoDataComponent'
import { PerformanceMonitor } from '@/components/PerformanceMonitor'
import { PageNavigation } from '@/components/PageNavigation'
import type { PerformanceMetrics } from '@/components/PerformanceMonitor'
import {
  useHomePageData,
  useHomePageLoading,
  useHomePageError,
  useHomePageActions
} from '@/stores/pages/homeStore'
import styles from './page.module.css'

// 懒加载非关键组件
const CompanyIntro = lazy(() => import('./components/CompanyIntro/CompanyIntro').then(module => ({ default: module.CompanyIntro })))
const ProductSection = lazy(() => import('./components/ProductSection/ProductSection').then(module => ({ default: module.ProductSection })))
const CaseSection = lazy(() => import('./components/CaseSection/CaseSection').then(module => ({ default: module.CaseSection })))


// 懒加载组件的加载指示器
const SectionLoader = () => (
  <div className="flex justify-center items-center py-12">
    <div className="text-center space-y-4">
      {/* 旋转加载动画 */}
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500 mx-auto"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-blue-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
      </div>

      {/* 加载文字 */}
      <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
        正在加载内容...
      </p>

      {/* 骨架屏效果 */}
      <div className="w-full max-w-md mx-auto space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  </div>
)

/**
 * 首页组件
 * 使用Zustand进行状态管理，提供更好的性能和开发体验
 */
export default function HomePage() {
  // 使用Zustand hooks获取状态和操作
  const homeData = useHomePageData()
  const loading = useHomePageLoading()
  const error = useHomePageError()
  const { fetchData } = useHomePageActions()



  // 组件挂载时获取数据
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 页面导航配置
  const navigationItems = [
    { id: 'hero', label: '首页', href: '#hero-section' },
    { id: 'main-title', label: '专业方案', href: '#main-title' },
    { id: 'company-intro', label: '关于我们', href: '#company-intro' },
    { id: 'products', label: '产品中心', href: '#products-section' },
    { id: 'cases', label: '成功案例', href: '#cases-section' }
  ]

  // 性能指标处理
  const handlePerformanceMetrics = (metrics: PerformanceMetrics) => {
    // 在生产环境中，这里可以发送到分析服务
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Performance Metrics:', metrics)
    }
  }

  // 渲染状态处理
  if (loading) return <LoadingComponent />
  if (error) return <ErrorComponent error={error} />
  if (!homeData) return <NoDataComponent />

  return (
    <div className={styles.homePage}>
      <SEOHead data={homeData} />

      {/* 性能监控 */}
      <PerformanceMonitor
        enabled={true}
        sampleRate={process.env.NODE_ENV === 'development' ? 1 : 0.1}
        onMetrics={handlePerformanceMetrics}
      />

      {/* 页面内导航 */}
      <PageNavigation
        items={navigationItems}
        showBackToTop={true}
        offset={80}
        position="left"
        autoHide={true}
        mobileBreakpoint={768}
      />

      {/* 关键内容 - 立即加载 */}
      <section id="hero-section" className={`${styles.section} ${styles.heroSection}`}>
        <HeroSection
          seoMainTitle={homeData.seoMainTitle}
          seoSubTitle={homeData.seoSubTitle}
          seoKeywords={homeData.seoKeywords}
          seoDescription={homeData.seoDescription}
        />
      </section>

      {/* Banner组件已移除 - 根据用户要求 */}

      {/* 主标题区块 */}
      <section id="main-title" className={`${styles.section} ${styles.mainTitleSection}`}>
        <MainTitle
          title="专业膜结构解决方案"
          subtitle="30年专业经验 · 膜结构领域专家"
          description="亚豪膜结构成立于1994年，专注于膜结构设计与施工，为客户提供全方位的膜结构解决方案"
        />
      </section>

      <section id="company-intro" className={`${styles.section} ${styles.companyIntroSection}`}>
        <Suspense fallback={<SectionLoader />}>
          <CompanyIntro
            companyIntroTitle={homeData.companyIntroTitle}
            companyIntroText={homeData.companyIntroText}
            companyIntroImage={homeData.companyIntroImage}
          />
        </Suspense>
      </section>

      <section id="products-section" className={`${styles.section} ${styles.productsSection}`}>
        <Suspense fallback={<SectionLoader />}>
          <ProductSection
            products={homeData.featuredProducts}
            config={homeData.pageConfig}
            sectionTitle={homeData.productSectionTitle}
          />
        </Suspense>
      </section>

      <section id="cases-section" className={`${styles.section} ${styles.casesSection}`}>
        <Suspense fallback={<SectionLoader />}>
          <CaseSection
            cases={homeData.featuredCases}
            config={homeData.pageConfig}
            sectionTitle={homeData.caseSectionTitle}
          />
        </Suspense>
      </section>
    </div>
  )
}
