/**
 * 单个客户好评API端点
 * 处理单个客户评价的获取、更新、删除操作
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { 
  successResponse, 
  notFoundErrorResponse,
  handleApiError,
  createApiHandler,
  validateMethod,
  parseRequestBody
} from '@/lib/api/response'
import { z } from 'zod'

// 客户好评更新验证schema
const updateTestimonialSchema = z.object({
  clientName: z.string().min(1, '客户姓名不能为空').optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  avatar: z.string().optional(),
  rating: z.number().int().min(1).max(5, '评分必须在1-5之间').optional(),
  content: z.string().min(10, '评价内容至少需要10个字符').optional(),
  projectType: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
})

// 获取单个客户好评
export const GET = createApiHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  validateMethod(request, ['GET'])

  const testimonial = await prisma.review.findUnique({
    where: { id: params.id },
  })

  if (!testimonial) {
    return notFoundErrorResponse('客户好评不存在')
  }

  return successResponse(testimonial)
})

// 更新客户好评
export const PUT = createApiHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  validateMethod(request, ['PUT'])

  const body = await parseRequestBody(request)
  const validatedData = updateTestimonialSchema.parse(body)

  // 检查客户好评是否存在
  const existingTestimonial = await prisma.review.findUnique({
    where: { id: params.id },
  })

  if (!existingTestimonial) {
    return notFoundErrorResponse('客户好评不存在')
  }

  const updatedTestimonial = await prisma.review.update({
    where: { id: params.id },
    data: {
      ...validatedData,
      updatedAt: new Date(),
    },
  })

  return successResponse(updatedTestimonial, '客户好评更新成功')
})

// 删除客户好评
export const DELETE = createApiHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  validateMethod(request, ['DELETE'])

  // 检查客户好评是否存在
  const existingTestimonial = await prisma.review.findUnique({
    where: { id: params.id },
  })

  if (!existingTestimonial) {
    return notFoundErrorResponse('客户好评不存在')
  }

  // 软删除：设置为不活跃
  await prisma.review.update({
    where: { id: params.id },
    data: { 
      isActive: false,
      updatedAt: new Date(),
    },
  })

  return successResponse(null, '客户好评删除成功')
})
