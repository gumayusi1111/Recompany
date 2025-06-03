/**
 * 最近活动组件
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import './RecentActivity.css'

interface ActivityItem {
  id: string
  type: 'create' | 'update' | 'delete' | 'approve' | 'reject'
  title: string
  description: string
  user: string
  timestamp: string
  module: string
}

interface RecentActivityProps {
  className?: string
}

export function RecentActivity({ className }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setActivities([
        {
          id: '1',
          type: 'create',
          title: '创建新产品',
          description: '添加了新的张拉膜结构产品',
          user: '管理员',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          module: '产品管理'
        },
        {
          id: '2',
          type: 'approve',
          title: '审核客户评价',
          description: '通过了来自北京客户的5星评价',
          user: '管理员',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          module: '客户好评'
        },
        {
          id: '3',
          type: 'update',
          title: '更新工程案例',
          description: '修改了上海体育馆项目的详细信息',
          user: '编辑员',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          module: '案例管理'
        },
        {
          id: '4',
          type: 'create',
          title: '发布新闻',
          description: '发布了关于新材料技术的新闻',
          user: '编辑员',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          module: '新闻管理'
        },
        {
          id: '5',
          type: 'delete',
          title: '删除过期内容',
          description: '清理了过期的材料信息',
          user: '管理员',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
          module: '材料管理'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create':
        return '➕'
      case 'update':
        return '✏️'
      case 'delete':
        return '🗑️'
      case 'approve':
        return '✅'
      case 'reject':
        return '❌'
      default:
        return '📝'
    }
  }

  const getActivityBadgeVariant = (type: string) => {
    switch (type) {
      case 'create':
        return 'success'
      case 'update':
        return 'info'
      case 'delete':
        return 'danger'
      case 'approve':
        return 'success'
      case 'reject':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const getActivityTypeText = (type: string) => {
    switch (type) {
      case 'create':
        return '创建'
      case 'update':
        return '更新'
      case 'delete':
        return '删除'
      case 'approve':
        return '审核通过'
      case 'reject':
        return '审核拒绝'
      default:
        return '操作'
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <Card.Header>
          <h3 className="text-lg font-semibold">最近活动</h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="recent-activity__skeleton">
                <div className="recent-activity__skeleton-icon" />
                <div className="recent-activity__skeleton-content">
                  <div className="recent-activity__skeleton-title" />
                  <div className="recent-activity__skeleton-description" />
                  <div className="recent-activity__skeleton-meta" />
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <Card.Header>
        <h3 className="text-lg font-semibold">最近活动</h3>
      </Card.Header>
      <Card.Body>
        <div className="recent-activity__list">
          {activities.map((activity) => (
            <div key={activity.id} className="recent-activity__item">
              <div className="recent-activity__icon">
                <span className="recent-activity__icon-emoji">
                  {getActivityIcon(activity.type)}
                </span>
              </div>
              
              <div className="recent-activity__content">
                <div className="recent-activity__header">
                  <h4 className="recent-activity__title">
                    {activity.title}
                  </h4>
                  <Badge 
                    variant={getActivityBadgeVariant(activity.type) as any}
                    size="sm"
                  >
                    {getActivityTypeText(activity.type)}
                  </Badge>
                </div>
                
                <p className="recent-activity__description">
                  {activity.description}
                </p>
                
                <div className="recent-activity__meta">
                  <span className="recent-activity__user">
                    {activity.user}
                  </span>
                  <span className="recent-activity__separator">•</span>
                  <span className="recent-activity__module">
                    {activity.module}
                  </span>
                  <span className="recent-activity__separator">•</span>
                  <span className="recent-activity__time">
                    {formatDate(activity.timestamp, 'time')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}
