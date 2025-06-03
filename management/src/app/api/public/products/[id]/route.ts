/**
 * 公开产品详情API端点
 * 为前端提供单个产品的详细信息
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { 
  successResponse, 
  notFoundErrorResponse,
  createApiHandler,
  validateMethod
} from '@/lib/api/response'

// 获取单个产品详情（公开接口）
export const GET = createApiHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  validateMethod(request, ['GET'])

  const product = await prisma.product.findUnique({
    where: { 
      id: params.id,
      isActive: true // 只返回启用的产品
    },
    include: {
      cases: {
        select: {
          id: true,
          title: true,
          clientName: true,
          area: true,
          location: true,
          image: true,
          imageAlt: true,
          briefDescription: true,
          completionDate: true,
        },
        where: { 
          isActive: true,
          isFeatured: true // 只显示推荐案例
        },
        orderBy: { completionDate: 'desc' },
        take: 6, // 最多显示6个相关案例
      },
    },
  })

  if (!product) {
    return notFoundErrorResponse('产品不存在或已下线')
  }

  // 增加浏览量（可选）
  // await prisma.product.update({
  //   where: { id: params.id },
  //   data: { viewCount: { increment: 1 } }
  // })

  return successResponse(product)
})
