import { DatabaseFilter } from '@usecases/data-access';
import { IUserDataAccess } from '@usecases/data-access/user.boundaries';
import { Session } from 'neo4j-driver';
import createSession from "../connection";
import { Neo4jFilterMapper } from '../mappers/filter.mapper';
import { UserDAO } from '@usecases/data-access/dao/user.dao';
import { DatabaseRecord } from '@usecases/data-access';
import { SessionDAO } from '@usecases/data-access/dao/session.dao';
import { Neo4jNodeMapper } from '../mappers/node.mapper';
import { Neo4jRelationshipMapper } from '../mappers/relationship.mapper';


export default class UserRepository implements IUserDataAccess {

    private filterMapper = Neo4jFilterMapper.of<UserDAO>();
    
    private userMapper = Neo4jNodeMapper.of<UserDAO>();
    private sessionMapper = Neo4jRelationshipMapper.of<UserDAO, SessionDAO>();

    constructor() {}

    public get(filter?: DatabaseFilter<UserDAO>) {
        const session: Session = createSession();

        return session.executeRead(txc => (
            txc.run(`MATCH (u:User) ${this.filterMapper.where("u", filter)} RETURN u`)
        ))
            .then((results) => this.userMapper.toList("u", results))
            .finally(() => session.close())
    }

    
    public getWithLastSession(filter?: {user?: DatabaseFilter<UserDAO>, session?: DatabaseFilter<SessionDAO>}): Promise<{user: DatabaseRecord<UserDAO>, session: DatabaseRecord<SessionDAO>}[]> { 
        const session: Session = createSession();

        const sessionFilter = Neo4jFilterMapper.of<DatabaseRecord<SessionDAO>>().where("s", filter?.session, ['access_token','refresh_token','ip','id']);
        const relationFilter = Neo4jFilterMapper.of<SessionDAO>().daoFilter(filter?.session, ['expires','issued']);
        const userFilter = Neo4jFilterMapper.of<UserDAO>().where("u", filter?.user);

        return session.executeRead(txc => (
            txc.run(`MATCH r=(u:User)-[:ISSUED_TO ${relationFilter}]->(s:Session) ${sessionFilter} ${userFilter} RETURN r`)
        ))
            .then(neo4jResult => this.sessionMapper.toList('r',neo4jResult))
            .then(relationships => relationships.map(([user, session]) => ({user, session})))
            .finally(() => session.close())
    }


    public getFromSession(filter?: DatabaseFilter<SessionDAO>) { 
        const session: Session = createSession();

        const sessionFilter = Neo4jFilterMapper.of<DatabaseRecord<SessionDAO>>().where("s", filter, ['access_token','refresh_token','ip','id']);
        const relationFilter = Neo4jFilterMapper.of<SessionDAO>().daoFilter(filter, ['expires','issued']);
 
        return session.executeRead(txc => (
            txc.run(`MATCH (u:User)-[:ISSUED_TO ${relationFilter}]->(s:Session) ${sessionFilter} RETURN u`)
        ))
            .then(results => this.userMapper.toDAO("u", results))
            .finally(() => session.close())
    }


    public add(user: UserDAO): Promise<DatabaseRecord<UserDAO>> {
        const session: Session = createSession();

        return session.executeWrite(txc => (
            txc.run('CREATE (u:User {name: $name, email: $email, password: $password}) RETURN u',user)
        ))
            .then(results => this.userMapper.toDAO("u", results))
            .finally(() => session.close())
        }
}
