/**
 * 公开新闻详情API端点
 * 为前端提供单个新闻的详细信息
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { 
  successResponse, 
  notFoundErrorResponse,
  createApiHandler,
  validateMethod
} from '@/lib/api/response'

// 获取单个新闻详情（公开接口）
export const GET = createApiHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  validateMethod(request, ['GET'])

  const news = await prisma.news.findUnique({
    where: { 
      id: params.id,
      status: 'PUBLISHED', // 只返回已发布的新闻
      isActive: true
    },
  })

  if (!news) {
    return notFoundErrorResponse('新闻不存在或已下线')
  }

  // 增加浏览量
  await prisma.news.update({
    where: { id: params.id },
    data: { viewCount: { increment: 1 } }
  })

  // 获取相关新闻（同分类的其他新闻）
  const relatedNews = await prisma.news.findMany({
    where: {
      id: { not: params.id },
      category: news.category,
      status: 'PUBLISHED',
      isActive: true,
    },
    select: {
      id: true,
      title: true,
      summary: true,
      image: true,
      imageAlt: true,
      category: true,
      author: true,
      publishDate: true,
      viewCount: true,
    },
    orderBy: { publishDate: 'desc' },
    take: 4, // 最多显示4个相关新闻
  })

  // 获取热门新闻（浏览量最高的新闻）
  const popularNews = await prisma.news.findMany({
    where: {
      id: { not: params.id },
      status: 'PUBLISHED',
      isActive: true,
    },
    select: {
      id: true,
      title: true,
      summary: true,
      image: true,
      imageAlt: true,
      category: true,
      publishDate: true,
      viewCount: true,
    },
    orderBy: { viewCount: 'desc' },
    take: 5, // 最多显示5个热门新闻
  })

  const result = {
    ...news,
    relatedNews,
    popularNews,
  }

  return successResponse(result)
})
