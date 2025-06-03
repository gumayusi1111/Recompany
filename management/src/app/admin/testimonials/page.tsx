/**
 * 客户好评管理页面
 * 管理客户评价和反馈
 */

'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit, Trash2, Eye, Star, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function TestimonialsManagePage() {
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchReviews()
  }, [pagination.page])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      // TODO: 实现API调用
      setTimeout(() => {
        setReviews([])
        setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }))
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      setLoading(false)
    }
  }

  const columns = [
    {
      key: 'avatar',
      title: '头像',
      render: (value: string, record: any) => (
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          {record.clientName?.charAt(0) || '客'}
        </div>
      )
    },
    {
      key: 'clientName',
      title: '客户姓名',
      sortable: true
    },
    {
      key: 'company',
      title: '公司',
      render: (value: string) => value || '-'
    },
    {
      key: 'rating',
      title: '评分',
      render: (value: number) => (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < value ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">{value}/5</span>
        </div>
      )
    },
    {
      key: 'content',
      title: '评价内容',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'projectType',
      title: '项目类型',
      render: (value: string) => (
        value ? <Badge variant="secondary">{value}</Badge> : '-'
      )
    },
    {
      key: 'status',
      title: '审核状态',
      render: (value: string) => {
        const statusConfig = {
          PENDING: { label: '待审核', variant: 'warning' as const, icon: Clock },
          APPROVED: { label: '已通过', variant: 'success' as const, icon: CheckCircle },
          REJECTED: { label: '已拒绝', variant: 'danger' as const, icon: XCircle }
        }
        const config = statusConfig[value as keyof typeof statusConfig]
        const Icon = config?.icon || Clock
        
        return (
          <div className="flex items-center">
            <Icon className="w-4 h-4 mr-1" />
            <Badge variant={config?.variant || 'secondary'}>
              {config?.label || value}
            </Badge>
          </div>
        )
      }
    },
    {
      key: 'isFeatured',
      title: '推荐',
      render: (value: boolean) => (
        value ? (
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
        ) : (
          <Star className="w-4 h-4 text-gray-300" />
        )
      )
    },
    {
      key: 'createdAt',
      title: '创建时间',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('zh-CN')
    },
    {
      key: 'actions',
      title: '操作',
      render: (value: any, record: any) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="客户好评"
        description="管理客户评价和反馈信息"
        action={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            添加评价
          </Button>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总评价数</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">待审核</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">已通过</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">平均评分</p>
              <p className="text-2xl font-bold text-gray-900">0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* 评价列表 */}
      <DataTable
        columns={columns}
        data={reviews}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        emptyText="暂无评价数据"
        emptyDescription="点击上方按钮添加第一个评价"
      />
    </div>
  )
}
