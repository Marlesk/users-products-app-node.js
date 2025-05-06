const Product = require('../models/product.model')

exports.findAll = async(req, res) => {
  console.log('Find all products from collection products')
  try {
    const result = await Product.find()
    res.status(200).json({status: true, data: result})
  } catch (error) {
    console.log("Problem in reading products", error)
    res.status(400).json({status: false, error: error.message})
  }
}

exports.findOne = async(req, res) => {
  console.log('Find details for a specific product')
  const productName = req.params.id

  try {
    const result = await Product.findOne({product: productName})

    if(result) {
      res.status(200).json({status: true, data: result})
    } else {
      res.status(404).json({status: false, data: "Product not exist"})
    }
  } catch(error) {
    console.log("Problem in finding product", error)
    res.status(400).json({status: false, errr: error.message})
  }
}

exports.create = async(req, res) => {
  let data = req.body

  console.log('Create a new product')

  const newProduct = new Product({
    product: data.product,
    cost: data.cost,
    description: data.description,
    quantity: data.quantity
  })

  try {
    const result = await newProduct.save()
    res.status(200).json({status: true, data: result})
  } catch(error) {
    console.log('Problem in creating product', error)
    res.status(400).json({status: false, error: error.message})
  }
}

exports.update = async(req, res) => {
  let productName = req.params.id
  console.log('Update product', productName)
  let data = req.body
  const updateProduct = {
    product: data.product,
    cost: data.cost,
    description: data.description,
    quantity: data.quantity
  }
  try {
    const result = await Product.findOneAndUpdate({product: productName}, updateProduct, {new: true})
    res.status(200).json({status: true, data: result})
  } catch (error) {
    console.log("Problem in updating product", error)
    res.status(400).json({status: false, error: error.message})
  }
}

exports.deleteByName = async(req, res) => {
  const productName = req.params.id
  console.log('Delete product', productName)

  try {
    const result = await Product.findOneAndDelete({product: productName})
    res.status(200).json({status: true, data: result})
  } catch (error) {
    console.log("Problem in deleting product", error)
    res.status(400).json({status: false, error: error.message})
  }
}