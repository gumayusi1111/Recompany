/**
 * 案例管理API端点
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
import { Case } from '@/lib/api/types'
import { cases } from '@/lib/data/mockData'

// 案例验证schema
const caseSchema = z.object({
  title: z.string().min(1, '案例标题不能为空'),
  content: z.string().min(1, '案例描述不能为空'),
  client: z.string().min(1, '客户名称不能为空'),
  location: z.string().min(1, '项目地点不能为空'),
  completedAt: z.string(),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'archived']).default('draft')
})

// GET - 获取案例列表
export const GET = withErrorHandling(async (request: NextRequest) => {
  const params = parseQueryParams(request)
  
  // 过滤和搜索
  let filteredCases = [...cases]
  
  if (params.search) {
    filteredCases = filteredCases.filter(caseItem =>
      caseItem.title.toLowerCase().includes(params.search.toLowerCase()) ||
      caseItem.content.toLowerCase().includes(params.search.toLowerCase()) ||
      caseItem.client.toLowerCase().includes(params.search.toLowerCase()) ||
      caseItem.location.toLowerCase().includes(params.search.toLowerCase())
    )
  }
  
  if (params.status) {
    filteredCases = filteredCases.filter(caseItem => caseItem.status === params.status)
  }
  
  // 排序
  filteredCases.sort((a, b) => {
    const aValue = a[params.sortBy as keyof Case] as any
    const bValue = b[params.sortBy as keyof Case] as any
    
    if (params.sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
  
  // 分页
  const pagination = calculatePagination(params.page, params.limit, filteredCases.length)
  const paginatedCases = filteredCases.slice(pagination.offset, pagination.offset + params.limit)
  
  return createSuccessResponse({
    cases: paginatedCases,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages
    }
  })
})

// POST - 创建新案例
export const POST = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const validation = await validateRequestBody(request, caseSchema)
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  const newCase: Case = {
    id: generateId(),
    ...validation.data,
    createdAt: formatDate(),
    updatedAt: formatDate(),
    createdBy: user.id
  }
  
  cases.push(newCase)
  
  return createSuccessResponse(newCase, '案例创建成功')
}))

// PUT - 更新案例
export const PUT = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('案例ID不能为空')
  }
  
  const caseIndex = cases.findIndex(c => c.id === id)
  if (caseIndex === -1) {
    return createErrorResponse('案例不存在', 404)
  }
  
  const validation = await validateRequestBody(request, caseSchema.partial())
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  cases[caseIndex] = {
    ...cases[caseIndex],
    ...validation.data,
    updatedAt: formatDate()
  }
  
  return createSuccessResponse(cases[caseIndex], '案例更新成功')
}))

// DELETE - 删除案例
export const DELETE = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('案例ID不能为空')
  }
  
  const caseIndex = cases.findIndex(c => c.id === id)
  if (caseIndex === -1) {
    return createErrorResponse('案例不存在', 404)
  }
  
  cases.splice(caseIndex, 1)
  
  return createSuccessResponse(undefined, '案例删除成功')
}))
