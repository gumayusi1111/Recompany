/**
 * 公开案例详情API端点
 * 为前端提供单个工程案例的详细信息
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { 
  successResponse, 
  notFoundErrorResponse,
  createApiHandler,
  validateMethod
} from '@/lib/api/response'

// 获取单个案例详情（公开接口）
export const GET = createApiHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  validateMethod(request, ['GET'])

  const engineeringCase = await prisma.engineeringCase.findUnique({
    where: { 
      id: params.id,
      isActive: true // 只返回启用的案例
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          category: true,
          image: true,
          imageAlt: true,
          briefDescription: true,
        },
      },
    },
  })

  if (!engineeringCase) {
    return notFoundErrorResponse('案例不存在或已下线')
  }

  // 获取相关案例（同类型产品的其他案例）
  const relatedCases = await prisma.engineeringCase.findMany({
    where: {
      id: { not: params.id },
      type: engineeringCase.type,
      isActive: true,
    },
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
    orderBy: { completionDate: 'desc' },
    take: 4, // 最多显示4个相关案例
  })

  const result = {
    ...engineeringCase,
    relatedCases,
  }

  return successResponse(result)
})
