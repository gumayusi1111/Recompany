import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'dev-secret'

export function auth(requiredRole?: 'admin' | 'user') {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ msg: 'Missing token' })

    try {
      const decoded = jwt.verify(token, SECRET) as any
      req.user = decoded
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ msg: 'Forbidden' })
      }
      next()
    } catch {
      res.status(401).json({ msg: 'Invalid token' })
    }
  }
}
