import { OpenAPIV3 } from 'openapi-types';

const swaggerSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Crypto Trade API',
    version: '1.0.0',
    description: 'API documentation for Crypto Trade Backend',
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
                required: ['name', 'email', 'password'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'User registered successfully' },
          '409': { description: 'User already exists' },
        },
      },
    },

    '/auth/login': {
      post: {
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },

    '/signals': {
      get: {
        summary: 'Get all signals (Admin only)',
        responses: {
          '200': { description: 'List of signals' },
          '403': { description: 'Forbidden' },
        },
      },
      post: {
        summary: 'Create a trade signal',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  asset: { type: 'string' },
                  direction: { type: 'string', enum: ['LONG', 'SHORT'] },
                  entryPrice: { type: 'string' },
                  targetPrice: { type: 'string' },
                  stopLoss: { type: 'string' },
                },
                required: [
                  'asset',
                  'direction',
                  'entryPrice',
                  'targetPrice',
                  'stopLoss',
                ],
              },
            },
          },
        },
        responses: {
          '201': { description: 'Signal created successfully' },
        },
      },
    },

    '/signals/mine': {
      get: {
        summary: 'Get my trade signals',
        responses: {
          '200': { description: 'User signals' },
        },
      },
    },

    '/signals/{id}': {
      put: {
        summary: 'Update a trade signal',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'Signal updated' },
          '403': { description: 'Forbidden' },
        },
      },
      delete: {
        summary: 'Delete a trade signal',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'Signal deleted' },
          '403': { description: 'Forbidden' },
        },
      },
    },
  },
};

export default swaggerSpec;