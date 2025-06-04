/**
 * 全局性能监控工具
 * 用于监控应用性能指标和优化建议
 * 
 * @author AI Assistant
 * @version 2.0.0
 */

/**
 * 性能监控指标接口 - 兼容组件版本
 */
export interface PerformanceMonitorMetrics {
  // Core Web Vitals
  fcp?: number  // First Contentful Paint
  lcp?: number  // Largest Contentful Paint
  fid?: number  // First Input Delay
  cls?: number  // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
  inp?: number  // Interaction to Next Paint

  // 自定义指标
  dataLoadTime?: number     // 数据加载时间
  componentRenderTime?: number  // 组件渲染时间
  bundleSize?: number       // Bundle大小

  // 时间戳
  timestamp: number
}

/**
 * 向后兼容的类型别名
 */
export type PerformanceMetrics = PerformanceMonitorMetrics

/**
 * 性能监控类
 */
class PerformanceMonitor {
  private metrics: PerformanceMonitorMetrics[] = []
  private observers: PerformanceObserver[] = []
  private isInitialized = false
  private callbacks: ((metrics: PerformanceMonitorMetrics) => void)[] = []

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers()
    }
  }

  /**
   * 添加性能指标回调
   */
  addCallback(callback: (metrics: PerformanceMonitorMetrics) => void) {
    this.callbacks.push(callback)
  }

  /**
   * 移除性能指标回调
   */
  removeCallback(callback: (metrics: PerformanceMonitorMetrics) => void) {
    const index = this.callbacks.indexOf(callback)
    if (index > -1) {
      this.callbacks.splice(index, 1)
    }
  }

  /**
   * 初始化性能观察器
   */
  private initializeObservers() {
    if (this.isInitialized) return
    
    try {
      this.observeWebVitals()
      this.observeResourceTiming()
      this.isInitialized = true
    } catch (error) {
      console.warn('Performance monitoring initialization failed:', error)
    }
  }

  /**
   * 监控 Core Web Vitals - 增强版本
   */
  private observeWebVitals() {
    try {
      // FCP (First Contentful Paint)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fcp = entries.find(entry => entry.name === 'first-contentful-paint')
        if (fcp) {
          this.recordMetric({ fcp: fcp.startTime })
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })
      this.observers.push(fcpObserver)

      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          this.recordMetric({ lcp: lastEntry.startTime })
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(lcpObserver)

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEventTiming & {
            processingStart: number
            startTime: number
            name: string
          }
          if (fidEntry.name === 'first-input') {
            const fid = fidEntry.processingStart - fidEntry.startTime
            this.recordMetric({ fid })
          }
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
      this.observers.push(fidObserver)

      // CLS (Cumulative Layout Shift)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as PerformanceEntry & {
            hadRecentInput?: boolean
            value?: number
          }
          if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
            clsValue += layoutShiftEntry.value
          }
        }
        this.recordMetric({ cls: clsValue })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)

      // INP (Interaction to Next Paint)
      this.observeINP()

      // TTFB (Time to First Byte)
      this.observeTTFB()

    } catch (error) {
      console.warn('Web Vitals observer setup failed:', error)
    }
  }

  /**
   * 监控 INP (Interaction to Next Paint)
   */
  private observeINP() {
    try {
      let maxINP = 0
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const eventEntry = entry as PerformanceEventTiming & {
            processingStart: number
            processingEnd: number
            startTime: number
            interactionId?: number
          }

          if (eventEntry.interactionId) {
            const inp = eventEntry.processingEnd - eventEntry.startTime
            maxINP = Math.max(maxINP, inp)
            this.recordMetric({ inp: maxINP })

            // 如果INP超过200ms，记录详细信息用于调试
            if (inp > 200 && process.env.NODE_ENV === 'development') {
              console.warn('🐌 Slow interaction detected:', {
                inp: inp,
                entryType: entry.entryType,
                name: entry.name,
                startTime: eventEntry.startTime,
                processingStart: eventEntry.processingStart,
                processingEnd: eventEntry.processingEnd,
                target: (entry as PerformanceEventTiming & { target?: { tagName?: string } }).target?.tagName || 'unknown'
              })
            }
          }
        })
      })
      inpObserver.observe({ entryTypes: ['event'] })
      this.observers.push(inpObserver)
    } catch (error) {
      console.warn('INP monitoring failed:', error)
    }
  }

  /**
   * 监控 TTFB (Time to First Byte)
   */
  private observeTTFB() {
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart
        this.recordMetric({ ttfb })
      }
    } catch (error) {
      console.warn('TTFB monitoring failed:', error)
    }
  }

  /**
   * 监控资源加载时间
   */
  private observeResourceTiming() {
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.name.includes('chunk') || entry.name.includes('bundle')) {
            console.log(`📦 Bundle loaded: ${entry.name} - ${entry.duration}ms`)
          }
        })
      })
      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.push(resourceObserver)
    } catch (error) {
      console.warn('Resource timing observer setup failed:', error)
    }
  }

  /**
   * 记录性能指标
   */
  recordMetric(metric: Partial<PerformanceMonitorMetrics>) {
    const existingMetric = this.metrics[this.metrics.length - 1]
    let currentMetric: PerformanceMonitorMetrics

    if (existingMetric && Date.now() - existingMetric.timestamp < 1000) {
      // 合并1秒内的指标
      Object.assign(existingMetric, metric)
      currentMetric = existingMetric
    } else {
      currentMetric = {
        ...metric,
        timestamp: Date.now()
      }
      this.metrics.push(currentMetric)
    }

    // 触发回调
    this.callbacks.forEach(callback => {
      try {
        callback(currentMetric)
      } catch (error) {
        console.warn('Performance callback failed:', error)
      }
    })
  }

  /**
   * 测量数据加载时间
   */
  async measureDataLoad<T>(promise: Promise<T>, label: string = 'data-load'): Promise<T> {
    const startTime = performance.now()
    
    try {
      const result = await promise
      const endTime = performance.now()
      const duration = endTime - startTime
      
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`)
      this.recordMetric({ dataLoadTime: duration })
      
      return result
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      console.log(`❌ ${label} failed: ${duration.toFixed(2)}ms`)
      this.recordMetric({ dataLoadTime: duration })
      
      throw error
    }
  }

  /**
   * 测量组件渲染时间
   */
  measureRender(componentName: string, renderFn: () => void) {
    const startTime = performance.now()
    
    renderFn()
    
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.log(`🎨 ${componentName} render: ${duration.toFixed(2)}ms`)
    this.recordMetric({ componentRenderTime: duration })
  }

  /**
   * 获取性能报告
   */
  getPerformanceReport(): PerformanceMonitorMetrics | null {
    if (this.metrics.length === 0) return null

    const latest = this.metrics[this.metrics.length - 1]
    return {
      ...latest,
      // 计算平均值
      dataLoadTime: this.getAverageMetric('dataLoadTime'),
      componentRenderTime: this.getAverageMetric('componentRenderTime')
    }
  }

  /**
   * 获取指标平均值
   */
  private getAverageMetric(key: keyof PerformanceMonitorMetrics): number | undefined {
    const values = this.metrics
      .map(m => m[key])
      .filter((v): v is number => typeof v === 'number')
    
    if (values.length === 0) return undefined
    
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  /**
   * 生成性能建议
   */
  getPerformanceRecommendations(): string[] {
    const report = this.getPerformanceReport()
    if (!report) return []

    const recommendations: string[] = []

    // FCP 建议
    if (report.fcp && report.fcp > 2500) {
      recommendations.push('首次内容绘制时间过长，建议优化关键渲染路径')
    }

    // LCP 建议
    if (report.lcp && report.lcp > 4000) {
      recommendations.push('最大内容绘制时间过长，建议优化图片和字体加载')
    }

    // CLS 建议
    if (report.cls && report.cls > 0.25) {
      recommendations.push('累积布局偏移过大，建议为图片和广告预留空间')
    }

    // 数据加载建议
    if (report.dataLoadTime && report.dataLoadTime > 1000) {
      recommendations.push('数据加载时间过长，建议实施缓存策略')
    }

    return recommendations
  }

  /**
   * 清理观察器
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.isInitialized = false
  }
}

// 创建全局性能监控实例
export const performanceMonitor = new PerformanceMonitor()

/**
 * 性能监控 Hook
 */
export function usePerformanceMonitor() {
  return {
    measureDataLoad: performanceMonitor.measureDataLoad.bind(performanceMonitor),
    measureRender: performanceMonitor.measureRender.bind(performanceMonitor),
    getReport: performanceMonitor.getPerformanceReport.bind(performanceMonitor),
    getRecommendations: performanceMonitor.getPerformanceRecommendations.bind(performanceMonitor)
  }
}

/**
 * 集成RUM监控的性能测量装饰器
 */
export function withRUMMonitoring<T extends Record<string, unknown>>(
  pageName: string,
  fetchDataFn: () => Promise<T>
) {
  return async () => {
    const startTime = performance.now()

    try {
      const result = await performanceMonitor.measureDataLoad(fetchDataFn(), `${pageName}-data`)

      // 记录到RUM（如果可用）
      if (typeof window !== 'undefined') {
        const { rumMonitor } = await import('./rum')
        const duration = performance.now() - startTime
        rumMonitor.recordCustomMetric(`${pageName}_data_load_time`, duration, {
          pageName,
          success: true
        })
      }

      return result
    } catch (error) {
      // 记录错误到RUM
      if (typeof window !== 'undefined') {
        const { rumMonitor } = await import('./rum')
        const duration = performance.now() - startTime
        rumMonitor.recordCustomMetric(`${pageName}_data_load_time`, duration, {
          pageName,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }

      throw error
    }
  }
}

/**
 * 页面性能监控装饰器
 */
export function withPerformanceMonitoring<T extends Record<string, unknown>>(
  pageName: string,
  fetchDataFn: () => Promise<T>
) {
  return () => performanceMonitor.measureDataLoad(fetchDataFn(), `${pageName}-data`)
}

/**
 * 性能指标评分函数 - 从组件版本迁移
 */
export function getPerformanceScore(metrics: PerformanceMonitorMetrics): {
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  details: Record<string, { value: number; score: number; status: 'good' | 'needs-improvement' | 'poor' }>
} {
  const details: Record<string, { value: number; score: number; status: 'good' | 'needs-improvement' | 'poor' }> = {}
  let totalScore = 0
  let metricCount = 0

  // FCP评分 (0-2.5s: good, 2.5-4s: needs improvement, >4s: poor)
  if (metrics.fcp !== undefined) {
    const fcp = metrics.fcp / 1000 // 转换为秒
    let score = 100
    let status: 'good' | 'needs-improvement' | 'poor' = 'good'

    if (fcp > 4) {
      score = 0
      status = 'poor'
    } else if (fcp > 2.5) {
      score = 50
      status = 'needs-improvement'
    }

    details.fcp = { value: fcp, score, status }
    totalScore += score
    metricCount++
  }

  // LCP评分 (0-2.5s: good, 2.5-4s: needs improvement, >4s: poor)
  if (metrics.lcp !== undefined) {
    const lcp = metrics.lcp / 1000
    let score = 100
    let status: 'good' | 'needs-improvement' | 'poor' = 'good'

    if (lcp > 4) {
      score = 0
      status = 'poor'
    } else if (lcp > 2.5) {
      score = 50
      status = 'needs-improvement'
    }

    details.lcp = { value: lcp, score, status }
    totalScore += score
    metricCount++
  }

  // FID评分 (0-100ms: good, 100-300ms: needs improvement, >300ms: poor)
  if (metrics.fid !== undefined) {
    const fid = metrics.fid
    let score = 100
    let status: 'good' | 'needs-improvement' | 'poor' = 'good'

    if (fid > 300) {
      score = 0
      status = 'poor'
    } else if (fid > 100) {
      score = 50
      status = 'needs-improvement'
    }

    details.fid = { value: fid, score, status }
    totalScore += score
    metricCount++
  }

  // CLS评分 (0-0.1: good, 0.1-0.25: needs improvement, >0.25: poor)
  if (metrics.cls !== undefined) {
    const cls = metrics.cls
    let score = 100
    let status: 'good' | 'needs-improvement' | 'poor' = 'good'

    if (cls > 0.25) {
      score = 0
      status = 'poor'
    } else if (cls > 0.1) {
      score = 50
      status = 'needs-improvement'
    }

    details.cls = { value: cls, score, status }
    totalScore += score
    metricCount++
  }

  const averageScore = metricCount > 0 ? totalScore / metricCount : 0
  let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F'

  if (averageScore >= 90) grade = 'A'
  else if (averageScore >= 80) grade = 'B'
  else if (averageScore >= 70) grade = 'C'
  else if (averageScore >= 60) grade = 'D'

  return {
    score: Math.round(averageScore),
    grade,
    details
  }
}
