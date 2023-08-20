import { ValidationException } from 'exceptions';

type RequestValidator = <D extends Record<string, any>>(
    data: D,
    validations: Partial<{ [K in keyof D]: (val?: D[K]) => Record<string, boolean | RegExp> }>,
    throws?: boolean
) => Record<keyof D, string>; // Record<keyof D, string>

export const validateRequest: RequestValidator = (data, validations, throws = true) => {
    // { a: string, b: string } where [(a,b) in keyof validations]
    const messages: Record<string, string> = {};

    for (const key in validations) {
        const value = key in data ? data[key] : undefined;
        const validationFunction = validations[key];

        if (!validationFunction) continue;

        const results = validationFunction(value); // { [key: string]: boolean | RegExp }
        const errors: string[] = [];

        for (const message in results) {
            const condition = results[message]; // boolean | RegExp

            if (condition instanceof RegExp && typeof value === 'string')
                !condition.test(value) && errors.push(message);
            else !condition && errors.push(message);
        }

        if (errors.length > 0) messages[key] = errors[0];
    }

    // Throw a validation exception with generated error messages
    if (Object.keys(messages).length && throws)
        throw new ValidationException('Please fix the following errors!', messages);

    return messages as Record<keyof typeof validations, string>;
};
