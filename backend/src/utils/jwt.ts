import jwt from 'jsonwebtoken'

const SECRET_KEY = 'your_secret_key'

export function signToken(payload: object): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' })
}