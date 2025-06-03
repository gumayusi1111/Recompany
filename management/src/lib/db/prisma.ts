/**
 * Prisma数据库连接
 * 单例模式确保连接复用
 */

import { PrismaClient } from '@prisma/client'

// 全局类型声明
declare global {
  var __prisma: PrismaClient | undefined
}

// 创建Prisma客户端实例
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })
}

// 单例模式的Prisma客户端
const prisma = globalThis.__prisma ?? createPrismaClient()

// 开发环境下将实例挂载到全局，避免热重载时重复创建连接
if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma
}

export { prisma }

/**
 * 数据库连接健康检查
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

/**
 * 优雅关闭数据库连接
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect()
    console.log('Database disconnected successfully')
  } catch (error) {
    console.error('Error disconnecting from database:', error)
  }
}

/**
 * 数据库事务包装器
 */
export async function withTransaction<T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(callback)
}

/**
 * 分页查询辅助函数
 */
export interface PaginationOptions {
  page: number
  limit: number
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function paginate<T>(
  model: any,
  options: PaginationOptions,
  where?: any,
  include?: any,
  orderBy?: any
): Promise<PaginationResult<T>> {
  const { page, limit } = options
  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    model.findMany({
      where,
      include,
      orderBy,
      skip,
      take: limit,
    }),
    model.count({ where }),
  ])

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * 软删除辅助函数（如果需要）
 */
export async function softDelete(model: any, id: string): Promise<any> {
  return await model.update({
    where: { id },
    data: { isActive: false },
  })
}

/**
 * 批量操作辅助函数
 */
export async function batchUpdate(
  model: any,
  ids: string[],
  data: any
): Promise<{ count: number }> {
  return await model.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data,
  })
}

/**
 * 搜索辅助函数
 */
export function buildSearchCondition(
  searchTerm: string,
  searchFields: string[]
): any {
  if (!searchTerm) return {}

  return {
    OR: searchFields.map(field => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    })),
  }
}

/**
 * 日期范围查询辅助函数
 */
export function buildDateRangeCondition(
  field: string,
  startDate?: Date,
  endDate?: Date
): any {
  const condition: any = {}

  if (startDate || endDate) {
    condition[field] = {}
    
    if (startDate) {
      condition[field].gte = startDate
    }
    
    if (endDate) {
      condition[field].lte = endDate
    }
  }

  return condition
}

/**
 * 排序辅助函数
 */
export function buildOrderBy(
  sortField?: string,
  sortOrder?: 'asc' | 'desc'
): any {
  if (!sortField) {
    return { createdAt: 'desc' }
  }

  return {
    [sortField]: sortOrder || 'asc',
  }
}

/**
 * 数据库初始化函数
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // 检查数据库连接
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      throw new Error('Failed to connect to database')
    }

    console.log('Database connected successfully')

    // 检查是否需要创建默认管理员
    const adminCount = await prisma.adminUser.count()
    if (adminCount === 0) {
      console.log('No admin users found, creating default admin...')
      await createDefaultAdmin()
    }

  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}

/**
 * 创建默认管理员账户
 */
async function createDefaultAdmin(): Promise<void> {
  const { hashPassword } = await import('@/lib/auth/password')
  
  const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123456'
  const hashedPassword = await hashPassword(defaultPassword)

  await prisma.adminUser.create({
    data: {
      username: 'admin',
      email: 'admin@membrane.com',
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  })

  console.log('Default admin user created:')
  console.log('Username: admin')
  console.log('Password:', defaultPassword)
  console.log('Please change the password after first login!')
}
