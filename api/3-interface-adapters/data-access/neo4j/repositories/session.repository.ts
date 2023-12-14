import { ISessionDataAccess, ISessionDataAccessOutput } from '@usecases/data-access/session.boundaries';
import { Session } from 'neo4j-driver';
import createSession from "../connection";
import { DatabaseFilter, DatabaseRecord } from '@usecases/data-access';
import { SessionDAO } from '@usecases/data-access/dao/session.dao';
import { UserDAO } from '@usecases/data-access/dao/user.dao';
import { Neo4jFilterMapper } from '../mappers/filter.mapper';
import { DataAccessError } from 'util/errors/data-access.error';
import { Neo4jRelationshipMapper } from '../mappers/relationship.mapper';
import { addSkipAndLimit, rangeMapper } from '../mappers/range.mapper';

export default class SessionRepository implements ISessionDataAccess {
    
    private filterMapper = Neo4jFilterMapper.of<SessionDAO>();
    private sessionMapper = Neo4jRelationshipMapper.of<UserDAO, SessionDAO>();

    constructor() {}

    public get(range: [number,number], filter?: DatabaseFilter<SessionDAO>) { 
        const session: Session = createSession();
        const entityFilter = this.filterMapper.daoFilter(filter, ['access_token','refresh_token', 'ip']);
        const relationFilter = this.filterMapper.daoFilter(filter, ['expires','issued']);

        return session.executeRead(txc => (
            txc.run(`
                MATCH s=(User)-[ISSUED_TO ${relationFilter}]->(session:Session ${entityFilter}) 
                RETURN s 
                ${addSkipAndLimit(range)}
            `)
        ))
            .then(neo4jResult => this.sessionMapper.toList("s",neo4jResult))
            .then(relationships => relationships.map(([_, session]) => session))
            .then(results => ({results, range: rangeMapper(range, results.length)}))
            .finally(() => session.close())
    }

    public create({access_token, refresh_token, ip}: {access_token: string, refresh_token: string, ip:string}): Promise<{access_token: string, refresh_token: string, ip:string, id: string}> {
        const neo4jSession: Session = createSession();

        return neo4jSession.executeWrite(txc => txc.run(
            'CREATE (s:Session {access_token: $access_token, refresh_token: $refresh_token, ip: $ip}) return s',
            { access_token, refresh_token, ip}
        ))
            .then(neo4jResult => this.mapToEntity(neo4jResult))
            .finally(() => neo4jSession.close())
    }

    public update(sessionID: string, session: Partial<SessionDAO>): Promise<DatabaseRecord<SessionDAO>> {
        const neo4jSession: Session = createSession();

        const newSessionProps = this.filterMapper.set('session', session, ['access_token', 'refresh_token', 'ip']);
        const newIssuedProps = this.filterMapper.set('i', session, ['issued', 'expires']);

        return neo4jSession.executeWrite(txc => txc.run(
            `MATCH s=(User)-[i:ISSUED_TO]->(session:Session) ` +
            `WHERE elementId(session) = $id ` + 
            `${newSessionProps} ${newIssuedProps} RETURN s`,
            {id: sessionID}
        ))
            .then(neo4jResult => this.sessionMapper.toDAO("s",neo4jResult))
            .then(([_, session]) => session)
            .finally(() => neo4jSession.close())
    }

    public assignToUser(userDAO: DatabaseRecord<UserDAO>, sessionDAO: DatabaseRecord<SessionDAO>) {
        const neo4jSession: Session = createSession();

        return this.attachSessionRelationship(neo4jSession, userDAO, sessionDAO)
            .finally(() => neo4jSession.close())
    }

    private attachSessionRelationship(neo4jSession: Session, user: DatabaseRecord<UserDAO>, {id, issued, expires}: DatabaseRecord<SessionDAO>) {
        return neo4jSession.executeWrite(txc => txc.run(
            'MATCH (user:User), (session:Session) WHERE elementId(user) = $userID AND elementId(session) = $sessionID ' +  
            'OPTIONAL MATCH (user)-[or:ISSUED_TO]-(os:Session) ' + 
            'CREATE s = (user)-[:ISSUED_TO {issued: $issued, expires: $expires}]->(session) ' + 
            'FOREACH (old_link IN CASE WHEN os IS NOT NULL THEN [os] ELSE [] END | ' + 
            ' CREATE (session)-[nr:ISSUED_AFTER{issued: or.issued, expires: or.expires}]->(os) ' + 
            ' DELETE or' + 
            ') ' + 
            'RETURN s;',
            { userID: user.id, sessionID: id, issued, expires } 
        ))
            .then(neo4jResult => this.sessionMapper.toDAO("s",neo4jResult))
            .then(([_, session]) => session)
    }

    private mapToEntity(neo4jResult: any): {access_token: string, refresh_token: string, ip:string, id: string} {
        if(!neo4jResult.records[0]) throw new DataAccessError("Session not found");
        const props =  neo4jResult.records[0].get('s').properties;
        const id = neo4jResult.records[0].get('s').elementId;
        return {...props, id};
    }

    historyByUser(range: [number,number], userID: string) {
        const neo4jSession: Session = createSession();

        return neo4jSession.executeWrite(txc => txc.run(`
            MATCH s=(u:User)-[*]->(:Session)
            WHERE elementId(u) = $userID 
            RETURN s
            ${addSkipAndLimit(range)}`,
            { userID }
        ))
            .then(neo4jResult => this.sessionMapper.toChain("s",neo4jResult))
            .then(relationships => relationships.map(([_, session]) => session))
            .then(results => ({results, range: rangeMapper(range, results.length)}))
            .finally(() => neo4jSession.close())
    }
}
