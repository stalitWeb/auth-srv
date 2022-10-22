import { ValidationError } from 'express-validator';
import { CustomError } from './error-d-file.js'

class ValidationRequestError extends CustomError {

    statusCode: number = 400

    constructor(public errors: ValidationError[]) {
        super();

        Object.setPrototypeOf(this, ValidationRequestError.prototype);
    }

    sanitizeErrors() {
        return this.errors.map((err, ind) => {
            return {
                message: err.msg,
                field: err.param,
            };
        });
    }
}

export { ValidationRequestError };
