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
    components: {
      securitySchemes: {
        // Access token 
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        // Refresh cookie
        refreshCookie: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refresh', // cookie ka exact name (jo res.cookie('refresh', ...) hai)
        },
      },
    },
  },
  apis: ['./src/modules/**/*route.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);