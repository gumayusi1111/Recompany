'use client'

import { useTheme, useGlobalActions } from '@/stores/globalStore'
import styles from './ThemeToggle.module.css'

/**
 * 主题切换组件
 * 支持白天/夜晚模式切换
 */
export function ThemeToggle() {
  const theme = useTheme()
  const { setTheme } = useGlobalActions()

  // 获取当前实际主题（处理system主题）
  const getCurrentTheme = () => {
    if (theme === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return 'light'
    }
    return theme
  }

  const currentTheme = getCurrentTheme()
  const isDark = currentTheme === 'dark'

  // 切换主题
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    setTheme(newTheme)
  }

  return (
    <button
      className={`${styles.themeToggle} ${isDark ? styles.dark : styles.light}`}
      onClick={toggleTheme}
      aria-label={isDark ? '切换到白天模式' : '切换到夜晚模式'}
      title={isDark ? '切换到白天模式' : '切换到夜晚模式'}
    >
      <div className={styles.toggleTrack}>
        <div className={styles.toggleThumb}>
          <span className={styles.icon}>
            {isDark ? '🌙' : '☀️'}
          </span>
        </div>
      </div>
    </button>
  )
}
