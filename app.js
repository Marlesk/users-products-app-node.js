const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const user = require('./routes/user.routes')
const userProduct = require('./routes/user.product.routes')
const auth = require('./routes/auth.routes')

const product = require('./routes/product.routes')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger')

// const cors = require('cors')

app.use('/api/users', user)

app.use('/api/user-product', userProduct)

app.use('/api/products', product)

app.use('/api/auth', auth)

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument.options))

app.use('/', express.static('files'))


// app.use(cors({
//   origin: '*'
//   // origin: ['http://localhost:3000']
// }))


module.exports = app