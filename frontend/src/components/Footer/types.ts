/**
 * Footer组件类型定义
 * 
 * @author AI Assistant
 * @version 1.0.0
 */

/**
 * 联系信息接口
 */
export interface ContactInfo {
  phone: string
  email: string
  address: string
  workingHours: string
}

/**
 * 快速链接接口
 */
export interface QuickLink {
  id: string
  label: string
  href: string
  isExternal?: boolean
}

/**
 * 服务支持链接接口
 */
export interface ServiceLink {
  id: string
  label: string
  href: string
  isExternal?: boolean
}

/**
 * 公司信息接口
 */
export interface CompanyAbout {
  title: string
  description: string
  establishedYear?: number
  experience?: string
}

/**
 * 社交媒体链接接口
 */
export interface SocialLink {
  id: string
  name: string
  url: string
  icon: string
  ariaLabel: string
}

/**
 * Footer列配置接口
 */
export interface FooterColumn {
  id: string
  title: string
  type: 'about' | 'contact' | 'links' | 'services'
  content?: unknown
}

/**
 * Footer组件Props接口
 */
export interface FooterProps {
  /**
   * 公司关于信息
   */
  companyAbout?: CompanyAbout
  
  /**
   * 联系信息
   */
  contactInfo?: ContactInfo
  
  /**
   * 快速链接列表
   */
  quickLinks?: QuickLink[]
  
  /**
   * 服务支持链接列表
   */
  serviceLinks?: ServiceLink[]
  
  /**
   * 社交媒体链接
   */
  socialLinks?: SocialLink[]
  
  /**
   * 版权信息
   */
  copyright?: string
  
  /**
   * 备案信息
   */
  icp?: string
  
  /**
   * 自定义CSS类名
   */
  className?: string
  
  /**
   * 是否显示社交媒体链接
   */
  showSocialLinks?: boolean
  
  /**
   * 是否显示备案信息
   */
  showICP?: boolean
}

/**
 * Footer列组件Props接口
 */
export interface FooterColumnProps {
  /**
   * 列标题
   */
  title: string
  
  /**
   * 列内容
   */
  children: React.ReactNode
  
  /**
   * 自定义CSS类名
   */
  className?: string
}

/**
 * 联系信息组件Props接口
 */
export interface ContactInfoProps {
  /**
   * 联系信息数据
   */
  contactInfo: ContactInfo
}

/**
 * 链接列表组件Props接口
 */
export interface LinkListProps {
  /**
   * 链接列表
   */
  links: (QuickLink | ServiceLink)[]
  
  /**
   * 是否为双列布局
   */
  isDoubleColumn?: boolean
}

/**
 * 社交媒体组件Props接口
 */
export interface SocialLinksProps {
  /**
   * 社交媒体链接列表
   */
  socialLinks: SocialLink[]
}
