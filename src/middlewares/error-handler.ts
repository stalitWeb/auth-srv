import {Request , Response,  NextFunction} from 'express'

import {CustomError} from '../utils/errors/error-d-file'

function errorHandler(err: Error , req: Request,  res: Response, next: NextFunction) {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({errors: err.sanitizeError()})
    }
    
    return res.status(500).json({errors: [{message: 'server error'}]})
}

export { errorHandler }
