/**
 * API响应工具函数
 * 统一API响应格式和错误处理
 */

import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

// API响应接口
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
  timestamp?: string
}

// 分页响应接口
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// 错误类型枚举
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  BAD_REQUEST = 'BAD_REQUEST',
}

// 成功响应
export function successResponse<T>(
  data?: T,
  message?: string,
  status: number = 200
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(response, { status })
}

// 分页成功响应
export function paginatedResponse<T>(
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
  },
  message?: string
): NextResponse {
  const totalPages = Math.ceil(pagination.total / pagination.limit)
  
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    message,
    pagination: {
      ...pagination,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    },
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(response)
}

// 错误响应
export function errorResponse(
  error: string,
  code: ErrorCode = ErrorCode.INTERNAL_ERROR,
  status: number = 500,
  details?: any
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error,
    code,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
  }

  return NextResponse.json(response, { status })
}

// 验证错误响应
export function validationErrorResponse(error: ZodError): NextResponse {
  const formattedErrors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
  }))

  return errorResponse(
    '数据验证失败',
    ErrorCode.VALIDATION_ERROR,
    400,
    { fields: formattedErrors }
  )
}

// 认证错误响应
export function authenticationErrorResponse(message: string = '认证失败'): NextResponse {
  return errorResponse(message, ErrorCode.AUTHENTICATION_ERROR, 401)
}

// 授权错误响应
export function authorizationErrorResponse(message: string = '权限不足'): NextResponse {
  return errorResponse(message, ErrorCode.AUTHORIZATION_ERROR, 403)
}

// 未找到错误响应
export function notFoundErrorResponse(message: string = '资源未找到'): NextResponse {
  return errorResponse(message, ErrorCode.NOT_FOUND, 404)
}

// 冲突错误响应
export function conflictErrorResponse(message: string = '资源冲突'): NextResponse {
  return errorResponse(message, ErrorCode.CONFLICT, 409)
}

// 请求错误响应
export function badRequestErrorResponse(message: string = '请求参数错误'): NextResponse {
  return errorResponse(message, ErrorCode.BAD_REQUEST, 400)
}

// 限流错误响应
export function rateLimitErrorResponse(message: string = '请求过于频繁'): NextResponse {
  return errorResponse(message, ErrorCode.RATE_LIMIT, 429)
}

// 处理API错误的通用函数
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Zod验证错误
  if (error instanceof ZodError) {
    return validationErrorResponse(error)
  }

  // 自定义错误
  if (error instanceof Error) {
    // 检查是否是已知的错误类型
    if (error.message.includes('not found')) {
      return notFoundErrorResponse(error.message)
    }
    
    if (error.message.includes('unauthorized')) {
      return authenticationErrorResponse(error.message)
    }
    
    if (error.message.includes('forbidden')) {
      return authorizationErrorResponse(error.message)
    }
    
    if (error.message.includes('conflict')) {
      return conflictErrorResponse(error.message)
    }

    // 开发环境显示详细错误，生产环境隐藏
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : '服务器内部错误'
    
    return errorResponse(message, ErrorCode.INTERNAL_ERROR, 500)
  }

  // 未知错误
  return errorResponse(
    '服务器内部错误',
    ErrorCode.INTERNAL_ERROR,
    500
  )
}

// 创建API处理器的高阶函数
export function createApiHandler(
  handler: (request: Request, context?: any) => Promise<NextResponse>
) {
  return async (request: Request, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

// 验证请求方法
export function validateMethod(
  request: Request,
  allowedMethods: string[]
): void {
  if (!allowedMethods.includes(request.method)) {
    throw new Error(`Method ${request.method} not allowed`)
  }
}

// 解析请求体
export async function parseRequestBody<T>(request: Request): Promise<T> {
  try {
    const body = await request.json()
    return body as T
  } catch (error) {
    throw new Error('Invalid JSON in request body')
  }
}

// 解析查询参数
export function parseSearchParams(url: string): Record<string, string> {
  const searchParams = new URL(url).searchParams
  const params: Record<string, string> = {}
  
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  return params
}

// 解析分页参数
export function parsePaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
  const sort = searchParams.get('sort') || 'createdAt'
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc'
  const search = searchParams.get('search') || ''

  return {
    page,
    limit,
    sort,
    order,
    search,
    skip: (page - 1) * limit,
  }
}

// 构建排序对象
export function buildOrderBy(sort: string, order: 'asc' | 'desc') {
  return {
    [sort]: order,
  }
}

// 构建搜索条件
export function buildSearchCondition(search: string, fields: string[]) {
  if (!search) return {}

  return {
    OR: fields.map(field => ({
      [field]: {
        contains: search,
        mode: 'insensitive' as const,
      },
    })),
  }
}
