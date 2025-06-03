'use client'

import { useEffect, useCallback } from 'react'
import {
  performanceMonitor,
  type PerformanceMonitorMetrics
} from '@/lib/performance/monitor'

// 向后兼容的类型导出
export type PerformanceMetrics = PerformanceMonitorMetrics

interface PerformanceMonitorProps {
  enabled?: boolean
  sampleRate?: number
  onMetrics?: (metrics: PerformanceMetrics) => void
}

/**
 * 性能监控组件 - 重构版本
 * 使用lib/performance/monitor.ts中的统一监控功能
 * 保持向后兼容的API接口
 */
export function PerformanceMonitor({
  enabled = true,
  sampleRate = 0.1,
  onMetrics
}: PerformanceMonitorProps) {

  // 创建回调函数，用于处理性能指标
  const handleMetrics = useCallback((metrics: PerformanceMetrics) => {
    if (onMetrics) {
      onMetrics(metrics)
    }

    // 开发环境下在控制台输出 - 保持原有的日志格式
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics')
      if (metrics.fcp) console.log(`FCP: ${metrics.fcp.toFixed(2)}ms`)
      if (metrics.lcp) console.log(`LCP: ${metrics.lcp.toFixed(2)}ms`)
      if (metrics.fid) console.log(`FID: ${metrics.fid.toFixed(2)}ms`)
      if (metrics.cls) console.log(`CLS: ${metrics.cls.toFixed(4)}`)
      if (metrics.ttfb) console.log(`TTFB: ${metrics.ttfb.toFixed(2)}ms`)
      if (metrics.inp) console.log(`INP: ${metrics.inp.toFixed(2)}ms`)
      console.groupEnd()
    }
  }, [onMetrics])

  useEffect(() => {
    if (!enabled || Math.random() > sampleRate) {
      return
    }

    // 添加回调到性能监控器
    performanceMonitor.addCallback(handleMetrics)

    // 页面卸载时发送最终指标 - 保持原有的sendBeacon功能
    const handleBeforeUnload = () => {
      const report = performanceMonitor.getPerformanceReport()
      if (report && 'sendBeacon' in navigator && process.env.NODE_ENV === 'production') {
        const data = JSON.stringify({
          url: window.location.href,
          metrics: report,
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        })

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
      performanceMonitor.removeCallback(handleMetrics)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [enabled, sampleRate, handleMetrics])

  // 性能监控组件不渲染任何UI
  return null
}

// 重新导出lib中的函数，保持向后兼容性
export {
  getPerformanceScore,
  performanceMonitor,
  usePerformanceMonitor
} from '@/lib/performance/monitor'
