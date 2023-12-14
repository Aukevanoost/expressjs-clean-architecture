import { ISanitizer } from '@usecases/security';


export type ISecuritySessionDTO = {token?: string};

/**
 * Adapter: Security.Sanitization
 */ 
export type ISessionInputSanitizer = ISanitizer<ISecuritySessionDTO>
