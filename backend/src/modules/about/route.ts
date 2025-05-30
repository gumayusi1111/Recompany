import express from 'express'
import { getAllAbout } from './controller'

const router = express.Router()
router.get('/', getAllAbout)
export default router
