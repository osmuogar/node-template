/* PROJECT LICENSE */

import { UsersRoutes } from './users.routes';
import cors from 'cors';
import express from 'express';
import { expressErrorHandler } from '../controllers/errorhandler.utils';

const apiService = express(); // Create HTTP server
apiService.use(cors()); // Enable CORS
apiService.use(express.json({})); // Set JSON content
apiService.use(express.urlencoded({ extended: true }));

apiService.use('/v1/users', UsersRoutes); // Set user routes

apiService.use(expressErrorHandler); // Set default error handler

export { apiService as APIService };
