import { ISanitizer, IValidator } from '@usecases/security';


export type ISecurityUserDTO = {name?: string, email?: string, password?: string, ip?: string};

/**
 * Adapter: Security.Sanitization
 */ 
export type IUserInputSanitizer = ISanitizer<ISecurityUserDTO>

/**
 * Adapter: Security.Validation
 */ 
export type IUserInputValidator = IValidator<ISecurityUserDTO>
