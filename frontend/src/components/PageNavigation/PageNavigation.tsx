'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageNavigationProps, NavigationState } from './types'

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

  // 桌面端样式
  const desktopStyles = {
    container: `fixed ${position}-6 top-1/2 transform -translate-y-1/2 z-50`,
    nav: 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-3',
    list: 'space-y-1',
    item: 'group relative flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out',
    backToTop: 'w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 group'
  }

  return (
    <div
      className={`${desktopStyles.container} ${className}`}
      data-mobile={false}
      data-visible={state.isVisible}
      data-testid="page-navigation-desktop"
    >
      <nav className={desktopStyles.nav}>
        {/* 导航项目 */}
        <ul className={desktopStyles.list}>
          {items.map((item) => {
            const elementId = item.href.replace('#', '')
            const isActive = state.activeSection === elementId

            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`
                    ${desktopStyles.item}
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:text-blue-700 dark:hover:text-blue-300 hover:scale-102'
                    }
                  `}
                  title={item.label}
                >
                  {/* 激活指示器 */}
                  <div className={`
                    absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r transition-all duration-300
                    ${isActive
                      ? 'bg-white opacity-100 shadow-lg'
                      : 'bg-blue-500 opacity-0 group-hover:opacity-50'
                    }
                  `} />

                  {/* 导航点 */}
                  <div className={`
                    w-3 h-3 rounded-full mr-4 transition-all duration-300 flex-shrink-0
                    ${isActive
                      ? 'bg-white shadow-lg scale-110'
                      : 'bg-gray-400 dark:bg-gray-500 group-hover:bg-blue-500 group-hover:scale-110'
                    }
                  `} />

                  {/* 标签文字 */}
                  <span className="whitespace-nowrap">
                    {item.label}
                  </span>
                </a>
              </li>
            )
          })}

          {/* 回到顶部按钮 */}
          {showBackToTop && (
            <li className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
              <button
                onClick={scrollToTop}
                className={`
                  ${desktopStyles.backToTop}
                  text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-gray-900 dark:hover:text-gray-200
                `}
                title="回到顶部"
              >
                <ChevronUpIcon className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-y-1" />
                <span className="font-medium">回到顶部</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}
