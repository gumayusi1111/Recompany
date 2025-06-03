/**
 * 统计卡片组件
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import './StatsCards.css'

interface StatItem {
  id: string
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ReactNode
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

interface StatsCardsProps {
  className?: string
}

export function StatsCards({ className }: StatsCardsProps) {
  const [stats, setStats] = useState<StatItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats([
        {
          id: 'products',
          title: '产品总数',
          value: 24,
          change: 12,
          changeType: 'increase',
          icon: '📦',
          color: 'blue'
        },
        {
          id: 'cases',
          title: '工程案例',
          value: 156,
          change: 8,
          changeType: 'increase',
          icon: '🏗️',
          color: 'green'
        },
        {
          id: 'testimonials',
          title: '客户好评',
          value: 89,
          change: -2,
          changeType: 'decrease',
          icon: '⭐',
          color: 'yellow'
        },
        {
          id: 'news',
          title: '新闻动态',
          value: 45,
          change: 0,
          changeType: 'neutral',
          icon: '📰',
          color: 'purple'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getTrendText = (change: number, changeType: string) => {
    if (changeType === 'neutral') return '无变化'
    const prefix = change > 0 ? '+' : ''
    return `${prefix}${change}%`
  }

  if (loading) {
    return (
      <div className={cn('stats-cards', className)}>
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="stats-card">
            <Card.Body className="stats-card__body">
              <div className="stats-card__skeleton">
                <div className="stats-card__skeleton-icon" />
                <div className="stats-card__skeleton-content">
                  <div className="stats-card__skeleton-title" />
                  <div className="stats-card__skeleton-value" />
                  <div className="stats-card__skeleton-change" />
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('stats-cards', className)}>
      {stats.map((stat) => (
        <Card key={stat.id} className="stats-card">
          <Card.Body className="stats-card__body">
            <div className="stats-card__content">
              <div className={cn(
                'stats-card__icon',
                `stats-card__icon--${stat.color}`
              )}>
                <span className="stats-card__icon-emoji">
                  {stat.icon}
                </span>
              </div>
              
              <div className="stats-card__info">
                <p className="stats-card__title">
                  {stat.title}
                </p>
                <p className="stats-card__value">
                  {stat.value}
                </p>
                <div className="stats-card__change">
                  {getTrendIcon(stat.changeType)}
                  <span className={cn(
                    'stats-card__change-text',
                    stat.changeType === 'increase' && 'text-green-600',
                    stat.changeType === 'decrease' && 'text-red-600',
                    stat.changeType === 'neutral' && 'text-gray-500'
                  )}>
                    {getTrendText(stat.change, stat.changeType)}
                  </span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  )
}
