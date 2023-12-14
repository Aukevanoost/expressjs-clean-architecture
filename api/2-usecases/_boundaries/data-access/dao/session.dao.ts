export interface SessionDAO {
    access_token: string;
    refresh_token: string;
    issued: number;
    expires: number;
    ip: string;
}