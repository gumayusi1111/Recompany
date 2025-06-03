'use client'

import { useEffect } from 'react'
import { initializeGlobalStore } from '@/stores/globalStore'

/**
 * 主题提供者组件
 * 负责初始化主题系统和监听系统主题变化
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 初始化全局状态管理
    const cleanup = initializeGlobalStore()
    
    return cleanup
  }, [])

  return <>{children}</>
}
