/**
 * 管理系统仪表板页面
 * 显示系统概览和统计信息
 */

'use client'

import { useEffect } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { Card } from '@/components/ui/Card'
import { StatsCards, RecentActivity } from './components'
import { useAppStore, setPageMeta } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import {
  BarChart3,
  Package,
  FileText,
  Bell,
  Users
} from 'lucide-react'



export default function DashboardPage() {
  const { user } = useAuthStore()

  // 设置页面元信息
  useEffect(() => {
    setPageMeta('仪表盘', [
      { label: '管理系统' }
    ])
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title={`欢迎回来，${user?.username || '管理员'}！`}
        description="系统概览和数据统计"
      />

      {/* 统计卡片 */}
      <StatsCards />

      {/* 图表和活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 数据图表 */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              数据趋势
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="h-64 flex items-center justify-center text-gray-500">
              图表组件待实现
            </div>
          </Card.Body>
        </Card>

        {/* 最近活动 */}
        <RecentActivity />
      </div>

      {/* 快速操作 */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">快速操作</h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors duration-200">
              <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <span className="text-sm font-medium">添加产品</span>
            </button>
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors duration-200">
              <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <span className="text-sm font-medium">新建案例</span>
            </button>
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors duration-200">
              <Bell className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <span className="text-sm font-medium">发布新闻</span>
            </button>
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors duration-200">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <span className="text-sm font-medium">查看评价</span>
            </button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
