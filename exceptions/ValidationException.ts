import { HttpException } from './HttpException';

export class ValidationException extends HttpException {
    readonly errors: Record<string, string | string[]> = {};

    constructor(message?: string, errors?: Record<string, string | string[]>) {
        message = message || 'Please fix the following errors!';

        super(message, 400);
        this.errors = errors || this.errors;
    }
}
