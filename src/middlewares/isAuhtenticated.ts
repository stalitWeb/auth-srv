import { Request, Response, NextFunction } from 'express';
import { jwt } from 'jsonwebtoken';
import { NotAuthorizedError } from '../utils/errors/not-authorized-error';

interface UserPayload {
    id: string,
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload
        }
    }
}

function isAuthenticated(req, res, next) {
    try {
        if (!req.session && req.session.jwt) {
            throw new NotAuthorizedError('authorization failed')
        }
        // const token = req.header('auth-x-token');
        // if (!token) {
        //    throw new NotAuthorizedError('authorization failed')
        // }
        const decoded = jwt.verify( req.session.jwt, process.env.JWT_SECRET) as UserPayload;
        if (!decoded) {
           throw new NotAuthorizedError('authorization failed')
        }
        req.user = decoded;
        next();
    } catch (error) {
        throw new NotAuthorizedError('authorization failed')
    }
}

export { isAuthenticated };
