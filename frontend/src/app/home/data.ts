import { HomePageData, ApiResponse, PageLoadingState } from './types'
import { apiConfig, defaultDataConfig } from './config'

/**
 * 首页数据服务模块
 * 统一管理首页数据获取、处理和状态管理
 *
 * @author AI Assistant
 * @version 1.0.0
 * @since 2024-06-02
 */

/**
 * 数据验证错误类
 */
export class DataValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'DataValidationError'
  }
}

/**
 * API错误类
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * 获取首页数据
 * @returns Promise<HomePageData> 处理后的首页数据
 * @throws {ApiError} API调用失败时抛出
 * @throws {DataValidationError} 数据验证失败时抛出
 */
export async function fetchHomeData(): Promise<HomePageData> {
  try {
    console.log('🔄 开始获取首页数据...')

    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.home}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(apiConfig.timeout)
    })

    console.log('📡 API响应状态:', response.status)

    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch home data`,
        response.status,
        `HTTP_${response.status}`
      )
    }

    const result: ApiResponse<HomePageData> = await response.json()
    console.log('📊 API返回数据结构:', {
      code: result.code,
      msg: result.msg,
      dataKeys: result.data ? Object.keys(result.data) : []
    })

    if (result.code === 0 && result.data) {
      console.log('✅ 首页数据加载成功')
      return processHomeData(result.data)
    } else {
      throw new ApiError(
        result.msg || 'API返回错误状态',
        undefined,
        `API_CODE_${result.code}`
      )
    }
  } catch (err) {
    console.error('❌ 首页数据加载失败:', err)

    if (err instanceof ApiError || err instanceof DataValidationError) {
      throw err
    }

    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new ApiError('请求超时，请检查网络连接', undefined, 'TIMEOUT')
      }
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new ApiError('网络连接失败，请检查网络设置', undefined, 'NETWORK_ERROR')
      }
      throw new ApiError(err.message, undefined, 'UNKNOWN_ERROR')
    }

    throw new ApiError('未知错误', undefined, 'UNKNOWN_ERROR')
  }
}

/**
 * 验证首页数据结构
 * @param data 待验证的数据
 * @throws {DataValidationError} 数据验证失败时抛出
 */
function validateHomeData(data: unknown): asserts data is HomePageData {
  if (!data || typeof data !== 'object') {
    throw new DataValidationError('数据格式无效：数据不是对象')
  }

  const dataObj = data as Record<string, unknown>

  // 验证必需字段
  const requiredFields = ['id', 'seoMainTitle', 'seoSubTitle'] as const
  for (const field of requiredFields) {
    if (!dataObj[field] || typeof dataObj[field] !== 'string') {
      throw new DataValidationError(`缺少必需字段或字段类型错误: ${field}`, field)
    }
  }

  // 验证数组字段
  const arrayFields = ['bannerSlides', 'featuredProducts', 'featuredCases'] as const
  for (const field of arrayFields) {
    if (dataObj[field] && !Array.isArray(dataObj[field])) {
      throw new DataValidationError(`字段类型错误，应为数组: ${field}`, field)
    }
  }

  // 验证页面配置
  if (dataObj.pageConfig && typeof dataObj.pageConfig !== 'object') {
    throw new DataValidationError('页面配置格式错误', 'pageConfig')
  }
}

/**
 * 处理首页数据
 * 对从API获取的原始数据进行处理和验证
 * @param rawData 原始数据
 * @returns 处理后的数据
 * @throws {DataValidationError} 数据验证失败时抛出
 */
export function processHomeData(rawData: HomePageData): HomePageData {
  // 数据验证
  validateHomeData(rawData)

  // 数据处理和默认值设置
  const processedData: HomePageData = {
    ...rawData,
    // 确保数组数据存在并进行排序
    bannerSlides: (rawData.bannerSlides || [])
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    featuredProducts: (rawData.featuredProducts || [])
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    featuredCases: (rawData.featuredCases || [])
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),

    // 确保配置对象存在
    pageConfig: {
      ...{
        theme: 'default',
        layout: 'standard',
        showBanner: true,
        showProducts: true,
        showCases: true
      },
      ...rawData.pageConfig
    },

    // 提供默认值
    seoMainTitle: rawData.seoMainTitle || defaultDataConfig.seoMainTitle,
    seoSubTitle: rawData.seoSubTitle || defaultDataConfig.seoSubTitle,
    seoKeywords: rawData.seoKeywords || defaultDataConfig.seoKeywords,
    seoDescription: rawData.seoDescription || defaultDataConfig.seoDescription,
    companyIntroTitle: rawData.companyIntroTitle || defaultDataConfig.companyIntroTitle,
    companyIntroText: rawData.companyIntroText || defaultDataConfig.companyIntroText,
    companyIntroImage: rawData.companyIntroImage || defaultDataConfig.companyIntroImage,
    productSectionTitle: rawData.productSectionTitle || defaultDataConfig.productSectionTitle,
    caseSectionTitle: rawData.caseSectionTitle || defaultDataConfig.caseSectionTitle
  }

  console.log('📋 数据处理完成:', {
    bannerSlidesCount: processedData.bannerSlides.length,
    productsCount: processedData.featuredProducts.length,
    casesCount: processedData.featuredCases.length,
    configValid: !!processedData.pageConfig
  })

  return processedData
}

/**
 * 创建初始加载状态
 * @returns 初始状态对象
 */
export function createInitialLoadingState(): PageLoadingState {
  return {
    loading: true,
    error: null,
    data: null
  }
}

/**
 * 错误处理工具函数
 * @param error 错误对象
 * @returns 用户友好的错误信息
 */
export function handleDataError(error: unknown): string {
  if (error instanceof Error) {
    // 网络错误
    if (error.message.includes('fetch')) {
      return '网络连接失败，请检查网络设置'
    }

    // 超时错误
    if (error.message.includes('timeout') || error.message.includes('超时')) {
      return '请求超时，请稍后重试'
    }

    // HTTP错误
    if (error.message.includes('HTTP')) {
      return '服务器响应异常，请稍后重试'
    }

    // API错误
    if (error.message.includes('Failed to load data')) {
      return '数据加载失败，请刷新页面重试'
    }

    return error.message
  }

  return '未知错误，请刷新页面重试'
}

/**
 * 重试机制
 * @param fn 要重试的函数
 * @param maxRetries 最大重试次数
 * @param delay 重试延迟（毫秒）
 * @returns Promise
 */
export async function retryWithDelay<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')

      if (i === maxRetries) {
        throw lastError
      }

      console.log(`重试第 ${i + 1} 次，${delay}ms 后重试...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}
