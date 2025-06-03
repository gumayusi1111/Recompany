/**
 * 材料管理API端点
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  validateRequestBody, 
  parseQueryParams,
  requireAuth,
  withErrorHandling,
  generateId,
  formatDate,
  calculatePagination
} from '@/lib/api/utils'
import { Material } from '@/lib/api/types'
import { materials } from '@/lib/data/mockData'

// 材料验证schema
const materialSchema = z.object({
  title: z.string().min(1, '材料名称不能为空'),
  content: z.string().min(1, '材料描述不能为空'),
  category: z.string().min(1, '材料分类不能为空'),
  specifications: z.record(z.any()).optional(),
  supplier: z.string().optional(),
  price: z.number().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft')
})

// GET - 获取材料列表
export const GET = withErrorHandling(async (request: NextRequest) => {
  const params = parseQueryParams(request)
  
  // 过滤和搜索
  let filteredMaterials = [...materials]
  
  if (params.search) {
    filteredMaterials = filteredMaterials.filter(material =>
      material.title.toLowerCase().includes(params.search.toLowerCase()) ||
      material.content.toLowerCase().includes(params.search.toLowerCase()) ||
      material.category.toLowerCase().includes(params.search.toLowerCase()) ||
      (material.supplier && material.supplier.toLowerCase().includes(params.search.toLowerCase()))
    )
  }
  
  if (params.status) {
    filteredMaterials = filteredMaterials.filter(material => material.status === params.status)
  }
  
  if (params.category) {
    filteredMaterials = filteredMaterials.filter(material => material.category === params.category)
  }
  
  // 排序
  filteredMaterials.sort((a, b) => {
    const aValue = a[params.sortBy as keyof Material] as any
    const bValue = b[params.sortBy as keyof Material] as any
    
    if (params.sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
  
  // 分页
  const pagination = calculatePagination(params.page, params.limit, filteredMaterials.length)
  const paginatedMaterials = filteredMaterials.slice(pagination.offset, pagination.offset + params.limit)
  
  return createSuccessResponse({
    materials: paginatedMaterials,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages
    }
  })
})

// POST - 创建新材料
export const POST = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const validation = await validateRequestBody(request, materialSchema)
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  const newMaterial: Material = {
    id: generateId(),
    ...validation.data,
    createdAt: formatDate(),
    updatedAt: formatDate(),
    createdBy: user.id
  }
  
  materials.push(newMaterial)
  
  return createSuccessResponse(newMaterial, '材料创建成功')
}))

// PUT - 更新材料
export const PUT = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('材料ID不能为空')
  }
  
  const materialIndex = materials.findIndex(m => m.id === id)
  if (materialIndex === -1) {
    return createErrorResponse('材料不存在', 404)
  }
  
  const validation = await validateRequestBody(request, materialSchema.partial())
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  materials[materialIndex] = {
    ...materials[materialIndex],
    ...validation.data,
    updatedAt: formatDate()
  }
  
  return createSuccessResponse(materials[materialIndex], '材料更新成功')
}))

// DELETE - 删除材料
export const DELETE = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('材料ID不能为空')
  }
  
  const materialIndex = materials.findIndex(m => m.id === id)
  if (materialIndex === -1) {
    return createErrorResponse('材料不存在', 404)
  }
  
  materials.splice(materialIndex, 1)
  
  return createSuccessResponse(undefined, '材料删除成功')
}))
