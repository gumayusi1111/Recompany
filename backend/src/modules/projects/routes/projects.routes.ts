import express from 'express';
// 使用相对路径导入中间件
import { validateRequest } from '../../../middleware/validateRequest';
import { CreateProjectSchema, UpdateProjectSchema } from '../schemas/project.schema';
import * as projectsController from '../controllers';

const router = express.Router();

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: 获取所有项目
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: 成功获取项目列表
 */
router.get('/', projectsController.getAllProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: 获取单个项目
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功获取项目
 *       404:
 *         description: 项目不存在
 */
router.get('/:id', projectsController.getProjectById);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: 创建新项目
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProject'
 *     responses:
 *       201:
 *         description: 项目创建成功
 *       400:
 *         description: 无效的输入
 */
router.post('/', validateRequest(CreateProjectSchema), projectsController.createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: 更新项目
 *     tags: [Projects]
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
 *         description: 项目更新成功
 *       400:
 *         description: 无效的输入
 *       404:
 *         description: 项目不存在
 */
router.put('/:id', validateRequest(UpdateProjectSchema), projectsController.updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: 删除项目
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 项目删除成功
 *       404:
 *         description: 项目不存在
 */
router.delete('/:id', projectsController.deleteProject);

export default router;
