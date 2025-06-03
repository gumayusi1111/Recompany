/**
 * 新闻管理页面
 * 管理新闻资讯和文章
 */

'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit, Trash2, Eye, Newspaper, FileText, Calendar } from 'lucide-react'

export default function NewsManagePage() {
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchNews()
  }, [pagination.page])

  const fetchNews = async () => {
    try {
      setLoading(true)
      // TODO: 实现API调用
      setTimeout(() => {
        setNews([])
        setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }))
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch news:', error)
      setLoading(false)
    }
  }

  const columns = [
    {
      key: 'image',
      title: '封面',
      render: (value: string) => (
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
          <Newspaper className="w-6 h-6 text-gray-400" />
        </div>
      )
    },
    {
      key: 'title',
      title: '新闻标题',
      sortable: true,
      render: (value: string) => (
        <div className="max-w-xs truncate font-medium" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'category',
      title: '分类',
      render: (value: string) => (
        <Badge variant="secondary">{value}</Badge>
      )
    },
    {
      key: 'author',
      title: '作者'
    },
    {
      key: 'status',
      title: '状态',
      render: (value: string) => {
        const statusConfig = {
          DRAFT: { label: '草稿', variant: 'secondary' as const },
          PUBLISHED: { label: '已发布', variant: 'success' as const },
          ARCHIVED: { label: '已归档', variant: 'warning' as const }
        }
        const config = statusConfig[value as keyof typeof statusConfig]
        
        return (
          <Badge variant={config?.variant || 'secondary'}>
            {config?.label || value}
          </Badge>
        )
      }
    },
    {
      key: 'publishDate',
      title: '发布时间',
      render: (value: string) => (
        value ? (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
            {new Date(value).toLocaleDateString('zh-CN')}
          </div>
        ) : '-'
      )
    },
    {
      key: 'viewCount',
      title: '浏览量',
      render: (value: number) => (
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-1 text-gray-400" />
          {value || 0}
        </div>
      )
    },
    {
      key: 'isFeatured',
      title: '推荐',
      render: (value: boolean) => (
        value ? (
          <Badge variant="warning">推荐</Badge>
        ) : (
          <span className="text-gray-400">-</span>
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
        title="新闻管理"
        description="管理新闻资讯和文章发布"
        action={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            发布新闻
          </Button>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Newspaper className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总新闻数</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">已发布</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Edit className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">草稿</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总浏览量</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* 新闻列表 */}
      <DataTable
        columns={columns}
        data={news}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        emptyText="暂无新闻数据"
        emptyDescription="点击上方按钮发布第一篇新闻"
      />
    </div>
  )
}
