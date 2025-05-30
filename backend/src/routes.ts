import express from 'express'

import homeRouter from './modules/home/route'
import aboutRouter from './modules/about/route'
import contactRouter from './modules/contact/route'
import productsRouter from './modules/products/route'
import projectsRouter from './modules/projects/route'
import materialsRouter from './modules/materials/route'
import testimonialsRouter from './modules/testimonials/route'
import newsRouter from './modules/news/route'

const router = express.Router()

router.use('/api/home', homeRouter)
router.use('/api/about', aboutRouter)
router.use('/api/contact', contactRouter)
router.use('/api/products', productsRouter)
router.use('/api/projects', projectsRouter)
router.use('/api/materials', materialsRouter)
router.use('/api/testimonials', testimonialsRouter)
router.use('/api/news', newsRouter)

export default router