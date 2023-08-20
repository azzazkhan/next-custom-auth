import { AxiosError } from 'axios';
import { HttpException, ValidationException } from 'exceptions';
import { NextResponse } from 'next/server';

export const reportError = (error: any) => {
    console.log('______________________________');
    console.log('Custom Error Reporter Function');
    console.log('______________________________');
    // console.error(error);
};

type ErrorOptions = { acceptsJson?: boolean };
type ErrorObject = { message: string; errors?: object | any[] };
export const getErrorResponse = (error: unknown, options: ErrorOptions = {}): NextResponse => {
    const { acceptsJson } = options;

    let response: ErrorObject = { message: 'Unknown error occurred!' };
    let status = 500;

    console.log(error);

    if (error instanceof AxiosError) {
        if (
            error.response &&
            error.response.data &&
            error.response.headers['content-type'] === 'application/json'
        ) {
            const res = error.response.data as APIError;
            response.message = res.message;
            status = error.response.status;
            if (res.errors) response.errors = res.errors;
        } else {
            response.message = error.message;
            status = error.response?.status || status;
        }
    } else if (error instanceof HttpException) {
        response = { message: error.message };
        if (error instanceof ValidationException) response.errors = error.errors;
        status = error.status;
    } else if (error instanceof Error) response = { message: error.message };
    else if (typeof error === 'string') response = { message: error };
    else if (typeof error === 'object')
        response = { message: 'Unknown error occurred!', errors: error || undefined };

    return acceptsJson
        ? NextResponse.json(response, { status })
        : new NextResponse(response.message, { status });
};
