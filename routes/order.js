// create order router
const router = require('express').Router()
// const Order = require('../models/Order');

router.get('/', (req, res) => {
    res.send('order')
})

module.exports = router
