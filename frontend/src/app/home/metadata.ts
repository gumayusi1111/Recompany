import { Metadata } from 'next'
import { fetchHomeData } from './data'
import { generatePageMetadata, createDefaultMetadata } from '@/lib/seo/core'

/**
 * 动态生成首页metadata
 * 用于Next.js App Router的metadata API
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    // 获取首页数据
    const homeData = await fetchHomeData()

    // 生成动态metadata
    return generatePageMetadata({
      title: homeData.seoMainTitle,
      description: homeData.seoDescription,
      keywords: homeData.seoKeywords,
      url: '/home'
    })
  } catch (error) {
    console.error('生成动态metadata失败:', error)

    // 降级到默认metadata
    return createDefaultMetadata('首页')
  }
}

/**
 * 静态metadata导出（备用方案）
 */
export const metadata = createDefaultMetadata('首页')
