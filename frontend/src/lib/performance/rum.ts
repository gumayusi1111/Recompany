/**
 * 真实用户监控 (Real User Monitoring, RUM) 模块
 * 收集真实用户的性能数据和用户体验指标
 * 
 * @author AI Assistant
 * @version 1.0.0
 */

/**
 * RUM数据接口
 */
export interface RUMData {
  // 基础信息
  sessionId: string
  userId?: string
  timestamp: number
  url: string
  userAgent: string
  
  // 性能指标
  performanceMetrics: {
    // Core Web Vitals
    fcp?: number  // First Contentful Paint
    lcp?: number  // Largest Contentful Paint
    fid?: number  // First Input Delay
    cls?: number  // Cumulative Layout Shift
    ttfb?: number // Time to First Byte
    
    // 页面加载指标
    domContentLoaded?: number
    loadComplete?: number
    
    // 自定义指标
    dataLoadTime?: number
    componentRenderTime?: number
  }
  
  // 用户体验指标
  userExperience: {
    // 用户交互
    clickCount: number
    scrollDepth: number
    timeOnPage: number
    
    // 错误信息
    jsErrors: Array<{
      message: string
      stack?: string
      timestamp: number
    }>
    
    // 网络状态
    connectionType?: string
    effectiveType?: string
  }
  
  // 设备信息
  deviceInfo: {
    screenWidth: number
    screenHeight: number
    devicePixelRatio: number
    platform: string
    isMobile: boolean
  }
  
  // 地理位置（可选）
  location?: {
    country?: string
    region?: string
    city?: string
  }
}

/**
 * RUM配置接口
 */
export interface RUMConfig {
  // 基础配置
  enabled: boolean
  apiEndpoint: string
  apiKey?: string
  
  // 采样配置
  sampleRate: number // 0-1之间，1表示100%采样
  
  // 数据收集配置
  collectPerformance: boolean
  collectUserInteraction: boolean
  collectErrors: boolean
  collectDeviceInfo: boolean
  
  // 发送配置
  batchSize: number
  flushInterval: number // 毫秒
  maxRetries: number
  
  // 隐私配置
  anonymizeIP: boolean
  respectDNT: boolean // Do Not Track
}

/**
 * 默认RUM配置
 */
const DEFAULT_RUM_CONFIG: RUMConfig = {
  enabled: process.env.NODE_ENV === 'production',
  apiEndpoint: process.env.NEXT_PUBLIC_RUM_ENDPOINT || '/api/rum',
  sampleRate: 0.1, // 10%采样率
  collectPerformance: true,
  collectUserInteraction: true,
  collectErrors: true,
  collectDeviceInfo: true,
  batchSize: 10,
  flushInterval: 30000, // 30秒
  maxRetries: 3,
  anonymizeIP: true,
  respectDNT: true
}

/**
 * RUM监控类
 */
class RUMMonitor {
  private config: RUMConfig
  private sessionId: string
  private dataBuffer: RUMData[] = []
  private observers: PerformanceObserver[] = []
  private startTime: number
  private isInitialized = false
  private flushTimer?: NodeJS.Timeout

  constructor(config: Partial<RUMConfig> = {}) {
    this.config = { ...DEFAULT_RUM_CONFIG, ...config }
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
    
    if (typeof window !== 'undefined' && this.shouldCollectData()) {
      this.initialize()
    }
  }

  /**
   * 初始化RUM监控
   */
  private initialize() {
    if (this.isInitialized || !this.config.enabled) return

    try {
      // 初始化性能监控
      if (this.config.collectPerformance) {
        this.initializePerformanceMonitoring()
      }

      // 初始化用户交互监控
      if (this.config.collectUserInteraction) {
        this.initializeUserInteractionMonitoring()
      }

      // 初始化错误监控
      if (this.config.collectErrors) {
        this.initializeErrorMonitoring()
      }

      // 设置定时发送
      this.setupPeriodicFlush()

      // 页面卸载时发送数据
      this.setupBeforeUnload()

      this.isInitialized = true
      console.log('🔍 RUM监控已初始化')
    } catch (error) {
      console.error('RUM监控初始化失败:', error)
    }
  }

