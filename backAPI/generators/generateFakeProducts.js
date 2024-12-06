const fs = require('fs')
const { faker } = require('@faker-js/faker')
const path = require('path')


const generateProducts = (num = 2000) => {
  const products = [];
  
  for (let i = 0; i < num; i++) {
    const product = {
      id: i + 1,
      name: faker.commerce.productName(),
      category: faker.commerce.department(),
      quantity: faker.number.int({ min: 1, max: 100 }),
      unitPrice: faker.commerce.price(10, 1000, 2),
      supplier: faker.company.name(),
      dateAdded: faker.date.past(1).toISOString().split('T')[0],
    };

    products.push(product)
  }

  return products
}

const productsFilePath = path.join(__dirname, '../products.json')
fs.writeFileSync(productsFilePath, JSON.stringify(generateProducts(2000), null, 2))

console.log('2000 fake products have been generated and saved to products.json')
