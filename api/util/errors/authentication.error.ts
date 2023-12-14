import { AppErrorTypes, ApplicationError } from './index';

export class AuthenticationError extends Error implements ApplicationError {
    errorType: AppErrorTypes = "authentication";
    
    constructor(message:string) {
        super(message);
    }
}