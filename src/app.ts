import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import tradeRoutes from './modules/trade/trade.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import morgan from 'morgan';



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/signals', tradeRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);  // will always be last

export default app;