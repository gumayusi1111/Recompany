import express, { Express } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Company_RE API',
      version: '1.0.0',
    },
  },
  apis: ['./src/modules/**/*.ts'], // 自动读取模块接口注释
}

const swaggerSpec = swaggerJsdoc(options)

function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

export default setupSwagger