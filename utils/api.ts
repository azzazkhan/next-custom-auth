import { HttpException } from 'exceptions/HttpException';
import { reportError } from './error';
import { AxiosError } from 'axios';

type HandlerFn<R = any> = (
    callback: () => Promise<any>
) => Promise<[null, R] | [HttpException | AxiosError, null]>;

export const exceptionHandler: HandlerFn = async (callback, report?: boolean) => {
    try {
        return [null, await callback()];
    } catch (error) {
        if (report || process.env.REPORT_ERRORS) reportError(error);

        // Known error types
        if (error instanceof AxiosError) return [error, null];
        if (error instanceof HttpException) return [error, null];
        if (error instanceof Error) return [new HttpException(error.message), null];

        // Unknown or general error types
        if (typeof error === 'string') return [new HttpException(error), null];
        if (error && typeof error === 'object' && 'message' in error)
            return [typeof error.message === 'function' ? error.message() : error.message, null];

        // Empty errors
        return [new HttpException(), null];
    }
};
