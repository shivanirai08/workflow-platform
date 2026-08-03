import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Workflow Platform API',
      version: '1.0.0',
      description: 'Auth and workflow APIs',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  // files having @openapi comments
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);