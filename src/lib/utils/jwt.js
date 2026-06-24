import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

export function signToken(payload, expiresIn) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return null
  }
}
