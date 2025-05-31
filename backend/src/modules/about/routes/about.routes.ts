import express from 'express';
import { validateRequest } from '../../../middleware/validateRequest';
import * as aboutController from '../controllers';
import { CreateAboutSchema, UpdateAboutSchema } from '../schemas';

const router = express.Router();

/**
 * @swagger
 * /api/about:
 *   get:
 *     summary: 获取所有关于我们数据
 *     tags: [About]
 *     responses:
 *       200:
 *         description: 成功返回所有关于我们数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 */
router.get('/', aboutController.getAllAbout);

/**
 * @swagger
 * /api/about/{id}:
 *   get:
 *     summary: 根据ID获取关于我们数据
 *     tags: [About]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功返回关于我们数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *       404:
 *         description: 关于我们数据不存在
 */
router.get('/:id', aboutController.getAboutById);

/**
 * @swagger
 * /api/about:
 *   post:
 *     summary: 创建新的关于我们数据
 *     tags: [About]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: 成功创建关于我们数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: 创建成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 */
router.post('/', validateRequest(CreateAboutSchema), aboutController.createAbout);

/**
 * @swagger
 * /api/about/{id}:
 *   patch:
 *     summary: 更新关于我们数据
 *     tags: [About]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功更新关于我们数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: 更新成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *       404:
 *         description: 关于我们数据不存在
 */
router.patch('/:id', validateRequest(UpdateAboutSchema), aboutController.updateAbout);

/**
 * @swagger
 * /api/about/{id}:
 *   delete:
 *     summary: 删除关于我们数据
 *     tags: [About]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功删除关于我们数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: 删除成功
 *                 data:
 *                   type: null
 *       404:
 *         description: 关于我们数据不存在
 */
router.delete('/:id', aboutController.deleteAbout);

export default router;
