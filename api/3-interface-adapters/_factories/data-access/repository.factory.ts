
import SessionRepository from "@adapter-internal/data-access/neo4j/repositories/session.repository";
import UserRepository from "@adapter-internal/data-access/neo4j/repositories/user.repository";
import { ISessionDataAccess } from "@usecases/data-access/session.boundaries";
import { IUserDataAccess } from "@usecases/data-access/user.boundaries";

const dataAccessFactory = {
    userRepository: (): IUserDataAccess => {
        return new UserRepository()
    },
    
    sessionRepository: (): ISessionDataAccess => {
        return new SessionRepository()
    }
}

export default dataAccessFactory;