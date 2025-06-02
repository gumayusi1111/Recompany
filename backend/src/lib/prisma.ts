/**
 * Prisma 客户端服务
 * 
 * 这个文件的作用：
 * 1. 创建全局唯一的 Prisma 客户端实例
 * 2. 在开发环境中避免热重载时创建多个连接
 * 3. 提供统一的数据库访问接口
 * 4. 处理连接池和连接管理
 */

import { PrismaClient } from '@prisma/client';

// 声明全局类型，避免 TypeScript 错误
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * 创建 Prisma 客户端实例
 * 
 * 为什么这样做：
 * - 在生产环境中，每次导入都会创建新的客户端实例
 * - 在开发环境中，由于热重载，会导致创建过多连接
 * - 通过全局变量缓存，确保开发环境中只有一个实例
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // 开启日志记录
});

// 在开发环境中将实例保存到全局变量
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * 优雅关闭数据库连接
 * 在应用程序关闭时调用
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

/**
 * 数据库连接健康检查
 * 用于验证数据库连接是否正常
 */
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'connected', message: '数据库连接正常' };
  } catch (error) {
    return { 
      status: 'disconnected', 
      message: '数据库连接失败', 
      error: error instanceof Error ? error.message : '未知错误' 
    };
  }
}
