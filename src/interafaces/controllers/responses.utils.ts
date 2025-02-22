/* PROJECT LICENSE */

import { EventLogger } from '../../services/EventLogger';
import { Response } from 'express';

export function sendMethodNotImplemented(res: Response, method = 'Method'): Response {
  return res.status(501).json({
    message: `${method} not implemented`,
  });
}

export function sendNotFound(res: Response, message = 'Not found'): Response {
  return res.status(404).json({
    message,
  });
}

export function sendBadRequest(res: Response, message = 'Bad request'): Response {
  return res.status(400).json({
    message,
  });
}

export function sendOk(res: Response, data: unknown): Response {
  return res.status(200).json(data);
}

export function sendCreated(res: Response, data: unknown): Response {
  return res.status(201).json(data);
}

export function sendAccepted(res: Response): Response {
  return res.status(202).end();
}

export function sendServerError(res: Response, data: unknown): Response {
  EventLogger.err('Server error occurred: ' + data); // TODO: Review
  return res.status(500).end(); // Avoid sending data to the client
}
