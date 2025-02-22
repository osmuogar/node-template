/* PROJECT LICENSE */

import { ErrorRequestPresenter } from '../presenters/ErrorRequestPresenter';
import { EventLogger } from '../../services/EventLogger';
import { RequestPresenter } from '../presenters/RequestPresenter';
import { Response } from 'express';

export function sendMethodNotImplemented(res: Response, method = 'Method'): Response {
  return res.status(501).json({ message: `${method} not implemented` });
}

export function sendNotFound(res: Response, message = 'Not found'): Response {
  return res.status(404).json({ message });
}

export function sendBadRequest(res: Response, message: ErrorRequestPresenter): Response {
  return res.status(400).json(message);
}

export function sendOk(res: Response, message: RequestPresenter): Response {
  return res.status(200).json(message);
}

export function sendCreated(res: Response, message: RequestPresenter): Response {
  return res.status(201).json(message);
}

export function sendAccepted(res: Response): Response {
  return res.status(202).end();
}

export function sendServerError(res: Response, err: unknown): Response {
  EventLogger.err('Server error occurred: ' + err);
  return res.status(500).end(); // Avoid sending data to the client
}
