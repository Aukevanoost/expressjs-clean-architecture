
export type AppErrorTypes = "validation"|"data-access"|"authentication"|"not-found";

export interface ApplicationError extends Error {
    errorType: AppErrorTypes;
}

