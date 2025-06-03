/**
 * 管理系统头部组件
 */

'use client'

import { Menu, Bell, Search, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import './AdminHeader.css'

interface AdminHeaderProps {
  onMenuClick: () => void
  pageTitle: string
}

export function AdminHeader({ onMenuClick, pageTitle }: AdminHeaderProps) {
  return (
    <div className="admin-header">
      <div className="admin-header__content">
        <div className="admin-header__left">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="admin-header__menu-button lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="admin-header__title-section">
            <h1 className="admin-header__title">
              {pageTitle}
            </h1>
          </div>
        </div>
        
        <div className="admin-header__right">
          {/* 搜索框 */}
          <div className="admin-header__search">
            <div className="admin-header__search-input">
              <Search className="admin-header__search-icon" />
              <input
                type="text"
                placeholder="搜索..."
                className="admin-header__search-field"
              />
            </div>
          </div>

          {/* 通知 */}
          <Button
            variant="ghost"
            size="icon"
            className="admin-header__notification"
          >
            <Bell className="w-5 h-5" />
            <span className="admin-header__notification-badge">3</span>
          </Button>

          {/* 设置 */}
          <Button
            variant="ghost"
            size="icon"
            className="admin-header__settings"
          >
            <Settings className="w-5 h-5" />
          </Button>

          {/* 日期显示 */}
          <div className="admin-header__date">
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
