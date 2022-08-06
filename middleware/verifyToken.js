const jwt = require('jsonwebtoken')

// verify token middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        res.status(401).json({ message: 'No token provided' })
    } else {
        const token = authHeader.split(' ')[1]
        if (token === 'null') {
            res.status(401).json({ message: 'Token is null' })
        } else {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                req.user = decoded
                next()
            } catch (err) {
                res.status(400).json({ message: 'Token is invalid' })
            }
        }
    }
}

// verify token and authorization
const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user._id == req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(401).json({ message: 'Unauthorized' })
        }
    })
}

// verify token and authorization for admin
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(401).json({ message: 'Unauthorized' })
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }
