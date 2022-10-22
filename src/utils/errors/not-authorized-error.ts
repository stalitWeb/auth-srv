import { CustomError } from './error-d-file';

class NotAuthorizedError extends CustomError {
    statusCode = 401;

    constructor(public error: string) {
        super();

        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    sanitizeErrors() {
        return [{ message: this.error }];
    }
}

export { NotAuthorizedError };
