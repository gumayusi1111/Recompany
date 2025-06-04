import express from 'express'
import healthRouter from './health'
import homeRouter from '../modules/home/routes'
import aboutRouter from '../modules/about/routes'
import productsRouter from '../modules/products/routes'
import casesRouter from '../modules/cases/routes'  // 重命名：projects -> cases
import materialsRouter from '../modules/materials/routes'
import testimonialsRouter from '../modules/testimonials/routes'
import newsRouter from '../modules/news/routes'
import contactRouter from '../modules/contact/routes'

const router = express.Router()

// 健康检查路由应放在最前面，确保容易访问
router.use('/health', healthRouter)

// 业务模块路由
router.use('/home', homeRouter)
router.use('/about', aboutRouter)
router.use('/products', productsRouter)
router.use('/cases', casesRouter)  // 统一使用 cases 路由
router.use('/materials', materialsRouter)
router.use('/testimonials', testimonialsRouter)
router.use('/news', newsRouter)
router.use('/contact', contactRouter)

export default router
