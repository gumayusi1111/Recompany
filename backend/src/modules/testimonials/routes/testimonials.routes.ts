import express from 'express';
// 使用相对路径导入中间件
import { validateRequest } from '../../../middleware/validateRequest';
import { CreateTestimonialSchema, UpdateTestimonialSchema } from '../schemas/testimonial.schema';
import * as testimonialsController from '../controllers';

const router = express.Router();

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: 获取所有证言
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: 成功获取证言列表
 */
router.get('/', testimonialsController.getAllTestimonials);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   get:
 *     summary: 获取单个证言
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功获取证言
 *       404:
 *         description: 证言不存在
 */
router.get('/:id', testimonialsController.getTestimonialById);

/**
 * @swagger
 * /api/testimonials:
 *   post:
 *     summary: 创建新证言
 *     tags: [Testimonials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTestimonial'
 *     responses:
 *       201:
 *         description: 证言创建成功
 *       400:
 *         description: 无效的输入
 */
router.post('/', validateRequest(CreateTestimonialSchema), testimonialsController.createTestimonial);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   put:
 *     summary: 更新证言
 *     tags: [Testimonials]
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
 *             $ref: '#/components/schemas/UpdateTestimonial'
 *     responses:
 *       200:
 *         description: 证言更新成功
 *       400:
 *         description: 无效的输入
 *       404:
 *         description: 证言不存在
 */
router.put('/:id', validateRequest(UpdateTestimonialSchema), testimonialsController.updateTestimonial);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   delete:
 *     summary: 删除证言
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 证言删除成功
 *       404:
 *         description: 证言不存在
 */
router.delete('/:id', testimonialsController.deleteTestimonial);

export default router;
