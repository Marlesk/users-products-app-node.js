const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')
require('dotenv').config()

const authService = require('../services/auth.service')
const productService = require('../services/product.service')


beforeEach(async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connection to MongoDB for Jest")

  } catch (error) {
    console.log("Failed to connect to MongoDB for Jest", error)

  }
})

afterEach(async() => {
  await mongoose.connection.close()
  console.log("Disconnected from MongoDB after test")
})

describe('Requests for /api/products', () => {
  let token 
  beforeAll(() => {
    user = {
      username: "admin",
      email: "admin@aueb.gr",
      roles: ["EDITORS", "READER", "ADMIN"]
    }
    token = authService.generateAccessToken(user)
  })

  it('GET returns all products', async() => {
    const res = await request(app)
                    .get('/api/products')
                    .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
    expect(res.body.data.length).toBeGreaterThan(0)
  }, 50000)

  it('CREATE a product', async() => {
    const res = await request(app)
                  .post('/api/products')
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    'product': 'product jest test',
                    'cost': 20,
                    'description': 'Description for product jest test',
                    'quantity': 35
                  })
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  }, 50000)

  it('CREATE a product with same name', async() => {
    const res = await request(app)
                  .post('/api/products')
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    'product': 'product test',
                    'cost': 20,
                    'description': 'Description for product test',
                    'quantity': 35
                  })
    expect(res.statusCode).toBe(400)
    expect(res.body.status).not.toBeTruthy()
  }, 50000)

  const invalidPayloads = [
    { missingField: 'product', body: { cost: 10, description: 'desc', quantity: 1 } },
    { missingField: 'cost', body: { product: 'test', description: 'desc', quantity: 1 } },
    { missingField: 'description', body: { product: 'test', cost: 10, quantity: 1 } },
    { missingField: 'quantity', body: { product: 'test', cost: 10, description: 'desc' } }
  ];

  invalidPayloads.forEach(({ missingField, body }) => {
    it(`CREATE a product with empty ${missingField} `, async() => {
      const res = await request(app)
                    .post('/api/products')
                    .set('Authorization', `Bearer ${token}`)
                    .send(body)
      expect(res.statusCode).toBe(400)
      expect(res.body.status).not.toBeTruthy()
    }, 50000)
  })

})

describe('Requests for /api/products/:id', () => {
  let token 
  beforeAll(() => {
    user = {
      username: "admin",
      email: "admin@aueb.gr",
      roles: ["EDITORS", "READER", "ADMIN"]
    }
    token = authService.generateAccessToken(user)
  })

  it('GET returns specific product', async() => {
    const result = await productService.findLastInsertedProduct()

    const res = await request(app)
                  .get('/api/products/'+ result.product)
                  .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
    expect(res.body.data.product).toBe(result.product)
  }, 50000)

  it('GET returns 404 if product does not exist', async () => {
    const nonExistentProduct = 'product xyxytfdsr'

    const res = await request(app)
      .get('/api/products/' + nonExistentProduct)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(404)
    expect(res.body.status).not.toBeTruthy()
  }, 50000)

  it('PATCH updates product', async() => {
    const result = await productService.findLastInsertedProduct()

    const res = await request(app)
                  .patch('/api/products/'+ result.product)
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    product: "Updated Product Name",
                    cost: 25,
                    description: "Updated description",
                    quantity: 15
                  })
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  }, 50000)

  it('DELETE deletes a product', async() => {
    const result = await productService.findLastInsertedProduct()

    const res = await request(app)
                  .delete('/api/products/'+ result.product)
                  .set('Authorization', `Bearer ${token}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  }, 50000)

})
