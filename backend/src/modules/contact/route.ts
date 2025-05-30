import express from 'express'
import { getAllContact } from './controller'

const router = express.Router()
router.get('/', getAllContact)
export default router
