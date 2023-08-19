export class HttpException extends Error {
    public readonly status: number;

    constructor(message?: string, status?: number) {
        super(message || 'An unknown error occurred!');
        this.status = status || 500;
    }
}
