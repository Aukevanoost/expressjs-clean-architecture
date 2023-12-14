import { AppErrorTypes, ApplicationError } from './index';

export class ValidationError extends Error implements ApplicationError {
    errorType: AppErrorTypes = "validation";
    
    constructor(message:string) {
        super(message);
    }
}