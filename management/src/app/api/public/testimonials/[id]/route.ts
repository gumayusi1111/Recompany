/**
 * 公开客户好评详情API端点
 * 为前端提供单个客户评价的详细信息
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { 
  successResponse, 
  notFoundErrorResponse,
  createApiHandler,
  validateMethod
} from '@/lib/api/response'

// 获取单个评价详情（公开接口）
export const GET = createApiHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  validateMethod(request, ['GET'])

  const review = await prisma.review.findUnique({
    where: { 
      id: params.id,
      status: 'APPROVED', // 只返回已审核通过的评价
      isActive: true
    },
  })

  if (!review) {
    return notFoundErrorResponse('评价不存在或未通过审核')
  }

  // 获取相关评价（同项目类型的其他评价）
  const relatedReviews = await prisma.review.findMany({
    where: {
      id: { not: params.id },
      projectType: review.projectType,
      status: 'APPROVED',
      isActive: true,
    },
    select: {
      id: true,
      clientName: true,
      company: true,
      position: true,
      avatar: true,
      rating: true,
      content: true,
      projectType: true,
      location: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 4, // 最多显示4个相关评价
  })

  // 获取高分评价（评分4分以上的评价）
  const highRatedReviews = await prisma.review.findMany({
    where: {
      id: { not: params.id },
      rating: { gte: 4 },
      status: 'APPROVED',
      isActive: true,
    },
    select: {
      id: true,
      clientName: true,
      company: true,
      rating: true,
      content: true,
      projectType: true,
      createdAt: true,
    },
    orderBy: { rating: 'desc' },
    take: 5, // 最多显示5个高分评价
  })

  const result = {
    ...review,
    relatedReviews,
    highRatedReviews,
  }

  return successResponse(result)
})
