import { HttpException } from './HttpException';

const minutesFn = (minutes: number) => `${minutes} minute${minutes === 1 ? '' : 's'}`;
const secondsFn = (seconds: number) => `${seconds} second${seconds === 1 ? '' : 's'}`;

export class TooManyAttemptsException extends HttpException {
    constructor(message?: string, timeout?: number) {
        message = message || 'Too many attempts, try again in %s!';
        timeout = timeout || 60;

        // Convert seconds in to minutes and seconds
        const minutes = Math.floor(timeout / 60);
        const seconds = timeout % 60;

        // Get appropriate message based on the remaining duration
        let duration = '';
        if (minutes && seconds) duration = `${minutesFn(minutes)} and ${secondsFn(seconds)}`;
        else if (minutes && !seconds) duration = minutesFn(minutes);
        else if (!minutes && seconds) duration = secondsFn(seconds);
        else 'a while';

        // Inject the calculated duration at placeholder
        super(message.replace('%s', duration), 429);
    }
}
