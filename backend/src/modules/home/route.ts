import express from 'express'
import { getAllHome } from './controller'

const router = express.Router()
router.get('/', getAllHome)
export default router
