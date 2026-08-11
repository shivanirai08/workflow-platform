import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.middleware';
import authRoute from './modules/auth/auth.route';
import organizationRoute from './modules/organizations/org.route';

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoute);
app.use('/api/organizations', organizationRoute);

app.use(errorHandler);

export default app;