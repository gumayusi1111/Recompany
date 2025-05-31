import express from 'express';
// 使用相对路径导入中间件
import { validateRequest } from '../../../middleware/validateRequest';
import { CreateHomeSchema, UpdateHomeSchema } from '../schemas/home.schema';
import * as homeController from '../controllers';

const router = express.Router();

/**
 * @swagger
 * /api/home:
 *   get:
 *     summary: 获取所有首页数据
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: 成功获取首页数据列表
 */
router.get('/', homeController.getAllHome);

/**
 * @swagger
 * /api/home/{id}:
 *   get:
 *     summary: 获取单个首页数据
 *     tags: [Home]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功获取首页数据
 *       404:
 *         description: 首页数据不存在
 */
router.get('/:id', homeController.getHomeById);

/**
 * @swagger
 * /api/home:
 *   post:
 *     summary: 创建新首页数据
 *     tags: [Home]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateHome'
 *     responses:
 *       201:
 *         description: 首页数据创建成功
 *       400:
 *         description: 无效的输入
 */
router.post('/', validateRequest(CreateHomeSchema), homeController.createHome);

/**
 * @swagger
 * /api/home/{id}:
 *   put:
 *     summary: 更新首页数据
 *     tags: [Home]
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
 *             $ref: '#/components/schemas/UpdateHome'
 *     responses:
 *       200:
 *         description: 首页数据更新成功
 *       400:
 *         description: 无效的输入
 *       404:
 *         description: 首页数据不存在
 */
router.put('/:id', validateRequest(UpdateHomeSchema), homeController.updateHome);

/**
 * @swagger
 * /api/home/{id}:
 *   delete:
 *     summary: 删除首页数据
 *     tags: [Home]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 首页数据删除成功
 *       404:
 *         description: 首页数据不存在
 */
router.delete('/:id', homeController.deleteHome);

export default router;
