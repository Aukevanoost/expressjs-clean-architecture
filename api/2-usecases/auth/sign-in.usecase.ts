import { Session } from "@entities/session.model";
import { Tokens } from "@entities/token.model";
import { User } from "@entities/user.model";

import { DatabaseRecord } from "@usecases/data-access";
import { SessionDAO } from "@usecases/data-access/dao/session.dao";
import { UserDAO } from "@usecases/data-access/dao/user.dao";
import { ISessionDataAccess, ISessionDataAccessOutput } from "@usecases/data-access/session.boundaries";
import { IUserDataAccess } from "@usecases/data-access/user.boundaries";
import { IHashingBoundary, IJWTBoundary, IJWTBoundaryOutput } from "@usecases/security";
import { ISecurityUserDTO, IUserInputSanitizer } from "@usecases/security/user.boundaries";
import { UseCase } from "@usecases/usecases";
import { ISignInUseCaseFactory, ISignInUseCaseInput, ISignInUseCaseOutput } from "@usecases/usecases/auth.contracts";

import { AuthenticationError } from "util/errors/authentication.error";
import { DataAccessError } from "util/errors/data-access.error";

const resolveSignInUseCase: ISignInUseCaseFactory = (
    sanitizationService: IUserInputSanitizer,
    hashingService: IHashingBoundary,
    jwtService: IJWTBoundary,
    userDataAccess: IUserDataAccess,
    sessionDataAccess: ISessionDataAccess,
    userPresenter,
) => {
    const AUTH_LOGIN_ERROR = new AuthenticationError("Invalid email/password");

    /**
     * UseCase: sign-in
     * @param useCaseInput 
     * @returns viewmodel
     */
    const signInUseCase = (useCaseInput: ISignInUseCaseInput) => {

        const outputBoundary = UseCase.of(useCaseInput)
            .then(sanitizeUserInput)
            .then(validateUserInput)
            .then(validateCredentials)
            .then(generateTokensForSession)
            .then(mapToUserSession)
            .then(persistNewUserSession);
        
        return userPresenter(outputBoundary);
    }

    const validateUserInput = (useCaseInput: ISignInUseCaseInput)
        : Promise<ISignInUseCaseInput> => {
            return new Promise((resolve, reject) => {
                if(!useCaseInput.email || !useCaseInput.password) reject(AUTH_LOGIN_ERROR);
                return resolve(useCaseInput);
            });
        }

    const sanitizeUserInput = (user: ISignInUseCaseInput) 
        : Promise<ISignInUseCaseInput> => {
            return sanitizationService.clean(user);
        }

    const validateCredentials = (useCaseInput: ISignInUseCaseInput)
        : Promise<{user:User, ip: string}> => {
            return checkIfUserExists(useCaseInput)
                .then(user => checkIfPasswordIsCorrect(useCaseInput, user))
                .then(user => ({user, ip: useCaseInput.ip ?? 'NOT_AVAILABLE' }))
        }

    const generateTokensForSession = ({user, ip}: {user:User, ip: string})
        : Promise<{user: User, session: {ip:string}, tokens: Tokens}> => {
            return Promise.all([
                jwtService.generateAccessToken({user: user.name, email: user.email}), 
                jwtService.generateRefreshToken({user: user.name, email: user.email})
            ]).then(([access_token, refresh_token]) => ({ user, session: {ip}, tokens: {access_token, refresh_token} }))
        }

    const mapToUserSession = ({user, session, tokens}: {user: User, session: {ip:string}, tokens: Tokens})
        : Promise<{user: User, session: SessionDAO, tokens: Tokens}> => {
            return jwtService
                .verify(tokens.refresh_token.token)
                .then((({body}: IJWTBoundaryOutput) => ({
                    user, 
                    session: {
                        ip: session.ip,
                        access_token: tokens.access_token.body.id,
                        refresh_token: tokens.refresh_token.body.id,
                        expires: body.expires, 
                        issued: body.issued
                    },
                    tokens
                })))
        }

    const persistNewUserSession = (update: {user: User, session: SessionDAO, tokens: Tokens})
        : Promise<ISignInUseCaseOutput> => {
            return userDataAccess
                .getWithLastSession({user: update.user})
                .then(([dao]: {session: DatabaseRecord<SessionDAO>}[]) => {
                    return !!dao && !jwtService.isExpired(dao.session.expires)
                        ? updateActiveUserSession(dao.session.id, update.session)
                        : createNewUserSession(update.user, update.session)
                })
                .then((session) => ({user: update.user, session, tokens: update.tokens}))
        }


    const checkIfUserExists = (filter: ISignInUseCaseInput)
        : Promise<User> => {
            return userDataAccess
                .get({email: filter.email})
                .then(matchingUsers => new Promise(resolve => {
                    if(matchingUsers.length < 1) throw AUTH_LOGIN_ERROR;
                    if(matchingUsers.length > 1) throw new DataAccessError("Multiple users have this email address!");
                    return resolve(mapDAOToUser(matchingUsers[0]));
                }));
        }
    
    const mapDAOToUser = (dao: DatabaseRecord<UserDAO>)
        : User => {
            return dao
        }

    const checkIfPasswordIsCorrect = (useCaseInput: ISignInUseCaseInput, user: User)
        : Promise<User> => {
            return hashingService
                .compare(useCaseInput.password ?? '', user.password)
                .then(passwordOk => new Promise((resolve, reject) => {    
                    if(!passwordOk) reject(AUTH_LOGIN_ERROR)
                    return resolve(user);
                }));
        }

    const updateActiveUserSession = (prevSessionID: string, {access_token, refresh_token, expires}: SessionDAO) 
        : Promise<DatabaseRecord<SessionDAO>> => {
            return sessionDataAccess.update(prevSessionID, {access_token, refresh_token, expires})
        }

    const createNewUserSession = (user: DatabaseRecord<UserDAO>, session: SessionDAO) 
        : Promise<ISessionDataAccessOutput> => {
            return sessionDataAccess
                .create(session)
                .then(savedSession => ({user, session: {...session, ...savedSession}}))
                .then(({user, session}) => sessionDataAccess.assignToUser(user, session))
        }
        
    return signInUseCase;
};

export default resolveSignInUseCase; 