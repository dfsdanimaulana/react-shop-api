// create express app
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express()

dotenv.config()
const port = process.env.PORT || 5000

// routes
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')
const cartRoutes = require('./routes/cart')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// create mongo connection
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('connected to mongodb')
})

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/product', productRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/cart', cartRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
