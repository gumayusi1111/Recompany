'use client'

import { useEffect, useRef } from 'react'

export interface PerformanceMetrics {
  fcp?: number  // First Contentful Paint
  lcp?: number  // Largest Contentful Paint
  fid?: number  // First Input Delay
  cls?: number  // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
  inp?: number  // Interaction to Next Paint
}

interface PerformanceMonitorProps {
  enabled?: boolean
  sampleRate?: number
  onMetrics?: (metrics: PerformanceMetrics) => void
}

/**
 * 性能监控组件
 * 监控Core Web Vitals和其他性能指标
 */
export function PerformanceMonitor({ 
  enabled = true, 
  sampleRate = 0.1,
  onMetrics 
}: PerformanceMonitorProps) {
  const metricsRef = useRef<PerformanceMetrics>({})
  const observersRef = useRef<PerformanceObserver[]>([])

  useEffect(() => {
    if (!enabled || Math.random() > sampleRate) {
      return
    }

    // 检查浏览器支持
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    const metrics = metricsRef.current

    // 监控 First Contentful Paint (FCP)
    const observeFCP = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
          if (fcpEntry) {
            metrics.fcp = fcpEntry.startTime
            reportMetrics()
          }
        })
        observer.observe({ entryTypes: ['paint'] })
        observersRef.current.push(observer)
      } catch (error) {
        console.warn('FCP monitoring failed:', error)
      }
    }

    // 监控 Largest Contentful Paint (LCP)
    const observeLCP = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          if (lastEntry) {
            metrics.lcp = lastEntry.startTime
            reportMetrics()
          }
        })
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
        observersRef.current.push(observer)
      } catch (error) {
        console.warn('LCP monitoring failed:', error)
      }
    }

    // 监控 First Input Delay (FID)
    const observeFID = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            // 类型断言，因为first-input类型在TypeScript中可能不完整
            const fidEntry = entry as PerformanceEventTiming & {
              processingStart: number
              startTime: number
              name: string
            }
            if (fidEntry.name === 'first-input') {
              metrics.fid = fidEntry.processingStart - fidEntry.startTime
              reportMetrics()
            }
          })
        })
        observer.observe({ entryTypes: ['first-input'] })
        observersRef.current.push(observer)
      } catch (error) {
        console.warn('FID monitoring failed:', error)
      }
    }

    // 监控 Cumulative Layout Shift (CLS)
    const observeCLS = () => {
      try {
        let clsValue = 0
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            // 类型断言，因为layout-shift类型在TypeScript中可能不完整
            const clsEntry = entry as PerformanceEntry & {
              hadRecentInput: boolean
              value: number
            }
            if (!clsEntry.hadRecentInput) {
              clsValue += clsEntry.value
            }
          })
          metrics.cls = clsValue
          reportMetrics()
        })
        observer.observe({ entryTypes: ['layout-shift'] })
        observersRef.current.push(observer)
      } catch (error) {
        console.warn('CLS monitoring failed:', error)
      }
    }

    // 监控 Interaction to Next Paint (INP)
    const observeINP = () => {
      try {
        let maxINP = 0
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            // 类型断言，因为event类型在TypeScript中可能不完整
            const eventEntry = entry as PerformanceEventTiming & {
              processingStart: number
              processingEnd: number
              startTime: number
              interactionId?: number
            }

            // 只监控有交互ID的事件（真正的用户交互）
            if (eventEntry.interactionId) {
              const inp = eventEntry.processingEnd - eventEntry.startTime
              maxINP = Math.max(maxINP, inp)
              metrics.inp = maxINP
              reportMetrics()

              // 如果INP超过200ms，记录详细信息用于调试
              if (inp > 200 && process.env.NODE_ENV === 'development') {
                console.warn('🐌 Slow interaction detected:', {
                  inp: inp,
                  entryType: entry.entryType,
                  name: entry.name,
                  startTime: eventEntry.startTime,
                  processingStart: eventEntry.processingStart,
                  processingEnd: eventEntry.processingEnd,
                  target: (entry as any).target?.tagName || 'unknown'
                })
              }
            }
          })
        })
        observer.observe({ entryTypes: ['event'] })
        observersRef.current.push(observer)
      } catch (error) {
        console.warn('INP monitoring failed:', error)
      }
    }

    // 监控 Time to First Byte (TTFB)
    const observeTTFB = () => {
      try {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigationEntry) {
          metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart
          reportMetrics()
        }
      } catch (error) {
        console.warn('TTFB monitoring failed:', error)
      }
    }

    // 报告性能指标
    const reportMetrics = () => {
      if (onMetrics) {
        onMetrics({ ...metrics })
      }

      // 开发环境下在控制台输出
      if (process.env.NODE_ENV === 'development') {
        console.group('🚀 Performance Metrics')
        if (metrics.fcp) console.log(`FCP: ${metrics.fcp.toFixed(2)}ms`)
        if (metrics.lcp) console.log(`LCP: ${metrics.lcp.toFixed(2)}ms`)
        if (metrics.fid) console.log(`FID: ${metrics.fid.toFixed(2)}ms`)
        if (metrics.cls) console.log(`CLS: ${metrics.cls.toFixed(4)}`)
        if (metrics.ttfb) console.log(`TTFB: ${metrics.ttfb.toFixed(2)}ms`)
        console.groupEnd()
      }
    }

    // 启动所有监控
    observeFCP()
    observeLCP()
    observeFID()
    observeCLS()
    observeINP()
    observeTTFB()

    // 页面卸载时发送最终指标
    const handleBeforeUnload = () => {
      reportMetrics()
      
      // 如果支持，使用 sendBeacon 发送数据
      if ('sendBeacon' in navigator && process.env.NODE_ENV === 'production') {
        const data = JSON.stringify({
          url: window.location.href,
          metrics: metrics,
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        })

        // 这里可以替换为实际的分析端点
        try {
          navigator.sendBeacon('/api/analytics/performance', data)
        } catch (error) {
          console.warn('Failed to send performance data:', error)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // 清理函数
    return () => {
      observersRef.current.forEach(observer => {
        try {
          observer.disconnect()
        } catch (error) {
          console.warn('Failed to disconnect observer:', error)
        }
      })
      observersRef.current = []
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [enabled, sampleRate, onMetrics])

  // 性能监控组件不渲染任何UI
  return null
}

/**
 * 性能指标评分函数
 */
export function getPerformanceScore(metrics: PerformanceMetrics): {
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
