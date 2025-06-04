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
import { useDataStore } from '@/stores/dataStore'
import { useAppStore, setPageMeta, notify } from '@/stores/appStore'
import { productService } from '@/services/dataService'

export default function ProductsManagePage() {
  const {
    products,
    productsLoading,
    productsPagination,
    fetchProducts,
    deleteProduct
  } = useDataStore()

  const { setGlobalLoading } = useAppStore()

  // 设置页面元信息
  useEffect(() => {
    setPageMeta('产品管理', [
      { label: '管理系统', href: '/admin/dashboard' },
      { label: '产品管理' }
    ])
  }, [])

  // 加载产品数据
  useEffect(() => {
    fetchProducts({
      page: 1,
      limit: 10
    })
  }, [fetchProducts])

  // 处理删除产品
  const handleDelete = async (record: any) => {
    if (confirm(`确定要删除产品"${record.name}"吗？`)) {
      setGlobalLoading(true)
      try {
        const success = await deleteProduct(record.id)
        if (success) {
          notify.success('产品删除成功')
        }
      } catch (error) {
        notify.error('删除失败', '请稍后重试')
      } finally {
        setGlobalLoading(false)
      }
    }
  }

  // 处理页面变化
  const handlePageChange = (page: number) => {
    fetchProducts({
      page,
      limit: 10
    })
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
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700"
            title="删除"
            onClick={() => handleDelete(record)}
          >
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
        loading={productsLoading}
        pagination={productsPagination ? {
          page: productsPagination.page,
          limit: productsPagination.limit,
          total: productsPagination.total,
          totalPages: productsPagination.totalPages
        } : undefined}
        onPageChange={handlePageChange}
        emptyText="暂无产品数据"
        emptyDescription="点击上方按钮添加第一个产品"
      />
    </div>
  )
}
