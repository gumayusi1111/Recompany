/**
 * PageNavigation组件类型定义
 * 
 * @author AI Assistant
 * @version 1.0.0
 */

/**
 * 导航项目接口
 */
export interface NavigationItem {
  id: string
  label: string
  href: string
}

/**
 * 页面导航组件属性接口
 */
export interface PageNavigationProps {
  items: NavigationItem[]
  className?: string
  showBackToTop?: boolean
  offset?: number
  position?: 'left' | 'right'
  autoHide?: boolean
  mobileBreakpoint?: number
}

/**
 * 导航组件变体类型
 */
export type NavigationVariant = 'full' | 'compact'

/**
 * 导航位置类型
 */
export type NavigationPosition = 'left' | 'right'

/**
 * 导航主题类型
 */
export type NavigationTheme = 'light' | 'dark' | 'auto'

/**
 * 扩展的页面导航组件属性接口
 */
export interface ExtendedPageNavigationProps extends PageNavigationProps {
  variant?: NavigationVariant
  position?: NavigationPosition
  theme?: NavigationTheme
  autoHide?: boolean
  mobileBreakpoint?: number
}

/**
 * 导航状态接口
 */
export interface NavigationState {
  activeSection: string
  isVisible: boolean
  isMobile: boolean
}

/**
 * 滚动配置接口
 */
export interface ScrollConfig {
  behavior: 'smooth' | 'auto'
  offset: number
  duration?: number
}

/**
 * 移动端配置接口
 */
export interface MobileConfig {
  enabled: boolean
  breakpoint: number
  variant: NavigationVariant
  position: NavigationPosition
  autoHide: boolean
  touchTargetSize: number
}
