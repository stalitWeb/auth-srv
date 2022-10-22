import { CustomError }from './error-d-file'

class BadRequestError extends CustomError {
    statusCode =  400
    
    constructor(public error: string) {
        super()

        Object.setPrototypeOf(this , BadRequestError.prototype)
    }

    sanitizeErrors() {
        return [{ message: this.error }]
    }
}

export { BadRequestError }