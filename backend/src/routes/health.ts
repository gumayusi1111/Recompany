/**
 * 健康检查路由
 * 用于检查应用和数据库连接状态
 */

import { Router } from 'express';
import { checkDatabaseConnection } from '../lib/prisma';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: 健康检查
 *     description: 检查应用和数据库连接状态
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: 服务正常
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: connected
 *                     message:
 *                       type: string
 *                       example: 数据库连接正常
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: 服务异常
 */
router.get('/', async (req: any, res: any) => {
  try {
    const dbStatus = await checkDatabaseConnection();

    const response = {
      status: 'ok',
      service: 'backend-api',
      database: dbStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    };

    // 如果数据库连接失败，返回500状态码
    if (dbStatus.status === 'disconnected') {
      return res.status(500).json(response);
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      service: 'backend-api',
      message: '健康检查失败',
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
