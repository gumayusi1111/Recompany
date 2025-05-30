import express from 'express'
import productsRouter from '../modules/products/route'
import projectsRouter from '../modules/projects/route'
import materialsRouter from '../modules/materials/route'
import testimonialsRouter from '../modules/testimonials/route'
import newsRouter from '../modules/news/route'

const router = express.Router()

router.use('/products', productsRouter)
router.use('/projects', projectsRouter)
router.use('/materials', materialsRouter)
router.use('/testimonials', testimonialsRouter)
router.use('/news', newsRouter)

export default router
