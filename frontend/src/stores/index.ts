/**
 * 全局状态管理入口
 * 统一管理所有Zustand stores
 * 
 * @author AI Assistant
 * @version 2.0.0
 */

// 导出所有store
export { useHomePageStore, homePageSelectors } from './pages/homeStore'
export { useGlobalStore, globalSelectors } from './globalStore'

// 导出store工具函数
export * from './utils/storeUtils'
export * from './types/storeTypes'

// 导出性能监控集成
export { withPerformanceMonitoring } from '../lib/performance/monitor'
