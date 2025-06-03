'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageNavigationProps, NavigationState } from './types'

/**
 * 紧凑版页面导航组件 - 重构简化版本
 * 只显示导航点，悬停时显示标签，确保在移动设备上完全不渲染
 */
export function CompactPageNavigation({
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
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLButtonElement>, href: string) => {
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

  // 桌面端配置
  const dotSize = 'w-4 h-4'
  const spacing = 'space-y-4'
  const containerPosition = `fixed ${position}-4 top-1/2 transform -translate-y-1/2 z-50`

  return (
    <div className={`${containerPosition} ${className}`}>
      <div className={`flex flex-col ${spacing} bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-gray-200/50 dark:border-gray-700/50`}>
        {/* 导航点 */}
        {items.map((item) => {
          const elementId = item.href.replace('#', '')
          const isActive = state.activeSection === elementId

          return (
            <div key={item.id} className="relative group">
              <button
                onClick={(e) => handleNavClick(e, item.href)}
                className={`
                  ${dotSize} rounded-full transition-all duration-300 hover:scale-125
                  ${isActive 
                    ? 'bg-blue-500 scale-125 shadow-lg shadow-blue-500/25' 
                    : 'bg-gray-400 dark:bg-gray-500 hover:bg-blue-400'
                  }
                `}
                title={item.label}
              />

              {/* 悬停标签 - 桌面端显示 */}
              <div className="absolute left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                  {item.label}
                  {/* 箭头指示器 */}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900 dark:border-r-gray-100"></div>
                </div>
              </div>
            </div>
          )
        })}

        {/* 回到顶部按钮 */}
        {showBackToTop && (
          <div className="relative group">
            <button
              onClick={scrollToTop}
              className={`${dotSize} rounded-full bg-gray-400 dark:bg-gray-500 hover:bg-blue-400 transition-all duration-300 hover:scale-125`}
              title="回到顶部"
            />

            {/* 悬停标签 - 桌面端显示 */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
              <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                回到顶部
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900 dark:border-r-gray-100"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
