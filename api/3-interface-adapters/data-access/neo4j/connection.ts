import { driver, Driver, auth, Session } from 'neo4j-driver';
import Environment from 'util/environment';

const USER = Environment.get('NEO4J_USER').orThrow("INVALID DATABASE USERNAME");
const PASSWD = Environment.get('NEO4J_PASSWORD').orThrow("INVALID DATABASE PASSWORD");
const URL = Environment.get('NEO4J_URI').orThrow("INVALID DATABASE URI");

const connection: Driver = driver(
    URL, 
    auth.basic(USER, PASSWD), 
    { disableLosslessIntegers: true }
); 

connection.getServerInfo()
    .then(_ => {
        console.warn('> neo4j connection estabilished')
    })
    .catch(_ => {
        console.error('> Failed to establish neo4j connection')
    })

export default function createSession(): Session {
    return connection.session();
}
