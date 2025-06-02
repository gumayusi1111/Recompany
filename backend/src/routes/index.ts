import express from 'express'
import healthRouter from './health'
import homeRouter from '../modules/home/routes'

const router = express.Router()

// 健康检查路由应放在最前面，确保容易访问
router.use('/health', healthRouter)

// 业务模块路由
router.use('/home', homeRouter)

// 注释掉暂时不存在的模块，避免构建错误
// import productsRouter from '../modules/products/route'
// import projectsRouter from '../modules/projects/route'
// import materialsRouter from '../modules/materials/route'
// import testimonialsRouter from '../modules/testimonials/route'
// import newsRouter from '../modules/news/route'
// router.use('/products', productsRouter)
// router.use('/projects', projectsRouter)
// router.use('/materials', materialsRouter)
// router.use('/testimonials', testimonialsRouter)
// router.use('/news', newsRouter)

export default router
