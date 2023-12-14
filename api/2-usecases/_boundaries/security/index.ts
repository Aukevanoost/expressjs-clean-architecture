
/**
 * Plugin: Security.Hashing
 */ 
export interface IHashingBoundary {
    hash(passwd: string): Promise<string>;
    compare(passwd: string, hash: string): Promise<boolean>;
}


/**
 * Adapter: Security.Token
 */ 
export interface IJWTBoundaryInput { 
    user: string,
    email: string,
    type: 'access_token'|'refresh_token',
    duration: number,
}

export interface IJWTBoundaryOutput { 
    token: string,
    body: {
        user: string,
        id: string,
        email: string,
        expires: number,
        issued: number,
        issuer: string,
        type: 'access_token'|'refresh_token',
    }
}

export interface IJWTBoundary {
    generateAccessToken(identity: {user: string, email: string}): Promise<IJWTBoundaryOutput>;
    generateRefreshToken(identity: {user: string, email: string}): Promise<IJWTBoundaryOutput>;
    verify(token?: string, props?: Partial<IJWTBoundaryInput>): Promise<IJWTBoundaryOutput>;
    isExpired(expires: number): boolean;
}

/**
 * Adapter: Security.Sanitization
 */ 
export type ISanitizer<TUseCaseInput> =  { clean: (input: TUseCaseInput) => Promise<TUseCaseInput> }

/**
 * Adapter: Security.Validation
 */ 
export type IValidator<Tentity> =  { check: (input: Tentity) => Promise<Required<Tentity>> }

