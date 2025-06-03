/**
 * PageNavigation组件统一导出
 * 
 * @author AI Assistant
 * @version 1.0.0
 */

// 导出组件
export { PageNavigation } from './PageNavigation'
export { CompactPageNavigation } from './CompactPageNavigation'

// 导出类型
export type {
  NavigationItem,
  PageNavigationProps,
  ExtendedPageNavigationProps,
  NavigationVariant,
  NavigationPosition,
  NavigationTheme,
  NavigationState,
  ScrollConfig,
  MobileConfig
} from './types'

// 默认导出完整版组件
export { PageNavigation as default } from './PageNavigation'

/**
 * 组件使用指南
 * 
 * 基础用法：
 * ```tsx
 * import { PageNavigation } from '@/components/PageNavigation'
 * 
 * const navigationItems = [
 *   { id: 'hero', label: '首页', href: '#hero-section' },
 *   { id: 'about', label: '关于我们', href: '#about-section' }
 * ]
 * 
 * <PageNavigation items={navigationItems} />
 * ```
 * 
 * 紧凑版用法：
 * ```tsx
 * import { CompactPageNavigation } from '@/components/PageNavigation'
 *
 * <CompactPageNavigation
 *   items={navigationItems}
 *   position="right"
 * />
 * ```
 *
 * 移动端优化：
 * ```tsx
 * <PageNavigation
 *   items={navigationItems}
 *   mobileBreakpoint={768}
 *   autoHide={true}
 * />
 * ```
 */
