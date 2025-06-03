/**
 * 案例管理页面
 * 管理工程案例信息
 */

'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit, Trash2, Eye, Star, Building2, MapPin, ExternalLink } from 'lucide-react'

export default function CasesManagePage() {
  const [loading, setLoading] = useState(true)
  const [cases, setCases] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchCases()
  }, [pagination.page])

  const fetchCases = async () => {
    try {
      setLoading(true)
      // TODO: 实现API调用
      setTimeout(() => {
        setCases([])
        setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }))
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch cases:', error)
      setLoading(false)
    }
  }

  const columns = [
    {
      key: 'image',
      title: '图片',
      render: (value: string) => (
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
          <Building2 className="w-6 h-6 text-gray-400" />
        </div>
      )
    },
    {
      key: 'title',
      title: '案例标题',
      sortable: true
    },
    {
      key: 'clientName',
      title: '客户名称'
    },
    {
      key: 'type',
      title: '项目类型',
      render: (value: string) => (
        <Badge variant="secondary">{value}</Badge>
      )
    },
    {
      key: 'area',
      title: '面积',
      render: (value: number) => `${value}㎡`
    },
    {
      key: 'location',
      title: '地点',
      render: (value: string) => (
        <div className="flex items-center">
          <MapPin className="w-3 h-3 mr-1 text-gray-400" />
          {value}
        </div>
      )
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
      key: 'isActive',
      title: '状态',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'secondary'}>
          {value ? '启用' : '禁用'}
        </Badge>
      )
    },
    {
      key: 'completionDate',
      title: '完工时间',
      render: (value: string) => value ? new Date(value).toLocaleDateString('zh-CN') : '-'
    },
    {
      key: 'actions',
      title: '操作',
      render: (value: any, record: any) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/cases/${record.id}`, '_blank')}
            title="预览"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" title="查看详情">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" title="编辑">
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" title="删除">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="案例管理"
        description="管理工程案例和项目展示"
        action={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            添加案例
          </Button>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总案例数</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">已启用</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">推荐案例</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">项目地区</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* 案例列表 */}
      <DataTable
        columns={columns}
        data={cases}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        emptyText="暂无案例数据"
        emptyDescription="点击上方按钮添加第一个案例"
      />
    </div>
  )
}
