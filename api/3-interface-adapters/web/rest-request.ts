import { User } from "@entities/user.model"

export type RestRequest = {
    body: any,
    query: any,
    params: any,
    ip: string,
    user?: {id: string, email: string};
    method: string,
    headers: {
        authorization?: string,
        range: [number,number],
    }
}