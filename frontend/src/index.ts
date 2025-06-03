/**
 * 全局模块导出索引
 * 统一导出所有全局模块，方便引用
 * 
 * @author AI Assistant
 * @version 2.0.0
 */

// 全局配置
export * from './config/global'

// 全局类型
export * from './types/global'

// 状态管理
export * from './stores'

// 性能监控
export {
  performanceMonitor,
  usePerformanceMonitor,
  withPerformanceMonitoring
} from './lib/performance/monitor'

// SEO工具
export * from './lib/seo/core'
