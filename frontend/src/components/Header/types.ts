/**
 * Header组件类型定义
 * 
 * @author AI Assistant
 * @version 1.0.0
 */

/**
 * 导航菜单项接口
 */
export interface NavigationItem {
  id: string
  label: string
  href: string
  isActive?: boolean
  isExternal?: boolean
  children?: NavigationItem[]
}

/**
 * 公司信息接口
 */
export interface CompanyInfo {
  name: string
  slogan: string
  logo: {
    src: string
    alt: string
    width?: number
    height?: number
  }
}

/**
 * Header组件Props接口
 */
export interface HeaderProps {
  /**
   * 公司信息
   */
  companyInfo?: CompanyInfo
  
  /**
   * 导航菜单项
   */
  navigationItems?: NavigationItem[]
  
  /**
   * 当前页面路径（用于高亮当前页面）
   */
  currentPath?: string
  
  /**
   * 是否显示移动端菜单
   */
  showMobileMenu?: boolean
  
  /**
   * 移动端菜单切换回调
   */
  onMobileMenuToggle?: () => void
  
  /**
   * 自定义CSS类名
   */
  className?: string
  
  /**
   * 是否固定在顶部
   */
  isFixed?: boolean
  
  /**
   * 是否透明背景
   */
  isTransparent?: boolean
}

/**
 * 移动端菜单Props接口
 */
export interface MobileMenuProps {
  /**
   * 导航菜单项
   */
  navigationItems: NavigationItem[]
  
  /**
   * 当前页面路径
   */
  currentPath?: string
  
  /**
   * 是否显示菜单
   */
  isOpen: boolean
  
  /**
   * 关闭菜单回调
   */
  onClose: () => void
}

/**
 * 导航链接Props接口
 */
export interface NavigationLinkProps {
  /**
   * 导航项数据
   */
  item: NavigationItem
  
  /**
   * 是否为当前页面
   */
  isActive?: boolean
  
  /**
   * 是否为移动端
   */
  isMobile?: boolean
  
  /**
   * 点击回调
   */
  onClick?: () => void
}
