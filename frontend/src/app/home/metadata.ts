import { Metadata } from 'next'
import { fetchHomeData } from './data'
import { generateDynamicMetadata, defaultHomeMetadata } from './seo'

/**
 * 动态生成首页metadata
 * 用于Next.js App Router的metadata API
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    // 获取首页数据
    const homeData = await fetchHomeData()
    
    // 生成动态metadata
    return generateDynamicMetadata(homeData)
  } catch (error) {
    console.error('生成动态metadata失败:', error)
    
    // 降级到默认metadata
    return defaultHomeMetadata
  }
}

/**
 * 静态metadata导出（备用方案）
 */
export { defaultHomeMetadata as metadata }
