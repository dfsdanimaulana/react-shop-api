// create cart router
const router = require('express').Router()
// const Cart = require('../models/cart');

router.get('/', (req, res) => {
    res.send('cart')
})

module.exports = router
