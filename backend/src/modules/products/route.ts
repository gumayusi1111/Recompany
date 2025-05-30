import express from 'express'
import { getAllProducts } from './controller'

const router = express.Router()
router.get('/', getAllProducts)
export default router
