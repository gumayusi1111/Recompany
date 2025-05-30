import express from 'express'
import { getAllTestimonials } from './controller'

const router = express.Router()
router.get('/', getAllTestimonials)
export default router
