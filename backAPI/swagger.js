const swaggerAutogen = require('swagger-autogen')()
const path = require('path')


const outputFile = path.join(__dirname, 'api-docs/swagger-output.json')
const endpointsFiles = ['./routes/products.js']

const doc = {
    info: {
        title: 'Product API',
        description: 'API for managing products',
        version: '1.0.0',
    },
    host: 'localhost:3000',
    basePath: '/products',
    schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated!')
})