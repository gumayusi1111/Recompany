'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageNavigationProps, NavigationState } from './types'
import styles from './PageNavigation.module.css'

// 简单的向上箭头图标组件
const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
)

/**
 * 页面导航组件 - 重构简化版本
 * 确保在移动设备上完全不渲染
 */
export function PageNavigation({
  items,
  className = '',
  showBackToTop = true,
  offset = 80,
  position = 'left',
  autoHide = true,
  mobileBreakpoint = 768
}: PageNavigationProps) {
  // 简化的移动端检测
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false // SSR默认为桌面端
    }
    return window.innerWidth < mobileBreakpoint
  })

  // 组件状态
  const [state, setState] = useState<NavigationState>({
    activeSection: '',
    isVisible: false,
    isMobile: isMobile
  })

  // 简化的移动端检测监听
  useEffect(() => {
    const checkMobile = () => {
      const isMobileNow = window.innerWidth < mobileBreakpoint
      setIsMobile(isMobileNow)
      setState(prev => ({
        ...prev,
        isMobile: isMobileNow
      }))
    }

    // 监听窗口大小变化
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [mobileBreakpoint])

  // 平滑滚动到指定元素
  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }, [offset])

  // 回到顶部
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  // 处理导航点击
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const elementId = href.replace('#', '')
    scrollToElement(elementId)
  }, [scrollToElement])

  // 监听滚动事件，更新当前激活的区块
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset + 50

      // 显示/隐藏导航
      const isVisible = autoHide ? window.scrollY > 300 : true

      // 查找当前激活的区块
      let currentSection = ''
      for (const item of items) {
        const elementId = item.href.replace('#', '')
        const element = document.getElementById(elementId)
        if (element) {
          const elementTop = element.offsetTop
          const elementBottom = elementTop + element.offsetHeight
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            currentSection = elementId
            break
          }
        }
      }

      // 更新状态
      setState(prev => ({
        ...prev,
        activeSection: currentSection,
        isVisible: isVisible
      }))
    }

    // 初始检查
    handleScroll()

    // 添加滚动监听器
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [items, offset, autoHide])

  // 简化的移动端隐藏逻辑
  if (isMobile || state.isMobile) {
    return null
  }

  // 自动隐藏逻辑
  if (!state.isVisible && autoHide) {
    return null
  }

  // 构建容器类名
  const containerClasses = [
    styles.container,
    styles[position],
    state.isVisible ? styles.visible : styles.hidden,
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      className={containerClasses}
      data-mobile={false}
      data-visible={state.isVisible}
      data-testid="page-navigation-desktop"
    >
      <nav className={styles.nav}>
        {/* 导航项目 */}
        <ul className={styles.list}>
          {items.map((item) => {
            const elementId = item.href.replace('#', '')
            const isActive = state.activeSection === elementId

            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`${styles.item} ${isActive ? styles.active : ''}`}
                  title={item.label}
                >
                  {/* 激活指示器 */}
                  <div className={styles.indicator} />

                  {/* 导航点 */}
                  <div className={styles.dot} />

                  {/* 标签文字 */}
                  <span className={styles.label}>
                    {item.label}
                  </span>
                </a>
              </li>
            )
          })}

          {/* 回到顶部按钮 */}
          {showBackToTop && (
            <li className={styles.backToTop}>
              <button
                onClick={scrollToTop}
                className={styles.backToTopButton}
                title="回到顶部"
              >
                <ChevronUpIcon className={styles.backToTopIcon} />
                <span>回到顶部</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}
