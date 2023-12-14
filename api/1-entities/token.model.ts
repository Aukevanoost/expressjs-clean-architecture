export interface Tokens {
    access_token: Token;
    refresh_token: Token;
}

export interface Token {
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