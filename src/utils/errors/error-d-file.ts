
abstract class CustomError extends Error {
    abstract statusCode: number

    constructor() {
        super()

        Object.setPrototypeOf(this , CustomError.prototype)
    }

    abstract sanitizeError(): {message: string, field?: string}[]
}

export { CustomError }