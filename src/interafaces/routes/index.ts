/* PROJECT LICENSE */

import { UsersRoutes } from './users.routes';
import cors from 'cors';
import express from 'express';

// Create HTTP server
const apiService = express();
apiService.use(cors());
apiService.use(express.json({}));
apiService.use(express.urlencoded({ extended: true }));

apiService.use('/v1/users', UsersRoutes);

export { apiService as APIService };
