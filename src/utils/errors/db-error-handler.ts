import { CustomError } from './error-d-file'

class DBConnectionError extends CustomError {
    reason = 'DB connection error'
    statusCode: number = 500

    constructor() {
        super()

        Object.setPrototypeOf(this, DBConnectionError.prototype)
    }

    sanitizeErrors() {
        return [{
            message: this.reason
        }]
    }
}

export { DBConnectionError }