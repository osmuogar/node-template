/* PROJECT LICENSE */

import { UsersRoutes } from './users.routes';
import cors from 'cors';
import express from 'express';
import { expressErrorHandler } from '../controllers/errorhandler.utils';

// Create HTTP server
const apiService = express();
apiService.use(cors()); // Enable CORS
apiService.use(express.json({})); // Set JSON content
apiService.use(express.urlencoded({ extended: true }));

apiService.use(expressErrorHandler); // Set default error handler

// HTTP Routes
apiService.use('/v1/users', UsersRoutes);

export { apiService as APIService };
