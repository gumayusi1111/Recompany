import express from 'express';
// 使用相对路径导入中间件
import { validateRequest } from '../../../middleware/validateRequest';
import { CreateMaterialSchema, UpdateMaterialSchema } from '../schemas/material.schema';
import * as materialsController from '../controllers';

const router = express.Router();

/**
 * @swagger
 * /api/materials:
 *   get:
 *     summary: 获取所有材料
 *     tags: [Materials]
 *     responses:
 *       200:
 *         description: 成功获取材料列表
 */
router.get('/', materialsController.getAllMaterials);

/**
 * @swagger
 * /api/materials/{id}:
 *   get:
 *     summary: 获取单个材料
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功获取材料
 *       404:
 *         description: 材料不存在
 */
router.get('/:id', materialsController.getMaterialById);

/**
 * @swagger
 * /api/materials:
 *   post:
 *     summary: 创建新材料
 *     tags: [Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMaterial'
 *     responses:
 *       201:
 *         description: 材料创建成功
 *       400:
 *         description: 无效的输入
 */
router.post('/', validateRequest(CreateMaterialSchema), materialsController.createMaterial);

/**
 * @swagger
 * /api/materials/{id}:
 *   put:
 *     summary: 更新材料
 *     tags: [Materials]
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
 *             $ref: '#/components/schemas/UpdateMaterial'
 *     responses:
 *       200:
 *         description: 材料更新成功
 *       400:
 *         description: 无效的输入
 *       404:
 *         description: 材料不存在
 */
router.put('/:id', validateRequest(UpdateMaterialSchema), materialsController.updateMaterial);

/**
 * @swagger
 * /api/materials/{id}:
 *   delete:
 *     summary: 删除材料
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 材料删除成功
 *       404:
 *         description: 材料不存在
 */
router.delete('/:id', materialsController.deleteMaterial);

export default router;
