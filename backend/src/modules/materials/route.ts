import express from 'express'
import { getAllMaterials } from './controller'

const router = express.Router()
router.get('/', getAllMaterials)
export default router
