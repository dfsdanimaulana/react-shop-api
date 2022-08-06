// create user route
const router = require('express').Router()
const User = require('../models/User')
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require('../middleware/verifyToken')
const { encryptPassword } = require('../middleware/encryptPassword')

// get all users from database asyncronously
router.get('/', async (req, res) => {
    const query = req.query.new
    try {
        const users = query
            ? await User.find({}).sort({ _id: -1 }).limit(5)
            : await User.find({})
        res.json(users)
    } catch (err) {
        res.status(400).json(err)
    }
})

// get user stats asyncronously
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

    try {
        const data = await User.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: lastYear
                    }
                }
            },
            {
                $project: {
                    month: {
                        $month: '$createdAt'
                    }
                }
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: 1 }
                }
            }
        ])
        res.json(data)
    } catch (err) {
        res.status(400).json(err)
    }
})

// get user by id asyncronously
router.get('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...userData } = user._doc
        res.json(userData)
    } catch (err) {
        res.status(400).json(err)
    }
})

// update user asyncronously
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    // encrypt password
    const { password } = req.body
    if (password) {
        req.body.password = await encryptPassword(password)
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        )
        res.json(user)
    } catch (err) {
        res.status(400).json(err)
    }
})

// delete user asyncronously
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        if (!deletedUser) {
            return res.status(400).json({ message: 'User not found' })
        }
        res.json({ message: 'User deleted!' })
    } catch (err) {
        res.status(400).json(err)
    }
})

module.exports = router
