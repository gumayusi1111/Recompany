/**
 * API客户端 - 统一的HTTP请求封装
 * 提供完整的错误处理、重试机制和认证支持
 */

import { API_CONFIG, HttpMethod, ApiResponse, PaginatedResponse, RequestConfig } from '@/config/api'

// 请求拦截器类型
type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
type ResponseInterceptor = (response: any) => any | Promise<any>

class ApiClient {
  private baseURL: string
  private timeout: number
  private retryAttempts: number
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
    this.timeout = API_CONFIG.TIMEOUT
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS
  }

  // 添加请求拦截器
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
  }

  // 添加响应拦截器
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
  }

  // 获取认证token
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth-token') || null
  }

  // 构建请求头
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    const token = this.getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  // 执行HTTP请求
  private async executeRequest<T>(
    url: string,
    config: RequestConfig,
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    try {
      // 应用请求拦截器
      let finalConfig = config
      for (const interceptor of this.requestInterceptors) {
        finalConfig = await interceptor(finalConfig)
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout || this.timeout)

      const response = await fetch(url, {
        method: finalConfig.method,
        headers: this.buildHeaders(finalConfig.headers),
        body: finalConfig.body ? JSON.stringify(finalConfig.body) : undefined,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      let data: ApiResponse<T>
      try {
        data = await response.json()
      } catch {
        data = {
          success: false,
          error: '响应格式错误'
        }
      }

      // 应用响应拦截器
      for (const interceptor of this.responseInterceptors) {
        data = await interceptor(data)
      }

      // 处理HTTP错误状态
      if (!response.ok) {
        if (response.status === 401) {
          // 清除过期token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token')
            window.location.href = '/login'
          }
        }
        
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return data
    } catch (error: any) {
      // 网络错误重试
      if (attempt < (config.retries || this.retryAttempts)) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        return this.executeRequest(url, config, attempt + 1)
      }

      return {
        success: false,
        error: error.name === 'AbortError' ? '请求超时' : '网络错误'
      }
    }
  }

  // GET请求
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseURL)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return this.executeRequest<T>(url.toString(), {
      method: HttpMethod.GET
    })
  }

  // POST请求
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseURL)
    
    return this.executeRequest<T>(url.toString(), {
      method: HttpMethod.POST,
      body: data
    })
  }

  // PUT请求
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseURL)
    
    return this.executeRequest<T>(url.toString(), {
      method: HttpMethod.PUT,
      body: data
    })
  }

  // DELETE请求
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseURL)
    
    return this.executeRequest<T>(url.toString(), {
      method: HttpMethod.DELETE
    })
  }

  // PATCH请求
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseURL)
    
    return this.executeRequest<T>(url.toString(), {
      method: HttpMethod.PATCH,
      body: data
    })
  }

  // 分页请求
  async getPaginated<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<PaginatedResponse<T>> {
    return this.get<T[]>(endpoint, params) as Promise<PaginatedResponse<T>>
  }

  // 文件上传
  async upload(endpoint: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<any>> {
    const url = new URL(endpoint, this.baseURL)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const xhr = new XMLHttpRequest()
      
      return new Promise((resolve) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = (event.loaded / event.total) * 100
            onProgress(progress)
          }
        })

        xhr.addEventListener('load', () => {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch {
            resolve({
              success: false,
              error: '上传响应格式错误'
            })
          }
        })

        xhr.addEventListener('error', () => {
          resolve({
            success: false,
            error: '上传失败'
          })
        })

        xhr.open('POST', url.toString())
        
        const token = this.getAuthToken()
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        }
        
        xhr.send(formData)
      })
    } catch (error) {
      return {
        success: false,
        error: '上传失败'
      }
    }
  }

  // 批量请求
  async batch<T>(requests: Array<{ endpoint: string; method: HttpMethod; data?: any }>): Promise<ApiResponse<T[]>> {
    try {
      const promises = requests.map(req => {
        switch (req.method) {
          case HttpMethod.GET:
            return this.get(req.endpoint)
          case HttpMethod.POST:
            return this.post(req.endpoint, req.data)
          case HttpMethod.PUT:
            return this.put(req.endpoint, req.data)
          case HttpMethod.DELETE:
            return this.delete(req.endpoint)
          case HttpMethod.PATCH:
            return this.patch(req.endpoint, req.data)
          default:
            return Promise.resolve({ success: false, error: '不支持的请求方法' })
        }
      })

      const results = await Promise.all(promises)
      
      return {
        success: true,
        data: results as T[]
      }
    } catch (error) {
      return {
        success: false,
        error: '批量请求失败'
      }
    }
  }
}

// 创建全局API客户端实例
export const apiClient = new ApiClient()

// 添加默认拦截器
apiClient.addRequestInterceptor((config) => {
  // 请求日志
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Request] ${config.method} ${config.body ? 'with data' : ''}`)
  }
  return config
})

apiClient.addResponseInterceptor((response) => {
  // 响应日志
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Response] ${response.success ? 'Success' : 'Error'}`, response)
  }
  return response
})

export default apiClient
