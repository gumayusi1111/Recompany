import express from 'express'
import { getAllNews } from './controller'

const router = express.Router()
router.get('/', getAllNews)
export default router
