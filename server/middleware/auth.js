const jwt = require('jsonwebtoken')

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }
  try {
    const token = authHeader.slice(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nota_speaks_secret_key_2025')
    req.admin = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
