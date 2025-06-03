'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { HeaderProps, NavigationItem, MobileMenuProps, NavigationLinkProps } from './types'
import { globalConfig } from '@/config/global'
import { ThemeToggle } from './ThemeToggle'
import styles from './Header.module.css'

/**
 * 默认导航菜单配置
 */
const defaultNavigationItems: NavigationItem[] = [
  { id: 'home', label: '首页', href: '/' },
  { id: 'about', label: '关于我们', href: '/about' },
  { id: 'products', label: '产品中心', href: '/products' },
  { id: 'cases', label: '工程案例', href: '/cases' },
  { id: 'materials', label: '技术文档', href: '/materials' },
  { id: 'news', label: '新闻资讯', href: '/news' },
  { id: 'contact', label: '联系我们', href: '/contact' }
]

/**
 * 默认公司信息
 */
const defaultCompanyInfo = {
  name: '亚豪膜结构',
  slogan: '30年专业经验 · 膜结构领域专家',
  logo: {
    src: '/images/logo.png',
    alt: '亚豪膜结构Logo',
    width: 50,
    height: 50
  }
}

/**
 * 导航链接组件
 */
function NavigationLink({ item, isActive, isMobile, onClick }: NavigationLinkProps) {
  const linkClass = isMobile 
    ? `${styles.mobileMenuLink} ${isActive ? styles.active : ''}`
    : `${styles.navigationLink} ${isActive ? styles.active : ''} ${item.isExternal ? styles.external : ''}`

  const linkContent = (
    <span>
      {item.label}
    </span>
  )

  if (item.isExternal) {
    return (
      <a
        href={item.href}
        className={linkClass}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        aria-label={`${item.label} (在新窗口中打开)`}
      >
        {linkContent}
      </a>
    )
  }

  return (
    <Link
      href={item.href}
      className={linkClass}
      onClick={onClick}
      aria-label={item.label}
    >
      {linkContent}
    </Link>
  )
}

/**
 * 移动端菜单组件
 */
function MobileMenu({ navigationItems, currentPath, isOpen, onClose }: MobileMenuProps) {
  return (
    <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
      <ul className={styles.mobileMenuList}>
        {navigationItems.map((item) => (
          <li key={item.id}>
            <NavigationLink
              item={item}
              isActive={currentPath === item.href}
              isMobile={true}
              onClick={onClose}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Header组件
 * 企业级响应式导航头部组件
 */
export function Header({
  companyInfo = defaultCompanyInfo,
  navigationItems = defaultNavigationItems,
  currentPath,
  showMobileMenu = false,
  onMobileMenuToggle,
  className = '',
  isFixed = true, // 默认启用固定定位
  isTransparent = false
}: HeaderProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(showMobileMenu)
  const [isScrolled, setIsScrolled] = useState(false)

  // 使用当前路径或传入的路径
  const activePath = currentPath || pathname

  // 处理移动端菜单切换
  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen
    setIsMobileMenuOpen(newState)
    onMobileMenuToggle?.()
  }

  // 关闭移动端菜单
  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  // 监听滚动事件（用于固定头部的样式变化）
  useEffect(() => {
    if (!isFixed) return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isFixed])

  // 阻止移动端菜单打开时的背景滚动
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // 构建header的CSS类名
  const headerClasses = [
    styles.header,
    isFixed && styles.fixed,
    isScrolled && styles.scrolled,
    (isTransparent || (isFixed && !isScrolled)) && styles.transparent,
    className
  ].filter(Boolean).join(' ')

  return (
    <header className={`${headerClasses} header-theme`} role="banner">
      <div className={styles.container}>
        {/* 左侧品牌区域 */}
        <Link href="/" className={styles.brand} aria-label="返回首页">
          <Image
            src={companyInfo.logo.src}
            alt={companyInfo.logo.alt}
            width={companyInfo.logo.width || 50}
            height={companyInfo.logo.height || 50}
            className={styles.logo}
            priority
          />
          <div className={styles.companyInfo}>
            <h1 className={styles.companyName}>{companyInfo.name}</h1>
            <p className={styles.companySlogan}>{companyInfo.slogan}</p>
          </div>
        </Link>

        {/* 右侧导航区域 */}
        <nav className={styles.navigation} role="navigation" aria-label="主导航">
          {/* 桌面端导航菜单 */}
          <ul className={styles.navigationList}>
            {navigationItems.map((item) => (
              <li key={item.id} className={styles.navigationItem}>
                <NavigationLink
                  item={item}
                  isActive={activePath === item.href}
                  isMobile={false}
                />
              </li>
            ))}
          </ul>

          {/* 主题切换按钮 */}
          <ThemeToggle />

          {/* 移动端菜单按钮 */}
          <button
            className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.open : ''}`}
            onClick={handleMobileMenuToggle}
            aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className={styles.hamburger}></span>
          </button>
        </nav>

        {/* 移动端菜单 */}
        <MobileMenu
          navigationItems={navigationItems}
          currentPath={activePath}
          isOpen={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
        />
      </div>

      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: companyInfo.name,
            url: globalConfig.env.siteUrl,
            logo: `${globalConfig.env.siteUrl}${companyInfo.logo.src}`,
            description: companyInfo.slogan,
            sameAs: [
              // 可以添加社交媒体链接
            ]
          })
        }}
      />
    </header>
  )
}
