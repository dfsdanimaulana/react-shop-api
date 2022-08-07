// create auth route
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const {
    encryptPassword,
    decryptPassword
} = require('../middleware/encryptPassword')

// register new user to database asyncronously
router.post('/register', encryptPassword, async (req, res) => {
    const { username, email, password } = req.body

    // check if fields are empty
    if (!username || !email || !password) {
        return res.status(400).send('Please enter all fields')
    }

    // save user to database
    const user = new User({
        username,
        email,
        password
    })

    try {
        const savedUser = await user.save()
        const { password, ...userData } = savedUser._doc
        req.user = userData
        res.json({ message: 'User created!', savedUser })
    } catch (err) {
        res.status(400).send(err)
    }
})

// login user asyncronously
router.post('/login', async (req, res) => {
    const { username, password: inputPassword } = req.body
    // check if username and password not empty
    if (!username || !inputPassword) {
        return res.status(400).send('Please enter all fields')
    }
    try {
        const user = await User.findOne({ username })

        // check if user exists
        if (!user) {
            return res.status(400).send({ message: 'User not found!' })
        }

        // check if password is correct
        if (decryptPassword(user.password) !== inputPassword) {
            return res.status(400).send({ message: 'Password is incorrect!' })
        }

        // generate token
        const token = jwt.sign(
            { _id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        )

        // send user data except password
        const { password, ...userData } = user._doc

        res.json({ ...userData, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router
