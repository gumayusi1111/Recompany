import express from 'express';
// 使用相对路径导入中间件
import { validateRequest } from '../../../middleware/validateRequest';
import { CreateNewsSchema, UpdateNewsSchema } from '../schemas/news.schema';
import * as newsController from '../controllers';

const router = express.Router();

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: 获取所有新闻
 *     tags: [News]
 *     responses:
 *       200:
 *         description: 成功获取新闻列表
 */
router.get('/', newsController.getAllNews);

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: 获取单个新闻
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功获取新闻
 *       404:
 *         description: 新闻不存在
 */
router.get('/:id', newsController.getNewsById);

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: 创建新闻
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNews'
 *     responses:
 *       201:
 *         description: 新闻创建成功
 *       400:
 *         description: 无效的输入
 */
router.post('/', validateRequest(CreateNewsSchema), newsController.createNews);

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: 更新新闻
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNews'
 *     responses:
 *       200:
 *         description: 新闻更新成功
 *       400:
 *         description: 无效的输入
 *       404:
 *         description: 新闻不存在
 */
router.put('/:id', validateRequest(UpdateNewsSchema), newsController.updateNews);

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: 删除新闻
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 新闻删除成功
 *       404:
 *         description: 新闻不存在
 */
router.delete('/:id', newsController.deleteNews);

export default router;
