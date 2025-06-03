/**
 * 全局组件导出索引
 * 统一导出所有全局组件
 * 
 * @author AI Assistant
 * @version 1.0.0
 */

// Header组件
export { Header } from './Header/Header'
export type { 
  HeaderProps, 
  NavigationItem, 
  CompanyInfo as HeaderCompanyInfo 
} from './Header/types'

// Footer组件
export { Footer } from './Footer/Footer'
export type { 
  FooterProps, 
  ContactInfo, 
  QuickLink, 
  ServiceLink,
  CompanyAbout,
  SocialLink
} from './Footer/types'
