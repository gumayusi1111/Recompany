import express from 'express';
// 使用相对路径导入中间件
import { validateRequest } from '../../../middleware/validateRequest';
import { CreateProjectSchema, UpdateProjectSchema } from '../schemas/case.schema';
import * as casesController from '../controllers';

const router = express.Router();

/**
 * @swagger
 * /api/cases:
 *   get:
 *     summary: 获取所有工程案例
 *     tags: [Cases]
 *     responses:
 *       200:
 *         description: 成功获取工程案例列表
 */
router.get('/', casesController.getAllProjects);

/**
 * @swagger
 * /api/cases/{id}:
 *   get:
 *     summary: 获取单个工程案例
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功获取工程案例
 *       404:
 *         description: 工程案例不存在
 */
router.get('/:id', casesController.getProjectById);

/**
 * @swagger
 * /api/cases:
 *   post:
 *     summary: 创建新工程案例
 *     tags: [Cases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProject'
 *     responses:
 *       201:
 *         description: 工程案例创建成功
 *       400:
 *         description: 无效的输入
 */
router.post('/', validateRequest(CreateProjectSchema), casesController.createProject);

/**
 * @swagger
 * /api/cases/{id}:
 *   put:
 *     summary: 更新工程案例
 *     tags: [Cases]
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
 *             $ref: '#/components/schemas/UpdateProject'
 *     responses:
 *       200:
 *         description: 工程案例更新成功
 *       400:
 *         description: 无效的输入
 *       404:
 *         description: 工程案例不存在
 */
router.put('/:id', validateRequest(UpdateProjectSchema), casesController.updateProject);

/**
 * @swagger
 * /api/cases/{id}:
 *   delete:
 *     summary: 删除工程案例
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 工程案例删除成功
 *       404:
 *         description: 工程案例不存在
 */
router.delete('/:id', casesController.deleteProject);

export default router;
