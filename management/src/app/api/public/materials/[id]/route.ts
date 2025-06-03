/**
 * 公开材料详情API端点
 * 为前端提供单个材料的详细信息
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { 
  successResponse, 
  notFoundErrorResponse,
  createApiHandler,
  validateMethod
} from '@/lib/api/response'

// 获取单个材料详情（公开接口）
export const GET = createApiHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  validateMethod(request, ['GET'])

  const material = await prisma.material.findUnique({
    where: { 
      id: params.id,
      isActive: true // 只返回启用的材料
    },
  })

  if (!material) {
    return notFoundErrorResponse('材料信息不存在或已下线')
  }

  // 获取相关材料（同分类的其他材料）
  const relatedMaterials = await prisma.material.findMany({
    where: {
      id: { not: params.id },
      category: material.category,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      category: true,
      image: true,
      imageAlt: true,
      briefDescription: true,
      properties: true,
    },
    orderBy: { order: 'asc' },
    take: 4, // 最多显示4个相关材料
  })

  const result = {
    ...material,
    relatedMaterials,
  }

  return successResponse(result)
})
