/**
 * 产品管理API端点 - 使用模拟数据
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
import { Product } from '@/lib/api/types'
import { products } from '@/lib/data/mockData'

// 产品验证schema
const productSchema = z.object({
  title: z.string().min(1, '产品名称不能为空'),
  content: z.string().min(1, '产品描述不能为空'),
  category: z.string().min(1, '产品分类不能为空'),
  price: z.number().optional(),
  images: z.array(z.string()).default([]),
  specifications: z.record(z.any()).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft')
})

// GET - 获取产品列表
export const GET = withErrorHandling(async (request: NextRequest) => {
  const params = parseQueryParams(request)
  
  // 过滤和搜索
  let filteredProducts = [...products]
  
  if (params.search) {
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(params.search.toLowerCase()) ||
      product.content.toLowerCase().includes(params.search.toLowerCase()) ||
      product.category.toLowerCase().includes(params.search.toLowerCase())
    )
  }
  
  if (params.status) {
    filteredProducts = filteredProducts.filter(product => product.status === params.status)
  }
  
  if (params.category) {
    filteredProducts = filteredProducts.filter(product => product.category === params.category)
  }
  
  // 排序
  filteredProducts.sort((a, b) => {
    const aValue = a[params.sortBy as keyof Product] as any
    const bValue = b[params.sortBy as keyof Product] as any
    
    if (params.sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
  
  // 分页
  const pagination = calculatePagination(params.page, params.limit, filteredProducts.length)
  const paginatedProducts = filteredProducts.slice(pagination.offset, pagination.offset + params.limit)
  
  return createSuccessResponse({
    products: paginatedProducts,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages
    }
  })
})

// POST - 创建新产品
export const POST = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const validation = await validateRequestBody(request, productSchema)
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  const newProduct: Product = {
    id: generateId(),
    ...validation.data,
    status: validation.data.status || 'draft',
    images: validation.data.images || [],
    specifications: validation.data.specifications || {},
    createdAt: formatDate(),
    updatedAt: formatDate(),
    createdBy: user.id
  }
  
  products.push(newProduct)
  
  return createSuccessResponse(newProduct, '产品创建成功')
}))

// PUT - 更新产品
export const PUT = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('产品ID不能为空')
  }
  
  const productIndex = products.findIndex(p => p.id === id)
  if (productIndex === -1) {
    return createErrorResponse('产品不存在', 404)
  }
  
  const validation = await validateRequestBody(request, productSchema.partial())
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  products[productIndex] = {
    ...products[productIndex],
    ...validation.data,
    updatedAt: formatDate()
  }
  
  return createSuccessResponse(products[productIndex], '产品更新成功')
}))

// DELETE - 删除产品
export const DELETE = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('产品ID不能为空')
  }
  
  const productIndex = products.findIndex(p => p.id === id)
  if (productIndex === -1) {
    return createErrorResponse('产品不存在', 404)
  }
  
  products.splice(productIndex, 1)
  
  return createSuccessResponse(undefined, '产品删除成功')
}))
