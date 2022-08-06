const router = require('express').Router()
const { verifyTokenAndAdmin } = require('../middleware/verifyToken')
const Product = require('../models/product')

// create product route asynchronously
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save()
        res.json(savedProduct)
    } catch (err) {
        res.status(400).json(err)
    }
})

// update product route asynchronously
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )
        res.json(updatedProduct)
    } catch (err) {
        res.status(400).json(err)
    }
})

// delete product route asynchronously
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id)
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.json({ message: 'Product deleted!', deletedProduct })
    } catch (err) {
        res.status(400).json(err)
    }
})

// get product by id route asynchronously
router.get('/:id', async (req, res) => {
    try {
        const foundProduct = await Product.findById(req.params.id)

        res.json(foundProduct)
    } catch (err) {
        res.status(400).json({ message: 'Product not found!', err })
    }
})

// get all products with query route asynchronously
router.get('/', async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category
    try {
        let products
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5)
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory]
                }
            })
        } else {
            products = await Product.find()
        }
        res.json(products)
    } catch (err) {
        res.status(400).json(err)
    }
})

module.exports = router
