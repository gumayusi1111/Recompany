import { Router } from 'express';

const router = Router();

// 健康检查端点
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'backend-api',
    version: process.env.npm_package_version || '1.0.0'
  });
});

export default router;
