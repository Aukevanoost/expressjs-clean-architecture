import { Session } from "@entities/session.model";
import { DatabaseRecord, ONE_RECORD } from "@usecases/data-access";
import { SessionDAO } from "@usecases/data-access/dao/session.dao";
import { ISessionDataAccess } from "@usecases/data-access/session.boundaries";
import { IJWTBoundary, IJWTBoundaryOutput } from "@usecases/security";
import { ISessionInputSanitizer } from "@usecases/security/session.boundaries";
import { UseCase } from "@usecases/usecases";
import { ISignOutUseCaseInput, ISignOutUseCaseFactory, ISignOutUseCaseOutput } from "@usecases/usecases/auth.contracts";
import { AuthenticationError } from "util/errors/authentication.error";
import { ValidationError } from "util/errors/validation.error";

const resolveSignOutUseCase: ISignOutUseCaseFactory = (
    sanitization: ISessionInputSanitizer,
    jwtService: IJWTBoundary,
    sessionDataAccess: ISessionDataAccess,
    presenter,
) => {
    /**
     * UseCase: sign-out
     * @param useCaseInput 
     * @returns viewmodel
     */
    const signOutUseCase = (useCaseInput: ISignOutUseCaseInput) => {

        const outputBoundary = UseCase.of(useCaseInput)
            .then(sanitizeRefreshToken)
            .then(validateRefreshToken)
            .then(getActiveTokenSession)
            .then(updateCurrentSession);
        
        return presenter(outputBoundary);
    }

    const sanitizeRefreshToken = (session: ISignOutUseCaseInput) 
        : Promise<ISignOutUseCaseInput> => {
            return sanitization.clean(session);
        }
        
    const validateRefreshToken = ({token}: ISignOutUseCaseInput)
        : Promise<IJWTBoundaryOutput> =>  {
            return new Promise((resolve, reject) => {
                if(!token) reject(new ValidationError("'refresh_token' is not provided"));
                resolve({token});
            })
                .then(_ => jwtService.verify(token, {type: 'refresh_token'}));
        }

    const getActiveTokenSession = (refresh_token: IJWTBoundaryOutput)
        : Promise<Session> => {
            return sessionDataAccess
                .get(ONE_RECORD, {refresh_token: refresh_token.body.id})
                .then(dao => dao.results)
                .then((session:DatabaseRecord<SessionDAO>[]) => {
                    if(!session[0]) throw new AuthenticationError("No active refresh token found.");  
                    return session[0];
                })
        }

    const updateCurrentSession = (session: Session)
        : Promise<ISignOutUseCaseOutput> => {
            return sessionDataAccess.update(session.id, { expires: Date.now() / 1000 })
        }
    return signOutUseCase;
};

export default resolveSignOutUseCase; 