  /**
   * 检查是否应该收集数据
   */
  private shouldCollectData(): boolean {
    // 检查DNT设置
    if (this.config.respectDNT && navigator.doNotTrack === '1') {
      return false
    }

    // 采样率检查
    return Math.random() < this.config.sampleRate
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `rum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 初始化性能监控
   */
  private initializePerformanceMonitoring() {
    try {
      // 监控Core Web Vitals
      const vitalsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordPerformanceMetric(entry)
        }
      })

      vitalsObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] })
      this.observers.push(vitalsObserver)

      // 监控导航时间
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordNavigationTiming(entry as PerformanceNavigationTiming)
        }
      })

      navigationObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navigationObserver)

    } catch (error) {
      console.warn('性能监控初始化失败:', error)
    }
  }

  /**
   * 初始化用户交互监控
   */
  private initializeUserInteractionMonitoring() {
    let clickCount = 0
    let maxScrollDepth = 0

    // 点击监控
    document.addEventListener('click', () => {
      clickCount++
    })

    // 滚动深度监控
    document.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollDepth = Math.round((scrollTop + windowHeight) / documentHeight * 100)
      
      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth)
    })

    // 定期记录用户交互数据
    setInterval(() => {
      this.recordUserInteraction({
        clickCount,
        scrollDepth: maxScrollDepth,
        timeOnPage: Date.now() - this.startTime
      })
    }, 10000) // 每10秒记录一次
  }

  /**
   * 初始化错误监控
   */
  private initializeErrorMonitoring() {
    // JavaScript错误监控
    window.addEventListener('error', (event) => {
      this.recordError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now()
      })
    })

    // Promise rejection监控
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: Date.now()
      })
    })
  }

  /**
   * 记录性能指标
   */
  private recordPerformanceMetric(entry: PerformanceEntry) {
    const rumData = this.createBaseRUMData()
    
    switch (entry.entryType) {
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          rumData.performanceMetrics.fcp = entry.startTime
        }
        break
      case 'largest-contentful-paint':
        rumData.performanceMetrics.lcp = entry.startTime
        break
      case 'layout-shift':
        const layoutShift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
        if (!layoutShift.hadRecentInput && layoutShift.value !== undefined) {
          rumData.performanceMetrics.cls = (rumData.performanceMetrics.cls || 0) + layoutShift.value
        }
        break
    }

    this.addToBuffer(rumData)
  }

  /**
   * 记录导航时间
   */
  private recordNavigationTiming(entry: PerformanceNavigationTiming) {
    const rumData = this.createBaseRUMData()

    rumData.performanceMetrics.ttfb = entry.responseStart - entry.requestStart
    rumData.performanceMetrics.domContentLoaded = entry.domContentLoadedEventEnd - entry.fetchStart
    rumData.performanceMetrics.loadComplete = entry.loadEventEnd - entry.fetchStart

    this.addToBuffer(rumData)
  }

  /**
   * 记录用户交互
   */
  private recordUserInteraction(interaction: Partial<RUMData['userExperience']>) {
    const rumData = this.createBaseRUMData()
    rumData.userExperience = {
      clickCount: interaction.clickCount || 0,
      scrollDepth: interaction.scrollDepth || 0,
      timeOnPage: interaction.timeOnPage || 0,
      jsErrors: [],
      connectionType: this.getConnectionType(),
      effectiveType: this.getEffectiveConnectionType()
    }

    this.addToBuffer(rumData)
  }

  /**
   * 记录错误
   */
  private recordError(error: RUMData['userExperience']['jsErrors'][0]) {
    const rumData = this.createBaseRUMData()
    rumData.userExperience = {
      clickCount: 0,
      scrollDepth: 0,
      timeOnPage: Date.now() - this.startTime,
      jsErrors: [error],
      connectionType: this.getConnectionType(),
      effectiveType: this.getEffectiveConnectionType()
    }

    this.addToBuffer(rumData)
  }

  /**
   * 创建基础RUM数据
   */
  private createBaseRUMData(): RUMData {
    return {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      performanceMetrics: {},
      userExperience: {
        clickCount: 0,
        scrollDepth: 0,
        timeOnPage: 0,
        jsErrors: []
      },
      deviceInfo: {
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        devicePixelRatio: window.devicePixelRatio,
        platform: navigator.platform,
        isMobile: /Mobi|Android/i.test(navigator.userAgent)
      }
    }
  }

  /**
   * 获取网络连接类型
   */
  private getConnectionType(): string | undefined {
    const connection = (navigator as Navigator & {
      connection?: { type?: string };
      mozConnection?: { type?: string };
      webkitConnection?: { type?: string }
    }).connection || (navigator as Navigator & {
      connection?: { type?: string };
      mozConnection?: { type?: string };
      webkitConnection?: { type?: string }
    }).mozConnection || (navigator as Navigator & {
      connection?: { type?: string };
      mozConnection?: { type?: string };
      webkitConnection?: { type?: string }
    }).webkitConnection
    return connection?.type
  }

  /**
   * 获取有效连接类型
   */
  private getEffectiveConnectionType(): string | undefined {
    const connection = (navigator as Navigator & {
      connection?: { effectiveType?: string };
      mozConnection?: { effectiveType?: string };
      webkitConnection?: { effectiveType?: string }
    }).connection || (navigator as Navigator & {
      connection?: { effectiveType?: string };
      mozConnection?: { effectiveType?: string };
      webkitConnection?: { effectiveType?: string }
    }).mozConnection || (navigator as Navigator & {
      connection?: { effectiveType?: string };
      mozConnection?: { effectiveType?: string };
      webkitConnection?: { effectiveType?: string }
    }).webkitConnection
    return connection?.effectiveType
  }

  /**
   * 添加数据到缓冲区
   */
  private addToBuffer(data: RUMData) {
    this.dataBuffer.push(data)
    
    if (this.dataBuffer.length >= this.config.batchSize) {
      this.flush()
    }
  }

  /**
   * 发送数据到服务器
   */
  private async flush() {
    if (this.dataBuffer.length === 0) return

    const dataToSend = [...this.dataBuffer]
    this.dataBuffer = []

    try {
      await this.sendData(dataToSend)
    } catch (error) {
      console.error('RUM数据发送失败:', error)
      // 重新加入缓冲区进行重试
      this.dataBuffer.unshift(...dataToSend)
    }
  }

  /**
   * 发送数据到服务器
   */
  private async sendData(data: RUMData[], retryCount = 0): Promise<void> {
    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          data,
          metadata: {
            version: '1.0.0',
            timestamp: Date.now()
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      console.log(`📊 RUM数据已发送: ${data.length} 条记录`)
    } catch (error) {
      if (retryCount < this.config.maxRetries) {
        console.warn(`RUM数据发送失败，重试 ${retryCount + 1}/${this.config.maxRetries}:`, error)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)))
        return this.sendData(data, retryCount + 1)
      }
      throw error
    }
  }

  /**
   * 设置定期发送
   */
  private setupPeriodicFlush() {
    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  /**
   * 设置页面卸载时发送
   */
  private setupBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      if (this.dataBuffer.length > 0) {
        // 使用sendBeacon API确保数据发送
        const data = JSON.stringify({
          data: this.dataBuffer,
          metadata: {
            version: '1.0.0',
            timestamp: Date.now()
          }
        })

        navigator.sendBeacon(this.config.apiEndpoint, data)
      }
    })
  }

  /**
   * 手动记录自定义指标
   */
  public recordCustomMetric(name: string, value: number, metadata?: Record<string, unknown>) {
    const rumData = this.createBaseRUMData()
    rumData.performanceMetrics[name as keyof typeof rumData.performanceMetrics] = value

    if (metadata) {
      (rumData as RUMData & { customMetadata?: Record<string, unknown> }).customMetadata = metadata
    }

    this.addToBuffer(rumData)
  }

  /**
   * 清理资源
   */
  public cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    
    this.flush() // 发送剩余数据
  }
}

// 创建全局RUM监控实例
export const rumMonitor = new RUMMonitor()

/**
 * RUM监控Hook
 */
export function useRUMMonitor() {
  return {
    recordCustomMetric: rumMonitor.recordCustomMetric.bind(rumMonitor),
    cleanup: rumMonitor.cleanup.bind(rumMonitor)
  }
}
