import express from 'express';
import { validateRequest } from '../../../middleware/validateRequest';
import * as contactController from '../controllers';
import { CreateContactSchema, UpdateContactSchema } from '../schemas';

const router = express.Router();

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: u83b7u53d6u6240u6709u8054u7cfbu6211u4eecu6570u636e
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: u6210u529fu8fd4u56deu6240u6709u8054u7cfbu6211u4eecu6570u636e
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
router.get('/', contactController.getAllContact);

/**
 * @swagger
 * /api/contact/{id}:
 *   get:
 *     summary: u6839u636eIDu83b7u53d6u8054u7cfbu6211u4eecu6570u636e
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: u6210u529fu8fd4u56deu8054u7cfbu6211u4eecu6570u636e
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
 *         description: u8054u7cfbu6211u4eecu6570u636eu4e0du5b58u5728
 */
router.get('/:id', contactController.getContactById);

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: u521bu5efau65b0u7684u8054u7cfbu6211u4eecu6570u636e
 *     tags: [Contact]
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
 *         description: u6210u529fu521bu5efau8054u7cfbu6211u4eecu6570u636e
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
 *                   example: u521bu5efau6210u529f
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
router.post('/', validateRequest(CreateContactSchema), contactController.createContact);

/**
 * @swagger
 * /api/contact/{id}:
 *   patch:
 *     summary: u66f4u65b0u8054u7cfbu6211u4eecu6570u636e
 *     tags: [Contact]
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
 *         description: u6210u529fu66f4u65b0u8054u7cfbu6211u4eecu6570u636e
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
 *                   example: u66f4u65b0u6210u529f
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
 *         description: u8054u7cfbu6211u4eecu6570u636eu4e0du5b58u5728
 */
router.patch('/:id', validateRequest(UpdateContactSchema), contactController.updateContact);

/**
 * @swagger
 * /api/contact/{id}:
 *   delete:
 *     summary: u5220u9664u8054u7cfbu6211u4eecu6570u636e
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: u6210u529fu5220u9664u8054u7cfbu6211u4eecu6570u636e
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
 *                   example: u5220u9664u6210u529f
 *                 data:
 *                   type: null
 *       404:
 *         description: u8054u7cfbu6211u4eecu6570u636eu4e0du5b58u5728
 */
router.delete('/:id', contactController.deleteContact);

export default router;
