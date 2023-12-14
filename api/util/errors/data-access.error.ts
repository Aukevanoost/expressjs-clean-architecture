import { AppErrorTypes, ApplicationError } from './index';

export class DataAccessError extends Error implements ApplicationError {
    errorType: AppErrorTypes = "data-access";
    
    constructor(message:string) {
        super(message);
    }
}