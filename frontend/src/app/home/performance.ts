/**
 * 性能监控和优化工具
 * 用于监控首页性能指标和优化建议
 * 
 * @author AI Assistant
 * @version 1.0.0
 */

/**
 * 性能指标接口
 */
interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number  // First Contentful Paint
  lcp?: number  // Largest Contentful Paint
  fid?: number  // First Input Delay
  cls?: number  // Cumulative Layout Shift
  
  // 自定义指标
  dataLoadTime?: number     // 数据加载时间
  componentRenderTime?: number  // 组件渲染时间
  bundleSize?: number       // Bundle大小
  
  // 时间戳
  timestamp: number
}

/**
 * 性能监控类
 */
class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeObservers()
  }

  /**
   * 初始化性能观察器
   */
  private initializeObservers() {
    if (typeof window === 'undefined') return

    // 监控 Core Web Vitals
    this.observeWebVitals()
    
    // 监控资源加载
    this.observeResourceTiming()
  }

  /**
   * 监控 Core Web Vitals
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

      // CLS (Cumulative Layout Shift)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        this.recordMetric({ cls: clsValue })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)

    } catch (error) {
      console.warn('Performance Observer not supported:', error)
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
      console.warn('Resource timing observer not supported:', error)
    }
  }

  /**
   * 记录性能指标
   */
  recordMetric(metric: Partial<PerformanceMetrics>) {
    const existingMetric = this.metrics[this.metrics.length - 1]
    if (existingMetric && Date.now() - existingMetric.timestamp < 1000) {
      // 合并1秒内的指标
      Object.assign(existingMetric, metric)
    } else {
      this.metrics.push({
        ...metric,
        timestamp: Date.now()
      })
    }
  }

  /**
   * 测量数据加载时间
   */
  measureDataLoad<T>(promise: Promise<T>, label: string = 'data-load'): Promise<T> {
    const startTime = performance.now()
    
    return promise.then(result => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`)
      this.recordMetric({ dataLoadTime: duration })
      
      return result
    }).catch(error => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      console.log(`❌ ${label} failed: ${duration.toFixed(2)}ms`)
      this.recordMetric({ dataLoadTime: duration })
      
      throw error
    })
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
  getPerformanceReport(): PerformanceMetrics | null {
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
  private getAverageMetric(key: keyof PerformanceMetrics): number | undefined {
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
 * Bundle 分析工具
 */
export const bundleAnalyzer = {
  /**
   * 分析当前页面的 bundle 大小
   */
  analyzeBundleSize: () => {
    if (typeof window === 'undefined') return

    const scripts = Array.from(document.querySelectorAll('script[src]'))
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    
    console.group('📦 Bundle Analysis')
    console.log('Scripts:', scripts.length)
    console.log('Stylesheets:', styles.length)
    
    // 估算总大小（需要实际网络请求来获取准确大小）
    scripts.forEach((script: any) => {
      console.log(`Script: ${script.src}`)
    })
    
    styles.forEach((style: any) => {
      console.log(`Stylesheet: ${style.href}`)
    })
    
    console.groupEnd()
  },

  /**
   * 检查未使用的依赖
   */
  checkUnusedDependencies: () => {
    console.log('🔍 Checking for unused dependencies...')
    // 这里可以集成更复杂的分析逻辑
    console.log('建议使用 webpack-bundle-analyzer 进行详细分析')
  }
}
