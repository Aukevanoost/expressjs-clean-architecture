import { DatabaseFilter, DatabaseRecord, IDataAccessBoundary, RangedRecordList } from ".";
import { SessionDAO } from "./dao/session.dao";
import { UserDAO } from "./dao/user.dao";

export type ISessionDataAccessOutput = DatabaseRecord<SessionDAO>

export type ISessionDataAccessInput = DatabaseFilter<SessionDAO>;

export interface ISessionDataAccess extends IDataAccessBoundary {    
    get(range: [number,number], filter?: DatabaseFilter<ISessionDataAccessInput>)
        : Promise<RangedRecordList<ISessionDataAccessOutput>>;
    
    historyByUser(range: [number,number], userID: string): Promise<RangedRecordList<ISessionDataAccessOutput>>;
    create(session: {access_token: string, refresh_token: string, ip:string}): Promise<{access_token: string, refresh_token: string, ip:string, id: string}>;
    update(sessionID: string, values: Partial<SessionDAO>) : Promise<DatabaseRecord<SessionDAO>>;
    assignToUser(user: DatabaseRecord<UserDAO>, session: DatabaseRecord<SessionDAO>): Promise<ISessionDataAccessOutput>;
}
