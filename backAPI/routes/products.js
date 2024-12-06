const express = require('express')
const fs = require('fs')
const router = express.Router()
// const { v4: uuidv4 } = require('uuid')

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API to manage products
 */

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search for products by category and price
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         description: Product category to filter by
 *         schema:
 *           type: string
 *       - in: query
 *         name: maxPrice
 *         required: false
 *         description: Maximum price to filter products by
 *         schema:
 *           type: number
 *           format: float
 *     responses:
 *       200:
 *         description: A list of filtered products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: No products found matching criteria
 */
router.get('/search', (req, res) => {
    // console.log('Received search request with:', req.query)
    const { category, maxPrice } = req.query

    fs.readFile('products.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Błąd przy wczytywaniu' })
            return
        }

        let products = JSON.parse(data)
        if (category) {
            products = products.filter(p => p.category.toLowerCase().includes(category.toLowerCase()))
        }
        if (maxPrice) {
            const maxPriceValue = parseFloat(maxPrice)
            if (!isNaN(maxPriceValue)) {
                products = products.filter(p => p.unitPrice <= maxPriceValue)
            }
        }
        if (products.length === 0) {
            return res.status(404).send('Brak produktów spełniających kryteria')
        }
        res.json(products)
    })
    //localhost:3000/search?category=Elektronika&maxPrice=600
})

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', (req, res) => {
    fs.readFile('products.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Błąd przy wczytywaniu' })
            return
        }
        const products = JSON.parse(data)
        res.json(products)
    })
})
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The product ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id)
    fs.readFile('products.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Błąd przy wczytywaniu' })
            return
        }

        const products = JSON.parse(data)
        const product = products.find(p => p.id === productId)

        if (!product) {
            return res.status(404).send('Produktu nie znaleziono')
        }
        res.json(product)
    })
})

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Missing required fields
 */
router.post('/', (req, res) => {
    const { name, category, quantity, unitPrice, supplier } = req.body

    if (!name || !category || !quantity || !unitPrice || !supplier) {
        return res.status(400).json({ error: 'Wszystkie pola są wymagane' })
    }

    fs.readFile('products.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd przy wczytywaniu' })
        }

        const products = JSON.parse(data)
        const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1
        const productToAdd = { 
            // id: uuidv4()
            id: newId, 
            name, 
            category, 
            quantity, 
            unitPrice, 
            supplier, 
            dateAdded: new Date().toISOString().split('T')[0] 
        }

        products.push(productToAdd)

        fs.writeFile('products.json', JSON.stringify(products, null, 2), 'utf-8', err => {
            if (err) {
                return res.status(500).json({ error: 'Błąd przy zapisie' })
            }
            res.status(201).json(productToAdd)
        })
    })
})

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The product ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Product not found
 */
router.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id)
    const { name, category, quantity, unitPrice, supplier } = req.body

    if (!name || !category || !quantity || !unitPrice || !supplier) {
        return res.status(400).json({ error: 'Wszystkie pola są wymagane' })
    }

    fs.readFile('products.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd przy wczytywaniu' })
        }

        const products = JSON.parse(data)
        const productIndex = products.findIndex(p => p.id === productId)

        if (productIndex === -1) {
            return res.status(404).send('Produktu nie znaleziono')
        }
        const updatedProduct = { 
            id: productId, 
            name, 
            category, 
            quantity, 
            unitPrice, 
            supplier, 
            dateAdded: products[productIndex].dateAdded 
        }

        products[productIndex] = updatedProduct

        fs.writeFile('products.json', JSON.stringify(products, null, 2), 'utf-8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Błąd przy zapisie' })
            }

            res.status(200).json(updatedProduct)
        })
    })
})

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The product ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.patch('/:id', (req, res) => {
    const productId = parseInt(req.params.id)
    const { name, category, quantity, unitPrice, supplier } = req.body

    fs.readFile('products.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd przy wczytywaniu' })
        }

        const products = JSON.parse(data)
        const productIndex = products.findIndex(p => p.id === productId)

        if (productIndex === -1) {
            return res.status(404).send('Produktu nie znaleziono')
        }

        const product = products[productIndex]

        if (name) product.name = name
        if (category) product.category = category
        if (quantity) product.quantity = quantity
        if (unitPrice) product.unitPrice = unitPrice
        if (supplier) product.supplier = supplier

        fs.writeFile('products.json', JSON.stringify(products, null, 2), 'utf-8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Błąd przy zapisie' })
            }

            res.status(200).json(product)
        })
    })
})


router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id)
    fs.readFile('products.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd przy wczytywaniu' })
        }

        const products = JSON.parse(data)
        const productIndex = products.findIndex(p => p.id === productId)

        if (productIndex === -1) {
            return res.status(404).send('Produktu nie znaleziono')
        }
        products.splice(productIndex, 1)
        fs.writeFile('products.json', JSON.stringify(products, null, 2), 'utf-8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Błąd przy zapisie' })
            }

            res.status(200).json({ message: 'Produkt został usunięty' })
        })
    })
})






module.exports = router