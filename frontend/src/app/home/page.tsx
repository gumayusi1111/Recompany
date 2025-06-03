'use client'

import { useEffect, lazy, Suspense } from 'react'
import { HeroSection } from './components/HeroSection/HeroSection'
import { MainTitle } from './components/MainTitle/MainTitle'
import { SEOHead } from './components/SEOHead'
import { LoadingComponent } from './components/LoadingComponent'
import { ErrorComponent } from './components/ErrorComponent'
import { NoDataComponent } from './components/NoDataComponent'
import {
  useHomePageData,
  useHomePageLoading,
  useHomePageError,
  useHomePageActions
} from '@/stores/pages/homeStore'

// 懒加载非关键组件
const CompanyIntro = lazy(() => import('./components/CompanyIntro/CompanyIntro').then(module => ({ default: module.CompanyIntro })))
const ProductSection = lazy(() => import('./components/ProductSection/ProductSection').then(module => ({ default: module.ProductSection })))
const CaseSection = lazy(() => import('./components/CaseSection/CaseSection').then(module => ({ default: module.CaseSection })))


// 懒加载组件的加载指示器
const SectionLoader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-pulse bg-gray-200 h-32 w-full rounded-lg"></div>
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

  // 渲染状态处理
  if (loading) return <LoadingComponent />
  if (error) return <ErrorComponent error={error} />
  if (!homeData) return <NoDataComponent />

  return (
    <>
      <SEOHead data={homeData} />

      {/* 关键内容 - 立即加载 */}
      <HeroSection
        seoMainTitle={homeData.seoMainTitle}
        seoSubTitle={homeData.seoSubTitle}
        seoKeywords={homeData.seoKeywords}
        seoDescription={homeData.seoDescription}
      />

      {/* Banner组件已移除 - 根据用户要求 */}

      {/* 主标题区块 */}
      <MainTitle
        title="专业膜结构解决方案"
        subtitle="30年专业经验 · 膜结构领域专家"
        description="亚豪膜结构成立于1994年，专注于膜结构设计与施工，为客户提供全方位的膜结构解决方案"
      />

      <Suspense fallback={<SectionLoader />}>
        <CompanyIntro
          companyIntroTitle={homeData.companyIntroTitle}
          companyIntroText={homeData.companyIntroText}
          companyIntroImage={homeData.companyIntroImage}
        />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <ProductSection
          products={homeData.featuredProducts}
          config={homeData.pageConfig}
          sectionTitle={homeData.productSectionTitle}
        />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <CaseSection
          cases={homeData.featuredCases}
          config={homeData.pageConfig}
          sectionTitle={homeData.caseSectionTitle}
        />
      </Suspense>


    </>
  )
}
