declare global {
    type HasUuid = { uuid: string };
    type Model<T = object> = { id: number; created_at: string; updated_at: string } & T;
    type DeletableModel<T = object> = { deleted_at: string } & Model<T>;

    type APIError<D extends string = string> = { message: string; errors?: Record<D, string[]> };

    type AsyncState = 'loading' | 'error' | 'success';
}

export {};
