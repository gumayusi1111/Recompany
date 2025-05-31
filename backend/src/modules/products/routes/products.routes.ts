import express from 'express';
// 使用相对路径导入中间件
import { validateRequest } from '../../../middleware/validateRequest';
import { CreateProductSchema, UpdateProductSchema } from '../schemas/product.schema';
import * as productController from '../controllers';

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: 获取所有产品
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: 成功获取产品列表
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: 根据ID获取产品
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 产品ID
 *     responses:
 *       200:
 *         description: 成功获取产品
 *       404:
 *         description: 产品不存在
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: 创建新产品
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProduct'
 *     responses:
 *       201:
 *         description: 产品创建成功
 */
router.post('/', validateRequest(CreateProductSchema), productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: 更新产品信息
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 产品ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       200:
 *         description: 产品更新成功
 *       404:
 *         description: 产品不存在
 */
router.put('/:id', validateRequest(UpdateProductSchema), productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: 删除产品
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 产品ID
 *     responses:
 *       200:
 *         description: 产品删除成功
 *       404:
 *         description: 产品不存在
 */
router.delete('/:id', productController.deleteProduct);

export default router;
