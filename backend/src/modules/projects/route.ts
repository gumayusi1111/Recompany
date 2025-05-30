import express from 'express'
import { getAllProjects } from './controller'

const router = express.Router()
router.get('/', getAllProjects)
export default router
