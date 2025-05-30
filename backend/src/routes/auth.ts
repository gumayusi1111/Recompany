import { Router } from 'express'
import { signToken } from '../utils/jwt'

const router = Router()

// 模拟登录：用户为 admin / user 密码随意
router.post('/login', (req, res) => {
  const { username } = req.body
  const role = username === 'admin' ? 'admin' : 'user'
  const token = signToken({ username, role })
  res.json({ token, role })
})

export default router
