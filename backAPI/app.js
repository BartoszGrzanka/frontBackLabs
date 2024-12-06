const express = require('express')
const swaggerUi = require('swagger-ui-express')
const cors = require('cors')
const swaggerDocument = require('./api-docs/swagger-output.json')
require('./generators/generateFakeProducts')
const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET, POST, PUT, DELETE,PATCH,'
  }))
const productsRouter = require('./routes/products')


app.use(express.json())
app.use('/products', productsRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.get('/', (req, res) => {
    res.send('Hi world')
});

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});
