import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import {ValidationRequestError } from '../utils/errors/validation-request-error-handler';

function validateRequest(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationRequestError(errors.array());
    }
    next();
}

export { validateRequest };
