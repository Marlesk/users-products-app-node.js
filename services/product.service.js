const Product = require('../models/product.model')

async function findLastInsertedProduct() {
  console.log("Find last inserted product")
  try {
    const result = await Product.find().sort({_id: -1}).limit(1)
    console.log("Success in finding last inserted product") 
    return result[0]
  } catch(error) {
    console.log("Problem in finding last inserted product", error)
    return false
  }
}

module.exports = { findLastInsertedProduct }