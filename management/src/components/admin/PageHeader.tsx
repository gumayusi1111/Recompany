/**
 * 页面头部组件
 * 统一的页面标题和操作区域
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  breadcrumb?: React.ReactNode
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  breadcrumb,
  className,
}) => {
  return (
    <div className={cn('mb-6', className)}>
      {breadcrumb && (
        <div className="mb-2">
          {breadcrumb}
        </div>
      )}
      
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        
        {action && (
          <div className="ml-4 flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  )
}
