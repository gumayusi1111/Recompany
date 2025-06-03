/**
 * 单个产品API端点
 * 处理单个产品的获取、更新、删除操作
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

// 产品更新验证schema
const updateProductSchema = z.object({
  name: z.string().min(1, '产品名称不能为空').optional(),
  description: z.string().min(1, '产品描述不能为空').optional(),
  briefDescription: z.string().min(1, '简短描述不能为空').optional(),
  image: z.string().url('请提供有效的图片URL').optional(),
  imageAlt: z.string().min(1, '图片alt文本不能为空').optional(),
  category: z.string().min(1, '产品分类不能为空').optional(),
  specifications: z.string().optional(),
  features: z.array(z.string()).optional(),
  applications: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
})

// 获取单个产品
export const GET = createApiHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  validateMethod(request, ['GET'])

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      cases: {
        select: {
          id: true,
          title: true,
          clientName: true,
          area: true,
          location: true,
          image: true,
          completionDate: true,
        },
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!product) {
    return notFoundErrorResponse('产品不存在')
  }

  return successResponse(product)
})

// 更新产品
export const PUT = createApiHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  validateMethod(request, ['PUT'])

  const body = await parseRequestBody(request)
  const validatedData = updateProductSchema.parse(body)

  // 检查产品是否存在
  const existingProduct = await prisma.product.findUnique({
    where: { id: params.id },
  })

  if (!existingProduct) {
    return notFoundErrorResponse('产品不存在')
  }

  // 如果更新名称，检查是否与其他产品冲突
  if (validatedData.name && validatedData.name !== existingProduct.name) {
    const nameConflict = await prisma.product.findFirst({
      where: { 
        name: validatedData.name,
        id: { not: params.id },
      },
    })

    if (nameConflict) {
      throw new Error('产品名称已存在')
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id: params.id },
    data: {
      ...validatedData,
      updatedAt: new Date(),
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
          completionDate: true,
        },
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  return successResponse(updatedProduct, '产品更新成功')
})

// 删除产品
export const DELETE = createApiHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  validateMethod(request, ['DELETE'])

  // 检查产品是否存在
  const existingProduct = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      cases: {
        where: { isActive: true },
        select: { id: true },
      },
    },
  })

  if (!existingProduct) {
    return notFoundErrorResponse('产品不存在')
  }

  // 检查是否有关联的活跃案例
  if (existingProduct.cases.length > 0) {
    throw new Error(`该产品有 ${existingProduct.cases.length} 个关联案例，无法删除`)
  }

  // 软删除：设置为不活跃
  await prisma.product.update({
    where: { id: params.id },
    data: { 
      isActive: false,
      updatedAt: new Date(),
    },
  })

  return successResponse(null, '产品删除成功')
})
