/**
 * 路由配置文件
 * 统一管理所有路由路径，避免硬编码
 */

// 管理系统路由
export const ADMIN_ROUTES = {
  // 认证相关
  LOGIN: '/login',
  LOGOUT: '/logout',
  
  // 管理页面
  DASHBOARD: '/admin/dashboard',
  HOME: '/admin/home',
  PRODUCTS: '/admin/products',
  CASES: '/admin/cases',
  MATERIALS: '/admin/materials',
  TESTIMONIALS: '/admin/testimonials',
  NEWS: '/admin/news',
  CONTACT: '/admin/contact',
  ABOUT: '/admin/about',
  SETTINGS: '/admin/settings',
} as const

// 公开页面路由
export const PUBLIC_ROUTES = {
  REQUEST: '/request',
  CONTACT: '/contact',
} as const

// 管理系统导航配置
export interface NavItem {
  name: string
  href: string
  icon: string
  description?: string
  badge?: number
  children?: NavItem[]
}

export const ADMIN_NAVIGATION: NavItem[] = [
  {
    name: '仪表盘',
    href: ADMIN_ROUTES.DASHBOARD,
    icon: 'LayoutDashboard',
    description: '系统概览和统计数据'
  },
  {
    name: '内容管理',
    href: '#',
    icon: 'FileText',
    description: '网站内容管理',
    children: [
      {
        name: '首页管理',
        href: ADMIN_ROUTES.HOME,
        icon: 'Home',
        description: '轮播图、SEO、公司介绍'
      },
      {
        name: '产品管理',
        href: ADMIN_ROUTES.PRODUCTS,
        icon: 'Package',
        description: '产品信息和分类管理'
      },
      {
        name: '案例管理',
        href: ADMIN_ROUTES.CASES,
        icon: 'Building2',
        description: '工程案例展示管理'
      },
      {
        name: '材料管理',
        href: ADMIN_ROUTES.MATERIALS,
        icon: 'Layers',
        description: '材料信息和规格管理'
      },
      {
        name: '客户好评',
        href: ADMIN_ROUTES.TESTIMONIALS,
        icon: 'Star',
        description: '客户评价和反馈管理'
      },
      {
        name: '新闻管理',
        href: ADMIN_ROUTES.NEWS,
        icon: 'Newspaper',
        description: '新闻资讯发布管理'
      }
    ]
  },
  {
    name: '信息管理',
    href: '#',
    icon: 'Info',
    description: '公司信息管理',
    children: [
      {
        name: '联系管理',
        href: ADMIN_ROUTES.CONTACT,
        icon: 'Phone',
        description: '联系方式和地址管理'
      },
      {
        name: '关于管理',
        href: ADMIN_ROUTES.ABOUT,
        icon: 'Building',
        description: '公司介绍和历史管理'
      }
    ]
  },
  {
    name: '用户请求',
    href: '/admin/requests',
    icon: 'MessageSquare',
    description: '用户咨询和报价请求',
    badge: 0 // 动态更新
  },
  {
    name: '系统设置',
    href: ADMIN_ROUTES.SETTINGS,
    icon: 'Settings',
    description: '系统配置和管理员设置'
  }
]

// 面包屑导航配置
export const BREADCRUMB_CONFIG: Record<string, string[]> = {
  [ADMIN_ROUTES.DASHBOARD]: ['仪表盘'],
  [ADMIN_ROUTES.HOME]: ['内容管理', '首页管理'],
  [ADMIN_ROUTES.PRODUCTS]: ['内容管理', '产品管理'],
  [ADMIN_ROUTES.CASES]: ['内容管理', '案例管理'],
  [ADMIN_ROUTES.MATERIALS]: ['内容管理', '材料管理'],
  [ADMIN_ROUTES.TESTIMONIALS]: ['内容管理', '客户好评'],
  [ADMIN_ROUTES.NEWS]: ['内容管理', '新闻管理'],
  [ADMIN_ROUTES.CONTACT]: ['信息管理', '联系管理'],
  [ADMIN_ROUTES.ABOUT]: ['信息管理', '关于管理'],
  '/admin/requests': ['用户请求'],
  [ADMIN_ROUTES.SETTINGS]: ['系统设置'],
}

// 页面标题配置
export const PAGE_TITLES: Record<string, string> = {
  [ADMIN_ROUTES.DASHBOARD]: '仪表盘',
  [ADMIN_ROUTES.HOME]: '首页管理',
  [ADMIN_ROUTES.PRODUCTS]: '产品管理',
  [ADMIN_ROUTES.CASES]: '案例管理',
  [ADMIN_ROUTES.MATERIALS]: '材料管理',
  [ADMIN_ROUTES.TESTIMONIALS]: '客户好评',
  [ADMIN_ROUTES.NEWS]: '新闻管理',
  [ADMIN_ROUTES.CONTACT]: '联系管理',
  [ADMIN_ROUTES.ABOUT]: '关于管理',
  '/admin/requests': '用户请求',
  [ADMIN_ROUTES.SETTINGS]: '系统设置',
  [PUBLIC_ROUTES.REQUEST]: '咨询报价',
  [PUBLIC_ROUTES.CONTACT]: '联系我们',
}

// 路由权限配置
export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  [ADMIN_ROUTES.DASHBOARD]: ['ADMIN', 'SUPER_ADMIN'],
  [ADMIN_ROUTES.HOME]: ['ADMIN', 'SUPER_ADMIN'],
  [ADMIN_ROUTES.PRODUCTS]: ['ADMIN', 'SUPER_ADMIN'],
  [ADMIN_ROUTES.CASES]: ['ADMIN', 'SUPER_ADMIN'],
  [ADMIN_ROUTES.MATERIALS]: ['ADMIN', 'SUPER_ADMIN'],
  [ADMIN_ROUTES.TESTIMONIALS]: ['ADMIN', 'SUPER_ADMIN'],
  [ADMIN_ROUTES.NEWS]: ['ADMIN', 'SUPER_ADMIN'],
  [ADMIN_ROUTES.CONTACT]: ['ADMIN', 'SUPER_ADMIN'],
  [ADMIN_ROUTES.ABOUT]: ['ADMIN', 'SUPER_ADMIN'],
  '/admin/requests': ['ADMIN', 'SUPER_ADMIN'],
  [ADMIN_ROUTES.SETTINGS]: ['SUPER_ADMIN'], // 仅超级管理员
}

// 工具函数
export function getPageTitle(pathname: string): string {
  return PAGE_TITLES[pathname] || '管理系统'
}

export function getBreadcrumb(pathname: string): string[] {
  return BREADCRUMB_CONFIG[pathname] || []
}

export function hasPermission(pathname: string, userRole: string): boolean {
  const requiredRoles = ROUTE_PERMISSIONS[pathname]
  if (!requiredRoles) return true
  return requiredRoles.includes(userRole)
}

export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin')
}

export function isPublicRoute(pathname: string): boolean {
  return Object.values(PUBLIC_ROUTES).includes(pathname as any)
}
