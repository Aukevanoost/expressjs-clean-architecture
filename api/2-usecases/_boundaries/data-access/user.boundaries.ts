import { DatabaseFilter, DatabaseRecord } from './index';
import { IDataAccessBoundary } from ".";
import { UserDAO } from './dao/user.dao';
import { SessionDAO } from './dao/session.dao';

export interface IUserDataAccess extends IDataAccessBoundary {
    get(e?: Partial<DatabaseFilter<UserDAO>>): Promise<DatabaseRecord<UserDAO>[]>;
    getWithLastSession(filter?: {user?: DatabaseFilter<UserDAO>, session?: DatabaseFilter<SessionDAO>}): Promise<{user: DatabaseRecord<UserDAO>, session: DatabaseRecord<SessionDAO>}[]>;
    getFromSession(filter?: DatabaseFilter<SessionDAO>) : Promise<DatabaseRecord<UserDAO>>;
    add(e: UserDAO): Promise<DatabaseRecord<UserDAO>>;
}