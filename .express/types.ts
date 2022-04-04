import { NextFunction, Request, Response } from 'express';

/**
 * Types for Controller function
 */
export type Controller = (oRequest: Request, oResponse: Response, oNext: NextFunction) => Promise<void> | void;

/**
 * Types for Middleware function
 */
export type Middleware = (next: (oRequest: Request, oResponse: Response) => Promise<void> | void) => Controller;