import { HttpException } from './HttpException';

export class ServerException extends HttpException {
    constructor(message?: string) {
        super(message, 500);
    }
}
