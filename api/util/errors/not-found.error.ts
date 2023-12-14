import { AppErrorTypes, ApplicationError } from './index';

export class NotFoundError extends Error implements ApplicationError {
    errorType: AppErrorTypes = "not-found";
    
    constructor(message:string) {
        super(message);
    }
}