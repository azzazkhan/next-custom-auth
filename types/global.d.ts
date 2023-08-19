import type { ReactNode } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // Application configurations
            readonly NEXT_PUBLIC_APP_NAME?: string;
            readonly NEXT_PUBLIC_APP_DESCRIPTION?: string;
            readonly NEXT_PUBLIC_APP_URL?: string;

            // API Endpoints
            readonly NEXT_PUBLIC_BACKEND_URL?: string;

            // Rate limit configurations
            readonly RATE_LIMIT_DURATION?: string;
            readonly RATE_LIMIT_ATTEMPTS?: string;
            readonly RATE_LIMIT_COOLDOWN?: string;

            // Error reporting configurations
            readonly REPORT_ERRORS?: string;
        }
    }

    type ClassName = string | undefined | null | string[] | Record<string, unknown>;
    type Nullable<T = unknown> = T | null;

    type Params = Record<
        string,
        string | string[] | number | number[] | null | boolean | undefined
    >;
    type ServerComponent<P = object, E extends Params = object> = (
        props: P & { params: E }
    ) => Promise<ReactNode> | ReactNode;
    type MetadataFn<
        P extends Record<string, string> = object,
        S extends Record<string, string> = object,
    > = (
        props: { params: P; searchParams: S },
        parent: ResolvingMetadata
    ) => Metadata | Promise<Metadata>;
}

export {};
