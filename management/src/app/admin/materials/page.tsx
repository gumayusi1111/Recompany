/**
 * 材料管理页面
 * 管理材料信息、规格、特性等
 */

'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit, Trash2, Eye, Star, Layers } from 'lucide-react'

export default function MaterialsManagePage() {
  const [loading, setLoading] = useState(true)
  const [materials, setMaterials] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchMaterials()
  }, [pagination.page])

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      // TODO: 实现API调用
      setTimeout(() => {
        setMaterials([])
        setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }))
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch materials:', error)
      setLoading(false)
    }
  }

  const columns = [
    {
      key: 'image',
      title: '图片',
      render: (value: string) => (
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
          <Layers className="w-6 h-6 text-gray-400" />
        </div>
      )
    },
    {
      key: 'name',
      title: '材料名称',
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
      key: 'properties',
      title: '特性',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value?.slice(0, 2).map((prop, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {prop}
            </Badge>
          ))}
          {value?.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 2}
            </Badge>
          )}
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
        title="材料管理"
        description="管理膜结构材料信息、规格和特性"
        action={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            添加材料
          </Button>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总材料数</p>
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
              <p className="text-sm font-medium text-gray-600">推荐材料</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Layers className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">材料分类</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* 材料列表 */}
      <DataTable
        columns={columns}
        data={materials}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        emptyText="暂无材料数据"
        emptyDescription="点击上方按钮添加第一个材料"
      />
    </div>
  )
}
