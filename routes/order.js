const router = require('express').Router()
const {
    verifyToken,
    verifyTokenAndAdmin
} = require('../middleware/verifyToken')
const Order = require('../models/order')

// create order route asynchronously
router.post('/', verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const savedOrder = await newOrder.save()
        res.json(savedOrder)
    } catch (err) {
        res.status(400).json(err)
    }
})

// get monthly income
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(
        new Date().setMonth(lastMonth.getMonth() - 1)
    )

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: '$createdAt' },
                    sales: '$amount'
                }
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: '$sales' }
                }
            }
        ])
        res.json(income)
    } catch (err) {
        res.status(400).json(err)
    }
})

// update order route asynchronously
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )
        res.json(updatedOrder)
    } catch (err) {
        res.status(400).json(err)
    }
})

// delete order route asynchronously
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id)
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.json({ message: 'Order deleted!', deletedOrder })
    } catch (err) {
        res.status(400).json(err)
    }
})

// get order by id route asynchronously
router.get('/:userId', async (req, res) => {
    try {
        const foundOrders = await Order.find({
            userId: req.params.userId
        })
        res.json(foundOrders)
    } catch (err) {
        res.status(400).json({ message: 'Order not found!', err })
    }
})

// get all order
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
        res.json(orders)
    } catch (err) {
        res.status(400).json(err)
    }
})

module.exports = router
