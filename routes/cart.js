const router = require('express').Router()
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require('../middleware/verifyToken')
const Cart = require('../models/cart')

// create cart route asynchronously
router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)

    try {
        const savedCart = await newCart.save()
        res.json(savedCart)
    } catch (err) {
        res.status(400).json(err)
    }
})

// update cart route asynchronously
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )
        res.json(updatedCart)
    } catch (err) {
        res.status(400).json(err)
    }
})

// delete cart route asynchronously
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const deletedCart = await Cart.findByIdAndDelete(req.params.id)
        if (!deletedCart) {
            return res.status(404).json({ message: 'Cart not found' })
        }
        res.json({ message: 'Cart deleted!', deletedCart })
    } catch (err) {
        res.status(400).json(err)
    }
})

// get cart by id route asynchronously
router.get('/:userId', async (req, res) => {
    try {
        const foundCart = await Cart.findOne({
            userId: req.params.userId
        })
        res.json(foundCart)
    } catch (err) {
        res.status(400).json({ message: 'Cart not found!', err })
    }
})

// get all cart
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find()
        res.json(carts)
    } catch (err) {
        res.status(400).json(err)
    }
})

module.exports = router
