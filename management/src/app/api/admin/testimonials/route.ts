/**
 * 客户评价管理API端点 - 使用模拟数据
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
import { Testimonial } from '@/lib/api/types'
import { testimonials } from '@/lib/data/mockData'

// 客户评价验证schema
const testimonialSchema = z.object({
  clientName: z.string().min(1, '客户姓名不能为空'),
  clientCompany: z.string().optional(),
  content: z.string().min(1, '评价内容不能为空'),
  rating: z.number().min(1).max(5, '评分必须在1-5之间'),
  projectId: z.number().optional(),
  isPublished: z.boolean().default(false)
})

// GET - 获取客户评价列表
export const GET = withErrorHandling(async (request: NextRequest) => {
  const params = parseQueryParams(request)
  
  // 过滤和搜索
  let filteredTestimonials = [...testimonials]
  
  if (params.search) {
    filteredTestimonials = filteredTestimonials.filter(testimonial =>
      testimonial.clientName.toLowerCase().includes(params.search.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(params.search.toLowerCase()) ||
      (testimonial.clientCompany && testimonial.clientCompany.toLowerCase().includes(params.search.toLowerCase()))
    )
  }
  
  // 按发布状态过滤
  if (params.status === 'published') {
    filteredTestimonials = filteredTestimonials.filter(testimonial => testimonial.isPublished)
  } else if (params.status === 'draft') {
    filteredTestimonials = filteredTestimonials.filter(testimonial => !testimonial.isPublished)
  }
  
  // 排序
  filteredTestimonials.sort((a, b) => {
    if (params.sortBy === 'rating') {
      return params.sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating
    }
    
    const aValue = a[params.sortBy as keyof Testimonial] as any
    const bValue = b[params.sortBy as keyof Testimonial] as any
    
    if (params.sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
  
  // 分页
  const pagination = calculatePagination(params.page, params.limit, filteredTestimonials.length)
  const paginatedTestimonials = filteredTestimonials.slice(pagination.offset, pagination.offset + params.limit)
  
  return createSuccessResponse({
    testimonials: paginatedTestimonials,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages
    }
  })
})

// POST - 创建新客户评价
export const POST = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const validation = await validateRequestBody(request, testimonialSchema)
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  const newTestimonial: Testimonial = {
    id: generateId(),
    ...validation.data,
    isPublished: validation.data.isPublished ?? true,
    createdAt: formatDate(),
    updatedAt: formatDate()
  }
  
  testimonials.push(newTestimonial)
  
  return createSuccessResponse(newTestimonial, '客户评价创建成功')
}))

// PUT - 更新客户评价
export const PUT = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('评价ID不能为空')
  }
  
  const testimonialIndex = testimonials.findIndex(t => t.id === id)
  if (testimonialIndex === -1) {
    return createErrorResponse('客户评价不存在', 404)
  }
  
  const validation = await validateRequestBody(request, testimonialSchema.partial())
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  testimonials[testimonialIndex] = {
    ...testimonials[testimonialIndex],
    ...validation.data,
    updatedAt: formatDate()
  }
  
  return createSuccessResponse(testimonials[testimonialIndex], '客户评价更新成功')
}))

// DELETE - 删除客户评价
export const DELETE = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('评价ID不能为空')
  }
  
  const testimonialIndex = testimonials.findIndex(t => t.id === id)
  if (testimonialIndex === -1) {
    return createErrorResponse('客户评价不存在', 404)
  }
  
  testimonials.splice(testimonialIndex, 1)
  
  return createSuccessResponse(undefined, '客户评价删除成功')
}))
