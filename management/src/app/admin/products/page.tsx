/**
 * 产品管理页面
 * 管理产品信息、分类、规格等
 */

'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit, Trash2, Eye, Star, Package, ExternalLink } from 'lucide-react'

export default function ProductsManagePage() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchProducts()
  }, [pagination.page])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // TODO: 实现API调用
      // const response = await fetch(`/api/admin/products?page=${pagination.page}&limit=${pagination.limit}`)
      // const data = await response.json()
      
      // 模拟数据
      setTimeout(() => {
        setProducts([])
        setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }))
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setLoading(false)
    }
  }

  const columns = [
    {
      key: 'image',
      title: '图片',
      render: (value: string) => (
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
          <Package className="w-6 h-6 text-gray-400" />
        </div>
      )
    },
    {
      key: 'name',
      title: '产品名称',
      sortable: true
    },
    {
      key: 'category',
      title: '分类',
      render: (value: string) => (
        <Badge variant="secondary">{value}</Badge>
      )
    },
    {
      key: 'briefDescription',
      title: '简介',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
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
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/products/${record.id}`, '_blank')}
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
        title="产品管理"
        description="管理产品信息、分类和规格"
        action={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            添加产品
          </Button>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总产品数</p>
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
              <p className="text-sm font-medium text-gray-600">推荐产品</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">产品分类</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* 产品列表 */}
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        emptyText="暂无产品数据"
        emptyDescription="点击上方按钮添加第一个产品"
      />
    </div>
  )
}
