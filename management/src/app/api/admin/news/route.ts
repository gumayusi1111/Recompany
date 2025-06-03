/**
 * 新闻管理API端点
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
import { News } from '@/lib/api/types'
import { news } from '@/lib/data/mockData'

// 新闻验证schema
const newsSchema = z.object({
  title: z.string().min(1, '新闻标题不能为空'),
  content: z.string().min(1, '新闻内容不能为空'),
  summary: z.string().min(1, '新闻摘要不能为空'),
  author: z.string().min(1, '作者不能为空'),
  publishedAt: z.string(),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft')
})

// GET - 获取新闻列表
export const GET = withErrorHandling(async (request: NextRequest) => {
  const params = parseQueryParams(request)
  
  // 过滤和搜索
  let filteredNews = [...news]
  
  if (params.search) {
    filteredNews = filteredNews.filter(newsItem =>
      newsItem.title.toLowerCase().includes(params.search.toLowerCase()) ||
      newsItem.content.toLowerCase().includes(params.search.toLowerCase()) ||
      newsItem.summary.toLowerCase().includes(params.search.toLowerCase()) ||
      newsItem.author.toLowerCase().includes(params.search.toLowerCase())
    )
  }
  
  if (params.status) {
    filteredNews = filteredNews.filter(newsItem => newsItem.status === params.status)
  }
  
  // 按发布时间排序
  filteredNews.sort((a, b) => {
    if (params.sortBy === 'publishedAt') {
      const aDate = new Date(a.publishedAt).getTime()
      const bDate = new Date(b.publishedAt).getTime()
      return params.sortOrder === 'asc' ? aDate - bDate : bDate - aDate
    }
    
    const aValue = a[params.sortBy as keyof News] as any
    const bValue = b[params.sortBy as keyof News] as any
    
    if (params.sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
  
  // 分页
  const pagination = calculatePagination(params.page, params.limit, filteredNews.length)
  const paginatedNews = filteredNews.slice(pagination.offset, pagination.offset + params.limit)
  
  return createSuccessResponse({
    news: paginatedNews,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages
    }
  })
})

// POST - 创建新新闻
export const POST = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const validation = await validateRequestBody(request, newsSchema)
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  const newNews: News = {
    id: generateId(),
    ...validation.data,
    createdAt: formatDate(),
    updatedAt: formatDate(),
    createdBy: user.id
  }
  
  news.push(newNews)
  
  return createSuccessResponse(newNews, '新闻创建成功')
}))

// PUT - 更新新闻
export const PUT = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('新闻ID不能为空')
  }
  
  const newsIndex = news.findIndex(n => n.id === id)
  if (newsIndex === -1) {
    return createErrorResponse('新闻不存在', 404)
  }
  
  const validation = await validateRequestBody(request, newsSchema.partial())
  
  if (!validation.success) {
    return createErrorResponse(validation.error)
  }
  
  news[newsIndex] = {
    ...news[newsIndex],
    ...validation.data,
    updatedAt: formatDate()
  }
  
  return createSuccessResponse(news[newsIndex], '新闻更新成功')
}))

// DELETE - 删除新闻
export const DELETE = withErrorHandling(requireAuth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  if (!id) {
    return createErrorResponse('新闻ID不能为空')
  }
  
  const newsIndex = news.findIndex(n => n.id === id)
  if (newsIndex === -1) {
    return createErrorResponse('新闻不存在', 404)
  }
  
  news.splice(newsIndex, 1)
  
  return createSuccessResponse(undefined, '新闻删除成功')
}))
