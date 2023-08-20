import { NextRequest, NextResponse } from 'next/server';
import { BadRequestException, HttpException } from 'exceptions';
import { exceptionHandler, getClientIp, getErrorResponse, validateRequest } from 'utils';
import { axios } from 'lib/axios.lib';
import { AxiosError } from 'axios';

type ReqBody = { username: string; password: string };

export const POST = async (req: NextRequest) => {
    const contentType = req.headers.get('Content-Type');
    const acceptsJson = req.headers.get('Accept') === 'application/json';

    const [error, response] = await exceptionHandler(async () => {
        if (contentType !== 'application/json' || !req.body)
            throw new BadRequestException('Only JSON requests are allowed!');

        const data = (await req.json()) as ReqBody;

        validateRequest(data, {
            username: (val) => ({ 'Username is required!': !!val }),
            password: (val) => ({ 'Password is required!': !!val }),
        });

        const response = await axios.post('login', data, {
            headers: { 'X-Forwarded-For': getClientIp(req) },
        });

        if (acceptsJson) return NextResponse.json({ message: 'The API endpoint is working!' });

        return new NextResponse();
    });

    if (error) return getErrorResponse(error, { acceptsJson });

    return response instanceof NextResponse ? response : new NextResponse(response);
};
